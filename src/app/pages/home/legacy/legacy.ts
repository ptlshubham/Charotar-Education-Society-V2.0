import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-legacy',
  imports: [RouterLink],
  templateUrl: './legacy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './legacy.scss',
})
export class Legacy {
  readonly milestones: ReadonlyArray<{ year: string; label: string; path: string[] }> = [
    {
      year: '1916',
      label: 'Foundation of CES',
      path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M10 21v-6h4v6'],
    },
    {
      year: '1950s',
      label: 'Expansion of Educational Institutes',
      path: ['M3 21h18', 'M6 21V8h5v13M13 21V12h5v9', 'M8 11h1M8 14h1M15 15h1'],
    },
    {
      year: '1980s',
      label: 'Holistic Learning Environment',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
    },
    {
      year: '2000s',
      label: 'Excellence in Academics & Research',
      path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'],
    },
    {
      year: 'Today',
      label: 'Empowering Generations for Tomorrow',
      path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
    },
  ];

  /** Campus pin positions in the map's 320×200 viewBox. */
  readonly pins: ReadonlyArray<readonly [number, number]> = [
    [96, 78], [140, 62], [186, 80], [122, 108], [166, 120],
    [212, 96], [84, 118], [150, 150], [200, 142], [110, 148],
    [236, 70], [176, 172],
  ];

  readonly pillars: readonly string[] = [
    'Quality Education',
    'Experienced Faculty',
    'Holistic Development',
    'Research & Innovation',
    'Global Perspectives',
  ];
}
