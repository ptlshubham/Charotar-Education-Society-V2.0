import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-social-hero',
  imports: [RouterLink],
  templateUrl: './social-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-hero.scss',
})
export class SocialHero {
  readonly centre = PLACEHOLDER.about.hero;
  readonly collage = PLACEHOLDER.social.heroCollage;

  /** Alternating tilt so the collage reads as pinned prints. */
  readonly tilts: readonly string[] = ['-rotate-6', '-rotate-3', 'rotate-6', 'rotate-3'];
}
