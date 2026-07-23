import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AlumniHero } from '../alumni-hero/alumni-hero';
import { AlumniBenefits } from '../alumni-benefits/alumni-benefits';
import { AlumniForm } from '../alumni-form/alumni-form';

@Component({
  selector: 'app-index',
  imports: [AlumniHero, AlumniBenefits, AlumniForm],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
