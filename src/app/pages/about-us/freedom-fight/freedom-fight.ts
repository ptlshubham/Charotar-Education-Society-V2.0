import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-freedom-fight',
  templateUrl: './freedom-fight.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './freedom-fight.scss',
})
export class FreedomFight {
  readonly image = '/assets/images/about/freedom-fighter.jpeg';

  readonly events: ReadonlyArray<{ year: string; title: string; body: string; icon: string }> = [
    {
      year: '1917',
      title: 'Kheda Satyagraha',
      body: 'Supported farmers and communities during Kheda Satyagraha.',
      icon: 'flag',
    },
    {
      year: '1920',
      title: 'Non-Cooperation Movement',
      body: "Actively contributed to Mahatma Gandhi's Non-Cooperation Movement.",
      icon: 'group',
    },
    {
      year: '1942',
      title: 'Quit India Movement',
      body: 'Our leaders and students participated in the Quit India Movement.',
      icon: 'language',
    },
    {
      year: '1947',
      title: "India's Independence",
      body: 'Proud to be part of India\'s independence and nation building.',
      icon: 'lightbulb',
    },
  ];
}
