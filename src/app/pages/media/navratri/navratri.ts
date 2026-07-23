import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Glimpse = 'All' | 'Pandal' | 'Garba' | 'Cultural Programs' | 'Aarti' | 'Devotees';

@Component({
  selector: 'app-navratri',
  imports: [RouterLink],
  templateUrl: './navratri.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navratri.scss',
})
export class Navratri {
  readonly banner = PLACEHOLDER.media.navratriBanner;

  readonly quickLinks: ReadonlyArray<{ label: string; path: string[] }> = [
    { label: 'Navratri 2026 Schedule', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { label: 'Darshan & Pandal Information', path: ['M3 21h18', 'M5 21V10l7-6 7 6v11', 'M10 21v-6h4v6'] },
    { label: 'Cultural Programs & Events', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { label: 'Gallery', path: ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'm21 15-5-5L5 21'] },
    { label: 'Seva & Volunteers', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { label: 'Important Guidelines', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 16v-4M12 8h.01'] },
  ];

  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '100K+', label: 'Devotees Every Year', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '9 Days', label: 'of Celebration', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { value: '1 Grand Pandal', label: 'CES Campus', path: ['M3 21h18', 'M5 21V10l7-6 7 6v11'] },
    { value: '50+', label: 'Cultural Performances', path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'] },
    { value: '500+', label: 'Volunteers', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { value: '100%', label: 'Safe & Secure', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
  ];

  readonly filters: readonly Glimpse[] = ['All', 'Pandal', 'Garba', 'Cultural Programs', 'Aarti', 'Devotees'];
  readonly filter = signal<Glimpse>('All');

  select(f: Glimpse): void {
    this.filter.set(f);
  }

  readonly glimpses: ReadonlyArray<{ src: string; tag: Exclude<Glimpse, 'All'> }> =
    PLACEHOLDER.media.navratri.map((src, i) => ({
      src,
      tag: (['Pandal', 'Garba', 'Devotees', 'Aarti', 'Cultural Programs', 'Aarti', 'Garba', 'Devotees'] as const)[i],
    }));

  readonly visible = computed(() => {
    const f = this.filter();
    return f === 'All' ? this.glimpses : this.glimpses.filter((g) => g.tag === f);
  });

  readonly highlights: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Divine Darshan', body: 'Beautifully decorated pandal with daily darshan of Maa Amba.', path: ['M3 21h18', 'M5 21V10l7-6 7 6v11'] },
    { title: 'Daily Aarti', body: 'Soulful aarti every evening with a spiritual and peaceful atmosphere.', path: ['M12 2s4 5 4 8a4 4 0 0 1-8 0c0-3 4-8 4-8z', 'M8 21h8'] },
    { title: 'Garba & Raas', body: 'Traditional Garba & Raas with live orchestra and energetic beats.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
    { title: 'Cultural Programs', body: 'Skits, music, dance and competitions by students & invited artists.', path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'] },
    { title: 'Prasad & Annadan', body: 'Daily prasad and annadan seva for all devotees.', path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'] },
    { title: 'Security & Safety', body: 'Round the clock security, medical support and dedicated management.', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
  ];
}
