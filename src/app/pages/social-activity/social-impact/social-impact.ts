import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-social-impact',
  templateUrl: './social-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-impact.scss',
})
export class SocialImpact {
  readonly stats: ReadonlyArray<{ value: string; label: string; description: string; path: string[] }> = [
    { value: '100+', label: 'Activities Organized', description: 'Events and initiatives that create lasting community impact.', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { value: '25K+', label: 'People Benefited', description: 'Lives touched and empowered through our programs.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '150+', label: 'Community Partners', description: 'Collaborations that strengthen communities and drive change.', path: ['m11 17 2 2a1 1 0 1 0 3-3', 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2.8 2.8 0 0 1 4 0l4 4', 'm21 3-2.7 2.7a2 2 0 0 1-2.8 0l-1-1a2 2 0 0 1 0-2.8L17 0', 'M3 7l4-4 4 4'] },
    { value: '500+', label: 'Volunteers Engaged', description: 'Passionate volunteers contributing their time and skills.', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { value: '1,000+', label: 'Students Involved', description: 'Young minds inspired and supported for a better tomorrow.', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '1,500+', label: 'Meals Distributed', description: 'Nutritious meals provided to those who need it most.', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
  ];
}
