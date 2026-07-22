import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { FalconView } from '../falcon-view/falcon-view';
import { PlatformOverview } from '../platform-overview/platform-overview';
import { ChooseZarklyx } from '../choose-zarklyx/choose-zarklyx';
import { CompanyLogos } from '../company-logos/company-logos';
import { Testimonials } from '../testimonials/testimonials';
import { ExpertSolution } from '../expert-solution/expert-solution';
import { TrustedIntegrations } from '../trusted-integrations/trusted-integrations';
import { Faq } from '../faq/faq';
@Component({
  selector: 'app-index',
  imports: [
    Hero,
    FalconView,
    PlatformOverview,
    ChooseZarklyx,
    CompanyLogos,
    Testimonials,
    ExpertSolution,
    TrustedIntegrations,
    Faq,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
