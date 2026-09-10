import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-others',
  imports: [PageHero],
  templateUrl: './others.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './others.scss',
})
export class Others {
  readonly banner = '/assets/images/hero/others.jpeg';

  readonly featured = {
    name: 'CES Performing Arts And Fine Arts Academy',
    desc: 'Nurturing creativity and artistic excellence in music, dance, theatre, and visual arts for all age groups.',
    phone: '(02692) 266789',
    website: 'https://www.performing.cesociety.in/',
    location: 'Anand, Gujarat',
    image: '/assets/images/institutes/ces-performing-arts.jpg',
    icon: 'palette',
  };

  readonly initiatives: ReadonlyArray<{
    name: string;
    desc: string;
    phone: string;
    location: string;
    icon: string;
  }> = [
      {
        name: 'CES Library & Resource Center',
        desc: 'A knowledge hub promoting reading culture, learning resources, and research support.',
        phone: '(02692) 241041',
        location: 'Anand, Gujarat',
        icon: 'menu_book',
      },
      {
        name: 'CES Community & Social Welfare',
        desc: 'Working for community upliftment through health camps, awareness programs and outreach.',
        phone: '(02692) 241320',
        location: 'Anand, Gujarat',
        icon: 'group',
      },
      {
        name: 'CES Alumni Association',
        desc: 'Building lifelong connections and fostering growth through alumni engagement.',
        phone: '(02692) 241080',
        location: 'Anand, Gujarat',
        icon: 'handshake',
      },
      {
        name: 'CES Cultural & Events Committee',
        desc: 'Organizing cultural festivals and celebrations that bring talent and tradition together.',
        phone: '(02692) 241050',
        location: 'Anand, Gujarat',
        icon: 'music_note',
      },
    ];

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
