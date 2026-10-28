import { ApplicationRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationError, Router } from '@angular/router';

/** The No Internet page's picture. */
const ILLUSTRATION = '/assets/images/error/no-internet.webp';

/** A page's code failing to download - Chrome, Firefox and Safari word it differently. */
const CHUNK_FAILED = /dynamically imported module|Importing a module script failed/i;

/**
 * Knows when the visitor has lost their connection, for the No Internet screen that MainLayout
 * lays over the page - whatever they were reading is still there when the connection returns.
 *
 * Two signs, both events (never a one-off navigator.onLine read, which misreports on iOS cold load):
 * - the browser's offline / online events;
 * - a page whose code can't be downloaded. Wi-Fi with no internet behind it never fires `offline`,
 *   so this is the only sign then. The server is asked first, so a page file missing after a deploy
 *   isn't called "no internet".
 *
 * The picture is downloaded up front and kept in memory - once offline, nothing more can be.
 */
@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly router = inject(Router);

  readonly offline = signal(false);
  /** The picture's address - an in-memory copy once it has been downloaded. */
  readonly illustration = signal(ILLUSTRATION);

  /** The page that failed to open, opened again once the connection is back. */
  private failedUrl: string | null = null;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    window.addEventListener('offline', () => this.offline.set(true));
    window.addEventListener('online', () => this.recover());

    this.router.events.pipe(takeUntilDestroyed()).subscribe(async (e) => {
      if (!(e instanceof NavigationError) || !CHUNK_FAILED.test(String(e.error?.message ?? e.error))) return;
      if (await this.reachable()) return;
      this.failedUrl = e.url;
      this.offline.set(true);
    });

    // After the first screen has settled, so it never competes with the page's own downloads.
    inject(ApplicationRef).whenStable().then(() =>
      fetch(ILLUSTRATION)
        .then((res) => (res.ok ? res.blob() : null))
        .then((blob) => blob && this.illustration.set(URL.createObjectURL(blob)))
        .catch(() => {}),
    );
  }

  /** Checks the connection again; true (and the screen closes) when the site can be reached. */
  async retry(): Promise<boolean> {
    const online = await this.reachable();
    if (online) this.recover();
    return online;
  }

  private recover(): void {
    this.offline.set(false);
    const url = this.failedUrl;
    this.failedUrl = null;
    if (url) this.router.navigateByUrl(url);
  }

  /** Any answer from the server counts - only a network failure (or no answer in 8s) doesn't. */
  private reachable(): Promise<boolean> {
    return fetch(`/robots.txt?ping=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    }).then(
      () => true,
      () => false,
    );
  }
}
