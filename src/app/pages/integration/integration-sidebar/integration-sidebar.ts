import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Shared left rail for every integration detail page  categories + "Need help?".
 * Pass the current page's category via `active` to highlight it.
 */
@Component({
  selector: 'app-integration-sidebar',
  imports: [NgClass, RouterLink],
  templateUrl: './integration-sidebar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { class: 'w-full lg:w-[230px] lg:shrink-0 flex flex-col gap-6', ngSkipHydration: 'true' },
})
export class IntegrationSidebar {
  @Input() active = 'All Integrations';

  readonly categories: ReadonlyArray<{ name: string; icon: string }> = [
    { name: 'All Integrations', icon: 'grid' },
    { name: 'Popular', icon: 'star' },
    { name: 'Social Media', icon: 'megaphone' },
    { name: 'Cloud & DAM', icon: 'cloud' },
    { name: 'Analytics & Business', icon: 'chart' },
    { name: 'CRM & Marketing', icon: 'contact' },
    { name: 'Help Desk', icon: 'headset' },
    { name: 'Reviews', icon: 'award' },
    { name: 'Commerce', icon: 'bag' },
    { name: 'Workflow', icon: 'flow' },
    { name: 'Coming Soon', icon: 'clock' },
  ];
}
