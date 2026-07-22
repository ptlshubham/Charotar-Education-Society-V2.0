import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AboutHeroSection } from '../about-hero-section/about-hero-section';
import { WhyWeExist } from '../why-we-exist/why-we-exist';
import { FeatureOverview } from '../feature-overview/feature-overview';
import { WeJustFit } from '../we-just-fit/we-just-fit';
import { Feedbacks } from '../feedbacks/feedbacks';
import { AboutFaq } from '../about-faq/about-faq';
import { RightSolution } from '../right-solution/right-solution';

@Component({
  selector: 'app-index',
  imports: [
    AboutHeroSection,
    WhyWeExist,
    FeatureOverview,
    WeJustFit,
    Feedbacks,
    AboutFaq,
    RightSolution,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
