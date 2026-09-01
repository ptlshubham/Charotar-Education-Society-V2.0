import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PLACEHOLDER } from '../../shared/placeholder-images';

interface Campus {
  key: 'anand' | 'khetiwadi' | 'mogri';
  name: string;
  established: string;
  location: string;
  institutions: string;
  facilities: string;
  intro: string;
  cardBlurb: string;
  photos: readonly string[];
}

@Component({
  selector: 'app-campuses',
  templateUrl: './campuses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './campuses.scss',
})
export class Campuses {
  readonly banner = PLACEHOLDER.about.hero;

  readonly campuses: readonly Campus[] = [
    {
      key: 'anand',
      name: 'Anand Campus',
      established: '1945',
      location: 'Anand, Gujarat, India',
      institutions: 'Schools, Colleges & Other Units',
      facilities: 'Library, Laboratories, Sports Complex, Auditorium, Computer Labs and more.',
      intro:
        'The Anand Campus is the oldest and main campus of Charotar Education Society, located in the heart of Anand city. It has been a pioneer in providing value-based education for decades.',
      cardBlurb: 'The main campus located in Anand city with schools, colleges and other institutions.',
      photos: PLACEHOLDER.campuses.anand,
    },
    {
      key: 'khetiwadi',
      name: 'Khetiwadi Campus',
      established: '1962',
      location: 'Khetiwadi, Anand, Gujarat, India',
      institutions: 'Schools & Higher Secondary Units',
      facilities: 'Library, Laboratories, Playground, Computer Labs and more.',
      intro:
        'A serene campus focused on academic excellence and student development, offering a calm environment for focused learning.',
      cardBlurb: 'A serene campus focused on academic excellence and student development.',
      photos: PLACEHOLDER.campuses.khetiwadi,
    },
    {
      key: 'mogri',
      name: 'Mogri Campus',
      established: '1971',
      location: 'Mogri, Anand, Gujarat, India',
      institutions: 'Schools, Adhyapan Mandir & Hostels',
      facilities: 'Library, Laboratories, Hostel, Sports Ground and more.',
      intro:
        'Committed to quality education with modern facilities in a green and peaceful environment away from the city bustle.',
      cardBlurb: 'Committed to quality education with modern facilities in a green and peaceful environment.',
      photos: PLACEHOLDER.campuses.mogri,
    },
  ];

  readonly activeKey = signal<Campus['key']>('anand');
  readonly activePhoto = signal(0);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    // Deep-link support: /more/campus?campus=khetiwadi opens that campus (and keeps
    // reacting if the param changes while the page stays mounted, e.g. via search).
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const key = pm.get('campus');
      if (key === 'anand' || key === 'khetiwadi' || key === 'mogri') {
        this.activeKey.set(key);
        this.activePhoto.set(0);
      }
    });
  }

  select(key: Campus['key']): void {
    this.activeKey.set(key);
    this.activePhoto.set(0);
  }

  selectPhoto(i: number): void {
    this.activePhoto.set(i);
  }

  readonly active = computed(
    () => this.campuses.find((c) => c.key === this.activeKey()) ?? this.campuses[0],
  );

  readonly highlights: ReadonlyArray<{ label: string; path: string[] }> = [
    { label: 'Multiple Institutions', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
    { label: 'Modern Infrastructure', path: ['M2 20h20', 'M4 20V8l8-5 8 5v12', 'M10 20v-6h4v6'] },
    { label: 'Excellent Faculty', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];
}
