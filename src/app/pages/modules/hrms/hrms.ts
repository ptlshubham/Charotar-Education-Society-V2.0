import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-hrms',
  imports: [SectionComingSoon],
  templateUrl: './hrms.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hrms.scss',
})
export class Hrms {}
