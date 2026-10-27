import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';

/**
 * One tab. `id` is what `tabChange` emits. The icon is a Material Symbols name (`icon`) or
 * 24×24 stroked SVG paths (`path`); a tab may have neither.
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  path?: readonly string[];
}

/**
 * The site's one tab style - the home page's "Our Programmes" row: icon and label on an underlined
 * row, a gold bar under the active tab. Scrolls sideways on small screens; the arrow keys move
 * between tabs. Presentation only - the parent owns the active id and reacts to `tabChange`.
 */
@Component({
  selector: 'app-tab-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #list class="hide-scrollbar overflow-x-auto border-b border-primary/10" role="tablist" data-lenis-prevent-horizontal
      [attr.aria-label]="ariaLabel() || null" (keydown.arrowright)="move(1)" (keydown.arrowleft)="move(-1)">
      <div class="flex w-max gap-1 sm:gap-4 lg:gap-8" [class.mx-auto]="align() === 'center'">
        @for (tab of tabs(); track tab.id) {
        @let on = active() === tab.id;
        <button type="button" role="tab" [attr.aria-selected]="on" [attr.tabindex]="on ? 0 : -1"
          [attr.aria-controls]="controls()" (click)="tabChange.emit(tab.id)"
          class="relative flex shrink-0 cursor-pointer items-center gap-2 px-3 pt-2 pb-3.5 text-[14px] whitespace-nowrap transition-colors focus:outline-none focus-visible:text-primary sm:px-4 sm:text-[16px]"
          [class]="on ? 'font-semibold text-primary' : 'font-medium text-primary/70 hover:text-primary'">
          @if (tab.icon) {
          <span class="tab-icon material-symbols-outlined !text-[22px]" [class.is-on]="on" aria-hidden="true">{{ tab.icon }}</span>
          } @else if (tab.path?.length) {
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" [attr.stroke-width]="on ? 2 : 1.6"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            @for (d of tab.path; track d) { <path [attr.d]="d" /> }
          </svg>
          }
          {{ tab.label }}
          @if (on) {
          <span class="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-secondary" aria-hidden="true"></span>
          }
        </button>
        }
      </div>
    </div>
  `,
  styles: `
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    /* Light icons, heavier on the active tab (the icon font has no filled style loaded). */
    .tab-icon {
      font-variation-settings: 'wght' 300;
    }
    .tab-icon.is-on {
      font-variation-settings: 'wght' 600;
    }
  `,
})
export class TabBar {
  readonly tabs = input.required<readonly TabItem[]>();
  readonly active = input.required<string>();
  readonly ariaLabel = input('');
  /** The id of the panel the tabs switch, for aria-controls. */
  readonly controls = input<string | null>(null);
  /** Centred like "Our Programmes", or from the left when the row shares a line with other controls. */
  readonly align = input<'center' | 'start'>('center');
  readonly tabChange = output<string>();

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');

  /** Arrow keys select and focus the neighbouring tab, as a tab list should. */
  move(step: 1 | -1): void {
    const tabs = this.tabs();
    const i = (tabs.findIndex((t) => t.id === this.active()) + step + tabs.length) % tabs.length;
    this.tabChange.emit(tabs[i].id);
    this.list().nativeElement.querySelectorAll<HTMLButtonElement>('[role="tab"]')[i]?.focus();
  }
}
