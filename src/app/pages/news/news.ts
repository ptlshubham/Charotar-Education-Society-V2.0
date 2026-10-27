import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PageHero } from '../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../shared/placeholder-images';
import { ResourcesService } from '../../core/services/resources.service';
import { InstituteService } from '../../core/services/institute.service';
import { NEWS_TYPES, NewsItem, NewsType, newsDate, toNewsItem } from '../../shared/news-item';

type Tab = NewsType | 'all';

/** Icon paths for the category rail (24×24, stroked). */
const TAB_ICONS: Record<Tab, string[]> = {
  all: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'],
  news: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'],
  announcement: ['M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z', 'M16 9a4 4 0 0 1 0 6'],
  circular: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8M8 17h5'],
};

/** Cards shown at first, and added by "Show more". */
const PAGE = 12;

/**
 * News & Updates - the society's news, announcements and circulars, published from Website
 * Management → News & Notices (live: GET /admin/GetPublicNews). /more/news?type=circular opens
 * a tab directly; each item has its own page at /more/news/<id>.
 */
@Component({
  selector: 'app-news',
  imports: [FormsModule, PageHero, RouterLink],
  templateUrl: './news.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './news.scss',
})
export class News {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly banner = PLACEHOLDER.about.hero;

  readonly tabs: ReadonlyArray<{ key: Tab; label: string; path: string[] }> = [
    { key: 'all', label: 'All Updates', path: TAB_ICONS.all },
    ...NEWS_TYPES.map((t) => ({ key: t.key as Tab, label: t.plural, path: TAB_ICONS[t.key] })),
  ];

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly items = signal<readonly NewsItem[]>([]);

  readonly tab = signal<Tab>('all');
  readonly view = signal<'grid' | 'list'>('grid');
  readonly query = signal('');
  readonly sort = signal<'latest' | 'oldest'>('latest');
  readonly limit = signal(PAGE);
  email = '';

  readonly date = newsDate;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const type = pm.get('type');
      this.tab.set(this.tabs.some((t) => t.key === type) ? (type as Tab) : 'all');
      this.limit.set(PAGE);
    });
    this.load();
  }

  load(): void {
    this.state.set('loading');
    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getNews(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (rows) => {
          this.items.set((Array.isArray(rows) ? rows : []).map(toNewsItem));
          this.state.set('ready');
        },
        error: () => this.state.set('error'),
      });
  }

  count(key: Tab): number {
    return key === 'all' ? this.items().length : this.items().filter((i) => i.type === key).length;
  }

  /** The tab as a URL, so it can be shared and survives a reload. */
  select(key: Tab): void {
    this.router.navigate([], { queryParams: { type: key === 'all' ? null : key }, replaceUrl: true });
  }

  readonly visible = computed(() => {
    const tab = this.tab();
    const q = this.query().trim().toLowerCase();
    const list = this.items().filter(
      (i) => (tab === 'all' || i.type === tab) && (!q || i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)),
    );
    // The API sends newest first; the items' own order breaks ties.
    return this.sort() === 'latest' ? list : [...list].reverse();
  });

  readonly shown = computed(() => this.visible().slice(0, this.limit()));

  more(): void {
    this.limit.update((n) => n + PAGE);
  }

  subscribe(): void {
    this.email = '';
  }

  tagClass(type: NewsType): string {
    switch (type) {
      case 'announcement':
        return 'bg-secondary text-primary';
      case 'circular':
        return 'bg-accent text-white';
      default:
        return 'bg-primary text-white';
    }
  }

  /** The tile behind a card without a cover picture. */
  tileClass(type: NewsType): string {
    switch (type) {
      case 'announcement':
        return 'bg-[#FFF4DE] text-[#B7791F]';
      case 'circular':
        return 'bg-[#FDECEC] text-accent';
      default:
        return 'bg-[#EEF3FB] text-primary';
    }
  }

  iconFor(type: NewsType): string[] {
    return TAB_ICONS[type];
  }
}
