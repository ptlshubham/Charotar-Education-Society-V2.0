import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { AnswerKeyEntry } from '../../../shared/models/models';
import { Paginator } from '../../../shared/pagination/paginator';
import { Pagination } from '../../../shared/pagination/pagination';
import { Sorter } from '../../../shared/sorting/sorter';
import { SortHeader } from '../../../shared/sorting/sort-header';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { CustomSelect } from '../../../shared/custom-select/custom-select';

interface Paper {
  date: string;
  day: string;
  month: string;
  year: string;
  /** Plain text (drives sort, filter and fallback display). */
  name: string;
  /** Original message HTML from the backend. */
  message: string;
  standard: string;
  subject: string;
  /** Download path, or '' when there's no file. */
  file: string;
}

@Component({
  selector: 'app-answer-key',
  imports: [CustomSelect, FormsModule, Pagination, SortHeader, MediaUrlPipe, SafeHtmlPipe, PageHero],
  templateUrl: './answer-key.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './answer-key.scss',
})
export class AnswerKey {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);

  readonly tab = signal<'general' | 'competitive'>('general');

  selectTab(t: 'general' | 'competitive'): void {
    this.tab.set(t);
  }

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly all = signal<readonly Paper[]>([]);

  constructor() {
    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getAnswerKeys(id)),
        catchError(() => {
          this.failed.set(true);
          return of<AnswerKeyEntry[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? list : [];
        this.all.set(rows.map((r) => this.toPaper(r)));
        this.loading.set(false);
      });
  }

  /** Hero "last updated" = the most recent entry's date. */
  readonly lastUpdated = computed(() => {
    const times = this.all().map((p) => new Date(p.date).getTime()).filter((t) => !isNaN(t));
    return times.length ? formatDate(new Date(Math.max(...times)), 'd MMMM yyyy', 'en-US') : '';
  });

  // Filters — Year is derivable from the feed; Standard/Subject stay for admin to fill.
  readonly years = computed(() => ['Select Year', ...new Set(this.all().map((p) => p.year).filter(Boolean))]);
  readonly standards = computed(() => ['Select Standard', ...new Set(this.all().map((p) => p.standard).filter(Boolean))]);
  readonly subjects = computed(() => ['Select Subject', ...new Set(this.all().map((p) => p.subject).filter(Boolean))]);

  year = 'Select Year';
  standard = 'Select Standard';
  subject = 'Select Subject';

  private readonly query = signal({ year: 'Select Year', standard: 'Select Standard', subject: 'Select Subject' });

  apply(): void {
    this.query.set({ year: this.year, standard: this.standard, subject: this.subject });
    this.pager.reset();
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all().filter(
      (p) =>
        (q.year === 'Select Year' || p.year === q.year) &&
        (q.standard === 'Select Standard' || p.standard === q.standard) &&
        (q.subject === 'Select Subject' || p.subject === q.subject),
    );
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 10);

  private toPaper(r: AnswerKeyEntry): Paper {
    const d = new Date(r.date);
    const valid = !isNaN(d.getTime());
    const message = r.message ?? '';
    const name = this.strip(message);
    // Standard is embedded in the paper name ("STD 11 …"); pull it out so the column
    // and the Standard filter work. Subject has no reliable pattern (the stream ARTS/
    // SCIENCE sometimes precedes it, sometimes is it), so it stays for admin to fill.
    const std = name.match(/\bstd\.?\s*(\d+)/i);
    return {
      date: r.date ?? '',
      day: valid ? formatDate(d, 'dd', 'en-US') : '',
      month: valid ? formatDate(d, 'MMM', 'en-US') : '',
      year: valid ? formatDate(d, 'yyyy', 'en-US') : '',
      name,
      message,
      standard: std ? std[1] : '',
      subject: '',
      file: r.files && r.files !== 'null' ? r.files : '',
    };
  }

  private strip(html: string): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
