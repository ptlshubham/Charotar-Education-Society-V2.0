import {
  Component,
  ViewEncapsulation,
  signal,
  inject,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewsletterService } from '../../core/services/newsletter.service';

interface NavSection {
  title: string;
  icon: string;
  items: string[];
  open: boolean;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Footer {
  currentYear = new Date().getFullYear();

  private readonly newsletter = inject(NewsletterService);

  // Newsletter subscribe (shared by the desktop + mobile footer forms)
  readonly email = signal('');
  readonly submitting = signal(false);
  readonly errorMsg = signal('');

  subscribe(): void {
    const email = this.email().trim();
    if (!email) {
      this.errorMsg.set('Please enter your email address.');
      return;
    }
    this.submitting.set(true);
    this.errorMsg.set('');
    this.newsletter.subscribe(email, 'footer').subscribe({
      next: () => {
        this.submitting.set(false);
        this.email.set('');
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  readonly socials: ReadonlyArray<{ name: string; icon: string; link: string }> = [
    { name: 'Instagram', icon: 'instagram', link: 'https://www.instagram.com/zarklyx_/' },
    { name: 'LinkedIn', icon: 'linkedin', link: 'https://www.linkedin.com/company/zarklyx' },
    {
      name: 'Facebook',
      icon: 'facebook',
      link: 'https://www.facebook.com/people/ZarklyX/61585022711713/',
    },
    { name: 'YouTube', icon: 'youtube', link: 'https://www.youtube.com/@Zarkly-X' },
    { name: 'X', icon: 'x', link: 'https://x.com/ZarklyX' },
    {
      name: 'Reddit',
      icon: 'reddit',
      link: 'https://www.reddit.com/user/zarklyx_/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button',
    },
    { name: 'Threads', icon: 'threads', link: 'https://www.threads.com/@zarklyx_?invite=0' },
  ];

  readonly securityBadges: ReadonlyArray<{ abbr: string; name: string; status: string }> = [
    { abbr: 'ISO', name: 'ISO 27001', status: 'Certified' },
    { abbr: 'SOC 2', name: 'SOC 2', status: 'Compliant' },
    { abbr: 'GDPR', name: 'GDPR', status: 'Compliant' },
    { abbr: 'SSL', name: 'SSL', status: 'Secured' },
  ];

  sections = signal<NavSection[]>([
    {
      title: 'Institution',
      icon: 'building',
      items: ['About Us', 'Our Team', 'Careers'],
      open: false,
    },
    {
      title: 'Resources',
      icon: 'book',
      items: ['Blogs', 'Help Center', 'FAQs'],
      open: false,
    },
    {
      title: 'Support',
      icon: 'headset',
      items: ['Contact Support', 'Sitemap'],
      open: false,
    },
  ]);

  // Legal / policy links  shown in the bottom bar.
  legalLinks: { label: string; route: string }[] = [
    { label: 'Privacy Policy', route: '/support/privacy-policy' },
    { label: 'Terms of Service', route: '/support/terms-of-service' },
    { label: 'Website Terms', route: '/support/website-terms' },
    { label: 'Cookies', route: '/support/cookie-policy' },
  ];

  toggle(index: number) {
    this.sections.update((sections) =>
      sections.map((s, i) => (i === index ? { ...s, open: !s.open } : s)),
    );
  }

  // Map of footer column item labels to their routes (legal links live in legalLinks)
  private routeMap: Record<string, string> = {
    'About Us': '/about',
    'Our Team': '/team',
    Careers: '/company/careers',
    Blogs: '/blogs',
    'Help Center': '/support',
    FAQs: '/support/faq',
    'Contact Support': '/contact',
    Sitemap: '/sitemap',
  };

  // Section-scoped overrides for labels that appear in more than one column.
  // Empty now that the duplicated module/solution columns are gone.
  private sectionRouteMap: Record<string, Record<string, string>> = {};

  getRoute(section: string, item: string): string | null {
    return this.sectionRouteMap[section]?.[item] ?? this.routeMap[item] ?? null;
  }
}
