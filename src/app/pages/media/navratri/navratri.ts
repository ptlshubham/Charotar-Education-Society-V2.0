import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../../core/services/resources.service';
import { NavratriEntry, NavratriPage } from '../../../shared/models/models';
import { MediaUrlPipe } from '../../../shared/media-url.pipe';
import { NAVRATRI_BANNER, NAVRATRI_VENUE, navratriDates, youtubeId } from '../../../shared/navratri';
import { LiveNavratri } from './live-navratri/live-navratri';

const mediaUrl = new MediaUrlPipe();

/**
 * What the page showed before it was editable - also what migration 0058 seeded navratri_page with.
 * Shown until the dashboard's version loads, and if it can't be loaded.
 */
const DEFAULT_PAGE: NavratriPage = {
  banner: null,
  introHeading: 'Tradition. Devotion. Togetherness.',
  introHtml:
    '<p><strong>Navratri</strong> at CES has a theme of its own every year, each one drawn from a form of the Mother Goddess: ' +
    'Shaktipeeth Sadhana in 2024, Brahmandeshwari in 2023 and Aishwaryadayini Maa Amba in 2022, going back to Urja Shankh in 2010.</p>' +
    '<p>Students help run the festival, and learn teamwork, discipline and time management along the way. Families come together, ' +
    'and people of every community and every generation share the same garba ground.</p>',
  introVideo: null,
  introImage: null,
  stats: [
    { value: '100K+', label: 'Devotees Every Year', icon: 'group' },
    { value: '9 Days', label: 'of Celebration', icon: 'calendar_month' },
    { value: '1 Grand Pandal', label: 'CES Campus', icon: 'home' },
    { value: '50+', label: 'Cultural Performances', icon: 'music_note' },
    { value: '500+', label: 'Volunteers', icon: 'favorite' },
    { value: '100%', label: 'Safe & Secure', icon: 'verified_user' },
  ],
};

/**
 * Navratri - the festival page. Everything on it comes from Website Management → Navratri: the
 * banner, intro, video and "At a Glance" figures (the Navratri page card), the dates in the hero
 * (the newest year that has them) and the celebrations by year.
 */
@Component({
  selector: 'app-navratri',
  imports: [RouterLink, MediaUrlPipe, PageHero, LiveNavratri],
  templateUrl: './navratri.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri.scss',
})
export class Navratri {
  private readonly resources = inject(ResourcesService);
  private readonly sanitizer = inject(DomSanitizer);

  // ─── Navratri celebrations from the DB ───
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly celebrations = signal<readonly NavratriEntry[]>([]);

  /** The page's own content. */
  readonly page = signal<NavratriPage>(DEFAULT_PAGE);

  readonly banner = computed(() => mediaUrl.transform(this.page().banner) || NAVRATRI_BANNER);
  readonly introImage = computed(() => mediaUrl.transform(this.page().introImage) || this.banner());
  readonly stats = computed(() => this.page().stats.filter((s) => s.value || s.label));

  /** The festival the hero announces: the newest year with its dates entered. */
  private readonly upcoming = computed(() => this.celebrations().find((c) => c.startDate) ?? null);
  readonly heroDates = computed(() => navratriDates(this.upcoming()?.startDate, this.upcoming()?.endDate));
  readonly heroVenue = computed(() => this.upcoming()?.venue || NAVRATRI_VENUE);
  /** "Know More" opens the newest year. */
  readonly latestYear = computed(() => this.celebrations()[0]?.year ?? null);

  // ─── Intro video: a picture with a play button until clicked, then the YouTube player ───
  private readonly videoId = computed(() => youtubeId(this.page().introVideo));
  readonly hasVideo = computed(() => !!this.videoId());
  readonly playing = signal(false);
  /** Built once per video - a fresh SafeResourceUrl on every check would reload the player. */
  readonly videoUrl = computed<SafeResourceUrl | null>(() =>
    this.playing() && this.videoId()
      ? this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${this.videoId()}?autoplay=1&rel=0`)
      : null,
  );

  constructor() {
    this.resources
      .getNavratriList()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<NavratriEntry[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        const rows = Array.isArray(list) ? [...list] : [];
        // Newest year first, like the legacy site.
        rows.sort((a, b) => Number(b.year) - Number(a.year));
        this.celebrations.set(rows);
        this.loading.set(false);
      });

    this.resources
      .getNavratriPage()
      .pipe(catchError(() => of(null)), takeUntilDestroyed())
      .subscribe((p) => {
        if (!p) return;
        this.page.set({
          ...DEFAULT_PAGE,
          ...p,
          introHeading: p.introHeading || DEFAULT_PAGE.introHeading,
          stats: Array.isArray(p.stats) ? p.stats : [],
        });
      });
  }

  /** Strips HTML from themedetails for a short card teaser. */
  teaser(html: string, max = 160): string {
    const text = (html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  }
}
