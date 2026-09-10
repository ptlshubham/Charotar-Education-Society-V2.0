import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageHero } from '../../shared/page-hero/page-hero';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-history-vj',
  imports: [PageHero],
  templateUrl: './history-vj.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './history-vj.scss',
})
export class HistoryVj {
  readonly profile = '/assets/images/home/vitthalbhai.png';
  readonly portrait = '/assets/images/history/life.png';
  readonly historical = '/assets/images/history/prime.jpg';
  readonly freedom = '/assets/images/history/freedom.jpg';
  readonly banner = '/assets/images/hero/vj-patel.jpeg';

  /** Life-sketch paragraphs (verbatim from the legacy CES site). */
  readonly intro: readonly string[] = [
    'Shri Vitthalbhai J. Patel, Vitthal kaka, a serene, unassuming personality who reinforced the foundation of ' +
    'this giant tree called "Charotar Education Society". His pupils still have fond memories of his excellent ' +
    'pedagogical skills, his strong acumen in finding and nurturing talent and a complete dedication towards ' +
    'development of student community in Charotar Region.',
    'He listened to students patiently while being firm in making them obedient and hardworking persons. The ' +
    'students, parents, colleagues and the members of society respected him for his active listening abilities, ' +
    'complete dedication towards uplifting members of society and creating an ecosystem where fun and duties are ' +
    'combined in making students a thorough professional.',
  ];

  readonly earlyLife: readonly string[] = [
    'Born on the 13th January, 1919 in Pij town of Nadiad district, Vitthalbhai J Patel was one of the finest teachers our country has produced.',
    'His primary and secondary education was respectively completed at Pij and at A J High School, Vaso.',
    'He completed higher education from Mumbai University, Vadodara. He was an Educational professional and an Exercise Specialist, STC.',
  ];

  readonly freedomPoints: readonly string[] = [
    "He joined Mahatma Gandhi's Bharat Chhodo Andolan (Quit India Movement) in 1942.",
    'He played active role as freedom fighter while becoming member of the group pivotal in looting and burning post and money order of British government.',
    'Arrested and served the sentence at Chhmas Jail, Sabarmati Jail, Ahmedabad in 1943.',
  ];

  readonly teaching: readonly string[] = [
    'Joined D N High School, Charotar Education Society in 1944 as a teacher.',
    'In 1945, he was promoted as Teacher and warden of Hostel along with being made a Physical Education Teacher.',
    'In 1950 he volunteers to join CES day to day affairs.',
    'Posted as a teacher at Bright School in Rochester city of USA for a period of one year on Indo-US Fulbright Teacher Exchange Program from 1964 to 1965. He was very much admired and respected by American students and faculties while teaching them in English.',
    'Awarded with coveted "Best Teacher" award by Government of India for the year 1966-67.',
    'In 1968, he took the reign of D N High School by becoming Principal.',
    'He was honorary principal for commerce, finance and science subjects in higher secondary section of D N high school from 1977 to 1979.',
    'From 1979 to 1988, Vitthal Kaka served Charotar Vidya Mandal as Honorary Secretary.',
    'Served as Secretary at Sardar Patel Education Trust, Anand from 1979 to 1992.',
    'He also served as President of Pij Kelavani Mandal in 1989.',
    'In 1986, he served as Chairman of Sardar Patel Seva Samaj, Nadiad.',
    'During 1991-92 he served as Professor, Bhaikaka Chair in Sardar Patel University, Vallabhvidyanagar.',
    'He also held distinction of member of advisory committee at Pramukh Swami Medical College, Karamsad.',
    'From 1944 to 1979 encompassing a period of 35 years, Vitthal Kaka untiring served Charotar Education Society in various capacities including teacher, hostel warden, member of governing bodies etc. Above all, he was doing the most pious work of shaping lives of students.',
    'He was also pioneer in spreading the wings of quality school education in Ashi, Radhu, Nayaka, Ajarpura, Pij and Bharoda town of Charotar region.',
  ];

  /** "So, Vitthalbhai J Patel was…" — one card each. */
  readonly traits: ReadonlyArray<{ text: string; icon: string }> = [
    { text: 'Teacher, Hostel warden, Principal, volunteer, secretary and member of governing body at Charotar Education Society during the course of 35 years of service to this prestigious organization.', icon: 'group' },
    { text: 'A staunch follower of Gandhian Philosophy, an activist, a freedom fighter and a member of Quit India movement.', icon: 'flag' },
    { text: 'The one who committed to simplicity, discipline and service his entire working and retired life.', icon: 'shield' },
    { text: 'A teacher par excellence and an admired administrator of Charotar region.', icon: 'school' },
    { text: 'A stream of karmathata, and saatvikta.', icon: 'self_improvement' },
    { text: 'A priest of honesty and a fatherly figure for students.', icon: 'tune' },
    { text: 'A visionary and dynamic administrator.', icon: 'visibility' },
    { text: 'Transparent, orator and epitome of manner.', icon: 'campaign' },
    { text: 'An ardent scholar and a complete believer of humanity.', icon: 'menu_book' },
  ];

  // ── Tribute publication PDF viewer ("નમન… — ભૂતપૂર્વ શિષ્યગણની ગુરુવંદના") ──
  private readonly sanitizer = inject(DomSanitizer);

  /** Same tribute PDF the old site served from the backend under /pdf. */
  readonly pdfUrl = `${environment.apiUrl.replace(/\/+$/, '')}/pdf/1742536436103.pdf`;

  readonly pdfOpen = signal(false);
  /** Blob URL of the fetched PDF (same-origin, so it bypasses X-Frame-Options). */
  readonly pdfSrc = signal<SafeResourceUrl | null>(null);
  readonly pdfLoading = signal(false);
  readonly pdfError = signal(false);
  private objectUrl: string | null = null;

  /**
   * Fetch the PDF and view it via a blob URL — a direct cross-origin PDF iframe is
   * blocked by X-Frame-Options, but a same-origin blob renders natively. Falls back
   * to "Open in New Tab" if the fetch is blocked.
   */
  async openPdf(): Promise<void> {
    this.revoke();
    this.pdfOpen.set(true);
    this.pdfSrc.set(null);
    this.pdfError.set(false);
    this.pdfLoading.set(true);
    try {
      const res = await fetch(this.pdfUrl);
      if (!res.ok) throw new Error('load failed');
      const blob = await res.blob();
      this.objectUrl = URL.createObjectURL(blob);
      this.pdfSrc.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
    } catch {
      this.pdfError.set(true);
    } finally {
      this.pdfLoading.set(false);
    }
  }

  closePdf(): void {
    this.revoke();
    this.pdfOpen.set(false);
    this.pdfSrc.set(null);
    this.pdfError.set(false);
    this.pdfLoading.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePdf();
  }

  private revoke(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}

