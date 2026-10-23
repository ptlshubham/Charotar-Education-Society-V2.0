import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../shared/reveal.directive';

interface Leader {
  name: string;
  role: string;
  quote: string;
  photo: string;
}

/**
 * "Message from the Secretary" - a full-width navy feature: headline, the Secretary's message,
 * name and role, and a link to the full message on the Management page; his portrait on the
 * right in a gold corner frame.
 */
@Component({
  selector: 'app-leadership',
  imports: [RouterLink, Reveal],
  templateUrl: './leadership.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leadership.scss',
})
export class Leadership {
  // Kept in step with the Management page (key-leaders).
  readonly secretary: Leader = {
    name: 'Shri Ketankumar P. Patel',
    role: 'Secretary, CES',
    quote: 'Education is the most powerful tool to transform individuals and society. We remain committed to excellence in all that we do.',
    photo: '/assets/images/directors/vc.jpg',
  };
}
