import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Reveal } from '../../../shared/reveal.directive';

interface Stat {
  /** The number it counts up to. */
  to: number;
  /** Written after the number in the same style, e.g. "Lakh" (5 Lakh+). */
  unit?: string;
  suffix: string;
  label: string;
  note: string;
}

/** The Society was founded in 1916 - the years figure moves on by itself each year. */
const FOUNDED = 1916;
/** How long the count-up takes. */
const COUNT_MS = 1800;
const format = new Intl.NumberFormat('en-IN');

/**
 * "CES at a Glance" - the Society's headline figures, counting up from zero the first time
 * they scroll into view. Years, institutes and records are as the site states elsewhere
 * (About page, the records slider); the alumni figure is from CES (2026-10).
 *
 * Prerender and no-JS show the final numbers; the browser resets them to zero before they
 * come into view (they sit below the fold), and reduced-motion visitors keep them still.
 */
@Component({
  selector: 'app-stats',
  imports: [Reveal],
  templateUrl: './stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './stats.scss',
})
export class Stats {
  /** The row of figures - watched for scrolling into view (the host element is inline, with no box). */
  private readonly figures = viewChild.required<ElementRef<HTMLElement>>('figures');

  readonly stats: readonly Stat[] = [
    {
      to: new Date().getFullYear() - FOUNDED,
      suffix: '+',
      label: 'Years of Legacy',
      note: 'Serving education since 1916',
    },
    {
      to: 31,
      suffix: '+',
      label: 'Institutes',
      note: 'Schools, colleges and hostels',
    },
    {
      to: 5,
      unit: 'Lakh',
      suffix: '+',
      label: 'Alumni',
      note: 'Carrying the CES legacy forward',
    },
    {
      to: 8,
      suffix: '',
      label: 'Guinness World Records',
      note: 'Set in our centenary year',
    },
  ];

  /** What each counter shows right now - the final figures until the count-up starts. */
  readonly shown = signal<readonly number[]>(this.stats.map((s) => s.to));

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.shown.set(this.stats.map(() => 0));

      let frame = 0;
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / COUNT_MS);
            const eased = 1 - Math.pow(1 - p, 3); // fast, then settling on the figure
            this.shown.set(this.stats.map((s) => Math.round(s.to * eased)));
            if (p < 1) frame = requestAnimationFrame(step);
          };
          frame = requestAnimationFrame(step);
        },
        // Starts once the row's top edge is a little way up the screen. Not a visible-share
        // threshold: on a short screen (phone held sideways) the row can't be 30% on view.
        { rootMargin: '0px 0px -12% 0px' },
      );
      io.observe(this.figures().nativeElement);

      destroyRef.onDestroy(() => {
        io.disconnect();
        cancelAnimationFrame(frame);
      });
    });
  }

  format(n: number): string {
    return format.format(n);
  }
}
