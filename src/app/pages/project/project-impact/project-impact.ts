import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-impact',
  templateUrl: './project-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './project-impact.scss',
})
export class ProjectImpact {
  readonly stats: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '8+', label: 'Major Projects', icon: 'assignment' },
    { value: '100+', label: 'Activities Conducted', icon: 'calendar_month' },
    { value: '25K+', label: 'Lives Impacted', icon: 'group' },
    // { value: '20+', label: 'Community Partners', path: ['M11 17 8.5 19.5a2.1 2.1 0 0 1-3-3l6-6a2.1 2.1 0 0 1 3 0l4 4a2.1 2.1 0 0 1-3 3L13 15', 'M3 7l4-4 3 3M21 7l-4-4-3 3'] },
    // { value: '200+', label: 'Volunteers', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    // { value: '7', label: 'Focus Areas', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'] },
  ];
}
