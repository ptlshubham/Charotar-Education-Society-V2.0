import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { BlogPost } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';

/** The society's own institute id (id 1 in the CES DB); blogs are stored per institute. */
const BLOG_INSTITUTE_ID = 1;

interface Brief {
  id: string;
  title: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-blog-detail',
  imports: [FormsModule, RouterLink, MediaUrlPipe, SafeHtmlPipe],
  templateUrl: './detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detail.scss',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly resources = inject(ResourcesService);

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly blogs = signal<readonly BlogPost[]>([]);
  private readonly currentId = signal(this.route.snapshot.paramMap.get('slug') ?? '');

  search = '';

  readonly categories: ReadonlyArray<{ label: string; count: number }> = [
    { label: 'News', count: 24 },
    { label: 'Events', count: 18 },
    { label: 'Achievements', count: 16 },
    { label: 'Academics', count: 22 },
    { label: 'Student Corner', count: 15 },
    { label: 'Research & Innovation', count: 12 },
    { label: 'Campus Life', count: 10 },
  ];

  readonly shares: ReadonlyArray<{ label: string; tone: string }> = [
    { label: 'Facebook', tone: 'bg-[#1877F2]' },
    { label: 'Twitter', tone: 'bg-[#1DA1F2]' },
    { label: 'LinkedIn', tone: 'bg-[#0A66C2]' },
    { label: 'WhatsApp', tone: 'bg-[#25D366]' },
  ];

  constructor() {
    // React to prev/next navigation (component is reused across :slug changes).
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((pm) => this.currentId.set(pm.get('slug') ?? ''));

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
        this.blogs.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      });
  }

  private readonly index = computed(() => this.blogs().findIndex((b) => String(b.id) === this.currentId()));

  readonly post = computed<BlogPost | null>(() => this.blogs()[this.index()] ?? null);

  readonly date = computed(() => this.fmt(this.post()?.blogDate ?? ''));

  readonly prev = computed<Brief | null>(() => {
    const i = this.index();
    return i > 0 ? this.brief(this.blogs()[i - 1]) : null;
  });

  readonly next = computed<Brief | null>(() => {
    const i = this.index();
    const b = this.blogs();
    return i >= 0 && i < b.length - 1 ? this.brief(b[i + 1]) : null;
  });

  readonly recent = computed<readonly Brief[]>(() => this.blogs().slice(0, 5).map((b) => this.brief(b)));

  /** True once the feed has loaded but the requested id wasn't found. */
  readonly notFound = computed(() => !this.loading() && !this.failed() && !this.post());

  private brief(b: BlogPost): Brief {
    return { id: String(b.id), title: b.blogTitle ?? '', date: this.fmt(b.blogDate), image: b.blogImage ?? '' };
  }

  private fmt(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }
}
