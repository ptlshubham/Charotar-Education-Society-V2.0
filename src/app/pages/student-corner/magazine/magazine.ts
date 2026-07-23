import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Issue {
  name: string;
  years: string;
  cover: string;
}

@Component({
  selector: 'app-magazine',
  imports: [FormsModule],
  templateUrl: './magazine.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './magazine.scss',
})
export class Magazine {
  /** Fanned stack in the hero. */
  readonly PLACEHOLDER_COVER = PLACEHOLDER.magazines[1];
  readonly PLACEHOLDER_COVER2 = PLACEHOLDER.magazines[2];
  readonly PLACEHOLDER_COVER3 = PLACEHOLDER.magazines[0];

  /** TODO: replace with the magazine archive feed; issues taken from the design. */
  private readonly all: readonly Issue[] = [
    { name: 'Balanitra 1.4', years: '2024 – 25', cover: PLACEHOLDER.magazines[0] },
    { name: 'Balanitra 1.3', years: '2023 – 24', cover: PLACEHOLDER.magazines[1] },
    { name: 'Balanitra 1.2', years: '2023 – 23', cover: PLACEHOLDER.magazines[2] },
    { name: 'Balanitra 1.2', years: '2021 – 22', cover: PLACEHOLDER.magazines[3] },
    { name: 'Balanitra 1.1', years: '2020 – 21', cover: PLACEHOLDER.magazines[4] },
    { name: 'Balanitra 9', years: '2019 – 20', cover: PLACEHOLDER.magazines[5] },
    { name: 'Balanitra 8', years: '2018 – 19', cover: PLACEHOLDER.magazines[6] },
    { name: 'Balanitra 7', years: '2017 – 18', cover: PLACEHOLDER.magazines[7] },
    { name: 'Balanitra 6', years: '2016 – 17', cover: PLACEHOLDER.magazines[8] },
    { name: 'Balanitra 5', years: '2015 – 16', cover: PLACEHOLDER.magazines[9] },
    { name: 'Balanitra 4', years: '2014 – 15', cover: PLACEHOLDER.magazines[10] },
    { name: 'Balanitra 3', years: '2013 – 14', cover: PLACEHOLDER.magazines[0] },
  ];

  readonly years = computed(() => ['All Years', ...new Set(this.all.map((i) => i.years))]);
  readonly issues = computed(() => ['All Issues', ...new Set(this.all.map((i) => i.name))]);

  year = 'All Years';
  issue = 'All Issues';
  search = '';

  private readonly query = signal({ year: 'All Years', issue: 'All Issues', search: '' });

  apply(): void {
    this.query.set({ year: this.year, issue: this.issue, search: this.search.trim().toLowerCase() });
    this.page.set(1);
  }

  reset(): void {
    this.year = 'All Years';
    this.issue = 'All Issues';
    this.search = '';
    this.apply();
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all.filter(
      (i) =>
        (q.year === 'All Years' || i.years === q.year) &&
        (q.issue === 'All Issues' || i.name === q.issue) &&
        (!q.search || i.name.toLowerCase().includes(q.search)),
    );
  });

  // ─── Pagination ───
  readonly pageSize = 12;
  readonly page = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.rows().length / this.pageSize)));
  readonly paged = computed(() =>
    this.rows().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize),
  );
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 5),
  );

  go(delta: number): void {
    this.page.update((p) => Math.min(this.totalPages(), Math.max(1, p + delta)));
  }

  toPage(n: number): void {
    this.page.set(n);
  }
}
