import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { GalleryImage } from '../../../shared/models/models';
import { environment } from '../../../../environments/environment';

/** Minimal shape of the Swiper custom element + instance we drive. */
interface HeroSwiper {
  realIndex: number;
  slidePrev(): void;
  slideNext(): void;
  slideToLoop(index: number): void;
  update(): void;
  on(event: string, handler: () => void): void;
}
type SwiperEl = HTMLElement & { initialize(): void; swiper?: HeroSwiper };

/**
 * One promo banner. Both crops are supplied so the artwork is never cropped:
 * `desktop` at 1920×520 (landscape) and `mobile` at 1080×1350 (portrait).
 * `link` is optional (whole banner becomes a click-through).
 */
interface Banner {
  desktop: string;
  mobile: string;
  alt: string;
  link?: string;
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Hero {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * The slides - only ever the server's banners. Empty until they load (and always under
   * SSR/prerender, which has no API), and empty if there are none or the request fails:
   * then the whole section is left out rather than showing stand-in artwork.
   */
  readonly banners = signal<readonly Banner[]>([]);

  /** Current slide, mirrored from Swiper so the custom dots can highlight. */
  readonly activeIndex = signal(0);

  /** False until Swiper is being initialised - keeps extra slides hidden (no stack flash). */
  readonly swiperReady = signal(false);

  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');
  private mounted = false;

  constructor() {
    // Browser-only (afterNextRender never runs on the server): load the banners, and
    // only if there are any, render the section and start Swiper on them.
    afterNextRender(() => this.loadBanners());
  }

  /**
   * Resolve which institute this site is (backend-driven, like the legacy boot
   * flow) and load that institute's slider banners. None, or a failure, leaves the
   * section out.
   */
  private loadBanners(): void {
    this.institute
      .resolve()
      .pipe(
        switchMap((instituteId) => this.resources.getSliderBanners(instituteId)),
        timeout(8000),
        catchError(() => of<GalleryImage[]>([])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((list) => {
        const mapped = list.map<Banner>((b) => ({
          desktop: this.resolve(b.image),
          mobile: this.resolve(b.mobileImage || b.image),
          alt: b.title || b.keywords || 'Charotar Education Society',
          link: b.link || undefined,
        }));
        if (!mapped.length) return; // no banners - the section stays out

        this.banners.set(mapped);
        this.mountSwiper();
      });
  }

  /** Prefix a relative media path with the API host (mirrors MediaUrlPipe). */
  private resolve(path: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  private async mountSwiper(): Promise<void> {
    if (this.mounted) return;
    this.mounted = true;

    const { register } = await import('swiper/element/bundle');
    register();

    // Reveal every slide, then wait one frame so the section and its @for have
    // rendered before Swiper reads the DOM.
    this.swiperReady.set(true);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const el = this.swiperEl()?.nativeElement;
    if (!el) return;
    Object.assign(el, {
      loop: this.banners().length > 1,
      speed: 700,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      grabCursor: true,
      a11y: { enabled: true },
    });
    // Guard against a double init (e.g. dev HMR re-running this on an already
    // upgraded element, where `initialize` is no longer present).
    if (typeof el.initialize === 'function' && !el.swiper) el.initialize();
    el.swiper?.on('slideChange', () => this.activeIndex.set(el.swiper?.realIndex ?? 0));
  }

  prev(): void { this.swiperEl()?.nativeElement.swiper?.slidePrev(); }
  next(): void { this.swiperEl()?.nativeElement.swiper?.slideNext(); }
  goTo(index: number): void { this.swiperEl()?.nativeElement.swiper?.slideToLoop(index); }
}
