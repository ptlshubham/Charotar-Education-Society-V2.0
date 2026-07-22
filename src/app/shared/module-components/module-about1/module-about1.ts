import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ModuleAboutFeature } from '../module-component.interfaces';

@Component({
  selector: 'module-about1',
  imports: [],
  templateUrl: './module-about1.html',
  styleUrl: './module-about1.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAbout1 {
  /** Section title */
  @Input() title = '';

  /** Section description */
  @Input() description = '';

  /** Image displayed on the left side */
  @Input() image = '';

  /** Feature cards list */
  @Input() features: ModuleAboutFeature[] = [];
}
