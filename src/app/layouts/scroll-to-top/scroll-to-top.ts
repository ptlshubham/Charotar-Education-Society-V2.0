import {
  Component,
  signal,
  inject,
  PLATFORM_ID,
  afterNextRender,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LenisService } from '../../core/services/lenis.service';

/**
 * Global "back to top" button. A solid circular button (so it stays visible on any
 * background, including navy sections) fixed to the bottom-right corner, below the
 * AI button, and rendered from the main layout so it appears on every route.
 * Hidden at the top of the page; fades in once the user scrolls down a little.
 */
@Component({
  selector: 'app-scroll-to-top',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './scroll-to-top.html',
})
export class ScrollToTop {
  /** Whether the button is shown  true once scrolled past the threshold. */
  visible = signal(false);

  /** Reveal the button after the user scrolls this many pixels down. */
  private readonly showAfter = 200;

  private readonly lenis = inject(LenisService);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(platformId)) return;

    const onScroll = () => this.visible.set(window.scrollY > this.showAfter);

    afterNextRender(() => {
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    });

    destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    });
  }

  scrollToTop(): void {
    this.lenis.scrollTo(0);
  }
}
