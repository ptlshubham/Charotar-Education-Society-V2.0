import {
  Component, AfterViewInit, OnDestroy, ViewChildren, QueryList,
  ElementRef, Inject, PLATFORM_ID, NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChildren('dodge') dodgeEls!: QueryList<ElementRef<HTMLElement>>;

  /** proximity radius (px) at which a chip starts fleeing */
  private readonly radius = 130;
  /** max distance (px) a chip is pushed away */
  private readonly maxPush = 64;

  /** rest centers in page coordinates (transform-independent) */
  private rests: { x: number; y: number }[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private rafId = 0;
  private queued = false;

  private onMove = (e: MouseEvent) => {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
    if (!this.queued) {
      this.queued = true;
      this.rafId = requestAnimationFrame(() => this.update());
    }
  };
  private onResize = () => this.measure();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // measure after layout settles
    requestAnimationFrame(() => this.measure());
    this.zone.runOutsideAngular(() => {
      window.addEventListener('mousemove', this.onMove, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
    });
  }

  /** cache each chip's resting centre in page coords (reset transforms first) */
  private measure(): void {
    this.rests = this.dodgeEls.map((ref) => {
      const el = ref.nativeElement;
      el.style.transform = '';
      const r = el.getBoundingClientRect();
      return {
        x: r.left + window.scrollX + r.width / 2,
        y: r.top + window.scrollY + r.height / 2,
      };
    });
  }

  private update(): void {
    this.queued = false;
    this.dodgeEls.forEach((ref, i) => {
      const rest = this.rests[i];
      if (!rest) return;
      const dx = rest.x - this.mouseX;
      const dy = rest.y - this.mouseY;
      const dist = Math.hypot(dx, dy);
      let nx = 0;
      let ny = 0;
      if (dist < this.radius && dist > 0.001) {
        const force = (this.radius - dist) / this.radius; // 0..1
        const push = force * this.maxPush;
        nx = (dx / dist) * push;
        ny = (dy / dist) * push;
      }
      ref.nativeElement.style.transform = `translate(${nx}px, ${ny}px)`;
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('mousemove', this.onMove);
    window.removeEventListener('resize', this.onResize);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
