// Presentation only. draw() reads World and never writes to it, so a frame can
// be re-drawn any number of times for the same tick (resize, devtools, a paused
// screenshot) without changing the simulation.
//
// Every path, frame size and frame order comes from sprites.ts: there is not one
// literal asset path or source rectangle in this file, which is what lets the art
// team swap a sheet without a code change.

import { isRich, RENDER_SCALE, ROWS, SOLID, TILE, VIEW_H, VIEW_W } from './levels';
import { type AssetReport, frameRect, PALETTE, type Sheets, SPRITES, type SpriteSlot } from './sprites';
import { plantFrame, type Enemy, type World } from './engine';

const GOAL_W = 40;
const GOAL_H = 58;
const BUMP_LIFT = 6;
const BUMP_TICKS = 8;
const CHECK = 4;

const slotOf = (name: string): SpriteSlot => {
  const s = SPRITES.find(x => x.slot === name);
  if (!s) throw new Error(`render: no sprite slot named ${name}`);
  return s;
};

const missing = (report: AssetReport, slot: string): boolean => report.issues.some(i => i.slot === slot);

// A missing sheet has to be loud. Drawing nothing would ship a level with
// invisible terrain and nobody would find out until a player fell through it.
const checker = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void => {
  for (let j = 0; j < h; j += CHECK) {
    for (let i = 0; i < w; i += CHECK) {
      ctx.fillStyle = ((i / CHECK | 0) + (j / CHECK | 0)) % 2 ? '#000000' : '#ff00ff';
      ctx.fillRect(x + i, y + j, Math.min(CHECK, w - i), Math.min(CHECK, h - j));
    }
  }
};

const blit = (
  ctx: CanvasRenderingContext2D, img: CanvasImageSource, s: SpriteSlot, frame: number, k: number,
  dx: number, dy: number, dw: number, dh: number, flip: boolean,
): void => {
  const [sx, sy, sw, sh] = frameRect(s, frame, k);
  if (!flip) { ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); return; }
  ctx.save();
  ctx.translate(dx + dw, dy);
  ctx.scale(-1, 1);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  ctx.restore();
};

// Sprite frames overhang their hitbox, so the anchor is derived from the slot's
// frame size against the body's size — never from a hardcoded pixel offset.
const actor = (
  ctx: CanvasRenderingContext2D, sheets: Sheets, report: AssetReport, name: string, frame: number,
  bx: number, by: number, bw: number, bh: number, centred: boolean, face: 1 | -1,
): void => {
  if (missing(report, name)) { checker(ctx, Math.round(bx), Math.round(by), bw, bh); return; }
  const s = slotOf(name);
  const dx = Math.round(bx + bw / 2 - s.frameW / 2);
  const dy = Math.round(centred ? by + bh / 2 - s.frameH / 2 : by + bh - s.frameH);
  blit(ctx, sheets[name], s, frame, report.scale[name], dx, dy, s.frameW, s.frameH, face === -1);
};

const tileIndex = (ch: string, above: string, row: number): number => {
  if (ch === '#') return row === 0 || !SOLID.includes(above) ? 0 : 1;
  if (ch === 'B') return 2;
  if (ch === '?') return 3;
  if (ch === '!') return 4;
  if (ch === '^') return 5;
  if (ch === '~') return above === '~' ? 7 : 6;
  if (ch === 'c') return 8;
  if (ch === 'C') return 9;
  return -1;
};

const playerFrame = (w: World): number => {
  const p = w.player;
  if (w.status === 'clear') return 6;
  if (p.vy < 0) return 4;
  if (!p.grounded) return 5;
  return Math.abs(p.vx) > 0.2 ? 1 + ((w.tick >> 3) % 3) : 0;
};

// The squash frame is only ever reachable through e.dead, so it is selected the
// same way for both kinds — the art team has no other cue that it exists.
const enemyFrame = (e: Enemy, w: World): number => {
  if (!isRich(w.level.theme) || e.kind === 'walker') return e.dead ? 2 : (e.t >> 3) % 2;
  if (e.dead) return w.tick - e.dead < 22 ? 5 : 6;
  if (e.stunned) return 4;
  return e.kind === 'plant' ? plantFrame(e) : (e.t >> 3) % 4;
};

export const draw = (
  ctx: CanvasRenderingContext2D, w: World, sheets: Sheets, report: AssetReport,
  backdrop: HTMLImageElement | null, parallax: boolean,
): void => {
  const theme = w.level.theme === 'canopy' ? 'jungle' : w.level.theme;
  const jungle = theme === 'jungle';
  const rich = isRich(theme);
  // Canopy shares the jungle family; every other world owns its actor sheets.
  const art = (name: string): string => jungle ? name : rich ? `${theme}-${name}` : `legacy-${name}`;
  // 1 — backdrop. The painted scenes do not tile, so every odd copy is mirrored,
  // which makes any image seamless regardless of what the art team supplies.
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
  ctx.imageSmoothingEnabled = true;
  const bw = backdrop ? Math.round(VIEW_H * backdrop.width / backdrop.height) : 0;
  if (theme === 'village' && sheets['village-layers'] && !missing(report, 'village-layers')) {
    // These exports are wide strips. Preserve their proportions and extend
    // only the bottom edge behind the nearer layer, instead of stretching sky
    // clouds and mountain peaks to the height of the whole screen.
    ctx.fillStyle = '#329cf6'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    const layers = slotOf('village-layers'), scale = report.scale[layers.slot];
    for (const [frame, y, width, height, speed] of [[4,0,1024,134,.04],[0,90,1280,140,.1],[1,118,1265,145,.18],[2,184,640,79,.3],[3,253,512,39,.4]]) {
      const off = parallax ? (w.camX * speed) % (width * 2) : 0;
      for (let i = -1; i * width - off < VIEW_W; i++) {
        ctx.save(); ctx.translate(i * width - off + (i % 2 ? width : 0), 0);
        if (i % 2) ctx.scale(-1, 1);
        prop(ctx, sheets, report, layers.slot, frame, 0, y, width, height);
        if (y + height < VIEW_H) {
          const [sx, sy, sw, sh] = frameRect(layers, frame, scale);
          ctx.drawImage(sheets[layers.slot], sx, sy + sh - 2, sw, 2, 0, y + height, width, VIEW_H - y - height);
        }
        ctx.restore();
      }
    }
  } else if (bw > 0 && backdrop) {
    const off = parallax ? (w.camX * 0.25) % (bw * 2) : 0;
    for (let i = -1; i * bw - off < VIEW_W; i++) {
      const dx = i * bw - off;
      if ((i & 1) === 0) ctx.drawImage(backdrop, dx, 0, bw, VIEW_H);
      else {
        ctx.save();
        ctx.translate(dx + bw, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(backdrop, 0, 0, bw, VIEW_H);
        ctx.restore();
      }
    }
  } else {
    ctx.fillStyle = PALETTE.ink;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  // 2 — terrain. World space from here on; the camera is a whole-pixel translate
  // so pixel-art cells never land on a half pixel.
  ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, -Math.round(w.camX) * RENDER_SCALE, 0);
  ctx.imageSmoothingEnabled = false;
  const tiles = slotOf(`tiles-${w.level.theme}`);
  const coin = slotOf(art('coin'));
  const tileGone = missing(report, tiles.slot);
  const coinGone = missing(report, coin.slot);
  const c0 = Math.floor(w.camX / TILE);
  const c1 = Math.ceil((w.camX + VIEW_W) / TILE);
  if (jungle) jungleScenery(ctx, w, sheets, report, c0, c1);
  if (theme === 'castle') castleScenery(ctx, w, sheets, report, c0, c1);
  if (rich && !jungle && theme !== 'castle') worldScenery(ctx, w, sheets, report, c0, c1);
  const props = `${theme}-props`;
  for (let c = c0; c <= c1; c++) {
    if (c < 0 || c >= w.cols) continue;
    for (let r = 0; r < ROWS; r++) {
      const ch = w.tiles[r][c];
      if (ch === '.') continue;
      const x = c * TILE;
      if (rich && 'gms'.includes(ch)) {
        const bob = parallax ? Math.round(Math.sin(w.tick / 12 + c) * 1.5) : 0;
        prop(ctx, sheets, report, `${theme}-rewards`, 'gms'.indexOf(ch), x, r * TILE + bob, TILE, TILE);
        continue;
      }
      if (rich && ch === '=') {
        const s = slotOf(props);
        const [sx, sy] = frameRect(s, 7, report.scale[s.slot]);
        const k = report.scale[s.slot];
        // Source crop of the bridge frame, in 64x64 frame units: jungle keeps only its
        // plank deck; the castle span keeps its corbels so it reads as stonework.
        const [cx, cy, cw, chh, dh] = jungle ? [7, 35, 50, 15, TILE / 2] : theme === 'castle' ? [1, 19.5, 62, 25, 10] : [1, 18, 62, 30, TILE];
        if (sheets[s.slot]) ctx.drawImage(sheets[s.slot], sx + cx * k, sy + cy * k, cw * k, chh * k, x, r * TILE, TILE, dh);
        continue;
      }
      if (rich && (ch === 'H' || ch === 'I')) {
        if (ch === 'H' && w.tiles[r][c - 1] !== 'H') prop(ctx, sheets, report, props, 0, x - 2, r * TILE - 2, TILE * 2 + 4, TILE * 2 + 4);
        continue;
      }
      if (ch === 'o') {
        if (coinGone) checker(ctx, x, r * TILE, TILE, TILE);
        else blit(ctx, sheets[coin.slot], coin, (w.tick >> 3) % 4, report.scale[coin.slot], x, r * TILE, TILE, TILE, false);
        continue;
      }
      const index = tileIndex(ch, r > 0 ? w.tiles[r - 1][c] : '.', r);
      if (index < 0) continue;
      // bumpCell is [col, row], the same order as solidAt(w, col, row).
      const bumped = ch === '?' && w.bumpCell !== null
        && w.bumpCell[0] === c && w.bumpCell[1] === r && w.tick - w.bumpTick < BUMP_TICKS;
      const y = r * TILE - (bumped ? BUMP_LIFT : 0);
      if (tileGone) checker(ctx, x, y, TILE, TILE);
      else if (rich && ch === 'B' && c % 2 === 0) prop(ctx, sheets, report, props, 6, x, y, TILE, TILE);
      else blit(ctx, sheets[tiles.slot], tiles, index, report.scale[tiles.slot], x, y, TILE, TILE, false);
    }
  }

  // 3 — goal flag. Reused repo art rather than a sheet, so it may simply be absent.
  const flag = sheets['goal-flag'];
  if (flag) {
    ctx.imageSmoothingEnabled = true;
    for (let c = c0; c <= c1; c++) {
      if (c < 0 || c >= w.cols) continue;
      for (let r = 0; r < ROWS; r++) {
        if (w.tiles[r][c] !== 'G') continue;
        if (jungle) prop(ctx, sheets, report, 'jungle-props', 2, c * TILE + (TILE - GOAL_W) / 2, (r + 1) * TILE - GOAL_H, GOAL_W, GOAL_H);
        else if (rich) standing(ctx, sheets, report, props, 2, c * TILE + TILE / 2, (r + 1) * TILE, GOAL_H);
        else ctx.drawImage(flag, c * TILE + (TILE - GOAL_W) / 2, (r + 1) * TILE - GOAL_H, GOAL_W, GOAL_H);
      }
    }
  }

  // 4 — enemies, then the player on top.
  ctx.imageSmoothingEnabled = false;
  for (const e of w.enemies) {
      const name = jungle && e.kind !== 'walker' ? `jungle-${e.kind === 'flyer' ? 'parrot' : e.kind}` : art(e.kind);
    actor(ctx, sheets, report, name, enemyFrame(e, w), e.x, e.y, e.w, e.h, e.kind === 'flyer', e.face);
  }
  const p = w.player;
  if (rich && w.tick - w.powerTick < 20) {
    ctx.save(); ctx.strokeStyle = '#ffe594'; ctx.lineWidth = 2;
    ctx.globalAlpha = 1 - (w.tick - w.powerTick) / 20;
    ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + p.h / 2, (w.tick - w.powerTick) * 4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  ctx.save();
  if (rich && w.invulnerable && (w.tick >> 3) % 2) ctx.globalAlpha = .45;
  actor(ctx, sheets, report, art('player'), playerFrame(w), p.x, p.y, p.w, p.h, false, p.face);
  ctx.restore();
};

const prop = (ctx: CanvasRenderingContext2D, sheets: Sheets, report: AssetReport,
  name: string, frame: number, x: number, y: number, width: number, height: number): void => {
  if (!sheets[name] || missing(report, name)) return;
  blit(ctx, sheets[name], slotOf(name), frame, report.scale[name], x, y, width, height, false);
};

// A prop letterboxed inside its square frame, scaled so its art is `height` tall
// with the art's lowest pixel (`bottom`, in frame units) on groundY.
const standing = (ctx: CanvasRenderingContext2D, sheets: Sheets, report: AssetReport, name: string, frame: number,
  cx: number, groundY: number, height: number, artH = 63, bottom = 63.5): void => {
  const s = slotOf(name);
  const box = height * s.frameH / artH;
  prop(ctx, sheets, report, name, frame, cx - box / 2, groundY - bottom * box / s.frameH, box, box);
};

// Castle grounds: distant towers and arches, then banners, lamps and ruins at the
// wall foot. Placement is by column so the scenery is identical on every run.
const worldScenery = (ctx: CanvasRenderingContext2D, w: World, sheets: Sheets, report: AssetReport, first: number, last: number): void => {
  const props = `${w.level.theme}-props`;
  for (let c = Math.max(0, first - 8); c <= Math.min(w.cols - 1, last + 8); c++) {
    for (let r = 14; r < ROWS; r++) {
      if (w.tiles[r][c] !== '#' || w.tiles[r - 1][c] !== '.') continue;
      const x = c * TILE + TILE / 2, y = r * TILE;
      if (c % 29 === 5) standing(ctx, sheets, report, props, 3, x, y, 105);
      if (c % 37 === 21) {
        ctx.save(); ctx.globalAlpha = .8;
        standing(ctx, sheets, report, props, 5, x, y, 76);
        ctx.restore();
      }
      if (c % 23 === 15) standing(ctx, sheets, report, props, 10, x, y, 50);
      if (c % 17 === 11) standing(ctx, sheets, report, props, 8, x, y, 36);
      if (c % 9 === 7) standing(ctx, sheets, report, props, 4, x, y, 20);
      if (c === 1) standing(ctx, sheets, report, props, 1, x + 4, y, 42);
    }
  }
};

const castleScenery = (ctx: CanvasRenderingContext2D, w: World, sheets: Sheets, report: AssetReport, first: number, last: number): void => {
  const props = 'castle-props';
  for (let c = Math.max(0, first - 8); c <= Math.min(w.cols - 1, last + 8); c++) {
    for (let r = 0; r < ROWS; r++) {
      if (w.tiles[r][c] !== '#' || (r && w.tiles[r - 1][c] !== '.')) continue;
      const x = c * TILE + TILE / 2, y = r * TILE;
      if (r < 14) continue;
      if (c % 31 === 5) { ctx.save(); ctx.globalAlpha = .85; standing(ctx, sheets, report, props, 3, x, y, 118); ctx.restore(); }
      if (c % 37 === 21) { ctx.save(); ctx.globalAlpha = .8; standing(ctx, sheets, report, props, 5, x, y, 72, 62.5, 63.3); ctx.restore(); }
      if (c % 13 === 9) standing(ctx, sheets, report, props, 9, x, y, 46);
      if (c % 19 === 15) standing(ctx, sheets, report, props, 8, x, y, 40);
      if (c % 23 === 12) standing(ctx, sheets, report, props, 10, x, y, 30);
      if (c % 9 === 7) standing(ctx, sheets, report, props, 4, x, y + 2, 18, 53, 58.5);
      if (c === 1) standing(ctx, sheets, report, 'castle-rewards', 3, x + 4, y, 34, 31, 31.5);
    }
  }
};

// Background decorations are placed behind the walkable terrain. Decorative
// vines hang below platforms, never over a jump's landing surface or a hazard.
const jungleScenery = (ctx: CanvasRenderingContext2D, w: World, sheets: Sheets, report: AssetReport, first: number, last: number): void => {
  for (let c = Math.max(0, first - 8); c <= Math.min(w.cols - 1, last + 8); c++) {
    for (let r = 0; r < ROWS; r++) {
      if (w.tiles[r][c] !== '#' || (r && w.tiles[r - 1][c] !== '.')) continue;
      const x = c * TILE, y = r * TILE;
      if (r >= 14 && c % 29 === 0) prop(ctx, sheets, report, 'jungle-props', 3, x - 76, y - 158, 132, 166);
      if (r >= 14 && c % 37 === 11) {
        ctx.save(); ctx.globalAlpha = .75;
        prop(ctx, sheets, report, 'jungle-props', 5, x - 32, y - 78, 76, 82);
        ctx.restore();
      }
      if (r >= 14 && c % 9 === 7) prop(ctx, sheets, report, 'jungle-props', 4, x - 12, y - 20, 38, 24);
      if (c === 1 && r >= 14) {
        prop(ctx, sheets, report, 'jungle-rewards', 3, x - 12, y - 55, 42, 55);
        prop(ctx, sheets, report, 'jungle-props', 2, x + 20, y - 70, 32, 70);
      }
      if (r < 14 && c % 2 === 0 && w.tiles[r + 1]?.[c] === '.') {
        prop(ctx, sheets, report, 'jungle-items', 6, x, y + TILE - 4, TILE, 26);
      }
    }
  }
};
