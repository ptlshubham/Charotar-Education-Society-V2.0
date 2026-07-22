import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-bills-utility',
  imports: [SectionComingSoon],
  templateUrl: './bills-utility.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bills-utility.scss',
})
export class BillsUtility {}
