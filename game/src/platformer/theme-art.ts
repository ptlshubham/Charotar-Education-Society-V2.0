import { PALETTE, SPRITES, type Sheets } from './sprites';
import { ARCADE_THEMES, type ThemeId } from './themes';

// Palette swaps are cached once per level, never processed in the drawing loop.
// Source PNGs remain intact, including any replacement art supplied by the team.
const cache = new WeakMap<Sheets, Map<ThemeId, Sheets>>();
const rgb = (hex: string): number[] => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

export const themedSheets = (source: Sheets, id: ThemeId): Sheets => {
  let themes = cache.get(source);
  if (!themes) { themes = new Map(); cache.set(source, themes); }
  const existing = themes.get(id);
  if (existing) return existing;
  const theme = ARCADE_THEMES[id];
  const result: Sheets = { ...source };
  for (const name of ['player', 'walker', 'flyer', 'coin', `tiles-${id}`, 'goal-flag']) {
    const original = source[name];
    if (!original) continue;
    const canvas = document.createElement('canvas');
    canvas.width = original.width;
    canvas.height = original.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    ctx.drawImage(original, 0, 0);
    const mapping = name === 'player'
      ? [[PALETTE.purple, theme.costume[0]], [PALETTE.deep, theme.costume[1]]]
      : name === 'walker' || name === 'flyer'
        ? [[PALETTE.green, theme.enemy[0]], [PALETTE.vermilion, theme.enemy[0]], [PALETTE.deep, theme.enemy[1]], [PALETTE.gold, theme.accent]]
        : [[PALETTE.gold, theme.treasureColors[0]], [PALETTE.deep, theme.treasureColors[1]], [PALETTE.purple, theme.accent]];
    const replacements = mapping.map(([from, to]) => ({ from: rgb(from), to: rgb(to) }));
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < image.data.length; i += 4) {
      if (!image.data[i + 3]) continue;
      const match = replacements.find(({ from }) => from.every((channel, j) => image.data[i + j] === channel));
      if (match) match.to.forEach((channel, j) => image.data[i + j] = channel);
    }
    ctx.putImageData(image, 0, 0);
    result[name] = canvas;
  }
  themes.set(id, result);
  return result;
};

// The HUD displays the same collectible as the stage, using the manifest's frame.
export const treasureIcon = (source: Sheets, id: ThemeId): string | null => {
  const sheet = themedSheets(source, id)['coin'];
  const slot = SPRITES.find(slot => slot.slot === 'coin');
  if (!sheet || !slot) return null;
  const scale = sheet.width / (slot.frameW * slot.cols);
  const canvas = document.createElement('canvas');
  canvas.width = slot.frameW * scale;
  canvas.height = slot.frameH * scale;
  canvas.getContext('2d')?.drawImage(sheet, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};
