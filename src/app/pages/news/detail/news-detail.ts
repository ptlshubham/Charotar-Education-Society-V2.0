import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { InstituteService } from '../../../core/services/institute.service';
import { SeoService } from '../../../core/services/seo.service';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';
import { NewsItem, newsDate, toNewsItem } from '../../../shared/news-item';

/**
 * One news item, announcement or circular: /more/news/<id>. Published from Website Management →
 * News & Notices; client-rendered (app.routes.server.ts), since items are added after the build.
 */
@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, SafeHtmlPipe],
  templateUrl: './news-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDetail {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly id = toSignal(this.route.paramMap.pipe(map((pm) => Number(pm.get('id')))), { initialValue: NaN });

  readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  private readonly items = signal<readonly NewsItem[]>([]);

  readonly item = computed(() => this.items().find((i) => i.id === this.id()) ?? null);
  /** The newest other items, under this one. */
  readonly others = computed(() => this.items().filter((i) => i.id !== this.id()).slice(0, 3));

  readonly copied = signal(false);
  readonly date = newsDate;

  constructor() {
    this.institute
      .resolve()
      .pipe(
        switchMap((id) => this.resources.getNews(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (rows) => {
          this.items.set((Array.isArray(rows) ? rows : []).map(toNewsItem));
          this.state.set('ready');
        },
        error: () => this.state.set('error'),
      });

    effect(() => {
      const i = this.item();
      if (!i) return;
      this.seo.applyCustom({
        title: i.title,
        description: i.excerpt || `${i.typeLabel} from Charotar Education Society, ${newsDate(i.day)}.`,
        image: i.image,
        url: `/more/news/${i.id}`,
      });
    });
  }

  /** WhatsApp is how most parents and students pass a notice on. */
  whatsappLink(i: NewsItem): string {
    const url = this.browser ? location.href : '';
    return `https://wa.me/?text=${encodeURIComponent(`${i.title}\n${url}`)}`;
  }

  copyLink(): void {
    if (!this.browser) return;
    navigator.clipboard?.writeText(location.href).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
