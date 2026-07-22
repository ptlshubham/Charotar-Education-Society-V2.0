/**
 * Generates the two root discovery files from src/app/shared/site-links.json — the
 * same list the HTML sitemap page renders, so none of the three can drift apart:
 *
 *   public/sitemap.xml  crawlers          (sitemaps.org schema)
 *   public/llms.txt     LLMs / AI agents  (llmstxt.org convention)
 *
 * Only the groups' `links` are emitted. A group's own `path` is a display label on
 * the sitemap page and is deliberately excluded — a group path may be a redirect
 * or a bare shell route, so it does not belong in either file.
 *
 * Prerendered output is not usable as the source here — /blogs is RenderMode.Client
 * (see app.routes.server.ts) and so has no build-time HTML file, but it is still a
 * real, indexable URL.
 *
 * Run via `npm run site:files`; the build scripts call it first.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Sections an agent can skip when it only needs the gist of the product. */
const OPTIONAL_SECTIONS = new Set(['Legal']);

const SUMMARY =
  'Charotar Education Society is an educational institution. This site covers the ' +
  'institution, its team and careers, along with articles, support and policy pages.';

// The live site is the only host worth advertising.
const env = readFileSync(resolve(root, 'src/environments/environment.production.ts'), 'utf8');
const baseUrl = env.match(/frontendUrl:\s*'([^']+)'/)?.[1]?.replace(/\/$/, '');
if (!baseUrl) throw new Error('Could not read frontendUrl from environment.production.ts');

const siteLinks = JSON.parse(readFileSync(resolve(root, 'src/app/shared/site-links.json'), 'utf8'));
const groups = [...siteLinks.primary, siteLinks.support, ...siteLinks.secondary];

// ─── sitemap.xml ───
const paths = [...new Set(groups.flatMap((group) => group.links.map((link) => link.path)))].sort();

writeFileSync(
  resolve(root, 'public/sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')
);

// ─── llms.txt ───
const linkLine = (link) => `- [${link.label}](${baseUrl}${link.path})`;
const section = (group) => [`## ${group.title}`, '', ...group.links.map(linkLine), ''];

const main = groups.filter((group) => !OPTIONAL_SECTIONS.has(group.title));
const optional = groups.filter((group) => OPTIONAL_SECTIONS.has(group.title));

writeFileSync(
  resolve(root, 'public/llms.txt'),
  [
    '# ZarklyX',
    '',
    `> ${SUMMARY}`,
    '',
    ...main.flatMap(section),
    // Per llmstxt.org, "Optional" marks pages that can be dropped from a short context.
    ...(optional.length ? ['## Optional', '', ...optional.flatMap((group) => group.links.map(linkLine)), ''] : []),
  ].join('\n')
);

console.log(`sitemap.xml — ${paths.length} URLs at ${baseUrl}`);
console.log(`llms.txt    — ${main.length} sections, ${optional.flatMap((g) => g.links).length} optional links`);
