import {
  Component, ViewChild, ElementRef,
  Inject, PLATFORM_ID, AfterViewInit
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import gsap from 'gsap';
import { SolutionsDropdown } from "./solutions-dropdown/solutions-dropdown.component";
import { FeaturesDropdown } from './features-dropdown/features-dropdown.component';
import { ResourcesDropdown } from './resources-dropdown/resources-dropdown.component';
import { LenisService } from '../../core/services/lenis.service';


@Component({
  selector: 'app-header',
  imports: [NgClass, RouterLink, RouterLinkActive, SolutionsDropdown, FeaturesDropdown, ResourcesDropdown],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  activeDropdown: string | null = null;
  activeMobileSection: string | null = null;
  mobileMenuOpen = false;

  /** Route prefixes that mark a dropdown tab as "active" for the current page. */
  private readonly tabRoutes: Record<string, string[]> = {
    solutions: ['/solutions'],
    features: ['/modules'],
    resources: ['/blogs', '/podcast', '/support', '/company'],
  };

  /** True when the current URL belongs to one of a tab's route prefixes. */
  tabActive(tab: string): boolean {
    const url = this.router.url;
    return (this.tabRoutes[tab] ?? []).some(prefix => url.startsWith(prefix));
  }

  /** True when the current URL starts with the given prefix (for direct links). */
  linkActive(prefix: string): boolean {
    return this.router.url.startsWith(prefix);
  }

  /** Expandable nav groups for the mobile / tablet menu */
  readonly mobileNav: ReadonlyArray<{ id: string; label: string; icon: string; links: { label: string; link: string }[] }> = [
    {
      id: 'solutions', label: 'Solutions', icon: 'grid', links: [
        { label: 'Enterprise', link: '/solutions/enterprise' },
        { label: 'Agencies', link: '/solutions/agencies' },
        { label: 'Small & Medium Business', link: '/solutions/small-medium-business' },
        { label: 'Professional Services', link: '/solutions/professional-services' },
        { label: 'Social Media Management', link: '/solutions/social-media-management' },
        { label: 'Social Insights', link: '/solutions/social-insights' },
        { label: 'Brand Awareness', link: '/solutions/brand-awareness' },
        { label: 'Industries', link: '/solutions/industries' },
      ],
    },
    {
      id: 'features', label: 'Features', icon: 'star', links: [
        { label: 'Project Management', link: '/modules/project-management' },
        { label: 'Social Media Management', link: '/modules/social-media-management' },
        { label: 'Token Management', link: '/modules/token-management' },
        { label: 'Pricing & Plans', link: '/pricing' },
      ],
    },
    {
      id: 'resources', label: 'Resources', icon: 'book', links: [
        { label: 'Blogs', link: '/blogs' },
        { label: 'Podcast', link: '/podcast' },
        { label: 'Newsroom', link: '/company/newsroom' },
        { label: 'Tutorials', link: '/support/tutorials' },
        { label: 'Help Center', link: '/support' },
        { label: 'Community', link: '/support/community' },
        { label: 'Expert Sessions', link: '/support/expert-sessions' },
      ],
    },
  ];

  /** Single-link nav items for the mobile / tablet menu */
  readonly mobileDirect: ReadonlyArray<{ label: string; link: string; icon: string; prefix: string; badge?: string }> = [
    { label: 'Integrations', link: '/integrations', icon: 'link', prefix: '/integrations' },
    { label: 'Pricing', link: '/pricing', icon: 'tag', prefix: '/pricing' },
  ];

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

  toggleDropdown(name: string): void {
    this.setActiveDropdown(this.activeDropdown === name ? null : name);
  }

  closeDropdown(): void {
    this.setActiveDropdown(null);
  }

  private setActiveDropdown(name: string | null): void {
    this.activeDropdown = name;
    if (!isPlatformBrowser(this.platformId)) return;
    if (name) {
      this.lenis.stop();
    } else {
      this.lenis.start();
    }
  }

  toggleMobileSection(name: string): void {
    this.activeMobileSection = this.activeMobileSection === name ? null : name;
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
