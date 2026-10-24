import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { PodcastEntry } from '../../../shared/models/models';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { SOCIAL_LINKS } from '../../../shared/social-links';

interface Episode {
  /** "01", "02" … */
  number: string;
  title: string;
  description: string;
  category: string;
  thumb: string;
  videoId: string;
  watchUrl: string;
}

const ALL = 'All Episodes';
/** The dashboard's categories, in tab order; any other category follows them. */
const CATEGORY_ORDER = ['Education', 'Achievements', 'Campus Life', 'Motivation'];

@Component({
  selector: 'app-podcast',
  imports: [PageHero],
  templateUrl: './podcast.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './podcast.scss',
})
export class Podcast {
  private readonly resources = inject(ResourcesService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly banner = '/assets/images/hero/nextup.jpeg';
  readonly youtube = SOCIAL_LINKS.find((l) => l.label === 'YouTube')?.href ?? 'https://www.youtube.com/@cesociety';

  /** `icon` is the path data of a 24×24 outline icon (Lucide shapes). */
  readonly pillars: ReadonlyArray<{ title: string; body: string; icon: readonly string[] }> = [
    {
      title: 'Inspiring Stories',
      body: 'Real journeys of success & struggle',
      icon: ['M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3'],
    },
    {
      title: 'Expert Talks',
      body: 'Conversations with visionaries & educators',
      icon: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
    },
    {
      title: 'Student Voices',
      body: 'Ideas, innovation & campus experiences',
      icon: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    },
    {
      title: 'Knowledge & Growth',
      body: 'Tips, motivation & thoughtful insights',
      icon: ['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', 'M9 18h6', 'M10 22h4'],
    },
  ];

  // Episodes come from the DB; the page shows only active ones.
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly episodes = signal<readonly Episode[]>([]);

  /** Filter: "All Episodes" plus whichever categories the episodes actually carry. */
  readonly category = signal(ALL);
  readonly categories = computed(() => {
    const rank = (c: string) => (CATEGORY_ORDER.indexOf(c) + CATEGORY_ORDER.length + 1) % (CATEGORY_ORDER.length + 1);
    const used = [...new Set(this.episodes().map((e) => e.category).filter(Boolean))];
    return [ALL, ...used.sort((a, b) => rank(a) - rank(b))];
  });
  readonly shown = computed(() =>
    this.category() === ALL ? this.episodes() : this.episodes().filter((e) => e.category === this.category()),
  );

  /** The video currently playing in the popup, or null when closed. */
  readonly activeVideo = signal<SafeResourceUrl | null>(null);

  constructor() {
    this.resources
      .getPodcastList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<PodcastEntry[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = (Array.isArray(list) ? list : [])
          .filter((p) => this.isActive(p.isactive))
          .map((p) => ({ ...p, id: this.videoId(p.link) }))
          .filter((p) => !!p.id);
        // The API lists the newest first; the episode number (its own field, else a "Next Up 02:"
        // title prefix, else the list position) puts the latest episode on top.
        const episodes = rows.map((p, i) => {
          const { no, title } = this.splitTitle(p.title);
          const n = Number(p.episodeNo) || no || rows.length - i;
          return {
            n,
            episode: {
              number: String(n).padStart(2, '0'),
              title,
              description: p.description?.trim() ?? '',
              category: p.category?.trim() ?? '',
              thumb: `https://img.youtube.com/vi/${p.id}/hqdefault.jpg`,
              videoId: p.id,
              watchUrl: `https://www.youtube.com/watch?v=${p.id}`,
            },
          };
        });
        this.episodes.set(episodes.sort((a, b) => b.n - a.n).map((e) => e.episode));
        this.loading.set(false);
      });
  }

  /** Open the popup with the selected episode (autoplays). */
  play(ep: Episode): void {
    this.activeVideo.set(
      this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ep.videoId}?autoplay=1`),
    );
  }

  close(): void {
    this.activeVideo.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  /** "Next Up 02: Interview with …" → episode 2, "Interview with …" (the number is shown above the title). */
  private splitTitle(raw: string): { no: number | null; title: string } {
    const m = /^next\s*up\s*0*(\d+)\s*[:\-–—]\s*/i.exec(raw ?? '');
    return m ? { no: Number(m[1]), title: raw.slice(m[0].length) } : { no: null, title: raw ?? '' };
  }

  /** Backends vary between boolean / 1 / "true" for the active flag. */
  private isActive(value: unknown): boolean {
    return value === true || value === 1 || String(value).toLowerCase() === 'true';
  }

  /** Extract the YouTube video id from the link shapes the dashboard accepts (watch, youtu.be, live, embed, shorts). */
  private videoId(link: string): string {
    const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i.exec(link ?? '');
    return m ? m[1] : '';
  }
}
