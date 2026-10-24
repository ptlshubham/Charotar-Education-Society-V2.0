import { Injectable, signal } from '@angular/core';

/** One photo in the viewer. */
export interface LightboxItem {
  /** Full-size image URL - already resolved, not a relative media path. */
  src: string;
  /** Shown under the photo and used as its alt text. */
  caption?: string;
  /** Smaller image for the thumbnail strip; falls back to `src`. */
  thumb?: string;
}

/**
 * The site-wide photo viewer. Any gallery calls `open(photos, index)`; the single
 * <app-lightbox> in the main layout shows it full screen with zoom, pan, rotate,
 * slideshow, fullscreen, share and download.
 */
@Injectable({ providedIn: 'root' })
export class LightboxService {
  readonly items = signal<readonly LightboxItem[]>([]);
  /** Index of the photo on show, or null while closed. */
  readonly index = signal<number | null>(null);

  /** Open the viewer on `photos[index]`. Plain strings are taken as image URLs. */
  open(photos: readonly (LightboxItem | string)[], index = 0): void {
    const items = photos.map((p) => (typeof p === 'string' ? { src: p } : p));
    if (!items.length) return;
    this.items.set(items);
    this.index.set(Math.min(Math.max(index, 0), items.length - 1));
  }

  /** Show photo i (wraps around both ends). */
  go(i: number): void {
    const n = this.items().length;
    if (this.index() === null || !n) return;
    this.index.set(((i % n) + n) % n);
  }

  close(): void {
    this.index.set(null);
  }
}
