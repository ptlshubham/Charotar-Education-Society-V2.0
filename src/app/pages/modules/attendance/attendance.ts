import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-attendance',
  imports: [SectionComingSoon],
  templateUrl: './attendance.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './attendance.scss',
})
export class Attendance {}
