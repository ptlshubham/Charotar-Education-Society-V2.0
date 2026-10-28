import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { BlogCard } from '../../../shared/models/models';
import { blogExcerpt, blogImageUrl, blogSlug } from '../../../shared/blog-post';

interface Post {
  /** URL segment - the slug, or the id for older posts. */
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  /** Full URL - bound directly, not through mediaUrl. */
  image: string;
}

/** Posts the section shows: two large cards, then up to three in the compact list. */
const FEATURED = 2;
const COMPACT = 3;

/**
 * "From Our Blog" - the latest posts from Website Management → Blogs, the same feed as the
 * /blog page; each card opens the post. Hidden while loading and when there are none.
 * (A separate news section is planned; this one is blogs only.)
 *
 * Browser-only, so a new post shows on the next visit rather than the next site build.
 */
@Component({
  selector: 'app-news-events',
  imports: [RouterLink],
  templateUrl: './news-events.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './news-events.scss',
})
export class NewsEvents {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly posts = signal<readonly Post[]>([]);
  readonly featured = computed(() => this.posts().slice(0, FEATURED));
  readonly compact = computed(() => this.posts().slice(FEATURED, FEATURED + COMPACT));

  constructor() {
    afterNextRender(() =>
      this.institute
        .resolve()
        .pipe(
          // Only the posts shown, without their bodies (falls back to the full feed - see getBlogCards).
          switchMap((id) => this.resources.getBlogCards(id, FEATURED + COMPACT)),
          timeout(8000),
          catchError(() => of<BlogCard[]>([])),
          takeUntilDestroyed(this.destroyRef),
        )
        // The API sends them newest first.
        .subscribe((list) => this.posts.set((Array.isArray(list) ? list : []).map((b) => this.toPost(b)))),
    );
  }

  private toPost(b: BlogCard): Post {
    const d = new Date(b.blogDate);
    return {
      id: blogSlug(b),
      title: b.blogTitle ?? '',
      excerpt: blogExcerpt(b, 170),
      // Dates are IST calendar days sent as UTC instants - show them in IST for everyone.
      date: isNaN(d.getTime()) ? (b.blogDate ?? '') : formatDate(d, 'MMM d, y', 'en-US', '+0530'),
      category: b.category ?? '',
      author: b.authorName || 'CES',
      image: blogImageUrl(b),
    };
  }
}
