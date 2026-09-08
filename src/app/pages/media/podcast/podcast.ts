import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { PodcastEntry } from '../../../shared/models/models';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { PageHero } from '../../../shared/page-hero/page-hero';

interface Episode {
  number: string;
  title: string;
  thumb: string;
  videoId: string;
}

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

  readonly banner = PLACEHOLDER.media.podcastBanner;

  readonly pillars: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Inspiring Stories', body: 'Real journeys of success & struggle', icon: 'headphones' },
    { title: 'Expert Talks', body: 'Conversations with visionaries & educators', icon: 'mic' },
    { title: 'Student Voices', body: 'Ideas, innovation & campus experiences', icon: 'group' },
    { title: 'Knowledge & Growth', body: 'Tips, motivation & thoughtful insights', icon: 'lightbulb' },
  ];

  readonly categories: ReadonlyArray<{ label: string; count: string; icon: string; active?: boolean }> = [
    { label: 'All Episodes', count: '12 Episodes', active: true, icon: 'mic' },
    { label: 'Education', count: '4 Episodes', icon: 'school' },
    { label: 'Achievements', count: '3 Episodes', icon: 'workspace_premium' },
    { label: 'Campus Life', count: '3 Episodes', icon: 'menu_book' },
    { label: 'Motivation', count: '2 Episodes', icon: 'star' },
  ];

  readonly platforms: ReadonlyArray<{ label: string; sub: string; tone: string }> = [
    { label: 'Listen on Spotify', sub: 'Spotify', tone: 'text-[#1DB954]' },
    { label: 'Listen on YouTube', sub: 'YouTube', tone: 'text-[#FF0000]' },
    { label: 'Listen on Apple Podcasts', sub: 'Apple Podcasts', tone: 'text-[#9933CC]' },
  ];

  // Episodes come from the DB; the page shows only active ones, keeping the
  // original card design and filling in what the backend provides.
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly episodes = signal<readonly Episode[]>([]);

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
        const rows = Array.isArray(list) ? list : [];
        this.episodes.set(
          rows
            .filter((p) => this.isActive(p.isactive))
            .map((p) => ({ title: p.title, id: this.videoId(p.link) }))
            .filter((e) => !!e.id)
            .map((e, i) => ({
              number: `EPISODE ${String(i + 1).padStart(2, '0')}`,
              title: e.title,
              thumb: `https://img.youtube.com/vi/${e.id}/hqdefault.jpg`,
              videoId: e.id,
            })),
        );
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

  /** Backends vary between boolean / 1 / "true" for the active flag. */
  private isActive(value: unknown): boolean {
    return value === true || value === 1 || String(value).toLowerCase() === 'true';
  }

  /** Extract the YouTube video id from the various URL shapes the backend stores. */
  private videoId(link: string): string {
    if (!link) return '';
    if (link.includes('youtube.com/watch?v=')) return link.split('v=')[1].split('&')[0];
    if (link.includes('youtu.be/')) return link.split('.be/')[1].split('?')[0];
    if (link.includes('youtube.com/live/')) return link.split('/live/')[1].split('?')[0];
    if (link.includes('youtube.com/embed/')) return link.split('/embed/')[1].split(/[?&]/)[0];
    return '';
  }
}
