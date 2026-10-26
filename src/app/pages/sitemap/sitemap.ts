import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import siteLinks from '../../shared/site-links.json';
import { PLACEHOLDER } from '../../shared/placeholder-images';

interface SitemapLink {
  label: string;
  path: string;
}

interface SitemapGroup {
  /** Material Symbols glyph name. */
  icon: string;
  title: string;
  path: string;
  links: SitemapLink[];
}

/** Where each group sits in the three-column grid, by title. A group not listed here lands in the last column. */
const COLUMNS: readonly (readonly string[])[] = [
  ['Institution', 'Academic', 'Initiatives'],
  ['Celebrations', 'Media & Resources', 'Student Corner'],
  ['Rahatokarsh Fund', 'Support & Policies', 'Other Pages'],
];

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink, PageHero],
  templateUrl: './sitemap.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sitemap.scss',
})
export class Sitemap {
  readonly banner = PLACEHOLDER.about.hero;

  /**
   * Single source of truth for the site's public URLs, shared with
   * scripts/generate-site-files.mjs so this page, sitemap.xml and llms.txt can
   * never disagree. Every path must resolve - a sitemap linking to routes that
   * do not exist sends visitors and crawlers into the 404 page.
   */
  private readonly groups: readonly SitemapGroup[] = [
    ...(siteLinks.primary as SitemapGroup[]),
    siteLinks.support as SitemapGroup,
    ...(siteLinks.secondary as SitemapGroup[]),
  ];

  private readonly layout: readonly (readonly SitemapGroup[])[] = (() => {
    const byTitle = new Map(this.groups.map((g) => [g.title, g]));
    const columns = COLUMNS.map((titles) => titles.flatMap((t) => byTitle.get(t) ?? []));
    const placed = new Set(COLUMNS.flat());
    columns[columns.length - 1].push(...this.groups.filter((g) => !placed.has(g.title)));
    return columns;
  })();

  readonly query = signal('');

  /** The grid narrowed to the search. A group whose title matches keeps all its links. */
  readonly columns = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.layout;
    return this.layout.map((column) =>
      column.flatMap((group) => {
        if (group.title.toLowerCase().includes(q)) return [group];
        const links = group.links.filter((l) => l.label.toLowerCase().includes(q));
        return links.length ? [{ ...group, links }] : [];
      }),
    );
  });

  readonly noMatches = computed(() => this.columns().every((column) => !column.length));

  readonly quickLinks: readonly SitemapLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Careers', path: '/company/careers' },
    { label: 'News', path: '/more/news' },
  ];
}
