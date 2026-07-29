import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Sorter } from './sorter';

/**
 * Clickable, sortable table header. Use inside a <th>:
 *
 *   <th><app-sort-header [sorter]="sorter" sortKey="studentName">Student Name</app-sort-header></th>
 *
 * Shows an up/down caret pair, highlighting the active direction. Designed for a
 * dark header row (inherits the cell's text colour).
 */
@Component({
  selector: 'app-sort-header',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button type="button" (click)="sorter.toggle(sortKey)"
      [attr.aria-sort]="sorter.stateOf(sortKey) === 'asc' ? 'ascending' : sorter.stateOf(sortKey) === 'desc' ? 'descending' : 'none'"
      class="inline-flex items-center gap-1.5 text-inherit transition-opacity hover:opacity-80">
      <ng-content />
      <span class="flex flex-col leading-[0]" aria-hidden="true">
        <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor"
          [class]="sorter.stateOf(sortKey) === 'asc' ? 'opacity-100' : 'opacity-35'">
          <path d="M5 0 10 6H0z" />
        </svg>
        <svg width="9" height="6" viewBox="0 0 10 6" fill="currentColor" class="mt-[1px]"
          [class]="sorter.stateOf(sortKey) === 'desc' ? 'opacity-100' : 'opacity-35'">
          <path d="M5 6 0 0h10z" />
        </svg>
      </span>
    </button>
  `,
})
export class SortHeader {
  @Input({ required: true }) sorter!: Sorter<unknown>;
  @Input({ required: true }) sortKey!: string;
}
