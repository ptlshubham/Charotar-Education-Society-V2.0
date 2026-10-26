import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { BlogPost } from '../../../shared/models/models';
import { BLOG_BANNER, blogExcerpt, blogImageUrl, blogSlug, blogTags, countTags, sortCategories } from '../../../shared/blog-post';

interface Post {
  /** URL segment - the slug, or the id for older posts. */
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  day: string;
  month: string;
  year: string;
  image: string;
  imageAlt: string;
  author: string;
}

const ALL = 'All Posts';
/** Cards in the grid before "Show more posts" (three rows on desktop). */
const PAGE = 9;

@Component({
  selector: 'app-blog-list',
  imports: [FormsModule, RouterLink, PageHero],
  templateUrl: './list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './list.scss',
})
export class BlogList {
  private readonly route = inject(ActivatedRoute);
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);

  readonly banner = BLOG_BANNER;

  readonly tab = signal(ALL);
  /** Set from ?tag= (the tag chips on a post link here). */
  readonly tag = signal('');
  search = '';
  private readonly query = signal('');

  /** How many grid cards show; back to one page whenever the filter changes. */
  readonly limit = signal(PAGE);

  select(t: string): void {
    this.tab.set(t);
    this.tag.set('');
    this.limit.set(PAGE);
  }

  clearTag(): void {
    this.tag.set('');
    this.limit.set(PAGE);
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.limit.set(PAGE);
  }

  showMore(): void {
    this.limit.update((n) => n + PAGE);
  }

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly allPosts = signal<readonly Post[]>([]);

  constructor() {
    // Deep links from a post: /blog?category=Events, /blog?tag=exam
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      this.tab.set(pm.get('category') || ALL);
      this.tag.set(pm.get('tag') || '');
      this.limit.set(PAGE);
    });

    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getBlogs(id)),
        catchError(() => {
          this.failed.set(true);
          return of<BlogPost[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? list : [];
        this.allPosts.set(rows.map((b) => this.toPost(b)));
        this.loading.set(false);
      });
  }

  /** "All Posts" plus each category that has a post. */
  readonly tabs = computed(() => [ALL, ...sortCategories(this.allPosts().map((p) => p.category).filter(Boolean))]);

  private readonly filtering = computed(() => this.tab() !== ALL || !!this.tag() || !!this.query());

  private readonly matches = computed(() => {
    const tab = this.tab();
    const tag = this.tag().toLowerCase();
    const q = this.query();
    return this.allPosts().filter(
      (p) =>
        (tab === ALL || p.category === tab) &&
        (!tag || p.tags.some((t) => t.toLowerCase() === tag)) &&
        (!q ||
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))),
    );
  });

  /** The newest post is featured on the unfiltered page; a filter shows every match in the grid. */
  readonly featured = computed(() => (this.filtering() ? null : this.allPosts()[0] ?? null));
  private readonly gridPosts = computed(() => (this.filtering() ? this.matches() : this.allPosts().slice(1)));
  readonly visible = computed(() => this.gridPosts().slice(0, this.limit()));
  readonly moreCount = computed(() => Math.max(0, this.gridPosts().length - this.limit()));

  readonly recent = computed(() => this.allPosts().slice(0, 5));

  /** The Labels box: every tag in use, with its post count. */
  readonly labels = computed(() => countTags(this.allPosts().map((p) => p.tags)));
  readonly activeTag = computed(() => this.tag().toLowerCase());

  email = '';

  subscribe(): void {
    this.email = '';
  }

  private toPost(b: BlogPost): Post {
    const d = new Date(b.blogDate);
    const valid = !isNaN(d.getTime());
    return {
      id: blogSlug(b),
      title: b.blogTitle ?? '',
      excerpt: blogExcerpt(b),
      category: b.category ?? '',
      tags: blogTags(b),
      date: valid ? formatDate(d, 'mediumDate', 'en-US') : (b.blogDate ?? ''),
      day: valid ? formatDate(d, 'dd', 'en-US') : '',
      month: valid ? formatDate(d, 'MMM', 'en-US').toUpperCase() : '',
      year: valid ? formatDate(d, 'yyyy', 'en-US') : '',
      image: blogImageUrl(b),
      imageAlt: b.imageAlt || b.blogTitle || '',
      author: b.authorName || 'CES Admin',
    };
  }
}
