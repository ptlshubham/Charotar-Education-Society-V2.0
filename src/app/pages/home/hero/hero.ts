import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Slide {
  image: string;
  /** First heading line (white). */
  lead: string;
  /** Second heading line (gold accent). */
  accent: string;
  blurb: string;
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Replace each `image` with real CES photography — see PLACEHOLDER.heroSlides. */
  readonly slides: readonly Slide[] = [
    {
      image: PLACEHOLDER.heroSlides[0],
      lead: 'Empowering Generations.',
      accent: 'Building Tomorrow.',
      blurb: 'A legacy of 110+ years in quality education through 31+ institutes across diverse domains.',
    },
    {
      image: PLACEHOLDER.heroSlides[1],
      lead: 'Education Rooted in Values.',
      accent: 'Growth Without Limits.',
      blurb: 'From pre-school to postgraduate study, a nurturing campus shapes character alongside knowledge.',
    },
    {
      image: PLACEHOLDER.heroSlides[2],
      lead: 'One Family. One Legacy.',
      accent: 'Since 1916.',
      blurb: 'Thousands of students, alumni and educators carrying forward a century of trusted, affordable learning.',
    },
  ];

  readonly active = signal(0);
  readonly current = computed(() => this.slides[this.active()]);

  private timer?: ReturnType<typeof setInterval>;
  private static readonly INTERVAL = 6000;

  readonly categories: readonly string[] = [
    'All Categories',
    'Schools',
    'Colleges',
    'Professional Institutes',
    'Hostels',
    'Courses',
  ];

  constructor() {
    // Autoplay is browser-only: setInterval must never run during SSR/prerender.
    if (this.isBrowser) {
      this.start();
      this.destroyRef.onDestroy(() => this.stop());
    }
  }

  select(i: number): void {
    this.active.set(i);
    this.restart();
  }

  next(): void {
    this.active.update((i) => (i + 1) % this.slides.length);
  }

  prev(): void {
    this.active.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  /** Pause on hover so a reader isn't yanked to the next slide mid-sentence. */
  start(): void {
    if (!this.isBrowser || this.timer) return;
    this.timer = setInterval(() => this.next(), Hero.INTERVAL);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private restart(): void {
    this.stop();
    this.start();
  }
}
