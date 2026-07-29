import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { AcademicTabs, AcademicTab } from '../academic-tabs';

@Component({
  selector: 'app-others',
  imports: [PageHero, AcademicTabs],
  templateUrl: './others.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './others.scss',
})
export class Others {
  readonly banner = PLACEHOLDER.academic.othersBanner;

  readonly tabs: readonly AcademicTab[] = [
    { id: 'others', label: 'Others', path: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'] },
  ];
  readonly active = signal('others');

  readonly featured = {
    name: 'CES Performing Arts And Fine Arts Academy',
    desc: 'Nurturing creativity and artistic excellence in music, dance, theatre, and visual arts for all age groups.',
    phone: '(02692) 266789',
    website: 'https://www.performing.cesociety.in/',
    location: 'Anand, Gujarat',
    image: '/assets/images/institutes/ces-performing-arts.jpg',
  };

  readonly initiatives: ReadonlyArray<{
    name: string;
    desc: string;
    phone: string;
    location: string;
    path: string[];
  }> = [
    {
      name: 'CES Library & Resource Center',
      desc: 'A knowledge hub promoting reading culture, learning resources, and research support.',
      phone: '(02692) 241041',
      location: 'Anand, Gujarat',
      path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
    },
    {
      name: 'CES Community & Social Welfare',
      desc: 'Working for community upliftment through health camps, awareness programs and outreach.',
      phone: '(02692) 241320',
      location: 'Anand, Gujarat',
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    },
    {
      name: 'CES Alumni Association',
      desc: 'Building lifelong connections and fostering growth through alumni engagement.',
      phone: '(02692) 241080',
      location: 'Anand, Gujarat',
      path: ['m11 17 2 2a1 1 0 1 0 3-3', 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2.8 2.8 0 0 1 4 0l4 4', 'M3 7l4-4 4 4'],
    },
    {
      name: 'CES Cultural & Events Committee',
      desc: 'Organizing cultural festivals, events and celebrations that bring talent and tradition together.',
      phone: '(02692) 241050',
      location: 'Anand, Gujarat',
      path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
    },
  ];

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
