import { readdir, readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const root = resolve(import.meta.dirname, '../public/assets/arcade');
const out = resolve(import.meta.dirname, '../screenshots');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  for (const theme of ['Desert', 'Ice', 'Volcano', 'Castle', 'Village']) {
    const dir = resolve(root, `${theme} World`);
    const cards = [];
    for (const file of (await readdir(dir)).filter(f => /\.(png|jpeg)$/.test(f))) {
      const data = await readFile(resolve(dir, file));
      cards.push(`<figure><figcaption>${file}</figcaption><img src="data:image/${file.endsWith('.png') ? 'png' : 'jpeg'};base64,${data.toString('base64')}"></figure>`);
    }
    await page.setContent(`<style>body{margin:0;background:#263038;color:white;font:13px Arial}main{display:grid;grid-template-columns:repeat(3,1fr)}figure{margin:8px;height:270px}img{width:100%;height:240px;object-fit:contain;background:#50585a}figcaption{height:30px}</style><h1>${theme}</h1><main>${cards.join('')}</main>`);
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
    await page.screenshot({ path: resolve(out, `source-${theme.toLowerCase()}.png`), fullPage: true });
  }
} finally { await browser.close(); }
