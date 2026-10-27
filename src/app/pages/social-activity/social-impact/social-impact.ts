import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { countUp } from '../../../shared/count-up';

interface Stat {
  /** The number it counts up to. */
  to: number;
  /** Written straight after the number, e.g. "K+" (25K+). */
  suffix: string;
  label: string;
  accent?: boolean;
}

const format = new Intl.NumberFormat('en-IN');

/**
 * "Our Impact" on the Social Activity page - the figures count up from zero the first time they
 * scroll into view, like "CES at a Glance" on the home page. Prerender and no-JS show the final
 * numbers, and reduced-motion visitors keep them still.
 */
@Component({
  selector: 'app-social-impact',
  imports: [RouterLink],
  templateUrl: './social-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-impact.scss',
})
export class SocialImpact {
  /** The row of figures - watched for scrolling into view (the host element is inline, with no box). */
  private readonly figures = viewChild.required<ElementRef<HTMLElement>>('figures');

  // TODO: placeholder figures - replace with the numbers CES confirms.
  readonly stats: readonly Stat[] = [
    { to: 100, suffix: '+', label: 'Activities Organized' },
    { to: 25, suffix: 'K+', label: 'People Benefited', accent: true },
    { to: 150, suffix: '+', label: 'Community Partners' },
    { to: 500, suffix: '+', label: 'Volunteers Engaged' },
    { to: 1000, suffix: '+', label: 'Students Involved' },
    { to: 1500, suffix: '+', label: 'Meals Distributed' },
  ];

  /** What each counter shows right now - the final figures until the count-up starts. */
  readonly shown = countUp(this.stats.map((s) => s.to), () => this.figures().nativeElement);

  format(n: number): string {
    return format.format(n);
  }
}
