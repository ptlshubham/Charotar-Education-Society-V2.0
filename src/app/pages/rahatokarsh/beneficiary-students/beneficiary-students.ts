import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Student {
  name: string;
  institute: string;
  course: string;
  year: string;
  financialYear: string;
  amount: number;
  status: 'Disbursed' | 'Pending';
}

@Component({
  selector: 'app-beneficiary-students',
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './beneficiary-students.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './beneficiary-students.scss',
})
export class BeneficiaryStudents {
  readonly banner = PLACEHOLDER.about.hero;

  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '1,248', label: 'Total Students', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '22', label: 'Institutes', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: '₹1.85 Cr+', label: 'Total Support (₹)', path: ['M6 3h12M6 8h12M6 13h5a5 5 0 0 0 0-10M6 13l8 8'] },
    { value: '2025-26', label: 'Academic Year', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
  ];

  /** TODO: replace with the live beneficiary feed; these rows come from the design. */
  private readonly all: readonly Student[] = [
    { name: 'Patel Hetal R.', institute: 'M. B. Patel Science College', course: 'B.Sc. (Physics)', year: 'FY', financialYear: '2025-26', amount: 10000, status: 'Disbursed' },
    { name: 'Shah Meet K.', institute: 'Shri V. Z. Patel Commerce College', course: 'B.Com.', year: 'SY', financialYear: '2025-26', amount: 12000, status: 'Disbursed' },
    { name: 'Prajapati Dhruvi M.', institute: 'Shri D. N. College of Education', course: 'B.Ed.', year: 'FY', financialYear: '2025-26', amount: 15000, status: 'Disbursed' },
    { name: 'Rathod Jignesh H.', institute: 'Shri B. P. Arts College', course: 'B.A. (English)', year: 'TY', financialYear: '2025-26', amount: 8000, status: 'Pending' },
    { name: 'Solanki Krupa J.', institute: 'Shri D. N. Institute of Business Administration', course: 'BBA', year: 'FY', financialYear: '2025-26', amount: 18000, status: 'Disbursed' },
    { name: 'Thakor Ravi B.', institute: 'M. B. Patel Science College', course: 'B.Sc. (Chemistry)', year: 'SY', financialYear: '2025-26', amount: 10000, status: 'Disbursed' },
    { name: 'Nayak Priya S.', institute: 'Shri V. L. College of Physical Education', course: 'B.P.Ed.', year: 'FY', financialYear: '2025-26', amount: 12000, status: 'Disbursed' },
    { name: 'Joshi Parth A.', institute: 'Shri D. N. Institute of Computer Applications', course: 'BCA', year: 'TY', financialYear: '2025-26', amount: 15000, status: 'Pending' },
    { name: 'Makwana Neha L.', institute: 'Shri B. P. Arts College', course: 'B.A. (Gujarati)', year: 'SY', financialYear: '2025-26', amount: 8000, status: 'Disbursed' },
    { name: 'Vasava Deepak T.', institute: 'Adhyapan Mandir (Deled College)', course: 'D.El.Ed.', year: 'FY', financialYear: '2025-26', amount: 10000, status: 'Disbursed' },
  ];

  readonly institutes = computed(() => ['All Institutes', ...new Set(this.all.map((s) => s.institute))]);
  readonly courses = computed(() => ['All Courses', ...new Set(this.all.map((s) => s.course))]);
  readonly years = computed(() => ['All Years', ...new Set(this.all.map((s) => s.year))]);

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

  applyFilters(): void {
    this.query.set({
      institute: this.institute,
      course: this.course,
      year: this.year,
      search: this.search.trim().toLowerCase(),
    });
    this.page.set(1);
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all.filter(
      (s) =>
        (q.institute === 'All Institutes' || s.institute === q.institute) &&
        (q.course === 'All Courses' || s.course === q.course) &&
        (q.year === 'All Years' || s.year === q.year) &&
        (!q.search || s.name.toLowerCase().includes(q.search)),
    );
  });

  // ─── Pagination ───
  readonly pageSize = 10;
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
