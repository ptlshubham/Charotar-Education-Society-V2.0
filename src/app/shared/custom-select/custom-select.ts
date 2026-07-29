import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A styled single-select that always opens DOWNWARD as a capped, scrollable
 * panel — unlike a native <select>, whose popup the browser may float over the
 * header when the field sits low in the viewport.
 *
 * Implements ControlValueAccessor, so it drops into reactive forms with
 * `formControlName`. A search box appears once the option count passes
 * `searchThreshold`, so long lists (e.g. institutes) stay usable.
 */
@Component({
  selector: 'app-custom-select',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomSelect), multi: true },
  ],
  template: `
    <div class="relative">
      <button type="button" [disabled]="disabled" (click)="toggle()"
        [attr.aria-expanded]="open()" aria-haspopup="listbox"
        class="flex h-11 w-full items-center justify-between gap-2 rounded-md border bg-white px-3.5 text-left text-[13px] outline-none transition-colors focus:border-primary disabled:opacity-60"
        [class]="invalid ? 'border-red-400' : 'border-gray-300'">
        <span [class]="value() ? 'text-primary' : 'text-gray-400'" class="truncate">
          {{ value() || placeholder }}
        </span>
        <svg class="shrink-0 text-gray-400 transition-transform duration-200" [class.rotate-180]="open()"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      @if (open()) {
        <div class="animate-dropdown absolute inset-x-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-md border border-gray-200 bg-white shadow-[0_12px_32px_rgba(32,49,84,0.16)]">
          @if (showSearch()) {
            <div class="border-b border-gray-100 p-2">
              <input type="search" [(ngModel)]="term" (ngModelChange)="query.set($event)" (click)="$event.stopPropagation()"
                placeholder="Search…" autocomplete="off"
                class="h-9 w-full rounded-md border border-gray-200 px-3 text-[12.5px] text-primary outline-none focus:border-primary" />
            </div>
          }

          <ul role="listbox" data-lenis-prevent class="max-h-[220px] overflow-y-auto overscroll-contain py-1">
            @for (option of filtered(); track option) {
              <li role="option" [attr.aria-selected]="option === value()">
                <button type="button" (click)="select(option)"
                  class="block w-full px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-[#F1F5FB]"
                  [class]="option === value() ? 'bg-[#EEF3FB] font-semibold text-primary' : 'text-primary'">
                  {{ option }}
                </button>
              </li>
            } @empty {
              <li class="px-3.5 py-3 text-center text-[12.5px] text-muted">No matches.</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class CustomSelect implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() options: readonly string[] = [];
  @Input() placeholder = 'Select';
  @Input({ transform: booleanAttribute }) invalid = false;
  /** Show the search box once the list is longer than this. */
  @Input() searchThreshold = 8;

  readonly open = signal(false);
  readonly value = signal('');
  readonly query = signal('');
  /** Bound to the search input; mirrored into the `query` signal. */
  term = '';
  disabled = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly showSearch = computed(() => this.options.length > this.searchThreshold);
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.options.filter((o) => o.toLowerCase().includes(q)) : this.options;
  });

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    this.open.update((o) => !o);
    if (!this.open()) this.onTouched();
  }

  select(option: string): void {
    this.value.set(option);
    this.onChange(option);
    this.close();
  }

  private close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.term = '';
    this.query.set('');
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
