import { ApplicationRef, Component, ChangeDetectionStrategy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // The page loader in index.html waits for the first data as well as the files - tell it
    // once nothing is left in flight (HTTP requests, hydration).
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      inject(ApplicationRef).whenStable().then(() => window.dispatchEvent(new Event('ces:app-ready')));
    }
  }
}
