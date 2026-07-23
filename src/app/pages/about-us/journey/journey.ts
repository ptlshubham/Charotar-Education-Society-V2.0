import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './journey.scss',
})
export class Journey {
  readonly milestones: ReadonlyArray<{
    year: string;
    title: string;
    body: string;
    path: string[];
  }> = [
    {
      year: '1915',
      title: 'Foundation',
      body: 'CES was founded with a mission to promote education in rural areas.',
      path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M10 21v-6h4v6'],
    },
    {
      year: '1947',
      title: 'Freedom Movement',
      body: "Active participation in India's freedom struggle and nation building.",
      path: ['M4 21V4', 'M4 5h12l-2 4 2 4H4'],
    },
    {
      year: '1970',
      title: 'Expansion',
      body: 'Establishment of schools, colleges and professional institutions.',
      path: ['M3 21h18', 'M7 21V11M12 21V6M17 21v-8'],
    },
    {
      year: '1995',
      title: 'Excellence',
      body: 'Focus on quality education, research & industry collaborations.',
      path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'],
    },
    {
      year: '2015',
      title: 'Transformation',
      body: 'Embracing technology and innovation for global standards.',
      path: ['M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z', 'M8 21h8M12 17v4'],
    },
    {
      year: '2026+',
      title: 'Future Ready',
      body: '31+ institutes, 25K+ students and a legacy that continues.',
      path: ['M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.9.7-2.2-.1-3a2.1 2.1 0 0 0-2.9 0z', 'M12 15l-3-3a20 20 0 0 1 10-10 10 10 0 0 1-4 10 12 12 0 0 1-3 3z', 'M9 12H5s.5-2.7 2-4c1.7-1.4 5 0 5 0'],
    },
  ];
}
