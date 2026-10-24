import {
  afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, HostListener, inject,
  Injector, signal, untracked, viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LightboxService } from '../../core/services/lightbox.service';
import { LenisService } from '../../core/services/lenis.service';

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
/** Zoom buttons and +/- keys step by this factor. */
const ZOOM_STEP = 1.5;
/** Double-click / double-tap zooms to this. */
const TAP_ZOOM = 2.5;
/** Slideshow: how long each photo stays once it has loaded. */
const SLIDE_MS = 4000;
/** A drag at normal size longer than this (px) moves to the next / previous photo. */
const SWIPE_PX = 60;
/** A drag straight down longer than this (px) closes the viewer (phones). */
const CLOSE_PX = 110;
/** Pointer travel under this (px) still counts as a tap. */
const TAP_PX = 8;
/** Two taps within this (ms) are a double tap. */
const DOUBLE_TAP_MS = 300;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Gesture {
  kind: 'pan' | 'swipe' | 'pinch';
  startX: number;
  startY: number;
  panX: number;
  panY: number;
  /** Pinch: finger distance and zoom when the pinch began. */
  dist: number;
  zoom: number;
}

/**
 * The site-wide photo viewer, opened through {@link LightboxService} from any gallery.
 *
 * - Zoom: buttons, + / - / 0 keys, mouse wheel or trackpad pinch (towards the pointer),
 *   double-click / double-tap, and two-finger pinch on touch screens.
 * - Pan by dragging while zoomed; at normal size a drag sideways moves to the next / previous
 *   photo and a drag down closes the viewer.
 * - Rotate, slideshow, fullscreen, thumbnail strip, share (or copy link), download and open
 *   the original in a new tab.
 * - Keys: ← → Home End, Esc, R rotate, F fullscreen, Space slideshow.
 *
 * While open the page cannot scroll, focus stays inside the viewer, and it goes back to the
 * photo that opened it on close.
 */
@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lightbox.scss',
})
export class Lightbox {
  readonly lb = inject(LightboxService);
  private readonly doc = inject(DOCUMENT);
  private readonly lenis = inject(LenisService);
  private readonly injector = inject(Injector);

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly stage = viewChild<ElementRef<HTMLElement>>('stage');
  private readonly photo = viewChild<ElementRef<HTMLImageElement>>('photo');
  private readonly strip = viewChild<ElementRef<HTMLElement>>('strip');

  readonly current = computed(() => {
    const i = this.lb.index();
    return i === null ? null : (this.lb.items()[i] ?? null);
  });
  /** The current photo as a one-item list keyed by its index, so each photo gets a fresh <img>. */
  readonly shown = computed(() => {
    const i = this.lb.index();
    const it = this.current();
    return it && i !== null ? [{ ...it, key: i }] : [];
  });
  readonly many = computed(() => this.lb.items().length > 1);
  readonly position = computed(() => {
    const i = this.lb.index();
    return i === null || !this.many() ? '' : `${i + 1} / ${this.lb.items().length}`;
  });

  readonly zoom = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly rotation = signal(0);
  /** Shrinks a quarter-turned photo so it still fits the screen. */
  private readonly fitScale = signal(1);
  readonly dragging = signal(false);
  readonly loaded = signal(false);
  readonly broken = signal(false);
  readonly playing = signal(false);
  readonly thumbs = signal(true);
  readonly fullscreen = signal(false);
  readonly canFullscreen = signal(false);
  /** Short status note ("Image link copied"), '' when hidden. */
  readonly note = signal('');

  readonly zoomPercent = computed(() => `${Math.round(this.zoom() * 100)}%`);
  readonly transform = computed(
    () => `translate(${this.panX()}px, ${this.panY()}px) rotate(${this.rotation()}deg) scale(${this.zoom() * this.fitScale()})`,
  );
  readonly cursor = computed(() => (this.zoom() > 1 ? (this.dragging() ? 'grabbing' : 'grab') : 'zoom-in'));

  /** Shared look of the round toolbar buttons. */
  readonly btn =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 sm:h-9 sm:w-9 text-white transition-colors hover:bg-white/25 disabled:pointer-events-none disabled:opacity-35';
  /** The side arrows on the stage. */
  readonly arrow =
    'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:h-12 sm:w-12';

  private wasOpen = false;
  private returnFocus: HTMLElement | null = null;
  private bodyOverflow = '';
  private timer: ReturnType<typeof setTimeout> | undefined;
  private noteTimer: ReturnType<typeof setTimeout> | undefined;

  private readonly pointers = new Map<number, { x: number; y: number }>();
  private gesture: Gesture | null = null;
  private moved = false;
  private lastTap = { time: 0, x: 0, y: 0 };

  constructor() {
    // Open / close: lock the page, move focus in and back out.
    effect(() => {
      const open = this.lb.index() !== null;
      untracked(() => {
        if (open && !this.wasOpen) this.onOpen();
        else if (!open && this.wasOpen) this.onClose();
        this.wasOpen = open;
      });
    });

    // Every photo starts at normal size, upright, with the slideshow timer restarted.
    effect(() => {
      const i = this.lb.index();
      if (i === null) return;
      untracked(() => this.onShow(i));
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.timer);
      clearTimeout(this.noteTimer);
      if (this.wasOpen) this.onClose();
    });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  next(): void { this.lb.go((this.lb.index() ?? 0) + 1); }
  prev(): void { this.lb.go((this.lb.index() ?? 0) - 1); }
  go(i: number): void { this.lb.go(i); }
  close(): void { this.lb.close(); }

  // ── Zoom / rotate ───────────────────────────────────────────────────────────
  zoomIn(): void { this.zoomTo(this.zoom() * ZOOM_STEP); }
  zoomOut(): void { this.zoomTo(this.zoom() / ZOOM_STEP); }

  resetView(): void {
    this.zoom.set(1);
    this.panX.set(0);
    this.panY.set(0);
  }

  rotate(dir: 1 | -1): void {
    this.pause();
    this.rotation.update((r) => r + dir * 90);
    this.resetView();
    this.fit();
  }

  /**
   * Zoom to z keeping the point under (cx, cy) where it is - the stage centre when no point
   * is given. The photo sits centred in the stage, so a point's offset from the centre scales
   * with the zoom; the pan makes up the difference.
   */
  private zoomTo(z: number, cx?: number, cy?: number): void {
    const next = clamp(z, MIN_ZOOM, MAX_ZOOM);
    const prev = this.zoom();
    if (next === prev) return;
    this.pause();
    if (next === MIN_ZOOM) {
      this.resetView();
      return;
    }
    const k = next / prev;
    let ox = 0;
    let oy = 0;
    const stage = this.stage()?.nativeElement;
    if (stage && cx !== undefined && cy !== undefined) {
      const r = stage.getBoundingClientRect();
      ox = cx - (r.left + r.width / 2);
      oy = cy - (r.top + r.height / 2);
    }
    this.zoom.set(next);
    this.setPan(ox * (1 - k) + this.panX() * k, oy * (1 - k) + this.panY() * k);
  }

  /** Pan, kept so the zoomed photo cannot be dragged off the screen. */
  private setPan(x: number, y: number): void {
    const img = this.photo()?.nativeElement;
    const stage = this.stage()?.nativeElement;
    if (!img || !stage) return;
    const turned = this.rotation() % 180 !== 0;
    const scale = this.zoom() * this.fitScale();
    const w = (turned ? img.offsetHeight : img.offsetWidth) * scale;
    const h = (turned ? img.offsetWidth : img.offsetHeight) * scale;
    const mx = Math.max(0, (w - stage.clientWidth) / 2);
    const my = Math.max(0, (h - stage.clientHeight) / 2);
    this.panX.set(clamp(x, -mx, mx));
    this.panY.set(clamp(y, -my, my));
  }

  /** A quarter-turned photo swaps width and height - shrink it until it fits again. */
  private fit(): void {
    const img = this.photo()?.nativeElement;
    const stage = this.stage()?.nativeElement;
    if (!img || !stage || this.rotation() % 180 === 0 || !img.offsetWidth) {
      this.fitScale.set(1);
      return;
    }
    this.fitScale.set(Math.min(1, stage.clientWidth / img.offsetHeight, stage.clientHeight / img.offsetWidth));
  }

  onWheel(e: WheelEvent): void {
    e.preventDefault();
    // Trackpad pinch arrives as ctrl+wheel with small deltas; Firefox may count in lines.
    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    this.zoomTo(this.zoom() * Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.002)), e.clientX, e.clientY);
  }

  // ── Pointer: pan, swipe, pinch, tap ───────────────────────────────────────────
  onPointerDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Let the arrows and other buttons get their own click.
    if ((e.target as HTMLElement).closest('button, a')) return;
    this.stage()?.nativeElement.setPointerCapture?.(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) this.moved = false;
    this.begin();
    this.dragging.set(true);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId) || !this.gesture) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = this.gesture;

    if (g.kind === 'pinch') {
      const [a, b] = [...this.pointers.values()];
      if (!a || !b) return;
      this.moved = true;
      this.zoomTo(g.zoom * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }

    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (Math.hypot(dx, dy) > TAP_PX) this.moved = true;
    if (g.kind === 'pan') {
      this.setPan(g.panX + dx, g.panY + dy);
    } else if (this.moved) {
      // Normal size: the photo follows the finger, then snaps or moves on release.
      this.panX.set(dx);
      this.panY.set(Math.max(0, dy));
    }
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    const g = this.gesture;
    this.pointers.delete(e.pointerId);

    if (g?.kind === 'swipe' && this.pointers.size === 0) {
      const dx = e.clientX - g.startX;
      const dy = e.clientY - g.startY;
      this.panX.set(0);
      this.panY.set(0);
      if (this.many() && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? this.next() : this.prev();
      } else if (dy > CLOSE_PX && dy > Math.abs(dx) && e.pointerType !== 'mouse') {
        this.close();
      } else if (!this.moved) {
        this.tap(e);
      }
    } else if (g?.kind === 'pan' && this.pointers.size === 0 && !this.moved) {
      this.tap(e);
    }

    if (this.pointers.size) {
      this.begin(); // a pinch lost one finger - carry on panning with the other
    } else {
      this.gesture = null;
      this.dragging.set(false);
    }
  }

  /** Start the gesture that fits the fingers now down. */
  private begin(): void {
    const pts = [...this.pointers.values()];
    const [a, b] = pts;
    if (!a) return;
    if (b) {
      this.gesture = {
        kind: 'pinch', startX: 0, startY: 0, panX: 0, panY: 0,
        dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom: this.zoom(),
      };
    } else {
      this.gesture = {
        kind: this.zoom() > 1 ? 'pan' : 'swipe', startX: a.x, startY: a.y,
        panX: this.panX(), panY: this.panY(), dist: 0, zoom: this.zoom(),
      };
    }
  }

  /** A tap on the photo: a second one soon after toggles the zoom. A tap beside it closes. */
  private tap(e: PointerEvent): void {
    const onPhoto = e.target === this.photo()?.nativeElement;
    if (!onPhoto) {
      if (this.zoom() === 1) this.close();
      return;
    }
    const t = this.lastTap;
    const now = e.timeStamp;
    if (now - t.time < DOUBLE_TAP_MS && Math.hypot(e.clientX - t.x, e.clientY - t.y) < 30) {
      this.lastTap = { time: 0, x: 0, y: 0 };
      if (this.zoom() > 1) this.resetView();
      else this.zoomTo(TAP_ZOOM, e.clientX, e.clientY);
    } else {
      this.lastTap = { time: now, x: e.clientX, y: e.clientY };
    }
  }

  // ── Image events ────────────────────────────────────────────────────────────
  onLoad(): void {
    this.loaded.set(true);
    this.fit();
    this.schedule();
  }

  onError(): void {
    this.broken.set(true);
    this.schedule();
  }

  // ── Slideshow ───────────────────────────────────────────────────────────────
  togglePlay(): void {
    this.playing.update((p) => !p);
    if (this.playing()) {
      this.resetView();
      if (this.loaded() || this.broken()) this.schedule();
    } else {
      clearTimeout(this.timer);
    }
  }

  private pause(): void {
    if (!this.playing()) return;
    this.playing.set(false);
    clearTimeout(this.timer);
  }

  private schedule(): void {
    clearTimeout(this.timer);
    if (!this.playing() || !this.many()) return;
    this.timer = setTimeout(() => this.next(), SLIDE_MS);
  }

  // ── Fullscreen, share, download ───────────────────────────────────────────────
  toggleFullscreen(): void {
    if (this.doc.fullscreenElement) {
      this.doc.exitFullscreen?.().catch(() => {});
    } else {
      this.dialog()?.nativeElement.requestFullscreen?.().catch(() => {});
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.fullscreen.set(!!this.doc.fullscreenElement);
  }

  /** The phone's share sheet where there is one; otherwise copy the image link. */
  async share(): Promise<void> {
    const p = this.current();
    if (!p) return;
    if (typeof navigator.share === 'function') {
      navigator.share({ title: p.caption || 'CES gallery photo', url: p.src }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(p.src);
      this.flash('Image link copied');
    } catch {
      this.flash("Couldn't copy the link");
    }
  }

  /**
   * Save the current photo. A cross-origin `<a download>` is ignored by the browser (it just
   * navigates), so fetch the bytes and save a blob URL; open the photo in a new tab if the
   * media host blocks the read (CORS).
   */
  async download(): Promise<void> {
    const p = this.current();
    if (!p) return;
    this.flash('Downloading…');
    try {
      const res = await fetch(p.src);
      if (!res.ok) throw new Error('download failed');
      const url = URL.createObjectURL(await res.blob());
      const a = this.doc.createElement('a');
      a.href = url;
      a.download = this.filename(p.src);
      this.doc.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(p.src, '_blank', 'noopener');
    }
  }

  private filename(src: string): string {
    const clean = src.split('?')[0].split('#')[0];
    return clean.substring(clean.lastIndexOf('/') + 1) || 'ces-photo.jpg';
  }

  private flash(text: string): void {
    this.note.set(text);
    clearTimeout(this.noteTimer);
    this.noteTimer = setTimeout(() => this.note.set(''), 2200);
  }

  // ── Keyboard ────────────────────────────────────────────────────────────────
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (this.lb.index() === null || e.ctrlKey || e.metaKey || e.altKey) return;
    const handled = (() => {
      switch (e.key) {
        case 'Escape': this.close(); return true;
        case 'ArrowRight': this.next(); return true;
        case 'ArrowLeft': this.prev(); return true;
        case 'Home': this.go(0); return true;
        case 'End': this.go(this.lb.items().length - 1); return true;
        case '+': case '=': this.zoomIn(); return true;
        case '-': case '_': this.zoomOut(); return true;
        case '0': this.resetView(); return true;
        case 'r': case 'R': this.rotate(e.shiftKey ? -1 : 1); return true;
        case 'f': case 'F': if (this.canFullscreen()) this.toggleFullscreen(); return true;
        case ' ':
          // Space on a focused button presses it instead.
          if ((e.target as HTMLElement).closest?.('button, a')) return false;
          if (this.many()) this.togglePlay();
          return true;
        case 'Tab': return this.trapFocus(e.shiftKey);
        default: return false;
      }
    })();
    if (handled) e.preventDefault();
  }

  /** Keep Tab cycling inside the viewer. Returns true when it moved focus itself. */
  private trapFocus(back: boolean): boolean {
    const root = this.dialog()?.nativeElement;
    if (!root) return false;
    const focusable = [...root.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
      .filter((el) => el.offsetParent !== null);
    if (!focusable.length) return true;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.doc.activeElement;
    if (back && (active === first || !root.contains(active))) {
      last.focus();
      return true;
    }
    if (!back && (active === last || !root.contains(active))) {
      first.focus();
      return true;
    }
    return false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.lb.index() === null) return;
    this.fit();
    this.setPan(this.panX(), this.panY());
  }

  // ── Open / close / show ─────────────────────────────────────────────────────
  private onOpen(): void {
    this.returnFocus = this.doc.activeElement as HTMLElement | null;
    this.bodyOverflow = this.doc.body.style.overflow;
    this.doc.body.style.overflow = 'hidden';
    this.lenis.stop();
    this.canFullscreen.set(!!this.doc.fullscreenEnabled);
    // Thumbnails take room a phone screen does not have to spare - start with them off there.
    this.thumbs.set(!window.matchMedia('(max-width: 639px)').matches);
    afterNextRender(() => this.dialog()?.nativeElement.focus({ preventScroll: true }), { injector: this.injector });
  }

  private onClose(): void {
    clearTimeout(this.timer);
    this.playing.set(false);
    this.pointers.clear();
    this.gesture = null;
    this.dragging.set(false);
    this.note.set('');
    if (this.doc.fullscreenElement) this.doc.exitFullscreen?.().catch(() => {});
    this.doc.body.style.overflow = this.bodyOverflow;
    this.lenis.start();
    this.returnFocus?.focus?.({ preventScroll: true });
    this.returnFocus = null;
  }

  private onShow(i: number): void {
    clearTimeout(this.timer);
    this.resetView();
    this.rotation.set(0);
    this.fitScale.set(1);
    this.loaded.set(false);
    this.broken.set(false);

    // Warm the cache for the neighbours so next / previous appear at once.
    const items = this.lb.items();
    if (items.length > 1) {
      for (const j of [i + 1, i - 1]) {
        const it = items[(j + items.length) % items.length];
        if (it) new Image().src = it.src;
      }
    }

    afterNextRender(() => {
      this.strip()?.nativeElement
        .querySelector<HTMLElement>(`[data-i="${i}"]`)
        ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }, { injector: this.injector });
  }
}
