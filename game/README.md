# CES Learning Quest

An independent Angular application based on the supplied Game UI Figma file. All application code, styles, original exported artwork, question data, and build configuration live in this folder. There are no imports from the CES website, API calls, login requirements, or remote runtime assets.

## Run and build

From the CES repository root:

```sh
npm run game:start
npm run game:build
```

The game development server runs at `http://127.0.0.1:4201`. The production output is `game/dist/browser`. While this folder is inside the CES repository, npm can use the dependencies already installed in the parent directory.

For an independent checkout, copy the entire `game/` folder, run `npm install` inside it, then `npm start` or `npm run build`. Requirements: Node 24.15 or newer in the Node 24 release line (or another version supported by Angular 22) and npm.

## Hosting with CES or on a subdomain

The CES npm build/start scripts build this app first. The CES asset configuration copies its compiled output into `/game/`; the home page uses a normal link to `/game/index.html`. No shared Angular router or site layout is required. If invoking `ng` directly, first run `npm run game:build` from the repository root.

To move to a subdomain:

1. Copy this folder and install its dependencies, or build it in its current location.
2. Upload the **contents** of `dist/browser/` to the subdomain document root using any static host.
3. Update the home-page play link in `src/app/pages/home/index/index.html` to the new subdomain.
4. Review `src/config.ts` for the return link to the CES website.

The app uses a relative base URL and hash navigation, so the same build works at `/game/index.html` and at a subdomain root without special rewrite rules. Original PNG assets are preserved from Figma; enable hosting compression/caching and allow for the artwork download size.

## Gameplay and content

- Seven islands, each with its own Figma scene: General Knowledge (jungle), Science (desert), Global News (ice), Brain (castle), Challenges (volcano), Discovery (temple), and Tech (village).
- Each round draws five unique questions from its island's six-question starter bank and randomizes their order.
- Correct answers earn 20 XP. Three correct answers earn an island badge. Total XP is the sum of each island's best round, so replaying cannot inflate it indefinitely.
- Every answer includes an explanation. There is no timer. Challenges currently covers maths; Global News covers world knowledge and news literacy rather than a live news feed.
- Change or extend the starter content in `src/questions.ts`; each question has four options and a zero-based correct-answer index.
- The explorer nickname, completed islands, and best scores are saved to localStorage on the current browser/device. Unfinished rounds are not saved. Storage failures allow play to continue with a visible notice. Progress does not automatically transfer to another device or a future subdomain.
- Keyboard controls use normal Tab/Enter/Space navigation, with focus management and an accessible badge dialog. Small screens use a two-column island list and single-column quiz answers. Reduced-motion preferences are respected.
- The welcome artwork includes drifting clouds, a swaying balloon and flag, a glowing trophy, floating map, and fireflies. The trophy opens the badge journal; the balloon and flag respond to clicks or keyboard activation. Islands gently bob, correct answers show a short XP animation, and completed rounds have a brief confetti celebration.
- Each island frames its content on that island's own panel artwork (`public/assets/panel-<island>.png`): jungle planks, desert sandstone, ice, castle slate, volcanic basalt, and village cobblestone. Panel text switches between light and dark ink to suit the material, and the artwork is overscanned so the board meets the panel edge.
- Round actions sit in a top-corner cluster of home, badges, sound, and close buttons. Leaving a round part-way asks in an in-game dialog built from the same island artwork rather than a browser confirm box.
- Motion is always on; there is no pause control. Sound starts off and enables optional quiet synthesized chimes. Reduced-motion settings suppress animation, and background tabs suspend audio and pause motion. All effects remain inside `game/`; no animation or audio dependencies are needed. Scenery effects are styled in `src/effects.scss`.

## CES Arcade (the platformer)

A second, separate game lives at `#/arcade` inside this same app: a side-scrolling
platformer in the Learning Quest art style. It is lazy-loaded, so the quiz's initial
bundle is unaffected (`main` 45 kB, `arcade` 35 kB deferred).

| Level | Theme | Width | Coins | Enemies | Recorded run |
|---|---|---:|---:|---|---:|
| Jungle Run | jungle | 120 | 19 | 4w 2f | 824 / 3600 |
| Dune Dash | desert | 150 | 24 | 5w 1f | 1045 / 4500 |
| Ember Climb | volcano | 180 | 27 | 7w 3f | 1309 / 5400 |
| Frost Trail | ice | 227 | 19 | 4w 1f | 1592 / 5000 |
| Castle Climb | castle | 260 | 20 | 4w 2f | 1842 / 5600 |
| Canopy Dash | canopy | 290 | 20 | 5w 2f | 2069 / 6200 |
| Circuit Run | village | 309 | 20 | 5w 3f | 2207 / 6600 |

All seven worlds from the quiz have a level, each with its own backdrop, tileset,
island card and dialog panel. Clearing a level carries your lives and score into the next one; the level-complete
dialog offers **Next level** until the last, then **Back to levels**. Cleared levels and
your best run total are saved to `localStorage` under `ces-arcade-v1`.

- **Controls** — Arrow keys or A/D to move, Space / W / Up to jump, Escape to pause. On a
  touch screen the pad below the stage does the same; it never overlaps the play area.
- **Rules** — run, jump, stomp enemies, collect coins, bump question blocks, touch the
  checkpoint, reach the CES flag. Spikes and lava cost a life; three lives per run.
- **Rendering** — a fixed 512 x 288 virtual resolution upscaled with `image-rendering:
  pixelated`, 16 px tiles, 18 rows. Levels are exactly one screen tall, so the camera is a
  horizontal clamp only.
- **Physics is discrete Euler** (`vy += g` then `y += vy`), so the jump envelope is a finite
  sum and NOT the textbook `v^2/2g`. The real numbers, computed in `levels.ts` and asserted
  by `npm test`: apex **45.00 px (2.81 tiles)**, airtime **28 ticks**, horizontal range
  **61.60 px (3.85 tiles)**. A 3-tile gap is comfortable; a 4-tile gap is impossible.
- **`validateLevel()` throws at load** if a question block is out of jump reach, a flyer's
  swept box clips terrain, a spawn sits inside a solid, or a row is ragged. These are the
  failures that otherwise ship as "the game is broken and nobody knows why".
- **Determinism** — nothing in `engine.ts`, `levels.ts` or `render.ts` reads a clock or a
  random number; `npm run art:check` greps for them and fails the build. Each level ships a
  recorded input script (`solution`) that `npm test` replays headlessly, asserting the level
  still clears within budget without losing a life. Re-record after any physics change.

### Adding or editing a level

Levels are plain character grids in `src/platformer/levels.ts`, one character per tile:

| `.` air | `#` terrain | `B` brick | `?` question block | `^` spike | `~` lava/water |
|---|---|---|---|---|---|
| `o` coin | `c` checkpoint | `P` spawn | `w` walker | `f` flyer | `G` goal |

Rows may be shorter than 18; the compiler top-pads them. `P`, `w` and `G` mean the entity's
bottom edge rests on that cell's bottom edge. Terrain skins itself (grass top vs fill) from
one rule, so there is nothing to hand-pick. Re-record the level's `solution` afterwards.

### Replacing the placeholder art

Every sprite is a named slot in `src/platformer/sprites.ts` — the only file in the repo that
holds a sprite path, sheet size, frame size or frame order. `npm run art` regenerates the
placeholder PNGs and rewrites `public/assets/arcade/SWAP-LIST.md`, which is the hand-off
document for the art team and ships with the build at `/game/assets/arcade/SWAP-LIST.md`.

- Overwrite the PNG at the same path, same grid, same frame order. No code changes.
- The declared size or any exact 2x / 3x / 4x of it is accepted, same multiple on both axes.
- `npm run art` never overwrites art it did not generate — a SHA ledger in
  `scripts/.placeholders.json` tracks its own output, so replaced files are left alone.
  `npm run art -- --force` overrides that and names every file it is about to destroy.
- `npm run art:check` (step 0 of `npm test`) fails by slot name with the size it expected, so
  a mis-sized replacement never reaches the browser as a silently broken sprite.
- The 13 files the arcade reuses from the quiz are listed separately in SWAP-LIST.md as
  do-not-replace, because changing them also changes the quiz.

### Not implemented, deliberately

Slopes, one-way and moving platforms, wall-jump, crouch, swimming, invulnerability frames,
knockback, particles, screen shake, swept collision. Two enemy types are one `if/else`, not
an entity system.

## Design sources

### Jungle arcade artwork

The jungle map now uses generated safari-explorer animation, a snail, a macaw, gold coins, mossy terrain, a waterfall backdrop, and jungle props. Preview the full asset set at `assets/arcade/jungle/preview.html`; prompts and provenance are in `public/assets/arcade/jungle/ART.md`.

Original PNGs remain intact. `sprites.ts` declares the source dimensions and frame order, and `atlas.ts` trims transparent actor margins into cached 4x sheets at load time. Each theme has its own folder under `assets/arcade/`: `jungle`, `desert`, `volcano`, `ice`, `castle`, `canopy`, and `village`. Other maps use `assets/arcade/shared/` for their original shared characters and coins. Pipe, bridge, and supplementary item art are supplied for future map work; no new power-up or pipe mechanics are implied. The placeholder generator preserves authored art.

File: https://www.figma.com/design/gbObfnTUNTQ8iNDaM9u7rA/Game-UI

| Figma node | Implemented view |
| --- | --- |
| 107:3 | Welcome scene |
| 107:23 | Island map (placeholder Lorem Zone becomes Challenges) |
| 270:8 | General Knowledge |
| 270:14 | Science Zone |
| 270:34 | Global News / Global Zone |
| 270:27 | Brain Zone |
| 270:40 | Challenges |
| 270:20 | Discovery Zone |
| 270:2 | Tech Zone |
| 290:41, 290:69, 290:91, 290:115, 290:138, 290:159 | Island menu panel and top-corner control cluster |
| 290:21, 290:34, 290:77, 290:100, 290:124, 290:146, 290:167 | Wide island panel used for quiz and results |
| 297:24 | Action button icon set |

PNG and SVG assets in `public/assets/` are original Figma exports downloaded for permanent hosting. The full action button set from node 297:24 lives in `public/assets/icons/`, downscaled to 128px for its 26px on-screen size; the sound control uses `icon-sound-on`/`icon-sound-off` and the rest of the set is available for later screens. Passion One is bundled with its SIL Open Font License. Gameplay panels, responsive layouts, and question content extend the supplied scenes.

## Verification

```sh
npm run build
npm test
```

The browser verification script serves the build on a temporary local port, checks every island, plays rounds, verifies best scores, reload persistence, unavailable/corrupt storage, keyboard badge navigation, and mobile overflow, then stops the server. It uses Playwright with locally installed Chrome. Screenshots are written to `screenshots/` (ignored by git).
