import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { BlogPost } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/** The society's own institute id (id 1 in the CES DB); blogs are stored per institute. */
const BLOG_INSTITUTE_ID = 1;

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  day: string;
  month: string;
  year: string;
  image: string;
  author: string;
}

@Component({
  selector: 'app-blog-list',
  imports: [FormsModule, RouterLink, MediaUrlPipe],
  templateUrl: './list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './list.scss',
})
export class BlogList {
  private readonly resources = inject(ResourcesService);

  readonly banner = PLACEHOLDER.blog.banner;

  // Category tabs are kept for when the admin adds categorisation; the live feed
  // has no category, so selecting a tab only highlights it (search still filters).
  readonly tabs: readonly string[] = [
    'All Posts', 'News', 'Events', 'Achievements', 'Student Corner', 'Research & Innovation',
  ];
  readonly tab = signal('All Posts');
  search = '';
  private readonly query = signal('');

  select(t: string): void {
    this.tab.set(t);
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
  }

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly allPosts = signal<readonly Post[]>([]);

  constructor() {
    this.resources
      .getBlogs(BLOG_INSTITUTE_ID)
      .pipe(
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

  /** Most recent post drives the featured card; the rest fill the grid. */
  readonly featured = computed(() => this.allPosts()[0] ?? null);
  private readonly rest = computed(() => this.allPosts().slice(1));

  readonly visible = computed(() => {
    const q = this.query();
    return q
      ? this.rest().filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q))
      : this.rest();
  });

  readonly recent = computed(() => this.allPosts().slice(0, 5));

  readonly categories: ReadonlyArray<{ label: string; count: number; path: string[] }> = [
    { label: 'News', count: 24, path: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'] },
    { label: 'Events', count: 18, path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { label: 'Achievements', count: 16, path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { label: 'Academics', count: 22, path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { label: 'Student Corner', count: 15, path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
    { label: 'Research & Innovation', count: 12, path: ['M9 2v6L4.5 17A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.3-4L15 8V2', 'M8 2h8'] },
    { label: 'Campus Life', count: 10, path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
  ];

  email = '';

  subscribe(): void {
    this.email = '';
  }

  private toPost(b: BlogPost): Post {
    const d = new Date(b.blogDate);
    const valid = !isNaN(d.getTime());
    return {
      id: String(b.id),
      title: b.blogTitle ?? '',
      excerpt: this.strip(b.blogDetails).slice(0, 160),
      date: valid ? formatDate(d, 'mediumDate', 'en-US') : (b.blogDate ?? ''),
      day: valid ? formatDate(d, 'dd', 'en-US') : '',
      month: valid ? formatDate(d, 'MMM', 'en-US').toUpperCase() : '',
      year: valid ? formatDate(d, 'yyyy', 'en-US') : '',
      image: b.blogImage ?? '',
      author: b.authorName || 'CES Admin',
    };
  }

  /** Strip HTML tags for the card excerpt. */
  private strip(html: string): string {
    return (html ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
