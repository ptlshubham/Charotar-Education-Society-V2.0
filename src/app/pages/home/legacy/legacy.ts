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

  readonly quote = 'An exemplary householder who insists on service, simplicity and modesty.';

  readonly paragraphs: readonly string[] = [
    'From a young volunteer to a guiding force at CES, Pujya Vitthalbhai Saheb inspired generations through ' +
      'humility, discipline and service.',
    'This tribute celebrates his life, values and enduring contribution to education.',
  ];

  readonly films: readonly string[] = [this.name, this.title];
}
