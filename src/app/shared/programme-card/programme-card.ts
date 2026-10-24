import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgrammeKind, ProgrammeSummary } from '../programme';

/** One project's or activity's card: picture, title, short description and a link to its page. */
@Component({
  selector: 'app-programme-card',
  imports: [RouterLink],
  templateUrl: './programme-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './programme-card.scss',
  host: { class: 'flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white' },
})
export class ProgrammeCard {
  @Input({ required: true }) item!: ProgrammeSummary;
  @Input({ required: true }) kind!: ProgrammeKind;
}
