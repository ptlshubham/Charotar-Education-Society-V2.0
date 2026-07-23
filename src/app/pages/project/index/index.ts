import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProjectHero } from '../project-hero/project-hero';
import { ProjectList } from '../project-list/project-list';
import { ProjectImpact } from '../project-impact/project-impact';
import { HowWeWork } from '../how-we-work/how-we-work';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [ProjectHero, ProjectList, ProjectImpact, HowWeWork, AdmissionsCta],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
