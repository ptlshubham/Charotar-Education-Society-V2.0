import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LeadershipHero } from '../leadership-hero/leadership-hero';
import { KeyLeaders } from '../key-leaders/key-leaders';
import { ManagementStats } from '../management-stats/management-stats';
import { ManagementMembers } from '../management-members/management-members';
import { LeadershipValues } from '../leadership-values/leadership-values';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [
    LeadershipHero,
    KeyLeaders,
    ManagementStats,
    ManagementMembers,
    LeadershipValues,
    AdmissionsCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
