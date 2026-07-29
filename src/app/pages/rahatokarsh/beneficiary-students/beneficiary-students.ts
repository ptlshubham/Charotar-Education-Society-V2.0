import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { BeneficiaryStudent } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { Sorter } from '../../../shared/sorting/sorter';
import { SortHeader } from '../../../shared/sorting/sort-header';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/** Stat-card glyphs, kept out of the computed so it stays cheap to recompute. */
const STAT_ICONS = {
  students: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
  institutes: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'],
  support: ['M6 3h12M6 8h12M6 13h5a5 5 0 0 0 0-10M6 13l8 8'],
  year: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'],
};

@Component({
  selector: 'app-beneficiary-students',
  imports: [FormsModule, RouterLink, Pagination, SortHeader],
  templateUrl: './beneficiary-students.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './beneficiary-students.scss',
})
export class BeneficiaryStudents {
  private readonly resources = inject(ResourcesService);

  readonly banner = PLACEHOLDER.about.hero;

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly all = signal<readonly BeneficiaryStudent[]>([]);

  constructor() {
    this.resources
      .getBeneficiaryList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<BeneficiaryStudent[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((rows) => {
        // refundAmount already arrives pre-formatted (e.g. "50%"); store rows as-is.
        this.all.set(Array.isArray(rows) ? rows : []);
        this.loading.set(false);
      });
  }

  // Stat cards computed from the fetched rows, not hard-coded.
  readonly stats = computed(() => {
    const rows = this.all();
    const institutes = new Set(rows.map((r) => r.instituteName).filter(Boolean)).size;
    // refundAmount is a percentage string like "50%"; parse it to average.
    const avgRefund = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + (parseFloat(String(r.refundAmount)) || 0), 0) / rows.length)
      : 0;
    const years = [...new Set(rows.map((r) => r.year).filter(Boolean))].sort();
    return [
      { value: rows.length.toLocaleString('en-IN'), label: 'Total Students', path: STAT_ICONS.students },
      { value: String(institutes), label: 'Institutes', path: STAT_ICONS.institutes },
      { value: avgRefund + '%', label: 'Average Refund', path: STAT_ICONS.support },
      { value: years.at(-1) ?? '—', label: 'Latest Year', path: STAT_ICONS.year },
    ];
  });

  readonly institutes = computed(() => [
    'All Institutes',
    ...[...new Set(this.all().map((s) => s.instituteName).filter(Boolean))].sort(),
  ]);
  readonly courses = computed(() => [
    'All Courses',
    ...[...new Set(this.all().map((s) => s.course).filter(Boolean))].sort(),
  ]);
  readonly years = computed(() => [
    'All Years',
    ...[...new Set(this.all().map((s) => s.year).filter(Boolean))].sort(),
  ]);

  institute = 'All Institutes';
  course = 'All Courses';
  year = 'All Years';
  search = '';

  private readonly query = signal({
    institute: 'All Institutes',
    course: 'All Courses',
    year: 'All Years',
    search: '',
  });

  readonly rows = computed(() => {
    const q = this.query();
    return this.all().filter(
      (s) =>
        (q.institute === 'All Institutes' || s.instituteName === q.institute) &&
        (q.course === 'All Courses' || s.course === q.course) &&
        (q.year === 'All Years' || s.year === q.year) &&
        (!q.search || (s.studentName || '').toLowerCase().includes(q.search)),
    );
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 25);

  applyFilters(): void {
    this.query.set({
      institute: this.institute,
      course: this.course,
      year: this.year,
      search: this.search.trim().toLowerCase(),
    });
    this.pager.reset();
  }
}
