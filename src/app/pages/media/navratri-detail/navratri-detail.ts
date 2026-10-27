import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { TabBar } from '../../../shared/tab-bar/tab-bar';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { LightboxService } from '../../../core/services/lightbox.service';
import { NavratriEntry, NavratriImage, NavratriPage } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { NAVRATRI_BANNER, NAVRATRI_VENUE, navratriDates } from '../../../shared/navratri';
import { environment } from '../../../../environments/environment';

type Tab = 'overview' | 'events' | 'news' | 'sponsors';

const mediaUrl = new MediaUrlPipe();

const ICON = {
  calendar: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'],
  pin: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  star: ['m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.4l7-.9z'],
  news: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'],
  heart: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
  page: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8 9h8M8 13h5'],
};

/**
 * One year's Navratri: /navratri/<year>. Everything comes from Website Management → Navratri → the
 * year: theme, cover and gallery, its dates and venue, highlights, programme (Events tab), press
 * coverage (News tab), sponsors and brochure. A tab with nothing in it isn't shown.
 */
@Component({
  selector: 'app-navratri-detail',
  imports: [RouterLink, MediaUrlPipe, SafeHtmlPipe, PageHero, TabBar],
  templateUrl: './navratri-detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri-detail.scss',
})
export class NavratriDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly resources = inject(ResourcesService);
  private readonly lightbox = inject(LightboxService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Year comes from the URL so /navratri/2024 works without a new component. */
  readonly year = this.route.snapshot.paramMap.get('year') ?? '';

  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly entry = signal<NavratriEntry | null>(null);
  readonly images = signal<readonly NavratriImage[]>([]);
  /** The Navratri page's settings: its banner, and its "At a Glance" figures as the fallback highlights. */
  private readonly page = signal<NavratriPage | null>(null);

  readonly banner = computed(() => mediaUrl.transform(this.page()?.banner) || NAVRATRI_BANNER);
  readonly dates = computed(() => navratriDates(this.entry()?.startDate, this.entry()?.endDate));
  readonly venue = computed(() => this.entry()?.venue || NAVRATRI_VENUE);
  readonly brochure = computed(() => mediaUrl.transform(this.entry()?.brochure));

  readonly events = computed(() => (this.entry()?.events ?? []).filter((e) => e.title || e.details));
  readonly press = computed(() => (this.entry()?.press ?? []).filter((p) => p.title || p.image || p.link));
  readonly sponsors = computed(() => (this.entry()?.sponsors ?? []).filter((s) => s.name || s.logo));

  /** Overview, then only the tabs that have something in them. */
  readonly tabs = computed(() =>
    [
      { id: 'overview' as Tab, label: 'Overview', path: ICON.page, show: true },
      { id: 'events' as Tab, label: 'Events', path: ICON.calendar, show: this.events().length > 0 },
      { id: 'news' as Tab, label: 'In the News', path: ICON.news, show: this.press().length > 0 },
      { id: 'sponsors' as Tab, label: 'Sponsors', path: ICON.heart, show: this.sponsors().length > 0 },
    ].filter((t) => t.show),
  );

  readonly active = signal<Tab>('overview');

  select(id: Tab): void {
    this.active.set(id);
  }

  /**
   * "Event Highlights": the dates and venue, then the year's own highlights - or, when it has none,
   * the Navratri page's "At a Glance" figures.
   */
  readonly highlights = computed(() => {
    const own = (this.entry()?.highlights ?? []).filter((h) => h.label || h.value);
    // A figure reads as one phrase ("9 Days" + "of Celebration"), so it is shown as one line.
    const facts = own.length
      ? own.map((h) => ({ label: h.label ?? '', value: h.value ?? '' }))
      : (this.page()?.stats ?? [])
          .filter((s) => s.value || s.label)
          .map((s) => ({ label: '', value: [s.value, s.label].filter(Boolean).join(' ') }));
    return [
      ...(this.dates() ? [{ label: 'Duration', value: this.dates(), path: ICON.calendar }] : []),
      { label: 'Venue', value: this.venue(), path: ICON.pin },
      ...facts.map((f) => ({ ...f, path: ICON.star })),
    ];
  });

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

    this.resources
      .getNavratriPage()
      .pipe(catchError(() => of(null)), takeUntilDestroyed())
      .subscribe((p) => this.page.set(p));
  }

  /** "12 Oct 2026" from YYYY-MM-DD. */
  day(value: string | null): string {
    return value ? navratriDates(value, null) : '';
  }

  // ─── Share ───

  readonly copied = signal(false);

  private get pageUrl(): string {
    return this.browser ? location.href : `${environment.frontendUrl}/navratri/${this.year}`;
  }

  shareLinks(): ReadonlyArray<{ label: string; href: string; bg: string; path: string }> {
    const url = encodeURIComponent(this.pageUrl);
    const text = encodeURIComponent(`${this.entry()?.title ?? 'Navratri'} - Navratri ${this.year} at CES`);
    return [
      { label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, bg: 'bg-[#1877F2]',
        path: 'M14 13.5h2.5l1-4H14v-2c0-1 0-2 2-2h1.5V2.1A28 28 0 0 0 14.6 2C11.9 2 10 3.7 10 6.7v2.8H7v4h3V22h4z' },
      { label: 'Share on X', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, bg: 'bg-black',
        path: 'M17.8 3h3.1l-6.7 7.7L22 21h-6.2l-4.8-6.3L5.5 21H2.4l7.2-8.2L2 3h6.3l4.4 5.8z' },
      { label: 'Share on WhatsApp', href: `https://wa.me/?text=${text}%20${url}`, bg: 'bg-[#25D366]',
        path: 'M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.9L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4 11.8 11.8 0 0 0 8.4-20.1z' },
    ];
  }

  copyLink(): void {
    if (!this.browser) return;
    navigator.clipboard?.writeText(location.href).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  // ─── Gallery ───

  /** Best available URL field on a gallery image (thumbnail for the grid). */
  imgSrc(img: NavratriImage): string {
    return img.thumb ?? img.image ?? img.original ?? img.path ?? '';
  }

  /** Full-resolution, resolved URLs for the photo viewer (the grid shows thumbnails). */
  readonly lightboxItems = computed(() =>
    this.images().map((img, i) => ({
      src: this.resolve(img.original ?? img.image ?? img.path ?? img.thumb ?? ''),
      thumb: this.resolve(this.imgSrc(img)),
      caption: `Navratri ${this.year} - Photo ${i + 1}`,
    })),
  );

  /** Open the site-wide viewer on photo i. */
  open(index: number): void {
    this.lightbox.open(this.lightboxItems(), index);
  }

  /** A press clipping, full size, in the same viewer. */
  openClipping(image: string, caption: string): void {
    const src = this.resolve(image);
    this.lightbox.open([{ src, thumb: src, caption }], 0);
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
