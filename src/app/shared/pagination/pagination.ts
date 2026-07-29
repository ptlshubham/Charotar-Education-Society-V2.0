import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Paginator } from './paginator';

/**
 * Shared pagination controls, driven by a {@link Paginator}.
 *
 *   <app-pagination [pager]="pager" />                    <!-- table footer -->
 *   <app-pagination [pager]="pager" variant="compact" /> <!-- centered, no range text -->
 *
 * Renders nothing when there are no rows.
 */
@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (pager.total() > 0) {
      <div class="flex flex-wrap items-center gap-4"
        [class]="variant === 'compact' ? 'justify-center pt-6' : 'justify-between border-t border-gray-100 px-5 py-4'">

        @if (variant !== 'compact') {
          <p class="text-[12.5px] text-muted">
            Showing {{ pager.rangeStart() }} to {{ pager.rangeEnd() }} of {{ pager.total() }} results
          </p>
        }

        <div class="flex items-center gap-1.5">
          <button type="button" (click)="pager.go(-1)" [disabled]="pager.page() === 1" aria-label="Previous page"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
          </button>

          @for (n of pager.pageNumbers(); track n) {
            <button type="button" (click)="pager.toPage(n)"
              class="h-9 min-w-9 rounded-md border px-3 text-[13px] font-semibold transition-colors"
              [class]="pager.page() === n ? 'border-primary bg-primary text-white' : 'border-gray-200 text-primary hover:border-primary'">
              {{ n }}
            </button>
          }

          <button type="button" (click)="pager.go(1)" [disabled]="pager.page() === pager.totalPages()" aria-label="Next page"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    }
  `,
})
export class Pagination {
  @Input({ required: true }) pager!: Paginator<unknown>;
  /** 'footer' (default) shows the "Showing X–Y of Z" line; 'compact' is centered buttons only. */
  @Input() variant: 'footer' | 'compact' = 'footer';
}
