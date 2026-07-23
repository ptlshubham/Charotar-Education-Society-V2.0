import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-centenary-hero',
  templateUrl: './centenary-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-hero.scss',
})
export class CentenaryHero {
  readonly backdrop = PLACEHOLDER.about.hero;
  readonly polaroids = PLACEHOLDER.celebration.heroPolaroids;

  /** Slight alternating tilt so the pinned photos read as a scrapbook. */
  readonly tilts: readonly string[] = ['-rotate-3', 'rotate-2', 'rotate-3', '-rotate-2'];
}
