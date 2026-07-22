import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

@Component({
  selector: 'app-cloud-storage',
  imports: [SectionComingSoon],
  templateUrl: './cloud-storage.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cloud-storage.scss',
})
export class CloudStorage {}
