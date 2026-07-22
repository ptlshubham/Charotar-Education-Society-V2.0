import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private router: Router,
    private http: HttpClient
  ) { }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
      const isHealthCheck = request.url.includes('/api/health');
      const isErrorPage = window.location.pathname.includes('/server-error');
      // Only treat status 0 as "backend down" for actual backend requests.
      // External API calls (restcountries, geolocation, etc.) can fail due to CORS
      // or network without implying the backend is unreachable.
      const isBackendRequest = !request.url.startsWith('http') ||
        request.url.includes(ApiService.HOST_URL);

      if (err.status === 0 && isBackendRequest && !isHealthCheck && !isErrorPage) {
        window.location.href = '/server-error';
        return EMPTY;
      }

      if (err.status === 500 && !isHealthCheck && !isErrorPage) {
        // return this.http.get(ApiService.HealthCheckURL).pipe(
        //   catchError((healthErr: HttpErrorResponse) => {
        //     if (healthErr.status === 500 || healthErr.status === 0) {
        //       window.location.href = '/server-error';
        //       return EMPTY;
        //     }
        //     return throwError(() => err);
        //   }),
        //   switchMap(() => throwError(() => err))
        // );
      }
      if ([401, 403].includes(err.status)) {
        // auto logout if 401 or 403 response returned from api
        // CRITICAL: Skip auto-logout for Super Admin to prevent session conflicts 
        // with "zombie" tabs from other user types (e.g. Agency).
        const userType = localStorage.getItem('user_type');
        const isSuperAdmin = userType === 'super-admin' || userType === 'platform-admin';

        const isAuthRequest = request.url.includes('/login') ||
          request.url.includes('/auth/') ||
          request.url.includes('verify-otp') ||
          request.url.includes('verify-employee-otp') ||
          request.url.includes('employee/verify') ||
          request.url.includes('/otp/');

        // Background fire-and-forget calls (status beacon, activity telemetry) â€” 401s
        // from these do not indicate an invalid session, so skip auto-logout for them.
        const isBackgroundCall = request.url.includes('/system-status/changeMyStatus') ||
          request.url.includes('/system-status/getMyStatus') ||
          request.url.includes('/activity-logger/addActivityEvents');

        // Cloud storage integration calls â€” 401 means the cloud token expired,
        // not the user's session. The component handles reconnect UI itself.
        const isCloudStorageCall = request.url.includes('/integrations/drive/') ||
          request.url.includes('/integrations/dropbox/');

        // Influencers don't use agency endpoints â€” a 401/403 from those endpoints
        // is expected noise, not a session expiry, so skip auto-logout for them.
        const isInfluencer = userType === 'influencer';

        // Public API endpoints that do not require authentication â€” never trigger auto-logout.
        const isPublicApiCall = request.url.includes('/agreements/public/') ||
          request.url.includes('/agreements/sign/') ||
          request.url.includes('/public-invoice/') ||
          request.url.includes('/public-quote/') ||
          request.url.includes('/public-credit-note/') ||
          request.url.includes('/public-purchase-order/') ||
          request.url.includes('/quotations/public/');

        ;

        const isCurrentlyOnAuthPage = window.location.pathname.includes('/auth/');

        // Also skip auto-logout when the user is currently viewing a public-facing page.
        const isCurrentlyOnPublicPage = window.location.pathname.includes('/agreement/sign/') ||
          window.location.pathname.includes('/public-invoice/') ||
          window.location.pathname.includes('/public-quote/') ||
          window.location.pathname.includes('/public-credit-note/') ||
          window.location.pathname.includes('/public-purchase-order/') ||
          window.location.pathname.includes('/quotation/view/');;

        if (!isSuperAdmin && !isInfluencer && !request.url.includes('/logout') && !this.authService.isSwitchingProfile && !isAuthRequest && !isCurrentlyOnAuthPage && !isBackgroundCall && !isPublicApiCall && !isCurrentlyOnPublicPage && !isCloudStorageCall) {
          console.warn(`[ErrorInterceptor] ðŸ›‘ Auto-logout triggered by ${err.status} error from URL: ${request.url}`);
          this.authService.logout(`session_error_${err.status}`);
        }
      }

      // For blob requests (e.g. PDF downloads) and cloud storage calls, pass the full
      // HttpErrorResponse through so the component can inspect status codes and body.
      if (request.responseType === 'blob' || request.url.includes('/integrations/drive/') || request.url.includes('/integrations/dropbox/')) {
        return throwError(() => err);
      }

      const error = err.error?.message || err.statusText;
      return throwError(() => error);
    }))
  }
}

