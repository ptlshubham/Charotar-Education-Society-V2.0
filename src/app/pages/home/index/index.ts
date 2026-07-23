import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { Stats } from '../stats/stats';
import { Institutes } from '../institutes/institutes';
import { Academics } from '../academics/academics';
import { Legacy } from '../legacy/legacy';
import { Leadership } from '../leadership/leadership';
import { Impact } from '../impact/impact';
import { NewsEvents } from '../news-events/news-events';
import { Announcements } from '../announcements/announcements';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';

@Component({
  selector: 'app-index',
  imports: [
    Hero,
    Stats,
    Institutes,
    Academics,
    Legacy,
    Leadership,
    Impact,
    NewsEvents,
    Announcements,
    AdmissionsCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
