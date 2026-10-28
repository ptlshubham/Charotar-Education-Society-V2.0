import { ApplicationRef, Component, ChangeDetectionStrategy, PLATFORM_ID, inject, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { PageLoader } from './core/services/page-loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const loader = inject(PageLoader);

    // The first screen waits for its data as well as the page's files - until nothing is left in
    // flight (HTTP requests, hydration).
    inject(ApplicationRef).whenStable().then(() => loader.stop('app'));

    // Navigations: up while the next page's code loads. Every way a navigation can end releases
    // it, or the loader would stay up.
    inject(Router).events.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e instanceof NavigationStart) loader.start('route');
      else if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError ||
        e instanceof NavigationSkipped
      ) {
        loader.stop('route');
        if (isDevMode() && e instanceof NavigationEnd) setTimeout(warnMissingIcons, 3000);
      }
    });
  }
}

/**
 * Development only: index.html loads just the icons the site uses (icon_names). An icon missing
 * from that list shows its name as text - wider than the 1em glyph - so name it in the console.
 */
function warnMissingIcons(): void {
  document.fonts.ready.then(() => {
    const missing = new Set<string>();
    const range = document.createRange();
    for (const el of document.querySelectorAll<HTMLElement>('.material-symbols-outlined')) {
      // The text's own width (not the element's - some are padded circles): one glyph, or a word.
      range.selectNodeContents(el);
      const size = parseFloat(getComputedStyle(el).fontSize) || 24;
      const width = range.getBoundingClientRect().width;
      if (width > size * 1.5) missing.add((el.textContent || '').trim());
    }
    if (missing.size) {
      console.warn(`[icons] Not in index.html's icon_names, so shown as text: ${[...missing].join(', ')}. Add them (alphabetically).`);
    }
  });
}
