import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legacy',
  imports: [RouterLink],
  templateUrl: './legacy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './legacy.scss',
})
export class Legacy {
  /** Portrait of Pujya Shri Vitthalbhai J. Patel, the visionary of CES. */
  readonly portrait = '/assets/images/home/vitthalbhai.png';

  /** The CES tribute film both credit lines link to. */
  readonly video = 'https://youtu.be/_-ntpkeG7O4';

  readonly quote = 'An exemplary householder who insists on service, simplicity and modesty.';

  readonly paragraphs: readonly string[] = [
    'The young volunteer, Vitthalbhai Patel, who practices yoga and exercise regularly and is always smiling, ' +
      'visited D.N. together with his elder brother, Mr. Ishwarbhai Patel. The glory of his will lives on in history. ' +
      'Gurubandhu Ishwarbhai said to Vitthalbhai: Remember, we are both friends of each other, but not outside this ' +
      'Patangan. Vitthalbhai received this first lesson as part of his education.',
    "In this way, Vitthalbhai's life journey began to become Pujya Vitthalbhai Saheb. This publication is a tribute " +
      'from his disciples.',
  ];

  readonly credits: readonly string[] = ['Shree Vitthalbhai J. Patel', 'Visionary of CES'];

  readonly milestones: ReadonlyArray<{ year: string; label: string }> = [
    { year: '1916', label: 'The journey begins' },
    { year: '1950s', label: 'Expanding Education' },
    { year: '1970s', label: 'Building Excellence' },
    { year: '2000s', label: 'Growing Stronger' },
    { year: 'Today', label: 'Empowering Generations' },
  ];
}
