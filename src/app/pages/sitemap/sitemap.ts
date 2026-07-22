import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResourcesService } from '../../core/services/resources.service';
import siteLinks from '../../shared/site-links.json';

interface SitemapLink {
  label: string;
  path: string;
}

interface SitemapGroup {
  icon: string;
  title: string;
  path: string;
  links: SitemapLink[];
}

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink, FormsModule, NgTemplateOutlet],
  templateUrl: './sitemap.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './sitemap.scss',
})
export class Sitemap {
  private resourcesService = inject(ResourcesService);

  /**
   * Single source of truth for the site's public URLs, shared with
   * scripts/generate-sitemap.mjs so this page and sitemap.xml can never disagree.
   * Every path must resolve — a sitemap linking to routes that do not exist sends
   * visitors and crawlers into the 404 page.
   */
  readonly primaryGroups: readonly SitemapGroup[] = siteLinks.primary;

  /** Rendered as the wide two-column card, matching the Modules block in the design. */
  readonly supportGroup: SitemapGroup = siteLinks.support;

  readonly secondaryGroups: readonly SitemapGroup[] = siteLinks.secondary;

  // ─── Newsletter ───
  email = '';
  readonly submitting = signal(false);
  readonly subscribed = signal(false);
  readonly error = signal('');

  subscribe(): void {
    const email = this.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    if (this.submitting()) return;

    this.submitting.set(true);
    this.error.set('');
    this.resourcesService.subscribeNewsletter(email, 'sitemap').subscribe({
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
}
