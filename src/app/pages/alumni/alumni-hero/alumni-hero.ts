import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-alumni-hero',
  imports: [PageHero],
  templateUrl: './alumni-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-hero.scss',
})
export class AlumniHero {
  readonly campus = '/assets/images/hero/alumni.jpeg';
}
