import { ChangeDetectionStrategy, Component, computed, HostListener, OnDestroy, signal } from '@angular/core';
import { gameConfig } from './config';
import { Question, Zone, zones } from './questions';

interface Progress { name: string; best: Partial<Record<string, number>>; completed: string[]; }
type Screen = 'welcome' | 'map' | 'island' | 'quiz' | 'result';

@Component({
  selector: 'game-root',
  templateUrl: './game.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnDestroy {
  readonly zones = zones;
  readonly config = gameConfig;
  readonly screen = signal<Screen>('welcome');
  readonly progress = signal<Progress>({ name: 'Explorer', best: {}, completed: [] });
  readonly storageAvailable = signal(true);
  readonly activeZone = signal<Zone>(zones[0]);
  readonly questions = signal<readonly Question[]>([]);
  readonly questionIndex = signal(0);
  readonly selected = signal<number | null>(null);
  readonly score = signal(0);
  readonly question = computed(() => this.questions()[this.questionIndex()]);
  readonly total = computed(() => Object.values(this.progress().best).reduce<number>((sum, value) => sum + (value ?? 0), 0));
  readonly badges = computed(() => zones.filter(zone => (this.progress().best[zone.id] ?? 0) >= 60));
  readonly level = computed(() => 1 + Math.floor(this.total() / 100));
  readonly letters = ['A', 'B', 'C', 'D'];
  readonly pageVisible = signal(!document.hidden);
  readonly soundEnabled = signal(false);
  readonly sceneMessage = signal('');
  readonly playfulElement = signal('');
  readonly particles = Array.from({ length: 20 }, (_, i) => ({
    x: 5 + (i * 47) % 90, y: 12 + (i * 31) % 76,
    delay: (i % 7) * .35, duration: 5 + (i % 5) * 1.5,
    drift: -80 + (i * 37) % 160,
  }));
  private messageTimer?: ReturnType<typeof setTimeout>;
  private audio?: AudioContext;

  @HostListener('document:visibilitychange')
  visibilityChanged(): void {
    this.pageVisible.set(!document.hidden);
    if (document.hidden) void this.audio?.suspend().catch(() => {});
  }

  toggleSound(): void {
    this.soundEnabled.update(value => !value);
    if (this.soundEnabled()) this.playSound('explore');
    else void this.audio?.suspend().catch(() => {});
  }

  discover(element: 'balloon' | 'flag'): void {
    clearTimeout(this.messageTimer);
    this.playfulElement.set(element);
    this.sceneMessage.set(element === 'balloon'
      ? 'Up, up, and away! Your next discovery is just an island away.'
      : 'Your adventure starts with curiosity. Fly the CES flag, explorer!');
    this.playSound('explore');
    this.messageTimer = setTimeout(() => {
      this.playfulElement.set('');
      this.sceneMessage.set('');
    }, 4200);
  }

  private playSound(kind: 'explore' | 'correct' | 'complete'): void {
    if (!this.soundEnabled() || document.hidden) return;
    try {
      this.audio ??= new AudioContext();
      const context = this.audio;
      void context.resume().then(() => {
        if (!this.soundEnabled() || document.hidden) return;
        const notes = kind === 'complete' ? [523.25, 659.25, 783.99, 1046.5]
          : kind === 'correct' ? [659.25, 880] : [523.25, 783.99];
        notes.forEach((frequency, i) => {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const start = context.currentTime + i * .12;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(.045, start + .025);
          gain.gain.exponentialRampToValueAtTime(.001, start + .3);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(start);
          oscillator.stop(start + .32);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      }).catch(() => this.soundEnabled.set(false));
    } catch { this.soundEnabled.set(false); }
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
    void this.audio?.close().catch(() => {});
  }

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(gameConfig.storageKey) ?? 'null');
      if (saved && typeof saved === 'object') {
        const best: Record<string, number> = {};
        for (const zone of zones) {
          const value = saved.best?.[zone.id];
          if (Number.isInteger(value) && value >= 0 && value <= 100 && value % 20 === 0) best[zone.id] = value;
        }
        this.progress.set({
          name: typeof saved.name === 'string' ? saved.name.trim().slice(0, 20) || 'Explorer' : 'Explorer',
          best,
          completed: Array.isArray(saved.completed) ? zones.filter(z => saved.completed.includes(z.id)).map(z => z.id) : [],
        });
      }
    } catch { this.storageAvailable.set(false); }
    this.readLocation();
  }

  @HostListener('window:hashchange')
  readLocation(): void {
    const hash = window.location.hash;
    const zone = zones.find(z => hash === `#/island/${z.id}`);
    if (zone) {
      this.activeZone.set(zone);
      this.screen.set('island');
    } else this.screen.set(hash === '#/map' ? 'map' : 'welcome');
    this.focusHeading();
  }

  navigate(target: 'welcome' | 'map', event?: Event, name?: string): void {
    event?.preventDefault();
    this.sceneMessage.set('');
    this.playSound('explore');
    if (name !== undefined) {
      this.progress.update(p => ({ ...p, name: name.trim().slice(0, 20) || 'Explorer' }));
      this.save();
    }
    window.location.hash = target === 'map' ? '/map' : '/';
    this.screen.set(target);
    this.focusHeading();
  }

  enter(zone: Zone): void {
    this.playSound('explore');
    this.activeZone.set(zone);
    this.screen.set('island');
    window.location.hash = `/island/${zone.id}`;
    this.focusHeading();
  }

  startRound(): void {
    this.playSound('explore');
    const pool = [...this.activeZone().questions];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    this.questions.set(pool.slice(0, gameConfig.questionsPerRound));
    this.questionIndex.set(0);
    this.selected.set(null);
    this.score.set(0);
    this.screen.set('quiz');
    this.focusHeading();
  }

  answer(index: number): void {
    if (this.screen() !== 'quiz' || this.selected() !== null || index < 0 || index > 3) return;
    this.selected.set(index);
    if (index === this.question().answer) {
      this.score.update(value => value + gameConfig.pointsPerAnswer);
      this.playSound('correct');
    }
    requestAnimationFrame(() => document.getElementById('next-question')?.focus());
  }

  next(): void {
    if (this.selected() === null || this.screen() !== 'quiz') return;
    if (this.questionIndex() < this.questions().length - 1) {
      this.questionIndex.update(value => value + 1);
      this.selected.set(null);
    } else {
      const id = this.activeZone().id;
      this.progress.update(p => ({
        ...p,
        best: { ...p.best, [id]: Math.max(p.best[id] ?? 0, this.score()) },
        completed: [...new Set([...p.completed, id])],
      }));
      this.save();
      this.screen.set('result');
      this.playSound('complete');
    }
    this.focusHeading();
  }

  back(leaveDialog?: HTMLDialogElement): void {
    if (this.screen() === 'quiz') leaveDialog?.showModal();
    else this.navigate(this.screen() === 'map' ? 'welcome' : 'map');
  }

  leaveRound(dialog: HTMLDialogElement): void {
    dialog.close();
    this.screen.set('island');
    this.focusHeading();
  }

  private save(): void {
    try {
      localStorage.setItem(gameConfig.storageKey, JSON.stringify(this.progress()));
      this.storageAvailable.set(true);
    } catch { this.storageAvailable.set(false); }
  }

  private focusHeading(): void {
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-screen-heading]')?.focus({ preventScroll: true }));
  }
}
