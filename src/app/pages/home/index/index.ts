import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { Institutes } from '../institutes/institutes';
import { Legacy } from '../legacy/legacy';
import { Academics } from '../academics/academics';
import { Milestones } from '../milestones/milestones';
import { Leadership } from '../leadership/leadership';
import { Impact } from '../impact/impact';
import { NewsEvents } from '../news-events/news-events';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { Categories } from '../categories/categories';
import { NoticeTicker } from '../notice-ticker/notice-ticker';
import { Stats } from '../stats/stats';

@Component({
  selector: 'app-home-index',
  imports: [
    Categories,
    Hero,
    NoticeTicker,
    Institutes,
    Stats,
    Legacy,
    Academics,
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
