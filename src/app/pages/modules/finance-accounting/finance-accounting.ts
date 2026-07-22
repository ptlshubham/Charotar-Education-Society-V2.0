import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-finance-accounting',
  imports: [SectionComingSoon],
  templateUrl: './finance-accounting.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './finance-accounting.scss',
})
export class FinanceAccounting {}
