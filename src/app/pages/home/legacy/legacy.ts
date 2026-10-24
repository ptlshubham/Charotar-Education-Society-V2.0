import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../shared/reveal.directive';

/**
 * "The Vision Behind CES" - a tribute to Pujya Shri Vitthalbhai J. Patel: his portrait in a
 * gold-framed card with a name plate, then the headline, his maxim, a short tribute, a link
 * to the full history page and the two tribute-film links.
 */
@Component({
  selector: 'app-legacy',
  imports: [RouterLink, Reveal],
  templateUrl: './legacy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './legacy.scss',
})
export class Legacy {
  /** Portrait of Pujya Shri Vitthalbhai J. Patel, the visionary of CES. */
  readonly portrait = '/assets/images/home/vitthalbhai.png';

  readonly name = 'Shree Vitthalbhai J. Patel';
  readonly title = 'Visionary of CES';

  /** The CES tribute film both play links open. */
  readonly video = 'https://youtu.be/_-ntpkeG7O4';

  readonly quote = 'A model hostel warden who lived by service, simplicity and discipline.';

  readonly paragraphs: readonly string[] = [
    'He joined D.N. High School as a teacher in 1944, fresh from six months in Sabarmati Jail for his part in ' +
      'the Quit India Movement. Over the next 35 years he was hostel warden, principal and secretary, and won ' +
      "the Government of India's best teacher award.",
    'Every 13 January, his birthday, former students from India and abroad come back to CES for the Alumni ' +
      'Meet held in his memory.',
  ];

  readonly films: readonly string[] = [this.name, this.title];
}
