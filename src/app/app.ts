import { ApplicationRef, Component, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
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
      }
    });
  }
}
