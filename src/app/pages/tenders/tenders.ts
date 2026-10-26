import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Paginator } from '../../shared/pagination/paginator';
import { Pagination } from '../../shared/pagination/pagination';
import { Sorter } from '../../shared/sorting/sorter';
import { SortHeader } from '../../shared/sorting/sort-header';
import { MediaUrlPipe } from '../../shared/media-url.pipe';
import { ResourcesService } from '../../core/services/resources.service';
import { TenderItem } from '../../shared/models/models';

/** The status filter's options, as shown; the API sends them lower-case. */
const STATUS_LABEL: Record<TenderItem['status'], string> = { upcoming: 'Upcoming', open: 'Open', closed: 'Closed' };

/**
 * Tenders: managed in Website Management → Tenders and loaded from GET /tenders/public, newest
 * first - a new tender needs no rebuild. The API works out each tender's status (Upcoming / Open /
 * Closed, by its dates and closing time in IST).
 */
@Component({
  selector: 'app-tenders',
  imports: [DatePipe, FormsModule, RouterLink, PageHero, Pagination, SortHeader, MediaUrlPipe],
  templateUrl: './tenders.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tenders.scss',
})
export class Tenders {
  private readonly resources = inject(ResourcesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly assurances: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Fair & transparent', body: 'A clear and fair tendering process.', icon: 'account_balance' },
    { title: 'Secure process', body: 'A monitored tendering system.', icon: 'verified_user' },
    { title: 'Timely updates', body: 'Opportunities and notifications in one place.', icon: 'description' },
    { title: 'Open participation', body: 'For capable vendors and service providers.', icon: 'group' },
  ];

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly all = signal<readonly TenderItem[]>([]);

  readonly departments = computed(() => ['All Departments', ...new Set(this.all().map((t) => t.department).filter((d): d is string => !!d))]);
  readonly statuses: readonly string[] = ['Status: All', 'Open', 'Closed', 'Upcoming'];
  readonly categories: readonly string[] = ['All Categories', 'Goods', 'Services', 'Works'];

  category = 'All Categories';
  department = 'All Departments';
  status = 'Status: All';
  search = '';

  readonly catOpen = signal(false);
  readonly depOpen = signal(false);
  readonly statusOpen = signal(false);

  private readonly query = signal({ category: 'All Categories', department: 'All Departments', status: 'Status: All', search: '' });

  constructor() {
    this.load();
  }

  load(): void {
    this.state.set('loading');
    this.resources
      .getTenders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tenders) => {
          this.all.set(tenders ?? []);
          this.pager.reset();
          this.state.set('ready');
        },
        error: () => this.state.set('error'),
      });
  }

  apply(): void {
    this.query.set({ category: this.category, department: this.department, status: this.status, search: this.search.trim().toLowerCase() });
    this.pager.reset();
  }

  reset(): void {
    this.category = 'All Categories';
    this.department = 'All Departments';
    this.status = 'Status: All';
    this.search = '';
    this.apply();
  }

  readonly rows = computed(() => {
    const q = this.query();
    return this.all().filter(
      (t) =>
        (q.category === 'All Categories' || t.category === q.category) &&
        (q.department === 'All Departments' || t.department === q.department) &&
        (q.status === 'Status: All' || STATUS_LABEL[t.status] === q.status) &&
        (!q.search || t.title.toLowerCase().includes(q.search) || (t.tenderNo ?? '').toLowerCase().includes(q.search)),
    );
  });

  // Dates are YYYY-MM-DD, so the sorter orders them correctly as text.
  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 6);

  statusLabel(status: TenderItem['status']): string {
    return STATUS_LABEL[status];
  }

  statusClass(status: TenderItem['status']): string {
    switch (status) {
      case 'open':
        return 'bg-accent/10 text-accent';
      case 'upcoming':
        return 'bg-secondary/20 text-secondary-dark';
      default:
        return 'bg-gray-100 text-muted';
    }
  }

  /** "17:00" → "5:00 pm". */
  time12(hhmm: string | null): string {
    if (!hhmm) return '';
    const [h, m] = hhmm.split(':').map(Number);
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
  }
}
