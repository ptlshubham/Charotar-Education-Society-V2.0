import { RenderMode, ServerRoute } from '@angular/ssr';
import { LEADERS } from './shared/leaders';
import { PROJECTS } from './shared/projects';
import { ACTIVITY_PAGES } from './shared/social-activities';

/**
 * Render modes are tuned for static hosting: the build output is rsynced to a
 * plain docroot, so there is no Node process to render per request.
 *
 * What that means for the admin-managed SEO (super admin → SEO Management):
 * - Prerendered routes bake whatever the API returned *at build time*, so
 *   non-JS crawlers (Facebook, LinkedIn, X, WhatsApp) see the last deploy's meta.
 * - Real visitors and Googlebot run the app, and SeoService refetches the live
 *   payload on hydration (it is excluded from the transfer cache), so they always
 *   see current values.
 * - Client-rendered routes below produce no crawler-visible meta at all.
 *
 * TO GO FULLY LIVE (once the site runs under Node/pm2, e.g. on the backend VPS):
 * switch the `RenderMode.Client` entries and the `**` entry to `RenderMode.Server`.
 * Nothing outside this file needs to change  the components and SeoService
 * already fetch and apply their meta during server rendering.
 */
export const serverRoutes: ServerRoute[] = [
  {
    // Year-based detail pages. Prerender can only bake years that exist at build
    // time, so a newly published year would 404 on static hosting.
    path: 'navratri/:year',
    renderMode: RenderMode.Client,
  },
  {
    // Posts are published from the dashboard at any time, so none is baked into the build.
    // On the hosted site .htaccess sends /blog/<slug> to public/site-live.php, which writes the
    // post's title, meta tags, BlogPosting JSON-LD and text into this app shell, live from the
    // API - crawlers that never run JavaScript (AI assistants, social previews) read the post
    // the moment it is published.
    path: 'blog/:slug',
    renderMode: RenderMode.Client,
  },
  {
    // News items, announcements and circulars - published from the dashboard at any time, so none
    // is baked into the build; the browser loads each one.
    path: 'more/news/:id',
    renderMode: RenderMode.Client,
  },
  {
    // Legacy redirect route (/home/blog/:slug -> /blog/:slug). It carries a param,
    // so it must not fall through to the prerender rule (which needs
    // getPrerenderParams); Client mode redirects in the browser instead.
    path: 'home/blog/:slug',
    renderMode: RenderMode.Client,
  },
  {
    // Dyuno share links are created after the build, so there is nothing to prerender;
    // shared chats are noindex anyway.
    path: 'dyuno/share/:id',
    renderMode: RenderMode.Client,
  },
  {
    // The office-bearers' pages: a fixed pair, so both are prerendered.
    path: 'management/:role',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LEADERS.map((l) => ({ role: l.role })),
  },
  {
    // Each project's page: the list is fixed in shared/projects.ts, so all are prerendered.
    path: 'project/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((p) => ({ slug: p.slug })),
  },
  {
    // Each social activity's page: also a fixed list (shared/social-activities.ts).
    path: 'social-activity/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ACTIVITY_PAGES.map((a) => ({ slug: a.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
