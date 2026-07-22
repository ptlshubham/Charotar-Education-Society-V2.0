import { Component, ElementRef, ViewChild, afterNextRender, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

interface Slide {
  title: string;
  description: string;
  link: string;
  imageBg: string;
  imageLgBg: string;
}

@Component({
  selector: 'app-trusted-integrations',
  imports: [RouterLink],
  templateUrl: './trusted-integrations.html',
  styleUrl: './trusted-integrations.scss',
})
export class TrustedIntegrations implements OnDestroy {
  // Signal (not a plain field) so the [style.transform] binding stays consistent
  // within a change-detection pass  the autoplay setInterval mutating a plain
  // field mid-CD was throwing NG0100 ExpressionChangedAfterItHasBeenChecked.
  currentSlide = signal(0);

  slides: Slide[] = [
    {
      title: 'Trusted integrations across leading platforms',
      description: 'Connect Google Drive, Dropbox, Meta, LinkedIn, and more  sync your data and content without leaving ZarklyX.',
      link: '',
      imageBg: '/assets/images/trusted-integrations-bg.png',
      imageLgBg: '/assets/images/trusted-integrations-lg-bg.png',
    },
    {
      title: 'Seamless connection to your marketing toolstack',
      description: 'Connect with social media platforms, analytics, and CRM systems. Grow your audience organically with zero friction.',
      link: '',
      imageBg: '/assets/images/trusted-integrations-bg.png',
      imageLgBg: '/assets/images/trusted-integrations-lg-bg.png',
    },
    {
      title: 'Automate workflows and scale operations',
      description: 'Reduce manual tasks by scheduling updates, syncing data, and analyzing performance all in a single dashboard.',
      link: '',
      imageBg: '/assets/images/trusted-integrations-bg.png',
      imageLgBg: '/assets/images/trusted-integrations-lg-bg.png',
    },
  ];

  private readonly integrationNames = [
    'Google Drive',
    'Dropbox',
    'Facebook',
    'Google My Business',
    'Instagram',
    'LinkedIn',
    'Pinterest',
    'Threads',
    'WhatsApp',
    'X (Twitter)',
    'YouTube',
  ];

  private readonly integrationSlugs = [
    'drive',
    'dropbox',
    'facebook',
    'googlemybuisness',
    'instagram',
    'linkedin',
    'pinterest',
    'threads',
    'whatsapp',
    'x',
    'youtube',
  ];

  icons: { src: string; alt: string }[] = this.integrationSlugs.map((name, i) => ({
    src: `/assets/icons/${name}-trusted-integration.svg`,
    alt: `${this.integrationNames[i]} integration`,
  }));

  @ViewChild('marqueeTrack') marqueeTrack?: ElementRef<HTMLElement>;

  /** pixels/second  slower than the company-logos marquee */
  private readonly speed = 35;
  private autoplayInterval: any;
  private touchStartX = 0;

  // --- Draggable infinite icon marquee ---
  // Driven by a GSAP ticker (not a fixed tween) so the user can grab and drag it
  // while it still loops seamlessly; on release it resumes auto-scrolling from
  // wherever it was left. Position is wrapped into one set-width so it never ends.
  private marqueePos = 0;
  private marqueeSetWidth = 0;
  private marqueeDragging = false;
  private marqueeDragStartX = 0;
  private marqueeDragStartPos = 0;
  private resizeHandler?: () => void;

  private readonly marqueeTick = (_time: number, deltaTime: number): void => {
    const track = this.marqueeTrack?.nativeElement;
    if (!track || this.marqueeSetWidth === 0) return;
    // Auto-advance only when the user isn't dragging.
    if (!this.marqueeDragging) {
      this.marqueePos -= (this.speed * deltaTime) / 1000;
    }
    this.marqueePos = gsap.utils.wrap(-this.marqueeSetWidth, 0, this.marqueePos);
    gsap.set(track, { x: this.marqueePos });
  };

  constructor() {
    afterNextRender(() => {
      this.startMarquee();
      // this.startAutoplay(); // Disabled  swipe/dot-click only
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    gsap.ticker.remove(this.marqueeTick);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  // --- Icon marquee drag (pointer events: works for mouse, touch and pen) ---
  onIconPointerDown(event: PointerEvent): void {
    // Prevent the native image-drag gesture from swallowing the pointer stream.
    event.preventDefault();
    this.marqueeDragging = true;
    this.marqueeDragStartX = event.clientX;
    this.marqueeDragStartPos = this.marqueePos;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  onIconPointerMove(event: PointerEvent): void {
    if (!this.marqueeDragging) return;
    // Update the raw position; the ticker wraps it and paints the track.
    this.marqueePos = this.marqueeDragStartPos + (event.clientX - this.marqueeDragStartX);
  }

  onIconPointerUp(): void {
    this.marqueeDragging = false;
  }

  setSlide(index: number): void {
    this.currentSlide.set(index);
    this.resetAutoplay();
  }

  nextSlide(): void {
    this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
  }

  prevSlide(): void {
    this.currentSlide.set((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = this.touchStartX - touchEndX;
    // Swipe threshold of 50px
    if (deltaX > 50) {
      this.nextSlide();
      this.resetAutoplay();
    } else if (deltaX < -50) {
      this.prevSlide();
      this.resetAutoplay();
    }
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = undefined;
    }
  }

  private resetAutoplay(): void {
    this.startAutoplay();
  }

  private startMarquee(): void {
    const track = this.marqueeTrack?.nativeElement;
    if (!track) return;

    // Track holds the icon set twice back-to-back; wrapping the x position into
    // exactly one set-width makes the loop seamless in both scroll and drag.
    // Each icon has a fixed CSS width, so scrollWidth is stable without waiting
    // for image decode  but recompute on resize since icon size/margins change
    // across breakpoints.
    this.marqueeSetWidth = track.scrollWidth / 2;
    gsap.ticker.add(this.marqueeTick);

    this.resizeHandler = () => {
      const t = this.marqueeTrack?.nativeElement;
      if (t) this.marqueeSetWidth = t.scrollWidth / 2;
    };
    window.addEventListener('resize', this.resizeHandler);
  }
}
