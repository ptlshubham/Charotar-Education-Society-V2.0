import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-how-we-work',
  templateUrl: './how-we-work.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './how-we-work.scss',
})
export class HowWeWork {
  readonly steps: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    {
      title: 'Identify Needs',
      body: 'Understanding community and student needs',
      icon: 'lightbulb',
    },
    {
      title: 'Plan & Design',
      body: 'Designing innovative and sustainable solutions',
      icon: 'description',
    },
    {
      title: 'Implement',
      body: 'Executing projects with passion and precision',
      icon: 'light_mode',
    },
    {
      title: 'Measure Impact',
      body: 'Measuring outcomes and driving continuous improvement',
      icon: 'bar_chart',
    },
    {
      title: 'Create Change',
      body: 'Building a better future for all',
      icon: 'group',
    },
  ];
}
