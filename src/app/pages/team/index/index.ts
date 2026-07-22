import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TeamHeroSection } from '../team-hero-section/team-hero-section';
import { TechnicalTeam } from '../technical-team/technical-team';
import { RightSolution } from '../../about-us/right-solution/right-solution';

@Component({
  selector: 'app-index',
  imports: [TeamHeroSection, TechnicalTeam, RightSolution],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
