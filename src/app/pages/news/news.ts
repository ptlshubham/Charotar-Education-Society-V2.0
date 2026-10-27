import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PageHero } from '../../shared/page-hero/page-hero';
import { NewsletterForm } from '../../shared/newsletter-form/newsletter-form';
import { PLACEHOLDER } from '../../shared/placeholder-images';
import { ResourcesService } from '../../core/services/resources.service';
import { InstituteService } from '../../core/services/institute.service';
import { NEWS_TYPES, NEWS_TYPE_ICONS, NewsItem, NewsType, newsDate, newsTileClass, toNewsItem } from '../../shared/news-item';

type Tab = NewsType | 'all';

/** Icon paths for the category rail (24×24, stroked). */
const TAB_ICONS: Record<Tab, string[]> = { all: NEWS_TYPE_ICONS.news, ...NEWS_TYPE_ICONS };

/** Cards shown at first, and added by "Show more". */
const PAGE = 12;

/**
 * News & Updates - the society's news, announcements and circulars, published from Website
 * Management → News & Notices (live: GET /admin/GetPublicNews). /more/news?type=circular opens
 * a tab directly, ?q= a search (from an item page's search box); each item has its own page at
 * /more/news/<id>.
 */
@Component({
  selector: 'app-news',
  imports: [FormsModule, PageHero, RouterLink, NewsletterForm],
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

  readonly banner = 'assets/images/hero/news.webp';

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

  readonly date = newsDate;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const type = pm.get('type');
      this.tab.set(this.tabs.some((t) => t.key === type) ? (type as Tab) : 'all');
      // Only set when present: switching tabs drops ?q= from the URL, but should keep the search.
      const q = pm.get('q');
      if (q !== null) this.query.set(q);
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
    return newsTileClass(type);
  }

  iconFor(type: NewsType): string[] {
    return TAB_ICONS[type];
  }
}
