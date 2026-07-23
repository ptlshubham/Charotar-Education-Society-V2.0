import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import siteLinks from '../../shared/site-links.json';
import { PLACEHOLDER } from '../../shared/placeholder-images';

interface SitemapLink {
  label: string;
  path: string;
}

interface SitemapGroup {
  icon: string;
  title: string;
  path: string;
  links: SitemapLink[];
}

/** Feather-style glyphs keyed by the `icon` field in site-links.json. */
const ICONS: Record<string, string[]> = {
  company: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'],
  resources: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  legal: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  support: ['M3 14v-2a9 9 0 0 1 18 0v2', 'M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z'],
  other: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'],
};

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  templateUrl: './sitemap.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sitemap.scss',
})
export class Sitemap {
  readonly banner = PLACEHOLDER.about.hero;

  /**
   * Single source of truth for the site's public URLs, shared with
   * scripts/generate-site-files.mjs so this page, sitemap.xml and llms.txt can
   * never disagree. Every path must resolve — a sitemap linking to routes that
   * do not exist sends visitors and crawlers into the 404 page.
   */
  readonly groups: readonly SitemapGroup[] = [
    ...(siteLinks.primary as SitemapGroup[]),
    siteLinks.support as SitemapGroup,
    ...(siteLinks.secondary as SitemapGroup[]),
  ];

  iconFor(key: string): string[] {
    return ICONS[key] ?? ICONS['other'];
  }

  /** Pulled out of the group grid and shown as the strip at the bottom. */
  readonly importantLinks: readonly SitemapLink[] = [
    { label: 'Privacy Policy', path: '/more/policy' },
    { label: 'Terms & Conditions', path: '/more/terms' },
    { label: 'Refund Policy', path: '/more/refund-cancellation-policy' },
    { label: 'Website Terms', path: '/more/website-terms' },
    { label: "FAQ's", path: '/more/faqs' },
    { label: 'News', path: '/more/news' },
  ];
}
