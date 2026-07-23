import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './messages.scss',
})
export class Messages {
  readonly leaders: ReadonlyArray<{
    heading: string;
    quote: string;
    name: string;
    role: string;
    photo: string;
  }> = [
    {
      heading: 'From the Chairman',
      quote:
        'Our mission is to create institutions that inspire, innovate and impact lives. Together, we can build a stronger and brighter tomorrow.',
      name: 'Shri Virubhai Patel',
      role: 'Chairman, CES',
      photo: PLACEHOLDER.chairman,
    },
    {
      heading: 'From the Secretary',
      quote:
        'Education is the most powerful tool that can transform individuals and society. We remain committed to excellence in all that we do.',
      name: 'Shri Ramanbhai Patel',
      role: 'Hon. Secretary, CES',
      photo: PLACEHOLDER.about.secretary,
    },
  ];
}
