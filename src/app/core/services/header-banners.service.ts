import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from './resources.service';
import { InstituteService } from './institute.service';
import { GalleryImage } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

/**
 * One header banner. `link` is a page on this site (routed in the app), `href` another website
 * (opens in a new tab); neither when the banner isn't a link.
 */
export interface HeaderAd {
  image: string;
  alt: string;
  link?: string;
  href?: string;
}

/**
 * The institute's header banners - a site-wide notice: its active "Header Banner" images from
 * Website Management → Image Uploader (440×128, optional link), newest first. They show on every
 * page; the link is only where a click goes. Loaded once per visit, in the browser only; empty
 * until they load, if there are none, or if the request fails.
 */
@Injectable({ providedIn: 'root' })
export class HeaderBannersService {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  readonly ads = signal<readonly HeaderAd[]>([]);

  /** Fetch the banners (once; later calls do nothing). Server-side it does nothing at all. */
  load(): void {
    if (!this.browser || this.started) return;
    this.started = true;
    this.institute
      .resolve()
      .pipe(
        switchMap((instituteId) => this.resources.getHeaderBanners(instituteId)),
        timeout(8000),
        catchError(() => of<GalleryImage[]>([])),
      )
      .subscribe((list) =>
        this.ads.set(
          list.map<HeaderAd>((b) => ({
            image: this.mediaUrl(b.image),
            alt: b.title || b.keywords || 'Charotar Education Society',
            ...this.target(b.link),
          })),
        ),
      );
  }

  /**
   * Where a banner's link goes: a path ("/chatkaro"), or a full address on this same site, is routed
   * in the app; another website opens in a new tab. Anything else is dropped (the API refuses it too).
   */
  private target(raw?: string | null): Pick<HeaderAd, 'link' | 'href'> {
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

  /** Prefix a stored media path with the API host (mirrors MediaUrlPipe). */
  private mediaUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
