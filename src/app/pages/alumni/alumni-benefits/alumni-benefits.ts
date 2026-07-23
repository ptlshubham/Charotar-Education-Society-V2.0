import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-alumni-benefits',
  templateUrl: './alumni-benefits.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-benefits.scss',
})
export class AlumniBenefits {
  readonly benefits: ReadonlyArray<{ title: string; desc: string; path: string[] }> = [
    {
      title: 'Stay Connected',
      desc: 'Reconnect with classmates and old friends',
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    },
    {
      title: 'Give Back',
      desc: 'Support students and initiatives',
      path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
    },
    {
      title: 'Career Opportunities',
      desc: 'Access exclusive job and internship openings',
      path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
    },
    {
      title: 'Be Updated',
      desc: 'Get the latest news and event invites',
      path: ['M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8z', 'M7.5 7.5h.01'],
    },
  ];
}
