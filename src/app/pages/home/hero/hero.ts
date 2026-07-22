import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  signal,
  effect,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Hero implements OnInit, OnDestroy, AfterViewInit {
  readonly imageSlides = [
    { mobile: '/assets/images/hero-img1.webp', lg: '/assets/images/hero-lg-img1.webp', alt: 'ZarklyX dashboard showing every client in one view' },
    { mobile: '/assets/images/hero-img2.webp', lg: '/assets/images/hero-lg-img2.webp', alt: 'ZarklyX social media scheduling calendar' },
    { mobile: '/assets/images/hero-img3.webp', lg: '/assets/images/hero-lg-img3.webp', alt: 'ZarklyX CRM and team management workspace' },
  ];

  current = signal(0);

  // ── Hero calendar card: current year / month and the week (Sun–Sat) containing today,
  //    with today highlighted. Computed once from the real date at load. ──
  private readonly today = new Date();
  readonly calYear = this.today.getFullYear();
  readonly calMonth = this.today.toLocaleString('en-US', { month: 'short' });
  readonly weekDays = this.buildWeek();

  // Floating task/event cards show live dates (format "D MMM"), spread around today so they
  // always read as current: an event today, and two task due-dates a few days out.
  readonly eventDate = this.fmtDate(0);
  readonly onboardingDue = this.fmtDate(4);
  readonly invoiceDue = this.fmtDate(11);

  private fmtDate(offsetDays: number): string {
    const d = new Date(this.today);
    d.setDate(this.today.getDate() + offsetDays);
    return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}`;
  }

  private buildWeek(): Array<{ letter: string; day: number; isToday: boolean; inMonth: boolean; isSunday: boolean }> {
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const start = new Date(this.today);
    start.setDate(this.today.getDate() - this.today.getDay()); // rewind to Sunday
    const month = this.today.getMonth();
    return letters.map((letter, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        letter,
        day: d.getDate(),
        isToday: d.getDate() === this.today.getDate() && d.getMonth() === month && d.getFullYear() === this.calYear,
        inMonth: d.getMonth() === month,
        isSunday: i === 0,
      };
    });
  }

  private timer: ReturnType<typeof setInterval> | undefined;
  private viewReady = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef<HTMLElement>,
  ) {
    effect(() => {
      const idx = this.current();
      if (this.viewReady) {
        this.animateCards(idx);
      }
    });
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.imageSlides.length < 2) return;

    // Auto-advancing crossfade is purely decorative  skip it for users who asked for less motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.timer = setInterval(() => {
      this.current.update(i => (i + 1) % this.imageSlides.length);
    }, 5000);
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.viewReady = true;
    this.animateCards(this.current());
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  private animateCards(activeIndex: number): void {
    const host = this.elRef.nativeElement;
    const isLg = window.matchMedia('(min-width: 1024px)').matches;

    // Image crossfade takes 1.2s  sync cards with it
    const fadeOutDuration = 0.6;
    const fadeInDelay = isLg ? 0.5 : 0.3; // Wait for image transition to start
    const fadeInDuration = isLg ? 0.8 : 0.5;
    const staggerDelay = isLg ? 0.15 : 0;

    for (let i = 0; i < this.imageSlides.length; i++) {
      const cards = Array.from(host.querySelectorAll<HTMLElement>(`[data-card-group="${i}"]`));

      if (i === activeIndex) {
        // Show active cards with staggered entrance
        cards.forEach((card, idx) => {
          gsap.killTweensOf(card);
          card.classList.remove('hidden');

          if (isLg) {
            gsap.fromTo(card,
              { opacity: 0, y: 20, scale: 0.95 },
              {
                opacity: 1, y: 0, scale: 1,
                duration: fadeInDuration,
                delay: fadeInDelay + (idx * staggerDelay),
                ease: 'power3.out',
              },
            );
          } else {
            gsap.fromTo(card,
              { opacity: 0 },
              {
                opacity: 1,
                duration: fadeInDuration,
                delay: fadeInDelay,
                ease: 'power2.out',
              },
            );
          }
        });
      } else {
        cards.forEach(card => {
          gsap.killTweensOf(card);

          if (isLg) {
            gsap.to(card, {
              opacity: 0, y: -10, scale: 0.97,
              duration: fadeOutDuration,
              ease: 'power2.in',
              onComplete: () => {
                card.classList.add('hidden');
                gsap.set(card, { y: 0, scale: 1 });
              },
            });
          } else {
            gsap.set(card, { opacity: 0 });
            card.classList.add('hidden');
          }
        });
      }

      // Handle lg-only cards
      if (isLg) {
        const lgCards = Array.from(host.querySelectorAll<HTMLElement>(`[data-card-group-lg="${i}"]`));
        lgCards.forEach((card, idx) => {
          gsap.killTweensOf(card);
          if (i === activeIndex) {
            card.classList.remove('hidden');
            gsap.fromTo(card,
              { opacity: 0, y: 20, scale: 0.95 },
              {
                opacity: 1, y: 0, scale: 1,
                duration: fadeInDuration,
                delay: fadeInDelay + ((cards.length + idx) * staggerDelay),
                ease: 'power3.out',
              },
            );
          } else {
            gsap.to(card, {
              opacity: 0, y: -10, scale: 0.97,
              duration: fadeOutDuration,
              ease: 'power2.in',
              onComplete: () => {
                card.classList.add('hidden');
                gsap.set(card, { y: 0, scale: 1 });
              },
            });
          }
        });
      }
    }
  }
}
