import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Embed is loaded on scroll, so autoplay starts as the section is reached rather
 * than burning a play on page load. `mute=1` is mandatory  browsers refuse to
 * autoplay a video with sound  and `playsinline=1` stops iOS Safari from
 * hijacking playback into native fullscreen.
 */
const VIDEO_SRC = 'https://www.youtube.com/embed/DwDjJQTHCMQ?autoplay=1&mute=1&playsinline=1&rel=0';

/** Fraction of the embed that must be on screen before it loads and plays. */
const PLAY_THRESHOLD = 0.35;

@Component({
  selector: 'app-expert-solution',
  imports: [RouterLink],
  templateUrl: './expert-solution.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './expert-solution.scss',
})
export class ExpertSolution implements OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observers: IntersectionObserver[] = [];

  constructor() {
    // Browser-only (IntersectionObserver) — keeps SSR safe.
    afterNextRender(() => this.armVideos());
  }

  ngOnDestroy(): void {
    this.observers.forEach((o) => o.disconnect());
  }

  /**
   * Arms each breakpoint's embed to load the first time it scrolls into view.
   * The variant hidden at the current breakpoint has no layout box, so it never
   * intersects and never costs a YouTube request.
   */
  private armVideos(): void {
    const frames =
      this.host.nativeElement.querySelectorAll<HTMLIFrameElement>('iframe[data-video]');

    frames.forEach((frame) => {
      let loaded = false;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && !loaded) {
              loaded = true;
              frame.src = VIDEO_SRC;
              io.disconnect();
            }
          }
        },
        { threshold: PLAY_THRESHOLD },
      );
      io.observe(frame);
      this.observers.push(io);
    });
  }
}
