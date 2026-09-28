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
   * Built-in fallback banners. Shown during SSR/prerender (no API there) and kept
   * whenever the server returns nothing or errors, so the hero is never empty.
   * Replace the artwork in /assets/images/hero/banners/ as needed.
   */
  private readonly fallbackBanners: readonly Banner[] = [
    {
      desktop: '/assets/images/hero/banners/anniversary-desktop.svg',
      mobile: '/assets/images/hero/banners/anniversary-mobile.svg',
      alt: 'Charotar Education Society — 110 Years, a legacy since 1916',
      link: '/celebration',
    },
    {
      desktop: '/assets/images/hero/banners/admissions-desktop.svg',
      mobile: '/assets/images/hero/banners/admissions-mobile.svg',
      alt: 'Admissions open 2025–26 at Charotar Education Society',
      link: '/academic/school',
    },
  ];

  /** Slides actually rendered — fallback first, replaced by the server list (browser). */
  readonly banners = signal<readonly Banner[]>(this.fallbackBanners);

  /** Current slide, mirrored from Swiper so the custom dots can highlight. */
  readonly activeIndex = signal(0);

  /** False until Swiper is being initialised — keeps extra slides hidden (no stack flash). */
  readonly swiperReady = signal(false);

  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');
  private mounted = false;

  constructor() {
    // Browser-only (afterNextRender never runs on the server). Mount Swiper right
    // away with the fallback banners so the slider always works regardless of the
    // network, then swap in the live banners once they load.
    afterNextRender(async () => {
      await this.mountSwiper();
      this.loadBanners();
    });
  }

  /**
   * Resolve which institute this site is (backend-driven, like the legacy boot
   * flow), load that institute's slider banners, and swap them in. Any failure
   * leaves the fallback banners in place.
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
        if (!mapped.length) return; // keep the fallback banners

        this.banners.set(mapped);
        // Let the @for render the new slides, then tell Swiper to re-read them.
        requestAnimationFrame(() => {
          const swiper = this.swiperEl()?.nativeElement.swiper;
          swiper?.update();
          swiper?.slideToLoop(0);
          this.activeIndex.set(0);
        });
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

    // Reveal every slide, then wait one frame so the @for has rendered before
    // Swiper reads the DOM.
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
      // Auto-detect when the banner list is swapped in from the server.
      observer: true,
      observeSlideChildren: true,
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
