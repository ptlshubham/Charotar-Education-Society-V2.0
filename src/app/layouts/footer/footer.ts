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
      title: 'Company',
      icon: 'building',
      items: [
        'About ZarklyX',
        'Teams',
        'Careers',
        'Customers',
        'Pricing',
        'Trust Center',
        'Contact Us',
      ],
      open: false,
    },
    {
      title: 'Modules',
      icon: 'grid',
      items: [
        'Token System',
        'Social Media Management',
        'Employee Management',
        'Finance & Accounting',
        'HRMS',
        'CRM',
        'Payroll',
        'Influencer Management',
      ],
      open: false,
    },
    {
      title: 'Integrations',
      icon: 'link',
      items: [
        'Facebook',
        'Instagram',
        'X (Twitter)',
        'LinkedIn',
        'Threads',
        'Pinterest',
        'Google Drive',
        'Dropbox',
        'All Integrations',
      ],
      open: false,
    },
    {
      title: 'Solutions',
      icon: 'briefcase',
      items: [
        'Enterprise',
        'Agencies',
        'Small & Medium Business',
        'Professional Services',
        'Social Media Management',
        'Social Insights',
        'Brand Awareness',
        'Industries',
      ],
      open: false,
    },
    {
      title: 'Resources',
      icon: 'book',
      items: [
        'Blogs',
        'Newsroom',
        'Podcast',
        'Tutorials',
        'Help Center',
        'Community',
        'Expert Sessions',
      ],
      open: false,
    },
    {
      title: 'Support',
      icon: 'headset',
      items: [
        'System Status',
        'FAQs',
        'Report Abuse',
        'Feature Requests',
        'Delete Account',
        'Contact Support',
        'Sitemap',
      ],
      open: false,
    },
  ]);

  // Legal / policy links  shown in the bottom bar.
  legalLinks: { label: string; route: string }[] = [
    { label: 'Beta Policy', route: '/support/beta-policy' },
    { label: 'Privacy Policy', route: '/support/privacy-policy' },
    { label: 'Terms of Service', route: '/support/terms-of-service' },
    { label: 'Website Terms', route: '/support/website-terms' },
    { label: 'Refund Policy', route: '/support/refund-policy' },
    { label: 'Data Deletion', route: '/support/data-deletion' },
    { label: 'Disclosure Policy', route: '/support/disclosure-policy' },
    { label: 'Cookies', route: '/support/cookie-policy' },
  ];

  toggle(index: number) {
    this.sections.update((sections) =>
      sections.map((s, i) => (i === index ? { ...s, open: !s.open } : s)),
    );
  }

  // Map of footer column item labels to their routes (legal links live in legalLinks)
  private routeMap: Record<string, string> = {
    'About ZarklyX': '/about',
    Teams: '/team',
    Careers: '/company/careers',
    Customers: '/company/customer-stories',
    Pricing: '/pricing',
    'Trust Center': '/company/trust-center',
    'Contact Us': '/contact',
    'Token System': '/modules/token-management',
    'Employee Management': '/modules/employee-management',
    'Finance & Accounting': '/modules/finance-accounting',
    HRMS: '/modules/hrms',
    CRM: '/modules/crm',
    Payroll: '/modules/payroll',
    'Influencer Management': '/modules/influencer-management',
    Enterprise: '/solutions/enterprise',
    Agencies: '/solutions/agencies',
    'Small & Medium Business': '/solutions/small-medium-business',
    'Professional Services': '/solutions/professional-services',
    'Social Insights': '/solutions/social-insights',
    'Brand Awareness': '/solutions/brand-awareness',
    Industries: '/solutions/industries',
    Facebook: '/integrations/facebook',
    Instagram: '/integrations/instagram',
    'X (Twitter)': '/integrations/x',
    LinkedIn: '/integrations/linkedin',
    Threads: '/integrations/threads',
    Pinterest: '/integrations/pinterest',
    'Google Drive': '/integrations/google-drive',
    Dropbox: '/integrations/dropbox',
    'All Integrations': '/integrations',
    Blogs: '/blogs',
    Newsroom: '/company/newsroom',
    Podcast: '/podcast',
    Tutorials: '/support/tutorials',
    'Help Center': '/support',
    Community: '/support/community',
    'Expert Sessions': '/support/expert-sessions',
    'System Status': '/support/system-status',
    FAQs: '/support/faq',
    'Report Abuse': '/support/report-abuse',
    'Feature Requests': '/support/feature-request',
    'Delete Account': '/support/delete-your-account',
    'Contact Support': '/contact',
    Sitemap: '/sitemap',
  };

  // Section-scoped overrides for labels that appear in more than one column
  // (e.g. "Social Media Management" exists under both Modules and Solutions).
  private sectionRouteMap: Record<string, Record<string, string>> = {
    Solutions: { 'Social Media Management': '/solutions/social-media-management' },
    Modules: { 'Social Media Management': '/modules/social-media-management' },
  };

  getRoute(section: string, item: string): string | null {
    return this.sectionRouteMap[section]?.[item] ?? this.routeMap[item] ?? null;
  }
}
