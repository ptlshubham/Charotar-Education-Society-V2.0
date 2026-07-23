import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-how-we-work',
  templateUrl: './how-we-work.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './how-we-work.scss',
})
export class HowWeWork {
  readonly steps: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    {
      title: 'Identify Needs',
      body: 'Understanding community and student needs',
      path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'],
    },
    {
      title: 'Plan & Design',
      body: 'Designing innovative and sustainable solutions',
      path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'],
    },
    {
      title: 'Implement',
      body: 'Executing projects with passion and precision',
      path: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'],
    },
    {
      title: 'Measure Impact',
      body: 'Measuring outcomes and driving continuous improvement',
      path: ['M3 3v18h18', 'M7 15V9M12 15V6M17 15v-4'],
    },
    {
      title: 'Create Change',
      body: 'Building a better future for all',
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    },
  ];
}
