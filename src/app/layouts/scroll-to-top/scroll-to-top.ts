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
 * Global "back to top" button. Fixed to the bottom-right corner (stacked above
 * the AI button) and rendered from the main layout, so it appears on every route.
 * Hidden at the top of the page; fades in once the user scrolls down a little,
 * with a circular ring that fills to show scroll progress.
 */
@Component({
  selector: 'app-scroll-to-top',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './scroll-to-top.html',
})
export class ScrollToTop {
  /** Radius of the progress ring (viewBox is 0 0 50 50, centre 25,25). Must match
   *  the r of the <circle> elements in the template so the arc fills accurately. */
  private readonly radius = 23;
  /** Full circumference  the progress arc's dash length. */
  readonly circumference = 2 * Math.PI * this.radius;

  /** Page scroll progress, 0 (top) .. 1 (bottom). */
  progress = signal(0);

  /** Whether the button is shown  true once scrolled past the threshold. */
  visible = signal(false);

  /** Reveal the button after the user scrolls this many pixels down. */
  private readonly showAfter = 200;

  /** Dash offset that reveals the arc proportionally to scroll progress. */
  get dashOffset(): number {
    return this.circumference * (1 - this.progress());
  }

  private readonly lenis = inject(LenisService);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    const destroyRef = inject(DestroyRef);
    if (!isPlatformBrowser(platformId)) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      this.progress.set(Math.min(1, Math.max(0, p)));
      this.visible.set(window.scrollY > this.showAfter);
    };

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
