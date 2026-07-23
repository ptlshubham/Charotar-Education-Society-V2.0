import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admissions-cta',
  imports: [RouterLink],
  templateUrl: './admissions-cta.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admissions-cta.scss',
})
export class AdmissionsCta {}
