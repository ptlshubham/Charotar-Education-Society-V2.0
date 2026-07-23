import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Donor {
  date: string;
  name: string;
  city: string;
  amount: number;
  type: string;
}

@Component({
  selector: 'app-donor-list',
  imports: [DecimalPipe, FormsModule, RouterLink],
  templateUrl: './donor-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './donor-list.scss',
})
export class DonorList {
  /** TODO: replace with the live donor feed; these rows come from the legacy site. */
  private readonly all: readonly Donor[] = [
    { date: 'May 22, 2024', name: 'PANCHAM KUMAR PATEL', city: 'ANAND', amount: 11001, type: 'Online' },
    { date: 'May 21, 2024', name: 'URVASHIBEN PATEL', city: 'SURENDRANAGAR', amount: 5101, type: 'Online' },
    { date: 'May 21, 2024', name: 'OM INSTITUTE OF RESEARCH & ANALYTICS PVT.LTD.', city: 'AHMEDABAD', amount: 41151, type: 'Online' },
    { date: 'May 18, 2024', name: 'DR. VIPUL PATEL', city: 'VADODARA', amount: 6001, type: 'Online' },
    { date: 'May 16, 2024', name: 'KAKADE MICRO-CHEMICALS GUJARAT PVT.LTD.', city: 'VADODARA', amount: 50001, type: 'Online' },
    { date: 'May 15, 2024', name: 'CHOKSHI LAB PVT.LTD.', city: 'ANAND', amount: 100001, type: 'Online' },
    { date: 'Apr 28, 2024', name: 'NILKANTH PAREKH', city: 'vadodara', amount: 151001, type: 'Online' },
    { date: 'Apr 11, 2024', name: 'PATEL KRISHNA ANAND BHAI', city: 'ANAND', amount: 6001, type: 'Online' },
    { date: 'Apr 11, 2024', name: 'YASH SOMANI', city: 'VADODARA', amount: 10001, type: 'Online' },
    { date: 'Apr 11, 2024', name: 'GCM CORPORATION', city: 'GOA', amount: 5001, type: 'Online' },
  ];

  readonly totalDonors = '1,248';
  readonly totalAmount = '₹1.85 Cr+';

  readonly donorTypes: readonly string[] = ['All Donors', 'Individual', 'Organisation'];
  readonly cities = computed(() => ['All Cities', ...new Set(this.all.map((d) => d.city.toUpperCase()))]);

  dateRange = '';
  donorType = 'All Donors';
  city = 'All Cities';
  search = '';

  private readonly query = signal({ city: 'All Cities', search: '' });

  applyFilters(): void {
    this.query.set({ city: this.city, search: this.search.trim().toLowerCase() });
    this.page.set(1);
  }

  readonly rows = computed(() => {
    const { city, search } = this.query();
    return this.all.filter(
      (d) =>
        (city === 'All Cities' || d.city.toUpperCase() === city) &&
        (!search || d.name.toLowerCase().includes(search)),
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

  go(delta: number): void {
    this.page.update((p) => Math.min(this.totalPages(), Math.max(1, p + delta)));
  }

  toPage(n: number): void {
    this.page.set(n);
  }

  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 5),
  );
}
