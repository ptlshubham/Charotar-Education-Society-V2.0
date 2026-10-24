/**
 * A project or social activity with a page of its own (/project/:slug, /social-activity/:slug).
 * The data lives in shared/projects.ts and shared/social-activities.ts; the page and its cards
 * are shared/programme-page and shared/programme-card.
 */
/** What a card shows. */
export interface ProgrammeSummary {
  /** The last part of its page's address. */
  slug: string;
  title: string;
  /** The card's short description, and the page's meta description. */
  desc: string;
  image: string;
  /** Artwork on a transparent background (shown whole on a light panel, not cropped). */
  contain?: boolean;
  /** Where the card goes when the page lives elsewhere on the site (Chatkaro: /chatkaro). */
  link?: string;
}

export interface Programme extends ProgrammeSummary {
  /** The page banner's photo, when `image` does not suit a wide banner. */
  heroImage?: string;
  /** The line under the title in the page banner. */
  tagline: string;
  heading: string;
  about: readonly string[];
  /** The list under the story: what it offers, the courses running now, and so on. */
  listHeading: string;
  list: readonly string[];
  /** Published figures only. */
  facts?: ReadonlyArray<{ value: string; label: string }>;
  /** Other pages on the site worth reading next. */
  related?: ReadonlyArray<{ label: string; link: string }>;
  audience: string;
  where: string;
  phone: string;
  website?: string;
  /** The page's main button; without one it asks the Society, on /contact. */
  action?: { label: string; link: string; external?: boolean };
}

/** How one collection of programmes is named on its pages. */
export interface ProgrammeKind {
  /** "project", "activity": in "About the project", "More activities" and so on. */
  noun: string;
  plural: string;
  /** The listing page, for the breadcrumb and "See all". */
  list: { label: string; link: string };
  /** What each card's link says. */
  cta: string;
  /** The At a Glance label for the item's group, e.g. "Focus area". */
  groupTerm: string;
}

/** Up to `count` others to read next: the same group first, then the rest in list order after `item`. */
export function relatedTo<T extends ProgrammeSummary>(items: readonly T[], item: T, group: (x: T) => string, count = 3): T[] {
  const i = items.indexOf(item);
  const rest = [...items.slice(i + 1), ...items.slice(0, i)];
  const same = group(item);
  return [...rest.filter((x) => group(x) === same), ...rest.filter((x) => group(x) !== same)].slice(0, count);
}
