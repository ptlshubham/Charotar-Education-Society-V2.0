import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-social-moments',
  imports: [RouterLink],
  templateUrl: './social-moments.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-moments.scss',
})
export class SocialMoments {
  readonly moments = PLACEHOLDER.social.moments;
}
