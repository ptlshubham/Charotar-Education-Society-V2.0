import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHero } from '../../shared/page-hero/page-hero';
import { Paginator } from '../../shared/pagination/paginator';
import { Pagination } from '../../shared/pagination/pagination';
import { Sorter } from '../../shared/sorting/sorter';
import { SortHeader } from '../../shared/sorting/sort-header';
import { MediaUrlPipe } from '../../shared/media-url.pipe';

interface Tender {
  title: string;
  number: string;
  department: string;
  start: string;
  end: string;
  status: 'Open' | 'Closed' | 'Upcoming';
  /** Downloadable tender PDFs, resolved against the media host by mediaUrl. */
  documents: readonly { label: string; file: string }[];
}

@Component({
  selector: 'app-tenders',
  imports: [FormsModule, PageHero, Pagination, SortHeader, MediaUrlPipe],
  templateUrl: './tenders.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tenders.scss',
})
export class Tenders {
  readonly assurances: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Fair & Transparent', body: 'All tenders follow a fair and transparent process.', icon: 'account_balance' },
    { title: 'Secure Process', body: 'A secure and monitored tendering system.', icon: 'verified' },
    { title: 'Timely Updates', body: 'Latest opportunities and notifications.', icon: 'description' },
    { title: 'Open to All', body: 'Inviting capable vendors and service providers.', icon: 'group' },
    { title: 'Need Help?', body: 'Contact our team for any clarifications.', icon: 'call' },
  ];

  // Real tender data carried over from the legacy CES site (single active tender).
  // The table, filters and pagination stay so admin can add more later.
  private readonly all: readonly Tender[] = [
    {
      title: 'Purchase of Lab Equipments',
      number: '',
      department: '',
      start: '01 Jun 2024',
      end: '07 Jun 2024',
      status: 'Closed',
      documents: [
        { label: 'Document 1', file: 'pdf/1742537286914.pdf' },
        { label: 'Document 2', file: 'pdf/1742537309979.pdf' },
      ],
    },
  ];

  readonly departments = computed(() => ['All Departments', ...new Set(this.all.map((t) => t.department).filter(Boolean))]);
  readonly statuses: readonly string[] = ['Status: All', 'Open', 'Closed', 'Upcoming'];
  readonly categories: readonly string[] = ['All Categories', 'Goods', 'Services', 'Works'];

  category = 'All Categories';
  department = 'All Departments';
  status = 'Status: All';
  search = '';

  readonly catOpen = signal(false);
  readonly depOpen = signal(false);
  readonly statusOpen = signal(false);

  private readonly query = signal({ department: 'All Departments', status: 'Status: All', search: '' });

  apply(): void {
    this.query.set({ department: this.department, status: this.status, search: this.search.trim().toLowerCase() });
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
    return this.all.filter(
      (t) =>
        (q.department === 'All Departments' || t.department === q.department) &&
        (q.status === 'Status: All' || t.status === q.status) &&
        (!q.search || t.title.toLowerCase().includes(q.search) || t.number.toLowerCase().includes(q.search)),
    );
  });

  readonly sorter = new Sorter(this.rows);
  readonly pager = new Paginator(this.sorter.sorted, 6);

  statusClass(status: Tender['status']): string {
    switch (status) {
      case 'Open':
        return 'bg-accent/10 text-accent';
      case 'Upcoming':
        return 'bg-secondary/20 text-secondary-dark';
      default:
        return 'bg-gray-100 text-muted';
    }
  }
}
