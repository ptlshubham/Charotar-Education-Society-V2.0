import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { GalleryImage } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { environment } from '../../../../environments/environment';

/** CES society — the gallery's owning institute (matches blogs/answer-keys). */
const GALLERY_INSTITUTE_ID = 1;

interface Photo {
  id: number;
  src: string;
  caption: string;
}

interface Video {
  id: number;
  title: string;
  /** YouTube id when the source is a YouTube link; '' for a direct video file. */
  youtubeId: string;
  /** Resolved URL of a direct video file (mp4…); '' for YouTube. */
  fileSrc: string;
  /** Poster image (YouTube thumbnail); '' falls back to a play-icon card. */
  thumb: string;
}

@Component({
  selector: 'app-gallery',
  imports: [FormsModule, RouterLink, Pagination],
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery.scss',
})
export class Gallery {
  private readonly resources = inject(ResourcesService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly banner = PLACEHOLDER.media.galleryBanner;

  readonly stats: ReadonlyArray<{ value: string; label: string; tone: string; path: string[] }> = [
    { value: '1,248+', label: 'Photos', tone: 'bg-primary/10 text-primary', path: ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'm21 15-5-5L5 21'] },
    { value: '156+', label: 'Videos', tone: 'bg-logo/10 text-logo', path: ['m23 7-7 5 7 5z', 'M1 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z'] },
    { value: '32+', label: 'Albums', tone: 'bg-primary/10 text-primary', path: ['M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'] },
  ];

  readonly tab = signal<'photos' | 'videos'>('photos');
  readonly sortDir = signal<'latest' | 'oldest'>('latest');
  search = '';
  private readonly query = signal('');

  readonly loading = signal(true);
  readonly failed = signal(false);
  /** Every gallery photo returned by the backend (purpose === 'image'). */
  private readonly all = signal<readonly Photo[]>([]);
  /** Gallery videos returned by the backend (purpose === 'video'). */
  readonly videos = signal<readonly Video[]>([]);
  /** Video currently open in the player popup, or null when closed. */
  readonly activeVideo = signal<{ title: string; embed: SafeResourceUrl | null; file: string } | null>(null);

  /** Varied placeholder heights so the loading masonry looks natural. */
  readonly skeleton: readonly number[] = [220, 300, 180, 260, 200, 320, 240, 190, 280];

  constructor() {
    this.resources
      .getGalleryImages(GALLERY_INSTITUTE_ID)
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<GalleryImage[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? list : [];

        this.all.set(
          rows
            .filter((r) => r.purpose === 'image' && !!r.image)
            .map((r, i) => ({
              id: r.id ?? i,
              src: this.resolve(r.image),
              caption: r.title?.trim() || `CES gallery photograph ${i + 1}`,
            })),
        );

        this.videos.set(
          rows
            .filter((r) => r.purpose === 'video')
            .map((r, i) => {
              const url = (r.video || r.link || r.image || '').trim();
              const yt = this.videoId(url);
              return {
                id: r.id ?? i,
                title: r.title?.trim() || `CES gallery video ${i + 1}`,
                youtubeId: yt,
                fileSrc: yt ? '' : this.resolve(url),
                thumb: yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : '',
              };
            })
            .filter((v) => !!v.youtubeId || !!v.fileSrc),
        );

        this.loading.set(false);
      });
  }

  selectTab(t: 'photos' | 'videos'): void {
    this.tab.set(t);
  }

  setSort(dir: 'latest' | 'oldest'): void {
    this.sortDir.set(dir);
    this.pager.reset();
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.pager.reset();
  }

  readonly filtered = computed(() => {
    const q = this.query();
    const dir = this.sortDir();
    const list = this.all().filter((p) => !q || p.caption.toLowerCase().includes(q));
    // Backend returns images by id; latest-first is highest id first.
    const sorted = [...list].sort((a, b) => a.id - b.id);
    return dir === 'latest' ? sorted.reverse() : sorted;
  });

  readonly pager = new Paginator(this.filtered, 12);

  // ── Lightbox (zoom / pan / download / prev-next) ──────────────────────────
  readonly lightboxIndex = signal<number | null>(null);
  readonly zoom = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly dragging = signal(false);

  private dragStartX = 0;
  private dragStartY = 0;
  private panStartX = 0;
  private panStartY = 0;

  /** The photo currently open in the lightbox (indexes the full filtered list). */
  readonly current = computed(() => {
    const i = this.lightboxIndex();
    return i === null ? null : (this.filtered()[i] ?? null);
  });

  readonly lightboxPosition = computed(() => {
    const i = this.lightboxIndex();
    return i === null ? '' : `${i + 1} / ${this.filtered().length}`;
  });

  readonly zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);

  open(photo: Photo): void {
    const i = this.filtered().findIndex((p) => p.id === photo.id);
    if (i === -1) return;
    this.lightboxIndex.set(i);
    this.resetZoom();
  }

  close(): void {
    this.lightboxIndex.set(null);
    this.resetZoom();
  }

  next(): void {
    const list = this.filtered();
    const i = this.lightboxIndex();
    if (i === null || !list.length) return;
    this.lightboxIndex.set((i + 1) % list.length);
    this.resetZoom();
  }

  prev(): void {
    const list = this.filtered();
    const i = this.lightboxIndex();
    if (i === null || !list.length) return;
    this.lightboxIndex.set((i - 1 + list.length) % list.length);
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
   * browser (it just navigates), so fetch the bytes and save a blob URL instead;
   * fall back to opening the image if the fetch is blocked (CORS).
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
    return name || 'ces-gallery-image.jpg';
  }

  // ── Video player popup ──
  playVideo(v: Video): void {
    if (v.youtubeId) {
      this.activeVideo.set({
        title: v.title,
        embed: this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0`,
        ),
        file: '',
      });
    } else {
      this.activeVideo.set({ title: v.title, embed: null, file: v.fileSrc });
    }
  }

  closeVideo(): void {
    this.activeVideo.set(null);
  }

  /** Extract the YouTube video id from the various URL shapes the backend stores. */
  private videoId(link: string): string {
    if (!link) return '';
    if (link.includes('youtube.com/watch?v=')) return link.split('v=')[1].split('&')[0];
    if (link.includes('youtu.be/')) return link.split('.be/')[1].split('?')[0];
    if (link.includes('youtube.com/live/')) return link.split('/live/')[1].split('?')[0];
    if (link.includes('youtube.com/embed/')) return link.split('/embed/')[1].split(/[?&]/)[0];
    return '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeVideo() !== null) this.closeVideo();
    else if (this.lightboxIndex() !== null) this.close();
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
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
