import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/** Minimal shape of the Swiper custom element we touch. */
type SwiperEl = HTMLElement & { initialize(): void };

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Hero {
  /** Real CES campus photography — one per hero slide. */
  readonly slides = PLACEHOLDER.heroSlides;

  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');

  constructor() {
    // Browser-only: Swiper's custom elements need `customElements`, which is absent during SSR.
    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
      const el = this.swiperEl()?.nativeElement;
      if (!el) return;
      Object.assign(el, {
        loop: true,
        speed: 900,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { clickable: true },
        grabCursor: true,
        a11y: { enabled: true },
      });
      el.initialize();
    });
  }
}
