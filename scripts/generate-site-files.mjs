/**
 * Generates the root discovery files. Page structure comes from src/app/shared/site-links.json
 * - the same list the HTML sitemap page renders, so none of them can drift apart - and the
 * AI settings from super admin → SEO Management (fetched from the public SEO API):
 *
 *   public/sitemap.xml  crawlers          (sitemaps.org schema) - pages + every blog post
 *   public/llms.txt     LLMs / AI agents  (llmstxt.org convention) - AI summaries + key facts,
 *                                         and every blog post (the 2015 archive as its own section)
 *   public/robots.txt   all crawlers      - AI crawler access per platform + per-page blocks
 *
 * On the hosted site these are only fallbacks: .htaccess sends /sitemap.xml, /llms.txt and
 * /blog/<slug> to public/site-live.php, which swaps in the live blog posts from the API, so a post
 * published in the dashboard needs no rebuild. This script also writes public/site-live.json (the
 * API that file reads) and takes its blog entries from the same API endpoint (blog-index).
 *
 * Only the groups' `links` are emitted. A group's own `path` is a display label on
 * the sitemap page and is deliberately excluded - a group path may be a redirect
 * or a bare shell route, so it does not belong in either file.
 *
 * Prerendered output is not usable as the source here - routes like /home/blog/:slug
 * are RenderMode.Client (see app.routes.server.ts) and so have no build-time HTML
 * file, but they are still real, indexable URLs.
 *
 * If the SEO API can't be reached, robots.txt and llms.txt are left as they are (the last
 * good build's) rather than regenerated without the admin's AI blocks. SEO_API_URL
 * overrides the API for a local build, e.g. SEO_API_URL=http://localhost:9000.
 *
 * Run via `npm run site:files`; the build scripts call it first.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Sections an agent can skip when it only needs the gist of the product. */
const OPTIONAL_SECTIONS = new Set(['Legal']);

/** Used only until an "About the Organisation (for AI)" text is saved in super admin. */
const SUMMARY =
  'Charotar Education Society (CES) is a charitable education society in Anand, Gujarat, India, ' +
  'established in 1916. It runs schools, colleges and hostels.';

/** Kept away from every crawler. */
const DISALLOW_ALL = ['/error'];
/** Also kept away from AI crawlers: the chat app and its shared chats - nothing to learn, and shares are private. */
const DISALLOW_AI = ['/dyuno'];

// The live site is the only host worth advertising.
const env = readFileSync(resolve(root, 'src/environments/environment.production.ts'), 'utf8');
const baseUrl = env.match(/frontendUrl:\s*'([^']+)'/)?.[1]?.replace(/\/$/, '');
if (!baseUrl) throw new Error('Could not read frontendUrl from environment.production.ts');
const apiUrl = (process.env.SEO_API_URL || env.match(/apiUrl:\s*'([^']+)'/)?.[1] || '').replace(/\/$/, '');

const siteLinks = JSON.parse(readFileSync(resolve(root, 'src/app/shared/site-links.json'), 'utf8'));
const groups = [...siteLinks.primary, siteLinks.support, ...siteLinks.secondary];

// ─── site-live.json ───
// The API public/site-live.php reads to serve sitemap.xml, llms.txt and /blog/<slug> live on the
// hosted site. Always the production API - an SEO_API_URL override is for this build's input only.
const liveApi = (env.match(/apiUrl:\s*'([^']+)'/)?.[1] || '').replace(/\/$/, '');
writeFileSync(resolve(root, 'public/site-live.json'), `${JSON.stringify({ api: liveApi }, null, 2)}\n`);

// ─── Blog posts ───
// Formatted by the API (GET /seo/public/blog-index) - the very entries site-live.php serves live,
// so a post published after this build is listed there at once. The copies written below are the
// fallback for a host without PHP.
const blog = await fetchBlogIndex();

// ─── sitemap.xml ───
const SITEMAP = resolve(root, 'public/sitemap.xml');
const paths = [...new Set(groups.flatMap((group) => group.links.map((link) => link.path)))].sort();
// Without the blog index, keep the post URLs of the last good build rather than drop them.
const postUrls = blog
  ? blog.sitemap
  : readFileSync(SITEMAP, 'utf8').split('\n').filter((line) => line.includes(`<loc>${baseUrl}/blog/`));

writeFileSync(
  SITEMAP,
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${baseUrl}${path}</loc></url>`),
    ...postUrls,
    '</urlset>',
    '',
  ].join('\n')
);
console.log(`sitemap.xml - ${paths.length} pages + ${postUrls.length} blog posts${blog ? '' : ' (kept from the last build)'} at ${baseUrl}`);

// robots.txt and llms.txt need the SEO API; when a piece of it is missing the block stops early and
// leaves the old files in place. (A `break`, not process.exit(): exiting while fetch still holds a
// connection aborts Node on Windows with a libuv assertion, which would fail `npm run build`.)
aiFiles: {
  // ─── AI settings from super admin ───
  const seo = await fetchSeo();
  if (!seo) {
    console.warn(`! SEO API unreachable at ${apiUrl || '(no apiUrl)'} - robots.txt and llms.txt left unchanged`);
  break aiFiles;
  }

  /** One line of admin text: no newlines or runs of spaces (they would break the file's structure). */
  const oneLine = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
  /** Page path as robots.txt may carry it - mirrors robotsPath() in the backend seo service. */
  const safePath = (value) => {
    const path = String(value ?? '').trim();
    return path.startsWith('/') ? path.replace(/[^A-Za-z0-9/_\-.~%]/g, '') || null : null;
  };
  const safeAgent = (value) => (/^[A-Za-z0-9._-]+$/.test(value) ? value : null);
  const normalisePath = (path) => path.replace(/\/+$/, '') || '/';

  const pagesByPath = new Map((seo.pages ?? []).map((page) => [normalisePath(String(page.path ?? '')), page]));
  const aiRobots = seo.aiRobots ?? {};
  const blockedPaths = [...new Set((aiRobots.blockedPaths ?? []).map(safePath).filter(Boolean))];
  const isBlocked = (path) => blockedPaths.includes(normalisePath(path));

  // ─── robots.txt ───
  // A crawler obeys only the most specific group naming it, so every AI group repeats the
  // site-wide rules - otherwise naming GPTBot would silently free it from "Disallow: /error".
  const allowAgents = (aiRobots.allow ?? []).map(safeAgent).filter(Boolean);
  const blockAgents = (aiRobots.block ?? []).map(safeAgent).filter(Boolean);
  // "Disallow: /" would block the whole site; a blocked home page is blocked as exactly "/".
  const aiPageRules = blockedPaths.map((path) => `Disallow: ${path === '/' ? '/$' : path}`);

  writeFileSync(
    resolve(root, 'public/robots.txt'),
    [
      '# Generated by scripts/generate-site-files.mjs from super admin → SEO Management.',
      '# Do not edit by hand - the next build overwrites it.',
      '',
      'User-agent: *',
      'Allow: /',
      ...DISALLOW_ALL.map((path) => `Disallow: ${path}`),
      '',
      ...(allowAgents.length
        ? [
            '# AI assistants and AI search - allowed',
            ...allowAgents.map((agent) => `User-agent: ${agent}`),
            'Allow: /',
            ...[...DISALLOW_ALL, ...DISALLOW_AI].map((path) => `Disallow: ${path}`),
            ...aiPageRules,
            '',
          ]
        : []),
      ...(blockAgents.length
        ? ['# AI crawlers - blocked', ...blockAgents.map((agent) => `User-agent: ${agent}`), 'Disallow: /', '']
        : []),
      `Sitemap: ${baseUrl}/sitemap.xml`,
      '',
    ].join('\n')
  );
  console.log(`robots.txt  - ${allowAgents.length} AI agents allowed, ${blockAgents.length} blocked, ${blockedPaths.length} pages kept from AI`);

  // ─── llms.txt ───
  const defaults = seo.defaults ?? {};
  const siteName = oneLine(defaults.siteName) || 'Charotar Education Society';
  // Not the meta description: that one is written to win clicks (and is auto-seeded as
  // "Welcome to ..."), while an AI tool needs plain facts.
  const summary = oneLine(defaults.aiSummary) || SUMMARY;
  const facts = String(defaults.aiDetails ?? '').split(/\r?\n/).map(oneLine).filter(Boolean);

  const linkLine = (link) => {
    const note = oneLine(pagesByPath.get(normalisePath(link.path))?.aiSummary);
    return `- [${link.label}](${baseUrl}${link.path})${note ? `: ${note}` : ''}`;
  };
  const visibleLinks = (group) => group.links.filter((link) => !isBlocked(link.path));
  const section = (group) => [`## ${group.title}`, '', ...visibleLinks(group).map(linkLine), ''];

  const main = groups.filter((group) => !OPTIONAL_SECTIONS.has(group.title) && visibleLinks(group).length);
  const optional = groups.filter((group) => OPTIONAL_SECTIONS.has(group.title));
  const optionalLinks = optional.flatMap(visibleLinks);

  // Every blog post, so an assistant can find an article without crawling the blog (the API's
  // "## Blog" and "## Centenary Blog Archive (2015)" sections - site-live.php swaps in live ones).
  if (!blog) {
    console.warn('! Blog index unreachable - llms.txt left unchanged so it keeps its blog posts');
  break aiFiles;
  }

  writeFileSync(
    resolve(root, 'public/llms.txt'),
    [
      `# ${siteName}`,
      '',
      `> ${summary}`,
      '',
      ...(facts.length ? ['Key facts:', '', ...facts.map((fact) => `- ${fact}`), ''] : []),
      ...main.flatMap(section),
      ...(blog.llms.trim() ? [blog.llms.trim(), ''] : []),
      // Per llmstxt.org, "Optional" marks pages that can be dropped from a short context.
      ...(optionalLinks.length ? ['## Optional', '', ...optionalLinks.map(linkLine), ''] : []),
    ].join('\n')
  );
  console.log(`llms.txt    - ${main.length} sections, ${blog.count} blog posts, ${optionalLinks.length} optional links, ${facts.length} key facts`);
}

/** The blog's sitemap lines and llms.txt sections from the API - or null when it can't be read. */
async function fetchBlogIndex() {
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/seo/public/blog-index?site=${encodeURIComponent(baseUrl)}`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json())?.data;
    return Array.isArray(data?.sitemap) && typeof data?.llms === 'string' ? data : null;
  } catch (e) {
    console.warn(`! blog index: ${e.message}`);
    return null;
  }
}

async function fetchSeo() {
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/seo/public/all`, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    // An API from before the AI settings existed has no aiRobots - treat it as unreachable
    // rather than publish files that silently drop the admin's choices.
    return body?.data?.aiRobots ? body.data : null;
  } catch (e) {
    console.warn(`! ${e.message}`);
    return null;
  }
}
