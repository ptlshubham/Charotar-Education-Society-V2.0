import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { TabBar, TabItem } from '../../../shared/tab-bar/tab-bar';

type HostelCategory = 'all' | 'boys' | 'girls';

interface Hostel {
  name: string;
  campus: string;
  desc: string;
  type: 'boys' | 'girls';
  tags: ReadonlyArray<{ label: string; path: string[] }>;
  image: string;
}

@Component({
  selector: 'app-hostels',
  imports: [PageHero, RouterLink, TabBar],
  templateUrl: './hostels.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hostels.scss',
})
export class Hostels {
  readonly banner = '/assets/images/hero/hostel.jpeg';

  readonly tabs: readonly TabItem[] = [
    { id: 'all', label: 'All Hostels', path: [], icon: 'apartment' },
    { id: 'boys', label: 'Boys Hostel', path: [], icon: 'person' },
    { id: 'girls', label: 'Girls Hostel', path: [], icon: 'person' },
  ];

  readonly active = signal<HostelCategory>('all');

  select(id: string): void {
    this.active.set(id as HostelCategory);
  }

  readonly assurances: ReadonlyArray<{ label: string; path: string[]; icon: string }> = [
    { label: '24-Hour Security', path: [], icon: 'verified_user' },
    { label: 'Rooms & Meals', path: [], icon: 'bed' },
    { label: 'Our Own Kitchen', path: [], icon: 'restaurant' },
    { label: 'Free First Aid', path: [], icon: 'medical_services' },
  ];

  readonly hostels: readonly Hostel[] = [
    {
      name: 'Vidhyarthi Ashram',
      campus: 'D. N. High School Campus',
      desc: 'Five blocks (A, B, C, D and Kalabhavan) with rooms and meals for boys from class 5 to 12 and for college students.',
      type: 'boys',
      tags: [
        { label: 'Class 5 to PG', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
        { label: 'Meals included', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
      ],
      image: '/assets/images/institutes/hostel-vidhyarthi-ashram.jpg',
    },
    {
      name: 'Kasturba Kanya Chhatralay',
      campus: 'D. N. High School Campus',
      desc: 'Rooms and meals for girls from class 5 to 12, with a disciplined, friendly routine and simple, wholesome food.',
      type: 'girls',
      tags: [
        { label: 'Class 5 to 12', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
        { label: 'Meals included', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
      ],
      image: '/assets/images/institutes/hostel-kasturba-kanya.jpg',
    },
    {
      name: 'Ladies Hostel',
      campus: 'M. B. Patel Science College Campus',
      desc: 'Rooms and meals for women in undergraduate and postgraduate courses, with security round the clock.',
      type: 'girls',
      tags: [
        { label: 'UG & PG', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
        { label: '24-hour security', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
      ],
      image: '/assets/images/institutes/hostel-ladies.jpg',
    },
    {
      name: 'Adhyapan Mandir Chhatralay',
      campus: 'Mogri Campus',
      desc: 'A quiet hostel for boys on the Mogri campus, close to the teacher-training colleges.',
      type: 'boys',
      tags: [
        { label: 'Laundry', path: ['M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.5 1.1l.9 4.3a1 1 0 0 0 1 .8H7v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8h2a1 1 0 0 0 1-.8l.9-4.3a1 1 0 0 0-.5-1.1z'] },
        { label: 'Free first aid', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v8M8 12h8'] },
      ],
      image: '/assets/images/institutes/hostel-adhyapan-mandir.jpg',
    },
  ];

  readonly visible = computed(() => {
    const f = this.active();
    return f === 'all' ? this.hostels : this.hostels.filter((h) => h.type === f);
  });
}
