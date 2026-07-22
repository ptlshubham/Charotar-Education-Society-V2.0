import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-seo',
  imports: [SectionComingSoon],
  templateUrl: './seo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './seo.scss',
})
export class Seo {}
