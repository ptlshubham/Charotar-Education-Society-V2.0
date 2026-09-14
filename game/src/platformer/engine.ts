// The CES Arcade simulation: state in, state out, nothing else.
//
// No DOM, no Angular, no clock and no randomness. scripts/verify.mjs replays a
// recorded input string through this file under Node's type stripping and
// asserts the resulting numbers, which only works while step() stays a pure
// function of (world, input). npm run art:check greps this file for every clock
// and random-number call by name and fails the build on a hit.
//
// Physics is discrete Euler: vy += g, THEN y += vy, one fixed tick at a time.
// Never reach for the continuous v^2/2g envelope; it disagrees with this loop
// by enough to put question blocks out of reach.

import {
  ENEMY_H, ENEMY_W, EPS, HAZARD, type Level, PHYS, PLAYER_H, PLAYER_W, ROWS, SOLID, TILE, VIEW_W,
  countCoins, expandRows, levels, validateLevel,
} from './levels.ts';

export interface Input { left: boolean; right: boolean; jump: boolean; power?: boolean }
export interface Body { x: number; y: number; vx: number; vy: number; w: number; h: number; prevY: number }
export interface Player extends Body { face: 1 | -1; grounded: boolean; coyote: number; buffer: number; jumpHeld: boolean }
export interface Enemy extends Body { kind: 'walker' | 'flyer' | 'beetle' | 'plant'; face: 1 | -1; t: number; homeX: number; homeY: number; dead: number; health: number; stunned: number }
export type GameEventType = 'jump' | 'coin' | 'block' | 'stomp' | 'hurt' | 'checkpoint' | 'goal' | 'clear' | 'gameover' | 'power' | 'gem' | 'mushroom' | 'star';
export interface GameEvent { tick: number; type: GameEventType }
export type Status = 'play' | 'clear' | 'over';

export interface World {
  levelIndex: number; level: Level; tiles: string[][]; cols: number; widthPx: number;
  player: Player; enemies: Enemy[]; camX: number; tick: number;
  lives: number; coins: number; coinTotal: number; score: number;
  health: number; stars: number; gems: number; timeTicks: number; invulnerable: number; powerTick: number;
  spawnX: number; spawnY: number;
  bumpTick: number; bumpCell: readonly [number, number] | null;
  status: Status; events: GameEvent[]; prevInput: Input;
}

export interface Snapshot {
  tick: number; x: number; y: number; vx: number; vy: number; grounded: boolean; face: 1 | -1;
  lives: number; coins: number; coinTotal: number; score: number; status: Status;
  camX: number; enemies: number;
  health: number; stars: number; gems: number; seconds: number;
}

interface MoveResult { grounded: boolean; hitWall: boolean; ceil: readonly [number, number] | null }

export const NO_INPUT: Input = { left: false, right: false, jump: false };

const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);

const flip = (face: 1 | -1): 1 | -1 => (face > 0 ? -1 : 1);

const emit = (w: World, type: GameEventType): void => { w.events.push({ tick: w.tick, type }); };

// Off the left or right edge is a wall; above the ceiling and below the pit is
// open sky, so a fall keeps falling until the pit rule catches it.
export const solidAt = (w: World, col: number, row: number): boolean => {
  if (col < 0 || col >= w.cols) return true;
  if (row < 0 || row >= ROWS) return false;
  return SOLID.includes(w.tiles[row][col]);
};

const overlaps = (a: Body, b: Body): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const boxHitsSolid = (w: World, x: number, y: number, bw: number, bh: number): boolean => {
  const c1 = Math.floor((x + bw - EPS) / TILE);
  const r1 = Math.floor((y + bh - EPS) / TILE);
  for (let r = Math.floor(y / TILE); r <= r1; r++) {
    for (let c = Math.floor(x / TILE); c <= c1; c++) if (solidAt(w, c, r)) return true;
  }
  return false;
};

// Axis-separated AABB, X fully resolved before Y, no sweeping and no substepping
// — at these speeds nothing outruns a tile. The EPS on every far edge is what
// stops a body that lands exactly on a tile boundary from snagging on the seam.
const moveBody = (w: World, b: Body): MoveResult => {
  let hitWall = false;
  let grounded = false;
  let ceil: readonly [number, number] | null = null;

  b.x += b.vx;
  const rTop = Math.floor(b.y / TILE);
  const rBot = Math.floor((b.y + b.h - EPS) / TILE);
  if (b.vx > 0) {
    const c = Math.floor((b.x + b.w - EPS) / TILE);
    for (let r = rTop; r <= rBot; r++) {
      if (solidAt(w, c, r)) { b.x = c * TILE - b.w; b.vx = 0; hitWall = true; break; }
    }
  } else if (b.vx < 0) {
    const c = Math.floor(b.x / TILE);
    for (let r = rTop; r <= rBot; r++) {
      if (solidAt(w, c, r)) { b.x = (c + 1) * TILE; b.vx = 0; hitWall = true; break; }
    }
  }

  b.prevY = b.y;
  b.y += b.vy;
  const cLeft = Math.floor(b.x / TILE);
  const cRight = Math.floor((b.x + b.w - EPS) / TILE);
  if (b.vy > 0) {
    const r = Math.floor((b.y + b.h - EPS) / TILE);
    for (let c = cLeft; c <= cRight; c++) {
      if (solidAt(w, c, r)) { b.y = r * TILE - b.h; b.vy = 0; grounded = true; break; }
    }
  } else if (b.vy < 0) {
    const r = Math.floor(b.y / TILE);
    for (let c = cLeft; c <= cRight; c++) {
      if (solidAt(w, c, r)) { b.y = (r + 1) * TILE; b.vy = 0; ceil = [c, r]; break; }
    }
  }
  return { grounded, hitWall, ceil };
};

export const teleport = (w: World, x: number, y: number): void => {
  if (boxHitsSolid(w, x, y, PLAYER_W, PLAYER_H)) throw new Error(`teleport: ${x},${y} is inside solid tiles`);
  const p = w.player;
  p.x = x;
  p.y = y;
  // prevY feeds the stomp test. Left at the pre-teleport value it reads as one
  // enormous downward step, so the tick after a respawn is a free kill.
  p.prevY = y;
  p.vx = 0;
  p.vy = 0;
  p.grounded = false;
  p.coyote = 0;
  p.buffer = 0;
  p.jumpHeld = false;
};

// Enemies and already-collected coins deliberately survive a death: only the
// player is rewound, so a respawn is a second attempt, not a fresh level.
const hurt = (w: World): void => {
  w.lives--;
  emit(w, 'hurt');
  if (w.lives <= 0) { w.status = 'over'; emit(w, 'gameover'); return; }
  teleport(w, w.spawnX, w.spawnY);
  w.health = 3;
  w.invulnerable = 90;
  w.timeTicks = 300 * 60;
};

const contactHurt = (w: World): void => {
  if (w.level.theme !== 'jungle') { hurt(w); return; }
  if (w.invulnerable) return;
  w.health--;
  if (w.health <= 0) { hurt(w); return; }
  w.invulnerable = 90;
  emit(w, 'hurt');
};

export const plantFrame = (e: Enemy): number => {
  const phase = e.t % 240;
  return phase < 80 ? 0 : phase < 110 ? 1 : phase < 200 ? 2 : 3;
};

const hitEnemy = (w: World, e: Enemy): void => {
  e.health--;
  e.stunned = 90;
  if (e.health <= 0) { e.dead = w.tick; w.score += PHYS.stompScore; }
};

export const createWorld = (levelIndex: number, lives: number = PHYS.startLives, score = 0): World => {
  if (levelIndex < 0 || levelIndex >= levels.length) throw new Error(`createWorld: no level at index ${levelIndex}`);
  const level = levels[levelIndex];
  validateLevel(level);

  const tiles = expandRows(level).map(row => [...row]);
  const enemies: Enemy[] = [];
  let spawnX = 0;
  let spawnY = 0;
  // Markers place the entity's BOTTOM edge on the cell's bottom edge, centred in
  // the column; they are cleared so nothing later mistakes them for terrain.
  tiles.forEach((row, r) => row.forEach((ch, c) => {
    if (!'Pwfbp'.includes(ch)) return;
    row[c] = '.';
    if (ch === 'P') {
      spawnX = c * TILE + (TILE - PLAYER_W) / 2;
      spawnY = (r + 1) * TILE - PLAYER_H;
      return;
    }
    const x = c * TILE + (TILE - ENEMY_W) / 2;
    const y = (r + 1) * TILE - ENEMY_H;
    enemies.push({
      x, y, vx: 0, vy: 0, w: ENEMY_W, h: ENEMY_H, prevY: y,
      kind: ch === 'w' ? 'walker' : ch === 'b' ? 'beetle' : ch === 'p' ? 'plant' : 'flyer',
      face: ch === 'w' ? -1 : 1,
      t: 0, homeX: x, homeY: y, dead: 0, health: ch === 'b' ? 2 : 1, stunned: 0,
    });
  }));

  const cols = tiles[0].length;
  const w: World = {
    levelIndex, level, tiles, cols, widthPx: cols * TILE,
    player: {
      x: spawnX, y: spawnY, vx: 0, vy: 0, w: PLAYER_W, h: PLAYER_H, prevY: spawnY,
      face: 1, grounded: false, coyote: 0, buffer: 0, jumpHeld: false,
    },
    enemies, camX: 0, tick: 0,
    lives, coins: 0, coinTotal: countCoins(level), score,
    health: 3, stars: level.theme === 'jungle' ? 2 : 0, gems: 0, timeTicks: 300 * 60, invulnerable: 0, powerTick: -1000,
    spawnX, spawnY,
    bumpTick: 0, bumpCell: null,
    status: 'play', events: [], prevInput: { ...NO_INPUT },
  };
  // Every respawn reuses this box, so a spawn buried in geometry wedges the run.
  if (boxHitsSolid(w, spawnX, spawnY, PLAYER_W, PLAYER_H)) {
    throw new Error(`${level.id}: spawn at ${spawnX},${spawnY} is inside solid tiles`);
  }
  w.camX = clamp(spawnX + PLAYER_W / 2 - VIEW_W / 2, 0, Math.max(0, w.widthPx - VIEW_W));
  return w;
};

// True when the tick ended here — a death or the goal — and step() must bail.
const applyTriggers = (w: World): boolean => {
  const p = w.player;
  const c1 = Math.min(w.cols - 1, Math.floor((p.x + p.w - EPS) / TILE));
  const r1 = Math.min(ROWS - 1, Math.floor((p.y + p.h - EPS) / TILE));
  for (let r = Math.max(0, Math.floor(p.y / TILE)); r <= r1; r++) {
    for (let c = Math.max(0, Math.floor(p.x / TILE)); c <= c1; c++) {
      const ch = w.tiles[r][c];
      if (HAZARD.includes(ch)) { hurt(w); return true; }
      if (ch === 'o') {
        w.tiles[r][c] = '.';
        w.coins++;
        w.score += PHYS.coinScore;
        emit(w, 'coin');
      } else if ('gms'.includes(ch)) {
        w.tiles[r][c] = '.';
        if (ch === 'g') { w.gems++; w.score += 50; emit(w, 'gem'); }
        if (ch === 'm') { w.health = Math.min(3, w.health + 1); w.score += 25; emit(w, 'mushroom'); }
        if (ch === 's') { w.stars++; w.score += 20; emit(w, 'star'); }
      } else if (ch === 'c') {
        w.tiles[r][c] = 'C';
        w.spawnX = c * TILE + (TILE - PLAYER_W) / 2;
        w.spawnY = (r + 1) * TILE - PLAYER_H;
        emit(w, 'checkpoint');
      } else if (ch === 'G') {
        w.score += PHYS.clearScore;
        w.status = 'clear';
        emit(w, 'goal');
        emit(w, 'clear');
        return true;
      }
    }
  }
  if (p.y > ROWS * TILE + PHYS.pitMargin) { hurt(w); return true; }
  return false;
};

export const step = (w: World, input: Input): void => {
  if (w.status !== 'play') return;
  w.tick++;
  const p = w.player;
  if (w.invulnerable) w.invulnerable--;
  if (w.level.theme === 'jungle') {
    if (--w.timeTicks <= 0) { hurt(w); w.prevInput = { ...input }; return; }
    if (input.power && !w.prevInput.power && w.stars > 0) {
      w.stars--; w.powerTick = w.tick; emit(w, 'power');
      for (const e of w.enemies) {
        if (!e.dead && Math.hypot(e.x + e.w / 2 - p.x - p.w / 2, e.y + e.h / 2 - p.y - p.h / 2) <= 76) hitEnemy(w, e);
      }
    }
  }

  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir !== 0) {
    const accel = p.grounded ? (dir * p.vx < 0 ? PHYS.turnAccel : PHYS.runAccel) : PHYS.airAccel;
    p.vx = clamp(p.vx + dir * accel, -PHYS.maxRun, PHYS.maxRun);
    p.face = dir > 0 ? 1 : -1;
  } else {
    const f = p.grounded ? PHYS.frictionGround : PHYS.frictionAir;
    p.vx = Math.abs(p.vx) <= f ? 0 : p.vx - Math.sign(p.vx) * f;
  }

  p.coyote = p.grounded ? PHYS.coyote : Math.max(0, p.coyote - 1);
  // Rising edge only: a button held through a landing must not bounce the player.
  const pressed = input.jump && !w.prevInput.jump;
  p.buffer = pressed ? PHYS.buffer : Math.max(0, p.buffer - 1);
  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = PHYS.jumpV;
    p.grounded = false;
    p.buffer = 0;
    p.coyote = 0;
    p.jumpHeld = true;
    emit(w, 'jump');
  }
  if (!input.jump) {
    p.jumpHeld = false;
    if (p.vy < PHYS.jumpCut) p.vy = PHYS.jumpCut;
  }

  p.vy = Math.min(p.vy + (p.vy < 0 && p.jumpHeld ? PHYS.gravityRise : PHYS.gravityFall), PHYS.maxFall);

  const res = moveBody(w, p);
  p.grounded = res.grounded;

  if (res.ceil) {
    const [bc, br] = res.ceil;
    if (w.tiles[br][bc] === '?') {
      w.tiles[br][bc] = '!';
      w.coins++;
      w.score += PHYS.coinScore;
      w.bumpTick = w.tick;
      w.bumpCell = res.ceil;
      emit(w, 'block');
    }
  }

  // A hurt or a goal ends this tick's entity work, but the camera still has to
  // follow the respawn and prevInput still has to advance — leaving it stale
  // swallows the rising edge of a genuine jump press on the very next tick.
  if (applyTriggers(w)) {
    w.camX = clamp(p.x + p.w / 2 - VIEW_W / 2, 0, Math.max(0, w.widthPx - VIEW_W));
    w.prevInput = { ...input };
    return;
  }

  for (const e of w.enemies) {
    if (e.dead) continue;
    if (e.stunned) { e.stunned--; continue; }
    e.t++;
    if (e.kind === 'plant') {
      e.h = [5, 15, 26, 15][plantFrame(e)];
      e.y = e.homeY + ENEMY_H - e.h;
    } else if (e.kind === 'walker' || e.kind === 'beetle') {
      e.vx = (e.kind === 'beetle' ? .35 : PHYS.walkerSpeed) * e.face;
      e.vy = Math.min(e.vy + PHYS.gravityFall, PHYS.maxFall);
      const r = moveBody(w, e);
      if (r.hitWall) e.face = flip(e.face);
      else {
        // Probe one pixel past the leading foot and one pixel below it: no floor
        // there means a ledge, and a walker turns rather than strolling into a pit.
        const probeC = Math.floor((e.face > 0 ? e.x + e.w + 1 : e.x - 1) / TILE);
        if (!solidAt(w, probeC, Math.floor((e.y + e.h + 1) / TILE))) e.face = flip(e.face);
      }
    } else {
      // Flyers ignore terrain entirely; validateLevel guarantees their swept box
      // is clear, so the path is pure position, never velocity.
      e.face = Math.floor(e.t / (PHYS.flyerPeriod / 2)) % 2 ? -1 : 1;
      e.x = e.homeX + (w.level.theme === 'jungle' ? 0 : Math.sin(e.t * 2 * Math.PI / PHYS.flyerPeriod) * PHYS.flyerAmpX);
      e.y = e.homeY + Math.sin(e.t * 2 * Math.PI / (PHYS.flyerPeriod / 2)) * PHYS.flyerAmp;
    }
  }

  for (const e of w.enemies) {
    if (e.dead || (e.kind === 'plant' && plantFrame(e) === 0) || !overlaps(p, e)) continue;
    if (e.kind !== 'plant' && p.vy > 0 && p.prevY + p.h <= e.y + PHYS.stompGrace) {
      hitEnemy(w, e);
      p.vy = PHYS.stompBounce;
      emit(w, 'stomp');
    } else {
      if (!e.stunned) contactHurt(w);
    }
    // At most one resolution per tick. Without this break, landing on two
    // adjacent enemies stomps the first and takes a hit from the second.
    break;
  }

  // One pass, at the end: squashed enemies linger for the squash frame, and a
  // walker knocked off a ledge is dropped instead of falling forever.
  w.enemies = w.enemies.filter(e => (e.dead === 0 || w.tick - e.dead <= (w.level.theme === 'jungle' && e.kind !== 'walker' ? 40 : PHYS.squashTicks))
    && e.y <= ROWS * TILE + PHYS.pitMargin);

  w.camX = clamp(p.x + p.w / 2 - VIEW_W / 2, 0, Math.max(0, w.widthPx - VIEW_W));
  w.prevInput = { ...input };
};

// A fresh object every call, so a caller holding a snapshot cannot reach back
// into the running simulation through it.
export const snapshot = (w: World): Snapshot => ({
  tick: w.tick,
  x: w.player.x,
  y: w.player.y,
  vx: w.player.vx,
  vy: w.player.vy,
  grounded: w.player.grounded,
  face: w.player.face,
  lives: w.lives,
  coins: w.coins,
  coinTotal: w.coinTotal,
  score: w.score,
  status: w.status,
  camX: w.camX,
  enemies: w.enemies.length,
  health: w.health, stars: w.stars, gems: w.gems, seconds: Math.max(0, Math.ceil(w.timeTicks / 60)),
});

export const drainEvents = (w: World): GameEvent[] => {
  const out = w.events;
  w.events = [];
  return out;
};

const SOLUTION_TOKENS: Record<string, Input> = {
  '*': { left: false, right: false, jump: false, power: true },
  ']': { left: false, right: true, jump: false, power: true },
  ')': { left: false, right: true, jump: true, power: true },
  '[': { left: true, right: false, jump: false, power: true },
  '(': { left: true, right: false, jump: true, power: true },
  '!': { left: false, right: false, jump: true, power: true },
  '.': { left: false, right: false, jump: false },
  '<': { left: true, right: false, jump: false },
  '>': { left: false, right: true, jump: false },
  '^': { left: false, right: false, jump: true },
  '{': { left: true, right: false, jump: true },
  '}': { left: false, right: true, jump: true },
};

// Run-length input: a token character followed by a decimal repeat count, e.g.
// '>40^12}30'. Every Input is its own object so a replay cannot alias two ticks.
export const parseSolution = (rle: string): Input[] => {
  const out: Input[] = [];
  let i = 0;
  while (i < rle.length) {
    const ch = rle[i];
    const base = SOLUTION_TOKENS[ch];
    if (!base) throw new Error(`parseSolution: unknown token '${ch}' at index ${i}`);
    let digits = '';
    i++;
    while (i < rle.length && rle[i] >= '0' && rle[i] <= '9') digits += rle[i++];
    if (!digits) throw new Error(`parseSolution: token '${ch}' at index ${i - 1} has no count`);
    for (let n = Number(digits); n > 0; n--) out.push({ ...base });
  }
  return out;
};
