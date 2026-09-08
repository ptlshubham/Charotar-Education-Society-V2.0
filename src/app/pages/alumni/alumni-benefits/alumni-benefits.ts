import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-alumni-benefits',
  templateUrl: './alumni-benefits.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-benefits.scss',
})
export class AlumniBenefits {
  readonly benefits: ReadonlyArray<{ title: string; desc: string; icon: string }> = [
    {
      title: 'Stay Connected',
      desc: 'Reconnect with classmates and old friends',
      icon: 'group',
    },
    {
      title: 'Give Back',
      desc: 'Support students and initiatives',
      icon: 'favorite',
    },
    {
      title: 'Career Opportunities',
      desc: 'Access exclusive job and internship openings',
      icon: 'business_center',
    },
    {
      title: 'Be Updated',
      desc: 'Get the latest news and event invites',
      icon: 'sell',
    },
  ];
}
