import { RenderMode, ServerRoute } from '@angular/ssr';

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
    // Blog list + detail are fetched client-side at runtime (by slug). Prerender
    // can't cover them: it only bakes slugs that exist at build time, so a post
    // published afterwards would have no HTML file and 404 on static hosting.
    // Trade-off: articles get no crawler-visible meta  switch to
    // RenderMode.Server once the site runs under Node to fix social previews.
    path: 'blogs',
    renderMode: RenderMode.Client,
  },
  {
    path: 'blogs/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
