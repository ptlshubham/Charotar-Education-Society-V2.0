import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-company-logos',
  imports: [],
  templateUrl: './company-logos.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './company-logos.scss',
})
export class CompanyLogos implements OnDestroy {
  logos: { src: string; alt: string }[] = [
    { src: '/assets/images/clients-logo/cyberngo.png', alt: 'CyberNGO' },
    { src: '/assets/images/clients-logo/ces.png', alt: 'Charotar Education Society' },
    { src: '/assets/images/clients-logo/eventure.png', alt: 'Eventure' },
    { src: '/assets/images/clients-logo/forenzy.png', alt: 'Forenzy' },
    { src: '/assets/images/clients-logo/keryar.png', alt: 'Keryar' },
    { src: '/assets/images/clients-logo/rayrak.png', alt: 'Rayrak' },
    { src: '/assets/images/clients-logo/rideit.png', alt: 'RideIt' },
  ];

  @ViewChild('marqueeTrack') marqueeTrack?: ElementRef<HTMLElement>;

  /** pixels/second  lower is slower */
  private readonly speed = 20;

  // --- Draggable infinite marquee (see trusted-integrations for the same pattern) ---
  // A GSAP ticker drives the position so the strip can be grabbed and dragged while
  // still looping seamlessly; on release it resumes auto-scrolling. Position is
  // wrapped into one set-width so it never ends.
  private marqueePos = 0;
  private marqueeSetWidth = 0;
  private marqueeDragging = false;
  private marqueeDragStartX = 0;
  private marqueeDragStartPos = 0;
  private tickerAdded = false;
  private resizeHandler?: () => void;

  private readonly marqueeTick = (_time: number, deltaTime: number): void => {
    const track = this.marqueeTrack?.nativeElement;
    if (!track || this.marqueeSetWidth === 0) return;
    if (!this.marqueeDragging) {
      this.marqueePos -= (this.speed * deltaTime) / 1000;
    }
    this.marqueePos = gsap.utils.wrap(-this.marqueeSetWidth, 0, this.marqueePos);
    gsap.set(track, { x: this.marqueePos });
  };

  constructor() {
    afterNextRender(() => this.startMarquee());
  }

  ngOnDestroy(): void {
    if (this.tickerAdded) gsap.ticker.remove(this.marqueeTick);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
  }

  // --- Drag (pointer events: mouse, touch and pen) ---
  onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.marqueeDragging = true;
    this.marqueeDragStartX = event.clientX;
    this.marqueeDragStartPos = this.marqueePos;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.marqueeDragging) return;
    this.marqueePos = this.marqueeDragStartPos + (event.clientX - this.marqueeDragStartX);
  }

  onPointerUp(): void {
    this.marqueeDragging = false;
  }

  private startMarquee(): void {
    const track = this.marqueeTrack?.nativeElement;
    if (!track) return;

    // The logos are still loading when afterNextRender fires, so track.scrollWidth
    // would read as (close to) 0. Wait for every <img> to finish loading before
    // measuring, raced against a timeout fallback so the marquee always starts even
    // if a single image fails to fire a clean load/error event.
    const images = Array.from(track.querySelectorAll('img'));
    const allLoaded = Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            }
          }),
      ),
    );
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1500));

    Promise.race([allLoaded, timeout]).then(() => {
      // The track holds the logo set twice back-to-back; wrapping the x position
      // into one set-width makes the loop seamless in both scroll and drag.
      this.marqueeSetWidth = track.scrollWidth / 2;
      gsap.ticker.add(this.marqueeTick);
      this.tickerAdded = true;

      this.resizeHandler = () => {
        const t = this.marqueeTrack?.nativeElement;
        if (t) this.marqueeSetWidth = t.scrollWidth / 2;
      };
      window.addEventListener('resize', this.resizeHandler);
    });
  }
}
