import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-freedom-fight',
  templateUrl: './freedom-fight.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './freedom-fight.scss',
})
export class FreedomFight {
  readonly image = PLACEHOLDER.about.freedomFight;

  readonly events: ReadonlyArray<{ year: string; title: string; body: string; path: string[] }> = [
    {
      year: '1917',
      title: 'Kheda Satyagraha',
      body: 'Supported farmers and communities during Kheda Satyagraha.',
      path: ['M4 21V4', 'M4 5h12l-2 4 2 4H4'],
    },
    {
      year: '1920',
      title: 'Non-Cooperation Movement',
      body: "Actively contributed to Mahatma Gandhi's Non-Cooperation Movement.",
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
    },
    {
      year: '1942',
      title: 'Quit India Movement',
      body: 'Our leaders and students participated in the Quit India Movement.',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z'],
    },
    {
      year: '1947',
      title: "India's Independence",
      body: 'Proud to be part of India\'s independence and nation building.',
      path: ['M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z', 'M9 21h6', 'M10 17v4M14 17v4'],
    },
  ];
}
