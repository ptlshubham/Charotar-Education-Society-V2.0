// ─────────────────────────────────────────────────────────────────
// environment.staging.ts  →  STAGING  (ng build --configuration=staging)
// Backend : https://staging.zarklyx.com
// Frontend: https://stage.zarklyx.com
// ─────────────────────────────────────────────────────────────────
export const environment = {
  production: false,
  envName: 'staging',
  apiUrl: 'https://staging.zarklyx.com',
  frontendUrl: 'https://stage.zarklyx.com',
};
