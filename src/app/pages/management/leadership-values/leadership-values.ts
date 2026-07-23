import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-leadership-values',
  templateUrl: './leadership-values.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership-values.scss',
})
export class LeadershipValues {
  readonly values: ReadonlyArray<{ title: string; path: string[] }> = [
    { title: 'Visionary Leadership', path: ['M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z', 'M9 21h6', 'M10 17v4M14 17v4'] },
    { title: 'Integrity & Transparency', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { title: 'Commitment to Excellence', path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { title: 'Innovation & Growth', path: ['M3 3v18h18', 'm19 9-5 5-4-4-4 4'] },
    { title: 'Service to Society', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
  ];
}
