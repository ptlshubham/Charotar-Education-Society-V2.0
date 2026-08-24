import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Opportunity {
  title: string;
  sub: string;
  link: string;
  path: string[];
}

@Component({
  selector: 'app-academics',
  imports: [RouterLink],
  templateUrl: './academics.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './academics.scss',
})
export class Academics {
  readonly opportunities: readonly Opportunity[] = [
    { title: 'Schools', sub: 'Shape young minds.', link: '/academic/school', path: ['m3 10 9-7 9 7', 'M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9', 'M9 21v-6h6v6'] },
    { title: 'Colleges', sub: 'Build professional futures.', link: '/academic/colleges', path: ['m3 10 9-6 9 6', 'M4 10v10M20 10v10M9 10v10M15 10v10', 'M2 21h20', 'M2 10h20'] },
    { title: 'Professional Institutes', sub: 'Develop specialized skills.', link: '/academic/others', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { title: 'Hostels', sub: 'A supportive campus experience.', link: '/academic/hostels', path: ['M2 4v16', 'M2 8h18a2 2 0 0 1 2 2v10', 'M2 17h20', 'M6 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2'] },
    { title: 'Other Institutes', sub: 'Explore diverse opportunities.', link: '/academic/others', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];
}
