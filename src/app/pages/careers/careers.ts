import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../shared/placeholder-images';

interface Opening {
  post: string;
  code: string;
  department: string;
  lastDate: string;
}

@Component({
  selector: 'app-careers',
  imports: [FormsModule, RouterLink],
  templateUrl: './careers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './careers.scss',
})
export class Careers {
  readonly banner = PLACEHOLDER.about.hero;

  readonly values: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Purpose Driven', body: 'Make a meaningful impact through quality education.', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v8M8 12h8'] },
    { title: 'Growth & Learning', body: 'Continuous opportunities for personal and professional growth.', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { title: 'Inclusive Culture', body: 'A collaborative and respectful environment for all.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];

  /** TODO: replace with the recruitment feed. */
  private readonly all: readonly Opening[] = [
    { post: 'Principal', code: 'CES/PRINCIPAL/2024-25/01', department: 'Charotar Education Society (Institute Level)', lastDate: '10 Aug 2025' },
    { post: 'Assistant Professor', code: 'CES/ASSTPROF/2024-25/02', department: 'Various Institutes', lastDate: '15 Aug 2025' },
    { post: 'Lab Assistant', code: 'CES/LABASST/2024-25/03', department: 'Science Institutes', lastDate: '18 Aug 2025' },
    { post: 'Non-Teaching Staff (Clerk)', code: 'CES/CLERK/2024-25/04', department: 'Administrative Office', lastDate: '20 Aug 2025' },
    { post: 'Accountant', code: 'CES/ACCT/2024-25/05', department: 'Charotar Education Society', lastDate: '22 Aug 2025' },
  ];

  search = '';
  private readonly query = signal('');

  apply(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.page.set(1);
  }

  readonly rows = computed(() => {
    const q = this.query();
    return q
      ? this.all.filter((o) => o.post.toLowerCase().includes(q) || o.department.toLowerCase().includes(q))
      : this.all;
  });

  // ─── Pagination ───
  readonly pageSize = 5;
  readonly page = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.rows().length / this.pageSize)));
  readonly paged = computed(() =>
    this.rows().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize),
  );
  readonly rangeStart = computed(() => (this.rows().length ? (this.page() - 1) * this.pageSize + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.rows().length));
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
