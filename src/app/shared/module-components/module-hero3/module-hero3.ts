import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'module-hero3',
  imports: [RouterLink],
  templateUrl: './module-hero3.html',
  styleUrl: './module-hero3.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleHero3 {
  /** Main heading text */
  @Input() title = '';

  /** Subheading / description paragraph */
  @Input() subtitle = '';

  /** Showcase image (displayed below the centered text) */
  @Input() backgroundImage = '';

  /** Optional badge/tag above the title */
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
