import type { AtlasFrame, SpriteSlot } from './sprites.ts';
import { WORLD_REGIONS } from './world-regions.ts';

type Theme = 'desert' | 'ice' | 'volcano' | 'village';
type Rect = readonly [number, number, number, number];
const file = (theme: Theme, name: string): string => `assets/arcade/${theme}/${name === 'terrain' ? 'tiles' : name}.webp`;
const cell = (theme: Theme, name: string, rect: Rect, crop?: Rect, fit?: 'fill' | 'contain'): AtlasFrame => ({ file: file(theme, name), rect, crop, fit });
const region = (rect: Rect): AtlasFrame => ({ rect });
const strip = (theme: Theme, name: 'player' | 'beetle' | 'flyer' | 'plant' | 'walker', width: number, height: number, count: number,
  frameW: number, frameH: number, frames: readonly string[], frameMap?: readonly number[], flipX = false): SpriteSlot => ({
  slot: `${theme}-${name}`, file: file(theme, name), frameW, frameH, cols: frames.length, rows: 1, frames, pixelArt: true,
  source: { w: width, h: height, fit: 'actor', grid: [count, 1], frameMap, keyBlack: true, flipX,
    frames: frames.map((_, i) => region((WORLD_REGIONS[theme] as Partial<Record<typeof name, readonly Rect[]>>)[name]![frameMap?.[i] ?? i])) },
  notes: ['Supplied artwork. Black matte is keyed at load; source image bytes stay intact.', 'Frame mapping follows the supplied poses; missing poses reuse an existing frame.'],
});
const playerFrames = ['idle', 'run-a', 'run-b', 'run-c', 'rise', 'fall', 'cheer'];
const enemyFrames = ['move-1', 'move-2', 'move-3', 'move-4', 'hurt', 'defeated', 'effect'];
const plantFrames = ['inside', 'emerging', 'open', 'descending', 'hurt', 'defeated', 'effect'];
const dims = { desert: [1774, 887], ice: [1672, 941], volcano: [2172, 724], village: [1916, 821] } as const;
const actors: SpriteSlot[] = [];
for (const theme of Object.keys(dims) as Theme[]) {
  const [w, h] = dims[theme];
  const village = theme === 'village';
  actors.push(strip(theme, 'player', w, h, village ? 5 : 8, 24, 32, playerFrames, village ? [0, 1, 2, 3, 3, 4, 0] : [0, 1, 2, 3, 5, 6, 7]));
  actors.push(strip(theme, 'beetle', w, h, village ? 4 : 7, 24, 20, enemyFrames, village ? [0, 1, 2, 1, 2, 3, 3] : undefined, true));
  actors.push(strip(theme, 'flyer', w, h, village ? 4 : 7, 24, 24, enemyFrames, village ? [0, 1, 2, 3, 2, 3, 3] : undefined, theme === 'village'));
  if (!village) actors.push(strip(theme, 'plant', w, h, 7, 24, 32, plantFrames));
  if (theme !== 'ice') actors.push(strip(theme, 'walker', w, h, village ? 3 : 5, 20, 20, ['walk-a', 'walk-b', 'squashed'], village ? [0, 1, 2] : [0, 1, 4], true));
}

const pickups = {
  desert: { w: 1448, h: 1086, coin: [[37,388,256,291], [545,388,205,291], [360,388,110,291], [545,388,205,291]], gem: [806,388,261,291], mushroom: [1108,388,304,291] },
  ice: { w: 1448, h: 1086, coin: [[483,645,175,224], [732,645,120,224], [936,645,64,224], [732,645,120,224]], gem: [1117,645,206,224], mushroom: [130,645,255,224] },
  volcano: { w: 2172, h: 724, coin: [[48,173,311,346], [421,173,251,346], [765,173,111,346], [421,173,251,346]], gem: [970,173,332,346], mushroom: [1371,173,361,346] },
  village: { w: 1916, h: 821, coin: [[109,219,314,379], [109,219,314,379], [109,219,314,379], [109,219,314,379]], gem: [1462,219,360,379], mushroom: [981,219,390,379] },
} as const;
const commons: SpriteSlot[] = [];
for (const theme of Object.keys(pickups) as Theme[]) {
  const p = pickups[theme];
  commons.push({
    slot: `${theme}-coin`, file: file(theme, 'pickups'), frameW: 16, frameH: 16, cols: 4, rows: 1,
    frames: ['front', 'turn', 'edge', 'return'], pixelArt: true,
    source: { w: p.w, h: p.h, fit: 'coin', keyBlack: true, frames: p.coin.map(region) }, notes: ['Coin frames sampled from the supplied pickup atlas.'],
  });
  const star: AtlasFrame = theme === 'volcano' ? region([1783,173,350,346]) : theme === 'village' ? region([537,219,358,379])
    : { file: 'assets/arcade/jungle/rewards.webp', rect: [1086,0,543,724] };
  const sign: AtlasFrame = theme === 'ice' ? cell(theme, 'props', [870,320,142,215]) : theme === 'volcano' ? cell(theme, 'props', [1205,90,225,430])
    : theme === 'village' ? cell(theme, 'props', [1040,190,165,305]) : { file: 'assets/arcade/jungle/rewards.webp', rect: [1629,0,543,724] };
  commons.push({
    slot: `${theme}-rewards`, file: file(theme, 'pickups'), frameW: 32, frameH: 32, cols: 4, rows: 1,
    frames: ['gem-or-flower', 'health-pickup', 'power-star', 'sign'], pixelArt: true,
    source: { w: p.w, h: p.h, fit: 'prop', keyBlack: true, frames: [region(p.gem), region(p.mushroom), star, sign] },
    notes: ['Gem/flower grants points; mushroom restores one heart; star charges the pulse.'],
  });
}
commons.push({
  slot: 'ice-walker', file: file('ice', 'pickups'), frameW: 20, frameH: 20, cols: 3, rows: 1,
  frames: ['walk-a', 'walk-b', 'squashed'], pixelArt: true,
  source: { w: 1448, h: 1086, fit: 'actor', keyBlack: true, flipX: true, frames: ([ [130,258,304,227],[594,258,301,227],[1041,258,259,227] ] as const).map(region) },
  notes: ['Snail frames occupy the upper row of the shared ice pickup atlas.'],
});

// Semantic prop slots stay consistent across worlds: pillar, sign, goal, tree,
// bush, landmark, crate, bridge, then extra decorations.
const props: Record<Theme, readonly AtlasFrame[]> = {
  desert: [cell('desert','props',[50,490,260,300]), {file:'assets/arcade/jungle/rewards.webp',rect:[1629,0,543,724]}, cell('desert','blocks',[1165,215,270,545]),
    cell('desert','props',[405,15,395,465]), cell('desert','props',[1152,500,258,260]), cell('desert','props',[742,760,671,306]), cell('desert','blocks',[873,215,251,545]), cell('desert','terrain',[38,280,600,270]),
    cell('desert','props',[774,165,249,315]), cell('desert','props',[347,500,311,260]), cell('desert','props',[39,765,686,301]), cell('desert','props',[1023,255,398,230])],
  ice: [cell('ice','props',[255,635,219,300]), cell('ice','props',[870,320,142,215]), cell('ice','blocks',[1223,309,198,381]),
    cell('ice','props',[25,215,236,321]), cell('ice','props',[239,390,176,146]), cell('ice','props',[490,625,410,320]), cell('ice','blocks',[686,309,186,381]), cell('ice','terrain',[73,149,782,226]),
    cell('ice','props',[1010,230,190,306]), cell('ice','props',[665,320,201,216]), cell('ice','props',[929,639,246,291]), cell('ice','props',[1216,639,185,291])],
  volcano: [cell('volcano','props',[256,565,198,401]), cell('volcano','props',[1214,105,202,409]), cell('volcano','blocks',[1864,143,241,382]),
    cell('volcano','props',[18,95,349,424]), cell('volcano','props',[329,285,271,234]), cell('volcano','props',[728,565,398,401]), cell('volcano','blocks',[1080,143,284,382]), cell('volcano','terrain',[80,415,515,164]),
    cell('volcano','props',[28,565,202,401]), cell('volcano','props',[912,105,264,409]), cell('volcano','props',[479,565,203,401]), cell('volcano','props',[590,105,300,409])],
  village: [cell('village','blocks',[1638,278,249,226]), cell('village','props',[1040,190,165,305]), cell('village','props',[1262,577,168,319]),
    cell('village','props',[17,185,250,310]), cell('village','props',[455,193,149,288]), cell('village','props',[573,570,240,335]), cell('village','blocks',[569,280,214,222]), cell('village','terrain',[427,417,188,184]),
    cell('village','props',[870,193,133,288]), cell('village','props',[18,577,254,319]), cell('village','props',[299,573,271,327]), cell('village','props',[1075,573,170,327])],
};

const tileFrames = ['ground-top','ground-fill','brick','qblock-idle','qblock-spent','spike','hazard-top','hazard-fill','checkpoint-idle','checkpoint-lit'];
const tileCells: Record<Theme, readonly AtlasFrame[]> = {
  desert: [cell('desert','terrain',[38,285,600,280],[.3,0,.3,1],'fill'), cell('desert','terrain',[38,285,600,280],[.3,.35,.3,.6],'fill'), cell('desert','blocks',[310,440,247,315],undefined,'fill'), cell('desert','blocks',[35,440,235,315],undefined,'fill'), cell('desert','blocks',[595,430,232,330],undefined,'fill'), cell('desert','props',[38,295,362,172],[.25,0,.25,1],'fill'), cell('desert','terrain',[38,285,600,280],[.3,.35,.3,.3],'fill'), cell('desert','terrain',[38,285,600,280],[.3,.4,.3,.4],'fill'), props.desert[2], props.desert[2]],
  ice: [cell('ice','terrain',[73,149,782,226],[.3,0,.3,1],'fill'), cell('ice','terrain',[55,407,243,519],[.15,.3,.65,.4],'fill'), cell('ice','blocks',[242,480,187,210],undefined,'fill'), cell('ice','blocks',[39,480,169,210],undefined,'fill'), cell('ice','blocks',[463,480,192,210],undefined,'fill'), cell('ice','blocks',[913,450,278,240],[.33,0,.34,1],'fill'), {file:'assets/arcade/jungle/tiles.webp',rect:[397,397,396,396],fit:'fill'}, {file:'assets/arcade/jungle/tiles.webp',rect:[794,397,396,396],fit:'fill'}, props.ice[2], props.ice[2]],
  volcano: [cell('volcano','terrain',[580,179,180,95],undefined,'fill'), cell('volcano','blocks',[426,250,262,280],undefined,'fill'), cell('volcano','blocks',[754,250,265,280],undefined,'fill'), cell('volcano','blocks',[94,250,264,280],undefined,'fill'), cell('volcano','blocks',[426,250,262,280],undefined,'fill'), cell('volcano','blocks',[1419,250,399,275],[.25,0,.25,1],'fill'), cell('volcano','terrain',[852,835,175,74],undefined,'fill'), cell('volcano','terrain',[852,860,175,52],undefined,'fill'), props.volcano[2], props.volcano[2]],
  village: [cell('village','terrain',[31,417,184,184],undefined,'fill'), cell('village','terrain',[31,417,184,184],[0,.35,1,.65],'fill'), cell('village','blocks',[1072,280,209,222],undefined,'fill'), cell('village','blocks',[822,280,216,222],undefined,'fill'), cell('village','blocks',[318,280,211,222],undefined,'fill'), cell('village','blocks',[1315,280,310,222],[.25,0,.25,1],'fill'), cell('village','terrain',[1243,417,176,184],undefined,'fill'), cell('village','terrain',[1243,417,176,184],[0,.25,1,.75],'fill'), props.village[2], props.village[2]],
};

export const IMPORTED_SPRITES: readonly SpriteSlot[] = [
  ...actors, ...commons,
  { slot: 'village-layers', file: file('village','layers'), frameW: 512, frameH: 80, cols: 1, rows: 5,
    frames: ['mountains','hills','houses','flowers','sky'], pixelArt: true,
    source: { w: 1448, h: 1086, fit: 'prop', keyBlack: true,
      frames: ([ [23,61,1405,154],[23,267,1405,161],[23,470,1407,173],[23,696,1404,108],[23,843,1402,183] ] as const).map(rect => ({ rect, fit: 'fill' as const })) },
    notes: ['Supplied village scenery layers scroll at different speeds.'] },
  ...(Object.keys(props) as Theme[]).flatMap(theme => [
    { slot: `${theme}-props`, file: file(theme,'props'), frameW: 64, frameH: 64, cols: 4, rows: 3,
      frames: ['pillar','sign','goal','tree','bush','landmark','crate','bridge','lamp','decoration','building','rock'], pixelArt: true,
      source: { w: 1448, h: 1086, fit: 'prop' as const, keyBlack: true, frames: props[theme] }, notes: ['Prop regions sampled from the supplied environment and block sheets.'] },
    { slot: `tiles-${theme}`, file: file(theme,'terrain'), frameW: 16, frameH: 16, cols: 5, rows: 2, frames: tileFrames, pixelArt: true,
      source: { w: 1448, h: 1086, fit: 'tile' as const, keyBlack: true, frames: tileCells[theme] }, notes: ['Terrain assembled from source regions; collision surfaces align with the top of each cell.'] },
  ]),
  { slot: 'castle-beetle', file: 'assets/arcade/castle/knight.webp', frameW: 24, frameH: 24, cols: 7, rows: 1, frames: enemyFrames, pixelArt: true,
    source: { w: 1916, h: 821, fit: 'actor', keyBlack: true, flipX: true,
      frames: ([ [17,255,215,248],[272,255,212,248],[517,255,213,248],[764,255,211,248],[1020,255,233,248],[1289,255,301,248],[1635,255,257,248] ] as const).map(region) }, notes: ['Armoured knight uses two-hit enemy behaviour.'] },
  { slot: 'castle-player', file: 'assets/arcade/castle/player.webp', frameW: 24, frameH: 32, cols: 7, rows: 1, frames: playerFrames, pixelArt: true,
    source: { w: 1916, h: 821, fit: 'actor', keyBlack: true,
      frames: ([ [37,241,172,298],[266,241,180,298],[500,241,183,298],[746,241,183,298],[1223,241,171,298],[1441,241,185,298],[1685,241,177,298] ] as const).map(region) },
    notes: ['The supplied explorer is the player; the purple knight is an enemy.'] },
];
