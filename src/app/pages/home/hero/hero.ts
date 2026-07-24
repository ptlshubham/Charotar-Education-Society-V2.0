import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  host: { '(document:keydown.escape)': 'closeVideo()' },
})
export class Hero {
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

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

  // ─── Campus video ───
  /** YouTube id of the CES film. Swap for a newer upload when there is one. */
  private static readonly VIDEO_ID = '_-ntpkeG7O4';

  readonly videoOpen = signal(false);

  /**
   * Built once. The iframe is only rendered while the modal is open, so this URL
   * is never requested on page load — and closing unmounts it, which stops
   * playback (there is no other way to stop an embed we don't control).
   */
  readonly videoUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.youtube-nocookie.com/embed/${Hero.VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`,
  );

  openVideo(): void {
    this.videoOpen.set(true);
    this.stop();            // don't advance slides behind the modal
    this.lockScroll(true);
  }

  closeVideo(): void {
    if (!this.videoOpen()) return;   // the Escape handler fires page-wide
    this.videoOpen.set(false);
    this.lockScroll(false);
    this.start();
  }

  private lockScroll(on: boolean): void {
    if (!this.isBrowser) return;
    this.document.body.style.overflow = on ? 'hidden' : '';
  }

  constructor() {
    // Autoplay is browser-only: setInterval must never run during SSR/prerender.
    if (this.isBrowser) {
      this.start();
      this.destroyRef.onDestroy(() => {
        this.stop();
        this.lockScroll(false);   // never leave the page unscrollable
      });
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
