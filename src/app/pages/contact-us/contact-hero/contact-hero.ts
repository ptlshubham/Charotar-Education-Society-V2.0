import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-contact-hero',
  imports: [RouterLink],
  templateUrl: './contact-hero.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-hero.scss',
})
export class ContactHero {
  readonly heroImage = PLACEHOLDER.about.hero;

}
