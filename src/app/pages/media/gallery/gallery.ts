import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { LightboxService } from '../../../core/services/lightbox.service';
import { GalleryImage } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { environment } from '../../../../environments/environment';

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
  imports: [FormsModule, Pagination, PageHero],
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery.scss',
})
export class Gallery {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly lightbox = inject(LightboxService);

  readonly banner = 'assets/images/hero/gallery.jpeg';

  readonly stats: ReadonlyArray<{ value: string; label: string; tone: string; icon: string }> = [
    { value: '1,248+', label: 'Photos', tone: 'bg-primary/10 text-primary', icon: 'photo_library' },
    { value: '156+', label: 'Videos', tone: 'bg-logo/10 text-logo', icon: 'videocam' },
    { value: '32+', label: 'Albums', tone: 'bg-primary/10 text-primary', icon: 'folder' },
  ];

  readonly tab = signal<'photos' | 'videos'>('photos');
  readonly sortDir = signal<'latest' | 'oldest'>('latest');
  readonly sortDropdownOpen = signal(false);
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
    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getGalleryImages(id)),
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

  /** Open the site-wide viewer on this photo, with the whole filtered list to browse. */
  open(photo: Photo): void {
    const list = this.filtered();
    const i = list.findIndex((p) => p.id === photo.id);
    if (i === -1) return;
    this.lightbox.open(list.map((p) => ({ src: p.src, caption: p.caption })), i);
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
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
