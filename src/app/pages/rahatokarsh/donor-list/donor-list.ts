import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DecimalPipe, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { Donor } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { Sorter } from '../../../shared/sorting/sorter';
import { SortHeader } from '../../../shared/sorting/sort-header';

@Component({
  selector: 'app-donor-list',
  imports: [DecimalPipe, FormsModule, RouterLink, Pagination, SortHeader],
  templateUrl: './donor-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './donor-list.scss',
})
export class DonorList {
  private readonly resources = inject(ResourcesService);

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly all = signal<readonly Donor[]>([]);

  constructor() {
    this.resources
      .getDonorList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<Donor[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((rows) => {
        // Normalise amount to a real number — some legacy rows send it as a
        // string/null, which DecimalPipe (| number) rejects with NG02100.
        this.all.set(
          (Array.isArray(rows) ? rows : []).map((r) => ({ ...r, amount: Number(r.amount) || 0 })),
        );
        this.loading.set(false);
      });
  }

  // Totals are derived from the fetched rows, not hard-coded.
  /** Formats a DB date, tolerating null/empty/unparseable values (some legacy
   *  rows carry blank or malformed dates — DatePipe would throw NG02100). */
  displayDate(value: string): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }

  readonly totalDonors = computed(() => this.all().length.toLocaleString('en-IN'));
  readonly totalAmount = computed(
    () => '₹ ' + this.all().reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString('en-IN'),
  );

  readonly cities = computed(() => [
    'All Cities',
    ...[...new Set(this.all().map((d) => (d.donnerCity || '').trim().toUpperCase()).filter(Boolean))].sort(),
  ]);

  city = 'All Cities';
  search = '';

  private readonly query = signal({ city: 'All Cities', search: '' });

  applyFilters(): void {
    this.query.set({ city: this.city, search: this.search.trim().toLowerCase() });
    this.pager.reset();
  }

  readonly rows = computed(() => {
    const { city, search } = this.query();
    return this.all().filter(
      (d) =>
        (city === 'All Cities' || (d.donnerCity || '').trim().toUpperCase() === city) &&
        (!search || (d.donnerName || '').toLowerCase().includes(search)),
    );
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 25);
}
