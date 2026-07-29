import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { NavratriEntry, NavratriImage } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Tab = 'overview' | 'gallery' | 'events' | 'news' | 'sponsors';

@Component({
  selector: 'app-navratri-detail',
  imports: [RouterLink, MediaUrlPipe, SafeHtmlPipe],
  templateUrl: './navratri-detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri-detail.scss',
})
export class NavratriDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly resources = inject(ResourcesService);

  /** Year comes from the URL so /navratri/2024 works without a new component. */
  readonly year = this.route.snapshot.paramMap.get('year') ?? '';
  readonly banner = PLACEHOLDER.media.navratriBanner;

  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly entry = signal<NavratriEntry | null>(null);
  readonly images = signal<readonly NavratriImage[]>([]);

  readonly tabs: ReadonlyArray<{ id: Tab; label: string; path: string[] }> = [
    { id: 'overview', label: 'Overview', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8 9h8M8 13h5'] },
    { id: 'gallery', label: 'Gallery', path: ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'm21 15-5-5L5 21'] },
    { id: 'events', label: 'Events', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { id: 'news', label: 'News', path: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'] },
    { id: 'sponsors', label: 'Sponsors', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
  ];

  readonly active = signal<Tab>('overview');

  select(id: Tab): void {
    this.active.set(id);
  }

  /** Generic event facts (the DB has only the theme write-up). */
  readonly highlights: ReadonlyArray<{ label: string; value: string; path: string[] }> = [
    { label: 'Venue', value: 'CES Campus, Anand', path: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'] },
    { label: 'Devotees', value: '100K+ Devotees', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { label: 'Garba Nights', value: '9 Nights of Devotion & Dance', path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'] },
    { label: 'Cultural Programs', value: '50+ Performances', path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z'] },
    { label: 'Volunteers', value: '500+ Volunteers', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { label: 'Security & Safety', value: '100% Safe & Secure', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
  ];

  constructor() {
    this.resources
      .getNavratriList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<NavratriEntry[]>([]);
        }),
        map((list) => (Array.isArray(list) ? list : []).find((e) => String(e.year) === String(this.year)) ?? null),
        tap((found) => {
          this.entry.set(found);
          this.loading.set(false);
        }),
        switchMap((found) =>
          found
            ? this.resources.getNavratriImages(found.id).pipe(catchError(() => of<NavratriImage[]>([])))
            : of<NavratriImage[]>([]),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((imgs) => this.images.set(Array.isArray(imgs) ? imgs : []));
  }

  /** Best available URL field on a gallery image. */
  imgSrc(img: NavratriImage): string {
    return img.thumb ?? img.image ?? img.original ?? img.path ?? '';
  }
}
