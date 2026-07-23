import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Category =
  | 'All' | 'Events' | 'Campus Life' | 'Academic' | 'Cultural' | 'Sports' | 'Historical' | 'Celebrations';

interface Photo {
  src: string;
  category: Exclude<Category, 'All'>;
  caption: string;
}

@Component({
  selector: 'app-gallery',
  imports: [FormsModule, RouterLink],
  templateUrl: './gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gallery.scss',
})
export class Gallery {
  readonly banner = PLACEHOLDER.media.galleryBanner;

  readonly stats: ReadonlyArray<{ value: string; label: string; tone: string; path: string[] }> = [
    { value: '1,248+', label: 'Photos', tone: 'bg-primary/10 text-primary', path: ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'm21 15-5-5L5 21'] },
    { value: '156+', label: 'Videos', tone: 'bg-logo/10 text-logo', path: ['m23 7-7 5 7 5z', 'M1 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z'] },
    { value: '32+', label: 'Albums', tone: 'bg-primary/10 text-primary', path: ['M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'] },
  ];

  readonly tab = signal<'photos' | 'videos'>('photos');
  readonly category = signal<Category>('All');
  search = '';
  sort: 'latest' | 'oldest' = 'latest';
  private readonly query = signal('');

  readonly categories: readonly Category[] = [
    'All', 'Events', 'Campus Life', 'Academic', 'Cultural', 'Sports', 'Historical', 'Celebrations',
  ];

  selectTab(t: 'photos' | 'videos'): void {
    this.tab.set(t);
  }

  selectCategory(c: Category): void {
    this.category.set(c);
    this.page.set(1);
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.page.set(1);
  }

  /** TODO: replace with the media library feed. */
  readonly photos: readonly Photo[] = PLACEHOLDER.media.photos.map((src, i) => {
    const cats: Array<Exclude<Category, 'All'>> = [
      'Events', 'Academic', 'Celebrations', 'Historical', 'Campus Life', 'Historical',
      'Cultural', 'Historical', 'Campus Life', 'Historical', 'Events', 'Cultural',
    ];
    return { src, category: cats[i], caption: `${cats[i]} photograph ${i + 1}` };
  });

  readonly filtered = computed(() => {
    const c = this.category();
    const q = this.query();
    return this.photos.filter(
      (p) => (c === 'All' || p.category === c) && (!q || p.caption.toLowerCase().includes(q)),
    );
  });

  // ─── Pagination ───
  readonly pageSize = 12;
  readonly page = signal(1);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly paged = computed(() =>
    this.filtered().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize),
  );
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1).slice(0, 5),
  );

  go(delta: number): void {
    this.page.update((p) => Math.min(this.totalPages(), Math.max(1, p + delta)));
  }

  toPage(n: number): void {
    this.page.set(n);
  }
}
