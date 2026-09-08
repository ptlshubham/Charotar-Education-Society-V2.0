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
    icon: string;
  }> = [
    {
      title: 'Launch',
      date: 'April 2015',
      body: 'The grand launch of Centenary Celebration with a vision for 100 meaningful events.',
      icon: 'account_balance',
    },
    {
      title: 'Academic Events',
      body: 'Seminars, workshops, competitions and knowledge sharing programs.',
      icon: 'school',
    },
    {
      title: 'Social Initiatives',
      body: 'Blood donation, tree plantation, cleanliness drives and community outreach.',
      icon: 'favorite',
    },
    {
      title: 'Cultural Festivals',
      body: 'Vibrant cultural programs, music, dance, art exhibitions and fairs.',
      icon: 'music_note',
    },
    {
      title: 'Sports & Health',
      body: 'Sports tournaments, fitness camps and health awareness activities.',
      icon: 'language',
    },
    {
      title: 'Grand Celebration',
      date: 'April 2016',
      body: 'A memorable culmination marking 100 years of excellence and service.',
      icon: 'workspace_premium',
    },
  ];
}
