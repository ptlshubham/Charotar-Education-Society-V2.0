# CES Arcade — Art Swap List

GENERATED FILE — do not edit by hand. Run `npm run art` to regenerate.
manifest-hash: 3a6e50442fbeb36f

## How to hand off final art

1. Overwrite the PNG at the exact path below. Do not rename it, do not add a suffix.
2. Keep the grid: the same number of columns and rows, in the same frame order.
3. Frame size may be the listed size OR an exact 2x, 3x or 4x of it — the same
   multiple on BOTH axes. The exact authored-atlas size listed for a slot is also accepted.
4. Transparent background. No padding between frames, no gaps, no bleed.
   Authored atlases retain their original pixels; the browser trims transparent margins and assembles frames once at load. Terrain cells fill their full square.
5. Run `npm test`. A mis-sized sheet fails by slot name, with the size it expected.

No TypeScript is touched. No rebuild configuration changes. Once a file stops
matching the placeholder we generated, `npm run art` will never overwrite it.

Jungle review: open `jungle/preview.html`. Prompts and provenance: `jungle/ART.md`.
Each theme owns its folder. Files under `shared/` serve the other maps until their own artwork is approved.
Authored atlases and legacy sheets are always preserved by the placeholder generator.

## Sprite manifest — 17 files

### player — assets/arcade/jungle/player.png

| | |
|---|---|
| Sheet size | 168x32 / 336x64 / 504x96 / 672x128 / 2032x774 authored atlas (assembled to 4x at load) |
| Frame size | 24 x 32 |
| Grid | 7 columns x 1 row |
| Frame order | 0 idle · 1 run-a · 2 run-b · 3 run-c · 4 rise · 5 fall · 6 cheer |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the bottom-centre of the frame.
- Collision box is 12 x 22 — art may overhang 6px each side and 10px above the head.
- Feet must sit on the last row of the frame or the character floats.
- Drawn facing RIGHT; the engine mirrors horizontally for left.
- run-a/b/c cycle every 8 ticks while moving; rise while ascending, fall while descending.

### walker — assets/arcade/jungle/walker.png

| | |
|---|---|
| Sheet size | 60x20 / 120x40 / 180x60 / 240x80 / 2172x724 authored atlas (assembled to 4x at load) |
| Frame size | 20 x 20 |
| Grid | 3 columns x 1 row |
| Frame order | 0 walk-a · 1 walk-b · 2 squashed |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the bottom-centre of the frame. Collision box is 14 x 12.
- walk-a/b alternate every 8 ticks.
- squashed shows for 20 ticks after a stomp, then the enemy is removed.
- Drawn facing RIGHT; the engine mirrors for left.

### flyer — assets/arcade/jungle/flyer.png

| | |
|---|---|
| Sheet size | 60x20 / 120x40 / 180x60 / 240x80 / 2172x724 authored atlas (assembled to 4x at load) |
| Frame size | 20 x 20 |
| Grid | 3 columns x 1 row |
| Frame order | 0 wing-up · 1 wing-down · 2 squashed |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the centre of the frame. Collision box is 14 x 12.
- wing-up/down alternate every 8 ticks.
- squashed shows for 20 ticks after a stomp, then the enemy is removed.
- Drawn facing RIGHT; the engine mirrors for left.

### coin — assets/arcade/jungle/coin.png

| | |
|---|---|
| Sheet size | 64x16 / 128x32 / 192x48 / 256x64 / 2172x724 authored atlas (assembled to 4x at load) |
| Frame size | 16 x 16 |
| Grid | 4 columns x 1 row |
| Frame order | 0 spin-0 · 1 spin-1 · 2 spin-2 · 3 spin-3 |
| Rendering | pixel art, nearest-neighbour |

- Fills its 16x16 tile. Keep a 2px clear margin all round so it never touches terrain.
- spin-0 is the full face, spin-2 is edge-on; the cycle advances every 8 ticks.

### tiles-jungle — assets/arcade/jungle/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 / 1983x793 authored atlas (assembled to 4x at load) |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Mossy earth and stone terrain; cells 6-7 are water.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-desert — assets/arcade/desert/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Sandstone terrain; cells 6-7 are quicksand.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-volcano — assets/arcade/volcano/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Charred basalt terrain; cells 6-7 are lava.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-ice — assets/arcade/ice/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Packed snow over blue ice terrain; cells 6-7 are freezing water.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-castle — assets/arcade/castle/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Cut castle stone terrain; cells 6-7 are moat water.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-canopy — assets/arcade/canopy/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Rich earth under thick moss terrain; cells 6-7 are river water.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### tiles-village — assets/arcade/village/tiles.png

| | |
|---|---|
| Sheet size | 80x32 / 160x64 / 240x96 / 320x128 |
| Frame size | 16 x 16 |
| Grid | 5 columns x 2 rows |
| Frame order | 0 ground-top · 1 ground-fill · 2 brick · 3 qblock-idle · 4 qblock-spent · 5 spike · 6 hazard-top · 7 hazard-fill · 8 checkpoint-idle · 9 checkpoint-lit |
| Rendering | pixel art, nearest-neighbour |

- Village cobble and timber terrain; cells 6-7 are river water.
- Cells 0-4 and 6-7 must be opaque edge to edge — they tile against each other.
- Cells 5, 8 and 9 sit on transparency and are drawn over the backdrop.
- Cell 0 is used wherever the cell above is empty, cell 1 everywhere else.

### legacy-player — assets/arcade/shared/player.png

| | |
|---|---|
| Sheet size | 168x32 / 336x64 / 504x96 / 672x128 |
| Frame size | 24 x 32 |
| Grid | 7 columns x 1 row |
| Frame order | 0 idle · 1 run-a · 2 run-b · 3 run-c · 4 rise · 5 fall · 6 cheer |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the bottom-centre of the frame.
- Collision box is 12 x 22 — art may overhang 6px each side and 10px above the head.
- Feet must sit on the last row of the frame or the character floats.
- Drawn facing RIGHT; the engine mirrors horizontally for left.
- run-a/b/c cycle every 8 ticks while moving; rise while ascending, fall while descending.

### legacy-walker — assets/arcade/shared/walker.png

| | |
|---|---|
| Sheet size | 60x20 / 120x40 / 180x60 / 240x80 |
| Frame size | 20 x 20 |
| Grid | 3 columns x 1 row |
| Frame order | 0 walk-a · 1 walk-b · 2 squashed |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the bottom-centre of the frame. Collision box is 14 x 12.
- walk-a/b alternate every 8 ticks.
- squashed shows for 20 ticks after a stomp, then the enemy is removed.
- Drawn facing RIGHT; the engine mirrors for left.

### legacy-flyer — assets/arcade/shared/flyer.png

| | |
|---|---|
| Sheet size | 60x20 / 120x40 / 180x60 / 240x80 |
| Frame size | 20 x 20 |
| Grid | 3 columns x 1 row |
| Frame order | 0 wing-up · 1 wing-down · 2 squashed |
| Rendering | pixel art, nearest-neighbour |

- Anchor is the centre of the frame. Collision box is 14 x 12.
- wing-up/down alternate every 8 ticks.
- squashed shows for 20 ticks after a stomp, then the enemy is removed.
- Drawn facing RIGHT; the engine mirrors for left.

### legacy-coin — assets/arcade/shared/coin.png

| | |
|---|---|
| Sheet size | 64x16 / 128x32 / 192x48 / 256x64 |
| Frame size | 16 x 16 |
| Grid | 4 columns x 1 row |
| Frame order | 0 spin-0 · 1 spin-1 · 2 spin-2 · 3 spin-3 |
| Rendering | pixel art, nearest-neighbour |

- Fills its 16x16 tile. Keep a 2px clear margin all round so it never touches terrain.
- spin-0 is the full face, spin-2 is edge-on; the cycle advances every 8 ticks.

### jungle-props — assets/arcade/jungle/props.png

| | |
|---|---|
| Sheet size | 256x128 / 512x256 / 768x384 / 1024x512 / 1774x887 authored atlas (assembled to 4x at load) |
| Frame size | 64 x 64 |
| Grid | 4 columns x 2 rows |
| Frame order | 0 pipe · 1 sign · 2 goal · 3 tree · 4 bush · 5 temple · 6 crate · 7 bridge |
| Rendering | pixel art, nearest-neighbour |

- Each prop is sampled separately; scenery never changes collision geometry.

### jungle-items — assets/arcade/jungle/items.png

| | |
|---|---|
| Sheet size | 128x64 / 256x128 / 384x192 / 512x256 / 1774x887 authored atlas (assembled to 4x at load) |
| Frame size | 32 x 32 |
| Grid | 4 columns x 2 rows |
| Frame order | 0 heart · 1 star · 2 mushroom · 3 flower · 4 plant · 5 rocks · 6 vine · 7 portrait |
| Rendering | pixel art, nearest-neighbour |

- Heart and portrait are HUD art; supplementary items do not imply power-up mechanics.

## Palette used by the placeholders

#191940 ink · #211634 line · #8a38f5 purple · #7025cd deep · #ffd774 gold · #fff1d1 cream · #df301c vermilion · #4e9642 green

## Shared with the quiz — DO NOT replace these

Replacing any file below also changes the Learning Quest quiz. If new art is
needed here, raise it as a separate change.

| File | Size | Used by the arcade for |
|---|---|---|
| assets/scene-discovery.png | 1535 x 1024 | Level 1 parallax backdrop |
| assets/scene-science.png | 1536 x 1024 | Level 2 parallax backdrop |
| assets/scene-challenges.png | 1536 x 1024 | Level 3 parallax backdrop |
| assets/flag.png | 664 x 972 | The in-world goal, drawn 40 x 58 on the G tile |
| assets/icons/icon-star.png | 128 x 128 | One 20x20 star per remaining life |
| assets/icons/icon-medal-gold.png | 128 x 128 | 20x20 disc beside the coin counter |
| assets/island-discovery.png | 1536 x 1024 | Level-select card art |
| assets/island-science.png | 1536 x 1024 | Level-select card art |
| assets/island-maths.png | 1536 x 1024 | Level-select card art |
| assets/panel-discovery.png | 1672 x 941 | Pause / cleared / game-over dialog surface |
| assets/panel-science.png | 1672 x 941 | Pause / cleared / game-over dialog surface |
| assets/panel-challenges.png | 1672 x 941 | Pause / cleared / game-over dialog surface |
| assets/trophy.png | 1357 x 1159 | Level-complete dialog |
