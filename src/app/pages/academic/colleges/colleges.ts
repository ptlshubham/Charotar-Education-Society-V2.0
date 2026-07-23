import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHero, HeroStat } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Stream = 'all' | 'science' | 'management' | 'commerce' | 'arts' | 'law' | 'others';

interface College {
  name: string;
  location: string;
  desc: string;
  phone: string;
  stream: Exclude<Stream, 'all'>;
  image: string;
  path: string[];
}

@Component({
  selector: 'app-colleges',
  imports: [PageHero],
  templateUrl: './colleges.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './colleges.scss',
})
export class Colleges {
  readonly banner = PLACEHOLDER.academic.collegesBanner;

  readonly heroStats: readonly HeroStat[] = [
    { value: '6', label: 'Colleges', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: '25+', label: 'Programs', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h6'] },
    { value: '5K+', label: 'Students', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '120+', label: 'Faculty', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
  ];

  readonly filters: ReadonlyArray<{ id: Stream; label: string; path: string[] }> = [
    { id: 'all', label: 'Colleges', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
    { id: 'science', label: 'Science', path: ['M9 2v6L4.5 17A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.3-4L15 8V2', 'M8 2h8', 'M7 15h10'] },
    { id: 'management', label: 'Management', path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'] },
    { id: 'commerce', label: 'Commerce', path: ['M3 3v18h18', 'M7 15V9M12 15V6M17 15v-4'] },
    { id: 'arts', label: 'Arts', path: ['M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3 3h-2a2 2 0 0 0-1.4 3.4A2 2 0 0 1 14 22z', 'M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'] },
    { id: 'law', label: 'Law', path: ['M12 3v18M5 7h14', 'm5 7-3 6h6zM19 7l-3 6h6z', 'M7 21h10'] },
    { id: 'others', label: 'Others', path: ['M5 12h.01M12 12h.01M19 12h.01'] },
  ];

  readonly active = signal<Stream>('all');

  select(id: Stream): void {
    this.active.set(id);
  }

  readonly colleges: readonly College[] = [
    { name: 'M. B. Patel Science College', location: 'Anand, Gujarat', desc: 'Excellence in science education and research.', phone: '(02692) 246814', stream: 'science', image: PLACEHOLDER.academic.cards[0], path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { name: 'Shri V. Z. Patel Commerce College', location: 'Anand, Gujarat', desc: 'Shaping future leaders in commerce and business.', phone: '(02692) 250802', stream: 'commerce', image: PLACEHOLDER.academic.cards[1], path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'] },
    { name: 'Shri D. N. Institute of Business Administration', location: 'Anand, Gujarat', desc: 'Quality management education for a dynamic world.', phone: '(02692) 251071', stream: 'management', image: PLACEHOLDER.academic.cards[2], path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { name: 'Shri Bhikhabhai Patel Arts College', location: 'Anand, Gujarat', desc: 'Nurturing creativity, culture and social awareness.', phone: '(02692) 245901', stream: 'arts', image: PLACEHOLDER.academic.cards[3], path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { name: 'Shri D. N. Institute of P. G. Studies in Commerce', location: 'Anand, Gujarat', desc: 'Postgraduate excellence in commerce education.', phone: '(02692) 250419', stream: 'commerce', image: PLACEHOLDER.academic.cards[4], path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { name: 'Shri D. N. Institute of Law', location: 'Anand, Gujarat', desc: 'Building strong foundations in legal education and ethics.', phone: '(02692) 266789', stream: 'law', image: PLACEHOLDER.academic.cards[5], path: ['M12 3v18M5 7h14', 'm5 7-3 6h6zM19 7l-3 6h6z', 'M7 21h10'] },
  ];

  readonly visible = computed(() => {
    const f = this.active();
    return f === 'all' ? this.colleges : this.colleges.filter((c) => c.stream === f);
  });

  readonly summary: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '6', label: 'Colleges', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
    { value: '25+', label: 'Undergraduate Programs', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6'] },
    { value: '15+', label: 'Postgraduate Programs', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { value: '5K+', label: 'Students Enrolled', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
    { value: '120+', label: 'Experienced Faculty', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
    { value: '100%', label: 'Placement Assistance', path: ['m11 17 2 2a1 1 0 1 0 3-3', 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2.8 2.8 0 0 1 4 0l4 4'] },
  ];

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
