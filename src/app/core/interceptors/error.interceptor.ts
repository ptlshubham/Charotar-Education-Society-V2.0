import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  // Never redirect during SSR/prerender. The build runs with no backend
  // reachable, so the SEO metadata fetch fails with status 0 on every route; if
  // that redirected, `ng build` would silently emit an /error/error500 stub in
  // place of all ~50 prerendered pages. Metadata is decorative — the page must
  // still render. In the browser the behaviour is unchanged.
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  return next(req).pipe(
    catchError(err => {
      switch (err.status) {
        case 0:
          if (isBrowser) router.navigate(['/error/error500']);
          break;

        case 401:
          auth.clearSession();
          router.navigate(['/login']);
          break;

        case 403:
          console.warn(`[errorInterceptor] 403 from ${req.url}`);
          break;

        case 500:
          if (isBrowser) router.navigate(['/error/error500']);
          break;
      }

      return throwError(() => err);
    })
  );
};
