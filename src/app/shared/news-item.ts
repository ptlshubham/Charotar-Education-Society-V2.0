import { NewsEntry } from './models/models';
import { MediaUrlPipe } from './media-url.pipe';
import { blogBody, plainText } from './blog-post';

const mediaUrl = new MediaUrlPipe();

export type NewsType = 'news' | 'announcement' | 'circular';

/** The kinds of item, in tab order - the dashboard's News & Notices types. */
export const NEWS_TYPES: ReadonlyArray<{ key: NewsType; label: string; plural: string }> = [
  { key: 'news', label: 'News', plural: 'News' },
  { key: 'announcement', label: 'Announcement', plural: 'Announcements' },
  { key: 'circular', label: 'Circular', plural: 'Circulars' },
];

/** Icon paths per type (24×24, stroked) - the News page's category rail, and the tile shown for an item without a picture. */
export const NEWS_TYPE_ICONS: Record<NewsType, string[]> = {
  news: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'],
  announcement: ['M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z', 'M16 9a4 4 0 0 1 0 6'],
  circular: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8M8 17h5'],
};

/** The tile behind an item without a cover picture. */
export function newsTileClass(type: NewsType): string {
  switch (type) {
    case 'announcement':
      return 'bg-[#FFF4DE] text-[#B7791F]';
    case 'circular':
      return 'bg-[#FDECEC] text-accent';
    default:
      return 'bg-[#EEF3FB] text-primary';
  }
}

/** A news entry as the News page and its item pages show it. */
export interface NewsItem {
  id: number;
  type: NewsType;
  typeLabel: string;
  title: string;
  /** The body as HTML, without the headline when it was the text's first line; '' when none. */
  html: string;
  /** Plain-text start of the body, for cards and meta descriptions. */
  excerpt: string;
  /** The attached file (full URL) and its kind, or null. */
  file: string | null;
  fileKind: 'PDF' | 'Word' | 'Excel' | 'PowerPoint' | null;
  /** The picture (full URL) - a poster or photo, sometimes the whole post - or null. */
  image: string | null;
  /** YYYY-MM-DD */
  day: string;
}

/** The first block of an HTML text (<p>, <h1-6>, <div>) and its plain text. */
const FIRST_BLOCK = /^\s*<(p|h[1-6]|div)\b[^>]*>([\s\S]*?)<\/\1>/i;

export function toNewsItem(e: NewsEntry): NewsItem {
  const type: NewsType = e.type && NEWS_TYPES.some((t) => t.key === e.type) ? e.type : 'news';
  let html = e.message ?? '';
  let title = e.title?.trim() ?? '';
  if (!title) {
    // An item from before titles existed: its first line is the headline - shown as the title,
    // and left out of the body so it isn't printed twice.
    const first = html.match(FIRST_BLOCK);
    title = first ? plainText(first[2]) : '';
    if (title) html = html.slice(first![0].length);
  }
  const text = plainText(html);
  const typeLabel = NEWS_TYPES.find((t) => t.key === type)!.label;
  // Every part is optional in the dashboard: a post can be only a picture or only a file.
  if (!title) title = text.slice(0, 120) || `${typeLabel} of ${newsDate(e.day)}`;
  return {
    id: e.id,
    type,
    typeLabel,
    title,
    html: text ? blogBody(html) : '',
    excerpt: text.length > 220 ? text.slice(0, 220).replace(/\s+\S*$/, '') + '…' : text,
    file: e.files ? mediaUrl.transform(e.files) : null,
    fileKind: e.files ? fileKind(e.files) : null,
    image: e.image ? mediaUrl.transform(e.image) : null,
    day: e.day,
  };
}

function fileKind(path: string): NewsItem['fileKind'] {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return ext.startsWith('doc') ? 'Word' : ext.startsWith('xls') ? 'Excel' : ext.startsWith('ppt') ? 'PowerPoint' : 'PDF';
}

/** "27 Oct 2026" from YYYY-MM-DD, in India's calendar whatever the visitor's time zone. */
export function newsDate(day: string): string {
  const d = new Date(`${day}T00:00:00+05:30`);
  return isNaN(d.getTime()) ? day : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}
