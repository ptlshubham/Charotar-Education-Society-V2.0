import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Leader {
  // heading: string;
  name: string;
  role: string;
  quote: string;
  photo?: string;
}

@Component({
  selector: 'app-leadership',
  imports: [RouterLink],
  templateUrl: './leadership.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership.scss',
})
export class Leadership {
  // Real leaders and portraits, kept in step with the Management page (key-leaders).
  readonly leaders: readonly Leader[] = [
    {
      // heading: 'Message from the Chairman',
      name: 'Shri Niravkumar N. Patel',
      role: 'Chairman, CES',
      quote: 'Our mission is to create institutions that inspire, innovate and impact lives. Together, we can build a stronger and brighter tomorrow.',
      photo: '/assets/images/directors/chairman.jpg',
    },
    {
      // heading: 'Message from the Secretary',
      name: 'Shri Ketankumar P. Patel',
      role: 'Secretary, CES',
      quote: 'Education is the most powerful tool to transform individuals and society. We remain committed to excellence in all that we do dfgh dwfg.',
      photo: '/assets/images/directors/vc.jpg',
    },
  ];
}
