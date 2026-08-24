import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { Stats } from '../stats/stats';
import { Institutes } from '../institutes/institutes';
import { Legacy } from '../legacy/legacy';
import { Academics } from '../academics/academics';
import { MoreThanClassrooms } from '../more-than-classrooms/more-than-classrooms';
import { Milestones } from '../milestones/milestones';
import { Leadership } from '../leadership/leadership';
import { Impact } from '../impact/impact';
import { NewsEvents } from '../news-events/news-events';
import { Announcements } from '../announcements/announcements';
import { FutureCta } from '../future-cta/future-cta';

@Component({
  selector: 'app-index',
  imports: [
    Hero,
    Stats,
    Institutes,
    Legacy,
    Academics,
    MoreThanClassrooms,
    Milestones,
    Leadership,
    Impact,
    NewsEvents,
    Announcements,
    FutureCta,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
