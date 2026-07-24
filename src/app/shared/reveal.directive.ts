import { Directive, ElementRef, Input, afterNextRender, inject } from '@angular/core';

/**
 * Fades + slides an element in the first time it scrolls into view.
 *
 *   <div appReveal>…</div>
 *   <li [appReveal]="120">…</li>   <!-- 120ms stagger delay -->
 *
 * Progressive enhancement by design: the hidden state is applied in
 * `afterNextRender`, which runs only in the browser. Under SSR/prerender — and
 * with JavaScript disabled — the element is simply visible, never hidden. It
 * also opts out entirely when the user prefers reduced motion.
 *
 * Apply it only to content that starts below the fold; on above-the-fold
 * elements the paint-then-hide would flash.
 */
@Directive({
  selector: '[appReveal]',
})
export class Reveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Stagger delay in ms. Bare `appReveal` (empty string) means 0. */
  @Input('appReveal') delay: number | '' = 0;

  constructor() {
    afterNextRender(() => {
      const el = this.el.nativeElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const delay = typeof this.delay === 'number' ? this.delay : 0;
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
      el.style.transitionDelay = `${delay}ms`;
      el.style.willChange = 'opacity, transform';

      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.addEventListener('transitionend', () => (el.style.willChange = ''), { once: true });
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(el);
    });
  }
}
