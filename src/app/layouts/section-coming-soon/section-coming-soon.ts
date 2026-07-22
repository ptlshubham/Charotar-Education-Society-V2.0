import {
  Component,
  inject,
  Input,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourcesService } from '../../core/services/resources.service';

/**
 * Reusable "this section is coming soon" page block.
 *
 * Drop it on any route that isn't built yet  everything is optional and overridable:
 *   <app-section-coming-soon />
 *   <app-section-coming-soon title="Podcast is" description="…" source="podcast" />
 *   <app-section-coming-soon [showWhy]="false" [showNotify]="false" />
 */
@Component({
  selector: 'app-section-coming-soon',
  imports: [RouterLink, FormsModule],
  templateUrl: './section-coming-soon.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-coming-soon.scss',
})
export class SectionComingSoon {
  private resourcesService = inject(ResourcesService);
  private platformId = inject(PLATFORM_ID);

  // ─── Content (all overridable per usage) ───
  @Input() badge = 'New Feature';
  @Input() title = 'This Section is';
  @Input() highlight = 'Coming Soon!';
  @Input() description =
    "We're working hard to build something amazing that will help you achieve even more with ZarklyX.";

  /** Tags the newsletter signup so you can tell which section they came from. */
  @Input() source = 'coming-soon';

  // ─── Section toggles ───
  @Input() showHighlights = true;
  @Input() showNotify = true;
  @Input() showWhy = true;
  @Input() showSupport = true;

  // ─── Notify form ───
  email = '';
  readonly submitting = signal(false);
  readonly subscribed = signal(false);
  readonly error = signal('');

  notifyMe(): void {
    const email = this.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    if (this.submitting()) return;

    this.submitting.set(true);
    this.error.set('');
    this.resourcesService.subscribeNewsletter(email, this.source).subscribe({
      next: () => {
        this.submitting.set(false);
        this.subscribed.set(true);
        this.email = '';
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }

  /** Small feature callouts under the heading */
  readonly highlights: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'rocket',
      title: 'New & Improved',
      desc: "We're crafting a better experience for you.",
    },
    {
      icon: 'sparkle',
      title: 'Powerful Features',
      desc: 'Packed with capabilities to simplify your workflow.',
    },
    {
      icon: 'shield',
      title: 'Secure & Reliable',
      desc: 'Built with the highest standards of security.',
    },
    { icon: 'users', title: 'User Focused', desc: 'Designed based on your feedback and needs.' },
  ];

  /** "Why the wait?" cards */
  readonly reasons: ReadonlyArray<{ art: string; color: string; title: string; desc: string }> = [
    {
      art: 'gauge',
      color: '#3DAFA9',
      title: 'Better Experience',
      desc: "We're optimizing every detail to make your experience smooth and effortless.",
    },
    {
      art: 'plus',
      color: '#7C3AED',
      title: 'More Value',
      desc: 'New features that bring more value and drive better results.',
    },
    {
      art: 'lock',
      color: '#3772FF',
      title: 'Enterprise Ready',
      desc: 'Built to meet the needs of modern teams with enterprise-grade reliability.',
    },
    {
      art: 'heart',
      color: '#F17C9F',
      title: 'Built for You',
      desc: 'Your feedback shapes what we build and how we build it.',
    },
  ];

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
