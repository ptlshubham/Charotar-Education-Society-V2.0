import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { NavratriEntry, NavratriImage } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { environment } from '../../../../environments/environment';

type Tab = 'overview' | 'gallery' | 'events' | 'news' | 'sponsors';

@Component({
  selector: 'app-navratri-detail',
  imports: [RouterLink, MediaUrlPipe, SafeHtmlPipe, PageHero],
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

  /** Generic event facts (the DB has only the per-year theme write-up, shown in the article). */
  readonly highlights: ReadonlyArray<{ label: string; value: string; path: string[] }> = [
    { label: 'Duration', value: `15th Sep – 24th Oct, ${this.year}`, path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
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

  /** Best available URL field on a gallery image (thumbnail for the grid). */
  imgSrc(img: NavratriImage): string {
    return img.thumb ?? img.image ?? img.original ?? img.path ?? '';
  }

  // ── Lightbox (zoom / pan / download / prev-next) ──────────────────────────
  /** Full-resolution, resolved URLs for the lightbox and download. */
  readonly lightboxItems = computed(() =>
    this.images().map((img, i) => ({
      src: this.resolve(img.original ?? img.image ?? img.path ?? img.thumb ?? ''),
      caption: `Navratri ${this.year} — Photo ${i + 1}`,
    })),
  );

  readonly lightboxIndex = signal<number | null>(null);
  readonly zoom = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly dragging = signal(false);

  private dragStartX = 0;
  private dragStartY = 0;
  private panStartX = 0;
  private panStartY = 0;

  readonly current = computed(() => {
    const i = this.lightboxIndex();
    return i === null ? null : (this.lightboxItems()[i] ?? null);
  });

  readonly lightboxPosition = computed(() => {
    const i = this.lightboxIndex();
    return i === null ? '' : `${i + 1} / ${this.lightboxItems().length}`;
  });

  readonly zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);

  open(index: number): void {
    if (index < 0 || index >= this.lightboxItems().length) return;
    this.lightboxIndex.set(index);
    this.resetZoom();
  }

  close(): void {
    this.lightboxIndex.set(null);
    this.resetZoom();
  }

  next(): void {
    const n = this.lightboxItems().length;
    const i = this.lightboxIndex();
    if (i === null || !n) return;
    this.lightboxIndex.set((i + 1) % n);
    this.resetZoom();
  }

  prev(): void {
    const n = this.lightboxItems().length;
    const i = this.lightboxIndex();
    if (i === null || !n) return;
    this.lightboxIndex.set((i - 1 + n) % n);
    this.resetZoom();
  }

  zoomIn(): void {
    this.zoom.set(Math.min(4, +(this.zoom() + 0.5).toFixed(2)));
  }

  zoomOut(): void {
    const z = Math.max(1, +(this.zoom() - 0.5).toFixed(2));
    this.zoom.set(z);
    if (z === 1) {
      this.panX.set(0);
      this.panY.set(0);
    }
  }

  resetZoom(): void {
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  toggleZoom(): void {
    if (this.zoom() > 1) this.resetZoom();
    else this.zoom.set(2);
  }

  onWheel(e: WheelEvent): void {
    e.preventDefault();
    if (e.deltaY < 0) this.zoomIn();
    else this.zoomOut();
  }

  onPointerDown(e: PointerEvent): void {
    if (this.zoom() <= 1) return;
    this.dragging.set(true);
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.panStartX = this.panX();
    this.panStartY = this.panY();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging()) return;
    this.panX.set(this.panStartX + (e.clientX - this.dragStartX));
    this.panY.set(this.panStartY + (e.clientY - this.dragStartY));
  }

  onPointerUp(): void {
    this.dragging.set(false);
  }

  /**
   * Download the current image. A cross-origin `<a download>` is ignored by the
   * browser, so fetch the bytes and save a blob URL; fall back to opening it.
   */
  async download(): Promise<void> {
    const p = this.current();
    if (!p) return;
    try {
      const res = await fetch(p.src);
      if (!res.ok) throw new Error('download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename(p.src);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(p.src, '_blank', 'noopener');
    }
  }

  private filename(src: string): string {
    const clean = src.split('?')[0].split('#')[0];
    const name = clean.substring(clean.lastIndexOf('/') + 1);
    return name || `navratri-${this.year}.jpg`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightboxIndex() !== null) this.close();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.lightboxIndex() !== null) this.next();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.lightboxIndex() !== null) this.prev();
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
