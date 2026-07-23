import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SocialHero } from '../social-hero/social-hero';
import { SocialActivities } from '../social-activities/social-activities';
import { SocialImpact } from '../social-impact/social-impact';
import { SocialMoments } from '../social-moments/social-moments';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [SocialHero, SocialActivities, SocialImpact, SocialMoments, AdmissionsCta],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
