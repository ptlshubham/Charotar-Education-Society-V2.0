import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

interface Slide {
  label: string;
  image: string;
}

const OFFSET_X = 440;
const SIDE_SCALE = 0.78;
const SIDE_OPACITY = 0.4;

@Component({
  selector: 'app-choose-zarklyx',
  imports: [CommonModule, RouterLink],
  templateUrl: './choose-zarklyx.html',
  styleUrl: './choose-zarklyx.scss',
})
export class ChooseZarklyx implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  slides: Slide[] = [
    { label: 'CRM & Sales', image: '/assets/images/choose-zarklyx/crm.png' },
    { label: 'Client Management', image: '/assets/images/choose-zarklyx/client-management.png' },
    { label: 'Project Management', image: '/assets/images/choose-zarklyx/project-management.png' },
    { label: 'Social Media Management', image: '/assets/images/choose-zarklyx/social-media-management.png' },
    { label: 'HR & Attendance', image: '/assets/images/choose-zarklyx-slider2.png' },
    { label: 'Payroll', image: '/assets/images/choose-zarklyx-slider1.png' },
    { label: 'Accounting & Invoicing', image: '/assets/images/choose-zarklyx/accounting.png' },
    { label: 'SEO & Analytics', image: '/assets/images/choose-zarklyx-slider1.png' },
    { label: 'Inventory', image: '/assets/images/choose-zarklyx-slider2.png' },
    { label: 'IT Management', image: '/assets/images/choose-zarklyx-slider1.png' },
    { label: 'Employee Management', image: '/assets/images/choose-zarklyx-slider2.png' },
    { label: 'Cloud Storage', image: '/assets/images/choose-zarklyx-slider1.png' },
    { label: 'Daily Work', image: '/assets/images/choose-zarklyx-slider2.png' },
    { label: 'Token & Queue', image: '/assets/images/choose-zarklyx-slider1.png' },
    { label: 'Influencer Management', image: '/assets/images/choose-zarklyx-slider2.png' },
  ];

  /** Constant starting slide for SSR first paint. */
  readonly initialIndex = 4;

  activeIndex = signal(this.initialIndex);

  /** The tab strip is rendered as 3 back-to-back copies of `slides` so that,
   *  no matter which module is centered, there are always more tabs on both
   *  sides  never a blank edge. We keep the centered tab inside the middle
   *  copy and silently snap back to it after each move (see normalizeTabPos). */
  displayTabs: Slide[] = [...this.slides, ...this.slides, ...this.slides];

  /** Index into `displayTabs` (0 .. 3n-1) of the currently centered tab. */
  private tabPos = this.slides.length + this.initialIndex;

  @ViewChildren('slideCard') slideCards!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('tabViewport') tabViewport?: ElementRef<HTMLElement>;
  @ViewChild('tabStrip') tabStrip?: ElementRef<HTMLElement>;
  @ViewChildren('tabItem') tabItems!: QueryList<ElementRef<HTMLElement>>;

  /** Hidden words scattered densely across the dark band; revealed by the
   *  cursor "torch". */
  torchWords = ChooseZarklyx.buildTorchWords();

  private static buildTorchWords(): { text: string; left: string; top: string }[] {
    const pool = [
      'Agency CRM',
      'Social Media Management',
      'HR & Payroll',
      'Client Portals',
      'Project Management',
      'SEO & Analytics',
      'Invoicing & Accounting',
      'All-in-One Platform',
    ];
    const topRows: { top: number; cols: number[] }[] = [
      { top: 10, cols: [78, 90] },
      { top: 28, cols: [72, 88] },
    ];
    const lowerRows: { top: number; cols: number[] }[] = [
      { top: 50, cols: [3, 27, 51] },
      { top: 64, cols: [15, 39, 63] },
      { top: 82, cols: [3, 27, 51] },
    ];

    const words: { text: string; left: string; top: string }[] = [];
    let k = 0;
    [...topRows, ...lowerRows].forEach(({ top, cols }) => {
      cols.forEach((left) => {
        words.push({ text: pool[k % pool.length], left: `${left}%`, top: `${top}%` });
        k++;
      });
    });
    return words;
  }

  private readonly torchRadius = 200;

  @ViewChild('torchLayer') torchLayer?: ElementRef<HTMLElement>;

  private resizeHandler: (() => void) | null = null;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initial layout after paint
      setTimeout(() => {
        this.layoutCards(false);
        this.layoutTabs(false);
      }, 50);

      this.slideCards.changes.subscribe(() => this.layoutCards(false));
      this.tabItems.changes.subscribe(() => {
        setTimeout(() => this.layoutTabs(false), 50);
      });

      // Re-layout tabs on resize (viewport width changes)
      this.resizeHandler = () => this.layoutTabs(false);
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  /** Shortest signed distance from `active` to card `i` around the ring, so the
   *  slide after the last wraps to the first (and vice versa) with no blank edge.
   *  e.g. with 15 slides, active=14, i=0 -> +1 (first slide sits to the right). */
  private circularOffset(i: number, active: number): number {
    const n = this.slides.length;
    let offset = i - active;
    if (offset > n / 2) offset -= n;
    else if (offset < -n / 2) offset += n;
    return offset;
  }

  // --- Static first-paint styles for cards (computed from initialIndex) ---
  cardTransform(i: number): string {
    const offset = this.circularOffset(i, this.initialIndex);
    return `translateX(${offset * OFFSET_X}px) scale(${offset === 0 ? 1 : SIDE_SCALE})`;
  }

  cardOpacity(i: number): number {
    const abs = Math.abs(this.circularOffset(i, this.initialIndex));
    return abs > 1 ? 0 : abs === 0 ? 1 : SIDE_OPACITY;
  }

  cardZ(i: number): number {
    const abs = Math.abs(this.circularOffset(i, this.initialIndex));
    return abs === 0 ? 30 : 20 - abs;
  }

  // --- Interaction ---
  /** Navigate to a logical slide index. Wraps out-of-range indices so the ring
   *  loops in both directions, and moves the tab strip to the nearest copy of
   *  the target so the slide never jumps across the whole strip. */
  select(index: number): void {
    const count = this.slides.length;
    const wrapped = ((index % count) + count) % count;
    if (wrapped === this.activeIndex()) return;
    this.tabPos = this.nearestTabPos(wrapped);
    this.activeIndex.set(wrapped);
    this.layoutCards(true);
    this.layoutTabs(true);
  }

  /** Click handler for a rendered tab: centers exactly that tab instance (which
   *  copy was clicked), then resolves to its logical slide. */
  selectTab(displayIndex: number): void {
    const logical = displayIndex % this.slides.length;
    if (logical === this.activeIndex()) return;
    this.tabPos = displayIndex;
    this.activeIndex.set(logical);
    this.layoutCards(true);
    this.layoutTabs(true);
  }

  /** Of the (up to 3) copies of `logical` in the tripled strip, the one closest
   *  to the currently-centered tab  keeps every move a short slide. */
  private nearestTabPos(logical: number): number {
    const n = this.slides.length;
    const candidates = [logical, logical + n, logical + 2 * n];
    let best = candidates[0];
    let bestDist = Infinity;
    for (const c of candidates) {
      const d = Math.abs(c - this.tabPos);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  }

  /** After an animated tab move, if the centered tab drifted out of the middle
   *  copy, jump instantly to the identical tab in the middle copy so there's
   *  always a full copy of buffer tabs on each side. Invisible (same content). */
  private normalizeTabPos(): void {
    const n = this.slides.length;
    let pos = this.tabPos;
    if (pos < n) pos += n;
    else if (pos >= 2 * n) pos -= n;
    else return;
    this.tabPos = pos;
    this.layoutTabs(false);
  }

  prev(): void {
    this.select(this.activeIndex() - 1);
  }

  next(): void {
    this.select(this.activeIndex() + 1);
  }

  // --- Swipe navigation (loops via select()) ---
  // Pointer events (not Touch events) so this also works with mouse-drag/trackpad on desktop.
  private pointerStartX = 0;
  private pointerDown = false;

  onPointerDown(event: PointerEvent): void {
    // Without this, dragging over an <img> triggers the browser's native
    // "drag the image out" gesture, which hijacks the pointer sequence and
    // swallows the pointerup  swipe would silently never fire.
    event.preventDefault();
    this.pointerDown = true;
    this.pointerStartX = event.clientX;
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.pointerDown) return;
    this.pointerDown = false;
    const deltaX = this.pointerStartX - event.clientX;
    // Swipe threshold of 50px
    if (deltaX > 50) {
      this.next();
    } else if (deltaX < -50) {
      this.prev();
    }
  }

  // --- Torch reveal ---
  onTorchMove(event: MouseEvent): void {
    const layer = this.torchLayer?.nativeElement;
    if (!layer) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    layer.style.setProperty('--torch-x', `${event.clientX - rect.left}px`);
    layer.style.setProperty('--torch-y', `${event.clientY - rect.top}px`);
    layer.style.setProperty('--torch-r', `${this.torchRadius}px`);
  }

  onTorchLeave(): void {
    this.torchLayer?.nativeElement.style.setProperty('--torch-r', '0px');
  }

  // --- GSAP-driven card coverflow layout ---
  private layoutCards(animate: boolean): void {
    const active = this.activeIndex();
    const cards = this.slideCards?.toArray() ?? [];

    cards.forEach((ref, i) => {
      const offset = this.circularOffset(i, active);
      const abs = Math.abs(offset);
      const isCenter = offset === 0;
      const el = ref.nativeElement;

      el.style.pointerEvents = abs > 1 ? 'none' : 'auto';

      gsap.to(el, {
        x: offset * OFFSET_X,
        scale: isCenter ? 1 : SIDE_SCALE,
        opacity: abs > 1 ? 0 : isCenter ? 1 : SIDE_OPACITY,
        zIndex: isCenter ? 30 : 20 - abs,
        duration: animate ? 0.6 : 0,
        ease: 'power3.out',
      });
    });
  }

  // --- GSAP-driven rotary tab strip layout ---
  private layoutTabs(animate: boolean): void {
    const strip = this.tabStrip?.nativeElement;
    const viewport = this.tabViewport?.nativeElement;
    const items = this.tabItems?.toArray() ?? [];
    if (!strip || !viewport || items.length === 0) return;

    const pos = this.tabPos;
    const viewportCenter = viewport.offsetWidth / 2;

    // Center the tab at `tabPos` (its rendered instance in the tripled strip)
    const centerEl = items[pos]?.nativeElement;
    if (!centerEl) return;

    const centerX = centerEl.offsetLeft + centerEl.offsetWidth / 2;
    const translateX = viewportCenter - centerX;

    // Animate the strip sliding (telephone-dial feel). Once an animated slide
    // finishes, snap the centered tab back into the middle copy so the strip
    // always has a full copy of buffer tabs on both sides  never a blank edge.
    gsap.to(strip, {
      x: translateX,
      duration: animate ? 0.55 : 0,
      ease: 'power2.inOut',
      onComplete: animate ? () => this.normalizeTabPos() : undefined,
    });

    // Animate tab text colors and opacity based on distance from the centered tab
    items.forEach((ref, i) => {
      const p = ref.nativeElement.querySelector('p');
      if (!p) return;

      const distance = Math.abs(i - pos);
      const isActive = distance === 0;

      // Tabs fade out as they get further from center
      // On mobile (narrow), this creates a nice focused look
      let tabOpacity = 1;
      if (distance === 1) tabOpacity = 0.7;
      else if (distance === 2) tabOpacity = 0.45;
      else if (distance >= 3) tabOpacity = 0.25;

      gsap.to(p, {
        color: isActive ? '#ffffff' : '#38CDB7',
        opacity: tabOpacity,
        scale: isActive ? 1.08 : 1,
        duration: animate ? 0.45 : 0,
        ease: 'power2.out',
      });
    });
  }
}
