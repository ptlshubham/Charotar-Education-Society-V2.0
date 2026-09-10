import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-social-hero',
  imports: [PageHero],
  templateUrl: './social-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-hero.scss',
})
export class SocialHero {
  readonly backdrop = '/assets/images/hero/social-activity.jpeg';
}
