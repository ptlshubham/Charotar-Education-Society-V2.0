import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'module-hero2',
  imports: [],
  templateUrl: './module-hero2.html',
  styleUrl: './module-hero2.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ModuleHero2 {
  /** Main heading text */
  @Input() title = '';

  /** Subheading / description paragraph */
  @Input() subtitle = '';

  /** Hero image (displayed on the right side) */
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
