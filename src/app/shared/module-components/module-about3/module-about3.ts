import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ModuleAboutFeature } from '../module-component.interfaces';

@Component({
  selector: 'module-about3',
  imports: [],
  templateUrl: './module-about3.html',
  styleUrl: './module-about3.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAbout3 {
  /** Section title */
  @Input() title = '';

  /** Section description */
  @Input() description = '';

  /** Image displayed in the featured card */
  @Input() image = '';

  /** Feature cards list */
  @Input() features: ModuleAboutFeature[] = [];
}
