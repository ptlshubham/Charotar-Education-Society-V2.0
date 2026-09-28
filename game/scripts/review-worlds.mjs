// Visual review of runtime-normalized artwork and each playable world.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import ts from 'typescript';
import { chromium } from 'playwright';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'screenshots');
await mkdir(out, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path.startsWith('/__source__/')) {
      const name = path.slice(12).replace(/\.(js|ts)$/, '');
      if (!/^[a-z-]+$/.test(name)) throw Error('Invalid module');
      const code = await readFile(resolve(root, 'src/platformer', name + '.ts'), 'utf8');
      res.setHeader('Content-Type', 'text/javascript');
      res.end(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText);
      return;
    }
    const file = resolve(root, 'dist/browser', '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(resolve(root, 'dist/browser') + sep)) throw Error('Invalid path');
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' })[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(base + '/#/arcade');
  await page.waitForFunction(() => window.__cesArcade?.ready(), { timeout: 60000 });
  const report = await page.evaluate(() => window.__cesArcade.assetReport());
  console.log('Asset issues:', JSON.stringify(report.issues));
  assert.deepEqual(report.issues, []);
  for (const [index, theme] of ['jungle','desert','volcano','ice','castle','canopy','village'].entries()) {
    const buttons = page.locator('.arcade-card');
    await buttons.nth(index).click();
    await page.locator('canvas').waitFor();
    await page.evaluate(() => { window.__cesArcade.pause(); window.__cesArcade.run(1); window.__cesArcade.render(); });
    await page.screenshot({ path: resolve(out, `world-${theme}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Pause the game', exact: true }).click();
    await page.getByRole('button', { name: 'Quit to levels', exact: true }).click();
  }
  assert.deepEqual(errors, []);
  // Review the actual atlas outputs against a contrasting background.
  await page.evaluate(async () => {
    const { loadSheets, SPRITES } = await import('/__source__/sprites.js');
    const { sheets, report } = await loadSheets();
    window.artReview = { sheets, report, slots: SPRITES };
  });
  for (const theme of ['desert','ice','volcano','castle','village']) {
    await page.evaluate(theme => {
      const { sheets, slots } = window.artReview;
      document.body.innerHTML = '<style>body{background:#60737c;color:white;font:16px Arial;margin:20px}h2{margin:12px 0 5px}canvas{max-width:100%;height:auto;background:repeating-conic-gradient(#758890 0% 25%,#657880 0% 50%) 0/20px 20px}</style>';
      for (const s of slots.filter(s => s.slot.startsWith(theme + '-') || s.slot === 'tiles-' + theme)) {
        const title = document.createElement('h2'); title.textContent = s.slot;
        const canvas = document.createElement('canvas'); const image = sheets[s.slot];
        canvas.width = image.width; canvas.height = image.height; canvas.getContext('2d').drawImage(image, 0, 0);
        document.body.append(title, canvas);
      }
    }, theme);
    await page.screenshot({ path: resolve(out, `atlas-${theme}.png`), fullPage: true });
  }
  console.log('PASS: all seven worlds and supplied atlas regions load without errors. Screenshots in game/screenshots.');
} finally { await browser.close(); await new Promise(done => server.close(done)); }
