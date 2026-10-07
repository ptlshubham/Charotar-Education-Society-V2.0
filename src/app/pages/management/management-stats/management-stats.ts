import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { Reveal } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-management-stats',
  // imports: [Reveal],
  templateUrl: './management-stats.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './management-stats.scss',
})
export class ManagementStats {
  readonly stats: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '110+', label: 'Years of Legacy', icon: 'school' },
    { value: '31+', label: 'Institutes', icon: 'apartment' },
    { value: '25K+', label: 'Students', icon: 'groups' },
    { value: '1000+', label: 'Faculty', icon: 'supervisor_account' },
    { value: '50+', label: 'Programs', icon: 'menu_book' },
    { value: '160+', label: 'Research Projects', icon: 'science' },
  ];
}
