import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourcesService } from '../../../core/services/resources.service';

interface Stat { icon: string; value: string; label: string; }
interface Category { icon: string; name: string; count: string; }
interface PopularIdea { id: string; votes: number; title: string; status: string; desc: string; comments: number; }
interface RequestRow { id: string; title: string; comments: number; category: string; status: string; votes: number; activity: string; }
interface RoadmapItem { id: string; title: string; status: string; votes: number; }
interface Step { n: number; icon: string; title: string; desc: string; }

const CATEGORY_ICON: Record<string, string> = {
  'Dashboard': 'dashboard', 'Reports & Analytics': 'chart', 'Projects': 'projects',
  'Finance': 'finance', 'HR & Payroll': 'hr', 'CRM': 'crm', 'Integrations': 'integrations',
  'Automation': 'automation', 'Mobile App': 'mobile', 'Others': 'others',
};

const PAGE_SIZE = 10;

@Component({
  selector: 'app-feature-request',
  imports: [NgClass, FormsModule],
  templateUrl: './feature-request.html',
  styleUrl: './feature-request.scss',
})
export class FeatureRequest implements OnInit {
  private resources = inject(ResourcesService);
  private platformId = inject(PLATFORM_ID);

  readonly categoryOptions = ['Dashboard', 'Reports & Analytics', 'Projects', 'Finance', 'HR & Payroll', 'CRM', 'Integrations', 'Automation', 'Mobile App', 'Others'];

  // Filters
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  sortBy = 'trending';
  activeCategory = signal('All Ideas');

  // Data
  readonly heroStats = signal<Stat[]>([
    { icon: 'bulb', value: '0', label: 'Ideas Submitted' },
    { icon: 'vote', value: '0', label: 'Votes Cast' },
    { icon: 'calendar', value: '0', label: 'Planned' },
    { icon: 'ship', value: '0', label: 'Shipped' },
  ]);
  readonly roadmap = signal<RoadmapItem[]>([]);
  readonly categories = signal<Category[]>([{ icon: 'grid', name: 'All Ideas', count: '0' }]);
  readonly popularIdeas = signal<PopularIdea[]>([]);
  readonly requests = signal<RequestRow[]>([]);
  readonly loading = signal(false);
  readonly hasMore = signal(false);
  private page = 1;
  private total = 0;

  // Submit modal
  readonly showSubmit = signal(false);
  readonly submitting = signal(false);
  submitForm = { title: '', description: '', category: 'Others', submittedName: '', submittedEmail: '' };

  readonly steps: Step[] = [
    { n: 1, icon: 'idea', title: 'Submit Your Idea', desc: 'Share your feature request with clear details.' },
    { n: 2, icon: 'vote', title: 'Community Votes', desc: 'Others vote and comment on your idea.' },
    { n: 3, icon: 'review', title: 'Under Review', desc: 'Top ideas are reviewed by our product team.' },
    { n: 4, icon: 'build', title: 'Planned & Built', desc: 'We build and update you on progress.' },
    { n: 5, icon: 'ship', title: 'Shipped', desc: 'The feature goes live and you get notified!' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadStats();
    this.loadRoadmap();
    this.loadPopular();
    this.loadRequests(true);
  }

  // ── Loads ──
  private loadStats(): void {
    this.resources.getFeatureRequestStats().subscribe({
      next: (res: any) => {
        const s = res?.data?.summary ?? {};
        this.heroStats.set([
          { icon: 'bulb', value: this.fmt(s.ideasSubmitted), label: 'Ideas Submitted' },
          { icon: 'vote', value: this.fmt(s.votesCast), label: 'Votes Cast' },
          { icon: 'calendar', value: this.fmt(s.planned), label: 'Planned' },
          { icon: 'ship', value: this.fmt(s.shipped), label: 'Shipped' },
        ]);
        const cats: Category[] = [{ icon: 'grid', name: 'All Ideas', count: this.fmt(s.ideasSubmitted) }];
        for (const c of (res?.data?.categories ?? [])) {
          cats.push({ icon: CATEGORY_ICON[c.name] || 'others', name: c.name, count: this.fmt(c.count) });
        }
        this.categories.set(cats);
      },
      error: () => { },
    });
  }

  private loadRoadmap(): void {
    this.resources.getFeatureRequestRoadmap(3).subscribe({
      next: (res: any) => this.roadmap.set((res?.data ?? []).map((r: any) => ({ id: r.id, title: r.title, status: r.status, votes: r.voteCount || 0 }))),
      error: () => this.roadmap.set([]),
    });
  }

  private loadPopular(): void {
    this.resources.getPublicFeatureRequests({ sort: 'top', limit: 3 }).subscribe({
      next: (res: any) => this.popularIdeas.set((res?.data?.data ?? []).map((r: any) => this.toPopular(r))),
      error: () => this.popularIdeas.set([]),
    });
  }

  private loadRequests(reset: boolean): void {
    if (reset) { this.page = 1; }
    this.loading.set(true);
    this.resources.getPublicFeatureRequests({
      page: this.page,
      limit: PAGE_SIZE,
      category: this.categoryFilter || undefined,
      status: this.statusFilter || undefined,
      search: this.searchTerm?.trim() || undefined,
      sort: this.sortBy,
    }).subscribe({
      next: (res: any) => {
        const rows = (res?.data?.data ?? []).map((r: any) => this.toRow(r));
        this.total = res?.data?.total ?? rows.length;
        this.requests.set(reset ? rows : [...this.requests(), ...rows]);
        this.hasMore.set(this.requests().length < this.total);
        this.loading.set(false);
      },
      error: () => { this.requests.set(reset ? [] : this.requests()); this.loading.set(false); },
    });
  }

  // ── Filters ──
  onFilterChange(): void { this.loadRequests(true); }

  selectCategory(name: string): void {
    this.activeCategory.set(name);
    this.categoryFilter = name === 'All Ideas' ? '' : name;
    this.loadRequests(true);
  }

  loadMore(): void { this.page += 1; this.loadRequests(false); }

  // ── Vote ──
  vote(id: string): void {
    if (!id) return;
    this.resources.voteFeatureRequest(id).subscribe({
      next: () => {
        this.popularIdeas.update(list => list.map(i => i.id === id ? { ...i, votes: i.votes + 1 } : i));
        this.requests.update(list => list.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
        this.roadmap.update(list => list.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r));
      },
      error: () => { },
    });
  }

  // ── Submit ──
  openSubmit(): void { this.showSubmit.set(true); }
  closeSubmit(): void {
    this.showSubmit.set(false);
    this.submitForm = { title: '', description: '', category: 'Others', submittedName: '', submittedEmail: '' };
  }

  submitIdea(): void {
    if (!this.submitForm.title.trim() || !this.submitForm.description.trim()) return;
    this.submitting.set(true);
    this.resources.submitFeatureRequest({
      title: this.submitForm.title,
      description: this.submitForm.description,
      category: this.submitForm.category,
      submittedName: this.submitForm.submittedName || undefined,
      submittedEmail: this.submitForm.submittedEmail || undefined,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeSubmit();
        this.loadStats();
        this.loadRequests(true);
      },
      error: () => this.submitting.set(false),
    });
  }

  // ── Helpers ──
  statusLabel(status: string): string {
    return (status || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PLANNED': return 'bg-main/10 text-main';
      case 'IN_PROGRESS': return 'bg-amber-500/10 text-amber-600';
      case 'SHIPPED': return 'bg-emerald-500/10 text-emerald-600';
      case 'DECLINED': return 'bg-red-500/10 text-red-600';
      case 'UNDER_REVIEW': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-primary/10 text-secondary';
    }
  }

  private toPopular(r: any): PopularIdea {
    return { id: r.id, votes: r.voteCount || 0, title: r.title, status: r.status, desc: r.description || '', comments: r.commentCount || 0 };
  }

  private toRow(r: any): RequestRow {
    return { id: r.id, title: r.title, comments: r.commentCount || 0, category: r.category || 'Others', status: r.status, votes: r.voteCount || 0, activity: this.relativeTime(r.updatedAt || r.createdAt) };
  }

  private fmt(n: number): string {
    return (n || 0).toLocaleString('en-US');
  }

  private relativeTime(value: string): string {
    if (!value) return '';
    const then = new Date(value).getTime();
    if (isNaN(then)) return '';
    const diff = Date.now() - then;
    const day = 86400000;
    if (diff < day) return 'today';
    const days = Math.floor(diff / day);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}
