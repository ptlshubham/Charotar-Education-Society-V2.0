import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hero.scss',
})
export class Hero {
  /** Real CES campus — D.N. High School, Anand. */
  readonly image = PLACEHOLDER.heroSlides[0];
}
