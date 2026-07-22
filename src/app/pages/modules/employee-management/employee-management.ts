import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-employee-management',
  imports: [SectionComingSoon],
  templateUrl: './employee-management.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './employee-management.scss',
})
export class EmployeeManagement {}
