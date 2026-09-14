import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';
import { zones } from '../src/questions.ts';
import { levels, countCoins, PHYS, jumpApexPx, jumpRangePx } from '../src/platformer/levels.ts';
import { createWorld, step, parseSolution } from '../src/platformer/engine.ts';

// Step 0, before anything is served or rendered: the committed sprite sheets and
// SWAP-LIST.md must match sprites.ts, and the engine must satisfy the envelope
// every level's geometry is authored against. Both are cheap and fail loudly.
execFileSync('node', ['scripts/make-sprites.mjs', '--check'], { stdio: 'inherit', cwd: fileURLToPath(new URL('../', import.meta.url)) });

// Discrete Euler (vy += g, then y += vy), never the continuous v^2/2g: a jump
// clears 45px and covers 61.6px at full run. Question blocks are placed against
// exactly these numbers, so a physics change must fail here, not in play.
assert.ok(Math.abs(jumpApexPx() - 45) < 1e-9, `Jump apex is 45px, got ${jumpApexPx()}`);
assert.ok(Math.abs(jumpRangePx() - 61.6) < 1e-9, `Jump range is 61.6px, got ${jumpRangePx()}`);

// Levels replay headlessly — same engine, no browser, no rAF.
for (const [index, level] of levels.entries()) {
  const world = createWorld(index);
  assert.equal(world.coinTotal, countCoins(level), `${level.id}: coinTotal matches the grid`);
  assert.ok(level.solution.length > 0, `${level.id}: ships no recorded solution — run the in-game recorder`);
  for (const input of parseSolution(level.solution)) {
    step(world, input);
    if (world.status !== 'play') break;
  }
  assert.equal(world.status, 'clear', `${level.id}: the recorded solution clears the level`);
  assert.ok(world.tick <= level.tickBudget, `${level.id}: cleared in ${world.tick} ticks, budget is ${level.tickBudget}`);
  // The recorded run is death-free, so a physics change that makes it lossy is a regression.
  assert.equal(world.lives, PHYS.startLives, `${level.id}: the recorded solution loses no lives`);
}

const root = fileURLToPath(new URL('../dist/browser/', import.meta.url));
const screenshots = fileURLToPath(new URL('../screenshots/', import.meta.url));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.md': 'text/markdown' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/game\//, '/');
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(resolve(root) + sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await mkdir(screenshots, { recursive: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let browser;
const errors = [];
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}/game/index.html`, { waitUntil: 'networkidle' });
  for (const selector of ['.cloud-one', '.balloon > img', '.flag > img', '.land-trophy > img', '.map-scroll > img']) {
    assert.notEqual(await page.locator(selector).evaluate(el => getComputedStyle(el).animationName), 'none', `${selector} has an animation`);
  }
  await page.getByRole('button', { name: 'Send the balloon on an adventure' }).click();
  await page.locator('.scene-message.is-visible').waitFor();
  assert.match(await page.locator('.scene-message').innerText(), /Up, up, and away/);
  await page.getByRole('button', { name: 'Wave the CES flag' }).click();
  await page.waitForFunction(() => document.querySelector('.scene-message').textContent.includes('Fly the CES flag'));
  await page.getByRole('button', { name: 'Open your trophy collection' }).focus();
  await page.keyboard.press('Enter');
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.effects-controls').count(), 0, 'No motion toggle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.balloon > img')).animationName === 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Turn sound on', exact: true }).click();
  await page.getByRole('button', { name: 'Turn sound off', exact: true }).click();
  await page.getByRole('button', { name: 'Turn sound on', exact: true }).waitFor();
  await page.screenshot({ path: resolve(screenshots, 'welcome-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.getByLabel('What should we call you, explorer?').fill('Student Explorer');
  await page.getByRole('button', { name: 'Let’s play' }).click();
  await page.getByRole('heading', { name: 'Choose your next adventure' }).waitFor();
  await page.screenshot({ path: resolve(screenshots, 'map-desktop.png'), fullPage: true, animations: 'disabled' });
  assert.equal(await page.locator('.island').count(), 7);

  for (const zone of zones) {
    await page.getByRole('button', { name: `Explore ${zone.name}`, exact: true }).click();
    await page.getByRole('heading', { name: zone.name, exact: true }).waitFor();
    await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: resolve(screenshots, `island-${zone.id}-desktop.png`), fullPage: true, animations: 'disabled' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: zone.name, exact: true }).waitFor();
    assert.equal(await page.locator('.island-intro .zone-panel-art').evaluate(el => el.naturalWidth > 0), true, `${zone.id} panel artwork loads`);
    await page.getByRole('button', { name: 'Back', exact: true }).click();
  }

  const knowledge = zones[0];
  const playRound = async (correct) => {
    await page.getByRole('button', { name: 'Start quest' }).click();
    const seen = new Set();
    for (let index = 0; index < 5; index++) {
      await page.getByText(`Question ${index + 1} of 5`, { exact: true }).waitFor();
      const prompt = await page.locator('.quiz-panel h1').innerText();
      assert.ok(!seen.has(prompt), 'Questions must not repeat in a round');
      seen.add(prompt);
      const question = knowledge.questions.find(question => question.prompt === prompt);
      assert.ok(question, 'Displayed question belongs to selected island');
      await page.locator('.answer').nth(correct ? question.answer : (question.answer + 1) % 4).click();
      await page.locator('.answer:disabled').first().waitFor();
      assert.equal(await page.locator('.answer:disabled').count(), 4, 'Answer locks after one attempt');
      assert.equal(await page.locator('.answer-feedback p').innerText(), question.explanation);
      if (index === 0) await page.screenshot({ path: resolve(screenshots, `quiz-${correct ? 'correct' : 'incorrect'}.png`), fullPage: true, animations: 'disabled' });
      await page.getByRole('button', { name: index === 4 ? 'See my results' : 'Next question' }).click();
    }
    await page.locator('.result-panel').waitFor();
  };
  await page.getByRole('button', { name: 'Explore General Knowledge', exact: true }).click();
  await playRound(true);
  assert.equal(await page.locator('.result-score').innerText(), '100 / 100 XP');
  await page.screenshot({ path: resolve(screenshots, 'result-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.reload({ waitUntil: 'networkidle' });
  assert.match(await page.locator('.island-intro').innerText(), /Your best: 100/);
  await playRound(false);
  assert.equal(await page.locator('.result-score').innerText(), '0 / 100 XP');
  assert.match(await page.locator('.result-panel').innerText(), /Island best: 100 XP · Total best: 100 XP/);
  await page.getByRole('button', { name: 'view badges' }).click();
  assert.equal(await page.locator('.badge-row.earned').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog.achievements').evaluate(el => el.open), false);
  await page.getByRole('button', { name: 'Explore more islands' }).click();
  await page.getByRole('button', { name: /^Explore General Knowledge/ }).click();
  await page.getByRole('button', { name: 'Start quest' }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.locator('.leave-confirm[open]').waitFor();
  assert.equal(await page.locator('.leave-confirm .zone-panel-art').evaluate(el => el.naturalWidth > 0), true, 'Leave dialog uses the island artwork');
  await page.getByRole('button', { name: 'Keep playing' }).click();
  await page.locator('.leave-confirm').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('.quiz-panel').count(), 1);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Leave round' }).click();
  await page.locator('.island-intro').waitFor();
  assert.equal(await page.locator('.island-intro').count(), 1);

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [route, label] of [['/', 'welcome'], ['/map', 'map'], ['/island/tech', 'island']]) {
      await page.goto(`${base}/game/index.html#${route}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: resolve(screenshots, `${label}-${width}.png`), fullPage: true, animations: 'disabled' });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow at ${width}px on ${label}`);
    }
    await page.getByRole('button', { name: 'Start quest' }).click();
    await page.locator('.quiz-panel').waitFor();
    await page.waitForFunction(() => {
      const panel = document.querySelector('.quiz-panel');
      return panel && getComputedStyle(panel).opacity === '1';
    });
    await page.screenshot({ path: resolve(screenshots, `quiz-${width}.png`), fullPage: true, animations: 'disabled' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Quiz fits at ${width}px`);
  }

  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByLabel('What should we call you, explorer?').inputValue(), 'Student Explorer');
  await page.evaluate(() => localStorage.setItem('ces-learning-quest-v1', '{bad json'));
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.storage-notice').count(), 1);
  await page.getByRole('button', { name: 'Let’s play' }).click();
  await page.getByRole('heading', { name: 'Choose your next adventure' }).waitFor();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } }); });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(base, { waitUntil: 'networkidle' });
  await blockedPage.getByRole('button', { name: 'Let’s play' }).click();
  await blockedPage.getByRole('heading', { name: 'Choose your next adventure' }).waitFor();
  assert.equal(await blockedPage.locator('.storage-notice').count(), 1);
  await blocked.close();

  // ---------------------------------------------------------------------------
  // CES Arcade. Its own context: `page` above owns one localStorage whose write
  // order the quiz assertions depend on, and `errors` is bound to `page` alone.
  //
  // DOM contract with arcade.ts — the only page structure this harness knows:
  //   one <canvas>, a 512x288 backing store
  //   .hud-coins   text contains the coin count
  //   .hud-life    one element per remaining life
  //   buttons labelled 'Move left' / 'Move right' / 'Jump'
  // Harness contract — window.__cesArcade:
  //   version, ready(), assetReport(), state(), input(), drainEvents(),
  //   pause(), run(ticks), advance(ms) -> ticks stepped, render(), reset(level, [x, y]?)
  // ---------------------------------------------------------------------------
  const arcade = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const arcadePage = await arcade.newPage();
  arcadePage.on('pageerror', error => errors.push(`arcade: ${error.message}`));
  arcadePage.on('requestfailed', request => errors.push(`arcade: ${request.url()} ${request.failure()?.errorText ?? 'request failed'}`));
  arcadePage.on('response', response => { if (response.status() >= 400) errors.push(`arcade: ${response.status()} ${response.url()}`); });
  // Under @defer the harness does not exist yet when networkidle resolves.
  const arcadeReady = async () => {
    await arcadePage.waitForFunction(() => Boolean(window.__cesArcade));
    await arcadePage.waitForFunction(() => window.__cesArcade.ready());
  };
  const state = () => arcadePage.evaluate(() => window.__cesArcade.state());
  const mask = () => arcadePage.evaluate(() => window.__cesArcade.input());
  await arcadePage.goto(`${base}/game/index.html#/arcade`, { waitUntil: 'networkidle' });
  await arcadeReady();
  // The arcade opens on the level-select menu, so the canvas, the HUD and the
  // keyboard gate do not exist until a level is entered. reset() enters one.
  await arcadePage.evaluate(() => { window.__cesArcade.pause(); window.__cesArcade.reset(0); });
  await arcadePage.locator('canvas').waitFor();
  await arcadePage.evaluate(() => window.__cesArcade.render());

  assert.equal(await arcadePage.evaluate(() => window.__cesArcade.version), 1, 'Harness version is the one this file speaks');
  assert.equal(await arcadePage.evaluate(() => window.__cesArcade.ready()), true, 'Arcade reports ready');
  assert.deepEqual(await arcadePage.evaluate(() => window.__cesArcade.assetReport().issues), [], 'Every sprite sheet is a declared size');
  assert.deepEqual(await arcadePage.locator('canvas').evaluate(el => [el.width, el.height]), [512, 288], 'Canvas backing store is the virtual resolution');
  assert.equal((await state()).coinTotal, countCoins(levels[0]), 'Level 1 coin total matches its grid');
  assert.equal((await arcade.request.get(`${base}/game/assets/arcade/SWAP-LIST.md`)).status(), 200, 'SWAP-LIST.md ships with the build');

  // run() is the only clock while paused, so ticks add up exactly.
  await arcadePage.evaluate(() => { const a = window.__cesArcade; a.pause(); a.reset(0); a.run(30); a.run(90); a.run(1); a.run(60); });
  assert.equal((await state()).tick, 181, 'Ticks accumulate one for one across run() calls');

  // A long stall must not be simulated away in one frame.
  const caughtUp = await arcadePage.evaluate(() => { const a = window.__cesArcade; a.pause(); a.reset(0); a.run(30); return a.advance(5000); });
  assert.ok(caughtUp <= PHYS.maxCatchUp, `A 5s hitch catches up at most ${PHYS.maxCatchUp} ticks, stepped ${caughtUp}`);
  assert.equal((await state()).grounded, true, 'The player does not fall through the floor after a hitch');

  // Dropped into the lava pit at column 40: one hurt, one life gone, not a loop.
  const hazard = await arcadePage.evaluate(() => {
    const a = window.__cesArcade;
    a.pause(); a.reset(0, [40 * 16, 240]); a.drainEvents(); a.run(30);
    return { types: a.drainEvents().map(event => event.type), lives: a.state().lives };
  });
  assert.equal(hazard.types.filter(type => type === 'hurt').length, 1, `The pit hurts exactly once, got ${hazard.types.join(',')}`);
  assert.equal(hazard.lives, PHYS.startLives - 1, 'A hazard costs one life');

  // The HUD is a signal view of the same world the canvas draws.
  await arcadePage.waitForFunction(() => {
    const s = window.__cesArcade.state();
    const coins = document.querySelector('.hud-coins');
    return Boolean(coins) && coins.textContent.includes(String(s.coins)) && document.querySelectorAll('.hud-life').length === s.lives;
  });
  assert.equal(await arcadePage.locator('.hud-life').count(), PHYS.startLives - 1, 'One life icon per remaining life after the lava hit');

  // Landing on the walker at column 22. Guards the regression where a stomp was
  // also resolved as a hit and quietly cost a life.
  const stomp = await arcadePage.evaluate(() => {
    const a = window.__cesArcade;
    a.pause(); a.reset(0, [354, 214]); a.drainEvents(); a.run(20);
    return { types: a.drainEvents().map(event => event.type), lives: a.state().lives };
  });
  assert.ok(stomp.types.includes('stomp'), `Dropping onto a walker stomps it, got ${stomp.types.join(',')}`);
  assert.ok(!stomp.types.includes('hurt'), 'A stomp is never also a hit');
  assert.equal(stomp.lives, PHYS.startLives, 'A stomp costs no life');

  for (const [key, field] of [['ArrowLeft', 'left'], ['ArrowRight', 'right'], ['ArrowUp', 'jump'], ['KeyA', 'left'], ['KeyD', 'right'], ['KeyW', 'jump'], ['Space', 'jump']]) {
    await arcadePage.keyboard.down(key);
    assert.equal((await mask())[field], true, `${key} holds ${field}`);
    await arcadePage.keyboard.up(key);
    // A jump press is latched so a tap that begins and ends between two frames
    // is never dropped, so the latch outlives the keyup by design. One tick
    // consumes it; only then should the mask read clear.
    await arcadePage.evaluate(() => window.__cesArcade.run(1));
    assert.equal((await mask())[field], false, `Releasing ${key} clears ${field}`);
  }
  assert.equal(await arcadePage.evaluate(() => scrollY), 0, 'Space jumps without scrolling the page');

  // Same inputs, same world: twice in one page and again after a reload. Any
  // Math.random, Date.now or frame-time leak into the simulation shows up here.
  const script = [
    { keys: ['ArrowRight'], ticks: 45 },
    { keys: ['ArrowRight', 'Space'], ticks: 20 },
    { keys: ['ArrowRight'], ticks: 25 },
    { keys: [], ticks: 30 },
    { keys: ['ArrowLeft', 'Space'], ticks: 25 },
    { keys: [], ticks: 40 },
  ];
  const replay = async () => {
    await arcadePage.evaluate(() => { const a = window.__cesArcade; a.pause(); a.reset(0); });
    const trace = [];
    let held = [];
    for (const beat of script) {
      for (const key of held) if (!beat.keys.includes(key)) await arcadePage.keyboard.up(key);
      for (const key of beat.keys) if (!held.includes(key)) await arcadePage.keyboard.down(key);
      held = beat.keys;
      await arcadePage.evaluate(ticks => window.__cesArcade.run(ticks), beat.ticks);
      trace.push(await state());
    }
    for (const key of held) await arcadePage.keyboard.up(key);
    return trace;
  };
  const traced = await replay();
  assert.deepEqual(await replay(), traced, 'The same input script replays identically in one page');
  await arcadePage.reload({ waitUntil: 'networkidle' });
  await arcadeReady();
  assert.deepEqual(await replay(), traced, 'The same input script replays identically after a reload');

  const overlaps = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  const pad = [['Move left', 'left'], ['Move right', 'right'], ['Jump', 'jump']];
  for (const [label, width, height] of [['desktop', 1440, 900], ['landscape', 844, 390], ['390', 390, 844], ['320', 320, 844]]) {
    await arcadePage.setViewportSize({ width, height });
    // animations: 'disabled' does nothing to a rAF canvas loop — pause() plus an
    // explicit render() is the only way to screenshot a stable frame.
    await arcadePage.evaluate(() => { const a = window.__cesArcade; a.pause(); a.reset(0); a.run(120); a.render(); });
    const canvas = await arcadePage.locator('canvas').boundingBox();
    assert.ok(Math.abs(canvas.width / canvas.height - 16 / 9) < 0.01, `Canvas stays 16:9 at ${label}, measured ${canvas.width}x${canvas.height}`);
    assert.ok(await arcadePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No horizontal overflow in the arcade at ${label}`);
    const painted = await arcadePage.evaluate(() => {
      const ctx = document.querySelector('canvas').getContext('2d');
      const seen = new Set();
      for (let y = 4; y < 288; y += 16) for (let x = 4; x < 512; x += 16) {
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        seen.add(`${r},${g},${b}`);
      }
      return seen.size;
    });
    assert.ok(painted > 3, `The canvas is actually painted at ${label}, found ${painted} distinct colours`);
    await arcadePage.screenshot({ path: resolve(screenshots, `arcade-${label}.png`) });
    if (width > 480) continue;
    for (const [name] of pad) {
      const box = await arcadePage.getByRole('button', { name, exact: true }).boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, `${name} is at least 44x44 at ${label}, measured ${box.width}x${box.height}`);
      assert.ok(!overlaps(box, canvas), `${name} never covers the canvas at ${label}`);
    }
  }

  await arcadePage.setViewportSize({ width: 390, height: 844 });
  for (const [name, field] of pad) {
    const box = await arcadePage.getByRole('button', { name, exact: true }).boundingBox();
    await arcadePage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await arcadePage.mouse.down();
    assert.equal((await mask())[field], true, `Pressing ${name} holds ${field}`);
    await arcadePage.mouse.up();
    // One tick consumes the jump latch; see the keyboard block above.
    await arcadePage.evaluate(() => window.__cesArcade.run(1));
    assert.equal((await mask())[field], false, `Releasing ${name} clears ${field}`);
  }
  await arcade.close();

  assert.deepEqual(errors, [], 'No browser errors or failed assets');
  console.log('PASS: animated scenery, interactive props, reduced motion, opt-in sound, per-island panel artwork, arcade platformer (physics envelope, recorded level replay, determinism, hazards, stomps, keyboard and touch input, HUD mirror, canvas aspect at four viewports), seven island scenes, deep links, correct/incorrect rounds, unique questions, score locking, badges, persistence, quit confirmation, root/subpath hosting, mobile layouts, and storage recovery.');
  console.log('PASS (arcade): sprite sheets current, jump envelope, level replay, lazy-loaded route, asset report, 512x288 canvas painted and 16:9 at four viewports, tick accounting, hitch cap, lava hazard, stomp without damage, HUD mirroring, keyboard and touch input, and mobile layouts.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
