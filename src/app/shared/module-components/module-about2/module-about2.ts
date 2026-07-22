import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ModuleAboutFeature, ModuleAboutStat } from '../module-component.interfaces';

@Component({
  selector: 'module-about2',
  imports: [],
  templateUrl: './module-about2.html',
  styleUrl: './module-about2.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAbout2 {
  /** Section title */
  @Input() title = '';

  /** Section description */
  @Input() description = '';

  /** Full-width image */
  @Input() image = '';

  /** Feature cards list */
  @Input() features: ModuleAboutFeature[] = [];

  /** Stats row (e.g. "500+", "Clients") */
  @Input() stats: ModuleAboutStat[] = [];
}
