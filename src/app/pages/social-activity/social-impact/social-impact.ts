import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-social-impact',
  templateUrl: './social-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-impact.scss',
})
export class SocialImpact {
  readonly stats: ReadonlyArray<{ value: string; label: string; description: string; icon: string }> = [
    { value: '100+', label: 'Activities Organized', description: 'Events and initiatives that create lasting community impact.', icon: 'calendar_month' },
    { value: '25K+', label: 'People Benefited', description: 'Lives touched and empowered through our programs.', icon: 'group' },
    { value: '150+', label: 'Community Partners', description: 'Collaborations that strengthen communities and drive change.', icon: 'handshake' },
    { value: '500+', label: 'Volunteers Engaged', description: 'Passionate volunteers contributing their time and skills.', icon: 'favorite' },
    { value: '1,000+', label: 'Students Involved', description: 'Young minds inspired and supported for a better tomorrow.', icon: 'school' },
    { value: '1,500+', label: 'Meals Distributed', description: 'Nutritious meals provided to those who need it most.', icon: 'restaurant' },
  ];
}
