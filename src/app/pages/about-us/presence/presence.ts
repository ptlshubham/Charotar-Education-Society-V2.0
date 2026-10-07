import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './presence.scss',
})
export class Presence {
  /** Campus pin positions in the map's 320×260 viewBox. */
  readonly pins: ReadonlyArray<readonly [number, number]> = [
    [92, 96], [136, 78], [178, 104], [116, 130], [160, 146],
    [206, 122], [80, 142], [144, 178], [196, 168], [104, 178],
    [172, 208], [128, 214],
  ];

  readonly breakdown: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '15+', label: 'Schools', icon: 'account_balance' },
    { value: '10+', label: 'Colleges', icon: 'apartment' },
    { value: '8+', label: 'Professional Institutes', icon: 'work' },
    { value: '5+', label: 'Hostels', icon: 'bed' },
    { value: '3+', label: 'Training Centers', icon: 'school' },
    { value: '25K+', label: 'Students', icon: 'groups' },
  ];

  readonly numbers: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '110+', label: 'Years of Legacy', icon: 'school' },
    { value: '31+', label: 'Institutes', icon: 'apartment' },
    { value: '25K+', label: 'Students', icon: 'groups' },
    { value: '1000+', label: 'Faculty', icon: 'person' },
    { value: '160+', label: 'Research Projects', icon: 'science' },
    { value: '95%', label: 'Student Satisfaction', icon: 'check_circle' },
  ];
}
