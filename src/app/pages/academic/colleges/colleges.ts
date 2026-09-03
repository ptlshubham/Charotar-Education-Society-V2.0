import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHero, HeroStat } from '../../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../../shared/placeholder-images';
import { AcademicTabs } from '../academic-tabs';

type Stream = 'all' | 'science' | 'management' | 'commerce' | 'arts' | 'law' | 'others';

interface College {
  name: string;
  location: string;
  desc: string;
  phone: string;
  /** Official college website; empty when the institute has none. */
  website: string;
  stream: Exclude<Stream, 'all'>;
  image: string;
  path: string[];
}

@Component({
  selector: 'app-colleges',
  imports: [PageHero, AcademicTabs],
  templateUrl: './colleges.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './colleges.scss',
})
export class Colleges {
  readonly banner = PLACEHOLDER.academic.collegesBanner;

  readonly heroStats: readonly HeroStat[] = [
    { value: '14', label: 'Colleges', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: '25+', label: 'Programs', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h6'] },
    { value: '5K+', label: 'Students', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '120+', label: 'Faculty', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
  ];

  readonly filters: ReadonlyArray<{ id: Stream; label: string; path: string[] }> = [
    { id: 'all', label: 'All Colleges', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
    { id: 'science', label: 'Science', path: ['M9 2v6L4.5 17A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.3-4L15 8V2', 'M8 2h8', 'M7 15h10'] },
    { id: 'management', label: 'Management', path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'] },
    { id: 'commerce', label: 'Commerce', path: ['M3 3v18h18', 'M7 15V9M12 15V6M17 15v-4'] },
    { id: 'arts', label: 'Arts', path: ['M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-3 3h-2a2 2 0 0 0-1.4 3.4A2 2 0 0 1 14 22z', 'M8.5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'] },
    { id: 'law', label: 'Law', path: ['M12 3v18M5 7h14', 'm5 7-3 6h6zM19 7l-3 6h6z', 'M7 21h10'] },
    { id: 'others', label: 'Others', path: ['M5 12h.01M12 12h.01M19 12h.01'] },
  ];

  readonly active = signal<Stream>('all');

  select(id: string): void {
    this.active.set(id as Stream);
  }

  // Icon paths shared by stream.
  private static readonly CAP = ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'];
  private static readonly BRIEFCASE = ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'];
  private static readonly PEOPLE = ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'];
  private static readonly BOOK = ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'];
  private static readonly SCALES = ['M12 3v18M5 7h14', 'm5 7-3 6h6zM19 7l-3 6h6z', 'M7 21h10'];
  private static readonly MONITOR = ['M3 4h18v12H3z', 'M8 20h8M12 16v4'];
  private static readonly WHISTLE = ['M6 4v16M18 4v16M4 9v6M20 9v6M6 12h12'];

  readonly colleges: readonly College[] = [
    // Science
    { name: 'Shri Alpesh N. Patel Post Graduate Institute of Science and Research', location: 'Anand, Gujarat', desc: 'Postgraduate science education and research across advanced disciplines.', phone: '(02692) 267404', website: 'https://www.sanppgi.ac.in/', stream: 'science', image: '/assets/images/institutes/alpesh-science.jpg', path: Colleges.CAP },
    { name: 'M. B. Patel Science College', location: 'Anand, Gujarat', desc: 'Excellence in science education and research.', phone: '(02692) 244415', website: 'https://www.mbpatelscience.ac.in/', stream: 'science', image: '/assets/images/institutes/mb-patel-science.jpg', path: Colleges.CAP },
    { name: 'Shri D. N. Institute of Computer Applications', location: 'Anand, Gujarat', desc: 'Industry-focused computer application programmes.', phone: '(02692) 266679', website: 'https://www.dnica.ac.in/', stream: 'science', image: '/assets/images/institutes/dn-computer.jpg', path: Colleges.MONITOR },
    { name: 'M. B. Patel Applied Science College', location: 'Mogri, Gujarat', desc: 'Applied and skill-based science programmes with modern labs.', phone: '(02692) 233000', website: 'https://www.mbpasc.ac.in/', stream: 'science', image: '/assets/images/institutes/mb-patel-science.jpg', path: Colleges.CAP },
    // Management
    { name: 'Shri D. N. Institute of Business Administration', location: 'Anand, Gujarat', desc: 'Quality management education for a dynamic world.', phone: '(02692) 252800', website: 'https://www.dniba.ac.in/', stream: 'management', image: '/assets/images/institutes/dn-business.jpg', path: Colleges.PEOPLE },
    // Commerce
    { name: 'Shri D. N. Institute of P. G. Studies in Commerce', location: 'Anand, Gujarat', desc: 'Postgraduate excellence in commerce education.', phone: '(02692) 252804', website: 'https://www.shridnpgs.ac.in/', stream: 'commerce', image: '/assets/images/institutes/dn-pg-commerce.jpg', path: Colleges.BRIEFCASE },
    { name: 'Shri V. Z. Patel Commerce College', location: 'Anand, Gujarat', desc: 'Shaping future leaders in commerce and business.', phone: '(02692) 252000', website: 'https://www.vzp.ac.in/', stream: 'commerce', image: '/assets/images/institutes/vz-patel-commerce.jpg', path: Colleges.BRIEFCASE },
    // Arts
    { name: 'Shri Bhikhabhai Patel Institute of P. G. Studies & Research in Humanities', location: 'Anand, Gujarat', desc: 'Postgraduate studies and research in humanities and social sciences.', phone: '(02692) 244043', website: 'https://www.bppg.ac.in/', stream: 'arts', image: '/assets/images/institutes/bhikhabhai-pg-studies.jpg', path: Colleges.BOOK },
    { name: 'Shri Bhikhabhai Patel Arts College', location: 'Anand, Gujarat', desc: 'Nurturing creativity, culture and social awareness.', phone: '(02692) 244043', website: 'https://www.bpac.ac.in/', stream: 'arts', image: '/assets/images/institutes/bhikhabhai-arts.jpg', path: Colleges.BOOK },
    // Law
    { name: 'Shri D. N. Institute of Law', location: 'Anand, Gujarat', desc: 'Building strong foundations in legal education and ethics.', phone: '(02692) 243083', website: '', stream: 'law', image: '/assets/images/institutes/dn-law.jpg', path: Colleges.SCALES },
    // Others (Education & Physical Education)
    { name: 'Motibhai Amin P. S. Adhyapan Mandir (D.El.Ed.)', location: 'Mogri, Gujarat', desc: 'Primary teacher education shaping the educators of tomorrow.', phone: '(02692) 233343', website: 'https://www.maptc.ac.in/', stream: 'others', image: '/assets/images/institutes/motibhai-amin.jpg', path: Colleges.CAP },
    { name: 'Shri I. J. Patel B.Ed. College', location: 'Mogri, Gujarat', desc: 'Professional teacher training for secondary education (B.Ed.).', phone: '(02692) 236266', website: 'https://www.ijbed.ac.in/', stream: 'others', image: '/assets/images/institutes/ij-patel-bed.jpg', path: Colleges.CAP },
    { name: 'Shri I. J. Patel M.Ed. College', location: 'Mogri, Gujarat', desc: 'Advanced pedagogy and educational research (M.Ed.).', phone: '(02692) 233064', website: 'https://www.ipmed.ac.in/', stream: 'others', image: '/assets/images/institutes/ij-patel-med.jpg', path: Colleges.CAP },
    { name: 'Shri V. J. Patel College of Physical Education', location: 'Mogri, Gujarat', desc: 'Physical education and sports training for aspiring coaches and teachers.', phone: '(02692) 229062', website: 'https://www.vjbped.ac.in/', stream: 'others', image: '/assets/images/institutes/vj-patel-physical.jpg', path: Colleges.WHISTLE },
  ];

  readonly visible = computed(() => {
    const f = this.active();
    return f === 'all' ? this.colleges : this.colleges.filter((c) => c.stream === f);
  });

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }
}
