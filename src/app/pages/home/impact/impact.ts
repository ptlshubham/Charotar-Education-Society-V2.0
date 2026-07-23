import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-impact',
  templateUrl: './impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './impact.scss',
})
export class Impact {
  readonly research: ReadonlyArray<{ value: string; label: string }> = [
    { value: '120+', label: 'Research Projects' },
    { value: '15+', label: 'Patents & Grants' },
    { value: '₹ 25 Cr+', label: 'Research Funding' },
    { value: '160+', label: 'Publications' },
  ];

  /** `photo` is optional — the placeholder avatar renders until a portrait is supplied. */
  readonly alumni: ReadonlyArray<{ name: string; role: string; photo?: string }> = [
    { name: 'Krunal Patel', role: 'Microsoft', photo: PLACEHOLDER.alumni[0] },
    { name: 'Dr. Neha Sharma', role: 'AI Researcher', photo: PLACEHOLDER.alumni[1] },
    { name: 'Dipen Shah', role: 'CFO, FevCorp', photo: PLACEHOLDER.alumni[2] },
    { name: 'Aarti Desai', role: 'Social Entrepreneur', photo: PLACEHOLDER.alumni[3] },
  ];
}
