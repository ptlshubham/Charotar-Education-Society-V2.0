import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-newsroom',
  imports: [SectionComingSoon],
  templateUrl: './newsroom.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './newsroom.scss',
})
export class Newsroom {}
