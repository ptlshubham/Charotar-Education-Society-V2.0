import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-core-values',
  templateUrl: './core-values.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './core-values.scss',
})
export class CoreValues {
  readonly values: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Discipline', body: 'Building focus and strong character', icon: 'schedule' },
    { title: 'Integrity', body: 'Upholding honesty and transparency', icon: 'shield' },
    { title: 'Excellence', body: 'Striving for the highest standards', icon: 'workspace_premium' },
    { title: 'Service', body: 'Committed to society and the nation', icon: 'favorite' },
    { title: 'Innovation', body: 'Encouraging creativity and new ideas', icon: 'lightbulb' },
    { title: 'Leadership', body: 'Nurturing leaders for tomorrow', icon: 'local_police' },
  ];
}
