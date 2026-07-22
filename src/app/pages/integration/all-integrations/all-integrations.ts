import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Integration {
  name: string;
  desc: string;
  category: string;
  icon?: string; // brand SVG in assets/images/smm/icons
  letter?: string; // fallback badge when no icon asset exists
  color?: string; // fallback badge tint
  popular?: boolean;
  comingSoon?: boolean;
  route?: string; // dedicated integration page, if one exists
}

@Component({
  selector: 'app-all-integrations',
  imports: [NgClass, RouterLink],
  templateUrl: './all-integrations.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './all-integrations.scss',
})
export class AllIntegrations {
  readonly heroChecklist = ['Easy to connect', 'Secure & reliable', 'No code required'];

  /** Icons orbiting the hub illustration, evenly spaced around a circle.
   *  `x`/`y` are percentage positions inside the square hub box (center = 50/50). */
  readonly hubApps: ReadonlyArray<{ icon: string; name: string; x: number; y: number }> = [
    { icon: 'drive.svg', name: 'Google Drive', x: 40, y: 15 },
    { icon: 'instagram.svg', name: 'Instagram', x: 71, y: 11 },
    { icon: 'facebook.svg', name: 'Facebook', x: 84, y: 38 },
    { icon: 'linkedin.svg', name: 'LinkedIn', x: 89, y: 58 },
    { icon: 'youtube.svg', name: 'YouTube', x: 70, y: 82 },
    // { icon: 'whatsapp.svg', name: 'WhatsApp', x: 46, y: 91 },
    { icon: 'threads.svg', name: 'Threads', x: 31, y: 79 },
    { icon: 'pintrest.svg', name: 'Pinterest', x: 11, y: 66 },
    { icon: 'gmb.svg', name: 'Google Business', x: 16, y: 41 },
    { icon: 'dropbox.svg', name: 'Dropbox', x: 21, y: 19 },
  ];

  /** Same orbiting apps, each given scattered (non-synchronized) begin/dur values so the
   *  inbound and outbound data pulses fire at random-looking times rather than in lockstep. */
  readonly hubFlows = this.hubApps.map((app, i) => ({
    ...app,
    inBegin: ((i * 1.3) % 3.8).toFixed(2),
    inDur: (3.4 + ((i * 3) % 5) * 0.24).toFixed(2),
    outBegin: ((i * 1.9 + 0.9) % 4.0).toFixed(2),
    outDur: (3.6 + ((i * 2 + 1) % 4) * 0.26).toFixed(2),
  }));

  /** Category filter sidebar */
  readonly categories: ReadonlyArray<{ name: string; icon: string }> = [
    { name: 'All Integrations', icon: 'grid' },
    { name: 'Popular', icon: 'star' },
    { name: 'Social Media', icon: 'megaphone' },
    { name: 'Cloud & DAM', icon: 'cloud' },
    { name: 'Analytics & Business', icon: 'chart' },
    { name: 'CRM & Marketing', icon: 'contact' },
    { name: 'Help Desk', icon: 'headset' },
    { name: 'Reviews', icon: 'award' },
    { name: 'Commerce', icon: 'bag' },
    { name: 'Workflow', icon: 'flow' },
    { name: 'Coming Soon', icon: 'clock' },
  ];
  activeCategory = 'All Integrations';

  private readonly location = inject(Location);

  constructor() {
    // The sidebar on each integration detail page links here with ?category=,
    // so arriving from those pages opens on the right filter.
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const category = params.get('category');
        this.activeCategory = this.categories.some((c) => c.name === category)
          ? category!
          : 'All Integrations';
      });
  }

  /** Filter in place, keeping ?category= in step so a refresh or shared link shows
   *  the same cards. replaceState rather than a router navigation: a query-param
   *  change would otherwise trip scrollPositionRestoration and jump to the top. */
  selectCategory(name: string): void {
    this.activeCategory = name;
    this.location.replaceState(
      '/integrations',
      name === 'All Integrations' ? '' : `category=${encodeURIComponent(name)}`,
    );
  }

  /** Integration cards. Platforms our portal supports are live; the rest are Coming Soon. */
  readonly integrations: Integration[] = [
    // ── Social Media ──
    {
      name: 'Facebook',
      icon: 'facebook.svg',
      category: 'Social Media',
      popular: true,
      route: '/integrations/facebook',
      desc: 'Connect your Facebook account to manage pages and posts.',
    },
    {
      name: 'Instagram',
      icon: 'instagram.svg',
      category: 'Social Media',
      popular: true,
      route: '/integrations/instagram',
      desc: 'Showcase creativity through photos, reels and stories.',
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin.svg',
      category: 'Social Media',
      popular: true,
      route: '/integrations/linkedin',
      desc: 'Manage your professional profiles and content.',
    },
    {
      name: 'YouTube',
      icon: 'youtube.svg',
      category: 'Social Media',
      popular: true,
      desc: 'Manage your channels and video publishing.',
    },
    {
      name: 'X (Twitter)',
      icon: 'x.svg',
      category: 'Social Media',
      route: '/integrations/x',
      desc: 'Manage your posts and track analytics in real-time.',
    },
    {
      name: 'Pinterest',
      icon: 'pintrest.svg',
      category: 'Social Media',
      route: '/integrations/pinterest',
      desc: 'Manage your boards, pins and content.',
    },
    {
      name: 'Threads',
      icon: 'threads.svg',
      category: 'Social Media',
      route: '/integrations/threads',
      desc: 'Manage your short-form conversations and posts.',
    },
    {
      name: 'TikTok',
      icon: 'tiktok.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Short-form video publishing and audience insights.',
    },
    {
      name: 'Snapchat',
      icon: 'snapchat.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Share stories and reach a younger audience.',
    },
    {
      name: 'WhatsApp',
      icon: 'whatsapp.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Message customers and automate conversations.',
    },
    {
      name: 'Facebook Messenger',
      icon: 'facebook-messanger.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Respond to customer messages from one inbox.',
    },
    {
      name: 'Reddit',
      icon: 'reddit.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Track conversations and engage with communities.',
    },
    {
      name: 'Tumblr',
      icon: 'tumblr.svg',
      category: 'Social Media',
      comingSoon: true,
      desc: 'Publish and manage your Tumblr blog content.',
    },

    // ── Cloud & DAM ──
    {
      name: 'Google Drive',
      icon: 'drive.svg',
      category: 'Cloud & DAM',
      popular: true,
      route: '/integrations/google-drive',
      desc: 'Organize personal and professional documents, ideas and tasks.',
    },
    {
      name: 'Dropbox',
      icon: 'dropbox.svg',
      category: 'Cloud & DAM',
      route: '/integrations/dropbox',
      desc: 'Manage and share your cloud files and folders.',
    },
    {
      name: 'OneDrive',
      icon: 'onedrive.svg',
      category: 'Cloud & DAM',
      comingSoon: true,
      desc: 'Store and share your files across Microsoft 365.',
    },
    {
      name: 'Box',
      icon: 'box.svg',
      category: 'Cloud & DAM',
      comingSoon: true,
      desc: 'Secure content management and file sharing.',
    },
    {
      name: 'Canva',
      icon: 'canva.svg',
      category: 'Cloud & DAM',
      comingSoon: true,
      desc: 'Design and pull assets straight into your posts.',
    },
    {
      name: 'Bynder',
      icon: 'bynder.svg',
      category: 'Cloud & DAM',
      comingSoon: true,
      desc: 'Access your digital asset management library.',
    },
    {
      name: 'Adobe Experience Manager',
      icon: 'adobe-experience-manager.svg',
      category: 'Cloud & DAM',
      comingSoon: true,
      desc: 'Bring approved brand assets into your content.',
    },

    // ── Analytics & Business ──
    {
      name: 'Google My Business',
      icon: 'gmb.svg',
      category: 'Analytics & Business',
      desc: 'Manage locations, reviews and your business profile.',
    },
    {
      name: 'Google Analytics 4',
      icon: 'google_analytics.svg',
      category: 'Analytics & Business',
      desc: 'Monitor real-time traffic, user behavior and SEO performance.',
    },
    {
      name: 'Tableau',
      icon: 'tableau.svg',
      category: 'Analytics & Business',
      comingSoon: true,
      desc: 'Visualize your social data in custom dashboards.',
    },
    {
      name: 'Bitly',
      icon: 'bitly.svg',
      category: 'Analytics & Business',
      comingSoon: true,
      desc: 'Shorten links and track click performance.',
    },

    // ── CRM & Marketing ──
    {
      name: 'Salesforce',
      icon: 'salesforce.svg',
      category: 'CRM & Marketing',
      comingSoon: true,
      desc: 'Sync social data with your CRM records.',
    },
    {
      name: 'HubSpot',
      icon: 'hubspot.svg',
      category: 'CRM & Marketing',
      comingSoon: true,
      desc: 'Connect contacts, deals and marketing activity.',
    },
    {
      name: 'Marketo',
      icon: 'marketo.svg',
      category: 'CRM & Marketing',
      comingSoon: true,
      desc: 'Feed social engagement into marketing automation.',
    },
    {
      name: 'Microsoft Dynamics 365',
      icon: 'dynamics-365.svg',
      category: 'CRM & Marketing',
      comingSoon: true,
      desc: 'Unify customer data across sales and service.',
    },

    // ── Help Desk ──
    {
      name: 'Zendesk',
      icon: 'zendesk.svg',
      category: 'Help Desk',
      comingSoon: true,
      desc: 'Turn social messages into support tickets.',
    },

    // ── Reviews ──
    {
      name: 'Trustpilot',
      icon: 'trustpilot.svg',
      category: 'Reviews',
      comingSoon: true,
      desc: 'Monitor and respond to customer reviews.',
    },
    {
      name: 'Yelp',
      icon: 'yelp.svg',
      category: 'Reviews',
      comingSoon: true,
      desc: 'Manage business reviews and ratings.',
    },
    {
      name: 'Tripadvisor',
      icon: 'tripadvisor-icon.svg',
      category: 'Reviews',
      comingSoon: true,
      desc: 'Track traveler reviews for your locations.',
    },
    {
      name: 'Google Play',
      icon: 'play.svg',
      category: 'Reviews',
      comingSoon: true,
      desc: 'Respond to your app store reviews.',
    },
    {
      name: 'Glassdoor',
      icon: 'glassdoor.svg',
      category: 'Reviews',
      comingSoon: true,
      desc: 'Manage employer reviews and reputation.',
    },

    // ── Commerce ──
    {
      name: 'Shopify',
      icon: 'shopify.svg',
      category: 'Commerce',
      comingSoon: true,
      desc: 'Tag products and sell through social posts.',
    },
    {
      name: 'Facebook Shops',
      icon: 'facebook-shops.svg',
      category: 'Commerce',
      comingSoon: true,
      desc: 'Manage your social storefront and catalog.',
    },

    // ── Workflow ──
    {
      name: 'Slack',
      icon: 'slack.svg',
      category: 'Workflow',
      comingSoon: true,
      desc: 'Get notifications and collaborate with your team.',
    },
  ];

  /** Cards shown for the active sidebar category */
  get filteredIntegrations(): Integration[] {
    switch (this.activeCategory) {
      case 'All Integrations':
        return this.integrations;
      case 'Popular':
        return this.integrations.filter((i) => i.popular);
      case 'Coming Soon':
        return this.integrations.filter((i) => i.comingSoon);
      default:
        return this.integrations.filter((i) => i.category === this.activeCategory);
    }
  }

  /** "Built for a better connected experience" */
  readonly experience: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'shield',
      title: 'Secure by design',
      desc: 'Enterprise-grade security to keep your data safe.',
    },
    {
      icon: 'sync',
      title: 'Real-time sync',
      desc: 'Keep your data up-to-date across all platforms.',
    },
    { icon: 'bolt', title: 'Easy setup', desc: 'Connect in minutes with simple, no-code setup.' },
    { icon: 'puzzle', title: 'More apps, more power', desc: 'New integrations added regularly.' },
  ];

  /** Browse by popular categories */
  readonly browseCategories: ReadonlyArray<{
    icon: string;
    color: string;
    name: string;
    count: number;
  }> = [
    { icon: 'contact', color: '#C587CE', name: 'CRM', count: 12 },
    { icon: 'megaphone', color: '#F17C9F', name: 'Marketing', count: 18 },
    { icon: 'chat', color: '#E8A33D', name: 'Communication', count: 14 },
    { icon: 'pen', color: '#3772FF', name: 'Productivity', count: 20 },
    { icon: 'card', color: '#E8A33D', name: 'Finance', count: 10 },
    { icon: 'chart', color: '#3DAFA9', name: 'Analytics', count: 12 },
  ];
}
