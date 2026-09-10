import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/** Minimal shape of the Swiper custom element + instance we drive. */
interface HeroSwiper {
  realIndex: number;
  slidePrev(): void;
  slideNext(): void;
  slideToLoop(index: number): void;
  on(event: string, handler: () => void): void;
}
type SwiperEl = HTMLElement & { initialize(): void; swiper: HeroSwiper };

interface HeroStat {
  value: string;
  label: string;
  /** Feather-style 24×24 stroke path(s). */
  path: string[];
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
  /** Full-bleed campus photography — one per background slide. */
  readonly slides = PLACEHOLDER.heroSlides;

  /** Current slide, mirrored from Swiper so the custom dots can highlight. */
  readonly activeIndex = signal(0);

  /** Headline metrics, overlaid bottom-left of the hero. */
  readonly stats: readonly HeroStat[] = [
    { value: '110+', label: 'Years of Education', path: ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5'] },
    { value: '31+', label: 'Institutes', path: ['M3 21h18', 'M5 21V8l7-4 7 4v13', 'M9 21v-4h6v4', 'M9 12h.01M15 12h.01'] },
    { value: '50+', label: 'Courses & Activities', path: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'] },
    { value: '100%', label: 'Dedication Rate', path: ['M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M8.5 13.5 7 21l5-3 5 3-1.5-7.5'] },
  ];

  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');

  constructor() {
    // Browser-only: Swiper's custom elements need `customElements`, absent during SSR.
    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
      const el = this.swiperEl()?.nativeElement;
      if (!el) return;
      Object.assign(el, {
        loop: true,
        speed: 1000,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        grabCursor: true,
        a11y: { enabled: true },
      });
      el.initialize();
      el.swiper.on('slideChange', () => this.activeIndex.set(el.swiper.realIndex));
    });
  }

  prev(): void { this.swiperEl()?.nativeElement.swiper?.slidePrev(); }
  next(): void { this.swiperEl()?.nativeElement.swiper?.slideNext(); }
  goTo(index: number): void { this.swiperEl()?.nativeElement.swiper?.slideToLoop(index); }
}
