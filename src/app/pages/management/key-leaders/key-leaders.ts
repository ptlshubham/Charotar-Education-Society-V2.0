import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEADERS } from '../../../shared/leaders';
import { Reveal } from '../../../shared/reveal.directive';

@Component({
  selector: 'app-key-leaders',
  imports: [RouterLink, Reveal],
  templateUrl: './key-leaders.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './key-leaders.scss',
})
export class KeyLeaders {
  readonly leaders = LEADERS.map((l) => ({
    name: l.name,
    role: l.position,
    subRole: l.subRole,
    quote: l.quote,
    photo: l.photo,
    link: ['/management', l.role],
  }));
}
