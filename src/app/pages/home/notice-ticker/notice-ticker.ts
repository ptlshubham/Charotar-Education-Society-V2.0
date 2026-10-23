import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { SiteNotification } from '../../../shared/models/models';

/** One item in the ticker - a notice's text, and where it leads when it's a link. */
interface Notice {
  text: string;
  /** An in-site path (routed in the app) or an external URL (new tab). Plain text has none. */
  href?: string;
  external?: boolean;
}

/** Reading pace - the loop time follows the text length so the speed stays even. */
const PX_PER_SECOND = 60;
const DAY_MS = 24 * 60 * 60 * 1000;
/** The old site's domain - its links (cesociety.in/#/more/career) open the same page here. */
const OWN_HOST = /^(www\.)?cesociety\.in$/i;
/** Text between the links that's only spacing or separators (the admins space links with •). */
const SEPARATOR_ONLY = /^[\s•·|\-–—,;:.]*$/;
/** A notice's text breaks into separate items at these, so two paragraphs don't run together. */
const BLOCK = 'p, div, li, h1, h2, h3, h4, h5, h6, td';

/**
 * Notice strip under the hero - the live notices from Website Management (Notification),
 * scrolling right to left. Shown only while at least one is switched on and inside its
 * start/end dates; otherwise nothing renders. Each link in a notice is its own item.
 * Hover, focus or the pause button stops it; reduced-motion visitors get a still row.
 *
 * Browser-only: notices are date-bound, so the prerendered page never carries stale ones.
 */
@Component({
  selector: 'app-notice-ticker',
  templateUrl: './notice-ticker.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notice-ticker.scss',
})
export class NoticeTicker {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly notices = signal<readonly Notice[]>([]);
  readonly paused = signal(false);
  /** Seconds for one loop (one copy's width), measured once the notices render. */
  readonly duration = signal(30);
  /** Both copies of the list - the track scrolls by one, so the loop has no seam. */
  readonly copies = [0, 1] as const;

  private readonly firstCopy = viewChild<ElementRef<HTMLElement>>('copy');

  constructor() {
    afterNextRender(() => this.load());

    effect((onCleanup) => {
      const el = this.firstCopy()?.nativeElement;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => this.duration.set(Math.max(12, el.offsetWidth / PX_PER_SECOND)));
      ro.observe(el);
      onCleanup(() => ro.disconnect());
    });
  }

  /** In-site links route without a reload; modified clicks (new tab/window) are left to the browser. */
  open(e: MouseEvent, n: Notice): void {
    if (!n.href || n.external || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this.router.navigateByUrl(n.href);
  }

  private load(): void {
    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getNotifications(id)),
        timeout(8000),
        catchError(() => of<SiteNotification[]>([])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((rows) => {
        const now = Date.now();
        this.notices.set(
          (rows ?? []).filter((n) => Number(n.isactive) === 1 && this.isLive(n, now)).flatMap((n) => this.parse(n.message ?? '')),
        );
      });
  }

  /** On from the start date through the whole of the end date; a missing date leaves that side open. */
  private isLive(n: SiteNotification, now: number): boolean {
    const start = n.startDate ? Date.parse(n.startDate) : -Infinity;
    const end = n.endDate ? Date.parse(n.endDate) + DAY_MS : Infinity;
    return now >= start && now < end;
  }

  /**
   * A notice's rich text → ticker items, in order: each link is one, and so is each run of
   * plain text (bar the spacing and bullets between links). Only text and a vetted href are
   * kept - the HTML itself is never rendered.
   */
  private parse(html: string): Notice[] {
    const body = new DOMParser().parseFromString(html, 'text/html').body;

    // Consecutive text under the same link (or, outside links, the same paragraph) is one run.
    const runs: { key: Element | null; text: string }[] = [];
    const walker = body.ownerDocument.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const key = node.parentElement?.closest('a') ?? node.parentElement?.closest(BLOCK) ?? null;
      const last = runs.at(-1);
      if (last && last.key === key) last.text += node.textContent ?? '';
      else runs.push({ key, text: node.textContent ?? '' });
    }

    return runs.flatMap(({ key, text }) => {
      const clean = text.replace(/\s+/g, ' ').trim();
      if (!clean || SEPARATOR_ONLY.test(clean)) return [];
      return [{ text: clean, ...(key instanceof HTMLAnchorElement ? this.target(key.getAttribute('href')) : {}) }];
    });
  }

  /** Links to this site (old hash-routed ones too) stay in-site; other http(s) links open in a new tab. */
  private target(href: string | null): Pick<Notice, 'href' | 'external'> {
    if (!href) return {};
    let url: URL;
    try {
      url = new URL(href, location.origin);
    } catch {
      return {};
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return {}; // no javascript:/data: links
    if (url.origin === location.origin || OWN_HOST.test(url.hostname)) {
      const path = url.hash.startsWith('#/') ? url.hash.slice(1) : url.pathname + url.search + url.hash;
      return { href: path || '/' };
    }
    return { href: url.href, external: true };
  }
}
