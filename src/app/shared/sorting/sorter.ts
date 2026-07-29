import { Signal, computed, signal } from '@angular/core';

export type SortDir = 'asc' | 'desc';

/**
 * Reusable client-side sort state for a signal of rows. Chain it before a
 * {@link Paginator} so pages show the current sort:
 *
 *   readonly rows   = computed(() => this.filtered());
 *   readonly sorter = new Sorter(this.rows);
 *   readonly pager  = new Paginator(this.sorter.sorted, 25);
 *
 * Wire headers with <app-sort-header [sorter]="sorter" sortKey="name">…</>.
 * With no active key the original order is preserved.
 *
 * Comparison is type-aware: real numbers compare numerically, everything else
 * uses a natural (numeric-aware) locale compare, so "50%", "2024-2025" and
 * "3-A" all order sensibly.
 */
export class Sorter<T> {
  readonly key = signal<string | null>(null);
  readonly dir = signal<SortDir>('asc');

  constructor(
    private readonly source: Signal<readonly T[]>,
    initialKey: string | null = null,
    initialDir: SortDir = 'asc',
  ) {
    this.key.set(initialKey);
    this.dir.set(initialDir);
  }

  readonly sorted = computed(() => {
    const key = this.key();
    const rows = this.source();
    if (!key) return rows;

    const factor = this.dir() === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => Sorter.compare((a as never)[key], (b as never)[key]) * factor);
  });

  /** Click a header: same key flips direction, a new key starts ascending. */
  toggle(key: string): void {
    if (this.key() === key) {
      this.dir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.key.set(key);
      this.dir.set('asc');
    }
  }

  /** Current direction for a column, or null when it is not the active sort. */
  stateOf(key: string): SortDir | null {
    return this.key() === key ? this.dir() : null;
  }

  private static compare(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a ?? '').localeCompare(String(b ?? ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
