import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/** Celebration page banner; "Explore the celebration" scrolls to the introduction below it. */
@Component({
  selector: 'app-centenary-hero',
  imports: [PageHero, RouterLink],
  templateUrl: './centenary-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-hero.scss',
})
export class CentenaryHero {
  readonly backdrop = '/assets/images/hero/centenary-celebration.webp';
}
