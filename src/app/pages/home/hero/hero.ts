import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  /** Set to a campus photograph to replace the placeholder panel. */
  readonly heroImage = signal(PLACEHOLDER.heroCampus);

  readonly categories: readonly string[] = [
    'All Categories',
    'Schools',
    'Colleges',
    'Professional Institutes',
    'Hostels',
    'Courses',
  ];
}
