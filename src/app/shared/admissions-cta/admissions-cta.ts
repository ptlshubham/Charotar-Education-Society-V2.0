import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The Society was founded in 1916 - the seal's years move on by themselves. */
const FOUNDED = 1916;

/** The admission session on offer - also named by the Celebration page's closing section. */
export const ADMISSION_SESSION = '2026-27';

/**
 * "Admissions Open" call-to-action, shared by the home, about, celebration, management,
 * project and social-activity pages. Navy message side - the session, the facts an applicant
 * looks for, and two ways to get in touch (the contact page, or a call to the Society's
 * office) - beside a cream heritage panel: the years since 1916 over a line drawing of
 * D.N. High School, Anand.
 */
@Component({
  selector: 'app-admissions-cta',
  imports: [RouterLink],
  templateUrl: './admissions-cta.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admissions-cta.scss',
})
export class AdmissionsCta {
  readonly session = ADMISSION_SESSION;
  readonly years = new Date().getFullYear() - FOUNDED;

  /** Same office number as the header and footer. */
  readonly phone = '(02692) 243083';
  readonly phoneHref = 'tel:02692243083';

  /** As the site states them elsewhere (institutes section, programmes, stats). */
  // readonly facts: readonly string[] = ['31+ Institutes', 'Pre-Primary to Ph.D.', 'Since 1916'];
}
