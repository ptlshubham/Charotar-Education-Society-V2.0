import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { NavratriEntry } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { LiveNavratri } from './live-navratri/live-navratri';

@Component({
  selector: 'app-navratri',
  imports: [RouterLink, MediaUrlPipe, PageHero, LiveNavratri],
  templateUrl: './navratri.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri.scss',
})
export class Navratri {
  private readonly resources = inject(ResourcesService);

  readonly banner = '/assets/images/hero/navratri.jpeg';

  // ─── Real Navratri celebrations from the DB ───
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly celebrations = signal<readonly NavratriEntry[]>([]);

  constructor() {
    this.resources
      .getNavratriList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<NavratriEntry[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? [...list] : [];
        // Newest year first, like the legacy site.
        rows.sort((a, b) => Number(b.year) - Number(a.year));
        this.celebrations.set(rows);
        this.loading.set(false);
      });
  }

  /** Strips HTML from themedetails for a short card teaser. */
  teaser(html: string, max = 160): string {
    const text = (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  }

  readonly stats: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '100K+', label: 'Devotees Every Year', icon: 'group' },
    { value: '9 Days', label: 'of Celebration', icon: 'calendar_month' },
    { value: '1 Grand Pandal', label: 'CES Campus', icon: 'home' },
    { value: '50+', label: 'Cultural Performances', icon: 'music_note' },
    { value: '500+', label: 'Volunteers', icon: 'favorite' },
    { value: '100%', label: 'Safe & Secure', icon: 'verified_user' },
  ];
}
