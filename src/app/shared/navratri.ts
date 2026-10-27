/** Helpers shared by the /navratri page and the year pages (/navratri/<year>). */

/** The Navratri pages' banner until one is uploaded in the dashboard (Navratri page card). */
export const NAVRATRI_BANNER = '/assets/images/hero/navratri.webp';

/** Where Navratri is held when a year has no venue of its own. */
export const NAVRATRI_VENUE = 'CES Campus, Anand';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "3rd" - the hero has always shown dates this way ("22nd Sep – 2nd Oct, 2026"). */
function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`;
  return `${day}${['th', 'st', 'nd', 'rd'][day % 10] ?? 'th'}`;
}

/**
 * A festival's dates from YYYY-MM-DD strings - "22nd Sep – 2nd Oct, 2026"; one day alone when there is
 * no end; '' when there is no start. Read as plain calendar days, so no time zone can shift them.
 */
export function navratriDates(start: string | null | undefined, end: string | null | undefined): string {
  const parse = (d: string | null | undefined) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d ?? '');
    return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
  };
  const a = parse(start);
  if (!a) return '';
  const b = parse(end);
  const day = (x: { m: number; d: number }) => `${ordinal(x.d)} ${MONTHS[x.m]}`;
  if (!b || (b.y === a.y && b.m === a.m && b.d === a.d)) return `${day(a)}, ${a.y}`;
  return a.y === b.y ? `${day(a)} – ${day(b)}, ${b.y}` : `${day(a)}, ${a.y} – ${day(b)}, ${b.y}`;
}

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i;

/** The video id in a YouTube link of any usual shape, or ''. */
export function youtubeId(link: string | null | undefined): string {
  return YOUTUBE_ID.exec(link ?? '')?.[1] ?? '';
}
