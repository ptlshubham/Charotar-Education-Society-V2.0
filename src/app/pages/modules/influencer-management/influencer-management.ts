import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-influencer-management',
  imports: [SectionComingSoon],
  templateUrl: './influencer-management.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './influencer-management.scss',
})
export class InfluencerManagement {}
