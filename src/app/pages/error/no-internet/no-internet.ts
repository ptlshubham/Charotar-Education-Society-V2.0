import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../../../core/services/connection.service';

/**
 * The No Internet page. MainLayout shows it over the page whenever the connection drops; it also
 * has its own address (/error/no-internet), like the 404 and 500 pages.
 *
 * Just the picture and Try Again. It has to work with no connection, so the picture comes from
 * ConnectionService's in-memory copy.
 */
@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoInternet {
  private readonly connection = inject(ConnectionService);
  private readonly router = inject(Router);

  readonly illustration = this.connection.illustration;
  readonly checking = signal(false);
  /** Set when Try Again found no connection. */
  readonly stillOffline = signal(false);

  async tryAgain(): Promise<void> {
    this.checking.set(true);
    this.stillOffline.set(false);
    const online = await this.connection.retry();
    this.checking.set(false);
    this.stillOffline.set(!online);
    // Opened at its own address while online - nothing to go back to, so home.
    if (online && this.router.url.startsWith('/error/no-internet')) this.router.navigateByUrl('/home');
  }
}
