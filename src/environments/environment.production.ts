// ─────────────────────────────────────────────────────────────────
// environment.production.ts  →  PRODUCTION  (ng build)
// Backend : https://api.cesociety.in
// Frontend: https://cesociety.in
//
// NOTE: the API was supplied as http://api.cesociety.in. It is set to https
// here on purpose — the site is served over HTTPS, and browsers block an
// HTTPS page calling an HTTP endpoint as mixed active content. That failure
// is invisible at build time (prerendering runs under Node, which does not
// enforce it) but kills every runtime fetch, including the live SEO payload
// that app.config.ts deliberately excludes from the transfer cache.
// api.cesociety.in needs a TLS certificate before this deploys.
// ─────────────────────────────────────────────────────────────────
export const environment = {
  production: true,
  envName: 'production',
  apiUrl: 'https://api.cesociety.in',
  frontendUrl: 'https://cesociety.in',
};
