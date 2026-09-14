// The single source of truth for every sprite the arcade draws.
//
// Nothing else in the repo may contain a sprite path, sheet size, frame size or
// frame order. Four consumers read this file: the placeholder generator
// (scripts/make-sprites.mjs), the runtime loader below, render.ts, and the
// generated SWAP-LIST.md the art team works from.
//
// Erasable TypeScript only — the Node scripts import this under type stripping,
// so there is no top-level DOM access here. `Image` is referenced only inside
// loadSheets(), which the browser alone ever calls.

import { assembleAtlas } from './atlas.ts';

export interface SpriteSlot {
  readonly slot: string;
  readonly file: string;
  readonly frameW: number;
  readonly frameH: number;
  readonly cols: number;
  readonly rows: number;
  readonly frames: readonly string[];
  readonly pixelArt: boolean;
  readonly notes: readonly string[];
  readonly source?: { readonly w: number; readonly h: number; readonly fit: 'actor' | 'coin' | 'tile' | 'prop' };
}

export interface ReusedSlot {
  readonly slot: string;
  readonly file: string;
  readonly w: number;
  readonly h: number;
  readonly use: string;
}

// The eight colours every placeholder is drawn from, lifted from styles.scss so
// the stand-in art reads as part of this app rather than as programmer art.
export const PALETTE = {
  ink: '#191940',
  line: '#211634',
  purple: '#8a38f5',
  deep: '#7025cd',
  gold: '#ffd774',
  cream: '#fff1d1',
  vermilion: '#df301c',
  green: '#4e9642',
} as const;

// The ten terrain cells, in the order every tiles-*.png must follow. The layout
// is the contract; only the pixels change between themes.
export const TILE_FRAMES = [
  'ground-top',
  'ground-fill',
  'brick',
  'qblock-idle',
  'qblock-spent',
  'spike',
  'hazard-top',
  'hazard-fill',
  'checkpoint-idle',
  'checkpoint-lit',
] as const;

const tileSlot = (theme: string, surface: string, hazard: string): SpriteSlot => ({
  slot: `tiles-${theme}`,
  file: `assets/arcade/${theme}/tiles.png`,
  frameW: 16,
  frameH: 16,
  cols: 5,
  rows: 2,
  frames: TILE_FRAMES,
  pixelArt: true,
  notes: [
    `${surface} terrain; cells 6-7 are ${hazard}.`,
    'Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.',
    'Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.',
    'Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.',
  ],
});

const CORE_SPRITES: readonly SpriteSlot[] = [
  {
    slot: 'player',
    file: 'assets/arcade/jungle/player.png',
    source: { w: 2032, h: 774, fit: 'actor' },
    frameW: 24,
    frameH: 32,
    cols: 7,
    rows: 1,
    frames: ['idle', 'run-a', 'run-b', 'run-c', 'rise', 'fall', 'cheer'],
    pixelArt: true,
    notes: [
      'Anchor is the bottom-centre of the frame.',
      'Collision box is 12 x 22 — art may overhang 6px each side and 10px above the head.',
      'Feet must sit on the last row of the frame or the character floats.',
      'Drawn facing RIGHT; the engine mirrors horizontally for left.',
      'run-a/b/c cycle every 8 ticks while moving; rise while ascending, fall while descending.',
    ],
  },
  {
    slot: 'walker',
    file: 'assets/arcade/jungle/walker.png',
    source: { w: 2172, h: 724, fit: 'actor' },
    frameW: 20,
    frameH: 20,
    cols: 3,
    rows: 1,
    frames: ['walk-a', 'walk-b', 'squashed'],
    pixelArt: true,
    notes: [
      'Anchor is the bottom-centre of the frame. Collision box is 14 x 12.',
      'walk-a/b alternate every 8 ticks.',
      'squashed shows for 20 ticks after a stomp, then the enemy is removed.',
      'Drawn facing RIGHT; the engine mirrors for left.',
    ],
  },
  {
    slot: 'flyer',
    file: 'assets/arcade/jungle/flyer.png',
    source: { w: 2172, h: 724, fit: 'actor' },
    frameW: 20,
    frameH: 20,
    cols: 3,
    rows: 1,
    frames: ['wing-up', 'wing-down', 'squashed'],
    pixelArt: true,
    notes: [
      'Anchor is the centre of the frame. Collision box is 14 x 12.',
      'wing-up/down alternate every 8 ticks.',
      'squashed shows for 20 ticks after a stomp, then the enemy is removed.',
      'Drawn facing RIGHT; the engine mirrors for left.',
    ],
  },
  {
    slot: 'coin',
    file: 'assets/arcade/jungle/coin.png',
    source: { w: 2172, h: 724, fit: 'coin' },
    frameW: 16,
    frameH: 16,
    cols: 4,
    rows: 1,
    frames: ['spin-0', 'spin-1', 'spin-2', 'spin-3'],
    pixelArt: true,
    notes: [
      'Fills its 16x16 tile. Keep a 2px clear margin all round so it never touches terrain.',
      'spin-0 is the full face, spin-2 is edge-on; the cycle advances every 8 ticks.',
    ],
  },
  { ...tileSlot('jungle', 'Mossy earth and stone', 'water'), source: { w: 1983, h: 793, fit: 'tile' } },
  tileSlot('desert', 'Sandstone', 'quicksand'),
  tileSlot('volcano', 'Charred basalt', 'lava'),
  tileSlot('ice', 'Packed snow over blue ice', 'freezing water'),
  tileSlot('castle', 'Cut castle stone', 'moat water'),
  tileSlot('canopy', 'Rich earth under thick moss', 'river water'),
  tileSlot('village', 'Village cobble and timber', 'river water'),
];

export const SPRITES: readonly SpriteSlot[] = [
  ...CORE_SPRITES,
  ...CORE_SPRITES.filter(s => ['player', 'walker', 'flyer', 'coin'].includes(s.slot)).map(s => ({
    ...s, slot: `legacy-${s.slot}`, file: `assets/arcade/shared/${s.slot}.png`, source: undefined,
  })),
  {
    slot: 'jungle-props', file: 'assets/arcade/jungle/props.png', frameW: 64, frameH: 64, cols: 4, rows: 2,
    frames: ['pipe', 'sign', 'goal', 'tree', 'bush', 'temple', 'crate', 'bridge'], pixelArt: true,
    source: { w: 1774, h: 887, fit: 'prop' }, notes: ['Each prop is sampled separately; scenery never changes collision geometry.'],
  },
  {
    slot: 'jungle-items', file: 'assets/arcade/jungle/items.png', frameW: 32, frameH: 32, cols: 4, rows: 2,
    frames: ['heart', 'star', 'mushroom', 'flower', 'plant', 'rocks', 'vine', 'portrait'], pixelArt: true,
    source: { w: 1774, h: 887, fit: 'prop' }, notes: ['Heart and portrait are HUD art; supplementary items do not imply power-up mechanics.'],
  },
  ...[
    { name: 'beetle', w: 2206, h: 713, frameW: 24, frameH: 20, frames: ['walk-1', 'walk-2', 'walk-3', 'walk-4', 'hurt', 'defeated', 'effect'] },
    { name: 'plant', w: 2120, h: 742, frameW: 24, frameH: 32, frames: ['inside', 'emerging', 'open', 'descending', 'hurt', 'defeated', 'effect'] },
    { name: 'parrot', w: 2079, h: 756, frameW: 24, frameH: 24, frames: ['fly-1', 'fly-2', 'fly-3', 'fly-4', 'hurt', 'defeated', 'effect'] },
  ].map(s => ({
    slot: `jungle-${s.name}`, file: `assets/arcade/jungle/${s.name}.png`, frameW: s.frameW, frameH: s.frameH,
    cols: 7, rows: 1, frames: s.frames, pixelArt: true,
    source: { w: s.w, h: s.h, fit: 'actor' as const },
    notes: ['Four action frames, hurt, defeated, and a separate defeat effect. Original atlas is assembled at load.'],
  })),
  {
    slot: 'jungle-rewards', file: 'assets/arcade/jungle/rewards.png', frameW: 32, frameH: 32, cols: 4, rows: 1,
    frames: ['gem', 'mushroom', 'star', 'sign'], pixelArt: true,
    source: { w: 2172, h: 724, fit: 'prop' }, notes: ['Gem: 50 points. Mushroom: restores one heart and grants 25 points. Star: one power charge.'],
  },
];

export const JUNGLE_BACKDROP = 'arcade/jungle/backdrop.png';

// Existing repo art the arcade draws. Replacing any of these also changes the
// quiz, so SWAP-LIST.md calls them out as off-limits.
export const REUSED: readonly ReusedSlot[] = [
  { slot: 'backdrop-jungle', file: 'assets/scenes/scene-discovery.png', w: 1535, h: 1024, use: 'Level 1 parallax backdrop' },
  { slot: 'backdrop-desert', file: 'assets/scenes/scene-science.png', w: 1536, h: 1024, use: 'Level 2 parallax backdrop' },
  { slot: 'backdrop-volcano', file: 'assets/scenes/scene-challenges.png', w: 1536, h: 1024, use: 'Level 3 parallax backdrop' },
  { slot: 'goal-flag', file: 'assets/props/flag.png', w: 664, h: 972, use: 'The in-world goal, drawn 40 x 58 on the G tile' },
  { slot: 'hud-life', file: 'assets/icons/icon-star.png', w: 128, h: 128, use: 'One 20x20 star per remaining life' },
  { slot: 'hud-coin', file: 'assets/icons/icon-medal-gold.png', w: 128, h: 128, use: '20x20 disc beside the coin counter' },
  { slot: 'level-token-jungle', file: 'assets/islands/island-discovery.png', w: 1536, h: 1024, use: 'Level-select card art' },
  { slot: 'level-token-desert', file: 'assets/islands/island-science.png', w: 1536, h: 1024, use: 'Level-select card art' },
  { slot: 'level-token-volcano', file: 'assets/islands/island-maths.png', w: 1536, h: 1024, use: 'Level-select card art' },
  { slot: 'panel-jungle', file: 'assets/panels/panel-discovery.png', w: 1672, h: 941, use: 'Pause / cleared / game-over dialog surface' },
  { slot: 'panel-desert', file: 'assets/panels/panel-science.png', w: 1672, h: 941, use: 'Pause / cleared / game-over dialog surface' },
  { slot: 'panel-volcano', file: 'assets/panels/panel-challenges.png', w: 1672, h: 941, use: 'Pause / cleared / game-over dialog surface' },
  { slot: 'result-trophy', file: 'assets/props/trophy.png', w: 1357, h: 1159, use: 'Level-complete dialog' },
];

export type Sheets = Record<string, HTMLImageElement | HTMLCanvasElement>;

export interface AssetIssue {
  readonly slot: string;
  readonly file: string;
  readonly expected: string;
  readonly found: string;
}

export interface AssetReport {
  readonly ok: boolean;
  readonly issues: readonly AssetIssue[];
  readonly scale: Record<string, number>;
}

export const sheetW = (s: SpriteSlot): number => s.frameW * s.cols;
export const sheetH = (s: SpriteSlot): number => s.frameH * s.rows;

export const expectedSizes = (s: SpriteSlot): string => {
  const sizes = [1, 2, 3, 4].map(k => `${sheetW(s) * k}x${sheetH(s) * k}`);
  if (s.source) sizes.push(`${s.source.w}x${s.source.h} authored atlas (assembled to 4x at load)`);
  return sizes.join(' / ');
};

// A replacement is accepted at the declared size or any exact 1x-4x multiple,
// the same multiple on both axes. This is what lets the art team raise fidelity
// with no code change. Returns 0 when the sheet is not an accepted size.
export const scaleOf = (s: SpriteSlot, w: number, h: number): number => {
  if (s.source && w === s.source.w && h === s.source.h) return 4;
  for (let k = 1; k <= 4; k++) {
    if (w === sheetW(s) * k && h === sheetH(s) * k) return k;
  }
  return 0;
};

// Source rectangle for one frame, already multiplied by the sheet's scale.
export const frameRect = (s: SpriteSlot, index: number, k: number): readonly [number, number, number, number] => {
  const col = index % s.cols;
  const row = Math.floor(index / s.cols);
  return [col * s.frameW * k, row * s.frameH * k, s.frameW * k, s.frameH * k];
};

const CANVAS_REUSED: readonly string[] = ['goal-flag'];

export const loadSheets = async (): Promise<{ sheets: Sheets; report: AssetReport }> => {
  const sheets: Sheets = {};
  const issues: AssetIssue[] = [];
  const scale: Record<string, number> = {};
  await Promise.all(SPRITES.map(async s => {
    const img = new Image();
    img.src = s.file;
    try {
      await img.decode();
    } catch {
      issues.push({ slot: s.slot, file: s.file, expected: expectedSizes(s), found: 'file missing or not decodable' });
      return;
    }
    const k = scaleOf(s, img.naturalWidth, img.naturalHeight);
    if (!k) {
      issues.push({
        slot: s.slot,
        file: s.file,
        expected: `${expectedSizes(s)}  (${s.cols} x ${s.rows} frames of ${s.frameW} x ${s.frameH})`,
        found: `${img.naturalWidth}x${img.naturalHeight}`,
      });
      return;
    }
    sheets[s.slot] = s.source && img.naturalWidth === s.source.w && img.naturalHeight === s.source.h
      ? assembleAtlas(img, s) : img;
    scale[s.slot] = k;
  }));
  await Promise.all(CANVAS_REUSED.map(async name => {
    const r = REUSED.find(x => x.slot === name);
    if (!r) return;
    const img = new Image();
    img.src = r.file;
    try {
      await img.decode();
      sheets[r.slot] = img;
    } catch {
      issues.push({ slot: r.slot, file: r.file, expected: `${r.w}x${r.h}`, found: 'file missing or not decodable' });
    }
  }));
  return { sheets, report: { ok: issues.length === 0, issues, scale } };
};
