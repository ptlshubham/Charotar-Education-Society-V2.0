import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { ApiService } from './api.service';

/** Per-page meta overrides, as managed in super admin. Any field may be blank. */
export interface SeoPage {
  pageKey: string;
  path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  robots: string | null;
}

/** Sitewide fallbacks applied whenever a page leaves a field blank. */
export interface SeoDefaults {
  titleTemplate: string | null;
  defaultTitle: string | null;
  defaultDescription: string | null;
  defaultKeywords: string | null;
  defaultOgImage: string | null;
  siteName: string | null;
  twitterHandle: string | null;
  defaultRobots: string | null;
  siteUrl: string | null;
}

interface SeoPayload {
  pages: SeoPage[];
  defaults: SeoDefaults;
}

/** Values a detail page derives from its own record (blog post, news article). */
export interface SeoOverride {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  image?: string | null;
  /** Absolute URL of this page; falls back to siteUrl + current path. */
  url?: string | null;
}

const EMPTY_DEFAULTS: SeoDefaults = {
  titleTemplate: null,
  defaultTitle: null,
  defaultDescription: null,
  defaultKeywords: null,
  defaultOgImage: null,
  siteName: null,
  twitterHandle: null,
  defaultRobots: null,
  siteUrl: null,
};

/** Treats empty/whitespace strings as absent so fallbacks take over. */
const firstNonEmpty = (...values: (string | null | undefined)[]): string | null => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return null;
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private http = inject(HttpClient);
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  /**
   * Fetched once per app instance. Under SSR the router awaits this before
   * serialising, and provideClientHydration's transfer cache replays the same
   * payload on the client, so hydration doesn't refetch it.
   */
  private payload$?: Observable<SeoPayload>;

  private load(): Observable<SeoPayload> {
    this.payload$ ??= this.http.get<{ success: boolean; data: SeoPayload }>(ApiService.GetPublicSeoURL).pipe(
      map(res => res?.data ?? { pages: [], defaults: EMPTY_DEFAULTS }),
      // SEO data must never break page rendering  fall back to index.html's tags.
      catchError(() => of({ pages: [], defaults: EMPTY_DEFAULTS })),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.payload$;
  }

  /**
   * Applies the meta tags for a registered static page. Returns an observable
   * the router resolver can wait on so tags are set before SSR serialises.
   */
  apply(pageKey: string): Observable<boolean> {
    return this.load().pipe(
      tap(({ pages, defaults }) => {
        const page = pages.find(p => p.pageKey === pageKey);
        this.render(page ?? null, defaults, null);
      }),
      map(() => true),
      catchError(() => of(true)),
    );
  }

  /**
   * Applies meta for a dynamic detail page (blog post, news article) whose
   * values come from the fetched record rather than the page registry.
   */
  applyCustom(override: SeoOverride, pageKey?: string): void {
    this.load().subscribe(({ pages, defaults }) => {
      const page = pageKey ? pages.find(p => p.pageKey === pageKey) ?? null : null;
      this.render(page, defaults, override);
    });
  }

  private render(page: SeoPage | null, defaults: SeoDefaults, override: SeoOverride | null): void {
    // Precedence: the page's own record > admin page entry > sitewide default.
    const rawTitle = firstNonEmpty(override?.title, page?.title);
    const title = rawTitle
      ? this.applyTemplate(rawTitle, defaults.titleTemplate)
      : firstNonEmpty(defaults.defaultTitle);
    if (title) this.title.setTitle(title);

    const description = firstNonEmpty(override?.description, page?.description, defaults.defaultDescription);
    const keywords = firstNonEmpty(override?.keywords, page?.keywords, defaults.defaultKeywords);
    const robots = firstNonEmpty(page?.robots, defaults.defaultRobots);
    const image = firstNonEmpty(override?.image, page?.ogImage, defaults.defaultOgImage);

    this.setName('description', description);
    this.setName('keywords', keywords);
    this.setName('robots', robots);

    // Open Graph  og:title tracks the resolved <title> unless overridden.
    this.setProperty('og:title', firstNonEmpty(page?.ogTitle, title));
    this.setProperty('og:description', firstNonEmpty(page?.ogDescription, description));
    this.setProperty('og:image', image);
    this.setProperty('og:site_name', firstNonEmpty(defaults.siteName));

    // An explicit canonical on the admin entry wins outright; otherwise resolve
    // the page/override path against the configured site URL.
    const url =
      firstNonEmpty(page?.canonicalUrl) ??
      this.buildUrl(defaults.siteUrl, firstNonEmpty(override?.url, page?.path));
    this.setProperty('og:url', url);

    // Twitter
    this.setName('twitter:title', firstNonEmpty(page?.twitterTitle, title));
    this.setName('twitter:description', firstNonEmpty(page?.twitterDescription, description));
    this.setName('twitter:image', firstNonEmpty(page?.twitterImage, image));
    this.setName('twitter:site', firstNonEmpty(defaults.twitterHandle));
    this.setName('twitter:creator', firstNonEmpty(defaults.twitterHandle));

    this.setCanonical(url);
  }

  /** "%s | ZarklyX" + "Pricing" → "Pricing | ZarklyX". */
  private applyTemplate(value: string, template: string | null): string {
    if (!template || !template.includes('%s')) return value;
    return template.replace('%s', value);
  }

  /** Resolves a path against the configured site URL. Absolute paths pass through. */
  private buildUrl(siteUrl: string | null, path: string | null | undefined): string | null {
    const target = firstNonEmpty(path);
    if (target && /^https?:\/\//i.test(target)) return target;

    const base = firstNonEmpty(siteUrl);
    if (!base) return null;

    const currentPath = target ?? this.document.location?.pathname ?? '';
    const resolved = `${base.replace(/\/+$/, '')}/${currentPath.replace(/^\/+/, '')}`;
    // Trailing slash only ever appears for the site root, where base alone is right.
    return resolved.replace(/\/$/, '') || base.replace(/\/+$/, '');
  }

  /** Blank values remove the tag rather than emitting an empty one. */
  private setName(name: string, content: string | null): void {
    if (content) this.meta.updateTag({ name, content });
    else this.meta.removeTag(`name='${name}'`);
  }

  private setProperty(property: string, content: string | null): void {
    if (content) this.meta.updateTag({ property, content });
    else this.meta.removeTag(`property='${property}'`);
  }

  private setCanonical(url: string | null): void {
    const head = this.document.head;
    if (!head) return;
    let link = head.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
