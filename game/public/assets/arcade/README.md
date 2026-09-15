# Arcade world artwork

Each playable world owns its images in a lowercase theme folder. The application remains inside `game/`, with relative URLs for subdomain hosting.

| Folder | Playable artwork |
| --- | --- |
| `jungle/` | Explorer, snail, beetle, parrot, wild plant, coins, rewards, grass terrain, ruins and waterfall backdrop |
| `desert/` | Explorer, scorpion, vulture, cactus, snail, sand terrain, sandstone blocks, palms and pyramids |
| `ice/` | Explorer, ice bear, owl, crystal plant, snail, snow platforms, frozen blocks and ruins |
| `volcano/` | Explorer, lava beetle, bat, fire plant, snail, volcanic terrain, lava, crystals and torches |
| `castle/` | Explorer, armoured knight, bat, castle plant, snail, stonework, banners, towers and bridges |
| `village/` | Explorer, boar, bluebird, snail, timber, flowers, houses, windmills and five background layers |
| `canopy/` | Grass terrain; shares the jungle characters and props with its forest route and backdrop |
| `shared/` | Retained original fallback sprites |

The capitalized `Desert World`, `Ice World`, `Volcano World`, `Castle World` and `Village World` folders retain the supplied exports and reference JPEGs. Runtime PNGs use semantic names such as `player.png`, `beetle.png`, `flyer.png`, `plant.png`, `walker.png`, `pickups.png`, `blocks.png`, `props.png` and `tiles.png`. Ice's snails are inside `pickups.png`; Village has no plant enemy sheet.

## Replacing artwork

`src/platformer/sprites.ts` declares base slots; `world-art.ts` maps imported worlds, and `world-regions.ts` records their non-uniform animation rectangles. Source dimensions and frame order are listed in [SWAP-LIST.md](SWAP-LIST.md).

The loader removes the border-connected black matte and builds transparent, consistently anchored runtime atlases. Source PNG bytes remain intact. Terrain and pickup frames can sample several sheets in the same theme. Keep dimensions and layouts unchanged for a direct replacement; update region metadata if the export layout changes.

Village's set has fewer animation poses, so some run, jump, hurt and defeat states reuse a supplied pose. Desert and Ice share the jungle power star; all HUDs share its heart icon.

From `game/`, run `npm run art` to refresh the swap list, then `npm run art:check`, `npm run build` and `npm test`. The generator preserves authored images. `node scripts/review-worlds.mjs` checks all seven worlds and produces runtime atlas and gameplay screenshots in `screenshots/`.

## Gameplay

Move with Left/Right or A/D; jump with Space, Up or W; use star power with X/K or the star button. Mushrooms restore a heart, gems/flowers grant points, and stars replenish power. Armoured enemies take two hits. Avoid active plants, spikes and pits. Reach the flag before the timer runs out; pause, restart, retry and level selection are available.
