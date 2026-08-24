import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Institute {
  title: string;
  desc: string;
  link: string;
  /** Set to a campus photograph to replace the placeholder panel. */
  image?: string;
}

/** Minimal shape of the Swiper custom element we touch. */
type SwiperEl = HTMLElement & { swiper?: { slideNext(): void; slidePrev(): void }; initialize(): void };

@Component({
  selector: 'app-institutes',
  imports: [RouterLink],
  templateUrl: './institutes.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './institutes.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Institutes {
  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiperEl');

  readonly institutes: readonly Institute[] = [
    { title: 'Schools', desc: 'Nurturing young minds for a brighter future.', link: '/academic/school', image: PLACEHOLDER.institutes.schools },
    { title: 'Colleges', desc: 'Empowering learners with knowledge & skills.', link: '/academic/colleges', image: PLACEHOLDER.institutes.colleges },
    { title: 'Professional Institutes', desc: 'Building career-ready professionals.', link: '/academic/others', image: PLACEHOLDER.institutes.professional },
    { title: 'Hostels', desc: 'Safe, comfortable living environment.', link: '/academic/hostels', image: PLACEHOLDER.institutes.hostels },
    { title: 'Other Institutes', desc: 'Diverse programs for holistic development.', link: '/academic/others', image: PLACEHOLDER.institutes.others },
  ];

  constructor() {
    // Browser-only: custom elements need `customElements`, absent during SSR.
    afterNextRender(async () => {
      const { register } = await import('swiper/element/bundle');
      register();
      const el = this.swiperEl()?.nativeElement;
      if (!el) return;
      Object.assign(el, {
        slidesPerView: 'auto',
        spaceBetween: 20,
        grabCursor: true,
        a11y: { enabled: true },
      });
      el.initialize();
    });
  }

  slide(direction: -1 | 1): void {
    const sw = this.swiperEl()?.nativeElement?.swiper;
    if (!sw) return;
    if (direction === 1) sw.slideNext();
    else sw.slidePrev();
  }
}
