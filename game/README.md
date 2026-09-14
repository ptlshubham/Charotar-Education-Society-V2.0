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
- The effects controls pause animation or enable optional quiet synthesized chimes. Sound starts off, reduced-motion settings suppress animation, and background tabs suspend audio and pause motion. All effects remain inside `game/`; no animation or audio dependencies are needed. Scenery effects are styled in `src/effects.scss`.

## Design sources

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

PNG and SVG assets in `public/assets/` are original Figma exports downloaded for permanent hosting. Passion One is bundled with its SIL Open Font License. Gameplay panels, responsive layouts, and question content extend the supplied scenes.

## Verification

```sh
npm run build
npm test
```

The browser verification script serves the build on a temporary local port, checks every island, plays rounds, verifies best scores, reload persistence, unavailable/corrupt storage, keyboard badge navigation, and mobile overflow, then stops the server. It uses Playwright with locally installed Chrome. Screenshots are written to `screenshots/` (ignored by git).
