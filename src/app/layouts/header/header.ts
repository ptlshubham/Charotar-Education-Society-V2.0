import {
  Component,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import gsap from 'gsap';
import { LenisService } from '../../core/services/lenis.service';

@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  mobileMenuOpen = false;

  /** Flat nav — shared by the desktop bar and the mobile sidebar. */
  readonly navLinks: ReadonlyArray<{ label: string; link: string }> = [
    { label: 'About', link: '/about' },
    { label: 'Team', link: '/team' },
    { label: 'Blogs', link: '/blogs' },
    { label: 'Careers', link: '/company/careers' },
    { label: 'Support', link: '/support' },
  ];

  /** True when the current URL starts with the given prefix. */
  linkActive(prefix: string): boolean {
    return this.router.url.startsWith(prefix);
  }

  @ViewChild('mobileSidebar') sidebarRef!: ElementRef<HTMLElement>;
  @ViewChild('mobileOverlay') overlayRef!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private lenis: LenisService,
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.set(this.sidebarRef.nativeElement, { x: '100%' });
    gsap.set(this.overlayRef.nativeElement, { autoAlpha: 0 });
  }

  openMobileMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.mobileMenuOpen = true;
    this.lenis.stop();
    gsap.to(this.overlayRef.nativeElement, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(this.sidebarRef.nativeElement, { x: 0, duration: 0.4, ease: 'power3.out' });
  }

  closeMobileMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.mobileMenuOpen = false;
    this.lenis.start();
    gsap.to(this.sidebarRef.nativeElement, { x: '100%', duration: 0.35, ease: 'power3.in' });
    gsap.to(this.overlayRef.nativeElement, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
  }
}
