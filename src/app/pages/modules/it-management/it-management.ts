import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-it-management',
  imports: [SectionComingSoon],
  templateUrl: './it-management.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './it-management.scss',
})
export class ItManagement {}
