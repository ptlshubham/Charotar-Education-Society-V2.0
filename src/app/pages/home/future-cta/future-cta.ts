import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-future-cta',
  imports: [RouterLink],
  templateUrl: './future-cta.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './future-cta.scss',
})
export class FutureCta {}
