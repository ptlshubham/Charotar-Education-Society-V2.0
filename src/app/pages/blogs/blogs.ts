import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';
import { NewsletterService } from '../../core/services/newsletter.service';
import { environment } from '../../../environments/environment';

interface BlogPost {
  /** slug  used for the detail route (/blogs/:slug) */
  id: string;
  image: string;
  /** Primary category from the DB  drives the filter tabs and the card badge */
  category: string;
  /** Free-form tags  rendered as the #chips on the card */
  tags: string[];
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

const PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

/** "Customer Stories" → "customer-stories" */
const slugify = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, '-');

@Component({
  selector: 'app-blogs',
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './blogs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './blogs.scss',
})
export class Blogs implements OnInit {
  private resourcesService = inject(ResourcesService);
  private newsletter = inject(NewsletterService);
  private platformId = inject(PLATFORM_ID);

  /** Hero heading + supporting copy */
  readonly heroTitle = 'Latest Blogs';
  readonly heroSubtitle =
    'Insights, stories, and strategies to help you streamline operations, empower your teams, and grow your business smarter.';

  /** Pagination */
  readonly pageSize = 8;

  // ─── Reactive source state ───
  readonly loading = signal(true);
  readonly allPosts = signal<BlogPost[]>([]);
  readonly activeCategory = signal('all');
  readonly currentPage = signal(1);

  // ─── Derived state (recomputes automatically, glitch-free  no NG0100) ───

  /**
   * Filter tabs are built from the categories actually present in the DB,
   * de-duplicated by slug, alphabetical, with "All Blogs" pinned first.
   */
  readonly categories = computed(() => {
    const bySlug = new Map<string, string>();
    for (const post of this.allPosts()) {
      if (post.category && !bySlug.has(slugify(post.category))) {
        bySlug.set(slugify(post.category), post.category);
      }
    }
    const fromDb = [...bySlug]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [{ id: 'all', label: 'All Blogs' }, ...fromDb];
  });

  readonly filteredPosts = computed(() => {
    const category = this.activeCategory();
    const posts = this.allPosts();
    if (category === 'all') return posts;
    return posts.filter((p) => slugify(p.category) === category);
  });

  readonly pages = computed(() => {
    const pageCount = Math.ceil(this.filteredPosts().length / this.pageSize);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  });

  readonly pagedPosts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPosts().slice(start, start + this.pageSize);
  });

  // ─── Newsletter subscribe form (success shows the universal popup) ───
  readonly subscribeEmail = signal('');
  readonly subscribing = signal(false);
  readonly subscribeMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  subscribeNewsletter(): void {
    const email = this.subscribeEmail().trim();
    if (!email) {
      this.subscribeMessage.set({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    this.subscribing.set(true);
    this.subscribeMessage.set(null);
    this.newsletter.subscribe(email, 'blogs').subscribe({
      next: () => {
        this.subscribing.set(false);
        this.subscribeEmail.set('');
      },
      error: (err: any) => {
        this.subscribing.set(false);
        this.subscribeMessage.set({
          type: 'error',
          text: err?.error?.message || 'Something went wrong. Please try again.',
        });
      },
    });
  }

  ngOnInit(): void {
    // Fetch only in the browser. Signal writes in the subscribe callback schedule
    // change detection reactively, so the list renders as soon as the response
    // arrives  no manual cdr call, no "stuck on Loading until a click".
    if (isPlatformBrowser(this.platformId)) {
      this.loadBlogs();
    }
  }

  private loadBlogs(): void {
    this.loading.set(true);
    this.resourcesService.getPublicBlogs({ limit: 100 }).subscribe({
      next: (res: any) => {
        debugger;
        const blogs = res?.data?.data ?? [];
        this.allPosts.set(blogs.map((b: any) => this.mapBlog(b)));
        this.loading.set(false);
      },
      error: () => {
        this.allPosts.set([]);
        this.loading.set(false);
      },
    });
  }

  private mapBlog(b: any): BlogPost {
    const tags = String(b.tags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => !!t);
    const category = b.category || '';
    return {
      id: b.slug,
      image: this.resolveImage(b.thumbnail),
      category,
      tags,
      title: b.title,
      excerpt: b.excerpt || '',
      date: this.formatDate(b.publishedAt || b.createdAt),
      readTime: b.readingTime || '',
    };
  }

  /**
   * Thumbnails come back as host-relative paths (e.g. "/blog/thumbnails/x.png")
   * served by the API, not the website origin  so prefix them with the API host.
   * Absolute URLs are passed through; empty values fall back to the placeholder.
   */
  private resolveImage(thumbnail: string): string {
    if (!thumbnail) return PLACEHOLDER_IMAGE;
    if (/^https?:\/\//.test(thumbnail)) return thumbnail;
    return environment.apiUrl + thumbnail;
  }

  private formatDate(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  selectCategory(id: string): void {
    this.activeCategory.set(id);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.pages().length) return;
    this.currentPage.set(page);
  }
}
