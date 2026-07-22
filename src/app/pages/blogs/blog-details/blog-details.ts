import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResourcesService } from '../../../core/services/resources.service';
import { SeoService } from '../../../core/services/seo.service';
import { environment } from '../../../../environments/environment';
// Type-only: erased at build time, so PhotoSwipe never enters the SSR bundle.
import type PhotoSwipeLightbox from 'photoswipe/lightbox';

/** Used when an image's natural size isn't known yet (PhotoSwipe requires w/h). */
const FALLBACK_IMAGE_SIZE = { width: 1600, height: 1200 };

interface RelatedPost {
  id: string; // slug
  image: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

interface Attachment {
  url: string;
  /** Original filename, with the upload timestamp prefix stripped */
  name: string;
  /** Uppercase extension, e.g. "PDF" */
  ext: string;
  /** Human-readable type, e.g. "Excel Spreadsheet" */
  typeLabel: string;
  /** Upload date, decoded from the filename's epoch-ms prefix ('' if absent) */
  date: string;
  /** Tailwind classes for the file-type icon chip */
  iconClass: string;
  isImage: boolean;
}

const PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'];

/** Per-extension display label + icon colour. Falls back to a neutral chip. */
const FILE_TYPES: Record<string, { label: string; iconClass: string }> = {
  pdf: { label: 'PDF', iconClass: 'bg-red-50 text-red-600' },
  xls: { label: 'Excel Spreadsheet', iconClass: 'bg-emerald-50 text-emerald-600' },
  xlsx: { label: 'Excel Spreadsheet', iconClass: 'bg-emerald-50 text-emerald-600' },
  csv: { label: 'CSV Spreadsheet', iconClass: 'bg-emerald-50 text-emerald-600' },
  ppt: { label: 'PowerPoint Presentation', iconClass: 'bg-orange-50 text-orange-600' },
  pptx: { label: 'PowerPoint Presentation', iconClass: 'bg-orange-50 text-orange-600' },
  doc: { label: 'Word Document', iconClass: 'bg-blue-50 text-blue-600' },
  docx: { label: 'Word Document', iconClass: 'bg-blue-50 text-blue-600' },
  zip: { label: 'Archive', iconClass: 'bg-amber-50 text-amber-600' },
};

@Component({
  selector: 'app-blog-details',
  imports: [RouterLink, NgClass],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.scss',
})
export class BlogDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private resourcesService = inject(ResourcesService);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  // ─── Reactive state ───
  readonly loading = signal(true);
  readonly notFound = signal(false);

  readonly title = signal('');
  readonly category = signal('');
  readonly date = signal('');
  readonly readTime = signal('');
  readonly heroImage = signal(PLACEHOLDER_IMAGE);
  readonly content = signal<SafeHtml>('');
  readonly toc = signal<ReadonlyArray<{ id: string; label: string }>>([]);
  readonly relatedPosts = signal<RelatedPost[]>([]);
  readonly attachments = signal<Attachment[]>([]);

  /** Only images can be previewed; the list below shows every attachment. */
  readonly imageAttachments = computed(() =>
    this.attachments().filter((a) => a.isImage),
  );

  private lightbox?: PhotoSwipeLightbox;
  /** Natural dimensions per image URL, captured as each preview finishes loading. */
  private readonly imageSizes = new Map<string, { width: number; height: number }>();

  readonly downloadingAll = signal(false);

  /** Slug of the heading currently in view  highlights its "On this page" item. */
  readonly activeSection = signal('');

  ngOnInit(): void {
    // The load runs on the server too, so the post's meta tags are serialised
    // into the SSR HTML  social crawlers don't execute JS and would see none.
    // Reload whenever the slug changes (e.g. navigating between related posts,
    // which reuses this component instead of recreating it).
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('id');
      if (slug) this.loadBlog(slug);
    });
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
      this.closeLightbox();
    }
  }

  /** Download every attachment, one after another. */
  async downloadAll(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || this.downloadingAll()) return;
    this.downloadingAll.set(true);
    try {
      for (const file of this.attachments()) {
        await this.downloadFile(file);
      }
    } finally {
      this.downloadingAll.set(false);
    }
  }

  /**
   * Attachments live on the API origin, so a plain `download` link is ignored
   * cross-origin. Pull the file into a blob to force a real download with its
   * filename; if CORS blocks that, fall back to opening it.
   */
  private async downloadFile(file: Attachment): Promise<void> {
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      this.triggerDownload(objectUrl, file.name);
      // Revoking immediately can cancel an in-flight download in some browsers.
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    } catch {
      this.triggerDownload(file.url, file.name);
    }
  }

  private triggerDownload(href: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  /** Record each preview's real dimensions so PhotoSwipe can size its slides. */
  onPreviewLoad(url: string, event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth) {
      this.imageSizes.set(url, {
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }
  }

  /**
   * PhotoSwipe is loaded lazily and only in the browser  it touches `document`
   * on init, and this keeps it out of the initial bundle.
   */
  async openLightbox(index: number): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.closeLightbox();
    const { default: PhotoSwipeLightboxCtor } = await import('photoswipe/lightbox');

    const lightbox = new PhotoSwipeLightboxCtor({
      dataSource: this.imageAttachments().map((file) => ({
        src: file.url,
        alt: file.name,
        ...(this.imageSizes.get(file.url) ?? FALLBACK_IMAGE_SIZE),
      })),
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.9,
      padding: { top: 24, bottom: 24, left: 16, right: 16 },
    });

    lightbox.on('uiRegister', () => {
      lightbox.pswp?.ui?.registerElement({
        name: 'download',
        order: 8,
        isButton: true,
        tagName: 'a',
        title: 'Download',
        html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
        onInit: (el, pswp) => {
          const anchor = el as HTMLAnchorElement;
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noopener noreferrer');
          anchor.setAttribute('download', '');
          pswp.on('change', () => {
            anchor.href = String(pswp.currSlide?.data.src ?? '');
          });
        },
      });
    });

    lightbox.on('destroy', () => (this.lightbox = undefined));
    lightbox.init();
    lightbox.loadAndOpen(index);
    this.lightbox = lightbox;
  }

  closeLightbox(): void {
    this.lightbox?.destroy();
    this.lightbox = undefined;
  }

  /** Scroll-spy: the active section is the last heading scrolled past the header. */
  private onScroll = (): void => {
    const ids = this.toc().map((t) => t.id);
    if (!ids.length) return;
    const offset = 120; // sticky header + a little breathing room
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= offset) current = id;
    }
    if (current !== this.activeSection()) this.activeSection.set(current);
  };

  /** Smooth-scroll to a heading. Handled in JS (not a native #hash jump) so the
   *  router doesn't intercept the fragment; scroll-margin-top on the h2 offsets
   *  the sticky header. */
  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private loadBlog(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.resourcesService.getPublicBlogBySlug(slug).subscribe({
      next: (res: any) => {
        const b = res?.data;
        if (!b) {
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }
        this.title.set(b.title || '');
        this.category.set(b.category || '');
        this.date.set(this.formatDate(b.publishedAt || b.createdAt));
        this.readTime.set(b.readingTime || '');
        this.heroImage.set(this.resolveImage(b.thumbnail));
        this.attachments.set(this.mapAttachments(b.attachments));
        this.closeLightbox();

        const { html, toc } = this.buildContent(b.content || '');
        this.content.set(html);
        this.toc.set(toc);
        this.activeSection.set(toc[0]?.id ?? '');

        this.applySeo(b, slug);
        this.loadRelated(slug);
        this.loading.set(false);
        if (isPlatformBrowser(this.platformId)) window.scrollTo({ top: 0 });
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  /** Post's own meta wins; blank admin fields fall back to its title/excerpt. */
  private applySeo(blog: any, slug: string): void {
    this.seo.applyCustom({
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      keywords: blog.metaKeywords || blog.tags,
      image: blog.thumbnail ? this.resolveImage(blog.thumbnail) : null,
      url: `/blogs/${slug}`,
    });
  }

  private loadRelated(currentSlug: string): void {
    this.resourcesService.getPublicBlogs({ limit: 100 }).subscribe({
      next: (res: any) => {
        const blogs: any[] = res?.data?.data ?? [];
        const related = blogs
          .filter((b) => b.slug !== currentSlug)
          .slice(0, 3)
          .map((b) => ({
            id: b.slug,
            image: this.resolveImage(b.thumbnail),
            title: b.title,
            excerpt: b.excerpt || '',
            date: this.formatDate(b.publishedAt || b.createdAt),
            readTime: b.readingTime || '',
            category: b.category || '',
          }));
        this.relatedPosts.set(related);
      },
    });
  }

  /**
   * Content is first-party rich HTML from our own blog editor, so it's trusted.
   * Inject an id onto each <h2> and collect them into the "On this page" TOC.
   */
  private buildContent(rawHtml: string): {
    html: SafeHtml;
    toc: { id: string; label: string }[];
  } {
    const toc: { id: string; label: string }[] = [];
    let index = 0;
    const withIds = rawHtml.replace(
      /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
      (_match, attrs, inner) => {
        const label = inner
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim();
        if (!label) return `<h2${attrs}>${inner}</h2>`;
        const id = `section-${++index}`;
        toc.push({ id, label });
        return `<h2 id="${id}"${attrs}>${inner}</h2>`;
      },
    );
    return { html: this.sanitizer.bypassSecurityTrustHtml(withIds), toc };
  }

  /**
   * Attachments arrive as an array of host-relative paths, e.g.
   * "/blog/attachments/1783593322124-Report.pdf". Strip the upload timestamp
   * prefix for display and classify by extension.
   */
  private mapAttachments(list: unknown): Attachment[] {
    if (!Array.isArray(list)) return [];
    return list
      .filter((path): path is string => typeof path === 'string' && !!path)
      .map((path) => {
        const basename = path.split('/').pop() ?? path;

        // Uploads are stored as "<epochMs>-<originalName>". Recover both.
        const prefixed = basename.match(/^(\d{13,})-(.+)$/);
        const name = prefixed ? prefixed[2] : basename;
        const uploadedAt = prefixed ? Number(prefixed[1]) : NaN;

        const ext = (name.includes('.') ? name.split('.').pop()! : '').toLowerCase();
        const isImage = IMAGE_EXTENSIONS.includes(ext);
        const type = FILE_TYPES[ext] ?? {
          label: isImage ? 'Image' : ext.toUpperCase() || 'File',
          iconClass: isImage
            ? 'bg-main/10 text-main'
            : 'bg-[#f8f9fa] text-secondary',
        };

        return {
          url: this.resolveUrl(path),
          name,
          ext: ext.toUpperCase(),
          typeLabel: type.label,
          date: Number.isFinite(uploadedAt)
            ? this.formatDate(new Date(uploadedAt).toISOString())
            : '',
          iconClass: type.iconClass,
          isImage,
        };
      });
  }

  /**
   * Uploaded assets are served by the API host, not the website origin  so
   * prefix host-relative paths. Absolute URLs are passed through unchanged.
   */
  private resolveUrl(path: string): string {
    return /^https?:\/\//.test(path) ? path : environment.apiUrl + path;
  }

  private resolveImage(thumbnail: string): string {
    if (!thumbnail) return PLACEHOLDER_IMAGE;
    return this.resolveUrl(thumbnail);
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
}
