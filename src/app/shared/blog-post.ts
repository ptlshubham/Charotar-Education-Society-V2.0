import { BlogPost } from './models/models';
import { MediaUrlPipe } from './media-url.pipe';
import { environment } from '../../environments/environment';

const mediaUrl = new MediaUrlPipe();

/** The tag on every post brought over from the 2015 centenary blog (backend migration 0054). */
export const BLOG_ARCHIVE_TAG = 'CES100Anand';

/** src/href of a file the API stores (images, PDFs, uploads), written as a path without a host. */
const STORED_FILE = /(\s(?:src|href)=")\/((?:images|pdf|uploads|video)\/)/g;
/** The editor's media embed: <figure class="media"><oembed url="…"></oembed></figure>. */
const OEMBED = /<oembed url="([^"]*)"><\/oembed>/g;
const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;

/**
 * A post's body ready for [innerHTML]: stored files point at the API (so a post works against any
 * API host), images load lazily, and the editor's YouTube embeds become players - any other
 * embedded URL becomes a link.
 */
export function blogBody(html: string | null | undefined): string {
  const api = environment.apiUrl.replace(/\/+$/, '');
  return (html ?? '')
    .replace(STORED_FILE, `$1${api}/$2`)
    .replace(/<img(?![^>]*\sloading=)/g, '<img loading="lazy"')
    .replace(OEMBED, (_, url: string) => {
      const id = YOUTUBE_ID.exec(url.replace(/&amp;/g, '&'))?.[1];
      return id
        ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" ` +
            'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
            'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
        : `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
    });
}

/** Card / thumbnail cover for a post published without an image: a brand-navy picture placeholder. */
const BLOG_PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.svg';

/** The blog's page-hero photo - the /blog banner, and a post's hero when it has no cover image. */
export const BLOG_BANNER = '/assets/images/hero/blog.jpeg';

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

/** A post date as YYYY-MM-DD in India time - the API sends DATE columns as instants (e.g. 18:30Z the day before). */
export function blogDay(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

/** 'gu' when a post is written mainly in Gujarati, else 'en' - for its lang attribute and JSON-LD. */
export function blogLanguage(b: Pick<BlogPost, 'blogTitle' | 'blogDetails'>): 'gu' | 'en' {
  const text = `${b.blogTitle ?? ''} ${plainText(b.blogDetails)}`;
  const gujarati = text.match(/[઀-૿]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-z]/g)?.length ?? 0;
  return gujarati > latin ? 'gu' : 'en';
}

export function blogTags(b: BlogPost): string[] {
  return (b.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean);
}

/** Every tag in use and how many posts carry it, A-Z - the blog's Labels box. Case-insensitive. */
export function countTags(tagLists: Iterable<readonly string[]>): { label: string; count: number }[] {
  const byKey = new Map<string, { label: string; count: number }>();
  for (const tags of tagLists) {
    for (const tag of new Set(tags)) {
      const entry = byKey.get(tag.toLowerCase());
      if (entry) entry.count++;
      else byKey.set(tag.toLowerCase(), { label: tag, count: 1 });
    }
  }
  return [...byKey.values()].sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));
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
