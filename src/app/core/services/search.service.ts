import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResourcesService } from './resources.service';
import {
  AnswerKeyEntry,
  BlogPost,
  MagazineIssue,
  NavratriEntry,
  Patent,
  PodcastEntry,
  SearchItem,
} from '../../shared/models/models';
import { ACADEMIC_INSTITUTES, CAMPUSES } from '../../shared/academic-institutes';

/** The society's own institute id — blogs and answer keys are stored per institute. */
const SOCIETY_ID = 1;

/**
 * Builds the "live" half of the universal search: it fetches the backend-driven
 * content once (lazily, browser-only) and turns each row into a {@link SearchItem}.
 * The header merges these with its static page index. Failures per feed are
 * swallowed so a single down endpoint never blanks the whole search.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly resources = inject(ResourcesService);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Live searchable entities. Seeded with the (static) academic institutes so they
   * are searchable instantly, then extended with the fetched feeds by {@link load}.
   */
  readonly dynamicIndex = signal<readonly SearchItem[]>([...ACADEMIC_INSTITUTES, ...CAMPUSES]);

  private loaded = false;

  /** Fetch and index every live feed once. Safe to call on every keystroke. */
  load(): void {
    if (this.loaded || !isPlatformBrowser(this.platformId)) return;
    this.loaded = true;

    const safe = <T>(source: Observable<T[]>): Observable<T[]> =>
      source.pipe(catchError(() => of<T[]>([])));

    forkJoin({
      navratri: safe(this.resources.getNavratriList()),
      blogs: safe(this.resources.getBlogs(SOCIETY_ID)),
      magazines: safe(this.resources.getMagazines()),
      podcasts: safe(this.resources.getPodcastList()),
      answerKeys: safe(this.resources.getAnswerKeys(SOCIETY_ID)),
      patents: safe(this.resources.getPatentData()),
    }).subscribe((feeds) => this.dynamicIndex.set([...ACADEMIC_INSTITUTES, ...CAMPUSES, ...this.build(feeds)]));
  }

  private build(feeds: {
    navratri: NavratriEntry[];
    blogs: BlogPost[];
    magazines: MagazineIssue[];
    podcasts: PodcastEntry[];
    answerKeys: AnswerKeyEntry[];
    patents: Patent[];
  }): SearchItem[] {
    const items: SearchItem[] = [];
    const arr = <T>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : []);
    const kw = (s: string): string => s.toLowerCase();

    for (const n of arr(feeds.navratri)) {
      items.push({
        title: `Navratri ${n.year}`,
        category: 'Navratri',
        link: `/navratri/${n.year}`,
        icon: 'calendar',
        keywords: kw(`navratri garba festival celebration ${n.year} ${strip(n.title)}`),
      });
    }

    for (const b of arr(feeds.blogs)) {
      if (!b.blogTitle) continue;
      items.push({
        title: b.blogTitle,
        category: 'Blog',
        link: `/blog/${b.id}`,
        icon: 'news',
        keywords: kw(`blog article post ${b.blogTitle} ${b.authorName ?? ''}`),
      });
    }

    for (const m of arr(feeds.magazines)) {
      if (!m.title) continue;
      items.push({
        title: m.title,
        category: 'Magazine',
        link: '/student-corner/magazine',
        icon: 'book',
        keywords: kw(`magazine balmitra balanitra publication ${m.title}`),
      });
    }

    for (const p of arr(feeds.podcasts).filter((p) => p.isactive && p.title)) {
      items.push({
        title: p.title,
        category: 'Podcast',
        link: '/podcast',
        icon: 'play',
        keywords: kw(`podcast next up video episode ${p.title}`),
      });
    }

    for (const k of arr(feeds.answerKeys)) {
      const title = strip(k.message);
      if (!title) continue;
      items.push({
        title,
        category: 'Answer Key',
        link: '/student-corner/answer-key',
        icon: 'key',
        keywords: kw(`answer key exam result paper std standard subject ${title}`),
      });
    }

    for (const p of arr(feeds.patents)) {
      if (!p.title) continue;
      items.push({
        title: p.title,
        category: 'IP Cell',
        link: '/ipcell',
        icon: 'file',
        keywords: kw(`patent ip intellectual property invention ${p.title} ${p.applicationnumber ?? ''}`),
      });
    }

    // De-dupe repeated titles that point to the same place.
    const seen = new Set<string>();
    return items.filter((it) => {
      const key = it.title + '|' + it.link;
      return seen.has(key) ? false : (seen.add(key), true);
    });
  }
}

/** Strip HTML/entities/whitespace so backend copy (often HTML) reads as a plain title. */
function strip(value: string): string {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}
