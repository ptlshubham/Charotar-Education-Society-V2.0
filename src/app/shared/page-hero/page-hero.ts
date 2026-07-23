import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroStat {
  value: string;
  label: string;
  path: string[];
}

/**
 * Navy section banner shared by the academic pages: breadcrumb, title with an
 * optional gold accent word, tagline, blurb, inline stats and an angled photo.
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
  /** Rendered in gold immediately after the tagline, e.g. "Excel!" */
  @Input() accent = '';
  @Input() tagline = '';
  @Input() blurb = '';
  @Input({ required: true }) image = '';
  @Input() stats: readonly HeroStat[] = [];
  /** Breadcrumb leaf label; "Home ›" is always prepended. */
  @Input({ required: true }) crumb = '';
}
