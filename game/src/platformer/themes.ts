import type { Level } from './levels';

export type ThemeId = Level['theme'];
export interface ArcadeTheme {
  readonly label: string;
  readonly description: string;
  readonly treasure: string;
  readonly hazard: string;
  readonly title: string;
  readonly accent: string;
  readonly light: string;
  readonly ink: string;
  readonly surface: string;
  readonly border: string;
  readonly deep: string;
  readonly weather: 'fireflies' | 'sand' | 'embers' | 'snow' | 'motes' | 'leaves' | 'sea';
  readonly costume: readonly [string, string];
  readonly enemy: readonly [string, string];
  readonly treasureColors: readonly [string, string];
}

// Figma environments inform the complete arcade palette, not just the backdrop.
// These are visual settings only: level geometry and collision rules stay in levels.ts.
export const ARCADE_THEMES: Readonly<Record<ThemeId, ArcadeTheme>> = {
  jungle: {
    label: 'Jungle ruins', description: 'Mossy paths, ancient ruins, and forest treasures.',
    treasure: 'Emerald coins', hazard: 'Deep river', title: 'titles/title-discovery.webp',
    accent: '#69bc76', light: '#edffe2', ink: '#163b2c', surface: '#e5f2cf', border: '#537749', deep: '#0d251f',
    weather: 'fireflies', costume: ['#41895c', '#235b3d'], enemy: ['#85a950', '#385b30'], treasureColors: ['#73e1a1', '#246d51'],
  },
  desert: {
    label: 'Desert temples', description: 'Sandstone steps and lost treasures in the dunes.',
    treasure: 'Sun coins', hazard: 'Quicksand', title: 'titles/title-science.webp',
    accent: '#e4ac4d', light: '#fff3d6', ink: '#5b3415', surface: '#f8dda3', border: '#a46b2c', deep: '#382517',
    weather: 'sand', costume: ['#d79342', '#936039'], enemy: ['#ad7137', '#785031'], treasureColors: ['#ffd777', '#a06421'],
  },
  volcano: {
    label: 'Volcanic cliffs', description: 'Basalt platforms, glowing embers, and molten rivers.',
    treasure: 'Ember coins', hazard: 'Lava', title: 'titles/title-challenges.webp',
    accent: '#ed8252', light: '#ffe7d3', ink: '#592b24', surface: '#f4c4a9', border: '#a8503d', deep: '#241a24',
    weather: 'embers', costume: ['#be523e', '#763445'], enemy: ['#ad543a', '#4c3547'], treasureColors: ['#ff9960', '#873d32'],
  },
  ice: {
    label: 'Frozen mountains', description: 'Snow-covered ledges and shimmering frozen treasure.',
    treasure: 'Frost coins', hazard: 'Freezing water', title: 'titles/title-world.webp',
    accent: '#80c9ea', light: '#f4fcff', ink: '#244772', surface: '#d6eeff', border: '#628ebd', deep: '#172c4b',
    weather: 'snow', costume: ['#6eaed5', '#416e9d'], enemy: ['#a8d2e9', '#507eac'], treasureColors: ['#bcefff', '#5487b7'],
  },
  castle: {
    label: 'Castle grounds', description: 'Royal stonework, guarded towers, and enchanted coins.',
    treasure: 'Royal coins', hazard: 'Castle moat', title: 'titles/title-brain.webp',
    accent: '#b293d9', light: '#f7eafe', ink: '#45315b', surface: '#e4d3f1', border: '#7e619d', deep: '#292035',
    weather: 'motes', costume: ['#9472bc', '#56447b'], enemy: ['#9790ad', '#625775'], treasureColors: ['#e7cb80', '#866347'],
  },
  canopy: {
    label: 'Forest canopy', description: 'Twisting roots, leafy platforms, and hidden amber.',
    treasure: 'Amber coins', hazard: 'Forest river', title: 'titles/title-knowledge.webp',
    accent: '#b3c86b', light: '#f4f7db', ink: '#354424', surface: '#e9edbb', border: '#7a914f', deep: '#203321',
    weather: 'leaves', costume: ['#9aa54f', '#546d37'], enemy: ['#c0a157', '#7c6940'], treasureColors: ['#edbd6d', '#8e613d'],
  },
  village: {
    label: 'Coastal village', description: 'Timber bridges, copper gears, and a seaside breeze.',
    treasure: 'Copper coins', hazard: 'Harbour water', title: 'titles/title-tech.webp',
    accent: '#78c0b9', light: '#f2eee0', ink: '#244c50', surface: '#d6e8de', border: '#578481', deep: '#223638',
    weather: 'sea', costume: ['#53989e', '#375d72'], enemy: ['#b68b5e', '#636776'], treasureColors: ['#e8a979', '#8b614e'],
  },
};

const stylesFor = (theme: ArcadeTheme): Record<string, string> => ({
  '--arcade-accent': theme.accent,
  '--arcade-light': theme.light,
  '--arcade-ink': theme.ink,
  '--arcade-surface': theme.surface,
  '--arcade-border': theme.border,
  '--arcade-deep': theme.deep,
});

export const ARCADE_STYLES: Record<ThemeId, Record<string, string>> = {
  jungle: stylesFor(ARCADE_THEMES.jungle),
  desert: stylesFor(ARCADE_THEMES.desert),
  volcano: stylesFor(ARCADE_THEMES.volcano),
  ice: stylesFor(ARCADE_THEMES.ice),
  castle: stylesFor(ARCADE_THEMES.castle),
  canopy: stylesFor(ARCADE_THEMES.canopy),
  village: stylesFor(ARCADE_THEMES.village),
};
