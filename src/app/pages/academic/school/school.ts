import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHero, HeroStat } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Medium = 'all' | 'english' | 'gujarati' | 'others' | 'hostels';

interface SchoolItem {
  name: string;
  phone: string;
  medium: Exclude<Medium, 'all'>;
  image: string;
  path: string[];
}

const ICON = {
  cap: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
  home: ['M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z', 'M9 22V12h6v10'],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  building: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'],
  arts: ['M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3 3h-2a2 2 0 0 0-1.4 3.4A2 2 0 0 1 14 22z', 'M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM15.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
};

@Component({
  selector: 'app-school',
  imports: [PageHero],
  templateUrl: './school.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './school.scss',
})
export class School {
  readonly banner = PLACEHOLDER.academic.schoolsBanner;

  readonly heroStats: readonly HeroStat[] = [
    { value: '18+', label: 'Schools', path: ICON.building },
    { value: '12K+', label: 'Students', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '650+', label: 'Teachers', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
    { value: '6', label: 'Districts', path: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'] },
  ];

  readonly filters: ReadonlyArray<{ id: Medium; label: string; path: string[] }> = [
    { id: 'all', label: 'All Schools', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { id: 'english', label: 'English Medium', path: ['M4 7V4h16v3', 'M9 20h6', 'M12 4v16'] },
    { id: 'gujarati', label: 'Gujarati Medium', path: ['M5 8h14M5 12h9M5 16h12'] },
    { id: 'others', label: 'Others', path: ['M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'] },
    { id: 'hostels', label: 'Hostels', path: ['M2 20v-8h20v8', 'M2 12V7M22 12V9a1 1 0 0 0-1-1h-9v4'] },
  ];

  readonly active = signal<Medium>('all');

  select(id: Medium): void {
    this.active.set(id);
  }

  /** Names and phone numbers transcribed from the CES schools directory. */
  readonly schools: readonly SchoolItem[] = [
    { name: 'Charotar English Medium School, Anand', phone: '(02692) 266789', medium: 'english', image: PLACEHOLDER.academic.cards[0], path: ICON.cap },
    { name: 'Shishuvihar, Nutan Shishuvihar And Nursary, Anand', phone: '(02692) 251071', medium: 'gujarati', image: PLACEHOLDER.academic.cards[1], path: ICON.home },
    { name: 'Ambalal Balshala, Anand', phone: '(02692) 234634', medium: 'gujarati', image: PLACEHOLDER.academic.cards[2], path: ICON.arts },
    { name: 'D. N. High School (Std 6 to 8), Anand', phone: '(02692) 250419', medium: 'gujarati', image: PLACEHOLDER.academic.cards[3], path: ICON.building },
    { name: 'Kasturba Kanya Vidhyalaya (Std 6 to 8), Anand', phone: '(02692) 246814', medium: 'gujarati', image: PLACEHOLDER.academic.cards[4], path: ICON.book },
    { name: 'D. N. High School (Std 9 to 12), Anand', phone: '(02692) 250802', medium: 'gujarati', image: PLACEHOLDER.academic.cards[5], path: ICON.building },
    { name: 'Kasturba Kanya Vidhyalaya (Std 9 to 12), Anand', phone: '(02692) 246815', medium: 'gujarati', image: PLACEHOLDER.academic.cards[6], path: ICON.book },
    { name: 'V. J. Patel Higher Secondary School, Anand', phone: '(02692) 255456', medium: 'gujarati', image: PLACEHOLDER.academic.cards[7], path: ICON.cap },
    { name: 'Sardar Vallabhbhai Patel Shishuvihar and Balshala, Khetiwadi', phone: '(02692) 245798', medium: 'gujarati', image: PLACEHOLDER.academic.cards[8], path: ICON.home },
    { name: 'Sardar Vallabhbhai Patel High School (Std 6 to 8), Khetiwadi', phone: '(02692) 245801', medium: 'gujarati', image: PLACEHOLDER.academic.cards[9], path: ICON.building },
    { name: 'Sardar Vallabhbhai Patel High School (Std 9 to 12), Khetiwadi', phone: '(02693) 245802', medium: 'gujarati', image: PLACEHOLDER.academic.cards[10], path: ICON.building },
    { name: 'K. M. Patel Balshala and Shishuvihar, Mogri', phone: '(02693) 297128', medium: 'gujarati', image: PLACEHOLDER.academic.cards[11], path: ICON.home },
    { name: 'Mahatma Gandhi Vidyalaya (Std 6 to 8), Mogri', phone: '(02693) 297129', medium: 'gujarati', image: PLACEHOLDER.academic.cards[12], path: ICON.building },
    { name: 'Mahatma Gandhi Vidyalaya (Std 9 to 12), Mogri', phone: '(02693) 297130', medium: 'gujarati', image: PLACEHOLDER.academic.cards[13], path: ICON.cap },
    { name: 'CES Performing Arts And Fine Arts Academy', phone: '(02692) 246500', medium: 'others', image: PLACEHOLDER.academic.cards[14], path: ICON.arts },
  ];

  readonly visible = computed(() => {
    const f = this.active();
    return f === 'all' ? this.schools : this.schools.filter((s) => s.medium === f);
  });

  /** Templates can't hold regex literals, so strip formatting here. */
  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
