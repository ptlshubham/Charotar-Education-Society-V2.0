import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-community-voices',
  imports: [RouterLink],
  templateUrl: './community-voices.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './community-voices.scss',
})
export class CommunityVoices {
  readonly voices: ReadonlyArray<{ quote: string; name: string; role: string; photo: string }> = [
    {
      quote:
        'Being part of this centenary was a once in a lifetime experience. It strengthened my connection with CES.',
      name: 'Krupal Patel',
      role: 'Alumni',
      photo: PLACEHOLDER.celebration.voices[0],
    },
    {
      quote: 'The centenary events enriched us with knowledge, values, and unforgettable memories.',
      name: 'Disha Sharma',
      role: 'Student',
      photo: PLACEHOLDER.celebration.voices[1],
    },
    {
      quote: 'A proud moment for every member of CES family. Truly a celebration of unity and excellence.',
      name: 'Rameshbhai Desai',
      role: 'Faculty',
      photo: PLACEHOLDER.celebration.voices[2],
    },
    {
      quote:
        'The organization and participation in 100 events was exceptional. Hats off to the CES team!',
      name: 'Jignesh Mehta',
      role: 'Parent',
      photo: PLACEHOLDER.celebration.voices[3],
    },
  ];
}
