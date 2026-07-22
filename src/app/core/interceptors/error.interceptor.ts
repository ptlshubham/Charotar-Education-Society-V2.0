import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {
      switch (err.status) {
        case 0:
          router.navigate(['/error/error500']);
          break;

        case 401:
          auth.clearSession();
          router.navigate(['/login']);
          break;

        case 403:
          console.warn(`[errorInterceptor] 403 from ${req.url}`);
          break;

        case 500:
          router.navigate(['/error/error500']);
          break;
      }

      return throwError(() => err);
    })
  );
};
