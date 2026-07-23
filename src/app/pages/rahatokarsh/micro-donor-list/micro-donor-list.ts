import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MicroDonor {
  date: string;
  name: string;
  city: string;
  amount: number;
  type: string;
}

@Component({
  selector: 'app-micro-donor-list',
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './micro-donor-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './micro-donor-list.scss',
})
export class MicroDonorList {
  /** TODO: replace with the live micro-donor feed; these rows come from the legacy site. */
  private readonly all: readonly MicroDonor[] = [
    { date: 'Jul 20, 2026', name: 'VRAJ KALPESHKUMAR JOSHI', city: 'ANAND', amount: 100, type: 'Online' },
    { date: 'Jul 19, 2026', name: 'HETALBEN VIPULBHAI PATEL', city: 'ANAND', amount: 100, type: 'Online' },
    { date: 'Jul 19, 2026', name: 'KIRITKUMAR GUNVANTLAL YAGNIK', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 19, 2026', name: 'DARSHAN V RAJANI', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 19, 2026', name: 'JAYESH HARESHBHAI SHAH & FAMILY', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 19, 2026', name: 'RAMESHBHAI GIRISHBHAI PATEL & FAMILY', city: 'ANAND', amount: 100, type: 'Online' },
    { date: 'Jul 18, 2026', name: 'Parth Aashish Chavda', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 18, 2026', name: 'JAY KACHHADIYA', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 18, 2026', name: 'DIPAK KIRITKUMAR PATEL', city: 'ANAND', amount: 50, type: 'Online' },
    { date: 'Jul 18, 2026', name: 'BHAVIK NAYAK', city: 'ANAND', amount: 50, type: 'Online' },
  ];

  readonly totalMicroDonors = '5,842';

  readonly filtersOpen = signal(false);
  search = '';
  private readonly query = signal('');

  toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  applyFilters(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.page.set(1);
  }

  readonly rows = computed(() => {
    const q = this.query();
    return q ? this.all.filter((d) => d.name.toLowerCase().includes(q)) : this.all;
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
