import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** One pill in the academic filter bar. `id` is the value emitted on click. */
export interface AcademicTab {
  id: string;
  label: string;
  path: string[];
  icon?: string;
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
      class="-mx-4 grid auto-cols-[minmax(110px,1fr)] grid-flow-col sm:flex sm:auto-cols-auto sm:justify-center snap-x snap-mandatory gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-xl bg-transparent px-4 py-2 sm:mx-0 sm:px-2">
      @for (tab of tabs(); track tab.id) {
        <button type="button" role="tab" [attr.aria-selected]="active() === tab.id" (click)="tabChange.emit(tab.id)"
          class="flex w-full sm:w-auto shrink-0 snap-start items-center justify-center gap-2 rounded-lg px-2 sm:px-5 py-3 text-[12.5px] sm:text-[13.5px] font-semibold whitespace-nowrap transition-colors"
          [class]="active() === tab.id ? 'bg-primary text-white' : 'text-primary hover:bg-gray-50'">
          @if (tab.icon) {
            <span class="material-symbols-outlined !text-[23px] [font-variation-settings:'wght'_300]" aria-hidden="true">{{ tab.icon }}</span>
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              @for (d of tab.path; track d) { <path [attr.d]="d" /> }
            </svg>
          }
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
