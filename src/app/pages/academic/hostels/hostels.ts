import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-hostels',
  imports: [PageHero, RouterLink],
  templateUrl: './hostels.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hostels.scss',
})
export class Hostels {
  readonly banner = PLACEHOLDER.academic.hostelsBanner;

  readonly assurances: ReadonlyArray<{ label: string; path: string[] }> = [
    { label: 'Safe & Secure', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { label: 'Comfortable Rooms', path: ['M2 20v-8h20v8', 'M2 12V7M22 12V9a1 1 0 0 0-1-1h-9v4'] },
    { label: 'Nutritious Meals', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
    { label: '24/7 Student Support', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];

  readonly hostels: ReadonlyArray<{
    name: string;
    campus: string;
    desc: string;
    tags: ReadonlyArray<{ label: string; path: string[] }>;
    image: string;
  }> = [
    {
      name: 'Vidhyarthi Ashram',
      campus: 'D. N. High School Campus',
      desc: 'A homely environment for boys with disciplined routines and all essential facilities.',
      tags: [
        { label: 'Boys Hostel', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
        { label: 'Wi-Fi', path: ['M5 13a10 10 0 0 1 14 0', 'M8.5 16.5a5 5 0 0 1 7 0', 'M2 8.8a15 15 0 0 1 20 0', 'M12 20h.01'] },
        { label: 'Reading Room', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
      ],
      image: PLACEHOLDER.academic.cards[0],
    },
    {
      name: 'Kasturba Kanya Chhatalay',
      campus: 'D. N. High School Campus',
      desc: 'Safe and secure accommodation for girls with a focus on comfort and well-being.',
      tags: [
        { label: 'Girls Hostel', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
        { label: 'Wi-Fi', path: ['M5 13a10 10 0 0 1 14 0', 'M8.5 16.5a5 5 0 0 1 7 0', 'M2 8.8a15 15 0 0 1 20 0', 'M12 20h.01'] },
        { label: 'Study Hall', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'] },
      ],
      image: PLACEHOLDER.academic.cards[1],
    },
    {
      name: 'Ladies Hostel',
      campus: 'M. B. Patel Science College Campus',
      desc: 'Well-facilitated hostel for girl students pursuing higher education.',
      tags: [
        { label: 'Girls Hostel', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
        { label: 'Wi-Fi', path: ['M5 13a10 10 0 0 1 14 0', 'M8.5 16.5a5 5 0 0 1 7 0', 'M2 8.8a15 15 0 0 1 20 0', 'M12 20h.01'] },
        { label: 'Common Room', path: ['M3 21h18', 'M5 21V9l7-5 7 5v12'] },
      ],
      image: PLACEHOLDER.academic.cards[2],
    },
    {
      name: 'Adhyapan Mandir Chhatalay',
      campus: 'Mogri Campus',
      desc: 'Comfortable hostel for boys with a calm and conducive environment for studies.',
      tags: [
        { label: 'Boys Hostel', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
        { label: 'Wi-Fi', path: ['M5 13a10 10 0 0 1 14 0', 'M8.5 16.5a5 5 0 0 1 7 0', 'M2 8.8a15 15 0 0 1 20 0', 'M12 20h.01'] },
        { label: 'Dining Hall', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
      ],
      image: PLACEHOLDER.academic.cards[3],
    },
  ];
}
