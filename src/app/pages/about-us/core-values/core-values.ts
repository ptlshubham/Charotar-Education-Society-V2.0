import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-core-values',
  templateUrl: './core-values.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './core-values.scss',
})
export class CoreValues {
  readonly values: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Discipline', body: 'Building focus and strong character', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'] },
    { title: 'Integrity', body: 'Upholding honesty and transparency', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { title: 'Excellence', body: 'Striving for the highest standards', path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { title: 'Service', body: 'Committed to society and the nation', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { title: 'Innovation', body: 'Encouraging creativity and new ideas', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { title: 'Leadership', body: 'Nurturing leaders for tomorrow', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'm19 3 1.5 3L24 6.5l-2.5 2.2.6 3.3L19 10.4l-3.1 1.6.6-3.3L14 6.5 17.5 6z'] },
  ];
}
