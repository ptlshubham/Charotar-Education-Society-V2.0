import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeroStat, PageHero } from '../../shared/page-hero/page-hero';

type CampusKey = 'anand' | 'khetiwadi' | 'mogri';
type Kind = 'school' | 'college' | 'hostel';

interface Institute {
  name: string;
  kind: Kind;
  phone?: string;
  website?: string;
  image: string;
}

interface Campus {
  key: CampusKey;
  name: string;
  /** Campus area, from the Society's records (40.5 acres in all). */
  area: string;
  address: string;
  /** What Google Maps should search for to find the campus. */
  mapQuery: string;
  intro: string;
  facilities?: readonly string[];
  /** Lead photo, and the institute it shows. */
  image: string;
  caption: string;
  institutes: readonly Institute[];
}

const GROUPS: ReadonlyArray<{ kind: Kind; label: string; link: string; linkLabel: string }> = [
  { kind: 'school', label: 'Schools', link: '/academic/school', linkLabel: 'All schools' },
  { kind: 'college', label: 'Colleges', link: '/academic/colleges', linkLabel: 'All colleges' },
  { kind: 'hostel', label: 'Hostels', link: '/academic/hostels', linkLabel: 'All hostels' },
];

const IMG = '/assets/images/institutes/';

/**
 * The three CES campuses and the institutes on each. Which institute sits on which campus follows
 * CES at a Glance (/about/profile); names, phone numbers, websites and photos follow the Schools,
 * Colleges and Hostels pages - keep them in step when an institute is added or renamed.
 * /more/campus?campus=khetiwadi opens that campus.
 */
@Component({
  selector: 'app-campuses',
  imports: [PageHero, RouterLink],
  templateUrl: './campuses.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './campuses.scss',
})
export class Campuses {
  private readonly document = inject(DOCUMENT);

  readonly banner = '/assets/images/hero/about.webp';

  readonly heroStats: readonly HeroStat[] = [
    { value: '3', label: 'Campuses', path: [], icon: 'location_city', iconClass: 'text-white' },
    { value: '40.5', label: 'Acres in all', path: [], icon: 'landscape', iconClass: 'text-white' },
    { value: '31+', label: 'Institutes', path: [], icon: 'school', iconClass: 'text-white' },
    { value: '4', label: 'Hostels', path: [], icon: 'bed', iconClass: 'text-white' },
  ];

  readonly campuses: readonly Campus[] = [
    {
      key: 'anand',
      name: 'Anand Campus',
      area: '21 acres',
      address: 'D.N. High School Campus, Station Road, Anand 388001',
      mapQuery: 'D N High School, Station Road, Anand, Gujarat',
      intro:
        'Our main campus near Anand railway station is where CES began in 1916, with 27 pupils in three standards. Today its 21 acres hold our oldest schools, most of our colleges, three of our four hostels and the Society\'s office.',
      facilities: ['Gyansthali Library', 'Gym with free coaching', 'Amphitheatre', 'Auditorium', 'Saraswati temple', 'Stationery store'],
      image: `${IMG}dn-high-9-12.webp`,
      caption: 'D.N. High School, where CES began',
      institutes: [
        { kind: 'school', name: 'D. N. High School (Std 6 to 8)', phone: '(02692) 269060', website: 'https://www.up.dnhighschool.ac.in/', image: `${IMG}dn-high-6-8.webp` },
        { kind: 'school', name: 'D. N. High School (Std 9 to 12)', phone: '(02692) 268940', website: 'https://www.hs.dnhighschool.ac.in/', image: `${IMG}dn-high-9-12.webp` },
        { kind: 'school', name: 'Kasturba Kanya Vidyalaya (Std 6 to 8)', phone: '(02692) 250137', website: 'https://www.up.kkv.ac.in/', image: `${IMG}kkv-6-8.webp` },
        { kind: 'school', name: 'Kasturba Kanya Vidyalaya (Std 9 to 12)', phone: '(02692) 268940', website: 'https://www.hs.kkv.ac.in/', image: `${IMG}kkv-9-12.webp` },
        { kind: 'school', name: 'V. J. Patel Higher Secondary School', phone: '(02692) 250669', website: 'https://www.vjhs.ac.in/', image: `${IMG}dn-high-6-8.webp` },
        { kind: 'school', name: 'Charotar English Medium School', phone: '(02692) 266789', website: 'https://www.cems.ac.in/', image: `${IMG}cems.webp` },
        { kind: 'school', name: 'Ambalal Balshala', phone: '(02692) 243634', website: 'https://www.ambs.ac.in/', image: `${IMG}ambalal-balshala.webp` },
        { kind: 'school', name: 'Shishuvihar, Nutan Shishuvihar and Nursery', phone: '(02692) 250864', website: 'https://www.shishuvihar.ac.in/', image: `${IMG}shishuvihar.webp` },
        { kind: 'college', name: 'M. B. Patel Science College', phone: '(02692) 244415', website: 'https://www.mbpatelscience.ac.in/', image: `${IMG}mb-patel-science.webp` },
        { kind: 'college', name: 'Shri Alpesh N. Patel Post Graduate Institute of Science and Research', phone: '(02692) 267404', website: 'https://www.sanppgi.ac.in/', image: `${IMG}alpesh-science.webp` },
        { kind: 'college', name: 'Shri V. Z. Patel Commerce College', phone: '(02692) 252000', website: 'https://www.vzp.ac.in/', image: `${IMG}vz-patel-commerce.webp` },
        { kind: 'college', name: 'Shri D. N. Institute of P. G. Studies in Commerce', phone: '(02692) 252804', website: 'https://www.shridnpgs.ac.in/', image: `${IMG}dn-pg-commerce.jpg` },
        { kind: 'college', name: 'Shri Bhikhabhai Patel Arts College', phone: '(02692) 244043', website: 'https://www.bpac.ac.in/', image: `${IMG}bhikhabhai-arts.webp` },
        { kind: 'college', name: 'Shri Bhikhabhai Patel Institute of P. G. Studies & Research in Humanities', phone: '(02692) 244043', website: 'https://www.bppg.ac.in/', image: `${IMG}bhikhabhai-pg-studies.webp` },
        { kind: 'college', name: 'Shri D. N. Institute of Business Administration', phone: '(02692) 252800', website: 'https://www.dniba.ac.in/', image: `${IMG}dn-business.webp` },
        { kind: 'college', name: 'Shri D. N. Institute of Computer Applications', phone: '(02692) 266679', website: 'https://www.dnica.ac.in/', image: `${IMG}dn-computer.webp` },
        { kind: 'college', name: 'Shri D. N. Institute of Law', phone: '(02692) 243083', image: `${IMG}dn-law.webp` },
        { kind: 'hostel', name: 'Vidhyarthi Ashram', image: `${IMG}hostel-vidhyarthi-ashram.webp` },
        { kind: 'hostel', name: 'Kasturba Kanya Chhatralay', image: `${IMG}hostel-kasturba-kanya.webp` },
        { kind: 'hostel', name: 'Ladies Hostel (M. B. Patel Science College)', image: `${IMG}hostel-ladies.webp` },
      ],
    },
    {
      key: 'khetiwadi',
      name: 'Khetiwadi Campus',
      area: '7.5 acres',
      address: 'Khetiwadi, Anand, Gujarat',
      mapQuery: 'Sardar Vallabhbhai Patel High School, Khetiwadi, Anand, Gujarat',
      intro:
        'The 7.5-acre Khetiwadi campus is home to Sardar Vallabhbhai Patel High School, with classes from Shishuvihar right up to class 12.',
      image: `${IMG}svp-high-9-12.webp`,
      caption: 'Sardar Vallabhbhai Patel High School',
      institutes: [
        { kind: 'school', name: 'Sardar Vallabhbhai Patel Shishuvihar and Balshala', phone: '(02692) 262904', website: 'https://www.bal.svpschool.ac.in/', image: `${IMG}svp-shishuvihar.webp` },
        { kind: 'school', name: 'Sardar Vallabhbhai Patel High School (Std 6 to 8)', phone: '(02692) 264516', website: 'https://www.up.svpschool.ac.in/', image: `${IMG}svp-high-6-8.webp` },
        { kind: 'school', name: 'Sardar Vallabhbhai Patel High School (Std 9 to 12)', phone: '(02692) 262436', website: 'https://www.hs.svpschool.ac.in/', image: `${IMG}svp-high-9-12.webp` },
      ],
    },
    {
      key: 'mogri',
      name: 'Mogri Campus',
      area: '12 acres',
      address: 'Mogri, Anand, Gujarat',
      mapQuery: 'Shri I J Patel B.Ed. College, Mogri, Anand, Gujarat',
      intro:
        'The 12-acre Mogri campus is where CES trains its teachers and physical education instructors, alongside a school and an applied science college. It was redeveloped at a cost of about Rs. 2 crore and has its own hostel, Adhyapan Mandir Chhatralay.',
      image: `${IMG}ij-patel-bed.webp`,
      caption: 'The college building on the Mogri campus',
      institutes: [
        { kind: 'school', name: 'K. M. Patel Balshala and Shishuvihar', phone: '(02692) 233123', website: 'https://www.kmbal.ac.in/', image: `${IMG}km-patel-balshala.webp` },
        { kind: 'school', name: 'Mahatma Gandhi Vidyalaya (Std 6 to 8)', phone: '(02692) 230192', website: 'https://www.up.mgvidyalaya.ac.in/', image: `${IMG}mg-vidyalaya-6-8.webp` },
        { kind: 'school', name: 'Mahatma Gandhi Vidyalaya (Std 9 to 12)', phone: '(02692) 230192', website: 'https://www.hs.mgvidyalaya.ac.in/', image: `${IMG}mg-vidyalaya-9-12.webp` },
        // The Mogri building photo carries this college's signboard (the Colleges page shows the Anand science college).
        { kind: 'college', name: 'M. B. Patel Applied Science College', phone: '(02692) 233000', website: 'https://www.mbpasc.ac.in/', image: `${IMG}ij-patel-bed.webp` },
        { kind: 'college', name: 'Motibhai Amin P. S. Adhyapan Mandir (D.El.Ed.)', phone: '(02692) 233343', website: 'https://www.maptc.ac.in/', image: `${IMG}motibhai-amin.webp` },
        { kind: 'college', name: 'Shri I. J. Patel B.Ed. College', phone: '(02692) 236266', website: 'https://www.ijbed.ac.in/', image: `${IMG}ij-patel-bed.webp` },
        { kind: 'college', name: 'Shri I. J. Patel M.Ed. College', phone: '(02692) 233064', website: 'https://www.ipmed.ac.in/', image: `${IMG}ij-patel-med.webp` },
        { kind: 'college', name: 'Shri V. J. Patel College of Physical Education', phone: '(02692) 229062', website: 'https://www.vjbped.ac.in/', image: `${IMG}vj-patel-physical.webp` },
        { kind: 'hostel', name: 'Adhyapan Mandir Chhatralay', image: `${IMG}hostel-adhyapan-mandir.webp` },
      ],
    },
  ];

  readonly activeKey = signal<CampusKey>('anand');

  readonly active = computed(() => this.campuses.find((c) => c.key === this.activeKey()) ?? this.campuses[0]);

  /** The active campus's institutes, as Schools / Colleges / Hostels (empty groups left out). */
  readonly groups = computed(() =>
    GROUPS.map((g) => ({ ...g, items: this.active().institutes.filter((i) => i.kind === g.kind) })).filter((g) => g.items.length),
  );

  constructor() {
    // Deep-link support: /more/campus?campus=khetiwadi opens that campus (and keeps
    // reacting if the param changes while the page stays mounted, e.g. via search).
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((pm) => {
        const key = pm.get('campus');
        if (key === 'anand' || key === 'khetiwadi' || key === 'mogri') this.activeKey.set(key);
      });
  }

  select(key: CampusKey): void {
    this.activeKey.set(key);
  }

  /** "Explore" on a campus card: switch to it and bring its details into view. */
  explore(key: CampusKey): void {
    this.select(key);
    this.document.getElementById('campus-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** How many of a campus's institutes are of one kind, e.g. "8 schools". */
  count(c: Campus, kind: Kind): number {
    return c.institutes.filter((i) => i.kind === kind).length;
  }

  mapLink(c: Campus): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`;
  }

  /** Templates can't hold regex literals, so strip formatting here. */
  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
