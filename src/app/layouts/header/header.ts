import {
  Component,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { LenisService } from '../../core/services/lenis.service';
import { SearchService } from '../../core/services/search.service';
import { SOCIAL_LINKS } from '../../shared/social-links';
import { SearchItem } from '../../shared/models/models';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';
import { HeaderAds } from './header-ads/header-ads';

export interface NavItem {
  label: string;
  link?: string;
  icon?: IconKey;
  children?: NavItem[];
}

export type IconKey = keyof typeof ICONS;

/**
 * Feather-style 24×24 stroke paths, drawn by a single <svg> in the template.
 * Keys are reused across menu items on purpose - a shared visual vocabulary
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
  headset: [
    'M4 14v-2a8 8 0 1 1 16 0v2',
    'M4 13h1.5A1.5 1.5 0 0 1 7 14.5v3A1.5 1.5 0 0 1 5.5 19H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z',
    'M20 13h-1.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5H20a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z',
    'M20 19v.5a2.5 2.5 0 0 1-2.5 2.5H14',
  ],
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
  cap: ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5', 'M22 10v5'],
  user: ['M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  bulb: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7c.5.4.9 1 .9 1.6V17h6.2v-.7c0-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z'],
  sparkles: [
    'M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z',
    'M20 3v4M22 5h-4',
  ],
  utensils: ['M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2', 'M7 2v20', 'M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7'],
  sprout: [
    'M7 20h10',
    'M10 20c5.5-2.5.8-6.4 3-10',
    'M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z',
    'M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z',
  ],
  flame: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z'],
} as const;


@Component({
  selector: 'app-header',
  imports: [RouterLink, LanguageSwitcher, HeaderAds],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.scss',
  host: { '[class.header-condensed]': 'headerCondensed()' },
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Header implements AfterViewInit {
  mobileMenuOpen = false;
  readonly headerCondensed = signal(false);

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

  /** True on devices whose primary pointer can hover (desktop) - set in the browser. */
  private hoverCapable = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSvc = inject(SearchService);

  /** Which mobile accordion sections are expanded, keyed by label. */
  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /**
   * Which top-level desktop dropdown is open (by label), or null. Hover opens it;
   * clicking the same tab toggles it shut - a CSS-only hover/focus menu would stay
   * stuck open after a click (focus-within) with no way to click it closed.
   */
  readonly openMenu = signal<string | null>(null);
  readonly openSubmenu = signal<string | null>(null);

  /** Full nav tree - mirrors the live cesociety.in menu, including its third level. */
  readonly navLinks: ReadonlyArray<NavItem> = [
    { label: 'Home', link: '/home', icon: 'home' },
    {
      // Who the Society is today.
      label: 'About Us',
      icon: 'info',
      children: [
        { label: 'About CES', link: '/about', icon: 'info' },
        { label: 'CES at a Glance', link: '/about/profile', icon: 'file' },
        { label: 'Management', link: '/management', icon: 'users' },
      ],
    },
    {
      // Where it came from.
      label: 'Glory of CES',
      icon: 'award',
      children: [
        { label: 'Our History', link: '/about/history', icon: 'book' },
        { label: 'History of V. J. Patel', link: '/glory/history-vj', icon: 'user' },
      ],
    },
    {
      // The Society's festivals: two every year, and the centenary it has completed.
      label: 'Celebrations',
      icon: 'sparkles',
      children: [
        { label: 'Chatkaro', link: '/chatkaro', icon: 'utensils' },
        { label: 'Navratri Mahotsav', link: '/navratri', icon: 'flame' },
        { label: 'Centenary Celebration', link: '/celebration', icon: 'award' },
      ],
    },
    {
      // The Society's work beyond the classroom.
      label: 'Initiatives',
      icon: 'sprout',
      children: [
        { label: 'Projects', link: '/project', icon: 'bulb' },
        { label: 'Social Activity', link: '/social-activity', icon: 'heart' },
      ],
    },
    {
      label: 'Academic',
      icon: 'cap',
      children: [
        { label: 'Schools', link: '/academic/school', icon: 'building' },
        { label: 'Colleges', link: '/academic/colleges', icon: 'building' },
        { label: 'Others', link: '/academic/others', icon: 'grid' },
        { label: 'Hostels', link: '/academic/hostels', icon: 'bed' },
      ],
    },
    { label: 'Alumni', link: '/alumni', icon: 'users' },
    {
      label: 'Rahatokarsh Fund',
      icon: 'heart',
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
      icon: 'play',
      children: [
        { label: 'Gallery', link: '/glory/gallery', icon: 'image' },
        { label: 'Next UP', link: '/podcast', icon: 'play' },
      ],
    },
    { label: 'IP Cell', link: '/ipcell', icon: 'bulb' },
    {
      label: 'Student Corner',
      icon: 'user',
      children: [
        // 'Evaluation Form' (/more/student-evaluation) is not built yet; it is left
        // out rather than shipped as a nav item that 404s on every page.
        { label: 'Answer Key', link: '/student-corner/answer-key', icon: 'key' },
        { label: 'Magazine', link: '/student-corner/magazine', icon: 'book' },
        { label: 'Free Psychological Counselling', link: '/counselling', icon: 'heart' },
      ],
    },
    { label: 'Contact Us', link: '/contact', icon: 'headset' },
    {
      label: 'More',
      icon: 'grid',
      children: [
        { label: 'Blogs', link: '/blog', icon: 'news' },
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

  /** A top-level menu by its label, so the bars below survive menus being added or moved. */
  private nav(label: string): NavItem {
    const item = this.navLinks.find((n) => n.label === label);
    if (!item) throw new Error(`No top-level menu "${label}"`);
    return item;
  }

  readonly desktopNav: ReadonlyArray<NavItem> = [
    ...['Home', 'About Us', 'Glory of CES', 'Celebrations', 'Initiatives', 'Academic', 'Alumni', 'Rahatokarsh Fund', 'Media']
      .map((label) => this.nav(label)),
    this.nav('Student Corner'),
    this.nav('IP Cell'),
    {
      ...this.nav('More'),
      children: [
        ...(this.nav('More').children ?? []),
        { label: 'Contact Us', link: '/contact' },
        { label: 'RTI', link: '/support/disclosure-policy' },
        { label: 'Grievance', link: '/contact' },
      ],
    },
  ];

  /**
   * Inline items on the tablet nav bar (kept to five so they never overflow between
   * md and xl); everything else is reachable through the "More" drawer.
   */
  readonly tabletNav: ReadonlyArray<NavItem> = ['Home', 'About Us', 'Glory of CES', 'Initiatives', 'Academic'].map(
    (label) => this.nav(label),
  );

  readonly desktopSocials = ['Instagram', 'LinkedIn', 'Facebook', 'YouTube'].map(label => ({
    label,
    href: this.socials.find(social => social.label === label)?.href,
    asset: label === 'YouTube' ? null : `/assets/images/header/icons/${label.toLowerCase()}.svg`,
    path: this.socials.find(social => social.label === label)?.path,
  }));

  /** Quick-access icon links on the right of the brand bar. */
  readonly quickLinks: ReadonlyArray<{ label: string; short: string; link: string; icon: IconKey }> = [
    { label: 'News', short: 'News', link: '/more/news', icon: 'news' },
    { label: 'Free Psychological Counselling', short: 'Free Psychological Counselling', link: '/counselling', icon: 'headset' },
    { label: 'Events', short: 'Events', link: '/navratri', icon: 'calendar' },
    { label: 'Gallery', short: 'Gallery', link: '/glory/gallery', icon: 'image' },
  ];


  /** Extra links in the top utility strip. RTI/Grievance point at the nearest
   *  existing pages until dedicated ones are built. */
  readonly utilityLinks: ReadonlyArray<{ label: string; link?: string; href?: string }> = [
    { label: 'Careers', link: '/more/career' },
    { label: 'Tenders', link: '/more/tenders' },
    { label: 'RTI', link: '/support/disclosure-policy' },
    { label: 'Grievance', link: '/contact' },
    { label: 'ERP Login', href: 'https://dashboard.cesociety.in' },
  ];

  // ─── Universal site search ───

  readonly searchQuery = signal('');
  readonly searchOpen = signal(false);

  /** Shown in the empty search box so users know what they can jump to. */
  readonly suggestions: ReadonlyArray<{ title: string; link: string; icon: IconKey }> = [
    { title: 'About CES', link: '/about', icon: 'info' },
    { title: 'Schools', link: '/academic/school', icon: 'building' },
    { title: 'Colleges', link: '/academic/colleges', icon: 'building' },
    { title: 'Donate to Rahatokarsh Fund', link: '/donation', icon: 'heart' },
    { title: 'Navratri Celebration', link: '/navratri', icon: 'calendar' },
    { title: 'Answer Keys', link: '/student-corner/answer-key', icon: 'key' },
    { title: 'Photo Gallery', link: '/glory/gallery', icon: 'image' },
    { title: 'Careers', link: '/more/career', icon: 'briefcase' },
    { title: 'Contact Us', link: '/contact', icon: 'home' },
  ];

  /** Synonyms so queries like "donate", "results" or "jobs" reach the right page. */
  private static readonly KEYWORDS: Record<string, string> = {
    '/home': 'homepage main',
    '/about': 'about us history charotar education society motibhai amin legacy',
    '/about/profile': 'society profile fact sheet key facts quick facts brochure pdf download overview',
    '/management': 'trustees leaders chairman secretary committee board',
    '/celebration': 'centenary shatabdi shatakotsav hundred 100 years guinness world records glory celebration',
    '/glory/history-vj': 'history vitthalbhai vj patel vitthal kaka visionary founder freedom fighter teacher',
    '/social-activity': 'social activities initiatives camps community service',
    '/project': 'projects initiatives development',
    '/alumni': 'alumni former students register network',
    '/academic/school': 'schools primary secondary students education',
    '/academic/colleges': 'colleges degree graduation higher education',
    '/academic/hostels': 'hostel accommodation boarding rooms stay',
    '/academic/others': 'other institutes professional performing arts',
    '/fund': 'rahatokarsh fee refund fund objective financial help',
    '/donation': 'donate give contribute charity money support online payment',
    '/beneficiary-students': 'beneficiary students refund list support',
    '/donner-list': 'donors donor list donation records',
    '/micro-donner': 'micro donors small donation list',
    '/glory/gallery': 'gallery photos images pictures videos media',
    '/navratri': 'navratri garba festival celebration event mahotsav',
    '/chatkaro': 'chatkaro food festival skill fair alumni meet january millets gujarati mela event celebration',
    '/podcast': 'podcast next up video audio episodes',
    '/ipcell': 'ip cell intellectual property patents trademarks copyrights',
    '/student-corner/answer-key': 'answer key exam results papers standard',
    '/student-corner/magazine': 'magazine balmitra balanitra publication read pdf',
    '/counselling': 'counselling psychological mental health support free',
    '/contact': 'contact address phone email map location reach',
    '/blog': 'blog blogs articles news stories posts',
    '/more/gate-pass': 'gate pass e-gate visitor entry management office',
    '/more/tenders': 'tenders tender bid procurement notice',
    '/more/career': 'career careers jobs vacancy recruitment hiring apply work',
  };

  /** Flattened, de-duped index of every navigable page, built from the nav tree. */
  private readonly searchIndex: readonly SearchItem[] = this.buildSearchIndex();

  private buildSearchIndex(): SearchItem[] {
    const out: SearchItem[] = [];
    const add = (node: NavItem, category: string): void => {
      if (node.link) {
        out.push({ title: node.label, category, link: node.link, icon: node.icon, keywords: Header.KEYWORDS[node.link] ?? '' });
      }
      for (const child of node.children ?? []) add(child, category);
    };
    for (const top of this.navLinks) add(top, top.children ? top.label : 'Pages');
    const seen = new Set<string>();
    return out.filter(item => (seen.has(item.link) ? false : (seen.add(item.link), true)));
  }

  /** Up to 8 best matches - every query term must appear in title/category/keywords. */
  readonly searchResults = computed<SearchItem[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return [...this.searchIndex, ...this.searchSvc.dynamicIndex()]
      .map(item => ({ item, score: this.scoreItem(item, terms, q) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => r.item);
  });

  /** Matches grouped by nav category, for the panel's section headers. */
  readonly searchGroups = computed<{ category: string; items: SearchItem[] }[]>(() => {
    const groups: { category: string; items: SearchItem[] }[] = [];
    for (const item of this.searchResults()) {
      let group = groups.find(g => g.category === item.category);
      if (!group) groups.push((group = { category: item.category, items: [] }));
      group.items.push(item);
    }
    return groups;
  });

  private scoreItem(item: SearchItem, terms: string[], q: string): number {
    const title = item.title.toLowerCase();
    const hay = `${title} ${item.category.toLowerCase()} ${item.keywords}`;
    if (!terms.every(t => hay.includes(t))) return 0;
    return 1 + (title.includes(q) ? 5 : 0) + (title.startsWith(q) ? 5 : 0);
  }

  /** Start fetching the live index as soon as the box is focused. */
  onSearchFocus(): void {
    this.searchSvc.load();
    this.searchOpen.set(true);
  }

  onSearchInput(value: string): void {
    this.searchSvc.load();
    this.searchQuery.set(value);
    this.searchOpen.set(true);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchOpen.set(false);
  }

  /** Icon paths for a result - dynamic items carry the icon key as a plain string. */
  iconFor(key?: string): readonly string[] {
    return (this.icons as Record<string, readonly string[]>)[key ?? 'file'] ?? this.icons.file;
  }

  /** True when the current URL starts with the given prefix. */
  /** Whether the URL is this link's page or a page beneath it. */
  private matches(prefix: string): boolean {
    const path = this.router.url.split(/[?#]/)[0];
    if (prefix === '/home' && path === '/') return true;
    return path === prefix || path.startsWith(prefix + '/');
  }

  /**
   * The menu link for the current page: the longest one the URL falls under, so
   * /about/history marks "Our History" (Glory of CES) and not "About CES" as well.
   */
  private currentLink(): string | null {
    let best: string | null = null;
    const visit = (items: readonly NavItem[]): void => {
      for (const item of items) {
        if (item.link && this.matches(item.link) && (!best || item.link.length > best.length)) best = item.link;
        if (item.children) visit(item.children);
      }
    };
    visit(this.desktopNav);
    return best;
  }

  linkActive(link: string): boolean {
    return this.currentLink() === link;
  }

  /** True when the item itself, or any descendant, matches the current URL. */
  branchActive(item: NavItem): boolean {
    if (item.link && this.linkActive(item.link)) return true;
    return (item.children ?? []).some(child => this.branchActive(child));
  }

  /**
   * Which top-level tab receives the active colour. The homepage is
   * served at '/' (with '/home' redirecting to it), so the first (Home) item is
   * active there even though no child link literally starts with '/'.
   */
  activeTab(item: NavItem, first: boolean): boolean {
    if (first && this.linkActive('/home')) return true;
    return this.branchActive(item);
  }

  isExpanded(label: string): boolean {
    return this.expanded().has(label);
  }

  toggleExpanded(label: string): void {
    const next = new Set(this.expanded());
    next.has(label) ? next.delete(label) : next.add(label);
    this.expanded.set(next);
  }

  /**
   * Hover opens/closes, but only on pointer devices that actually hover. On touch
   * (`hover: none`), a tap fires mouseenter *and* click, which would open-then-close;
   * there we skip hover and let `toggleDropdown` own it.
   */
  onEnter(label: string): void {
    if (this.hoverCapable && this.openMenu() !== label) {
      this.openSubmenu.set(null);
      this.openMenu.set(label);
    }
  }

  onLeave(): void {
    if (this.hoverCapable) this.closeDropdown();
  }

  closeDropdown(): void {
    this.openSubmenu.set(null);
    this.openMenu.set(null);
  }

  /** Click toggles, so clicking the already-open tab closes it (mouse and touch). */
  toggleDropdown(label: string): void {
    this.openSubmenu.set(null);
    this.openMenu.update(current => (current === label ? null : label));
  }

  onSubmenuEnter(label: string): void {
    if (this.hoverCapable) this.openSubmenu.set(label);
  }

  onSubmenuLeave(): void {
    if (this.hoverCapable) this.openSubmenu.set(null);
  }

  toggleSubmenu(label: string): void {
    this.openSubmenu.update(current => current === label ? null : label);
  }

  @ViewChild('mobileSidebar') sidebarRef!: ElementRef<HTMLElement>;
  @ViewChild('mobileOverlay') overlayRef!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private lenis: LenisService,
  ) { }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.hoverCapable = window.matchMedia('(hover: hover)').matches;
    gsap.set(this.sidebarRef.nativeElement, { x: '100%' });
    gsap.set(this.overlayRef.nativeElement, { autoAlpha: 0 });
    this.lastUpdated.set(
      new Date(document.lastModified).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    );

    // Move the sticky host up by the two upper rows, preserving its flow height
    // so toggling the header never changes scrollY or causes a layout jump.
    const desktop = window.matchMedia('(min-width: 1280px)');
    let previousY = Math.max(0, window.scrollY);
    const resetHeader = () => {
      previousY = Math.max(0, window.scrollY);
      this.headerCondensed.set(desktop.matches && previousY > 104);
    };
    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY;
      if (!desktop.matches || currentY <= 8) {
        this.headerCondensed.set(false);
      } else {
        // Ignore tiny trackpad movements, but accumulate them until direction is clear.
        if (Math.abs(delta) < 6) return;
        if (delta < 0) this.headerCondensed.set(false);
        else if (currentY > 104) {
          this.headerCondensed.set(true);
          this.searchOpen.set(false);
        }
      }
      previousY = currentY;
    };
    resetHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    desktop.addEventListener('change', resetHeader);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
      desktop.removeEventListener('change', resetHeader);
    });

    // Close the search panel when clicking anywhere outside a search box.
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-search]')) this.searchOpen.set(false);
    };
    document.addEventListener('click', onDocClick);
    this.destroyRef.onDestroy(() => document.removeEventListener('click', onDocClick));
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
