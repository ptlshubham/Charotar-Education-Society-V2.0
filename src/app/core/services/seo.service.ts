import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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
  /** 1-3 factual sentences for AI assistants (also written into llms.txt at build). */
  aiSummary?: string | null;
  /** Rendered visibly by PageFaq and as FAQPage JSON-LD - the two must always match. */
  aiFaqs?: SeoFaq[];
  aiBlocked?: boolean;
}

export interface SeoFaq {
  q: string;
  a: string;
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
  /** A blog post's details - published as a schema.org BlogPosting in the page's JSON-LD. */
  article?: SeoArticle;
}

export interface SeoArticle {
  /** ISO date (or date-time) of publication. */
  published: string;
  modified?: string | null;
  /** A person who wrote it; empty means the Society itself. */
  author?: string | null;
  /** The post's category. */
  section?: string | null;
  tags?: readonly string[];
  /** BCP 47 language of the text, e.g. 'gu-IN' for a Gujarati post. Default 'en-IN'. */
  language?: string | null;
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

/**
 * JSON-LD node ids. ORGANIZATION_ID must equal the "@id" of the EducationalOrganization block
 * in src/index.html - it is what ties every page to CES. Fixed rather than built from the
 * admin's Site URL, which may carry "www." while the site canonicalises to the bare host.
 */
const SITE_ID = 'https://cesociety.in/#website';
const ORGANIZATION_ID = 'https://cesociety.in/#organization';

/** The site's address for share images given as a path - same fixed host as the ids above. */
const SITE_ORIGIN = 'https://cesociety.in';

/**
 * Link-preview card for a page with no image of its own and no Default OG image in SEO
 * Management, so a shared link never goes out bare.
 */
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

/**
 * A share image as link previews need it: an absolute URL and, for the site's own photos (WebP,
 * which not every app previews), their JPG card in public/assets/images/og-image/ - a page
 * banner's as og-image/<name>.jpg, any other photo's as og-image/<folder>/<name>.jpg.
 * .htaccess sends a card that doesn't exist (yet) to the photo itself.
 */
const shareImage = (src: string): string => {
  const own = src.match(/^\/?assets\/images\/(?:hero\/)?(.+)\.webp$/i);
  if (own) return `${SITE_ORIGIN}/assets/images/og-image/${own[1]}.jpg`;
  return src.startsWith('/') ? SITE_ORIGIN + src : src;
};

/** Treats empty/whitespace strings as absent so fallbacks take over. */
const firstNonEmpty = (...values: (string | null | undefined)[]): string | null => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return null;
};

/**
 * A static page's admin entry with the page's built-in text filling the title, description and
 * image it leaves blank - or standing in for the whole entry until "Sync Pages" has created it.
 */
function withFallback(page: SeoPage | null, pageKey: string, fallback: SeoOverride): SeoPage {
  const base: SeoPage = page ?? {
    pageKey,
    path: fallback.url ?? '',
    title: null,
    description: null,
    keywords: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    canonicalUrl: null,
    robots: null,
  };
  return {
    ...base,
    title: firstNonEmpty(base.title, fallback.title),
    description: firstNonEmpty(base.description, fallback.description),
    ogImage: firstNonEmpty(base.ogImage, fallback.image),
  };
}

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

  /**
   * The admin-entered FAQs and the pageKey they belong to. PageFaq shows them only while
   * that key is the active route's, so they never linger on a page without an SEO entry.
   */
  readonly pageFaqs = signal<{ pageKey: string | null; faqs: SeoFaq[] }>({ pageKey: null, faqs: [] });

  /** TEMPORARY: set back to true to re-enable the live SEO endpoint. */
  private readonly seoApiEnabled: boolean = true;

  private load(): Observable<SeoPayload> {
    if (!this.seoApiEnabled) {
      // SEO endpoint temporarily disabled - fall back to index.html's static meta.
      this.payload$ ??= of<SeoPayload>({ pages: [], defaults: EMPTY_DEFAULTS }).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      );
      return this.payload$;
    }
    this.payload$ ??= this.http.get<{ success: boolean; data: SeoPayload }>(ApiService.GetPublicSeoURL).pipe(
      map(res => res?.data ?? { pages: [], defaults: EMPTY_DEFAULTS }),
      // SEO data must never break page rendering  fall back to index.html's tags.
      catchError(() => of({ pages: [], defaults: EMPTY_DEFAULTS })),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.payload$;
  }

  /**
   * Applies the meta tags for a registered static page. `fallback` is the page's built-in text,
   * used wherever its admin entry is blank - the admin's own values always win. Returns an
   * observable the router resolver can wait on so tags are set before SSR serialises.
   */
  apply(pageKey: string, fallback?: SeoOverride): Observable<boolean> {
    return this.load().pipe(
      tap(({ pages, defaults }) => {
        const page = pages.find(p => p.pageKey === pageKey) ?? null;
        this.render(fallback ? withFallback(page, pageKey, fallback) : page, defaults, null);
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
    const image = shareImage(firstNonEmpty(override?.image, page?.ogImage, defaults.defaultOgImage) ?? DEFAULT_OG_IMAGE);

    this.setName('description', description);
    this.setName('keywords', keywords);
    this.setName('robots', robots);

    // A detail page with its own URL (a project, a leader, a blog post) borrows its section's
    // admin entry only for the fallbacks above; that entry's canonical and social titles
    // describe the section page, not this one.
    const own = override?.url ? null : page;

    // Open Graph  og:title tracks the resolved <title> unless overridden.
    this.setProperty('og:title', firstNonEmpty(own?.ogTitle, title));
    this.setProperty('og:description', firstNonEmpty(own?.ogDescription, description));
    this.setProperty('og:image', image);
    this.setProperty('og:site_name', firstNonEmpty(defaults.siteName));

    // An explicit canonical on the admin entry wins outright; otherwise resolve
    // the page/override path against the configured site URL.
    const url =
      firstNonEmpty(own?.canonicalUrl) ??
      this.buildUrl(defaults.siteUrl, firstNonEmpty(override?.url, page?.path));
    this.setProperty('og:url', url);

    // Twitter
    this.setName('twitter:title', firstNonEmpty(own?.twitterTitle, title));
    this.setName('twitter:description', firstNonEmpty(own?.twitterDescription, description));
    this.setName('twitter:image', shareImage(firstNonEmpty(own?.twitterImage) ?? image));
    this.setName('twitter:site', firstNonEmpty(defaults.twitterHandle));
    this.setName('twitter:creator', firstNonEmpty(defaults.twitterHandle));

    this.setCanonical(url);

    // FAQs belong to the static page entry; a detail page (override) never inherits them.
    const faqs = override ? [] : (page?.aiFaqs ?? []).filter(f => firstNonEmpty(f?.q) && firstNonEmpty(f?.a));
    this.pageFaqs.set({ pageKey: page?.pageKey ?? null, faqs });

    const article = override?.article ? { ...override.article, headline: rawTitle, image } : null;
    this.setJsonLd(this.pageJsonLd(url, title, firstNonEmpty(own?.aiSummary, description), defaults, faqs, article));
  }

  /**
   * schema.org JSON-LD for this page: a WebPage tied to the site and to the Organization
   * block in index.html (same @id), plus a FAQPage when the page has FAQs and a BlogPosting
   * for a blog post. This is how AI search (Gemini, Copilot, ChatGPT, Perplexity) tells what
   * a page is, who it is about, who wrote it and when.
   */
  private pageJsonLd(
    url: string | null,
    title: string | null,
    description: string | null,
    defaults: SeoDefaults,
    faqs: SeoFaq[],
    article: (SeoArticle & { headline: string | null; image: string | null }) | null = null,
  ): object | null {
    if (!url) return null;
    const siteName = firstNonEmpty(defaults.siteName);
    const language = firstNonEmpty(article?.language) ?? 'en-IN';
    const graph: object[] = [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        ...(title && { name: title }),
        ...(description && { description }),
        inLanguage: language,
        isPartOf: {
          '@type': 'WebSite',
          '@id': SITE_ID,
          url: SITE_ID.replace('#website', ''),
          ...(siteName && { name: siteName }),
        },
        about: { '@id': ORGANIZATION_ID },
      },
    ];
    if (faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    if (article) {
      const tags = (article.tags ?? []).filter(Boolean);
      graph.push({
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        url,
        ...(article.headline && { headline: article.headline.slice(0, 110) }),
        ...(description && { description }),
        ...(article.image && { image: article.image }),
        datePublished: article.published,
        dateModified: firstNonEmpty(article.modified) ?? article.published,
        author: firstNonEmpty(article.author)
          ? { '@type': 'Person', name: firstNonEmpty(article.author) }
          : { '@id': ORGANIZATION_ID },
        publisher: { '@id': ORGANIZATION_ID },
        ...(firstNonEmpty(article.section) && { articleSection: firstNonEmpty(article.section) }),
        ...(tags.length && { keywords: tags.join(', ') }),
        inLanguage: language,
        isPartOf: { '@type': 'Blog', '@id': `${SITE_ID.replace('#website', '')}blog#blog`, name: 'CES Blog' },
      });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }

  /** One page-level JSON-LD script, replaced on every navigation. */
  private setJsonLd(data: object | null): void {
    const head = this.document.head;
    if (!head) return;
    let script = head.querySelector<HTMLScriptElement>('script#seo-page-jsonld');
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-page-jsonld';
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    // Admin-entered text: escape "<" so a "</script>" inside an answer cannot end the tag.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
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
