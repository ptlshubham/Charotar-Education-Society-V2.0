import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroStat {
  value: string;
  label: string;
  path: string[];
}

/**
 * Site-wide navy page banner (the "Project" hero style): breadcrumb, optional
 * gold eyebrow, title with an optional gold accent line, tagline, blurb, inline
 * stats, and a skewed photo ribbon on the right. Used by every page hero except
 * the homepage — edit here to restyle them all at once.
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
  /** Multiple images for the skewed ribbon; falls back to [image] when empty. */
  @Input() panels: readonly string[] = [];
  @Input() stats: readonly HeroStat[] = [];
  /** Breadcrumb leaf label; "Home ›" is always prepended. */
  @Input({ required: true }) crumb = '';

  /** Ribbon panels — the provided set, or the single hero image as one panel. */
  get ribbon(): readonly string[] {
    return this.panels.length ? this.panels : [this.image];
  }
}
