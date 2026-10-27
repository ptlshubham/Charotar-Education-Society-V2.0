import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

/** How long a record stays in the centre before the next one slides in. */
const AUTOPLAY_MS = 5000;

/** A drag shorter than this (px) is a tap, not a swipe. */
const SWIPE_PX = 40;

/** Size of a slide by its distance from the centre: the centre full size, smaller step by step outwards. */
const SCALES = [1, 0.8, 0.66, 0.56];
const scaleAt = (k: number) => SCALES[Math.min(k, SCALES.length - 1)];

/**
 * "Our World Records" - a looping slider of the 8 Guinness World Records, each its circular photo
 * with the text under it: the current record large in the centre ("01 / 08"), its neighbours
 * smaller and faded beside it and the next ones peeking at the edges. It autoplays (paused while
 * hovered / focused, off for reduced motion); a swipe, the arrow keys or a tap on a side record
 * move it too.
 *
 * The slides are stacked in one grid cell and each is placed by its offset from the centre, so
 * the row loops without cloned slides. Autoplay runs only in the browser (afterNextRender).
 */
@Component({
  selector: 'app-milestones',
  imports: [RouterLink],
  templateUrl: './milestones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './milestones.scss',
})
export class Milestones {
  private readonly destroyRef = inject(DestroyRef);

  readonly records: ReadonlyArray<{ title: string; image: string }> = [
    { title: 'Largest Quiz Competition', image: '/assets/images/home/Quiz.webp' },
    { title: 'Largest Sudoku Solving', image: '/assets/images/home/Sudoku.webp' },
    { title: 'Largest Mehndi Art', image: '/assets/images/home/Mahendi.webp' },
    { title: 'Maximum Arm-Link Activity', image: '/assets/images/home/ArmLinked.webp' },
    { title: 'Maximum T-Shirt Sign Campaign', image: '/assets/images/home/T-ShirtSignature.webp' },
    { title: 'Largest Kite Mosaic Display', image: '/assets/images/home/KiteMosaic.webp' },
    { title: 'Most Number of Signature Campaign', image: '/assets/images/home/Signature.webp' },
    { title: 'Longest Human Maths Equation', image: '/assets/images/home/HumanMathsEquation.webp' },
  ];

  /** The record in the centre. */
  readonly active = signal(0);

  /** Pointer over / focus inside the slider - autoplay waits. */
  private held = false;
  /** Autoplay runs in the browser only, and not for reduced motion. */
  private autoplay = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private dragX: number | null = null;
  private swiped = false;
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');

  constructor() {
    afterNextRender(() => {
      this.autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.schedule();
      // A swipe ends in a click on whatever was under the pointer - swallow it (capture phase, so
      // it never reaches a slide or the certificate link).
      this.stage()?.nativeElement.addEventListener('click', (e) => {
        if (!this.swiped) return;
        this.swiped = false;
        e.preventDefault();
        e.stopPropagation();
      }, true);
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  /** Where record i sits: 0 centre, ±1 beside it, ±3 at the edges - the short way round, so it loops. */
  offset(i: number): number {
    const n = this.records.length;
    let d = (i - this.active() + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  /**
   * Slide i's place. Each slide is --w wide at its SCALES size with a --g gap to the next, so the
   * step from one slide's centre to the next is half of each one's width plus the gap.
   */
  transform(i: number): string {
    const d = this.offset(i);
    if (d === 0) return `translateX(0) scale(${SCALES[0]})`;
    const a = Math.abs(d), s = Math.sign(d);
    let widths = 0;
    for (let k = 1; k <= a; k++) widths += (scaleAt(k - 1) + scaleAt(k)) / 2;
    return `translateX(calc(${(s * widths).toFixed(3)} * var(--w) + ${s * a} * var(--g))) scale(${scaleAt(a)})`;
  }

  go(i: number): void {
    const n = this.records.length;
    this.active.set(((i % n) + n) % n);
    this.schedule();
  }

  prev(): void { this.go(this.active() - 1); }
  next(): void { this.go(this.active() + 1); }

  hold(on: boolean): void { this.held = on; }

  /** Restart the autoplay countdown - after every move, so a tap never gets an instant follow-up. */
  private schedule(): void {
    clearTimeout(this.timer);
    if (!this.autoplay) return;
    this.timer = setTimeout(() => {
      if (this.held || document.hidden) this.schedule();
      else this.next();
    }, AUTOPLAY_MS);
  }

  dragStart(e: PointerEvent): void {
    this.dragX = e.clientX;
    this.swiped = false;
  }

  dragEnd(e: PointerEvent): void {
    if (this.dragX == null) return;
    const dx = e.clientX - this.dragX;
    this.dragX = null;
    if (Math.abs(dx) < SWIPE_PX) return;
    this.swiped = true;
    dx < 0 ? this.next() : this.prev();
  }

  /** A tap on a side card brings it to the centre. */
  pick(i: number): void {
    if (this.offset(i) !== 0) this.go(i);
  }

  /** "01" … "08" */
  pad(n: number): string { return String(n).padStart(2, '0'); }
}
