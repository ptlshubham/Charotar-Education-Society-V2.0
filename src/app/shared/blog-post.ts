import { BlogPost } from './models/models';
import { MediaUrlPipe } from './media-url.pipe';

const mediaUrl = new MediaUrlPipe();

/** Shown for a post published without a cover image. */
const BLOG_PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

/** Full cover image URL - bind it directly, not through the mediaUrl pipe (the placeholder is a site asset). */
export function blogImageUrl(b: Pick<BlogPost, 'blogImage'>): string {
  return b.blogImage ? mediaUrl.transform(b.blogImage) : BLOG_PLACEHOLDER_IMAGE;
}

/** URL segment for a post: its slug, or the id for posts saved before slugs existed. */
export function blogSlug(b: Pick<BlogPost, 'id' | 'slug'>): string {
  return b.slug || String(b.id);
}

/** Card / meta summary: the admin's excerpt, else the start of the body as plain text. */
export function blogExcerpt(b: BlogPost, max = 160): string {
  return (b.excerpt?.trim() || plainText(b.blogDetails)).slice(0, max);
}

export function blogTags(b: BlogPost): string[] {
  return (b.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);
}

/**
 * Distinct category names, A-Z. Each institute adds its own categories in the dashboard, so
 * the site shows whichever ones its published posts use - there is no fixed list.
 */
export function sortCategories(names: Iterable<string>): string[] {
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

const NAMED_ENTITIES: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** HTML to plain text. Regex-based rather than DOMParser so it also runs during prerender. */
export function plainText(html: string | null | undefined): string {
  return (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
      if (e[0] !== '#') return NAMED_ENTITIES[e.toLowerCase()] ?? m;
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    })
    .replace(/\s+/g, ' ')
    .trim();
}
