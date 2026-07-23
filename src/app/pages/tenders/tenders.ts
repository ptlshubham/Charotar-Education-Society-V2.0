import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Tender {
  title: string;
  number: string;
  department: string;
  start: string;
  end: string;
  status: 'Open' | 'Closed' | 'Upcoming';
}

@Component({
  selector: 'app-tenders',
  imports: [FormsModule, RouterLink],
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

  /** TODO: replace with the tenders feed. */
  private readonly all: readonly Tender[] = [
    { title: 'Purchase of Lab Equipments', number: 'CES/ENG/2024-25/01', department: 'Engineering', start: '01 Jun 2024', end: '07 Jun 2024', status: 'Closed' },
    { title: 'Annual Maintenance Contract', number: 'CES/INFRA/2024-25/02', department: 'Infrastructure', start: '10 Jun 2024', end: '20 Jun 2024', status: 'Closed' },
    { title: 'Supply of Office Stationery', number: 'CES/ADMIN/2024-25/03', department: 'Administration', start: '18 Jun 2024', end: '28 Jun 2024', status: 'Open' },
    { title: 'Canteen Services', number: 'CES/ADMIN/2024-25/04', department: 'Administration', start: '22 Jun 2024', end: '05 Jul 2024', status: 'Open' },
    { title: 'Landscaping & Gardening Services', number: 'CES/INFRA/2024-25/05', department: 'Infrastructure', start: '25 Jun 2024', end: '10 Jul 2024', status: 'Upcoming' },
    { title: 'IT Hardware & Peripherals', number: 'CES/IT/2024-25/06', department: 'IT Department', start: '01 Jul 2024', end: '15 Jul 2024', status: 'Upcoming' },
  ];

  readonly departments = computed(() => ['All Departments', ...new Set(this.all.map((t) => t.department))]);
  readonly statuses: readonly string[] = ['Status: All', 'Open', 'Closed', 'Upcoming'];
  readonly categories: readonly string[] = ['All Categories', 'Goods', 'Services', 'Works'];

  category = 'All Categories';
  department = 'All Departments';
  status = 'Status: All';
  search = '';

  private readonly query = signal({ department: 'All Departments', status: 'Status: All', search: '' });

  apply(): void {
    this.query.set({ department: this.department, status: this.status, search: this.search.trim().toLowerCase() });
    this.page.set(1);
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

  // ─── Pagination ───
  readonly pageSize = 6;
  readonly page = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.rows().length / this.pageSize)));
  readonly paged = computed(() =>
    this.rows().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize),
  );
  readonly rangeStart = computed(() => (this.rows().length ? (this.page() - 1) * this.pageSize + 1 : 0));
  readonly rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.rows().length));
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 5),
  );

  go(delta: number): void {
    this.page.update((p) => Math.min(this.totalPages(), Math.max(1, p + delta)));
  }

  toPage(n: number): void {
    this.page.set(n);
  }

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
