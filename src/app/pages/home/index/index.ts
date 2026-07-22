import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { FalconView } from '../falcon-view/falcon-view';
import { CompanyLogos } from '../company-logos/company-logos';
import { Testimonials } from '../testimonials/testimonials';
import { Faq } from '../faq/faq';
@Component({
  selector: 'app-index',
  imports: [Hero, FalconView, CompanyLogos, Testimonials, Faq],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
