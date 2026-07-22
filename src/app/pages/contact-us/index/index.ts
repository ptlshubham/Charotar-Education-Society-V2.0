import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContactHeroSection } from '../contact-hero-section/contact-hero-section';
import { WeHelpYou } from '../we-help-you/we-help-you';
import { FindRightTeam } from '../find-right-team/find-right-team';
import { GenerateToken } from '../generate-token/generate-token';
import { ContactUsFaq } from '../contact-us-faq/contact-us-faq';
import { RightSolution } from '../../about-us/right-solution/right-solution';

@Component({
  selector: 'app-index',
  imports: [
    ContactHeroSection,
    WeHelpYou,
    FindRightTeam,
    GenerateToken,
    ContactUsFaq,
    RightSolution,
  ],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
