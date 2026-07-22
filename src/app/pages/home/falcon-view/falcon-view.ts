import {
  Component, ElementRef, ViewChild, AfterViewInit,
  OnDestroy, ChangeDetectorRef, inject, NgZone, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

interface ChipTooltipData {
  name: string;
  icon: string;
  points: string[];
  soon?: boolean;
}

@Component({
  selector: 'app-falcon-view',
  imports: [],
  templateUrl: './falcon-view.html',
  styleUrl: './falcon-view.scss',
})
export class FalconView implements AfterViewInit, OnDestroy {
  activeChipId: string | null = null;

  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  // Tooltip state (unused by template now, kept for compat)
  tooltipName = '';
  tooltipIcon = '';
  tooltipPoints: string[] = [];

  @ViewChild('lgTooltip') lgTooltip?: ElementRef<HTMLElement>;
  @ViewChild('mobileTooltip') mobileTooltip?: ElementRef<HTMLElement>;
  @ViewChild('falconSection') falconSection?: ElementRef<HTMLElement>;
  @ViewChild('lgChipsContainer') lgChipsContainer?: ElementRef<HTMLElement>;
  @ViewChild('mobileChipsContainer') mobileChipsContainer?: ElementRef<HTMLElement>;

  // Background wave layers (mobile)
  @ViewChild('bgLayer1') bgLayer1?: ElementRef<HTMLElement>;
  @ViewChild('bgLayer2') bgLayer2?: ElementRef<HTMLElement>;
  @ViewChild('bgLayer3') bgLayer3?: ElementRef<HTMLElement>;
  // Background wave layers (md/lg)
  @ViewChild('bgLayerLg1') bgLayerLg1?: ElementRef<HTMLElement>;
  @ViewChild('bgLayerLg2') bgLayerLg2?: ElementRef<HTMLElement>;
  @ViewChild('bgLayerLg3') bgLayerLg3?: ElementRef<HTMLElement>;
  private waveTimeline: gsap.core.Timeline | null = null;

  // Ordered chip names matching DOM order (same for mobile & lg containers)
  private chipNames = [
    'Project Management', 'Bills & Utility',
    'Influencers', 'Token & Queue',
    'SEO', 'Sales & Marketing',
    'Attendance', 'Payroll',
    'Client Management', 'Social Media',
    'Todo List', 'HRMS',
    'Daily Works', 'Accounting',
    'Reports & Analytics', 'Cloud Storage',
    'Inventory', 'Employee Management',
  ];

  private chipTooltipData: Record<string, ChipTooltipData> = {
    'Project Management': { name: 'Project Management', icon: '/assets/icons/first-panel-icon1.svg', points: ['Plan projects & milestones', 'Assign tasks & deadlines', 'Track progress in real time', 'Team collaboration & reports'] },
    'Bills & Utility': { name: 'Bills & Utility', icon: '/assets/icons/first-panel-icon2.svg', points: ['Manage utility bills & payments', 'Track billing cycles', 'Automated invoice generation', 'Monitor recurring expenses'], soon: true },
    'Influencers': { name: 'Influencers', icon: '/assets/icons/second-panel-icon1.svg', points: ['Discover & vet influencers', 'Manage collaborations', 'Track campaign performance', 'Automate influencer outreach'], soon: true },
    'Token & Queue': { name: 'Token & Queue', icon: '/assets/icons/second-panel-icon2.svg', points: ['Smart queue management', 'Real-time token tracking', 'Reduce customer wait times', 'Automated status notifications'] },
    'SEO': { name: 'SEO', icon: '/assets/icons/third-panel-icon1.svg', points: ['Keyword research & tracking', 'On-page SEO analysis', 'Monitor search rankings', 'Competitor & backlink insights'], soon: true },
    'Sales & Marketing': { name: 'Sales & Marketing', icon: '/assets/icons/third-panel-icon2.svg', points: ['Lead generation & capture', 'Multi-channel campaigns', 'Sales funnel tracking', 'ROI & conversion analytics'] },
    'Attendance': { name: 'Attendance', icon: '/assets/icons/fourth-panel-icon1.svg', points: ['Automated check-in / check-out', 'Leave & holiday management', 'Shift scheduling', 'Real-time attendance reports'], soon: true },
    'Payroll': { name: 'Payroll', icon: '/assets/icons/fourth-panel-icon2.svg', points: ['Automated salary processing', 'Tax & deduction calculations', 'Instant payslip generation', 'Statutory compliance'], soon: true },
    'Client Management': { name: 'Client Management', icon: '/assets/icons/fifth-panel-icon1.svg', points: ['Centralized client CRM', 'Communication history tracking', 'Contracts & document storage', 'Client insights & analytics'] },
    'Social Media': { name: 'Social Media', icon: '/assets/icons/fifth-panel-icon2.svg', points: ['Multi-platform post scheduling', 'Visual content calendar', 'Engagement & reach analytics', 'Automated publishing'], soon: true },
    'Todo List': { name: 'Todo List', icon: '/assets/icons/sixth-panel-icon1.svg', points: ['Create & organize tasks', 'Set priorities & deadlines', 'Collaborate with your team', 'Track task completion'] },
    'HRMS': { name: 'HRMS', icon: '/assets/icons/sixth-panel-icon2.svg', points: ['Employee onboarding & records', 'Performance reviews', 'HR document management', 'Workforce analytics'], soon: true },
    'Daily Works': { name: 'Daily Works', icon: '/assets/icons/seventh-panel-icon1.svg', points: ['Log daily tasks & activities', 'Track daily work progress', 'Team daily updates & summaries', 'Daily productivity reports'] },
    'Accounting': { name: 'Accounting', icon: '/assets/icons/seventh-panel-icon2.svg', points: ['Financial reporting', 'Expense & income tracking', 'Budgeting & forecasting', 'Tax-ready books'] },
    'Reports & Analytics': { name: 'Reports & Analytics', icon: '/assets/icons/eighth-panel-icon1.svg', points: ['Custom dashboards', 'Real-time data visualization', 'Automated reporting', 'Predictive business insights'], soon: true },
    'Cloud Storage': { name: 'Cloud Storage', icon: '/assets/icons/eighth-panel-icon2.svg', points: ['Secure cloud file storage', 'Team file collaboration', 'Version control & history', 'Access files anywhere'], soon: true },
    'Inventory': { name: 'Inventory', icon: '/assets/icons/ninth-panel-icon1.svg', points: ['Real-time stock tracking', 'Purchase & order management', 'Supplier management', 'Low-stock alerts & reports'] },
    'Employee Management': { name: 'Employee Management', icon: '/assets/icons/ninth-panel-icon2.svg', points: ['Central employee directory', 'Performance tracking', 'Training & development', 'Role & team management'] },
  };

  // ─── Auto-play state ───
  private autoTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private isUserHovering = false;
  private lastAutoIndex = -1;
  private activeAutoChipEl: HTMLElement | null = null;
  private isMobileAutoPlay = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Give the DOM a moment to fully paint before starting auto-play
      setTimeout(() => this.scheduleNextAuto(1000), 100);

      // Start the heartbeat wave animation on the 3 background layers
      setTimeout(() => this.initWaveAnimation(), 200);
    }
  }

  ngOnDestroy(): void {
    this.clearAutoTimer();
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.waveTimeline) {
      this.waveTimeline.kill();
      this.waveTimeline = null;
    }
    // Reset all bg layers to their CSS-defined positions
    const layers = [
      this.bgLayer1, this.bgLayer2, this.bgLayer3,
      this.bgLayerLg1, this.bgLayerLg2, this.bgLayerLg3,
    ];
    layers.forEach(ref => {
      if (ref?.nativeElement) {
        gsap.set(ref.nativeElement, { clearProps: 'all' });
      }
    });
  }

  /**
   * Creates a heartbeat/ripple wave animation on all bg layers.
   * Creates a smooth, wavy ripple animation on all bg layers.
   * Each layer gently breathes in/out with staggered timing for a
   * flowing, organic wave effect.
   */
  private initWaveAnimation(): void {
    // Kill any previous timeline
    if (this.waveTimeline) this.waveTimeline.kill();

    // Reset all layers to their CSS defaults before starting
    const allLayers = [
      this.bgLayer1, this.bgLayer2, this.bgLayer3,
      this.bgLayerLg1, this.bgLayerLg2, this.bgLayerLg3,
    ];
    allLayers.forEach(ref => {
      if (ref?.nativeElement) {
        gsap.set(ref.nativeElement, { clearProps: 'all' });
        // Let GSAP own the centering via xPercent/yPercent instead of the
        // CSS `-translate-x/y-1/2` classes. GSAP recalculates percent-based
        // transforms against the element's *current* size on every render,
        // so it self-corrects if the image's box size changes after load
        // (e.g. on a fast route re-entry before the image has settled).
        // If we let the scale tween bake the CSS translate into a fixed
        // pixel offset instead, that offset goes stale and the image drifts
        // off-center until a full page refresh recomputes it.
        gsap.set(ref.nativeElement, { xPercent: -50, yPercent: -50 });
      }
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });

    // Helper  creates a smooth wave across 3 layers
    const addWave = (l1: HTMLElement, l2: HTMLElement, l3: HTMLElement) => {
      tl.fromTo(l1,
        { scale: 1, opacity: 1 },
        { scale: 1.04, opacity: 0.9, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        0
      );

      tl.fromTo(l2,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.78, duration: 0.65, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        0.2
      );

      tl.fromTo(l3,
        { scale: 1, opacity: 1 },
        { scale: 1.08, opacity: 0.65, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: 1 },
        0.4
      );
    };

    // Mobile layers
    const m1 = this.bgLayer1?.nativeElement;
    const m2 = this.bgLayer2?.nativeElement;
    const m3 = this.bgLayer3?.nativeElement;
    if (m1 && m2 && m3) addWave(m1, m2, m3);

    // MD/LG layers
    const lg1 = this.bgLayerLg1?.nativeElement;
    const lg2 = this.bgLayerLg2?.nativeElement;
    const lg3 = this.bgLayerLg3?.nativeElement;
    if (lg1 && lg2 && lg3) addWave(lg1, lg2, lg3);

    this.waveTimeline = tl;
  }

  // ─── Helpers ───

  private isLgScreen(): boolean {
    return typeof window !== 'undefined' && window.innerWidth >= 1024;
  }

  private getActiveContainer(): HTMLElement | null {
    if (this.isLgScreen()) {
      return this.lgChipsContainer?.nativeElement ?? null;
    }
    return this.mobileChipsContainer?.nativeElement ?? null;
  }

  private getActiveTooltip(): HTMLElement | null {
    if (this.isLgScreen()) {
      return this.lgTooltip?.nativeElement ?? null;
    }
    return this.mobileTooltip?.nativeElement ?? null;
  }

  // Left-side chips are at even indices (0, 2, 4…), right-side at odd (1, 3, 5…)
  private isLeftChip(index: number): boolean {
    return index % 2 === 0;
  }

  // ─── Auto-play tooltip cycle ───

  private clearAutoTimer(): void {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private scheduleNextAuto(delayMs: number): void {
    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      this.ngZone.run(() => {
        if (!this.isUserHovering) {
          this.showRandomAutoTooltip();
        } else {
          // If user is hovering, try again later
          this.scheduleNextAuto(2000);
        }
      });
    }, delayMs);
  }

  private showRandomAutoTooltip(): void {
    if (this.isUserHovering) return;

    const container = this.getActiveContainer();
    if (!container) {
      this.scheduleNextAuto(2000);
      return;
    }

    const chipElements = container.querySelectorAll('.falcon-progress-dot');
    if (!chipElements.length) {
      this.scheduleNextAuto(2000);
      return;
    }

    // Pick a random chip different from the last one
    let index: number;
    do {
      index = Math.floor(Math.random() * this.chipNames.length);
    } while (index === this.lastAutoIndex && this.chipNames.length > 1);
    this.lastAutoIndex = index;

    const chipEl = chipElements[index] as HTMLElement;
    const chipName = this.chipNames[index];
    if (!chipEl || !chipName) {
      this.scheduleNextAuto(2000);
      return;
    }

    this.isMobileAutoPlay = !this.isLgScreen();

    // Scale chip first, then show tooltip after scale completes
    this.scaleChip(chipEl, () => {
      if (this.isUserHovering) return;

      if (this.isMobileAutoPlay) {
        // On mobile, also expand the chip name text
        const textContainer = chipEl.querySelector('.text-container') as HTMLElement;
        if (textContainer) {
          this.expandChip(textContainer);
        }
      }
      this.showTooltipForElement(chipEl, chipName, index);
    });

    // After 3.5 seconds, hide tooltip then chip (separate timer so it doesn't conflict)
    this.hideTimer = setTimeout(() => {
      if (!this.isUserHovering) {
        this.hideTooltip(() => {
          if (this.isMobileAutoPlay && this.activeAutoChipEl) {
            const textContainer = this.activeAutoChipEl.querySelector('.text-container') as HTMLElement;
            if (textContainer) {
              this.collapseChip(textContainer);
            }
          }
          this.unscaleChip();
          this.scheduleNextAuto(500);
        });
      }
    }, 3500);
  }

  // ─── Reusable tooltip show/hide ───

  private showTooltipForElement(chipEl: HTMLElement, chipName: string, chipIndex?: number): void {
    const data = this.chipTooltipData[chipName];
    if (!data) return;

    const tooltip = this.getActiveTooltip();
    const section = this.falconSection?.nativeElement;
    if (!tooltip || !section) return;

    // Directly set DOM content (bypasses Angular change detection)
    const titleEl = tooltip.querySelector('.tooltip-title');
    if (titleEl) titleEl.textContent = data.name;

    const soonEl = tooltip.querySelector('.tooltip-soon-badge') as HTMLElement;
    if (soonEl) soonEl.style.display = data.soon ? 'inline-flex' : 'none';

    const iconEl = tooltip.querySelector('.tooltip-icon') as HTMLImageElement;
    if (iconEl) iconEl.src = data.icon;

    const listEl = tooltip.querySelector('.tooltip-list');
    if (listEl) {
      listEl.innerHTML = data.points.map(p =>
        `<li class="flex items-start gap-1.5 text-[11px] text-[#555] leading-snug">
          <span class="w-1.5 h-1.5 rounded-full bg-[#3BAEA9] mt-1 shrink-0"></span>
          ${p}
        </li>`
      ).join('');
    }

    const chipRect = chipEl.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    if (chipRect.width === 0 || chipRect.height === 0) return;

    const bottomY = chipRect.bottom - sectionRect.top;

    if (this.isLgScreen()) {
      // LG: center tooltip below chip
      const centerX = chipRect.left - sectionRect.left + chipRect.width / 2;
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.left = `${centerX}px`;
    } else {
      // Mobile/MD: position based on left/right side
      const isLeft = chipIndex !== undefined ? this.isLeftChip(chipIndex) : (chipRect.left < sectionRect.left + sectionRect.width / 2);

      if (isLeft) {
        // Left chip → tooltip aligns to left edge of chip
        tooltip.style.transform = 'none';
        tooltip.style.left = `${chipRect.left - sectionRect.left}px`;
      } else {
        // Right chip → tooltip aligns to right edge of chip
        tooltip.style.transform = 'none';
        const tooltipWidth = 200; // max-w-[200px]
        const rightEdge = chipRect.right - sectionRect.left;
        tooltip.style.left = `${Math.max(10, rightEdge - tooltipWidth)}px`;
      }
    }

    tooltip.style.top = `${bottomY}px`;
    tooltip.style.visibility = 'visible';

    const card = tooltip.querySelector('.tooltip-card') as HTMLElement;
    if (card) {
      gsap.killTweensOf(card);
      gsap.fromTo(card,
        { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    }
  }

  // ─── Chip scale effect for auto-play ───

  private scaleChip(chipEl: HTMLElement, onComplete?: () => void): void {
    this.activeAutoChipEl = chipEl;
    gsap.to(chipEl, {
      scale: 1.08,
      boxShadow: '0px 4px 14px 0px rgba(59, 174, 169, 0.4)',
      duration: 0.3,
      ease: 'power2.out',
      onComplete,
    });
  }

  private unscaleChip(): void {
    if (this.activeAutoChipEl) {
      gsap.to(this.activeAutoChipEl, {
        scale: 1,
        boxShadow: '0px 2.07px 4.13px 0px rgba(59, 174, 169, 0.25)',
        duration: 0.25,
        ease: 'power2.inOut',
      });
      this.activeAutoChipEl = null;
    }
  }

  private hideTooltip(onComplete?: () => void): void {
    // Find the visible tooltip (could be lg or mobile)
    const lgTip = this.lgTooltip?.nativeElement;
    const mobileTip = this.mobileTooltip?.nativeElement;
    const tooltip = lgTip?.style.visibility === 'visible' ? lgTip
      : mobileTip?.style.visibility === 'visible' ? mobileTip
      : null;

    if (!tooltip) {
      onComplete?.();
      return;
    }

    const card = tooltip.querySelector('.tooltip-card') as HTMLElement;
    if (card) {
      gsap.killTweensOf(card);
      gsap.to(card, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
        onComplete: () => {
          tooltip.style.visibility = 'hidden';
          onComplete?.();
        }
      });
    } else {
      onComplete?.();
    }
  }

  // ─── LG chip hover handlers ───

  onLgChipEnter(event: MouseEvent, chipName: string): void {
    this.isUserHovering = true;
    this.clearAutoTimer();
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.unscaleChip();

    this.showTooltipForElement(event.currentTarget as HTMLElement, chipName);
  }

  onLgChipLeave(): void {
    this.isUserHovering = false;

    this.hideTooltip(() => {
      this.scheduleNextAuto(1500);
    });
  }

  // ─── Mobile chip click toggle ───

  toggleChip(chipId: string, event: MouseEvent): void {
    event.stopPropagation();

    // Stop auto-play when user manually clicks
    this.isUserHovering = true;
    this.clearAutoTimer();
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    // Clean up any auto-play chip state
    if (this.activeAutoChipEl) {
      const autoText = this.activeAutoChipEl.querySelector('.text-container') as HTMLElement;
      if (autoText) {
        gsap.killTweensOf(autoText);
        autoText.style.width = '0px';
        autoText.style.opacity = '0';
      }
      gsap.killTweensOf(this.activeAutoChipEl);
      this.activeAutoChipEl.style.transform = '';
      this.activeAutoChipEl.style.boxShadow = '';
      this.activeAutoChipEl = null;
    }
    this.hideTooltip();

    const clickedElement = event.currentTarget as HTMLElement;
    const textContainer = clickedElement.querySelector('.text-container') as HTMLElement;
    if (!textContainer) return;

    // If clicking the currently active chip, collapse it and resume auto-play
    if (this.activeChipId === chipId) {
      this.collapseChip(textContainer);
      this.activeChipId = null;
      clickedElement.classList.remove('active');
      // Hide tooltip and resume auto-play
      this.hideTooltip(() => {
        this.isUserHovering = false;
        this.scheduleNextAuto(1500);
      });
      return;
    }

    // Collapse the previously active chip if there is one
    if (this.activeChipId) {
      const activeEl = document.querySelector('app-falcon-view .falcon-progress-dot.active .text-container') as HTMLElement;
      if (activeEl) {
        this.collapseChip(activeEl);
      }
      const activeDot = document.querySelector('app-falcon-view .falcon-progress-dot.active') as HTMLElement;
      if (activeDot) {
        activeDot.classList.remove('active');
      }
    }

    // Expand the clicked chip
    clickedElement.classList.add('active');
    this.expandChip(textContainer);
    this.activeChipId = chipId;

    // Derive chip index from chipId (format: 'pX-Y' → index = (X-1)*2 + (Y-1))
    const match = chipId.match(/p(\d+)-(\d+)/);
    if (match) {
      const chipIndex = (parseInt(match[1]) - 1) * 2 + (parseInt(match[2]) - 1);
      const chipName = this.chipNames[chipIndex];
      if (chipName) {
        // Small delay to let expand animation start, then show tooltip
        setTimeout(() => {
          this.showTooltipForElement(clickedElement, chipName, chipIndex);
        }, 200);
      }
    }
  }

  private expandChip(element: HTMLElement): void {
    element.style.width = 'auto';
    const targetWidth = element.scrollWidth;
    element.style.width = '0px';

    gsap.to(element, {
      width: targetWidth,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  private collapseChip(element: HTMLElement): void {
    gsap.to(element, {
      width: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }

  collapseActive(): void {
    if (this.activeChipId) {
      const activeEl = document.querySelector('app-falcon-view .falcon-progress-dot.active .text-container') as HTMLElement;
      if (activeEl) {
        this.collapseChip(activeEl);
      }
      const activeDot = document.querySelector('app-falcon-view .falcon-progress-dot.active') as HTMLElement;
      if (activeDot) {
        activeDot.classList.remove('active');
      }
      this.activeChipId = null;

      // Hide tooltip and resume auto-play
      this.hideTooltip(() => {
        this.isUserHovering = false;
        this.scheduleNextAuto(1500);
      });
    }
  }
}
