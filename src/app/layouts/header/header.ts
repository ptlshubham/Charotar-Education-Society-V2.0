import {
  Component,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { LenisService } from '../../core/services/lenis.service';
import { SOCIAL_LINKS } from '../../shared/social-links';

export interface NavItem {
  label: string;
  link?: string;
  icon?: IconKey;
  children?: NavItem[];
}

export type IconKey = keyof typeof ICONS;

/**
 * Feather-style 24×24 stroke paths, drawn by a single <svg> in the template.
 * Keys are reused across menu items on purpose — a shared visual vocabulary
 * beats a bespoke glyph per link.
 */
export const ICONS = {
  home: ['M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z', 'M9 22V12h6v10'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4M12 8h.01'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
  ],
  award: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'],
  building: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2'],
  grid: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'],
  bed: ['M2 20v-8h20v8', 'M2 12V7M22 12V9a1 1 0 0 0-1-1h-9v4'],
  target: [
    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
    'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
    'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  ],
  heart: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
  list: ['M8 6h13M8 12h13M8 18h13', 'M3 6h.01M3 12h.01M3 18h.01'],
  image: [
    'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    'M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    'm21 15-5-5L5 21',
  ],
  calendar: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'],
  play: ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'm10 9 5 3-5 3z'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h6'],
  key: ['M8 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'm11.5 13.5 7-7', 'm16 6 3 3 2.5-2.5-3-3z'],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  news: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9h4', 'M10 6h8M10 10h8M10 14h4'],
  ticket: ['M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z', 'M13 5v2M13 11v2M13 17v2'],
  briefcase: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
} as const;


@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {
  mobileMenuOpen = false;

  readonly email = 'cesociety@cesociety.in';
  readonly phone = '02692 - 243083';
  readonly phoneHref = 'tel:02692-243083';

  readonly icons = ICONS;

  readonly socials = SOCIAL_LINKS;

  /**
   * Rendered only in the browser: the server would prerender a build-time date
   * and freeze it into the static HTML for every visitor.
   */
  readonly lastUpdated = signal('');

  /** Past the threshold the utility bar collapses, leaving brand + nav stuck to the top. */
  readonly scrolled = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  /** Which mobile accordion sections are expanded, keyed by label. */
  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /** Full nav tree — mirrors the live cesociety.in menu, including its third level. */
  readonly navLinks: ReadonlyArray<NavItem> = [
    {
      label: 'Home',
      children: [
        { label: 'Home', link: '/home', icon: 'home' },
        { label: 'About Us', link: '/about', icon: 'info' },
        { label: 'Management', link: '/management', icon: 'users' },
      ],
    },
    {
      label: 'Glory of CES',
      children: [{ label: 'Centenary Celebration', link: '/celebration', icon: 'award' }],
    },
    { label: 'Social Activity', link: '/social-activity' },
    { label: 'Project', link: '/project' },
    {
      label: 'Academic',
      children: [
        { label: 'Schools', link: '/academic/school', icon: 'building' },
        { label: 'Colleges', link: '/academic/colleges', icon: 'building' },
        { label: 'Others', link: '/academic/others', icon: 'grid' },
        { label: 'Hostels', link: '/academic/hostels', icon: 'bed' },
      ],
    },
    { label: 'Alumni', link: '/alumni' },
    {
      label: 'Rahatokarsh Fund',
      children: [
        { label: 'Objective', link: '/fund', icon: 'target' },
        { label: 'Donate Now', link: '/donation', icon: 'heart' },
        { label: 'Benificiary Student', link: '/beneficiary-students', icon: 'users' },
        { label: 'Donor List', link: '/donner-list', icon: 'list' },
        { label: 'Micro Donor List', link: '/micro-donner', icon: 'list' },
      ],
    },
    {
      label: 'Media',
      children: [
        { label: 'Gallery', link: '/glory/gallery', icon: 'image' },
        { label: 'Navratri', link: '/navratri', icon: 'calendar' },
        { label: 'Next UP', link: '/podcast', icon: 'play' },
      ],
    },
    { label: 'IP Cell', link: '/ipcell' },
    {
      label: 'Student Corner',
      children: [
        // 'Evaluation Form' (/more/student-evaluation) is not built yet; it is left
        // out rather than shipped as a nav item that 404s on every page.
        { label: 'Answer Key', link: '/more/answer-key', icon: 'key' },
        { label: 'Magazine', link: '/more/magazine', icon: 'book' },
        { label: 'Free Psychological Counselling', link: '/counselling', icon: 'heart' },
      ],
    },
    { label: 'Contact Us', link: '/contact' },
    {
      label: 'More',
      children: [
        { label: 'Blogs', link: '/home/blog', icon: 'news' },
        {
          label: 'Management',
          icon: 'users',
          children: [{ label: 'e-Gate Pass', link: '/more/gate-pass', icon: 'ticket' }],
        },
        { label: 'Tenders Hub', link: '/more/tenders', icon: 'file' },
        { label: 'Career', link: '/more/career', icon: 'briefcase' },
      ],
    },
  ];

  /** True when the current URL starts with the given prefix. */
  linkActive(prefix: string): boolean {
    return this.router.url.startsWith(prefix);
  }

  /** True when the item itself, or any descendant, matches the current URL. */
  branchActive(item: NavItem): boolean {
    if (item.link && this.linkActive(item.link)) return true;
    return (item.children ?? []).some(child => this.branchActive(child));
  }

  isExpanded(label: string): boolean {
    return this.expanded().has(label);
  }

  toggleExpanded(label: string): void {
    const next = new Set(this.expanded());
    next.has(label) ? next.delete(label) : next.add(label);
    this.expanded.set(next);
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
    this.lastUpdated.set(
      new Date(document.lastModified).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    );

    // Lenis scrolls the window for real, so the native scroll event still fires.
    const onScroll = () => this.scrolled.set(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
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
