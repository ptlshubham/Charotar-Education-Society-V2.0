// The CES Arcade shell: screens, HUD, dialogs, input and the fixed-step driver.
// The simulation itself lives in engine.ts and the pixels in render.ts — this
// file owns everything the browser touches so those two stay deterministic.

import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, computed, signal } from '@angular/core';
import {
  createWorld, drainEvents, NO_INPUT, parseSolution, snapshot, step, teleport,
  type GameEvent, type GameEventType, type Input, type Snapshot, type Status, type World,
} from './engine';
import { draw } from './render';
import { isRich, levels, PHYS, RENDER_SCALE, TICK_HZ, VIEW_H, VIEW_W, type Level } from './levels';
import { loadSheets, SPRITES, JUNGLE_BACKDROP, type AssetIssue, type AssetReport, type Sheets } from './sprites';
import { atlasIcon } from './atlas';
import { ARCADE_STYLES } from './themes';

export interface ArcadeHarness {
  version: 1;
  pause(): void; resume(): void;
  run(n: number): void;
  advance(ms: number): number;
  setInput(patch: Partial<Input>): void; input(): Input;
  reset(levelIndex: number, at?: [number, number]): void;
  state(): Snapshot; drainEvents(): GameEvent[]; render(): void;
  ready(): boolean; assetReport(): AssetReport; level(): Level;
  playSolution(levelIndex: number): Snapshot;
  recordStart(): void; recordStop(): string;
  settings(): { parallax: boolean };
}

// Assigning to window is a TS2339 under `types: []` without this declaration.
declare global {
  interface Window { __cesArcade?: ArcadeHarness }
}

type Screen = 'menu' | 'play';
type Dialog = 'none' | 'pause' | 'clear' | 'over';
type Key = 'left' | 'right' | 'jump' | 'power';
interface HudArt { heart: string; coin: string; portrait: string; star: string }
interface Hud { coins: number; coinTotal: number; lives: number; score: number; levelName: string; health: number; stars: number; gems: number; seconds: number }

const STORAGE_KEY = 'ces-arcade-v1';
const TICK_MS = 1000 / TICK_HZ;

const KEYS: Readonly<Record<string, Key | undefined>> = {
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ArrowUp: 'jump', w: 'jump', W: 'jump', ' ': 'jump', Spacebar: 'jump',
  x: 'power', X: 'power', k: 'power', K: 'power',
};

const BEEPS: Readonly<Partial<Record<GameEventType, readonly number[]>>> = {
  jump: [523.25],
  coin: [1046.5],
  stomp: [392, 587.33],
  hurt: [196, 130.81],
  clear: [523.25, 659.25, 783.99, 1046.5],
};

// The token alphabet parseSolution() reads. Left and right together have no
// token because the engine only ever uses their difference, so they collapse to
// the neutral token and replay identically.
const maskCode = (input: Input): string => {
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (input.power) return input.jump ? (dir > 0 ? ')' : dir < 0 ? '(' : '!') : dir > 0 ? ']' : dir < 0 ? '[' : '*';
  if (input.jump) return dir > 0 ? '}' : dir < 0 ? '{' : '^';
  return dir > 0 ? '>' : dir < 0 ? '<' : '.';
};

@Component({
  selector: 'arcade-root',
  templateUrl: './arcade.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArcadeComponent implements OnDestroy {
  readonly levels = levels;
  readonly screen = signal<Screen>('menu');
  readonly dialog = signal<Dialog>('none');
  readonly levelIndex = signal(0);
  readonly hud = signal<Hud>({ coins: 0, coinTotal: 0, lives: PHYS.startLives, score: 0, levelName: levels[0].name, health: 3, stars: 2, gems: 0, seconds: 300 });
  readonly assetIssues = signal<readonly AssetIssue[]>([]);
  readonly storageAvailable = signal(true);
  readonly soundEnabled = signal(false);
  readonly best = signal(0);
  readonly cleared = signal<readonly string[]>([]);
  readonly ready = signal(false);
  // True while a level's backdrop decodes, so play never opens on a flat canvas.
  readonly entering = signal(false);
  readonly level = computed(() => levels[this.levelIndex()]);
  readonly themeStyles = computed(() => ARCADE_STYLES[this.level().theme]);
  readonly lastLevel = computed(() => this.levelIndex() === levels.length - 1);
  readonly lifeSlots = computed(() => Array.from({ length: isRich(this.level().theme) ? this.hud().health : this.hud().lives }, (_, i) => i));
  // HUD icons cut from each rich theme's atlas once the sheets load.
  readonly themeArt = signal<Partial<Record<Level['theme'], HudArt>>>({});
  readonly hudArt = computed(() => this.themeArt()[this.level().theme]);

  private world: World = createWorld(0);
  private sheets: Sheets = {};
  private report: AssetReport = { ok: false, issues: [], scale: {} };
  private backdrop: HTMLImageElement | null = null;
  private readonly backdrops = new Map<string, HTMLImageElement>();
  private ctx: CanvasRenderingContext2D | null = null;
  private parallax = true;

  // Held buttons are plain fields, never signals: they change on every frame and
  // a zoneless app would run change detection for each one.
  private held: Input = { ...NO_INPUT };
  // A tap whose press and release both fall between two animation frames leaves
  // no trace in `held`, so any press also latches here for the next tick batch.
  private jumpQueued = false;
  private powerQueued = false;

  private raf = 0;
  private acc = 0;
  private last = 0;
  private runLives: number = PHYS.startLives;
  private runScore = 0;
  private entryLives: number = PHYS.startLives;
  private entryScore = 0;
  private pending: GameEvent[] = [];
  private recording = false;
  private recorded: string[] = [];
  private mirrored = '';
  private audio?: AudioContext;

  constructor() {
    this.parallax = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.load();
    this.mirror();
    void loadSheets().then(({ sheets, report }) => {
      this.sheets = sheets;
      this.report = report;
      this.assetIssues.set(report.issues);
      const icon = (slot: string, index: number): string => {
        const s = SPRITES.find(x => x.slot === slot)!;
        return sheets[slot] ? atlasIcon(sheets, s, index, report.scale[slot]) : '';
      };
      const themeArt: Partial<Record<Level['theme'], HudArt>> = {};
      for (const level of levels) {
        const jungle = level.theme === 'jungle' || level.theme === 'canopy';
        themeArt[level.theme] = {
          heart: icon('jungle-items', 0),
          portrait: icon(jungle ? 'jungle-items' : `${level.theme}-player`, jungle ? 7 : 0),
          coin: icon(jungle ? 'coin' : `${level.theme}-coin`, 0),
          star: icon(jungle ? 'jungle-rewards' : `${level.theme}-rewards`, 2),
        };
      }
      this.themeArt.set(themeArt);
      this.ready.set(true);
    });
    window.__cesArcade = {
      version: 1,
      pause: () => this.stopLoop(),
      resume: () => this.startLoop(),
      run: n => this.run(n),
      advance: ms => {
        const n = Math.min(Math.floor(ms / TICK_MS), PHYS.maxCatchUp);
        this.run(n);
        return n;
      },
      setInput: patch => {
        if (patch.left !== undefined) this.held.left = patch.left;
        if (patch.right !== undefined) this.held.right = patch.right;
        // Latch exactly as a real press does, so run(1) after setInput jumps.
        if (patch.jump !== undefined) { this.held.jump = patch.jump; if (patch.jump) this.jumpQueued = true; }
        if (patch.power !== undefined) { this.held.power = patch.power; if (patch.power) this.powerQueued = true; }
      },
      input: () => this.takeMask(),
      reset: (levelIndex, at) => {
        this.startLevel(levelIndex, PHYS.startLives, 0);
        this.screen.set('play');
        this.dialog.set('none');
        if (at) teleport(this.world, at[0], at[1]);
        this.mirror();
        this.paint();
      },
      state: () => snapshot(this.world),
      drainEvents: () => this.pending.splice(0),
      render: () => this.paint(),
      ready: () => this.ready(),
      assetReport: () => this.report,
      level: () => this.world.level,
      playSolution: index => this.playSolution(index),
      recordStart: () => { this.recording = true; this.recorded = []; },
      recordStop: () => this.recordStop(),
      settings: () => ({ parallax: this.parallax }),
    };
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.clearMask();
    void this.audio?.close().catch(() => {});
    delete window.__cesArcade;
  }

  // --- screens ------------------------------------------------------------

  play(index: number): void {
    this.entering.set(true);
    void this.loadBackdrop(levels[index]).then(() => {
      this.startLevel(index, PHYS.startLives, 0);
      this.entering.set(false);
      this.screen.set('play');
      this.focusHeading();
      this.startLoop();
    });
  }

  openMenu(): void {
    this.stopLoop();
    this.clearMask();
    this.ctx = null;
    this.screen.set('menu');
    this.focusHeading();
  }

  exit(): void {
    this.stopLoop();
    window.location.hash = '/';
  }

  // --- dialogs ------------------------------------------------------------

  togglePause(): void {
    if (this.dialog() === 'pause') this.dismiss();
    else if (this.screen() === 'play' && this.dialog() === 'none') this.openDialog('pause');
  }

  dismiss(): void {
    const el = this.dialogEl(this.dialog());
    this.dialog.set('none');
    this.clearMask();
    el?.close();
    if (this.screen() === 'play' && this.world.status === 'play') this.startLoop();
  }

  // Escape closes a native dialog without going through dismiss(); the guard
  // makes the handler a no-op for the closes an action button already handled.
  dialogClosed(): void {
    if (this.dialog() === 'none') return;
    this.dialog.set('none');
    this.clearMask();
    if (this.screen() === 'play' && this.world.status === 'play') this.startLoop();
  }

  restartLevel(): void {
    this.dismiss();
    this.startLevel(this.levelIndex(), this.entryLives, this.entryScore);
    this.startLoop();
  }

  nextLevel(): void {
    const next = this.levelIndex() + 1;
    if (next >= levels.length) { this.quitToMenu(); return; }
    this.dismiss();
    this.startLevel(next, this.runLives, this.runScore);
    this.startLoop();
  }

  retryLevel(): void {
    this.dismiss();
    this.startLevel(this.levelIndex(), PHYS.startLives, 0);
    this.startLoop();
  }

  quitToMenu(): void {
    this.dismiss();
    this.openMenu();
  }

  // --- input --------------------------------------------------------------

  @HostListener('window:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    // Handlers are window-level, so an open dialog is still screen() === 'play'.
    // Without this gate Space both presses a dialog button and latches a jump.
    if (this.screen() !== 'play' || this.dialog() !== 'none') return;
    if (event.key === 'Escape') { event.preventDefault(); this.openDialog('pause'); return; }
    const key = KEYS[event.key];
    if (!key) return;
    event.preventDefault();
    if (event.repeat) return;
    this.held[key] = true;
    if (key === 'jump') this.jumpQueued = true;
    if (key === 'power') this.powerQueued = true;
  }

  // Releases are never gated: a key held while a dialog opened must not stick.
  @HostListener('window:keyup', ['$event'])
  keyUp(event: KeyboardEvent): void {
    const key = KEYS[event.key];
    if (key) this.held[key] = false;
  }

  @HostListener('window:blur')
  blurred(): void {
    this.clearMask();
  }

  press(key: Key, event: PointerEvent): void {
    event.preventDefault();
    // Pointer capture keeps the release on this button even if the finger slides.
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.held[key] = true;
    if (key === 'jump') this.jumpQueued = true;
    if (key === 'power') this.powerQueued = true;
  }

  release(key: Key, event: PointerEvent): void {
    event.preventDefault();
    this.held[key] = false;
  }

  // --- driver -------------------------------------------------------------

  private readonly frame = (now: number): void => {
    this.raf = requestAnimationFrame(this.frame);
    this.acc += Math.min(now - this.last, TICK_MS * PHYS.maxCatchUp);
    this.last = now;
    const input = this.takeMask();
    let n = 0;
    while (this.acc >= TICK_MS && n < PHYS.maxCatchUp) { this.stepOnce(input); this.acc -= TICK_MS; n++; }
    if (n) { this.jumpQueued = false; this.powerQueued = false; this.mirror(); this.emit(); }
    this.paint();
  };

  private startLoop(): void {
    if (this.raf !== 0) return;
    if (!this.ctx) this.attach();
    if (!this.ctx) {
      // Zoneless change detection may not have rendered the canvas yet. Parking
      // the retry in `raf` keeps stopLoop() able to cancel it and stops a second
      // caller from starting a rival chain.
      if (this.screen() === 'play') this.raf = requestAnimationFrame(() => { this.raf = 0; this.startLoop(); });
      return;
    }
    this.last = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private stopLoop(): void {
    if (this.raf !== 0) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private stepOnce(input: Input): void {
    step(this.world, input);
    if (this.recording) this.recorded.push(maskCode(input));
  }

  private run(n: number): void {
    if (n <= 0) return;
    const input = this.takeMask();
    for (let i = 0; i < n; i++) this.stepOnce(input);
    this.jumpQueued = false;
    this.powerQueued = false;
    // Mirroring here too, or the HUD reads stale while the loop is paused for tests.
    this.mirror();
    this.emit();
  }

  private takeMask(): Input {
    return { left: this.held.left, right: this.held.right, jump: this.held.jump || this.jumpQueued, ...(this.held.power || this.powerQueued ? { power: true } : {}) };
  }

  private clearMask(): void {
    this.held = { ...NO_INPUT };
    this.jumpQueued = false;
    this.powerQueued = false;
  }

  private paint(): void {
    // Lazily attach so a harness render() straight after a reset() still draws.
    if (!this.ctx) this.attach();
    if (this.ctx) draw(this.ctx, this.world, this.sheets, this.report, this.backdrop, this.parallax);
  }

  // Writes the hud signal only on a real change — a write per frame would queue
  // 60 change-detection passes a second in this zoneless app.
  private mirror(): void {
    const w = this.world;
    const seconds = Math.max(0, Math.ceil(w.timeTicks / TICK_HZ));
    const key = `${w.coins}/${w.lives}/${w.score}/${w.status}/${w.health}/${w.stars}/${w.gems}/${seconds}`;
    if (key === this.mirrored) return;
    this.mirrored = key;
    this.hud.set({ coins: w.coins, coinTotal: w.coinTotal, lives: w.lives, score: w.score, levelName: w.level.name, health: w.health, stars: w.stars, gems: w.gems, seconds });
  }

  private emit(): void {
    const events = drainEvents(this.world);
    if (!events.length) return;
    for (const event of events) {
      this.beep(event.type);
      if (event.type === 'clear') this.finishLevel();
      else if (event.type === 'gameover') this.endRun();
    }
    this.pending.push(...events);
    if (this.pending.length > 512) this.pending.splice(0, this.pending.length - 512);
  }

  // --- run state ----------------------------------------------------------

  private startLevel(index: number, lives: number, score: number): void {
    this.levelIndex.set(index);
    this.entryLives = lives;
    this.entryScore = score;
    this.world = createWorld(index, lives, score);
    this.pending = [];
    this.mirrored = '';
    this.mirror();
    void this.loadBackdrop(this.world.level);
  }

  private finishLevel(): void {
    this.runLives = this.world.lives;
    this.runScore = this.world.score;
    const id = this.world.level.id;
    if (!this.cleared().includes(id)) this.cleared.update(list => [...list, id]);
    if (this.lastLevel()) this.best.update(value => Math.max(value, this.runScore));
    this.save();
    this.openDialog('clear');
  }

  private endRun(): void {
    this.best.update(value => Math.max(value, this.world.score));
    this.save();
    this.openDialog('over');
  }

  private playSolution(index: number): Snapshot {
    this.startLevel(index, PHYS.startLives, 0);
    for (const input of parseSolution(levels[index].solution)) this.stepOnce(input);
    this.mirror();
    this.emit();
    this.paint();
    return snapshot(this.world);
  }

  // parseSolution() requires an explicit count after every token, so runs of one
  // still emit their '1' and the string round-trips tick for tick.
  private recordStop(): string {
    this.recording = false;
    let out = '';
    for (let i = 0; i < this.recorded.length;) {
      let n = 1;
      while (i + n < this.recorded.length && this.recorded[i + n] === this.recorded[i]) n++;
      out += this.recorded[i] + n;
      i += n;
    }
    this.recorded = [];
    return out;
  }

  // --- browser plumbing ---------------------------------------------------

  private attach(): void {
    const canvas = document.getElementById('arcade-canvas');
    if (canvas instanceof HTMLCanvasElement) {
      // Supersample: backing store is 3× the 512×288 game viewport so high-res
      // backdrops stay sharp (render.ts scales all drawing by RENDER_SCALE).
      canvas.width = VIEW_W * RENDER_SCALE;
      canvas.height = VIEW_H * RENDER_SCALE;
    }
    this.ctx = canvas instanceof HTMLCanvasElement ? canvas.getContext('2d') : null;
    if (this.ctx) this.ctx.imageSmoothingEnabled = false;
  }

  private dialogEl(kind: Dialog): HTMLDialogElement | null {
    return kind === 'none' ? null : document.querySelector<HTMLDialogElement>(`#arcade-${kind}`);
  }

  private openDialog(kind: Dialog): void {
    this.stopLoop();
    this.clearMask();
    this.dialog.set(kind);
    requestAnimationFrame(() => {
      const el = this.dialogEl(kind);
      if (el && !el.open) el.showModal();
    });
  }

  private loadBackdrop(level: Level): Promise<void> {
    const file = level.theme === 'jungle' ? JUNGLE_BACKDROP : level.backdrop;
    const cached = this.backdrops.get(file);
    if (cached) { this.backdrop = cached; return Promise.resolve(); }
    this.backdrop = null;
    const img = new Image();
    img.src = `assets/${file}`;
    return img.decode().then(() => {
      this.backdrops.set(file, img);
      this.backdrop = img;
    }).catch(() => {});
  }

  private focusHeading(): void {
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-screen-heading]')?.focus({ preventScroll: true }));
  }

  @HostListener('document:visibilitychange')
  visibilityChanged(): void {
    if (document.hidden) {
      this.stopLoop();
      this.clearMask();
      void this.audio?.suspend().catch(() => {});
    } else if (this.screen() === 'play' && this.dialog() === 'none' && this.world.status === 'play') {
      this.startLoop();
    }
  }

  toggleSound(): void {
    this.soundEnabled.update(value => !value);
    if (this.soundEnabled()) this.beep('coin');
    else void this.audio?.suspend().catch(() => {});
  }

  // Muting never touches the simulation — the events have already been applied.
  private beep(type: GameEventType): void {
    const notes = BEEPS[type];
    if (!notes || !this.soundEnabled() || document.hidden) return;
    try {
      this.audio ??= new AudioContext();
      const context = this.audio;
      void context.resume().then(() => {
        if (!this.soundEnabled() || document.hidden) return;
        notes.forEach((frequency, i) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const start = context.currentTime + i * .07;
          oscillator.type = 'square';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(.03, start + .01);
          gain.gain.exponentialRampToValueAtTime(.001, start + .16);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(start);
          oscillator.stop(start + .18);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      }).catch(() => this.soundEnabled.set(false));
    } catch { this.soundEnabled.set(false); }
  }

  // Validated field by field so a corrupt arcade save can never trip the quiz's parse.
  private load(): void {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (!saved || typeof saved !== 'object') return;
      const raw = saved as { bestScore?: unknown; cleared?: unknown };
      if (Number.isInteger(raw.bestScore) && (raw.bestScore as number) >= 0) this.best.set(raw.bestScore as number);
      if (Array.isArray(raw.cleared)) {
        const list: unknown[] = raw.cleared;
        this.cleared.set(levels.filter(level => list.includes(level.id)).map(level => level.id));
      }
    } catch { this.storageAvailable.set(false); }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ bestScore: this.best(), cleared: this.cleared() }));
      this.storageAvailable.set(true);
    } catch { this.storageAvailable.set(false); }
  }
}
