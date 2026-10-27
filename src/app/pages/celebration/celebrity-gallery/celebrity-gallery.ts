import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, Injector, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LightboxService } from '../../../core/services/lightbox.service';

/** How many photos show before "View full gallery". */
const PREVIEW = 8;

/**
 * "Celebration Gallery" - the Shatakotsav photo set. The first PREVIEW photos show; "View full
 * gallery" opens the rest in place. Any photo opens the site-wide viewer on the whole set.
 */
@Component({
  selector: 'app-celebrity-gallery',
  imports: [RouterLink],
  templateUrl: './celebrity-gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './celebrity-gallery.scss',
})
export class CelebrityGallery {
  private readonly lightbox = inject(LightboxService);
  private readonly injector = inject(Injector);

  /** Shatakotsav - the Centenary Celebration photo set (ported from the legacy site). */
  readonly images: readonly string[] = Array.from(
    { length: 47 },
    (_, i) => `/assets/images/celebration/shatakotsav/${String(i + 1).padStart(2, '0')}.webp`,
  );

  readonly showAll = signal(false);
  readonly shown = computed(() => (this.showAll() ? this.images : this.images.slice(0, PREVIEW)));

  /** Open the rest of the set, and move focus to the first photo that just appeared. */
  expand(): void {
    this.showAll.set(true);
    afterNextRender(() => document.getElementById(`gallery-photo-${PREVIEW}`)?.focus(), { injector: this.injector });
  }

  /** Open the site-wide viewer on photo i of the full set. */
  open(index: number): void {
    this.lightbox.open(
      this.images.map((src, i) => ({ src, caption: `Centenary Celebration - Photo ${i + 1}` })),
      index,
    );
  }
}
