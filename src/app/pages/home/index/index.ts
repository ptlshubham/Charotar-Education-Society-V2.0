import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { Institutes } from '../institutes/institutes';
import { Legacy } from '../legacy/legacy';
import { Academics } from '../academics/academics';
import { MoreThanClassrooms } from '../more-than-classrooms/more-than-classrooms';
import { Milestones } from '../milestones/milestones';
import { Leadership } from '../leadership/leadership';
import { Impact } from '../impact/impact';
import { NewsEvents } from '../news-events/news-events';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { Categories } from '../categories/categories';

@Component({
  selector: 'app-home-index',
  imports: [
    Categories,
    Hero,
    Institutes,
    Legacy,
    Academics,
    MoreThanClassrooms,
    Milestones,
    Leadership,
    Impact,
    NewsEvents,
    AdmissionsCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
