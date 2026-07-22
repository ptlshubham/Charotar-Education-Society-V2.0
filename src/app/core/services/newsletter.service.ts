import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ResourcesService } from './resources.service';

/**
 * Shared newsletter helper. Any subscribe form on the site can call `subscribe()`
 * and, on success, the single universal success popup (driven by `showSuccess`)
 * opens  so the "Thank you" experience is identical everywhere.
 */
@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly resources = inject(ResourcesService);

  /** Drives the universal subscribe-success popup. */
  readonly showSuccess = signal(false);

  /**
   * Subscribe an email and open the shared success popup on success.
   * Returns the source observable so callers can drive their own loading / error UI.
   */
  subscribe(email: string, source: string): Observable<any> {
    return this.resources.subscribeNewsletter(email, source).pipe(
      tap(() => this.showSuccess.set(true)),
    );
  }

  close(): void {
    this.showSuccess.set(false);
  }
}
