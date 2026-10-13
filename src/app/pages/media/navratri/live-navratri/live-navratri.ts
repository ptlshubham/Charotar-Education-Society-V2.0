import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../../core/services/resources.service';
import { NavratriLiveLink } from '../../../../shared/models/models';
import { SOCIAL_LINKS } from '../../../../shared/social-links';

/**
 * "Live now" block on the Navratri page, ported from the legacy site's
 * live-navratri section. It renders only while super admin has a live link
 * active, and stays empty otherwise.
 *
 * Fetched in the browser only: /navratri is prerendered, so a build-time fetch
 * would bake in whichever link happened to be active at deploy.
 */
@Component({
  selector: 'app-live-navratri',
  templateUrl: './live-navratri.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './live-navratri.scss',
})
export class LiveNavratri {
  private readonly sanitizer = inject(DomSanitizer);

  readonly img = '/assets/images/navratri-live';

  readonly live = signal<NavratriLiveLink | null>(null);

  /** Built once per link - a fresh SafeResourceUrl on every check would reload the iframe. */
  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = videoId(this.live()?.link ?? '');
    return id ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`) : null;
  });

  readonly socials = SOCIAL_LINKS.filter((s) => s.label === 'Instagram' || s.label === 'Facebook');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    inject(ResourcesService)
      .getNavratriLiveLinks()
      .pipe(
        catchError(() => of<NavratriLiveLink[]>([])),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const active = (Array.isArray(list) ? list : [])
          .filter((l) => isActive(l.isactive))
          // Latest year, then latest day - in case more than one is left active.
          .sort((a, b) => Number(b.year) - Number(a.year) || Number(b.day) - Number(a.day));
        this.live.set(active[0] ?? null);
      });
  }
}

/** The backend sends the active flag as 0/1. */
function isActive(value: unknown): boolean {
  return value === true || value === 1 || String(value).toLowerCase() === 'true';
}

/** Extract the YouTube video id from the URL shapes super admin pastes in. */
function videoId(link: string): string {
  if (link.includes('youtube.com/watch?v=')) return link.split('v=')[1].split('&')[0];
  if (link.includes('youtu.be/')) return link.split('.be/')[1].split('?')[0];
  if (link.includes('youtube.com/live/')) return link.split('/live/')[1].split('?')[0];
  if (link.includes('youtube.com/embed/')) return link.split('/embed/')[1].split(/[?&]/)[0];
  return '';
}
