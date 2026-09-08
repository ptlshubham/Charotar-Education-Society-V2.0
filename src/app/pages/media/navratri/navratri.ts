import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { NavratriEntry } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Glimpse = 'All' | 'Pandal' | 'Garba' | 'Cultural Programs' | 'Aarti' | 'Devotees';

@Component({
  selector: 'app-navratri',
  imports: [RouterLink, MediaUrlPipe, PageHero],
  templateUrl: './navratri.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri.scss',
})
export class Navratri {
  private readonly resources = inject(ResourcesService);

  readonly banner = PLACEHOLDER.media.navratriBanner;

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

  readonly quickLinks: ReadonlyArray<{ label: string; icon: string }> = [
    { label: 'Navratri 2026 Schedule', icon: 'calendar_today' },
    { label: 'Darshan & Pandal Information', icon: 'home' },
    { label: 'Cultural Programs & Events', icon: 'group' },
    { label: 'Gallery', icon: 'photo_library' },
    { label: 'Seva & Volunteers', icon: 'favorite' },
    { label: 'Important Guidelines', icon: 'info' },
  ];

  readonly stats: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '100K+', label: 'Devotees Every Year', icon: 'group' },
    { value: '9 Days', label: 'of Celebration', icon: 'calendar_today' },
    { value: '1 Grand Pandal', label: 'CES Campus', icon: 'home' },
    { value: '50+', label: 'Cultural Performances', icon: 'music_note' },
    { value: '500+', label: 'Volunteers', icon: 'favorite' },
    { value: '100%', label: 'Safe & Secure', icon: 'verified_user' },
  ];

  readonly filters: readonly Glimpse[] = ['All', 'Pandal', 'Garba', 'Cultural Programs', 'Aarti', 'Devotees'];
  readonly filter = signal<Glimpse>('All');

  select(f: Glimpse): void {
    this.filter.set(f);
  }

  readonly glimpses: ReadonlyArray<{ src: string; tag: Exclude<Glimpse, 'All'> }> =
    PLACEHOLDER.media.navratri.map((src, i) => ({
      src,
      tag: (['Pandal', 'Garba', 'Devotees', 'Aarti', 'Cultural Programs', 'Aarti', 'Garba', 'Devotees'] as const)[i],
    }));

  readonly visible = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.glimpses : this.glimpses.filter((g) => g.tag === f);
  });

  readonly highlights: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Divine Darshan', body: 'Beautifully decorated pandal with daily darshan of Maa Amba.', icon: 'home' },
    { title: 'Daily Aarti', body: 'Soulful aarti every evening with a spiritual and peaceful atmosphere.', icon: 'local_fire_department' },
    { title: 'Garba & Raas', body: 'Traditional Garba & Raas with live orchestra and energetic beats.', icon: 'person' },
    { title: 'Cultural Programs', body: 'Skits, music, dance and competitions by students & invited artists.', icon: 'music_note' },
    { title: 'Prasad & Annadan', body: 'Daily prasad and annadan seva for all devotees.', icon: 'restaurant' },
    { title: 'Security & Safety', body: 'Round the clock security, medical support and dedicated management.', icon: 'verified_user' },
  ];
}
