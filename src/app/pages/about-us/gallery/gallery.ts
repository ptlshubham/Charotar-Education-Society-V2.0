import {
  afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, HostListener, inject,
  Injector, signal, viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { LightboxService } from '../../../core/services/lightbox.service';
import { GalleryImage } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';

/** Photos in the strip - a fresh random pick from the whole gallery on every visit. */
const SHOWN = 10;

/** A mouse drag shorter than this (px) is still a click on the photo. */
const DRAG_PX = 6;
/** A flick carries the strip on by its release speed (px/ms) times this. */
const FLING_MS = 220;

interface Photo {
  /** Full image URL. */
  src: string;
  caption: string;
}

/** A new random order on every call (Fisher-Yates). */
function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * "Our Gallery" - a sideways strip of photos from Website Management → Gallery. Every visit
 * picks {@link SHOWN} at random, so a returning visitor sees a different set. A touch swipe, a
 * trackpad swipe, a mouse drag (with a flick) or the arrows move it, always coming to rest on a
 * photo; the gold bar and the "01 / 10" count follow the scroll. A photo opens in the site-wide
 * viewer, browsing the same set.
 *
 * Browser-only: the About page is prerendered, so a pick made at build time would freeze one
 * set for everyone. Shows a skeleton until loaded; hidden when the gallery has no photos.
 */
@Component({
  selector: 'app-gallery',
  imports: [RouterLink],
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery.scss',
})
export class Gallery {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly lightbox = inject(LightboxService);
  private readonly mediaUrl = new MediaUrlPipe();
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /** null while loading. */
  readonly photos = signal<readonly Photo[] | null>(null);
  readonly skeleton: readonly number[] = [0, 1, 2, 3, 4];

  /** How far the strip is scrolled: 0 at the start, 1 at the end. */
  private readonly progress = signal(0);
  readonly atStart = signal(true);
  readonly atEnd = signal(true);

  /** Mouse held and dragging the strip - grabbing cursor. */
  readonly grabbing = signal(false);
  /** Snap off while the strip follows the mouse and glides to rest. */
  readonly free = signal(false);
  /** Mouse drag in progress: where it began and how fast it is moving (px/ms). */
  private drag: { x: number; left: number; lastX: number; lastT: number; v: number } | null = null;
  /** The mouse moved far enough to be a swipe - the click that ends it must not open the viewer. */
  private swiped = false;
  private settleTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly count = computed(() => this.photos()?.length ?? 0);
  /** 1-based photo the scroll has reached - the last one once the end is in view. */
  readonly current = computed(() => Math.round(this.progress() * Math.max(this.count() - 1, 0)) + 1);
  /** Gold bar width (%): one photo's share at the start, the full line at the end. */
  readonly fill = computed(() => {
    const n = this.count();
    if (!n) return 0;
    return ((this.progress() * (n - 1) + 1) / n) * 100;
  });

  constructor() {
    afterNextRender(() =>
      this.institute
        .resolve()
        .pipe(
          switchMap((id) => this.resources.getGalleryImages(id)),
          timeout(8000),
          catchError(() => of<GalleryImage[]>([])),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe((list) => {
          // The endpoint mixes hero banners and videos in with the photos.
          const rows = (Array.isArray(list) ? list : []).filter((r) => r.purpose === 'image' && !!r.image);
          this.photos.set(
            shuffle(rows)
              .slice(0, SHOWN)
              .map((r) => ({
                src: this.mediaUrl.transform(r.image),
                caption: r.title?.trim() || 'Charotar Education Society gallery photograph',
              })),
          );
          afterNextRender(() => this.measure(), { injector: this.injector });
        }),
    );
    this.destroyRef.onDestroy(() => clearTimeout(this.settleTimer));
  }

  /** Read the strip's scroll position into the bar, the count and the arrows. */
  @HostListener('window:resize')
  measure(): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    this.progress.set(max > 1 ? Math.min(1, Math.max(0, left / max)) : 1);
    this.atStart.set(left <= 1);
    this.atEnd.set(left >= max - 1);
  }

  /** Scroll one photo along: to the next photo's left edge, or back to the previous one's. */
  step(dir: 1 | -1): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const left = el.scrollLeft;
    const starts = Array.from(el.children, (c) => (c as HTMLElement).offsetLeft);
    const target = dir > 0
      ? (starts.find((s) => s > left + 1) ?? el.scrollWidth)
      : (starts.reverse().find((s) => s < left - 1) ?? 0);
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
  }

  // ── Mouse drag-to-swipe (touch and pen already scroll the strip natively) ──
  onPointerDown(e: PointerEvent): void {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = this.track()?.nativeElement;
    if (!el) return;
    this.drag = { x: e.clientX, left: el.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    this.swiped = false;
  }

  onPointerMove(e: PointerEvent): void {
    const d = this.drag;
    const el = this.track()?.nativeElement;
    if (!d || !el) return;
    if (!(e.buttons & 1)) {
      this.drag = null; // released outside the strip before it became a swipe
      return;
    }
    const dx = e.clientX - d.x;
    if (!this.swiped) {
      if (Math.abs(dx) < DRAG_PX) return;
      this.swiped = true;
      this.grabbing.set(true);
      this.free.set(true);
      clearTimeout(this.settleTimer);
      el.setPointerCapture(e.pointerId);
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    el.scrollLeft = d.left - dx;
  }

  onPointerUp(e: PointerEvent): void {
    const d = this.drag;
    const el = this.track()?.nativeElement;
    this.drag = null;
    if (!d || !el || !this.swiped) return;
    this.grabbing.set(false);
    // A flick (mouse still moving at release) carries on its way; then rest on the nearest photo.
    const fling = e.timeStamp - d.lastT < 80 ? d.v * FLING_MS : 0;
    this.glide(this.nearest(el.scrollLeft - fling));
    // The click that ends a swipe is not a click on a photo - clear the flag after it.
    setTimeout(() => (this.swiped = false));
  }

  /** The photo start nearest to `left`; starts past the end count as the end. */
  private nearest(left: number): number {
    const el = this.track()?.nativeElement;
    if (!el) return 0;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.min(max, Math.max(0, left));
    let best = 0;
    for (const c of Array.from(el.children)) {
      const s = Math.min((c as HTMLElement).offsetLeft, max);
      if (Math.abs(s - x) < Math.abs(best - x)) best = s;
    }
    return best;
  }

  /**
   * Smooth-scroll to `left` with snap off, and turn snap back on once the strip is at rest -
   * switching it on mid-glide would make the browser jump to a snap point of its own.
   */
  private glide(left: number): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle = () => {
      el.removeEventListener('scrollend', settle);
      clearTimeout(this.settleTimer);
      this.free.set(false);
    };
    this.free.set(true);
    el.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    el.addEventListener('scrollend', settle);
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(settle, 1000); // no scrollend when it was already there
  }

  /** Open the site-wide viewer on photo i of this visit's set. */
  view(i: number): void {
    if (this.swiped) return;
    this.lightbox.open(this.photos() ?? [], i);
  }

  /** "01" … "10" */
  pad(n: number): string { return String(n).padStart(2, '0'); }
}
