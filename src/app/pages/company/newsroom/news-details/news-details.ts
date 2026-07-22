import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResourcesService } from '../../../../core/services/resources.service';
import { SeoService } from '../../../../core/services/seo.service';
import { environment } from '../../../../../environments/environment';

interface RelatedNews {
  id: string; // slug
  image: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

const CATEGORY_COLOR: Record<string, string> = {
  'Announcement': '#3DAFA9', 'Product Update': '#3772FF', 'Press Release': '#3772FF',
  'Events': '#F17C9F', 'Event Recap': '#E8A33D', 'Company News': '#3DAFA9',
  'Partnership': '#3DAFA9', 'Blog': '#C587CE', 'Resources': '#E8A33D',
};

@Component({
  selector: 'app-news-details',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './news-details.html',
  styleUrl: './news-details.scss',
})
export class NewsDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private resourcesService = inject(ResourcesService);
  private seo = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly title = signal('');
  readonly category = signal('');
  readonly categoryColor = signal('#3DAFA9');
  readonly date = signal('');
  readonly updated = signal('');
  readonly readingTime = signal(1);
  readonly views = signal(0);
  readonly heroImage = signal(PLACEHOLDER_IMAGE);
  readonly excerpt = signal('');
  readonly content = signal('');
  readonly tags = signal<string[]>([]);
  readonly relatedNews = signal<RelatedNews[]>([]);
  readonly copied = signal(false);

  ngOnInit(): void {
    // Runs on the server too, so the article's meta tags are serialised into the
    // SSR HTML  social crawlers don't execute JS and would otherwise see none.
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.loadNews(slug);
    });
  }

  private loadNews(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.resourcesService.getPublicNewsBySlug(slug).subscribe({
      next: (res: any) => {
        const n = res?.data;
        if (!n) { this.notFound.set(true); this.loading.set(false); return; }
        const category = n.category || 'News';
        this.title.set(n.title || '');
        this.category.set(category);
        this.categoryColor.set(CATEGORY_COLOR[category] || '#3DAFA9');
        this.date.set(this.formatDate(n.publishedAt || n.createdAt));
        this.updated.set(this.formatDate(n.updatedAt || n.publishedAt || n.createdAt));
        this.views.set(n.viewCount || 0);
        this.readingTime.set(this.estimateReadingTime(n.content || ''));
        this.heroImage.set(this.resolveImage(n.thumbnail));
        this.excerpt.set(n.excerpt || '');
        this.content.set(n.content || '');
        this.tags.set(String(n.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean));
        this.applySeo(n, slug);
        this.loadRelated(slug);
        this.loading.set(false);
        if (isPlatformBrowser(this.platformId)) window.scrollTo({ top: 0 });
      },
      error: () => { this.notFound.set(true); this.loading.set(false); },
    });
  }

  /** Article's own meta wins; blank admin fields fall back to its title/excerpt. */
  private applySeo(news: any, slug: string): void {
    this.seo.applyCustom({
      title: news.metaTitle || news.title,
      description: news.metaDescription || news.excerpt,
      keywords: news.metaKeywords || news.tags,
      image: news.thumbnail ? this.resolveImage(news.thumbnail) : null,
      url: `/company/newsroom/${slug}`,
    });
  }

  private loadRelated(currentSlug: string): void {
    this.resourcesService.getPublicNews({ limit: 4 }).subscribe({
      next: (res: any) => {
        const rows: any[] = res?.data?.data ?? [];
        this.relatedNews.set(rows
          .filter((n) => n.slug !== currentSlug)
          .slice(0, 3)
          .map((n) => ({
            id: n.slug,
            image: this.resolveImage(n.thumbnail),
            title: n.title,
            excerpt: n.excerpt || '',
            date: this.formatDate(n.publishedAt || n.createdAt),
            category: n.category || 'News',
          })));
      },
    });
  }

  private estimateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  /** Share links built from the current article URL (browser only). */
  shareUrl(platform: 'linkedin' | 'twitter' | 'facebook'): string {
    const url = encodeURIComponent(isPlatformBrowser(this.platformId) ? window.location.href : '');
    const text = encodeURIComponent(this.title());
    switch (platform) {
      case 'twitter': return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'linkedin':
      default: return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
  }

  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard?.writeText(window.location.href).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }

  private resolveImage(thumbnail: string): string {
    if (!thumbnail) return PLACEHOLDER_IMAGE;
    return /^https?:\/\//.test(thumbnail) ? thumbnail : environment.apiUrl + thumbnail;
  }

  private formatDate(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
