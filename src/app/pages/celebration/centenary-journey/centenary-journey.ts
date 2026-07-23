import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-centenary-journey',
  templateUrl: './centenary-journey.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-journey.scss',
})
export class CentenaryJourney {
  readonly steps: ReadonlyArray<{
    title: string;
    date?: string;
    body: string;
    path: string[];
  }> = [
    {
      title: 'Launch',
      date: 'April 2015',
      body: 'The grand launch of Centenary Celebration with a vision for 100 meaningful events.',
      path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M10 21v-6h4v6'],
    },
    {
      title: 'Academic Events',
      body: 'Seminars, workshops, competitions and knowledge sharing programs.',
      path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
    },
    {
      title: 'Social Initiatives',
      body: 'Blood donation, tree plantation, cleanliness drives and community outreach.',
      path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
    },
    {
      title: 'Cultural Festivals',
      body: 'Vibrant cultural programs, music, dance, art exhibitions and fairs.',
      path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
    },
    {
      title: 'Sports & Health',
      body: 'Sports tournaments, fitness camps and health awareness activities.',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z', 'M2 12h20'],
    },
    {
      title: 'Grand Celebration',
      date: 'April 2016',
      body: 'A memorable culmination marking 100 years of excellence and service.',
      path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'],
    },
  ];
}
