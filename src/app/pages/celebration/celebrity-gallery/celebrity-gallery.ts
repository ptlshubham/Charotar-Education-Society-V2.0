import { ChangeDetectionStrategy, Component, computed, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';

@Component({
  selector: 'app-celebrity-gallery',
  imports: [RouterLink, Pagination],
  templateUrl: './celebrity-gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './celebrity-gallery.scss',
})
export class CelebrityGallery {
  /** Shatakotsav — the Centenary Celebration photo set (ported from the legacy site). */
  readonly images: readonly string[] = Array.from(
    { length: 47 },
    (_, i) => `/assets/images/celebration/shatakotsav/${String(i + 1).padStart(2, '0')}.jpg`,
  );

  /** Static source wrapped in a signal so the shared Paginator can page it. */
  private readonly imagesSignal = signal(this.images);
  readonly pager = new Paginator(this.imagesSignal, 16);

  // ── Lightbox (zoom / pan / download / prev-next) ──────────────────────────
  readonly lightboxIndex = signal<number | null>(null);
  readonly zoom = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly dragging = signal(false);

  private dragStartX = 0;
  private dragStartY = 0;
  private panStartX = 0;
  private panStartY = 0;

  readonly current = computed(() => {
    const i = this.lightboxIndex();
    if (i === null) return null;
    const src = this.images[i];
    return src ? { src, caption: `Centenary Celebration — Photo ${i + 1}` } : null;
  });

  readonly lightboxPosition = computed(() => {
    const i = this.lightboxIndex();
    return i === null ? '' : `${i + 1} / ${this.images.length}`;
  });

  readonly zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);

  open(index: number): void {
    if (index < 0 || index >= this.images.length) return;
    this.lightboxIndex.set(index);
    this.resetZoom();
  }

  close(): void {
    this.lightboxIndex.set(null);
    this.resetZoom();
  }

  next(): void {
    const n = this.images.length;
    const i = this.lightboxIndex();
    if (i === null || !n) return;
    this.lightboxIndex.set((i + 1) % n);
    this.resetZoom();
  }

  prev(): void {
    const n = this.images.length;
    const i = this.lightboxIndex();
    if (i === null || !n) return;
    this.lightboxIndex.set((i - 1 + n) % n);
    this.resetZoom();
  }

  zoomIn(): void {
    this.zoom.set(Math.min(4, +(this.zoom() + 0.5).toFixed(2)));
  }

  zoomOut(): void {
    const z = Math.max(1, +(this.zoom() - 0.5).toFixed(2));
    this.zoom.set(z);
    if (z === 1) {
      this.panX.set(0);
      this.panY.set(0);
    }
  }

  resetZoom(): void {
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  toggleZoom(): void {
    if (this.zoom() > 1) this.resetZoom();
    else this.zoom.set(2);
  }

  onWheel(e: WheelEvent): void {
    e.preventDefault();
    if (e.deltaY < 0) this.zoomIn();
    else this.zoomOut();
  }

  onPointerDown(e: PointerEvent): void {
    if (this.zoom() <= 1) return;
    this.dragging.set(true);
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.panStartX = this.panX();
    this.panStartY = this.panY();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging()) return;
    this.panX.set(this.panStartX + (e.clientX - this.dragStartX));
    this.panY.set(this.panStartY + (e.clientY - this.dragStartY));
  }

  onPointerUp(): void {
    this.dragging.set(false);
  }

  async download(): Promise<void> {
    const p = this.current();
    if (!p) return;
    try {
      const res = await fetch(p.src);
      if (!res.ok) throw new Error('download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename(p.src);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(p.src, '_blank', 'noopener');
    }
  }

  private filename(src: string): string {
    const clean = src.split('?')[0].split('#')[0];
    const name = clean.substring(clean.lastIndexOf('/') + 1);
    return name || 'ces-centenary.jpg';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightboxIndex() !== null) this.close();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.lightboxIndex() !== null) this.next();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.lightboxIndex() !== null) this.prev();
  }
}
