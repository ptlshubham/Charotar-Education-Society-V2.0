import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-impact',
  templateUrl: './project-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-impact.scss',
})
export class ProjectImpact {
  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '8+', label: 'Major Projects', path: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M9 2h6v4H9z', 'M9 12h6M9 16h4'] },
    { value: '100+', label: 'Activities Conducted', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { value: '25K+', label: 'Lives Impacted', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '20+', label: 'Community Partners', path: ['M11 17 8.5 19.5a2.1 2.1 0 0 1-3-3l6-6a2.1 2.1 0 0 1 3 0l4 4a2.1 2.1 0 0 1-3 3L13 15', 'M3 7l4-4 3 3M21 7l-4-4-3 3'] },
    { value: '200+', label: 'Volunteers', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { value: '7', label: 'Focus Areas', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'] },
  ];
}
