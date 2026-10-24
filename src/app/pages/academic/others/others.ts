import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-others',
  imports: [RouterLink, PageHero],
  templateUrl: './others.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './others.scss',
})
export class Others {
  readonly banner = '/assets/images/hero/others.jpeg';

  readonly featured = {
    name: 'CES Performing Arts And Fine Arts Academy',
    desc: 'Dance, music, drawing, theatre and animation, taught by people who work in those fields, for children and adults alike.',
    phone: '(02692) 266789',
    website: 'https://www.performing.cesociety.in/',
    location: 'Anand, Gujarat',
    image: '/assets/images/institutes/ces-performing-arts.jpg',
    icon: 'palette',
  };

  /** Each listed with the Society's office number until the units have their own. */
  readonly initiatives: ReadonlyArray<{
    name: string;
    desc: string;
    phone: string;
    location: string;
    icon: string;
    /** Its page under Projects, where there is one. */
    link?: string;
  }> = [
      {
        name: 'Gyansthali Library',
        desc: 'Books, periodicals, journals and online material on every subject, two e-libraries, a library club and book-review contests.',
        phone: '(02692) 243083',
        location: 'Anand, Gujarat',
        icon: 'menu_book',
      },
      {
        name: 'Udaan Education',
        desc: 'Hands-on science and maths for classes 6 to 10, and JEE, NEET and GUJCET coaching for classes 11 and 12.',
        phone: '(02692) 243083',
        location: 'Anand, Gujarat',
        icon: 'science',
        link: '/project/udaan-education',
      },
      {
        name: 'Swami Dayanand Saraswati Vocational Training Centre',
        desc: 'Practical courses taught by experts from partner organisations: Data Structures & Algorithms, CELTAS English and Tally accounting.',
        phone: '(02692) 243083',
        location: 'Anand, Gujarat',
        icon: 'work',
        link: '/project/vocational-training-centre',
      },
      {
        name: 'Senior Citizen Forum',
        desc: 'For anyone over 60 who studied or worked at CES: a meeting and meal every month, a trip every three months, and free gym, library and computer classes.',
        phone: '(02692) 243083',
        location: 'Anand, Gujarat',
        icon: 'elderly',
      },
    ];

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
