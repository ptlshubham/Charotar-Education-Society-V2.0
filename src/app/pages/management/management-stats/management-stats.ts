import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-management-stats',
  templateUrl: './management-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './management-stats.scss',
})
export class ManagementStats {
  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '110+', label: 'Years of Legacy', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '31+', label: 'Institutes', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: '25K+', label: 'Students', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '1000+', label: 'Faculty', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
    { value: '50+', label: 'Programs', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h6'] },
    { value: '160+', label: 'Research Projects', path: ['M6 9H4.5a2.5 2.5 0 0 1 0-5H6', 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', 'M4 22h16', 'M10 14.7V17a2 2 0 0 1-2 2', 'M14 14.7V17a2 2 0 0 0 2 2', 'M18 2H6v7a6 6 0 0 0 12 0z'] },
  ];
}
