import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ADMISSION_SESSION } from '../../../shared/admissions-cta/admissions-cta';

/**
 * "The Legacy Continues" - closes the Celebration page with a short bridge from the centenary to
 * the Society today (figures as the About page states them), then the way into admissions. It
 * takes the place of the shared admissions banner on this page.
 */
@Component({
  selector: 'app-centenary-legacy',
  imports: [RouterLink],
  templateUrl: './centenary-legacy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-legacy.scss',
})
export class CentenaryLegacy {
  readonly session = ADMISSION_SESSION;
}
