import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-leadership-hero',
  imports: [RouterLink],
  templateUrl: './leadership-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership-hero.scss',
})
export class LeadershipHero {
  readonly heroImage = PLACEHOLDER.about.hero;
}
