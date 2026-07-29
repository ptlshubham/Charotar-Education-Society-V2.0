import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { Sorter } from '../../../shared/sorting/sorter';
import { SortHeader } from '../../../shared/sorting/sort-header';

interface Paper {
  day: string;
  month: string;
  year: string;
  name: string;
  size: string;
  standard: string;
  subject: string;
}

@Component({
  selector: 'app-answer-key',
  imports: [FormsModule, RouterLink, Pagination, SortHeader],
  templateUrl: './answer-key.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './answer-key.scss',
})
export class AnswerKey {
  readonly lastUpdated = '22 July 2026';

  readonly tab = signal<'general' | 'competitive'>('general');

  selectTab(t: 'general' | 'competitive'): void {
    this.tab.set(t);
  }

  /** TODO: replace with the exam-cell feed; rows transcribed from the design. */
  private readonly all: readonly Paper[] = [
    { day: '16', month: 'Apr', year: '2026', name: 'STD 11 ARTS SAMAHSHASTRA DN MORNING', size: '245 KB', standard: '11', subject: 'SAMAHSHASTRA' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 11 ARTS SAMAHSHASTRA MGV NOON', size: '218 KB', standard: '11', subject: 'SAMAHSHASTRA' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 9 SCIENCE SVP MORNING', size: '232 KB', standard: '9', subject: 'SCIENCE' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 11 ARTS BHUGOL SVP MORNING', size: '206 KB', standard: '11', subject: 'BHUGOL' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 9 SCIENCE DN NOON', size: '219 KB', standard: '9', subject: 'SCIENCE' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 11 ARTS BHUGOL DN NOON', size: '208 KB', standard: '11', subject: 'BHUGOL' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 11 SCIENCE PHYSICS MGV', size: '241 KB', standard: '11', subject: 'PHYSICS' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 9 SCIENCE SVP NOON', size: '299 KB', standard: '9', subject: 'SCIENCE' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 9 SCIENCE KEY MORNING', size: '202 KB', standard: '9', subject: 'SCIENCE' },
    { day: '16', month: 'Apr', year: '2026', name: 'STD 7 ENGLISH DN MORNING', size: '187 KB', standard: '7', subject: 'ENGLISH' },
  ];

  readonly years = computed(() => ['Select Year', ...new Set(this.all.map((p) => p.year))]);
  readonly standards = computed(() => ['Select Standard', ...new Set(this.all.map((p) => p.standard))]);
  readonly subjects = computed(() => ['Select Subject', ...new Set(this.all.map((p) => p.subject))]);

  year = 'Select Year';
  standard = 'Select Standard';
  subject = 'Select Subject';

  private readonly query = signal({ year: 'Select Year', standard: 'Select Standard', subject: 'Select Subject' });

  apply(): void {
    this.query.set({ year: this.year, standard: this.standard, subject: this.subject });
    this.pager.reset();
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all.filter(
      (p) =>
        (q.year === 'Select Year' || p.year === q.year) &&
        (q.standard === 'Select Standard' || p.standard === q.standard) &&
        (q.subject === 'Select Subject' || p.subject === q.subject),
    );
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 10);
}
