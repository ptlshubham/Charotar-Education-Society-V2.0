import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import Lenis from 'lenis';

/**
 * Owns the single app-wide Lenis smooth-scroll instance. Initialised once from the
 * main layout (browser only) and reused by any component that needs programmatic
 * smooth scrolling (e.g. the back-to-top button).
 */
@Injectable({ providedIn: 'root' })
export class LenisService {
  private readonly platformId = inject(PLATFORM_ID);
  private lenis?: Lenis;
  private rafHandler?: (time: number) => void;

  /** Create Lenis and drive it from GSAP's ticker. No-op on the server or if already running. */
  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.lenis) return;

    this.lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
    });

    // Single RAF loop, in sync with GSAP animations.
    this.rafHandler = (time: number) => this.lenis?.raf(time * 1000);
    gsap.ticker.add(this.rafHandler);
    gsap.ticker.lagSmoothing(0);
  }

  /** Smoothly (or immediately) scroll to a target: pixel offset, selector, or element. */
  scrollTo(
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; offset?: number; duration?: number },
  ): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (isPlatformBrowser(this.platformId) && typeof target === 'number') {
      window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
    }
  }

  /** Pause user-driven scrolling (e.g. while a modal or dropdown overlay is open). */
  stop(): void {
    this.lenis?.stop();
  }

  /** Resume user-driven scrolling. */
  start(): void {
    this.lenis?.start();
  }

  destroy(): void {
    if (this.rafHandler) gsap.ticker.remove(this.rafHandler);
    this.lenis?.destroy();
    this.lenis = undefined;
    this.rafHandler = undefined;
  }
}
