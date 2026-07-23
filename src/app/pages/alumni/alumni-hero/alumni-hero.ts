import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-alumni-hero',
  templateUrl: './alumni-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-hero.scss',
})
export class AlumniHero {
  readonly campus = PLACEHOLDER.about.hero;
}
