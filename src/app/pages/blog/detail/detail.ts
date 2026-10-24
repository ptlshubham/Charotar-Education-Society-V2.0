import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { SeoService } from '../../../core/services/seo.service';
import { BlogPost } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { Academics } from '../../home/academics/academics';
import { blogExcerpt, blogImageUrl, blogSlug, blogTags, plainText, sortCategories } from '../../../shared/blog-post';

/** Average adult reading speed, for the "N min read" estimate. */
const WORDS_PER_MINUTE = 200;

interface Brief {
  id: string;
  title: string;
  date: string;
  image: string;
  imageAlt: string;
}

@Component({
  selector: 'app-blog-detail',
  imports: [FormsModule, RouterLink, MediaUrlPipe, SafeHtmlPipe, PageHero, Academics, AdmissionsCta],
  templateUrl: './detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detail.scss',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly blogs = signal<readonly BlogPost[]>([]);
  /** The :slug route param - a post's slug, or its id in links made before slugs existed. */
  private readonly currentId = signal(this.route.snapshot.paramMap.get('slug') ?? '');

  search = '';

  readonly shares: ReadonlyArray<{ label: string; tone: string }> = [
    { label: 'Facebook', tone: 'bg-[#1877F2]' },
    { label: 'Twitter', tone: 'bg-[#1DA1F2]' },
    { label: 'LinkedIn', tone: 'bg-[#0A66C2]' },
    { label: 'WhatsApp', tone: 'bg-[#25D366]' },
  ];

  constructor() {
    // React to prev/next navigation (component is reused across :slug changes).
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((pm) => this.currentId.set(pm.get('slug') ?? ''));

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
        this.blogs.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      });

    // An old /blog/<id> link moves to the post's slug URL in place, so every share and bookmark
    // converges on one address; then the post's own meta tags are applied.
    effect(() => {
      const p = this.post();
      if (!p) return;
      const slug = blogSlug(p);
      if (this.currentId() !== slug) {
        this.router.navigate(['/blog', slug], { replaceUrl: true });
        return;
      }
      this.seo.applyCustom({
        title: p.metaTitle || p.blogTitle,
        description: p.metaDescription || blogExcerpt(p),
        keywords: p.metaKeywords || p.tags,
        image: p.blogImage ? blogImageUrl(p) : null,
        url: `/blog/${slug}`,
      });
    });
  }

  private readonly index = computed(() => {
    const key = this.currentId();
    const list = this.blogs();
    const bySlug = list.findIndex((b) => b.slug === key);
    return bySlug >= 0 ? bySlug : list.findIndex((b) => String(b.id) === key);
  });

  readonly post = computed<BlogPost | null>(() => this.blogs()[this.index()] ?? null);

  readonly date = computed(() => this.fmt(this.post()?.blogDate ?? ''));

  readonly author = computed(() => this.post()?.authorName?.trim() || 'CES');
  readonly authorInitial = computed(() => Array.from(this.author())[0]?.toUpperCase() ?? 'C');

  readonly readingTime = computed(() => {
    const words = plainText(this.post()?.blogDetails).split(' ').filter(Boolean).length;
    return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
  });

  /** Shown only when the post was edited on a later day than its blog date. */
  readonly updated = computed(() => {
    const p = this.post();
    const edited = p?.updateddate ? new Date(p.updateddate) : null;
    const published = p ? new Date(p.blogDate) : null;
    if (!edited || !published || isNaN(edited.getTime()) || isNaN(published.getTime())) return '';
    return edited.getTime() - published.getTime() >= 24 * 60 * 60 * 1000 ? this.fmt(p!.updateddate!) : '';
  });

  readonly cover = computed(() => {
    const p = this.post();
    return p ? blogImageUrl(p) : '';
  });

  readonly tags = computed(() => {
    const p = this.post();
    return p ? blogTags(p) : [];
  });

  readonly attachments = computed(() => this.post()?.attachments ?? []);

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

  /** Categories with a published post, and how many. */
  readonly categories = computed(() => {
    const counts = new Map<string, number>();
    for (const b of this.blogs()) {
      if (b.category) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    }
    return sortCategories(counts.keys()).map((label) => ({ label, count: counts.get(label) ?? 0 }));
  });

  /** True once the feed has loaded but the requested post wasn't found. */
  readonly notFound = computed(() => !this.loading() && !this.failed() && !this.post());

  fileSize(bytes: number): string {
    if (!bytes) return '';
    return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  /** Material Symbols icon for an attachment, by extension. */
  fileIcon(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'pdf') return 'picture_as_pdf';
    if (ext === 'zip') return 'folder_zip';
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'table_chart';
    if (ext === 'ppt' || ext === 'pptx') return 'slideshow';
    return 'description';
  }

  private brief(b: BlogPost): Brief {
    return {
      id: blogSlug(b),
      title: b.blogTitle ?? '',
      date: this.fmt(b.blogDate),
      image: blogImageUrl(b),
      imageAlt: b.imageAlt || b.blogTitle || '',
    };
  }

  private fmt(value: string): string {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }
}
