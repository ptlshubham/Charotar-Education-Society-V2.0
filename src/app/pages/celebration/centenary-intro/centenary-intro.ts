import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type TabId = 'english' | 'gujarati' | 'guinness';

@Component({
  selector: 'app-centenary-intro',
  templateUrl: './centenary-intro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-intro.scss',
})
export class CentenaryIntro {
  readonly tabs: ReadonlyArray<{ id: TabId; label: string }> = [
    { id: 'english', label: 'English' },
    { id: 'gujarati', label: 'Gujarati' },
    { id: 'guinness', label: 'Guinness World Record' },
  ];

  readonly active = signal<TabId>('english');

  select(id: TabId): void {
    this.active.set(id);
  }

  readonly english: readonly string[] = [
    'Charotar Education Society (CES) completed 100 years of establishment from April 2015 to April 2016. To commemorate this historic milestone, CES organized 100 events across diverse categories including academic, social, health, sports, fair, festival and cultural activities with the goal to raise intelligent, emotional and spiritual quotient of the students.',
    'This centenary celebration was not just a journey of events, but a movement of unity, service and pride that brought together students, staff, alumni, well-wishers and the entire community.',
  ];

  /** TODO: awaiting the official Gujarati copy from CES — see PLACEHOLDER-IMAGES.md. */
  readonly gujarati: readonly string[] = [];

  readonly guinness: readonly string[] = [
    'CES set 6 Guinness World Records during the centenary year, creating history and bringing pride to the institution and the nation.',
  ];

  readonly highlights: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '100 Events', label: 'Across Categories', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { value: '100 Years', label: 'Of Legacy', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'] },
    { value: 'One Vision', label: 'Bright Future', path: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'] },
    { value: 'One Family', label: 'Stronger Together', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];
}
