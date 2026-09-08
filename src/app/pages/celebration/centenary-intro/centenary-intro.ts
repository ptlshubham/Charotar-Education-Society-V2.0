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

  readonly highlights: ReadonlyArray<{ value: string; label: string; icon: string }> = [
    { value: '100 Events', label: 'Across Categories', icon: 'calendar_month' },
    { value: '100 Years', label: 'Of Legacy', icon: 'schedule' },
    { value: 'One Vision', label: 'Bright Future', icon: 'visibility' },
    { value: 'One Family', label: 'Stronger Together', icon: 'group' },
  ];
}
