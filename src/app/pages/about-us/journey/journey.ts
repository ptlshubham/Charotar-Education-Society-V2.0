import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './journey.scss',
})
export class Journey {
  readonly milestones: ReadonlyArray<{
    year: string;
    title: string;
    body: string;
    icon: string;
  }> = [
    {
      year: '1915',
      title: 'Foundation',
      body: 'Founded to educate rural areas.',
      icon: 'account_balance',
    },
    {
      year: '1947',
      title: 'Freedom Movement',
      body: "Aiding India's freedom struggle.",
      icon: 'flag',
    },
    {
      year: '1970',
      title: 'Expansion',
      body: 'Expanding schools and colleges.',
      icon: 'leaderboard',
    },
    {
      year: '1995',
      title: 'Excellence',
      body: 'Quality education and research.',
      icon: 'workspace_premium',
    },
    {
      year: '2015',
      title: 'Transformation',
      body: 'Innovating for global standards.',
      icon: 'computer',
    },
    {
      year: '2026+',
      title: 'Future Ready',
      body: '31+ institutes, 25K+ students.',
      icon: 'rocket_launch',
    },
  ];
}
