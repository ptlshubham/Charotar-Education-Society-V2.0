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

  readonly milestones: ReadonlyArray<{ year: string; title: string; desc: string; icon: string }> = [
    { year: '1916', title: 'The journey begins', desc: 'Charotar Education Society was founded in Anand with a vision to educate the community.', icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>' },
    { year: '1950s', title: 'Expanding Education', desc: 'New schools and colleges were established to reach more students across the region.', icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
    { year: '1970s', title: 'Building Excellence', desc: 'Strengthened academic standards and campus infrastructure across our institutes.', icon: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>' },
    { year: '2000s', title: 'Growing Stronger', desc: 'Introduced professional courses, modern facilities and wider opportunities.', icon: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
    { year: 'Today', title: 'Empowering Generations', desc: 'Continuing the legacy through 31+ institutes and thousands of learners.', icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  ];
}
