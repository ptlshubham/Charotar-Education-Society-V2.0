import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-leadership-values',
  imports: [],
  templateUrl: './leadership-values.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership-values.scss',
})
export class LeadershipValues {
  readonly values: ReadonlyArray<{ title: string; icon: string }> = [
    { title: 'Visionary Leadership', icon: 'lightbulb' },
    { title: 'Integrity & Transparency', icon: 'gpp_good' },
    { title: 'Commitment to Excellence', icon: 'workspace_premium' },
    { title: 'Innovation & Growth', icon: 'trending_up' },
    { title: 'Service to Society', icon: 'favorite_border' },
  ];
}
