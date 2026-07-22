import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'module-hero1',
  imports: [RouterLink],
  templateUrl: './module-hero1.html',
  styleUrl: './module-hero1.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleHero1 {
  /** Main heading text */
  @Input() title = '';

  /** Subheading / description paragraph */
  @Input() subtitle = '';

  /** Full-bleed background image path */
  @Input() backgroundImage = '';

  /** Optional badge/tag above the title (e.g. "New Feature") */
  @Input() badgeText = '';

  /** Primary CTA button text */
  @Input() primaryBtnText = '';

  /** Primary CTA route link */
  @Input() primaryBtnLink = '';

  /** Secondary CTA button text */
  @Input() secondaryBtnText = '';

  /** Secondary CTA route link */
  @Input() secondaryBtnLink = '';
}
