import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';
import { zones } from '../src/questions.ts';

const root = fileURLToPath(new URL('../dist/browser/', import.meta.url));
const screenshots = fileURLToPath(new URL('../screenshots/', import.meta.url));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf' };
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
  assert.equal(await page.locator('.quiz-panel').count(), 1);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await page.getByRole('button', { name: 'Leave round' }).click();
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
  assert.deepEqual(errors, [], 'No browser errors or failed assets');
  console.log('PASS: animated scenery, interactive props, reduced motion, opt-in sound, per-island panel artwork, seven island scenes, deep links, correct/incorrect rounds, unique questions, score locking, badges, persistence, quit confirmation, root/subpath hosting, mobile layouts, and storage recovery.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
