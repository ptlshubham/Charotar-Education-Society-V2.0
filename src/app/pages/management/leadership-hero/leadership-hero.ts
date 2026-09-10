import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-leadership-hero',
  imports: [PageHero],
  templateUrl: './leadership-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership-hero.scss',
})
export class LeadershipHero {
  readonly heroImage = '/assets/images/hero/management.jpeg';
}
