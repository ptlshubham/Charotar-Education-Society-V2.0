import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  booleanAttribute,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderBannersService } from '../../../core/services/header-banners.service';

/** Minimal shape of the Swiper custom element we initialise. */
type SwiperEl = HTMLElement & { initialize(): void; swiper?: unknown };

/**
 * The institute's header banners (HeaderBannersService) as a rotating strip - used in the desktop
 * and tablet headers and in the notice strip under the phone header, so the notice shows on every
 * page at every screen size. It fills its host; the parent sets the size. With `fallback`, the
 * "Educating Since 1916" badge stands in while there are no banners (which is also what the server
 * renders, so hydration always matches).
 */
@Component({
  selector: 'app-header-ads',
  imports: [NgTemplateOutlet],
  templateUrl: './header-ads.html',
  styleUrl: './header-ads.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderAds {
  readonly banners = inject(HeaderBannersService);
  private readonly router = inject(Router);

  @Input({ transform: booleanAttribute }) fallback = false;

  private readonly swiperEl = viewChild<ElementRef<SwiperEl>>('swiper');

  constructor() {
    this.banners.load();
    // Rotate once there is more than one banner - a single one just shows.
    effect(() => {
      if (this.banners.ads().length > 1) void this.mountSwiper();
    });
  }

  /** Open an on-site banner link in the app; ctrl/⌘/shift/middle clicks keep the browser's own new-tab behaviour. */
  openAd(e: MouseEvent, link: string): void {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    this.router.navigateByUrl(link);
  }

  /**
   * Swiper's custom elements need `customElements`, so this only ever runs in the browser (the
   * banners never load server-side), one frame after the slides have rendered.
   */
  private async mountSwiper(): Promise<void> {
    const { register } = await import('swiper/element/bundle');
    register();
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const el = this.swiperEl()?.nativeElement;
    if (!el || typeof el.initialize !== 'function' || el.swiper) return;
    Object.assign(el, {
      loop: true,
      speed: 700,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      allowTouchMove: false,
      a11y: { enabled: true },
    });
    el.initialize();
  }
}
