import { DecimalPipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { MicroDonor } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { Sorter } from '../../../shared/sorting/sorter';
import { SortHeader } from '../../../shared/sorting/sort-header';
import { cleanText } from '../../../shared/clean-text';

@Component({
  selector: 'app-micro-donor-list',
  imports: [DecimalPipe, FormsModule, Pagination, SortHeader, PageHero],
  templateUrl: './micro-donor-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './micro-donor-list.scss',
})
export class MicroDonorList {
  private readonly resources = inject(ResourcesService);

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly all = signal<readonly MicroDonor[]>([]);

  constructor() {
    this.resources
      .getMicroDonorList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<MicroDonor[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((rows) => {
        // Normalise amount to a real number - DecimalPipe rejects string/null.
        // Text fields are cleaned so "undefined"/"null" show as blank.
        this.all.set(
          (Array.isArray(rows) ? rows : []).map((r) => ({
            ...r,
            name: cleanText(r.name),
            city: cleanText(r.city),
            amount: Number(r.amount) || 0,
          })),
        );
        this.loading.set(false);
      });
  }

  /** Formats a DB date, tolerating null/empty/unparseable values. */
  displayDate(value: string): string {
    if (!value) return '-';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }

  readonly totalMicroDonors = computed(() => this.all().length.toLocaleString('en-IN'));

  /** Donor-name search; narrows the list as you type. */
  readonly search = signal('');

  onSearch(value: string): void {
    this.search.set(value);
    this.pager.reset();
  }

  readonly rows = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q ? this.all().filter((d) => (d.name || '').toLowerCase().includes(q)) : this.all();
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 25);
}
