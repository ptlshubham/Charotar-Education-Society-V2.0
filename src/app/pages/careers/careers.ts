import { ChangeDetectionStrategy, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Paginator } from '../../shared/pagination/paginator';
import { Pagination } from '../../shared/pagination/pagination';
import { MediaUrlPipe } from '../../shared/media-url.pipe';
import { LightboxService } from '../../core/services/lightbox.service';
import { ResourcesService } from '../../core/services/resources.service';
import { CareerNotice, CareerStatus, CareerVacancy } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

/**
 * Careers: the vacancies (Advertisement table) and recruitment notices, managed in Website
 * Management → Careers and loaded from GET /careers/public - a new vacancy needs no rebuild.
 *
 * The API works out each vacancy's application status (Opening Soon / Open / Closed, by its
 * start and last date in IST) and leaves out the file of every application form whose vacancy
 * is not open; such a form shows locked here, with no link.
 */
@Component({
  selector: 'app-careers',
  imports: [DatePipe, NgTemplateOutlet, RouterLink, Pagination, MediaUrlPipe, PageHero],
  templateUrl: './careers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './careers.scss',
})
export class Careers {
  private readonly resources = inject(ResourcesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lightbox = inject(LightboxService);

  readonly banner = '/assets/images/hero/careers.jpeg';

  readonly values: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Purpose Driven', body: 'Make a meaningful impact through quality education.', icon: 'target' },
    { title: 'Growth & Learning', body: 'Continuous opportunities for personal and professional growth.', icon: 'school' },
    { title: 'Inclusive Culture', body: 'A collaborative and respectful environment for all.', icon: 'group' },
  ];

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  readonly vacancies = signal<readonly CareerVacancy[]>([]);
  readonly notices = signal<readonly CareerNotice[]>([]);
  /** "Advertisement updated on website" - DD-MM-YYYY, '' until loaded. */
  readonly updatedOn = signal('');

  readonly noticePager = new Paginator(this.notices, 10);

  constructor() {
    this.load();
  }

  load(): void {
    this.state.set('loading');
    this.resources
      .getCareers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          this.vacancies.set(page?.vacancies ?? []);
          this.notices.set(page?.notices ?? []);
          this.updatedOn.set(page?.updatedOn ? page.updatedOn.split('-').reverse().join('-') : '');
          this.noticePager.reset();
          this.state.set('ready');
        },
        error: () => this.state.set('error'),
      });
  }

  /** "5 days left to apply" for an open vacancy with a last date. */
  countdown(vac: CareerVacancy): string {
    if (!vac.lastDate || vac.status !== 'open') return '';
    const days = Math.floor((Date.parse(`${vac.lastDate}T23:59:59+05:30`) - Date.now()) / 86_400_000);
    return days < 1 ? 'Last day to apply today' : `${days} ${days === 1 ? 'day' : 'days'} left to apply`;
  }

  /** Why a document has no file: its vacancy is not open yet, or no longer. */
  lockNote(status: CareerStatus): string {
    return status === 'upcoming'
      ? 'Applications are not open yet - this form can be downloaded once they open.'
      : 'Applications are closed - this form can no longer be downloaded.';
  }

  /** Images under /assets/ are the website's own; uploads live on the API host. */
  imageSrc(path: string): string {
    return path.startsWith('/assets/') ? path : this.resolve(path);
  }

  // ── Image viewer ──
  /** Open a vacancy's advertisement images in the site-wide viewer, on image i. */
  openImages(images: readonly string[], i: number): void {
    this.lightbox.open(images.map((src) => ({ src: this.imageSrc(src), caption: 'Vacancy advertisement' })), i);
  }

  // ── File download ──
  /**
   * Force a file to download rather than open in the browser's PDF viewer.
   * Fetches the blob and saves it; falls back to opening in a new tab if the
   * request fails (e.g. the media host blocks cross-origin reads).
   */
  async download(event: Event, file: string | null, label: string): Promise<void> {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId) || !file) return;
    const url = this.resolve(file);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('request failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = this.fileName(label, file);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  /** Build a friendly download filename from the link label + file extension. */
  private fileName(label: string, file: string): string {
    const ext = file.split('.').pop() || 'pdf';
    const base = (label || 'document').replace(/[\\/:*?"<>|\n\r]+/g, ' ').trim().slice(0, 80) || 'document';
    return `${base}.${ext}`;
  }
}
