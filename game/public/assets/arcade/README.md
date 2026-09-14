# Arcade artwork folders

Each environment owns a folder. Use consistent filenames inside each theme so its artwork is easy to replace and move.

| Folder | Contents |
| --- | --- |
| `jungle/` | Explorer, snail, parrot, coin, terrain, backdrop, props, items, preview, and generation prompts |
| `desert/` | Desert terrain |
| `volcano/` | Volcano terrain |
| `ice/` | Ice terrain |
| `castle/` | Castle terrain |
| `canopy/` | Canopy terrain |
| `village/` | Village terrain |
| `shared/` | Original player, walker, flyer, and coin used by the other themes |

Jungle filenames: `player.png`, `walker.png`, `flyer.png`, `coin.png`, `tiles.png`, `backdrop.png`, `props.png`, and `items.png`.

Open [the jungle preview](jungle/preview.html) to review the art. [SWAP-LIST.md](SWAP-LIST.md) contains frame dimensions and ordering. `game/src/platformer/sprites.ts` controls runtime paths; run `npm run art` from `game/` after changing the manifest to refresh the swap list. The generator preserves authored images.

Art reused from the Learning Quest quiz remains in its existing shared asset locations, listed in the swap list.
