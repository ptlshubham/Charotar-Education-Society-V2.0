import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-centenary-hero',
  imports: [PageHero],
  templateUrl: './centenary-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-hero.scss',
})
export class CentenaryHero {
  readonly backdrop = PLACEHOLDER.about.hero;
}
