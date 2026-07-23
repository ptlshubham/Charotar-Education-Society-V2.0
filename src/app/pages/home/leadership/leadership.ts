import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-leadership',
  imports: [RouterLink],
  templateUrl: './leadership.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership.scss',
})
export class Leadership {
  readonly chairman = {
    name: 'Shri Virusbhai Patel',
    role: 'Chairman, CES',
    quote:
      'Our mission is to create institutions that inspire, innovate and impact lives. Together, we can build a stronger and brighter tomorrow.',
    /** Set to a portrait photograph to replace the placeholder avatar. */
    photo: PLACEHOLDER.chairman,
  };

  /** Placeholder tiles for the success-stories gallery. */
  readonly stories: readonly string[] = PLACEHOLDER.successStories;

  readonly partners: readonly string[] = [
    'Google for Education',
    'Microsoft',
    'IBM',
    'NPTEL',
    'Coursera',
  ];
}
