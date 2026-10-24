import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEADERS } from '../../../shared/leaders';

/** The Chairman's and Secretary's messages; "Read Message" opens each one's own page. */
@Component({
  selector: 'app-messages',
  imports: [RouterLink],
  templateUrl: './messages.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './messages.scss',
})
export class Messages {
  readonly leaders = LEADERS;
}
