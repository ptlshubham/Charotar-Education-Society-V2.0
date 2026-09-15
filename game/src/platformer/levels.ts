// Constants, tuning and level data for the CES Arcade platformer.
// Erasable TypeScript only (no enum, no namespace, no decorators) so that
// scripts/verify.mjs can import this file under Node's type stripping,
// exactly as it already does for questions.ts.

export const TICK_HZ = 60;
export const TILE = 16;
export const VIEW_W = 512;
export const VIEW_H = 288;
/**
 * Supersample factor: the canvas backing store is VIEW_W×VIEW_H × this, so the
 * game world (still simulated in 512×288 units) is rendered at a higher
 * resolution. Keeps high-res backdrops sharp while pixel-art tiles stay crisp at
 * this integer scale. Must be a whole number.
 */
export const RENDER_SCALE = 3;
export const ROWS = 18;
export const EPS = 0.001;

// Clear columns a question block needs either side of any pit or spike.
export const BLOCK_CLEARANCE = 4;

export const SOLID = '#B?!=HI';
export const HAZARD = '^~';

// Pixels per tick and pixels per tick squared. step() never multiplies by dt
// because there is only ever one dt.
export const PHYS = {
  gravityRise: 0.40,
  gravityFall: 0.55,
  maxFall: 8.0,
  jumpV: -6.20,
  jumpCut: -3.60,
  runAccel: 0.35,
  turnAccel: 0.75,
  airAccel: 0.30,
  frictionGround: 0.40,
  frictionAir: 0.06,
  maxRun: 2.20,
  coyote: 6,
  buffer: 6,
  stompBounce: -4.50,
  stompGrace: 4,
  walkerSpeed: 0.50,
  flyerAmpX: 48,
  flyerAmp: 20,
  flyerPeriod: 160,
  squashTicks: 20,
  startLives: 3,
  coinScore: 10,
  stompScore: 50,
  clearScore: 100,
  pitMargin: 64,
  maxCatchUp: 5,
} as const;

export const PLAYER_W = 12;
export const PLAYER_H = 22;
export const ENEMY_W = 14;
export const ENEMY_H = 12;

// The simulation is discrete Euler (vy += g, then y += vy), so the jump
// envelope is a finite sum, NOT the continuous v^2/2g. Getting this wrong
// silently puts question blocks out of reach, so it is computed here and
// asserted by scripts/verify.mjs rather than written down as a comment.
export const jumpRiseTicks = (): number => {
  let vy: number = PHYS.jumpV;
  let ticks = 0;
  while (vy < 0) { vy += PHYS.gravityRise; ticks++; }
  return ticks;
};

export const jumpApexPx = (): number => {
  let vy: number = PHYS.jumpV;
  let rise = 0;
  while (vy < 0) { vy += PHYS.gravityRise; rise -= vy < 0 ? vy : 0; }
  return rise;
};

export const jumpAirTicks = (): number => {
  let vy: number = PHYS.jumpV;
  let y = 0;
  let ticks = 0;
  // Rise with the held-jump gravity, fall with the heavier one, until back to 0.
  for (;;) {
    vy += vy < 0 ? PHYS.gravityRise : PHYS.gravityFall;
    if (vy > PHYS.maxFall) vy = PHYS.maxFall;
    y += vy;
    ticks++;
    if (y >= 0) return ticks;
    if (ticks > 600) return ticks;
  }
};

export const jumpRangePx = (): number => jumpAirTicks() * PHYS.maxRun;

export interface Level {
  readonly id: 'jungle' | 'desert' | 'volcano' | 'ice' | 'castle' | 'canopy' | 'village';
  readonly name: string;
  readonly theme: 'jungle' | 'desert' | 'volcano' | 'ice' | 'castle' | 'canopy' | 'village';
  readonly backdrop: string;
  readonly token: string;
  readonly zoneClass: string;
  readonly panel: string;
  readonly rows: readonly string[];
  readonly tickBudget: number;
  readonly solution: string;
}

/**
 * Themes that play the full ruleset: three hearts per life, star power, a level
 * timer and multi-frame enemy defeats. Every other theme keeps the classic
 * one-hit rules. Each needs its own `<theme>-*` sheets in sprites.ts.
 */
export const RICH_THEMES: readonly Level['theme'][] = ['jungle', 'castle', 'desert', 'ice', 'volcano', 'village', 'canopy'];
export const isRich = (theme: Level['theme']): boolean => RICH_THEMES.includes(theme);

/** Themes whose flyers hover in place instead of sweeping side to side. */
export const HOVER_FLYERS: readonly Level['theme'][] = ['jungle'];

// Authored rows are top-padded to exactly ROWS, so a level file carries only
// the rows that have something in them. Authored row n becomes world row
// n + (ROWS - rows.length).
export const expandRows = (level: Level): string[] => {
  const pad = ROWS - level.rows.length;
  if (pad < 0) throw new Error(`${level.id}: ${level.rows.length} rows exceeds ${ROWS}`);
  const width = level.rows[0].length;
  const out: string[] = [];
  for (let i = 0; i < pad; i++) out.push('.'.repeat(width));
  for (const row of level.rows) out.push(row);
  return out;
};

const solidCell = (grid: readonly string[], col: number, row: number): boolean => {
  if (row < 0 || row >= grid.length) return false;
  if (col < 0 || col >= grid[row].length) return true;
  return SOLID.includes(grid[row][col]);
};

// Every geometric assumption the level data relies on, checked once at load.
// A level that trips any of these is a level nobody can finish, so this throws
// rather than warns.
export const validateLevel = (level: Level): void => {
  const grid = expandRows(level);
  const width = grid[0].length;
  const where = (msg: string): string => `${level.id}: ${msg}`;

  grid.forEach((row, r) => {
    if (row.length !== width) throw new Error(where(`row ${r} is ${row.length} chars, expected ${width}`));
  });

  const count = (ch: string): number => grid.reduce((n, row) => n + [...row].filter(c => c === ch).length, 0);
  if (count('P') !== 1) throw new Error(where(`needs exactly one 'P', found ${count('P')}`));
  if (count('G') !== 1) throw new Error(where(`needs exactly one 'G', found ${count('G')}`));
  if (!level.rows.length) throw new Error(where('has no rows'));

  const apex = jumpApexPx();
  const range = jumpRangePx();

  grid.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      if ('PGwbp'.includes(ch)) {
        if (!solidCell(grid, c, r + 1)) throw new Error(where(`'${ch}' at col ${c} row ${r} is not standing on solid ground`));
        if (SOLID.includes(ch)) throw new Error(where(`'${ch}' at col ${c} row ${r} overlaps solid`));
      }
      if (ch === 'c' && solidCell(grid, c, r)) throw new Error(where(`checkpoint at col ${c} row ${r} is inside a solid`));
      // Flyers ignore tile collision, so their whole swept box must be clear or
      // they sink into geometry and become unstompable, unavoidable damage.
      if (ch === 'f') {
        const homeX = c * TILE + (TILE - ENEMY_W) / 2;
        const homeY = (r + 1) * TILE - ENEMY_H;
        const horizontal = HOVER_FLYERS.includes(level.theme) ? 0 : PHYS.flyerAmpX;
        const c0 = Math.floor((homeX - horizontal) / TILE);
        const c1 = Math.floor((homeX + horizontal + ENEMY_W - EPS) / TILE);
        const r0 = Math.floor((homeY - PHYS.flyerAmp) / TILE);
        const r1 = Math.floor((homeY + PHYS.flyerAmp + ENEMY_H - EPS) / TILE);
        for (let rr = r0; rr <= r1; rr++) {
          for (let cc = c0; cc <= c1; cc++) {
            if (solidCell(grid, cc, rr)) {
              throw new Error(where(`flyer at col ${c} row ${r} sweeps into solid at col ${cc} row ${rr} — move it clear of cols ${c0}-${c1}, rows ${r0}-${r1}`));
            }
          }
        }
      }
    });
  });

  // Ground-level jump reachability: every '?' must sit where a jump from the
  // floor directly beneath it actually reaches.
  grid.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      if (ch !== '?') return;
      let floorRow = -1;
      for (let rr = r + 1; rr < grid.length; rr++) {
        if (solidCell(grid, c, rr)) { floorRow = rr; break; }
      }
      if (floorRow < 0) return;
      const headStanding = floorRow * TILE - PLAYER_H;
      const headApex = headStanding - apex;
      const blockBottom = (r + 1) * TILE;
      if (headApex >= blockBottom) {
        throw new Error(where(`'?' at col ${c} row ${r} is unreachable: a jump from row ${floorRow} lifts the head to y=${headApex.toFixed(1)} but the block's underside is y=${blockBottom}`));
      }
    });
  });

  // A question block close to a pit or spikes is a trap: the head-bump cuts the
  // jump short and drops the player straight into the hazard. Keep them apart.
  const hazardCols = new Set<number>();
  grid.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch === '^' || ch === '~') hazardCols.add(c);
    if (!solidCell(grid, c, r) && r === grid.length - 1) hazardCols.add(c);
  }));
  grid.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch !== '?') return;
    for (let d = -BLOCK_CLEARANCE; d <= BLOCK_CLEARANCE; d++) {
      if (hazardCols.has(c + d)) {
        throw new Error(where(`'?' at col ${c} is ${Math.abs(d)} column(s) from the hazard at col ${c + d}; a head-bump there drops the player into it. Keep ${BLOCK_CLEARANCE} clear columns either side.`));
      }
    }
  }));

  if (range < 3 * TILE) throw new Error(where(`jump range ${range.toFixed(1)}px cannot clear the 3-tile gaps this level uses`));
};

export const countCoins = (level: Level): number => {
  const grid = expandRows(level);
  return grid.reduce((n, row) => n + [...row].filter(c => c === 'o' || c === '?').length, 0);
};

// ---------------------------------------------------------------------------
// Level 1 — Jungle Run. 120 columns, 12 authored rows (world rows 6..17).
//
// World row 16 is the ground surface (top y = 256), so the player stands at
// y = 234 with their head at 234. A jump lifts the head 45px to y = 189.
//   authored 6  -> world 12 (y 192..208)  question blocks + flyers
//   authored 8  -> world 14 (y 224..240)  floating platforms
//   authored 9  -> world 15               ground-level entities
//   authored 10 -> world 16               ground surface
//   authored 11 -> world 17               bedrock / lava
// Flyers live on world row 12 so a running player (head y 234) passes safely
// beneath them while a jumping player (feet y 211 at apex) can still stomp.
// ---------------------------------------------------------------------------
const EMPTY = '.'.repeat(120);

// Jungle World: three connected clearings. A tile is collision geometry first;
// bridges and pipes are real surfaces, with artwork selected by the renderer.
const jungleRows = (): string[] => {
  const grid = Array.from({ length: ROWS }, () => Array<string>(96).fill('.'));
  const rect = (x: number, y: number, width: number, height: number, ch = '#'): void => {
    for (let r = y; r < y + height; r++) for (let c = x; c < x + width; c++) grid[r][c] = ch;
  };
  const put = (x: number, y: number, text: string): void => { [...text].forEach((ch, i) => grid[y][x + i] = ch); };
  rect(0, 14, 13, 4); rect(13, 14, 6, 1, '='); rect(13, 15, 6, 3, '~');
  rect(19, 14, 9, 4); rect(28, 15, 7, 3); rect(35, 14, 15, 4);
  rect(21, 13, 2, 1); rect(23, 12, 2, 2);
  rect(31, 12, 4, 1); rect(28, 10, 3, 1);
  rect(29, 13, 2, 1, 'H'); rect(29, 14, 2, 1, 'I');
  put(3, 13, 'P'); put(10, 13, 'm'); put(16, 13, 'b');
  put(7, 11, 'B?B'); put(7, 10, 'ooo'); put(19, 7, 'f');
  put(21, 12, '^'); put(23, 11, 'w'); put(28, 9, 'ooo'); put(33, 11, 'p');
  put(27, 13, 'B'); put(25, 13, 'g'); put(37, 13, 'c');
  put(40, 11, 'B?B'); put(40, 10, 'oso'); put(46, 13, 'w');
  rect(50, 14, 5, 1, '='); rect(50, 15, 5, 3, '~'); rect(55, 14, 15, 4);
  put(52, 13, 'b'); put(58, 13, 'm'); put(63, 13, 'p'); put(66, 13, 's');
  rect(59, 12, 3, 1); put(60, 11, 'g'); put(67, 9, 'f');
  rect(70, 17, 3, 1, '~'); rect(73, 14, 23, 4);
  put(76, 11, 'B?B'); put(76, 10, 'ooo'); put(81, 13, 'b'); put(85, 13, 'm');
  rect(88, 13, 3, 1); rect(91, 12, 5, 2); put(89, 12, 'g'); put(94, 11, 'G');
  return grid.map(row => row.join(''));
};

export const jungle: Level = {
  id: 'jungle',
  name: 'Jungle Run',
  theme: 'jungle',
  backdrop: 'scenes/scene-discovery.png',
  token: 'islands/island-discovery.png',
  zoneClass: 'zone-discovery',
  panel: 'panels/panel-discovery.png',
  tickBudget: 3600,
  // Recorded with the in-game recorder (window.__cesArcade.recordStart/Stop).
  // Re-record after any change to PHYS or to this level's geometry.
  solution: '>40}4>56}4>8.8>4<8^4}16>4}4>8.8}8>32}4>24}12>36}4>104}8>28}4>52}16>48}4>8}4>48}4>12}4>36',
  rows: jungleRows(),
};

export const desert: Level = {
  id: 'desert',
  name: 'Dune Dash',
  theme: 'desert',
  backdrop: 'scenes/scene-science.png',
  token: 'islands/island-science.png',
  zoneClass: 'zone-science',
  panel: 'panels/panel-science.png',
  tickBudget: 4500,
  solution: '>112}6>73}8>79}6>52}8>123}8>79}6>67}8>37}6>47}8>22}8>93}6>52}8>101}6>16',
  rows: [
    '......................................................................................................................................................',
    '......................................................................................................................................................',
    '......................................................................................................................................................',
    '......................................................................................................................................................',
    '......................................................................................................................................................',
    '......................................................................................................................................................',
    '..............?......................B?B....................?...........................................................f.............................',
    '..............................................oo..................................................oo..................................................',
    '............................................######..............................................######................................................',
    '...P........oo..........w.oo........o...o...........wo..........oo........c...w.oo........^^..o.................wo......oo..............oo..w...G.....',
    '##############################...###################################...###################################...###################...###################',
    '##############################~~~###################################~~~###################################~~~###################~~~###################',
  ],
};

export const volcano: Level = {
  id: 'volcano',
  name: 'Ember Climb',
  theme: 'volcano',
  backdrop: 'scenes/scene-challenges.png',
  token: 'islands/island-maths.png',
  zoneClass: 'zone-challenges',
  panel: 'panels/panel-challenges.png',
  tickBudget: 5400,
  solution: '>94}8>58}14>77}8>42}14>79}14>45}14>26}8>42}14>73}14>22}8>47}8>42}14>79}14>45}14>27}8>42}14>73}14>138}8>48',
  rows: [
    '....................................................................................................................................................................................',
    '....................................................................................................................................................................................',
    '....................................................................................................................................................................................',
    '....................................................................................................................................................................................',
    '....................................................................................................................................................................................',
    '....................................................................................................................................................................................',
    '................?.................f............B?B............................?...............f............B?B............................?...............f.........................',
    '........................................oo............................oo............................oo............................oo................................................',
    '......................................######........................######........................######........................######..............................................',
    '...P........oo......w.oo............................w.........oo^^................wo........c...o...............wo........oo^^................wo........o.........wo......w...G.....',
    '##########################...###########################...###########################...###########################...###########################...###############################',
    '##########################~~~###########################~~~###########################~~~###########################~~~###########################~~~###############################',
  ],
};

export const ice: Level = {
  id: 'ice',
  name: 'Frost Trail',
  theme: 'ice',
  backdrop: 'scenes/scene-world.png',
  token: 'islands/island-world.png',
  zoneClass: 'zone-world',
  panel: 'panels/panel-world.png',
  tickBudget: 5000,
  solution: '>171}8>113}8>147}8>44}8>63}8>270}8>69}8>46}8>64}8>160}8>100}8>257',
  rows: [
    '...................................................................................................................................................................................................................................',
    '...................................................................................................................................................................................................................................',
    '...................................................................................................................................................................................................................................',
    '...................................................................................................................................................................................................................................',
    '...................................................................................................................................................................................................................................',
    '...................................................................................................................................................................................................................................',
    '.....................B?B............................................................f................................................................................................B?B...........................................',
    '...................................................................oo................................................................oo............................................................................................',
    '.................................................................######............................................................######..........................................................................................',
    '...P.......o..o.......o..........w...........o........o..o.........................................w.........c..........o..........................^^..........w...........o..........o........o..o.......w........o..o......G.....',
    '############################################...########################################################################...################################################...######################################################',
    '############################################~~~########################################################################~~~################################################~~~######################################################',
  ],
};

// Castle World: gatehouse, spike-moat bridge, tower yard, great hall, water moat,
// courtyard, spike pit and the keep. Built the same way as jungleRows.
const castleRows = (): string[] => {
  const grid = Array.from({ length: ROWS }, () => Array<string>(104).fill('.'));
  const rect = (x: number, y: number, width: number, height: number, ch = '#'): void => {
    for (let r = y; r < y + height; r++) for (let c = x; c < x + width; c++) grid[r][c] = ch;
  };
  const put = (x: number, y: number, text: string): void => { [...text].forEach((ch, i) => grid[y][x + i] = ch); };
  rect(0, 14, 14, 4); put(3, 13, 'P'); put(6, 11, 'B?B'); put(6, 10, 'ooo'); put(11, 13, 'g');
  rect(14, 14, 6, 1, '='); rect(14, 17, 6, 1, '^'); put(17, 13, 'w');
  rect(20, 14, 18, 4); rect(23, 13, 2, 1); rect(25, 12, 2, 2); put(25, 11, 'w');
  rect(30, 12, 2, 1, 'H'); rect(30, 13, 2, 1, 'I'); rect(33, 11, 4, 1); put(33, 10, 'ooo');
  put(28, 8, 'f'); put(36, 13, 'c');
  rect(38, 14, 18, 4); put(42, 11, 'B?B'); put(42, 10, 'oso'); put(48, 13, 'w'); put(50, 9, 'f'); put(53, 13, 'B');
  rect(56, 14, 5, 1, '='); rect(56, 15, 5, 3, '~');
  rect(61, 14, 16, 4); put(63, 13, 'm'); put(68, 13, 'p'); rect(71, 12, 3, 1); put(72, 11, 'g'); put(74, 13, 'w');
  rect(77, 17, 3, 1, '^');
  rect(80, 14, 24, 4); put(84, 11, 'B?B'); put(84, 10, 'ooo'); put(89, 13, 'w'); put(91, 9, 'f'); put(92, 13, 'm');
  rect(95, 13, 3, 1); rect(98, 12, 6, 2); put(96, 12, 'g'); put(101, 11, 'G');
  return grid.map(row => row.join(''));
};

export const castle: Level = {
  id: 'castle',
  name: 'Castle Climb',
  theme: 'castle',
  backdrop: 'scenes/scene-brain.png',
  token: 'islands/island-brain.png',
  zoneClass: 'zone-brain',
  panel: 'panels/panel-brain.png',
  tickBudget: 3600,
  solution: '>32}4>28}16>44}4>24}16>12}8>12}4>44}4>40}4>40}4>16}4>44}8>20}8>16}8>16}8>12}4>32}4>60}4>16}4>28}4>16}4>36}8>40',
  rows: castleRows(),
};

export const canopy: Level = {
  id: 'canopy',
  name: 'Canopy Dash',
  theme: 'canopy',
  backdrop: 'scenes/scene-knowledge.png',
  token: 'islands/island-knowledge.png',
  zoneClass: 'zone-knowledge',
  panel: 'panels/panel-knowledge.png',
  tickBudget: 6200,
  solution: '>171}8>113}8>81}8>44}8>75}8>199}8>80}8>118}8>100}8>44}8>137}8>174}8>43}8>161}8>44}8>137}8>165}8>47',
  rows: [
    '..................................................................................................................................................................................................................................................................................................',
    '..................................................................................................................................................................................................................................................................................................',
    '..................................................................................................................................................................................................................................................................................................',
    '..................................................................................................................................................................................................................................................................................................',
    '..................................................................................................................................................................................................................................................................................................',
    '..................................................................................................................................................................................................................................................................................................',
    '.....................B?B...................................................f.................................................B?B............................................................f..........................B?B........................................................................',
    '..........................................................oo........................................................................................oo...............................................................................oo...........................................................',
    '........................................................######....................................................................................######...........................................................................######.........................................................',
    '...P.......o..o.......o..........w...........o............................................w...........^^...........o..........o.........c........................w...........o..............................^^..........o.........................w...........o........o..o.......w.........G.....',
    '############################################...###################################################################...#######################################################...##############################################################################...##################################',
    '############################################~~~###################################################################~~~#######################################################~~~##############################################################################~~~##################################',
  ],
};

export const village: Level = {
  id: 'village',
  name: 'Circuit Run',
  theme: 'village',
  backdrop: 'scenes/scene-tech.png',
  token: 'islands/island-tech.png',
  zoneClass: 'zone-tech',
  panel: 'panels/panel-tech.png',
  tickBudget: 6600,
  solution: '>171}8>113}8>81}8>44}8>152}8>42}8>160}8>118}8>100}8>44}8>137}8>174}8>123}8>81}8>44}8>137}8>293}8>57',
  rows: [
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................................................................................................................................................................................................................................................................................................................',
    '.....................B?B...................................................f.................................................B?B............................................................f.............B?B................................................................f.......................................',
    '..........................................................oo........................................................................................oo...............................................................................oo..............................................................................',
    '........................................................######....................................................................................######...........................................................................######............................................................................',
    '...P.......o..o.......o..........w...........o.............................................^^..........w...........o..........o.........c........................w...........o.............................o...........^^.........................w...........o.............................w........o..o......G.....',
    '############################################...###################################################################...#######################################################...##############################################################################...#####################################################',
    '############################################~~~###################################################################~~~#######################################################~~~##############################################################################~~~#####################################################',
  ],
};

// Add the supplied creatures to optional raised routes, leaving every existing
// ground-level jump envelope and recorded route intact.
const completeWorld = (level: Level): Level => {
  if (level.theme === 'jungle') return level;
  const grid = expandRows(level).map(row => [...row]);
  let pickup = 0, platform = 0;
  grid.forEach((row, r) => row.forEach((ch, c) => {
    if (ch === 'o' && r >= 15) {
      pickup++;
      if (pickup % 6 === 2) row[c] = 's';
      else if (pickup % 6 === 4) row[c] = 'm';
      else if (pickup % 6 === 0) row[c] = 'g';
    }
    if (ch === '#' && r >= 12 && r <= 14 && c > 1 && row[c - 1] !== '#' && row[c + 3] === '#'
      && grid[r - 1][c + 1] === '.' && grid[r - 2][c + 1] === '.') {
      platform++;
      grid[r - 1][c + 1] = platform % 2 || level.theme === 'village' ? 'b' : 'p';
    }
  }));
  if (level.theme === 'castle') {
    outer: for (const row of grid) for (let c = 0; c < row.length; c++) if (row[c] === 'w') { row[c] = 'b'; break outer; }
  }
  return { ...level, rows: grid.map(row => row.join('')) };
};

export const levels: readonly Level[] = [jungle, desert, volcano, ice, castle, canopy, village].map(completeWorld);

export const levelIndexById = (id: string): number => levels.findIndex(l => l.id === id);
