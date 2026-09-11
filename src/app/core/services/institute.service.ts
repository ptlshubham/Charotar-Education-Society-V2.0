import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap, timeout } from 'rxjs';
import { ApiService } from './api.service';
import { SKIP_ERROR_REDIRECT } from '../interceptors/error.interceptor';

/** Institute lookup response row (only the fields we consume). */
interface InstituteDetail {
  id: number;
  name?: string;
  url?: string;
}

/**
 * Resolves which institute this site is. The backend maps a public URL to an
 * institute record, exactly as the legacy site did on boot
 * (app.component → getInstituteDetailsById → localStorage 'InstituteId').
 *
 * Every data call that used to hardcode `institute_id = 1` should read
 * {@link instituteId} / {@link resolve} instead, so the id is driven by the
 * backend rather than baked into the code.
 */
@Injectable({ providedIn: 'root' })
export class InstituteService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  /** CES society — used for SSR/prerender and as a fallback until the lookup resolves. */
  private static readonly DEFAULT_ID = 1;
  /** Domain the backend maps to this institute (kept static, like the legacy site). */
  private static readonly SITE_URL = 'www.cesociety.in';
  private static readonly STORAGE_KEY = 'InstituteId';

  /** The resolved institute id. Starts at the default and updates once resolved. */
  readonly instituteId = signal<number>(InstituteService.DEFAULT_ID);

  /** Memoised in-flight/complete resolution so the lookup runs at most once. */
  private resolved$?: Observable<number>;

  /**
   * Resolve the institute id once. On the server (SSR/prerender) this is a no-op
   * that yields the default. In the browser it uses the cached id when present,
   * otherwise looks it up by URL and caches it. Safe to call from many places.
   */
  resolve(): Observable<number> {
    if (this.resolved$) return this.resolved$;

    if (!isPlatformBrowser(this.platformId)) {
      return of(InstituteService.DEFAULT_ID);
    }

    const cached = Number(localStorage.getItem(InstituteService.STORAGE_KEY));
    if (Number.isFinite(cached) && cached > 0) {
      this.instituteId.set(cached);
      return (this.resolved$ = of(cached));
    }

    this.resolved$ = this.http
      .get<InstituteDetail[]>(ApiService.GetInstituteDetailByUrlURL + InstituteService.SITE_URL, {
        context: new HttpContext().set(SKIP_ERROR_REDIRECT, true),
      })
      .pipe(
        timeout(8000),
        map((rows) => Number(rows?.[0]?.id) || InstituteService.DEFAULT_ID),
        tap((id) => {
          this.instituteId.set(id);
          try {
            localStorage.setItem(InstituteService.STORAGE_KEY, String(id));
          } catch {
            /* storage may be unavailable (private mode) — the in-memory signal still holds it */
          }
        }),
        catchError(() => of(InstituteService.DEFAULT_ID)),
        shareReplay(1),
      );
    return this.resolved$;
  }
}
