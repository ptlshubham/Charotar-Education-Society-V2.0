import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-social-impact',
  imports: [RouterLink],
  templateUrl: './social-impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-impact.scss',
})
export class SocialImpact {
  // TODO: placeholder figures - replace with the numbers CES confirms.
  readonly stats: ReadonlyArray<{ value: string; label: string; accent?: boolean }> = [
    { value: '100+', label: 'Activities Organized' },
    { value: '25K+', label: 'People Benefited', accent: true },
    { value: '150+', label: 'Community Partners' },
    { value: '500+', label: 'Volunteers Engaged' },
    { value: '1,000+', label: 'Students Involved' },
    { value: '1,500+', label: 'Meals Distributed' },
  ];
}
