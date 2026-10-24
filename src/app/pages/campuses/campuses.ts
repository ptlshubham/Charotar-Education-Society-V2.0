import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../shared/placeholder-images';
import { LightboxService } from '../../core/services/lightbox.service';

interface Campus {
  key: 'anand' | 'khetiwadi' | 'mogri';
  name: string;
  /** Campus area, from the Society's records (40.5 acres in all). */
  area: string;
  location: string;
  institutions: string;
  facilities: string;
  intro: string;
  cardBlurb: string;
  photos: readonly string[];
}

@Component({
  selector: 'app-campuses',
  imports: [PageHero],
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
      area: '21 acres',
      location: 'D.N. High School Campus, Station Road, Anand',
      institutions: 'D.N. High School, Kasturba Kanya Vidyalaya, Charotar English Medium School, V.J. Patel Higher Secondary School and most of our colleges',
      facilities: 'Gyansthali Library, gym, amphitheatre, auditorium, Saraswati temple, stationery store and three hostels.',
      intro:
        'Our main campus near Anand railway station is where CES began in 1916, with 27 students in three classrooms. Today its 21 acres hold our oldest schools, most of our colleges and three of our four hostels.',
      cardBlurb: 'Where CES began in 1916: 21 acres near Anand railway station.',
      photos: PLACEHOLDER.campuses.anand,
    },
    {
      key: 'khetiwadi',
      name: 'Khetiwadi Campus',
      area: '7.5 acres',
      location: 'Khetiwadi, Anand, Gujarat',
      institutions: 'Sardar Vallabhbhai Patel High School and Shishuvihar/Balshala',
      facilities: 'Library, Laboratories, Playground, Computer Labs and more.',
      intro:
        'The 7.5-acre Khetiwadi campus is home to Sardar Vallabhbhai Patel High School, with classes from Shishuvihar right up to class 12.',
      cardBlurb: '7.5 acres, home to Sardar Vallabhbhai Patel High School.',
      photos: PLACEHOLDER.campuses.khetiwadi,
    },
    {
      key: 'mogri',
      name: 'Mogri Campus',
      area: '12 acres',
      location: 'Mogri, Anand, Gujarat',
      institutions: 'Motibhai Amin Adhyapan Mandir (PTC), I.J. Patel B.Ed. and M.Ed., V.J. Patel B.P.Ed., M.B. Patel Applied Science College, Mahatma Gandhi Vidyalaya and K.M. Patel Balshala',
      facilities: 'Library, Laboratories, Hostel, Sports Ground and more.',
      intro:
        'The 12-acre Mogri campus is where CES trains its teachers and physical education instructors. It was redeveloped at a cost of about Rs. 2 crore and has its own hostel, Adhyapan Mandir Chhatralay.',
      cardBlurb: '12 acres for teacher training and physical education.',
      photos: PLACEHOLDER.campuses.mogri,
    },
  ];

  readonly activeKey = signal<Campus['key']>('anand');
  readonly activePhoto = signal(0);

  private readonly route = inject(ActivatedRoute);
  private readonly lightbox = inject(LightboxService);

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

  /** Open the active campus's photos in the site-wide viewer, on photo i. */
  viewPhotos(i = this.activePhoto()): void {
    const c = this.active();
    this.lightbox.open(c.photos.map((src, n) => ({ src, caption: `${c.name} - Photo ${n + 1}` })), i);
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
