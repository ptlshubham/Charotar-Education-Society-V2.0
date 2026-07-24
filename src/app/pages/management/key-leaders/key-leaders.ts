import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-key-leaders',
  imports: [Reveal],
  templateUrl: './key-leaders.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './key-leaders.scss',
})
export class KeyLeaders {
  readonly leaders: ReadonlyArray<{
    name: string;
    role: string;
    subRole: string;
    quote: string;
    photo: string;
  }> = [
    {
      name: 'Shri Niravkumar N. Patel',
      role: 'Chairman',
      subRole: 'Charotar Education Society',
      quote:
        'Our mission is to create institutions that inspire, innovate and impact lives. Together, we can build a stronger and brighter tomorrow.',
      photo: '/assets/images/directors/chairman.jpg',
    },
    {
      name: 'Shri Ketankumar P. Patel',
      role: 'Secretary',
      subRole: 'Syndicate and Senate Member of Sardar Patel University',
      quote:
        'Education is the most powerful tool to transform individuals and society. We remain committed to excellence in all that we do.',
      photo: '/assets/images/directors/vc.jpg',
    },
  ];
}
