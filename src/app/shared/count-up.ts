import { afterNextRender, DestroyRef, inject, Signal, signal } from '@angular/core';

/** How long a count-up takes. */
const COUNT_MS = 1800;

/**
 * Figures that count up from zero the first time `watch()` scrolls into view - call it from a
 * component's field initialiser or constructor:
 *
 *   readonly shown = countUp(this.stats.map((s) => s.to), () => this.figures().nativeElement);
 *
 * The signal holds the final figures until then, so prerender and no-JS show the real numbers;
 * the browser resets them to zero after the first render (use it on content below the fold), and
 * reduced-motion visitors keep them still. Pair the moving figure with an sr-only final one -
 * screen readers shouldn't read every step.
 */
export function countUp(targets: readonly number[], watch: () => Element): Signal<readonly number[]> {
  const shown = signal<readonly number[]>(targets);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    shown.set(targets.map(() => 0));

    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / COUNT_MS);
          const eased = 1 - Math.pow(1 - p, 3); // fast, then settling on the figure
          shown.set(targets.map((to) => Math.round(to * eased)));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      // Starts once the element's top edge is a little way up the screen. Not a visible-share
      // threshold: on a short screen (phone held sideways) a tall block can't be 30% on view.
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(watch());

    destroyRef.onDestroy(() => {
      io.disconnect();
      cancelAnimationFrame(frame);
    });
  });

  return shown.asReadonly();
}
