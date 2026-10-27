import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, switchMap, take, tap } from 'rxjs';
import { ResourcesService } from './resources.service';
import { InstituteService } from './institute.service';

/**
 * Newsletter sign-ups. Every subscribe box on the site goes through `subscribe()`: it saves the
 * address to this website's list (Website Management → Newsletter Subscribers in the dashboard)
 * and, on success, opens the one shared "Thank you" popup (driven by `showSuccess`), so the
 * experience is identical everywhere. The boxes themselves are shared/newsletter-form.
 */
@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);

  /** Drives the universal subscribe-success popup. */
  readonly showSuccess = signal(false);

  /**
   * Subscribe an email; `source` names the box (news, blog, coming-soon:<section> ...). Pass
   * `popup: false` for a box that shows its own thank-you. Errors carry the server's message.
   */
  subscribe(email: string, source: string, { popup = true } = {}): Observable<void> {
    return this.institute.resolve().pipe(
      take(1),
      switchMap((instituteId) => this.resources.subscribeNewsletter(email, source, instituteId)),
      map(() => undefined),
      tap(() => popup && this.showSuccess.set(true)),
    );
  }

  /** A readable reason from a failed subscribe call. */
  errorMessage(err: any): string {
    if (err?.status === 429) return 'Too many tries - please wait a little and try again.';
    return err?.error?.error?.message || err?.error?.message || "We couldn't subscribe you just now. Please try again.";
  }

  close(): void {
    this.showSuccess.set(false);
  }
}
