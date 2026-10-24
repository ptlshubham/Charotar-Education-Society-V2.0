import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The Society was founded in 1916 - the heading's years move on by themselves. */
const FOUNDED = 1916;

@Component({
  selector: 'app-journey',
  imports: [RouterLink],
  templateUrl: './journey.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './journey.scss',
})
export class Journey {
  readonly years = new Date().getFullYear() - FOUNDED;

  readonly milestones: ReadonlyArray<{ year: string; title: string; body: string }> = [
    { year: '1906', title: 'Petlad Boarding House', body: 'Motibhai Amin gives village students a place to stay and study.' },
    { year: '1916', title: 'The Society Begins', body: 'Founded in Anand on 16 April with 27 students.' },
    { year: '1930', title: 'Dandi March', body: 'Gandhiji speaks to 20,000 people on the CES ground.' },
    { year: '1947', title: 'A Free India', body: 'New schools and colleges grow across three campuses.' },
    { year: '2016', title: 'Centenary', body: '100 events in a year and 8 Guinness World Records.' },
    { year: '2026+', title: 'Still Growing', body: '31+ institutes, 5 lakh+ alumni.' },
  ];
}
