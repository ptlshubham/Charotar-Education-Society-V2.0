import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withNoIncrementalHydration
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { ApiService } from './core/services/api.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        // Static pages are prerendered at build time, which would freeze the SEO
        // payload into the transfer cache. Excluding it makes the browser refetch,
        // so admin edits reach real visitors without waiting for a redeploy.
        filter: (req) => !req.url.startsWith(ApiService.GetPublicSeoURL),
      }), withNoIncrementalHydration()
    ),
    provideAnimations(),
    // withFetch is required for SSR: the default XHR shim never settles under
    // Node, which stalls server-side requests and blocks app stabilisation.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
