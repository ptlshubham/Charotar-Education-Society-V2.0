import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PLACEHOLDER } from '../../shared/placeholder-images';

interface Item {
  tag: 'Announcement' | 'Achievement' | 'Event' | 'Academic' | 'Press Release';
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-news',
  imports: [FormsModule],
  templateUrl: './news.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './news.scss',
})
export class News {
  readonly banner = PLACEHOLDER.about.hero;

  /** TODO: replace with the news feed. */
  private readonly all: readonly Item[] = [
    { tag: 'Announcement', date: '22 May 2026', title: 'CES Annual General Meeting 2026 Held Successfully', excerpt: 'The Annual General Meeting of Charotar Education Society was held with great enthusiasm and participation.', image: PLACEHOLDER.newsItems[0] },
    { tag: 'Achievement', date: '18 May 2026', title: 'CES Students Excel in University Examinations', excerpt: 'Students of our institutes have secured top ranks in various university examinations. Heartiest congratulations to all!', image: PLACEHOLDER.newsItems[1] },
    { tag: 'Event', date: '12 May 2026', title: 'Workshop on Mental Well-being Conducted', excerpt: 'A successful workshop on mental well-being was organized to promote positive mental health among students.', image: PLACEHOLDER.newsItems[2] },
    { tag: 'Event', date: '05 May 2026', title: 'Inter-Institute Sports Competition 2026', excerpt: 'The annual inter-institute sports competition witnessed enthusiastic participation from students across all our institutes.', image: PLACEHOLDER.newsItems[3] },
    { tag: 'Announcement', date: '28 Apr 2026', title: 'New Academic Session 2026–27 Admissions Open', excerpt: 'Admissions are now open for various programs for the academic session 2026–27. Apply now and shape your future with CES.', image: PLACEHOLDER.newsItems[4] },
    { tag: 'Achievement', date: '20 Apr 2026', title: 'CES Faculty Members Honored for Excellence', excerpt: 'Our dedicated faculty members were recognized for their outstanding contribution in education and research.', image: PLACEHOLDER.newsItems[5] },
  ];

  readonly categories: ReadonlyArray<{ label: string; path: string[] }> = [
    { label: 'All News', path: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'] },
    { label: 'Announcements', path: ['M3 11v3a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z', 'M16 9a4 4 0 0 1 0 6'] },
    { label: 'Achievements', path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { label: 'Events', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { label: 'Academic', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { label: 'Press Release', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'] },
  ];

  readonly category = signal('All News');
  readonly view = signal<'grid' | 'list'>('grid');
  search = '';
  sort: 'latest' | 'oldest' = 'latest';
  email = '';

  private readonly query = signal('');

  /** Singular tag -> plural category label used by the rail. */
  private static readonly TAG_TO_CATEGORY: Record<string, string> = {
    Announcement: 'Announcements',
    Achievement: 'Achievements',
    Event: 'Events',
    Academic: 'Academic',
    'Press Release': 'Press Release',
  };

  count(label: string): number {
    if (label === 'All News') return this.all.length;
    return this.all.filter((i) => News.TAG_TO_CATEGORY[i.tag] === label).length;
  }

  select(label: string): void {
    this.category.set(label);
  }

  setView(v: 'grid' | 'list'): void {
    this.view.set(v);
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
  }

  subscribe(): void {
    this.email = '';
  }

  readonly visible = computed(() => {
    const c = this.category();
    const q = this.query();
    return this.all.filter(
      (i) =>
        (c === 'All News' || News.TAG_TO_CATEGORY[i.tag] === c) &&
        (!q || i.title.toLowerCase().includes(q) || i.excerpt.toLowerCase().includes(q)),
    );
  });

  tagClass(tag: Item['tag']): string {
    switch (tag) {
      case 'Achievement':
        return 'bg-secondary text-primary';
      case 'Event':
        return 'bg-accent text-white';
      default:
        return 'bg-primary text-white';
    }
  }
}
