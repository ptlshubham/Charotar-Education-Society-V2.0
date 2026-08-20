import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { MagazineIssue } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { environment } from '../../../../environments/environment';

/** Generic cover used for every magazine — the backend stores only the PDF, no cover. */
const MAGAZINE_COVER = '/assets/images/magazine-cover.jpg';

interface Issue {
  name: string;
  years: string;
  cover: string;
  file: string;
}

@Component({
  selector: 'app-magazine',
  imports: [FormsModule, Pagination],
  templateUrl: './magazine.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './magazine.scss',
})
export class Magazine {
  private readonly resources = inject(ResourcesService);

  /** Fanned stack in the hero (decorative). */
  readonly PLACEHOLDER_COVER = PLACEHOLDER.magazines[1];
  readonly PLACEHOLDER_COVER2 = PLACEHOLDER.magazines[2];
  readonly PLACEHOLDER_COVER3 = PLACEHOLDER.magazines[0];

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly all = signal<readonly Issue[]>([]);

  constructor() {
    this.resources
      .getMagazines()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<MagazineIssue[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? list : [];
        this.all.set(
          rows.map((m) => ({
            name: m.title ?? '',
            years: '',
            cover: MAGAZINE_COVER,
            file: m.files && m.files !== 'null' ? m.files : '',
          })),
        );
        this.loading.set(false);
      });
  }

  // Year has no backend data yet; Issue filters by title. Both kept for the admin.
  readonly years = computed(() => ['All Years', ...new Set(this.all().map((i) => i.years).filter(Boolean))]);
  readonly issues = computed(() => ['All Issues', ...new Set(this.all().map((i) => i.name).filter(Boolean))]);

  year = 'All Years';
  issue = 'All Issues';
  search = '';

  private readonly query = signal({ year: 'All Years', issue: 'All Issues', search: '' });

  apply(): void {
    this.query.set({ year: this.year, issue: this.issue, search: this.search.trim().toLowerCase() });
    this.pager.reset();
  }

  reset(): void {
    this.year = 'All Years';
    this.issue = 'All Issues';
    this.search = '';
    this.apply();
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all().filter(
      (i) =>
        (q.year === 'All Years' || i.years === q.year) &&
        (q.issue === 'All Issues' || i.name === q.issue) &&
        (!q.search || i.name.toLowerCase().includes(q.search)),
    );
  });

  readonly pager = new Paginator(this.rows, 12);

  // ── In-site PDF viewer ──
  private readonly sanitizer = inject(DomSanitizer);

  /** The magazine currently open in the viewer, or null when closed. */
  readonly activePdf = signal<{ name: string; raw: string } | null>(null);
  /** Blob URL of the fetched PDF (same-origin, so it bypasses X-Frame-Options). */
  readonly pdfSrc = signal<SafeResourceUrl | null>(null);
  readonly pdfLoading = signal(false);
  readonly pdfError = signal(false);
  private objectUrl: string | null = null;

  /**
   * Fetch the PDF and view it via a blob URL. Direct cross-origin PDF iframes are
   * blocked by X-Frame-Options (SAMEORIGIN in prod) and refused by Chrome in dev;
   * a same-origin blob URL renders natively. Falls back to "Open in New Tab" if the
   * fetch is blocked.
   */
  async openPdf(item: Issue): Promise<void> {
    if (!item.file) return;
    const raw = this.resolve(item.file);
    this.revoke();
    this.activePdf.set({ name: item.name, raw });
    this.pdfSrc.set(null);
    this.pdfError.set(false);
    this.pdfLoading.set(true);
    try {
      const res = await fetch(raw);
      if (!res.ok) throw new Error('load failed');
      const blob = await res.blob();
      this.objectUrl = URL.createObjectURL(blob);
      this.pdfSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
    } catch {
      this.pdfError.set(true);
    } finally {
      this.pdfLoading.set(false);
    }
  }

  closePdf(): void {
    this.revoke();
    this.activePdf.set(null);
    this.pdfSrc.set(null);
    this.pdfError.set(false);
    this.pdfLoading.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePdf();
  }

  private revoke(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
