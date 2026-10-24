import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { leaderByRole } from '../../../shared/leaders';
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
  private readonly leader = leaderByRole('secretary')!;

  readonly secretary: Leader = {
    name: this.leader.name,
    role: this.leader.title,
    quote: this.leader.quote,
    photo: this.leader.photo,
  };
}
