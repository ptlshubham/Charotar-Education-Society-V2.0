import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  imports: [FormsModule, RouterLink, Pagination, SortHeader, MediaUrlPipe],
  templateUrl: './tenders.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tenders.scss',
})
export class Tenders {
  readonly assurances: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Fair & Transparent', body: 'All tenders follow a fair and transparent process.', path: ['m3 10 9-6 9 6', 'M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18'] },
    { title: 'Secure Process', body: 'A secure and monitored tendering system.', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { title: 'Timely Updates', body: 'Latest opportunities and notifications.', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'] },
    { title: 'Open to All', body: 'Inviting capable vendors and service providers.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { title: 'Need Help?', body: 'Contact our team for any clarifications.', path: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'] },
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
