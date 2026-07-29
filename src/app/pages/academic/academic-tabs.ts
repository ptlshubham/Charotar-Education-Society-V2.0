import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** One pill in the academic filter bar. `id` is the value emitted on click. */
export interface AcademicTab {
  id: string;
  label: string;
  path: string[];
}

/**
 * Unified filter-tab bar for every page in the academic module (schools,
 * colleges, hostels, others). Presentation only — the parent owns the active
 * signal and reacts to `tabChange`.
 */
@Component({
  selector: 'app-academic-tabs',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div role="tablist" [attr.aria-label]="ariaLabel()"
      class="-mx-4 flex gap-2 overflow-x-auto rounded-xl bg-white px-4 py-2 shadow-sm sm:mx-0 sm:px-2">
      @for (tab of tabs(); track tab.id) {
        <button type="button" role="tab" [attr.aria-selected]="active() === tab.id" (click)="tabChange.emit(tab.id)"
          class="flex shrink-0 items-center gap-2 rounded-lg px-5 py-3 text-[13.5px] font-semibold whitespace-nowrap transition-colors"
          [class]="active() === tab.id ? 'bg-primary text-white' : 'text-primary hover:bg-gray-50'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            @for (d of tab.path; track d) { <path [attr.d]="d" /> }
          </svg>
          {{ tab.label }}
        </button>
      }
    </div>
  `,
})
export class AcademicTabs {
  readonly tabs = input.required<readonly AcademicTab[]>();
  readonly active = input.required<string>();
  readonly ariaLabel = input('');
  readonly tabChange = output<string>();
}
