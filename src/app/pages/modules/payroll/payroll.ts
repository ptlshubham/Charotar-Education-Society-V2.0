import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-payroll',
  imports: [SectionComingSoon],
  templateUrl: './payroll.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './payroll.scss',
})
export class Payroll {}
