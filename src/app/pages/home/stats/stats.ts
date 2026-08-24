import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Stat {
  value: string;
  label: string;
  path: string[];
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './stats.scss',
})
export class Stats {
  readonly stats: readonly Stat[] = [
    { value: '110+', label: 'Years of Education', path: ['m3 10 9-6 9 6', 'M4 10v10M20 10v10M9 10v10M15 10v10', 'M2 21h20', 'M2 10h20'] },
    { value: '31+', label: 'Institutes', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '50+', label: 'Courses & Activities', path: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'] },
    { value: '100%', label: 'Satisfaction Rate', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];
}
