import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, PLATFORM_ID, computed, inject, signal, viewChild } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Slide {
  image: string;
  /** First heading line (white). */
  lead: string;
  /** Second heading line (gold accent). */
  accent: string;
  blurb: string;
}

/** Minimal shape of the Swiper custom element we touch. */
type SwiperEl = HTMLElement & {
  swiper?: {
    realIndex: number;
    slideNext(): void;
    slidePrev(): void;
    slideToLoop(index: number): void;
    autoplay?: { start(): void; stop(): void };
  };
  initialize(): void;
};

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { '(document:keydown.escape)': 'closeVideo()' },
})
export class Hero {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');

  /** Replace each `image` with real CES photography — see PLACEHOLDER.heroSlides. */
  readonly slides: readonly Slide[] = [
    {
      image: PLACEHOLDER.heroSlides[0],
      lead: 'Empowering Generations.',
      accent: 'Building Tomorrow.',
      blurb: 'A legacy of 110+ years in quality education through 31+ institutes across diverse domains.',
    },
    {
      image: PLACEHOLDER.heroSlides[1],
      lead: 'Education Rooted in Values.',
      accent: 'Growth Without Limits.',
      blurb: 'From pre-school to postgraduate study, a nurturing campus shapes character alongside knowledge.',
    },
    {
      image: PLACEHOLDER.heroSlides[2],
      lead: 'One Family. One Legacy.',
      accent: 'Since 1916.',
      blurb: 'Thousands of students, alumni and educators carrying forward a century of trusted, affordable learning.',
    },
  ];

  readonly active = signal(0);
  readonly current = computed(() => this.slides[this.active()]);

  readonly categories: readonly string[] = [
    'All Categories',
    'Schools',
    'Colleges',
    'Professional Institutes',
    'Hostels',
    'Courses',
  ];

  // ─── Campus video ───
  /** YouTube id of the CES film. Swap for a newer upload when there is one. */
  private static readonly VIDEO_ID = '_-ntpkeG7O4';

  readonly videoOpen = signal(false);

  /**
   * Built once. The iframe is only rendered while the modal is open, so this URL
   * is never requested on page load — and closing unmounts it, which stops
   * playback (there is no other way to stop an embed we don't control).
   */
  readonly videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube-nocookie.com/embed/${Hero.VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`,
  );

  constructor() {
    // Swiper Element is a web component: register + initialize browser-only so
    // SSR/prerender never touches `customElements`.
    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
      const el = this.swiperEl()?.nativeElement;
      if (!el) return;
      Object.assign(el, {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 700,
        autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
        grabCursor: true,
        a11y: { enabled: true },
      });
      el.initialize();
    });
  }

  private get swiper() {
    return this.swiperEl()?.nativeElement?.swiper;
  }

  /** Keep the heading + dots in step with the slide Swiper is showing. */
  onSlideChange(event: Event): void {
    const swiper = (event as CustomEvent<[{ realIndex: number }]>).detail?.[0];
    if (swiper) this.active.set(swiper.realIndex);
  }

  select(i: number): void {
    this.swiper?.slideToLoop(i);
  }

  next(): void {
    this.swiper?.slideNext();
  }

  prev(): void {
    this.swiper?.slidePrev();
  }

  openVideo(): void {
    this.videoOpen.set(true);
    this.swiper?.autoplay?.stop();
    this.lockScroll(true);
  }

  closeVideo(): void {
    if (!this.videoOpen()) return; // the Escape handler fires page-wide
    this.videoOpen.set(false);
    this.lockScroll(false);
    this.swiper?.autoplay?.start();
  }

  private lockScroll(on: boolean): void {
    if (!this.isBrowser) return;
    this.document.body.style.overflow = on ? 'hidden' : '';
  }
}
