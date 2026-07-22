// Full-page screenshot helper for visual QA (e.g. comparing a page against a Figma frame).
//
// Uses Playwright driving the locally-installed Google Chrome (channel: 'chrome'),
// so no Playwright browser download is required.
//
// Usage:
//   1. Start the dev server:   npm start   (or: npx ng serve)
//   2. Run:                    npm run screenshot -- <route> [route2 ...] [--port=4200]
//
// Examples:
//   npm run screenshot -- /modules/social-media-management
//   npm run screenshot -- /modules/social-media-management /modules/project-management --port=4321
//
// Output: PNGs in ./screenshots/, one per route per viewport, e.g.
//   screenshots/modules-social-media-management__desktop.png
//   screenshots/modules-social-media-management__mobile.png

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'screenshots');

// Viewports to capture. Widths chosen to exercise the Tailwind breakpoints
// (mobile < md 768, desktop >= xl 1280).
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 430, height: 900, isMobile: true },
];

// Normalize a route argument to a leading-slash path.
// Git Bash rewrites a leading-slash arg like "/modules/x" into an absolute
// Windows path such as "C:/Program Files/Git/modules/x"; undo that here so the
// script works from Git Bash, PowerShell, and cmd alike.
function normalizeRoute(arg) {
  let r = arg.replace(/\\/g, '/');
  const gitMangled = r.match(/\/Git(\/.*)$/i);
  if (gitMangled) r = gitMangled[1];
  if (!r.startsWith('/')) r = '/' + r;
  return r;
}

function parseArgs(argv) {
  const routes = [];
  let port = 4200;
  for (const arg of argv) {
    if (arg.startsWith('--port=')) {
      port = Number(arg.slice('--port='.length)) || port;
    } else if (arg.startsWith('--')) {
      // ignore unknown flags
    } else {
      routes.push(normalizeRoute(arg));
    }
  }
  if (routes.length === 0) {
    routes.push('/'); // default to home
  }
  return { routes, port };
}

const slug = (route) =>
  route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home';

async function main() {
  const { routes, port } = parseArgs(process.argv.slice(2));
  const baseUrl = `http://localhost:${port}`;
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const route of routes) {
      for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
          isMobile: !!vp.isMobile,
        });
        const page = await context.newPage();
        const url = `${baseUrl}${route}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
          // Give lazy images / fonts a moment to settle.
          await page.waitForTimeout(800);
          const file = join(outDir, `${slug(route)}__${vp.name}.png`);
          await page.screenshot({ path: file, fullPage: true });
          console.log(`✓ ${route} @ ${vp.name} (${vp.width}px) -> ${file}`);
        } catch (err) {
          console.error(`✗ ${route} @ ${vp.name}: ${err.message}`);
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
