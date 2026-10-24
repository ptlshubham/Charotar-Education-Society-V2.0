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

  /** Life-sketch, from the legacy CES site and the Society's Gujarati life-sketch. */
  readonly intro: readonly string[] = [
    'Shri Vitthalbhai J. Patel, Vitthal Kaka to generations of students, was a quiet, modest man who ' +
    'strengthened the roots of Charotar Education Society. His pupils still remember how well he taught, how ' +
    'quickly he spotted talent, and how much of his life he gave to the students of Charotar.',
    'He listened patiently, but he was firm. He expected students to work hard and behave well, and he made ' +
    'school a place where fun and duty went together. Students, parents and colleagues respected him for it.',
  ];

  readonly earlyLife: readonly string[] = [
    'Born on 13 January 1919 in Pij, in Nadiad taluka, he grew up to become one of the finest teachers the region has known.',
    'He went to primary school in Pij and to secondary school at A.J. High School, Vaso.',
    'He studied further in Vadodara under the University of Bombay, and qualified as a physical education teacher (Vyayam Visharad) and with an S.T.C. teaching certificate.',
  ];

  readonly freedomPoints: readonly string[] = [
    "He answered Gandhiji's call to Quit India in 1942.",
    'He worked in an underground squad that seized government mail and money orders and set post on fire.',
    'He was arrested in 1943 and spent six months in Sabarmati Jail, Ahmedabad.',
  ];

  readonly teaching: readonly string[] = [
    '1944: joined D.N. High School as a teacher.',
    '1945: also became a hostel warden and the physical education teacher.',
    '1950: became a volunteer of the Society, one of the people who run it.',
    '1964-65: taught American students in English for a year at Bright School, Rochester, USA, on the Indo-US Fulbright Teacher Exchange. He was much admired there.',
    '1966-67: received the Government of India award for the best teacher.',
    '1968: became Principal of D.N. High School.',
    '1977-79: set up the commerce, arts and science streams of the D.N. higher secondary section and was their honorary principal.',
    '1979-88: Honorary Secretary, Charutar Vidya Mandal, Vallabh Vidyanagar.',
    '1979-92: Secretary, Sardar Patel Education Trust, Anand.',
    'From 1986: Chairman, Sardar Patel Seva Samaj, Nadiad.',
    'From 1989: President, Pij Kelavani Mandal.',
    '1991-92: Project officer for the Bhaikaka Chair at Sardar Patel University.',
    'Member of the advisory committee of Pramukh Swami Medical College, Karamsad.',
    'In all he served CES for 35 years, from 1944 to 1979: teacher, chief hostel warden, headmaster, principal, secretary and an active member of the governing body. Above everything, he shaped the lives of his students.',
    'He also helped start and guide high schools in Ashi, Radhu, Nayaka, Ajarpura, Pij and Bharoda.',
  ];

  /** "Remembering Vitthalbhai J. Patel" - the Society's nine words about him, in three themes. */
  readonly traitGroups: ReadonlyArray<{ title: string; traits: readonly string[] }> = [
    {
      title: 'An educator',
      traits: [
        'Teacher, hostel warden, principal, volunteer, secretary and governing-body member at CES across 35 years.',
        "One of Charotar's finest teachers and ablest administrators.",
        'A brilliant scholar and a true humanitarian.',
      ],
    },
    {
      title: 'A life of service',
      traits: [
        'A committed Gandhian and a Quit India freedom fighter.',
        'A model hostel warden who lived by service, simplicity and discipline.',
        'Pure-hearted, and never stopped working.',
      ],
    },
    {
      title: 'A guiding presence',
      traits: [
        'Honest to the core, and a father figure to his students.',
        'A dynamic administrator who looked far ahead.',
        'A clear, strong and courteous speaker.',
      ],
    },
  ];

  // ── Tribute publication PDF viewer ("નમન… - ભૂતપૂર્વ શિષ્યગણની ગુરુવંદના") ──
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
   * Fetch the PDF and view it via a blob URL - a direct cross-origin PDF iframe is
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

