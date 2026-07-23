import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './presence.scss',
})
export class Presence {
  /** Campus pin positions in the map's 320×260 viewBox. */
  readonly pins: ReadonlyArray<readonly [number, number]> = [
    [92, 96], [136, 78], [178, 104], [116, 130], [160, 146],
    [206, 122], [80, 142], [144, 178], [196, 168], [104, 178],
    [172, 208], [128, 214],
  ];

  readonly breakdown: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '15+ Schools', label: 'Nurturing young minds', path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M10 21v-6h4v6'] },
    { value: '10+ Colleges', label: 'Empowering learners', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 8h2M13 8h2M9 12h2M13 12h2'] },
    { value: '8+ Professional Institutes', label: 'Building future professionals', path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'] },
    { value: '5+ Hostels', label: 'Safe & comfortable living', path: ['M2 20v-8h20v8', 'M2 12V7M22 12V9a1 1 0 0 0-1-1h-9v4'] },
    { value: '3+ Training Centers', label: 'Skill development & training', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
  ];

  readonly numbers: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '110+', label: 'Years of Legacy', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '31+', label: 'Institutes', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: '25K+', label: 'Students', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '1000+', label: 'Faculty', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
    { value: '160+', label: 'Research Projects', path: ['M9 2v6L4.5 17A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.3-4L15 8V2', 'M8 2h8', 'M7 15h10'] },
    { value: '95%', label: 'Student Satisfaction', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm8 12 3 3 5-6'] },
  ];
}
