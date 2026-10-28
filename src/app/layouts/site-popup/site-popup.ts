import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
import { InstituteService } from '../../core/services/institute.service';
import { LenisService } from '../../core/services/lenis.service';
import { ConnectionService } from '../../core/services/connection.service';
import { SitePopup as SitePopupData } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

/** The popup as shown: one picture, already loaded, chosen for this screen. */
interface ShownPopup {
  image: string | null;
  imageAlt: string;
  title: string | null;
  message: string | null;
  buttonLabel: string;
  /** A page on this site (routed in the app) or another website (new tab); neither = no button. */
  link?: string;
  href?: string;
}

/** Holds `<institute>:<version>` of the popup this visitor closed - per tab, cleared when it closes. */
const CLOSED_KEY = 'ces_popup_closed';
/** Phones get the phone picture - the site's md breakpoint. */
const PHONE = '(max-width: 767px)';
/** A picture slower than this opens with the popup anyway, rather than holding it back. */
const IMAGE_WAIT_MS = 6000;

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

/**
 * The announcement popup from Website Management → Website Popup. It opens once per visit, a few
 * seconds (set in the dashboard) after the visitor lands - and after they have answered the cookie
 * notice, so the two never stack. Closing it (×, the backdrop, Esc or its button) keeps it closed
 * for the rest of the visit, unless the popup is changed in the meantime.
 *
 * Phones (< 768px) get the phone picture, everything wider the desktop one; each falls back to the
 * other. Browser only - the server renders nothing.
 */
@Component({
  selector: 'app-site-popup',
  imports: [NgTemplateOutlet],
  templateUrl: './site-popup.html',
  styleUrl: './site-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class SitePopup {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly router = inject(Router);
  private readonly lenis = inject(LenisService);
  private readonly connection = inject(ConnectionService);
  private readonly injector = inject(Injector);

  readonly popup = signal<ShownPopup | null>(null);
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  private closedValue = '';
  private returnFocus: HTMLElement | null = null;
  private destroyed = false;

  constructor() {
    afterNextRender(() => void this.run());
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      if (this.popup()) this.lenis.start();
    });
  }

  private async run(): Promise<void> {
    let instituteId: number;
    let data: SitePopupData | null;
    try {
      instituteId = await firstValueFrom(this.institute.resolve());
      data = await firstValueFrom(this.resources.getSitePopup(instituteId).pipe(timeout(8000)));
    } catch {
      return;
    }
    if (!data) return;
    const closed = `${instituteId}:${data.version}`;
    if (read(CLOSED_KEY) === closed) return;

    // The delay counts from when the visitor can see the page - not behind the page loader.
    await this.loaderGone();
    await this.cookieNoticeAnswered();
    await sleep(Math.max(0, data.delaySeconds) * 1000);
    await this.loaderGone();
    // Not over an error page or the No Internet screen.
    if (this.destroyed || this.router.url.startsWith('/error') || this.connection.offline()) return;

    const shown = await this.prepare(data);
    if (!shown || this.destroyed) return;
    this.closedValue = closed;
    this.returnFocus = document.activeElement as HTMLElement | null;
    this.popup.set(shown);
    this.lenis.stop();
    afterNextRender(() => this.closeButton()?.nativeElement.focus(), { injector: this.injector });
  }

  /** Resolves once the Dyuno page loader (index.html, #ces-loader) is down - first screen or a page change. */
  private loaderGone(): Promise<void> {
    const loader = document.getElementById('ces-loader');
    if (!loader || loader.hidden) return Promise.resolve();
    return new Promise((done) => {
      const watch = new MutationObserver(() => {
        if (!loader.hidden) return;
        watch.disconnect();
        done();
      });
      watch.observe(loader, { attributes: true, attributeFilter: ['hidden'] });
    });
  }

  /** Resolves once the cookie notice is answered - straight away if it was on an earlier visit. */
  private cookieNoticeAnswered(): Promise<void> {
    try {
      if (localStorage.getItem('cookie_consent')) return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
    return new Promise((done) => window.addEventListener('ces:cookie-consent', () => done(), { once: true }));
  }

  /** Picks and loads this screen's picture; null when there is nothing left to show. */
  private async prepare(p: SitePopupData): Promise<ShownPopup | null> {
    const phone = window.matchMedia(PHONE).matches;
    const path = phone ? p.mobileImage || p.image : p.image || p.mobileImage;
    let image = path ? mediaUrl(path) : null;
    if (image && !(await loads(image))) image = null;
    if (!image && !p.title && !p.message) return null;
    return {
      image,
      imageAlt: p.imageAlt || p.title || 'Announcement',
      title: p.title,
      message: p.message,
      buttonLabel: p.buttonLabel || 'Learn More',
      ...target(p.buttonLink),
    };
  }

  /** The button or picture: closes the popup, then goes there (a page here is opened in the app). */
  follow(e: MouseEvent, link?: string): void {
    if (link && !(e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0)) {
      e.preventDefault();
      this.close();
      this.router.navigateByUrl(link);
      return;
    }
    this.close();
  }

  close(): void {
    if (!this.popup()) return;
    write(CLOSED_KEY, this.closedValue);
    this.popup.set(null);
    this.lenis.start();
    this.returnFocus?.focus?.({ preventScroll: true });
  }

  /** Esc closes; Tab stays inside the popup while it is open. */
  onKeydown(e: KeyboardEvent): void {
    if (!this.popup()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = Array.from(
      this.dialog()?.nativeElement.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"]), button:not([disabled])') ?? [],
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!this.dialog()?.nativeElement.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* storage blocked - it may show again on the next page load */
  }
}

/** Prefix a stored media path with the API host (mirrors MediaUrlPipe). */
function mediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** true once the picture has loaded (or is still coming after IMAGE_WAIT_MS); false if it fails. */
function loads(url: string): Promise<boolean> {
  return new Promise((done) => {
    const img = new Image();
    const timer = setTimeout(() => done(true), IMAGE_WAIT_MS);
    img.onload = () => {
      clearTimeout(timer);
      done(true);
    };
    img.onerror = () => {
      clearTimeout(timer);
      done(false);
    };
    img.src = url;
  });
}

/**
 * Where the button goes: a path ("/admission"), or a full address on this same site, is routed in
 * the app; another website opens in a new tab. Anything else is dropped (the API refuses it too).
 */
function target(raw: string | null): Pick<ShownPopup, 'link' | 'href'> {
  const v = (raw ?? '').trim();
  if (!v) return {};
  if (/^\/(?!\/)/.test(v)) return { link: v };
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return {};
    if (u.host === window.location.host) return { link: u.pathname + u.search + u.hash };
    return { href: u.href };
  } catch {
    return {};
  }
}
