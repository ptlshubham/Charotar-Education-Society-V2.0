import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroStat {
  value: string;
  label: string;
  path: string[];
}

/** An intermediate breadcrumb between "Home" and the current page. */
export interface Crumb {
  label: string;
  /** RouterLink target; omit for a non-clickable category label. */
  link?: string;
}

/**
 * Site-wide navy page banner: breadcrumb, optional gold eyebrow, title with an
 * optional gold accent line, tagline, blurb, inline stats, and a photo on the
 * right that the navy sweeps diagonally into. Used by every page hero except the
 * homepage — edit here to restyle them all at once.
 */
@Component({
  selector: 'app-page-hero',
  imports: [RouterLink],
  templateUrl: './page-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page-hero.scss',
})
export class PageHero {
  @Input({ required: true }) title = '';
  /** Gold second line of the heading, e.g. "for a Better Tomorrow". */
  @Input() accent = '';
  /** Small gold line above the heading, e.g. "Innovate. Implement. Inspire." */
  @Input() eyebrow = '';
  @Input() tagline = '';
  @Input() blurb = '';
  @Input({ required: true }) image = '';
  @Input() stats: readonly HeroStat[] = [];
  /** Breadcrumb leaf label; "Home ›" is always prepended. */
  @Input({ required: true }) crumb = '';
  /** Intermediate breadcrumbs between Home and the leaf, e.g. [{ label: 'About Us', link: '/about' }]. */
  @Input() trail: readonly Crumb[] = [];
}
