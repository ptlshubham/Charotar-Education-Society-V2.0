import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-freedom-fight',
  templateUrl: './freedom-fight.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './freedom-fight.scss',
})
export class FreedomFight {
  readonly image = '/assets/images/about/freedom-fighter.webp';

  readonly events: ReadonlyArray<{ year: string; title: string; body: string }> = [
    {
      year: '1917-18',
      title: 'Kheda Satyagraha',
      body: "D.N. High School's 195 students were encouraged to stand with Kheda's farmers.",
    },
    {
      year: '1919-20',
      title: 'Non-Cooperation Movement',
      body: 'The school joined Gujarat Vidyapith and students picketed shops selling foreign goods.',
    },
    {
      year: '1930',
      title: 'Dandi March',
      body: 'Gandhiji camped at Anand and spoke to 20,000 people on the CES ground.',
    },
    {
      year: '1942',
      title: 'Quit India Movement',
      body: 'Principal Ishwarbhai J. Patel resigned to join the movement. The school stayed shut for six months.',
    },
  ];
}
