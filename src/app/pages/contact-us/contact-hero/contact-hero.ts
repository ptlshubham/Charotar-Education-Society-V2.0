import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-contact-hero',
  imports: [PageHero],
  templateUrl: './contact-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-hero.scss',
})
export class ContactHero {
  readonly heroImage = PLACEHOLDER.about.hero;
}
