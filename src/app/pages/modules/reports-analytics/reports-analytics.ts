import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-reports-analytics',
  imports: [SectionComingSoon],
  templateUrl: './reports-analytics.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './reports-analytics.scss',
})
export class ReportsAnalytics {}
