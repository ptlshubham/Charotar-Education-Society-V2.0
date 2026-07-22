import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';

interface Slide {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 3000;
const DRAG_THRESHOLD = 40;

/**
 * Self-contained fade slider: linear forward-only flow, 3s autoplay, drag-to-advance.
 * Each instance owns its own index + timer so multiple sliders run independently.
 */
class FadeSlider {
  readonly activeIndex = signal(0);
  private timer?: ReturnType<typeof setInterval>;
  private dragStartX: number | null = null;
  private dragStartY = 0;

  constructor(readonly slides: Slide[]) {}

  /** Always advances forward and wraps to 0  linear flow, no reverse. */
  next(): void {
    this.activeIndex.set((this.activeIndex() + 1) % this.slides.length);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);
    this.start(); // restart the 3s timer after manual navigation
  }

  onPointerDown(event: PointerEvent): void {
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    // No pointer capture  vertical page scrolling over the slider stays native.
  }

  onPointerUp(event: PointerEvent): void {
    if (this.dragStartX === null) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.dragStartX = null;
    // Only a mostly-horizontal swipe advances the slide; vertical scrolls are ignored.
    if (Math.abs(dx) > DRAG_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      this.next();
      this.start();
    }
  }

  start(): void {
    this.stop();
    this.timer = setInterval(() => this.next(), AUTOPLAY_MS);
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}

const ALT = 'ZarklyX agency operations dashboard';

@Component({
  selector: 'app-platform-overview',
  imports: [RouterLink],
  templateUrl: './platform-overview.html',
  styleUrl: './platform-overview.scss',
})
export class PlatformOverview implements OnDestroy {
  /** Mobile/tablet slider (shown in the lg:hidden block). */
  readonly mobileSlider = new FadeSlider([
    { src: '/assets/images/platform-overview-img2.png', alt: ALT },
    { src: '/assets/images/platform-overview-img3.jpeg', alt: ALT },
    { src: '/assets/images/platform-overview-img4.jpeg', alt: ALT },
  ]);

  /** Desktop slider (shown in the hidden lg:flex block). */
  readonly lgSlider = new FadeSlider([
    { src: '/assets/images/platform-overview-lg-img2.png', alt: ALT },
    { src: '/assets/images/platform-overview-img3.jpeg', alt: ALT },
    { src: '/assets/images/platform-overview-img4.jpeg', alt: ALT },
  ]);

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observers: IntersectionObserver[] = [];

  constructor() {
    // Browser-only (setInterval / IntersectionObserver / gsap)  keeps SSR safe.
    afterNextRender(() => {
      this.mobileSlider.start();
      this.lgSlider.start();
      this.setupCounters();
    });
  }

  ngOnDestroy(): void {
    this.mobileSlider.stop();
    this.lgSlider.stop();
    this.observers.forEach((o) => o.disconnect());
  }

  /** Arms each counter to count up the first time it scrolls into view. */
  private setupCounters(): void {
    const els = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-count]');
    els.forEach((el) => {
      const target = Number(el.dataset['count'] ?? '0');
      const suffix = el.dataset['suffix'] ?? '';

      // Hide until revealed so there's no flash of the final number.
      gsap.set(el, { opacity: 0 });

      let played = false;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !played) {
              played = true;
              this.animateCount(el, target, suffix);
              io.disconnect();
            }
          }
        },
        { threshold: 0.5 },
      );
      io.observe(el);
      this.observers.push(io);
    });
  }

  /** GSAP count-up: blurred rise-in while the value tallies, then a soft scale pop. */
  private animateCount(el: HTMLElement, target: number, suffix: string): void {
    const state = { val: 0 };
    el.textContent = `0${suffix}`;

    gsap
      .timeline()
      .fromTo(
        el,
        { opacity: 0, y: 26, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
        0,
      )
      .to(
        state,
        {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(state.val)}${suffix}`;
          },
        },
        0,
      )
      .to(el, { scale: 1.12, duration: 0.18, ease: 'power2.out' }, '>-0.2')
      .to(el, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
  }
}
