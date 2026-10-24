import { ChangeDetectionStrategy, Component } from '@angular/core';

/** "How We Work" - the five steps every project follows, numbered left to right. */
@Component({
  selector: 'app-how-we-work',
  templateUrl: './how-we-work.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './how-we-work.scss',
})
export class HowWeWork {
  readonly steps: ReadonlyArray<{ title: string; body: string }> = [
    { title: 'Identify Needs', body: 'Understand community and student needs.' },
    { title: 'Plan & Design', body: 'Design innovative and sustainable solutions.' },
    { title: 'Implement', body: 'Execute projects with passion and precision.' },
    { title: 'Measure Impact', body: 'Track outcomes and drive continuous improvement.' },
    { title: 'Create Change', body: 'Build a better future for all.' },
  ];

  /** "01" … "05" */
  pad(n: number): string { return String(n).padStart(2, '0'); }
}
