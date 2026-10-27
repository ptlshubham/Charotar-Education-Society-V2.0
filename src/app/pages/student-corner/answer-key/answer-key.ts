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
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { CustomSelect } from '../../../shared/custom-select/custom-select';

interface Paper {
  date: string;
  /** "24 Oct 2026" */
  shortDate: string;
  year: string;
  /** Plain text (drives search, filters and the download label). */
  name: string;
  /** Original message HTML from the backend. */
  message: string;
  /** "Std 11", or '' when the name has no standard. */
  standard: string;
  subject: string;
  /** Download path, or '' when there's no file. */
  file: string;
  /** "PDF", "JPG" … from the file's extension. */
  fileType: string;
}

type Tab = 'general' | 'competitive';

const ALL_YEARS = 'All years';
const ALL_STANDARDS = 'All standards';
const ALL_SUBJECTS = 'All subjects';

/**
 * Subjects as they appear in the paper names the exam cell types ("STD - 11 SCIENCE CHEMISTRY NOON KKV"),
 * including the misspellings already published. "Science" on its own only counts when no other subject
 * matches, since it is also the stream name for Std 11-12.
 */
const SUBJECTS: ReadonlyArray<[RegExp, string]> = [
  [/^MATHS?$|^MATHEMATICS$/, 'Maths'],
  [/^PARYAVARAN$/, 'Paryavaran'],
  [/^EN[I]?GLISH$/, 'English'],
  [/^GUJARATI$/, 'Gujarati'],
  [/^HINDI$/, 'Hindi'],
  [/^SANSKRIT$/, 'Sanskrit'],
  [/^SAMAJIK\s?VIGYAN$/, 'Samajik Vigyan'],
  [/^ECONOMICS$/, 'Economics'],
  [/^ACCOUNTS?$|^ACCOUNTANCY$/, 'Accountancy'],
  [/^BA$/, 'Business Administration'],
  [/^SPCC$/, 'SPCC'],
  [/^STAT(S|ISTICS)$/, 'Statistics'],
  [/^PHYSICS$/, 'Physics'],
  [/^CHEM(ISTRY|OSTY)$/, 'Chemistry'],
  [/^BIOLOGY$/, 'Biology'],
  [/^TAT(A)?VA?GYAN$/, 'Tatvagyan'],
  [/^PSYCHOLOGY$/, 'Psychology'],
  [/^SOCIOLOGY$/, 'Sociology'],
  [/^GEOGRAPHY$/, 'Geography'],
  [/^HISTORY$/, 'History'],
  [/^COMPUTER/, 'Computer'],
  [/^GK$/, 'General Knowledge'],
];

@Component({
  selector: 'app-answer-key',
  imports: [CustomSelect, FormsModule, MediaUrlPipe, SafeHtmlPipe, PageHero],
  templateUrl: './answer-key.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './answer-key.scss',
})
export class AnswerKey {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);

  readonly tabs: ReadonlyArray<{ id: Tab; label: string }> = [
    { id: 'general', label: 'General Exams' },
    { id: 'competitive', label: 'Competitive Exams' },
  ];
  readonly tab = signal<Tab>('general');

  selectTab(t: Tab): void {
    this.tab.set(t);
  }

  /** Arrow keys move between the tabs (and focus the newly selected one). */
  move(event: Event): void {
    const step = (event as KeyboardEvent).key === 'ArrowRight' ? 1 : -1;
    const i = this.tabs.findIndex((t) => t.id === this.tab());
    const next = this.tabs[(i + step + this.tabs.length) % this.tabs.length].id;
    this.selectTab(next);
    document.getElementById('ak-tab-' + next)?.focus();
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

  /** "Updated …" = the most recent entry's date. */
  readonly lastUpdated = computed(() => {
    const times = this.all().map((p) => new Date(p.date).getTime()).filter((t) => !isNaN(t));
    return times.length ? formatDate(new Date(Math.max(...times)), 'd MMMM yyyy', 'en-US') : '';
  });

  // Filter options come from the papers themselves.
  readonly years = computed(() => [ALL_YEARS, ...[...new Set(this.all().map((p) => p.year).filter(Boolean))].sort().reverse()]);
  readonly standards = computed(() => [
    ALL_STANDARDS,
    ...[...new Set(this.all().map((p) => p.standard).filter(Boolean))].sort((a, b) => this.stdNo(a) - this.stdNo(b)),
  ]);
  readonly subjects = computed(() => [ALL_SUBJECTS, ...[...new Set(this.all().map((p) => p.subject).filter(Boolean))].sort()]);

  year = ALL_YEARS;
  standard = ALL_STANDARDS;
  subject = ALL_SUBJECTS;

  private readonly query = signal({ year: ALL_YEARS, standard: ALL_STANDARDS, subject: ALL_SUBJECTS });
  /** True once a narrowing filter has been applied - the Reset button shows only then. */
  readonly filtered = computed(() => {
    const q = this.query();
    return q.year !== ALL_YEARS || q.standard !== ALL_STANDARDS || q.subject !== ALL_SUBJECTS;
  });
  /** Paper-name search; narrows the list as you type. */
  readonly search = signal('');

  apply(): void {
    this.query.set({ year: this.year, standard: this.standard, subject: this.subject });
    this.pager.reset();
  }

  reset(): void {
    this.year = ALL_YEARS;
    this.standard = ALL_STANDARDS;
    this.subject = ALL_SUBJECTS;
    this.search.set('');
    this.apply();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.pager.reset();
  }

  readonly rows = computed(() => {
    const q = this.query();
    const words = this.search().toLowerCase().split(/\s+/).filter(Boolean);
    return this.all().filter(
      (p) =>
        (q.year === ALL_YEARS || p.year === q.year) &&
        (q.standard === ALL_STANDARDS || p.standard === q.standard) &&
        (q.subject === ALL_SUBJECTS || p.subject === q.subject) &&
        words.every((w) => p.name.toLowerCase().includes(w)),
    );
  });

  readonly pager = new Paginator(this.rows, 10);

  private toPaper(r: AnswerKeyEntry): Paper {
    const d = new Date(r.date);
    const valid = !isNaN(d.getTime());
    const message = r.message ?? '';
    const name = this.strip(message);
    const file = r.files && r.files !== 'null' ? r.files : '';
    // The standard is typed into the name in several ways ("STD - 11", "STD-11", "STD- 12").
    const std = name.match(/\bstd\.?\s*-?\s*(\d+)/i);
    return {
      date: r.date ?? '',
      shortDate: valid ? formatDate(d, 'd MMM y', 'en-US') : '',
      year: valid ? formatDate(d, 'yyyy', 'en-US') : '',
      name,
      message,
      standard: std ? `Std ${Number(std[1])}` : '',
      subject: this.subjectOf(name),
      file,
      fileType: (file.split('?')[0].match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toUpperCase(),
    };
  }

  /** The first known subject word in the name; "Science" only when nothing more specific matches. */
  private subjectOf(name: string): string {
    const words = name.toUpperCase().replace(/\bSTD\.?\s*-?\s*[\d,]+/, ' ').split(/[^A-Z]+/).filter(Boolean);
    for (const w of words) {
      const hit = SUBJECTS.find(([re]) => re.test(w));
      if (hit) return hit[1];
    }
    return words.includes('SCIENCE') ? 'Science' : '';
  }

  private stdNo(label: string): number {
    return Number(label.replace(/\D/g, '')) || 0;
  }

  private strip(html: string): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
