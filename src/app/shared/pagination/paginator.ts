import { Signal, computed, signal } from '@angular/core';

/**
 * Reusable client-side pagination state for a signal of rows.
 *
 *   readonly rows = computed(() => this.filtered());
 *   readonly pager = new Paginator(this.rows, 25);
 *
 * Then render `pager.paged()` and drop <app-pagination [pager]="pager" /> below
 * the list. Call `pager.reset()` whenever the filters change.
 *
 * Not an Angular service — signal()/computed() need no injection context, so it
 * can be `new`-ed straight into a component field.
 */
export class Paginator<T> {
  readonly page = signal(1);

  constructor(
    private readonly source: Signal<readonly T[]>,
    readonly pageSize = 25,
    /** How many numbered buttons to show at once. */
    private readonly windowSize = 5,
  ) {}

  readonly total = computed(() => this.source().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));

  readonly paged = computed(() => {
    const p = this.page();
    return this.source().slice((p - 1) * this.pageSize, p * this.pageSize);
  });

  readonly rangeStart = computed(() => (this.total() ? (this.page() - 1) * this.pageSize + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  /** A sliding window of at most `windowSize` page numbers around the current page. */
  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const start = Math.max(1, Math.min(this.page() - 2, total - (this.windowSize - 1)));
    return Array.from({ length: Math.min(this.windowSize, total) }, (_, i) => start + i);
  });

  go(delta: number): void {
    this.page.update((p) => Math.min(this.totalPages(), Math.max(1, p + delta)));
  }

  toPage(n: number): void {
    this.page.set(Math.min(this.totalPages(), Math.max(1, n)));
  }

  reset(): void {
    this.page.set(1);
  }
}
