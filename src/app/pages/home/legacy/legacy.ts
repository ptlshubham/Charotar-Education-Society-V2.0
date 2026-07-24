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

  /**
   * Stylised Anand district silhouette for the 320×200 viewBox — the halftone
   * treatment reads as a map motif, not a survey boundary. Swap for a path
   * traced from real district GeoJSON if an accurate outline is ever needed.
   */
  readonly anandOutline =
    'M150 16 L172 14 L190 24 L206 20 L220 32 L228 48 L244 58 L252 74 L244 88 ' +
    'L256 98 L248 114 L232 120 L236 134 L216 142 L198 138 L184 150 L166 146 ' +
    'L150 158 L134 150 L120 160 L104 150 L96 134 L80 128 L70 136 L56 128 ' +
    'L52 112 L66 104 L74 88 L64 74 L74 60 L92 54 L100 38 L118 34 L130 22 Z';

  /** Anand itself — the hub marker, drawn larger and labelled. */
  readonly hub = { x: 150, y: 92, label: 'Anand' };

  /** The wider institute network, in the same viewBox. */
  readonly pins: ReadonlyArray<readonly [number, number]> = [
    [186, 56], [210, 74], [124, 78], [222, 96], [104, 104],
    [144, 126], [188, 122], [126, 140], [230, 116], [162, 140], [88, 86],
  ];

  readonly pillars: readonly string[] = [
    'Quality Education',
    'Experienced Faculty',
    'Holistic Development',
    'Research & Innovation',
    'Global Perspectives',
  ];
}
