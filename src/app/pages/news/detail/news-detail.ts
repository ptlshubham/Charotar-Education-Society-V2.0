import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { SeoService } from '../../../core/services/seo.service';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { Academics } from '../../home/academics/academics';
import { plainText } from '../../../shared/blog-post';
import { NEWS_TYPES, NEWS_TYPE_ICONS, NewsItem, newsDate, newsTileClass, toNewsItem } from '../../../shared/news-item';

/** Average adult reading speed, for the "N min read" estimate. */
const WORDS_PER_MINUTE = 200;

/**
 * One news item, announcement or circular: /more/news/<id>. Published from Website Management →
 * News & Notices; client-rendered (app.routes.server.ts), since items are added after the build.
 * Laid out like a blog post (blog/detail) so the two read the same.
 */
@Component({
  selector: 'app-news-detail',
  imports: [FormsModule, RouterLink, SafeHtmlPipe, PageHero, Academics, AdmissionsCta],
  templateUrl: './news-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The body comes from the same dashboard editor as a blog post, so it reuses the post's markup layout.
  styleUrl: '../../blog/detail/detail.scss',
})
export class NewsDetail {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly id = toSignal(this.route.paramMap.pipe(map((pm) => Number(pm.get('id')))), { initialValue: NaN });

  /** Same hero photo as the News page - an item's picture is often a poster, which a hero would crop. */
  readonly banner = PLACEHOLDER.about.hero;

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  /** Newest first, as the API sends them. */
  private readonly items = signal<readonly NewsItem[]>([]);

  search = '';

  readonly date = newsDate;
  readonly icons = NEWS_TYPE_ICONS;
  readonly tileClass = newsTileClass;

  constructor() {
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

    effect(() => {
      const i = this.item();
      if (!i) return;
      this.seo.applyCustom({
        title: i.title,
        description: i.excerpt || `${i.typeLabel} from Charotar Education Society, ${newsDate(i.day)}.`,
        image: i.image,
        url: `/more/news/${i.id}`,
      });
    });
  }

  private readonly index = computed(() => this.items().findIndex((i) => i.id === this.id()));

  readonly item = computed(() => this.items()[this.index()] ?? null);

  /** True once the feed has loaded but the requested item wasn't in it. */
  readonly notFound = computed(() => this.state() === 'ready' && !this.item());

  readonly readingTime = computed(() => {
    const words = plainText(this.item()?.html).split(' ').filter(Boolean).length;
    return words ? `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read` : '';
  });

  /** The attached file's own name, for its card. */
  readonly fileName = computed(() => {
    const file = this.item()?.file;
    if (!file) return '';
    const name = file.split(/[?#]/)[0].split('/').pop() ?? '';
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  });

  readonly prev = computed(() => {
    const i = this.index();
    return i > 0 ? this.items()[i - 1] : null;
  });

  readonly next = computed(() => {
    const i = this.index();
    const list = this.items();
    return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  });

  readonly recent = computed(() => this.items().slice(0, 5));

  /** Types with a published item, and how many - each opens that tab of the News page. */
  readonly categories = computed(() =>
    NEWS_TYPES.map((t) => ({ key: t.key, label: t.plural, count: this.items().filter((i) => i.type === t.key).length })).filter(
      (c) => c.count,
    ),
  );

  readonly shares = computed(() => {
    const i = this.item();
    if (!i) return [];
    const url = encodeURIComponent(`${this.browser ? location.origin : ''}/more/news/${i.id}`);
    const text = encodeURIComponent(i.title);
    return [
      { label: 'Facebook', tone: 'bg-[#1877F2]', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
      { label: 'Twitter', tone: 'bg-[#1DA1F2]', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
      { label: 'LinkedIn', tone: 'bg-[#0A66C2]', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
      { label: 'WhatsApp', tone: 'bg-[#25D366]', href: `https://wa.me/?text=${text}%0A${url}` },
    ];
  });

  /** The search box hands over to the News page, which does the filtering. */
  find(): void {
    const q = this.search.trim();
    this.router.navigate(['/more/news'], { queryParams: q ? { q } : {} });
  }

  /** Material Symbols icon for the attached file, by kind. */
  fileIcon(kind: NewsItem['fileKind']): string {
    switch (kind) {
      case 'Excel':
        return 'table_chart';
      case 'PowerPoint':
        return 'slideshow';
      case 'Word':
        return 'description';
      default:
        return 'picture_as_pdf';
    }
  }
}
