import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { SeoOverride, SeoService } from '../services/seo.service';

/**
 * Applies a route's meta tags before it activates, so SSR serialises them into
 * the HTML crawlers receive. Attach to any route carrying `data.seoKey`:
 *
 *   { path: 'pricing', data: { seoKey: 'pricing' }, resolve: { seo: seoResolver }, ... }
 *
 * The key must match a page entry's `pageKey` in super admin → SEO Management.
 * Routes without a `seoKey`  and keys with no admin entry  fall back to the
 * sitewide defaults, so a missing entry is never fatal. A route's `data.seoFallback`
 * (its built-in title/description) fills whatever the admin entry leaves blank.
 */
export const seoResolver: ResolveFn<boolean> = (route) => {
  const seoKey = route.data?.['seoKey'] as string | undefined;
  if (!seoKey) return of(true);
  return inject(SeoService).apply(seoKey, route.data?.['seoFallback'] as SeoOverride | undefined);
};
