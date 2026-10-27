import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Holds the Dyuno page loader (index.html, #ces-loader) up while something is loading.
 *
 * Each caller uses its own key, and the loader stays up until every key has stopped. It only
 * appears if loading lasts past 180ms, and fades out as soon as the last key stops, even mid-way
 * through its entrance. Keys in use: 'page' (the page's files, cleared by index.html itself),
 * 'app' (the first screen's data) and 'route' (a navigation) - both set in App.
 *
 * Full-screen, so only for loading that blocks the whole page; a section loading its own data
 * should show its own placeholder instead.
 */
@Injectable({ providedIn: 'root' })
export class PageLoader {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  start(key: string): void {
    this.send(key, true);
  }

  stop(key: string): void {
    this.send(key, false);
  }

  /** Holds the loader up until `work` settles, whether it succeeds or fails. */
  async during<T>(key: string, work: Promise<T>): Promise<T> {
    this.start(key);
    try {
      return await work;
    } finally {
      this.stop(key);
    }
  }

  private send(key: string, on: boolean): void {
    if (this.browser) window.dispatchEvent(new CustomEvent('ces:loading', { detail: { key, on } }));
  }
}
