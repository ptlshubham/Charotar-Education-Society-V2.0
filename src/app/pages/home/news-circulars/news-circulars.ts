import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, timeout } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { NewsEntry } from '../../../shared/models/models';
import { NewsItem, newsDate, toNewsItem } from '../../../shared/news-item';

/**
 * "News / Circular" on the home page: the three newest live items from Website Management → News &
 * Notices - one large, two beside it - each linking to its page under /more/news. An item with a
 * picture shows it; one without is set as text (the featured one on a cream card with a gold rule).
 *
 * Loaded in the browser after the first render, like the blog section below it, and absent until
 * something is live - the home page never shows an empty block.
 */
@Component({
  selector: 'app-news-circulars',
  imports: [RouterLink],
  templateUrl: './news-circulars.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsCirculars {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly items = signal<readonly NewsItem[]>([]);
  readonly featured = computed(() => this.items()[0] ?? null);
  readonly others = computed(() => this.items().slice(1, 3));

  readonly date = newsDate;

  constructor() {
    afterNextRender(() =>
      this.institute
        .resolve()
        .pipe(
          switchMap((id) => this.resources.getNews(id)),
          timeout(8000),
          catchError(() => of<NewsEntry[]>([])),
          takeUntilDestroyed(this.destroyRef),
        )
        // The API sends them newest first.
        .subscribe((rows) => this.items.set((Array.isArray(rows) ? rows : []).slice(0, 3).map(toNewsItem))),
    );
  }
}
