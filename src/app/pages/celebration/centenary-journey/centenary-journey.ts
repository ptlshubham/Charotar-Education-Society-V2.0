import { ChangeDetectionStrategy, Component } from '@angular/core';

/** "Our Centenary Journey" - where the year began and ended, and what filled it. */
@Component({
  selector: 'app-centenary-journey',
  templateUrl: './centenary-journey.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-journey.scss',
})
export class CentenaryJourney {
  /** The two ends of the timeline. */
  readonly start = { date: 'April 2015', title: 'The journey begins', body: 'The first of 100 events across the centenary year.' };
  readonly end = { date: 'April 2016', title: 'A century celebrated', body: '100 years, marked by 8 Guinness World Records.' };

  /** `icon` is the path data of a 24×24 outline icon (Lucide / Tabler shapes). */
  readonly categories: ReadonlyArray<{ title: string; body: string; icon: readonly string[] }> = [
    {
      title: 'Academic Events',
      body: '16 academic events for students across our schools and colleges.',
      icon: ['M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z', 'M22 10v6', 'M6 12.5V16a6 3 0 0 0 12 0v-3.5'],
    },
    {
      title: 'Social Initiatives',
      body: '13 programmes supporting social causes and public awareness.',
      icon: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
    },
    {
      title: 'Cultural Festivals',
      body: '40 cultural programmes, 3 festivals and 5 community get-togethers.',
      icon: ['M9 18V5l12-2v13', 'M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0', 'M15 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
    },
    {
      title: 'Sports & Health',
      body: '9 sports competitions and 6 health fairs.',
      icon: ['M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0', 'M4 17l5 1l.75-1.5', 'M15 21v-4l-4-3l1-6', 'M7 12V9l5-1l3 3l3 1'],
    },
  ];
}
