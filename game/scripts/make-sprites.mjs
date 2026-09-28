// Generates the CES Arcade placeholder sprite sheets and SWAP-LIST.md.
//
//   npm run art          regenerate placeholders that have not been replaced
//   npm run art -- --force   overwrite replaced art too (prints what it destroys)
//   npm run art:check    verify every sheet's size, the swap list and determinism
//
// Dev-only: never referenced from `npm run build`. The PNGs are committed, so
// the app fetches nothing at runtime. No npm dependency — the PNG encoder below
// is built on node:zlib.

import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { SPRITES, REUSED, PALETTE, sheetW, sheetH, expectedSizes, scaleOf } from '../src/platformer/sprites.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'public/assets/arcade');
const LEDGER = resolve(ROOT, 'scripts/.placeholders.json');
const SWAP = resolve(OUT, 'SWAP-LIST.md');

// ---------------------------------------------------------------------------
// Minimal PNG writer (RGBA, 8-bit, no interlace)
// ---------------------------------------------------------------------------
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

const crc32 = buf => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const encodePng = (w, h, rgba) => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // colour type: RGBA
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;  // filter: none
    rgba.copy ? rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4)
      : Buffer.from(rgba.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
};

// Reads width/height straight out of the PNG IHDR or WebP VP8/VP8L/VP8X header
// without decoding the image.
const imageSize = file => {
  const b = readFileSync(file);
  if (b.length >= 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length < 30 || b.toString('latin1', 0, 4) !== 'RIFF' || b.toString('latin1', 8, 12) !== 'WEBP') return null;
  const kind = b.toString('latin1', 12, 16);
  if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  if (kind === 'VP8L') { const bits = b.readUInt32LE(21); return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff) }; }
  if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  return null;
};

// ---------------------------------------------------------------------------
// Tiny pixel canvas
// ---------------------------------------------------------------------------
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 255];

const canvas = (w, h) => {
  const buf = Buffer.alloc(w * h * 4);
  const api = {
    w, h, buf,
    px(x, y, c) {
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= w || y >= h) return api;
      const i = (y * w + x) * 4;
      buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = c[3];
      return api;
    },
    rect(x, y, rw, rh, c) {
      for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) api.px(x + i, y + j, c);
      return api;
    },
    // 1px outline drawn just outside the given box.
    outline(x, y, rw, rh, c) {
      for (let i = -1; i <= rw; i++) { api.px(x + i, y - 1, c); api.px(x + i, y + rh, c); }
      for (let j = -1; j <= rh; j++) { api.px(x - 1, y + j, c); api.px(x + rw, y + j, c); }
      return api;
    },
    disc(cx, cy, r, c) {
      for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
        if (i * i + j * j <= r * r) api.px(cx + i, cy + j, c);
      }
      return api;
    },
  };
  return api;
};

const P = Object.fromEntries(Object.entries(PALETTE).map(([k, v]) => [k, hex(v)]));
const CLEAR = [0, 0, 0, 0];

// ---------------------------------------------------------------------------
// Placeholder art. Deliberately simple, on-palette and readable at 1x — it has
// to survive a demo without being mistaken for finished art.
// ---------------------------------------------------------------------------
const drawPlayer = c => {
  // 7 frames of 24x32. Body box is 12x22 at x 6..18, y 10..32; feet on row 31.
  const poses = [
    { legs: [[7, 26, 4, 6], [13, 26, 4, 6]], arm: 18, lift: 0 },   // idle
    { legs: [[6, 26, 4, 6], [14, 26, 4, 5]], arm: 19, lift: 0 },   // run-a
    { legs: [[9, 26, 5, 6], [12, 26, 4, 6]], arm: 17, lift: 1 },   // run-b
    { legs: [[7, 26, 4, 5], [14, 26, 4, 6]], arm: 19, lift: 0 },   // run-c
    { legs: [[8, 26, 4, 5], [13, 26, 4, 4]], arm: 14, lift: 1 },   // rise
    { legs: [[7, 27, 4, 5], [14, 27, 4, 5]], arm: 20, lift: 0 },   // fall
    { legs: [[8, 26, 4, 6], [13, 26, 4, 6]], arm: 13, lift: 1 },   // cheer
  ];
  poses.forEach((pose, f) => {
    const ox = f * 24;
    const y = -pose.lift;
    // legs
    for (const [lx, ly, lw, lh] of pose.legs) {
      c.rect(ox + lx, ly + y, lw, lh, P.deep).outline(ox + lx, ly + y, lw, lh, P.line);
    }
    // torso + belt
    c.rect(ox + 7, 17 + y, 11, 9, P.purple).outline(ox + 7, 17 + y, 11, 9, P.line);
    c.rect(ox + 7, 23 + y, 11, 2, P.gold);
    // arm
    c.rect(ox + 17, pose.arm + y, 3, 5, P.cream).outline(ox + 17, pose.arm + y, 3, 5, P.line);
    // head + hat
    c.rect(ox + 8, 10 + y, 9, 8, P.cream).outline(ox + 8, 10 + y, 9, 8, P.line);
    c.rect(ox + 7, 7 + y, 11, 3, P.purple).outline(ox + 7, 7 + y, 11, 3, P.line);
    c.rect(ox + 16, 7 + y, 3, 2, P.gold);
    // eyes (f === 6 cheers with closed eyes)
    if (f === 6) { c.rect(ox + 10, 14 + y, 2, 1, P.line); c.rect(ox + 14, 14 + y, 2, 1, P.line); }
    else { c.rect(ox + 10, 13 + y, 2, 2, P.line); c.rect(ox + 14, 13 + y, 2, 2, P.line); }
  });
};

const drawWalker = c => {
  // 3 frames of 20x20. Body box 14x12 at x 3..17, y 8..20.
  for (let f = 0; f < 2; f++) {
    const ox = f * 20;
    c.rect(ox + 3, 8, 14, 10, P.green).outline(ox + 3, 8, 14, 10, P.line);
    c.rect(ox + 5, 11, 3, 3, P.cream).rect(ox + 12, 11, 3, 3, P.cream);
    c.rect(ox + 6, 12, 2, 2, P.line).rect(ox + 13, 12, 2, 2, P.line);
    // feet alternate
    c.rect(ox + (f ? 3 : 5), 18, 4, 2, P.deep).outline(ox + (f ? 3 : 5), 18, 4, 2, P.line);
    c.rect(ox + (f ? 13 : 11), 18, 4, 2, P.deep).outline(ox + (f ? 13 : 11), 18, 4, 2, P.line);
  }
  // squashed
  const ox = 40;
  c.rect(ox + 2, 15, 16, 5, P.green).outline(ox + 2, 15, 16, 5, P.line);
  c.rect(ox + 5, 17, 2, 2, P.cream).rect(ox + 13, 17, 2, 2, P.cream);
};

const drawFlyer = c => {
  // 3 frames of 20x20. Body box 14x12 centred at x 3..17, y 4..16.
  for (let f = 0; f < 2; f++) {
    const ox = f * 20;
    const wy = f ? 9 : 4;
    c.rect(ox + 0, wy, 5, 4, P.deep).outline(ox + 0, wy, 5, 4, P.line);
    c.rect(ox + 15, wy, 5, 4, P.deep).outline(ox + 15, wy, 5, 4, P.line);
    c.rect(ox + 5, 6, 10, 9, P.vermilion).outline(ox + 5, 6, 10, 9, P.line);
    c.rect(ox + 7, 9, 2, 2, P.cream).rect(ox + 11, 9, 2, 2, P.cream);
    c.rect(ox + 8, 13, 4, 1, P.gold);
  }
  const ox = 40;
  c.rect(ox + 3, 13, 14, 4, P.vermilion).outline(ox + 3, 13, 14, 4, P.line);
  c.rect(ox + 6, 14, 2, 2, P.cream).rect(ox + 12, 14, 2, 2, P.cream);
};

const drawCoin = c => {
  // 4 frames of 16x16, widths shrinking to edge-on and back.
  [6, 4, 1, 4].forEach((r, f) => {
    const cx = f * 16 + 8;
    for (let j = -6; j <= 6; j++) {
      for (let i = -r; i <= r; i++) {
        if ((i * i) / (r * r || 1) + (j * j) / 36 <= 1) c.px(cx + i, 8 + j, P.gold);
      }
    }
    for (let j = -6; j <= 6; j++) {
      for (let i = -r - 1; i <= r + 1; i++) {
        const inside = (i * i) / ((r + 1) * (r + 1)) + (j * j) / 49 <= 1;
        const core = (i * i) / (r * r || 1) + (j * j) / 36 <= 1;
        if (inside && !core) c.px(cx + i, 8 + j, P.deep);
      }
    }
    if (r > 3) c.rect(cx - 1, 5, 2, 6, P.cream);
  });
};

const THEMES = {
  jungle: { top: P.green, fill: hex('#6b4526'), grit: hex('#8c5c33'), brick: hex('#8c5c33'), hazard: hex('#2f7fd0'), hazardLip: hex('#7fc4f2') },
  desert: { top: hex('#d9b36a'), fill: hex('#a8783c'), grit: hex('#c39a58'), brick: hex('#c39a58'), hazard: hex('#c9a13f'), hazardLip: hex('#e8ce86') },
  volcano: { top: hex('#4a4450'), fill: hex('#2b2530'), grit: hex('#3d3643'), brick: hex('#3d3643'), hazard: hex('#e05a1c'), hazardLip: hex('#ffb03a') },
  ice: { top: hex('#dbeafe'), fill: hex('#7aa7d9'), grit: hex('#a8c8ea'), brick: hex('#a8c8ea'), hazard: hex('#2f6fb0'), hazardLip: hex('#9fd4f5') },
  castle: { top: hex('#8a8f9e'), fill: hex('#4a4f5c'), grit: hex('#5f6572'), brick: hex('#5f6572'), hazard: hex('#2b4a7a'), hazardLip: hex('#6a9bd0') },
  canopy: { top: hex('#5fbf4a'), fill: hex('#7a4a28'), grit: hex('#99633a'), brick: hex('#99633a'), hazard: hex('#2f9fd0'), hazardLip: hex('#8fd8f5') },
  village: { top: hex('#c9b48f'), fill: hex('#8a7350'), grit: hex('#a58c63'), brick: hex('#a58c63'), hazard: hex('#3a7fc0'), hazardLip: hex('#8ec9f0') },
};

const drawTiles = (c, theme) => {
  const t = THEMES[theme];
  const cell = i => [(i % 5) * 16, Math.floor(i / 5) * 16];
  // 0 ground-top
  let [x, y] = cell(0);
  c.rect(x, y, 16, 16, t.fill).rect(x, y, 16, 5, t.top);
  c.rect(x + 2, y + 5, 3, 1, t.top).rect(x + 9, y + 5, 4, 1, t.top);
  c.rect(x + 4, y + 9, 2, 2, t.grit).rect(x + 11, y + 12, 2, 2, t.grit);
  // 1 ground-fill
  [x, y] = cell(1);
  c.rect(x, y, 16, 16, t.fill);
  c.rect(x + 3, y + 3, 2, 2, t.grit).rect(x + 10, y + 6, 3, 2, t.grit).rect(x + 5, y + 11, 2, 2, t.grit);
  // 2 brick
  [x, y] = cell(2);
  c.rect(x, y, 16, 16, t.brick);
  c.rect(x, y + 7, 16, 1, P.line).rect(x, y + 15, 16, 1, P.line);
  c.rect(x + 7, y, 1, 8, P.line).rect(x + 3, y + 8, 1, 8, P.line).rect(x + 12, y + 8, 1, 8, P.line);
  // 3 qblock-idle
  [x, y] = cell(3);
  c.rect(x, y, 16, 16, P.gold).outline(x + 1, y + 1, 14, 14, P.line);
  c.rect(x + 6, y + 4, 4, 2, P.line).rect(x + 9, y + 6, 2, 2, P.line);
  c.rect(x + 7, y + 8, 2, 2, P.line).rect(x + 7, y + 11, 2, 2, P.line);
  // 4 qblock-spent
  [x, y] = cell(4);
  c.rect(x, y, 16, 16, t.grit).outline(x + 1, y + 1, 14, 14, P.line);
  c.rect(x + 4, y + 7, 8, 2, P.line);
  // 5 spike (on transparency)
  [x, y] = cell(5);
  for (let s = 0; s < 2; s++) {
    for (let j = 0; j < 9; j++) {
      const half = Math.round((j / 8) * 3);
      c.rect(x + 4 + s * 8 - half, y + 15 - j, 1 + half * 2, 1, P.cream);
    }
  }
  c.rect(x, y + 14, 16, 2, t.grit);
  // 6 hazard-top, 7 hazard-fill
  [x, y] = cell(6);
  c.rect(x, y, 16, 16, t.hazard).rect(x, y, 16, 3, t.hazardLip);
  c.rect(x + 3, y + 6, 3, 1, t.hazardLip).rect(x + 10, y + 10, 4, 1, t.hazardLip);
  [x, y] = cell(7);
  c.rect(x, y, 16, 16, t.hazard);
  c.rect(x + 5, y + 4, 3, 1, t.hazardLip).rect(x + 9, y + 11, 3, 1, t.hazardLip);
  // 8 checkpoint-idle, 9 checkpoint-lit (on transparency)
  for (const [i, flagCol] of [[8, t.grit], [9, P.gold]]) {
    [x, y] = cell(i);
    c.rect(x + 6, y + 2, 2, 14, P.deep).outline(x + 6, y + 2, 2, 14, P.line);
    c.rect(x + 8, y + 3, 6, 5, flagCol).outline(x + 8, y + 3, 6, 5, P.line);
    if (i === 9) c.rect(x + 9, y + 4, 4, 3, P.cream);
  }
};

const DRAW = {
  player: drawPlayer,
  walker: drawWalker,
  flyer: drawFlyer,
  coin: drawCoin,
  'tiles-jungle': c => drawTiles(c, 'jungle'),
  'tiles-desert': c => drawTiles(c, 'desert'),
  'tiles-volcano': c => drawTiles(c, 'volcano'),
  'tiles-ice': c => drawTiles(c, 'ice'),
  'tiles-castle': c => drawTiles(c, 'castle'),
  'tiles-canopy': c => drawTiles(c, 'canopy'),
  'tiles-village': c => drawTiles(c, 'village'),
};

const renderSlot = slot => {
  const c = canvas(sheetW(slot), sheetH(slot));
  const draw = DRAW[slot.slot];
  if (!draw) throw new Error(`no placeholder painter for slot '${slot.slot}'`);
  draw(c);
  return encodePng(c.w, c.h, c.buf);
};

// ---------------------------------------------------------------------------
// SWAP-LIST.md
// ---------------------------------------------------------------------------
const sha = buf => createHash('sha256').update(buf).digest('hex');
const manifestHash = () => sha(JSON.stringify(SPRITES)).slice(0, 16);

const swapList = () => {
  const L = [];
  L.push('# CES Arcade — Art Swap List');
  L.push('');
  L.push('GENERATED FILE — do not edit by hand. Run `npm run art` to regenerate.');
  L.push(`manifest-hash: ${manifestHash()}`);
  L.push('');
  L.push('## How to hand off final art');
  L.push('');
  L.push('1. Overwrite the WebP image at the exact path below. Do not rename it, do not add a suffix.');
  L.push('2. Keep the grid: the same number of columns and rows, in the same frame order.');
  L.push('3. Frame size may be the listed size OR an exact 2x, 3x or 4x of it — the same');
  L.push('   multiple on BOTH axes. The exact authored-atlas size listed for a slot is also accepted.');
  L.push('4. Transparent background. No padding between frames, no gaps, no bleed.');
  L.push('   Authored atlases retain their original pixels; the browser trims transparent margins and assembles frames once at load. Terrain cells fill their full square.');
  L.push('5. Run `npm test`. A mis-sized sheet fails by slot name, with the size it expected.');
  L.push('');
  L.push('No TypeScript is touched. No rebuild configuration changes. Once a file stops');
  L.push('matching the placeholder we generated, `npm run art` will never overwrite it.');
  L.push('');
  L.push('Jungle review: open `jungle/preview.html`. Prompts and provenance: `jungle/ART.md`.');
  L.push('Each theme owns its folder. Files under `shared/` serve the other maps until their own artwork is approved.');
  L.push('Authored atlases and legacy sheets are always preserved by the placeholder generator.');
  L.push('');
  L.push(`## Sprite manifest — ${SPRITES.length} files`);
  L.push('');
  for (const s of SPRITES) {
    L.push(`### ${s.slot} — ${s.file}`);
    L.push('');
    L.push('| | |');
    L.push('|---|---|');
    L.push(`| Sheet size | ${expectedSizes(s)} |`);
    L.push(`| Frame size | ${s.frameW} x ${s.frameH} |`);
    L.push(`| Grid | ${s.cols} column${s.cols === 1 ? '' : 's'} x ${s.rows} row${s.rows === 1 ? '' : 's'} |`);
    L.push(`| Frame order | ${s.frames.map((f, i) => `${i} ${f}`).join(' · ')} |`);
    L.push(`| Rendering | ${s.pixelArt ? 'pixel art, nearest-neighbour' : 'smoothed'} |`);
    L.push('');
    for (const n of s.notes) L.push(`- ${n}`);
    L.push('');
  }
  L.push('## Palette used by the placeholders');
  L.push('');
  L.push(Object.entries(PALETTE).map(([k, v]) => `${v} ${k}`).join(' · '));
  L.push('');
  L.push('## Shared with the quiz — DO NOT replace these');
  L.push('');
  L.push('Replacing any file below also changes the Learning Quest quiz. If new art is');
  L.push('needed here, raise it as a separate change.');
  L.push('');
  L.push('| File | Size | Used by the arcade for |');
  L.push('|---|---|---|');
  for (const r of REUSED) L.push(`| ${r.file} | ${r.w} x ${r.h} | ${r.use} |`);
  L.push('');
  return L.join('\n');
};

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------
const readLedger = () => (existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, 'utf8')) : {});

const generate = force => {
  mkdirSync(OUT, { recursive: true });
  const ledger = readLedger();
  const next = {};
  let wrote = 0, kept = 0;
  for (const s of SPRITES) {
    const file = resolve(ROOT, 'public', s.file);
    if (s.source || s.slot.startsWith('legacy-')) {
      if (!existsSync(file)) throw new Error(`Authored artwork missing: ${s.file}`);
      console.log(`  ${s.slot.padEnd(14)} authored art preserved`);
      if (ledger[s.slot]) next[s.slot] = ledger[s.slot];
      kept++;
      continue;
    }
    const png = renderSlot(s);
    const fresh = sha(png);
    if (existsSync(file)) {
      const current = sha(readFileSync(file));
      const isOurs = ledger[s.slot] === current;
      if (!isOurs && !force) {
        console.log(`  ${s.slot.padEnd(14)} custom art kept, not regenerated`);
        next[s.slot] = ledger[s.slot] ?? current;
        kept++;
        continue;
      }
      if (!isOurs && force) console.log(`  ${s.slot.padEnd(14)} OVERWRITING CUSTOM ART at ${s.file}`);
    }
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, png);
    next[s.slot] = fresh;
    wrote++;
    console.log(`  ${s.slot.padEnd(14)} ${sheetW(s)}x${sheetH(s)}  ${(png.length / 1024).toFixed(1)} kB`);
  }
  writeFileSync(LEDGER, JSON.stringify(next, null, 1) + '\n');
  writeFileSync(SWAP, swapList());
  console.log(`\n${wrote} sheet(s) written, ${kept} kept. SWAP-LIST.md regenerated.`);
};

const check = () => {
  const problems = [];
  for (const s of SPRITES) {
    const file = resolve(ROOT, 'public', s.file);
    if (!existsSync(file)) { problems.push(`${s.slot}: missing ${s.file}`); continue; }
    const size = imageSize(file);
    if (!size) { problems.push(`${s.slot}: ${s.file} is not a PNG or WebP image`); continue; }
    const k = scaleOf(s, size.w, size.h);
    if (s.source?.frames) {
      if (s.source.frames.length !== s.frames.length) problems.push(`${s.slot}: source region count does not match runtime frames`);
      for (const [index, cell] of s.source.frames.entries()) {
        const sourceFile = cell.file ? resolve(ROOT, 'public', cell.file) : file;
        if (!existsSync(sourceFile)) { problems.push(`${s.slot} frame ${index}: missing ${cell.file}`); continue; }
        const sourceSize = imageSize(sourceFile), [x, y, w, h] = cell.rect;
        if (!sourceSize || x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > sourceSize.w || y + h > sourceSize.h) {
          problems.push(`${s.slot} frame ${index}: region ${cell.rect} exceeds ${cell.file ?? s.file}`);
        }
      }
    }
    if (!k) {
      problems.push(`${s.slot}: ${s.file}\n    expected ${expectedSizes(s)}  (${s.cols} x ${s.rows} frames of ${s.frameW} x ${s.frameH})\n    found    ${size.w}x${size.h}`);
    }
  }
  if (!existsSync(SWAP)) problems.push('SWAP-LIST.md is missing — run `npm run art`');
  else if (readFileSync(SWAP, 'utf8') !== swapList()) problems.push('SWAP-LIST.md is stale — run `npm run art`');

  // The simulation must never read a clock or a random number, or replay tests
  // and the recorded level solutions stop meaning anything.
  for (const f of ['src/platformer/engine.ts', 'src/platformer/levels.ts', 'src/platformer/render.ts']) {
    const p = resolve(ROOT, f);
    if (!existsSync(p)) continue;
    const src = readFileSync(p, 'utf8');
    for (const banned of ['Math.random', 'Date.now', 'performance.now', 'new Date(']) {
      if (src.includes(banned)) problems.push(`${f} contains ${banned} — the simulation must stay deterministic`);
    }
  }

  if (problems.length) {
    console.error('Art check FAILED:\n');
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log(`Art check OK — ${SPRITES.length} sheets, ${REUSED.length} reused assets, swap list current.`);
};

const args = process.argv.slice(2);
if (args.includes('--check')) check();
else generate(args.includes('--force'));
