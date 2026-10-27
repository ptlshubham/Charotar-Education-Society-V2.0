import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../core/services/newsletter.service';

/** Plain address check, as the server's (modules/newsletter/service.js). */
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/**
 * The email field + Subscribe button of a "Subscribe to Newsletter" box. The box around it (heading,
 * text) is the page's own; this saves the address to the website's list and opens the shared
 * "Thank you" popup.
 *
 *   <app-newsletter-form source="blog" inputId="blog-email" tone="dark" />
 */
@Component({
  selector: 'app-newsletter-form',
  imports: [FormsModule],
  templateUrl: './newsletter-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterForm {
  private readonly newsletter = inject(NewsletterService);

  /** Which box this is - shown in the dashboard as "Signed up from". */
  readonly source = input('website');
  /** The input's id, unique on the page. */
  readonly inputId = input('newsletter-email');
  /** light = on a pale box, dark = on a navy one. */
  readonly tone = input<'light' | 'dark'>('light');
  readonly placeholder = input('Enter your email address');

  readonly email = signal('');
  readonly sending = signal(false);
  readonly error = signal('');

  submit(): void {
    const email = this.email().trim();
    if (!EMAIL.test(email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    if (this.sending()) return;
    this.sending.set(true);
    this.error.set('');
    this.newsletter.subscribe(email, this.source()).subscribe({
      next: () => {
        this.sending.set(false);
        this.email.set('');
      },
      error: (err) => {
        this.sending.set(false);
        this.error.set(this.newsletter.errorMessage(err));
      },
    });
  }
}
