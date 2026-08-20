import { ChangeDetectionStrategy, Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../shared/pagination/paginator';
import { Pagination } from '../../shared/pagination/pagination';
import { MediaUrlPipe } from '../../shared/media-url.pipe';
import { PLACEHOLDER } from '../../shared/placeholder-images';
import { environment } from '../../../environments/environment';

interface DocLink {
  label: string;
  /** Relative media path; resolved to the API host by the mediaUrl pipe. */
  file: string;
}

interface InstituteLink {
  name: string;
  url: string;
}

interface Vacancy {
  title?: string;
  institutes?: readonly InstituteLink[];
  images?: readonly string[];
  closed: boolean;
  isNew?: boolean;
  advertisement: readonly DocLink[];
  instructions: readonly DocLink[];
  requirement: readonly DocLink[];
  result: readonly DocLink[];
}

interface Notice {
  title: string;
  date: string;
  file: string;
}

@Component({
  selector: 'app-careers',
  imports: [NgTemplateOutlet, RouterLink, Pagination, MediaUrlPipe],
  templateUrl: './careers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './careers.scss',
})
export class Careers {
  readonly banner = PLACEHOLDER.about.hero;

  /** Date the advertisement table was last refreshed on the legacy site. */
  readonly updatedOn = '24-06-2026';

  readonly values: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Purpose Driven', body: 'Make a meaningful impact through quality education.', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v8M8 12h8'] },
    { title: 'Growth & Learning', body: 'Continuous opportunities for personal and professional growth.', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { title: 'Inclusive Culture', body: 'A collaborative and respectful environment for all.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
  ];

  // ── Advertisement table (vacancies), carried over verbatim from the legacy site ──
  readonly vacancies: readonly Vacancy[] = [
    {
      title: 'Invites applications for the Teaching position of Principal, Professor, Associate Professor, Assistant Professor and Non-Teaching Positions of Lab Assistant in Self-Finance Institute run by the Charotar Education Society, Anand and affiliated to Sardar Patel University, Vallabh Vidyanagar.',
      closed: false, isNew: true,
      advertisement: [{ label: 'Advertisement 1', file: 'pdf/1782283727091.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      title: 'Invites applications for the Teaching position of Principal, Associate Professor, Assistant Professor in Self-Finance Institute run by the Charotar Education Society, Anand.',
      closed: false, isNew: true,
      advertisement: [{ label: 'Advertisement 2', file: 'pdf/1782283789560.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      title: 'Swami Dayanand Saraswati Vocational Training Center (Managed by Charotar Education Society, Anand)',
      closed: true,
      advertisement: [{ label: 'English Language Trainer', file: 'pdf/1780725742654.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      title: 'Invites applications for the post of Jr Clerk, Sr Clerk, Head Clerk, Lab Assi & Store Keeper for the following Grant-In-Aid Colleges managed by Charotar Education Society:',
      institutes: [
        { name: 'M B Patel Science College [www.mbpatelscience.ac.in]', url: 'https://www.mbpatelscience.ac.in' },
        { name: 'Shri Bhikhabhai Patel Arts College, Anand [www.bpac.ac.in]', url: 'https://www.bpac.ac.in' },
      ],
      closed: true,
      advertisement: [{ label: 'Advertisement Class - III', file: 'pdf/1759936575424.pdf' }],
      instructions: [
        { label: 'Final Answer Key for Jr Clerk Main Exam', file: 'pdf/1772442984839.pdf' },
        { label: 'જુ.ક્લાર્કની મુખ્ય પરીક્ષાની પ્રોવિઝનલ આન્સર કી પ્રસિદ્ધ કરવા બાબતની અગત્યની સુચના', file: 'pdf/1771592078033.pdf' },
        { label: 'જુનિયર, સિનીયર અને હેડ ક્લાર્કની મુખ્ય પરીક્ષાની તારીખ જાહેર કરવા બાબત', file: 'pdf/1770639193747.pdf' },
        { label: 'Final Answer Key Update', file: 'pdf/1768116739490.pdf' },
        { label: 'Answer Key Date Change', file: 'pdf/1767505990133.pdf' },
        { label: 'લાયક અને ગેરલાયક ઉમેદવાર ની સંખ્યા', file: 'pdf/1766755329385.pdf' },
        { label: 'Exam Date and Time', file: 'pdf/1766755358912.pdf' },
        { label: 'Exam Pattern Change', file: 'pdf/1766384181166.pdf' },
        { label: 'Exam Pattern All Post', file: 'pdf/1765427102264.pdf' },
        { label: 'Instructions', file: 'pdf/1759936654058.pdf' },
        { label: 'Application for the Non Teaching Post', file: 'pdf/1759936786839.pdf' },
        { label: 'Application for the Non Teaching Post (DOCX)', file: 'pdf/1759936861468.docx' },
      ],
      requirement: [
        { label: 'BPAC NOC for Jr Clerk', file: 'pdf/1759936989004.pdf' },
        { label: 'MBPSC NOC for Jr Clerk (Divyang)', file: 'pdf/1759937207853.pdf' },
        { label: 'MBPSC NOC for Jr Clerk, Sr Clerk, Head Clerk, Lab Assi & Store Keeper', file: 'pdf/1759937272807.pdf' },
      ],
      result: [
        { label: 'BPAC જુનિયર ક્લાર્કની મુખ્ય પરીક્ષાનું પરિણામ', file: 'pdf/1772866127991.pdf' },
        { label: 'MBPS જુનિયર-સિનીયર-હેડ ક્લાર્કની મુખ્ય પરીક્ષાનું પરિણામ', file: 'pdf/1772866145674.pdf' },
      ],
    },
    {
      title: 'Charotar Education Society, Anand — Shri D N Institute of Paramedical Science, (Self Finance) Mogri',
      images: ['/assets/images/careers/a.jpg'],
      closed: true,
      advertisement: [], instructions: [], requirement: [], result: [],
    },
    {
      title: 'Invites applications for the post of Principal for the following Grant-In-Aid Colleges managed by Charotar Education Society',
      institutes: [{ name: 'M B Patel Science College [www.mbpatelscience.ac.in]', url: 'https://www.mbpatelscience.ac.in' }],
      closed: true,
      advertisement: [
        { label: 'CES Principal ads_Eng', file: 'pdf/1755073778571.pdf' },
        { label: 'CES Principal ads_Guj', file: 'pdf/1755073824217.pdf' },
        { label: 'NOC M B Patel Science College', file: 'pdf/1755073749297.pdf' },
      ],
      instructions: [{ label: 'General Instruction', file: 'pdf/1755073869899.pdf' }],
      requirement: [
        { label: '24-5-21 Education Department Govt Guj Tharav', file: 'pdf/1755073917014.pdf' },
        { label: 'UGC Regulations 2018 Appendix II Table 2', file: 'pdf/1755073890321.pdf' },
      ],
      result: [],
    },
    {
      title: 'શૈક્ષણિક સંસ્થા માટે સ્ટાફ જોઈએ છે',
      closed: true,
      advertisement: [{ label: 'Advertisement', file: 'pdf/1747895305474.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      title: 'શ્રી વિ.જે. પટેલ કોલેજ ઓફ ફિઝિકલ એજ્યુકેશન (સ્વનિર્ભર), મોગરી શૈક્ષણિક સંસ્થા માટે સ્ટાફ જોઈએ છે',
      closed: true,
      advertisement: [{ label: 'Advertisement', file: 'pdf/1747895332909.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      title: 'Invites applications for the Teaching position of Principal, Professor, Associate Professor, Assistant Professor and Non-Teaching Positions of Lab Assistant, Clerk, Peon in Self-Finance Institute run by the Charotar Education Society, Anand and affiliated to Sardar Patel University, Vallabh Vidyanagar.',
      institutes: [
        { name: 'Shri Alpesh N. Patel Postgraduate Institute of Science & Research, Anand (Self Finance)', url: 'https://sanppgi.ac.in' },
        { name: 'Shri Bhikhabhai Patel Inst. Of PG Studies & Research in Humanities, Anand (Self Finance)', url: 'https://bppg.ac.in/' },
        { name: 'Shri D. N. Institute of P.G. Studies in Commerce (Self Finance)', url: 'https://www.shridnpgs.ac.in/' },
        { name: 'Shri D. N. Institute of Business Administration, Anand (Self Finance)', url: 'https://dniba.ac.in/' },
        { name: 'Shri V. Z. Patel Commerce College, Anand (Self Finance)', url: 'https://www.vzcom.ac.in' },
        { name: 'Shri I. J. Patel M.Ed. Course, Mogri', url: 'https://www.ijpmed.ac.in' },
        { name: 'M B Patel Applied Science College, Mogri', url: 'https://mbpasc.ac.in' },
        { name: 'M B Patel Science College (Self Finance)', url: 'https://www.mbpatelscience.ac.in' },
        { name: 'Shri Bhikhabhai Patel Arts College, Anand', url: 'https://www.bpac.ac.in' },
      ],
      closed: true,
      advertisement: [{ label: '21-05-2025', file: 'pdf/1747822620104.pdf' }],
      instructions: [], requirement: [], result: [],
    },
    {
      images: ['/assets/images/careers/bcom.jpg', '/assets/images/careers/i-1.jpg'],
      closed: true,
      advertisement: [], instructions: [], requirement: [], result: [],
    },
    {
      images: ['/assets/images/careers/voc-eng.jpg', '/assets/images/careers/voc-guj.jpg'],
      closed: true,
      advertisement: [], instructions: [], requirement: [], result: [],
    },
    {
      title: 'Invites applications for the post of Principal for the following Grant-In-Aid Colleges managed by Charotar Education Society',
      institutes: [
        { name: 'M B Patel Science College [www.mbpatelscience.ac.in]', url: 'https://www.mbpatelscience.ac.in' },
        { name: 'Bhikhabhai Patel Arts College [www.bpac.ac.in]', url: 'https://www.bpac.ac.in' },
      ],
      closed: true,
      advertisement: [
        { label: 'CES Principal ads_Eng', file: 'pdf/1742536685311.pdf' },
        { label: 'CES Principal ads_Guj', file: 'pdf/1742536746378.pdf' },
        { label: 'NOC M B Patel Science College', file: 'pdf/1742536795269.pdf' },
        { label: 'NOC Bhikhabhai Patel Arts College', file: 'pdf/1742536834080.pdf' },
      ],
      instructions: [{ label: 'Instruction', file: 'pdf/1742536878881.pdf' }],
      requirement: [
        { label: '24-5-21 Education Department Govt Guj Tharav', file: 'pdf/1742536945235.pdf' },
        { label: 'UGC-Regulation - 2018 Appendix II Table 2', file: 'pdf/1742536965103.pdf' },
      ],
      result: [],
    },
    {
      images: ['/assets/images/careers/carrer.jpg'],
      closed: true,
      advertisement: [], instructions: [], requirement: [], result: [],
    },
  ];

  // ── Recruitment Notice table (document archive) ──
  readonly noticeInstitutes: readonly InstituteLink[] = [
    { name: 'M B Patel Science College [www.mbpatelscience.ac.in]', url: 'https://www.mbpatelscience.ac.in' },
    { name: 'Shri Bhikhabhai Patel Arts College, Anand [www.bpac.ac.in]', url: 'https://www.bpac.ac.in' },
  ];

  readonly notices: readonly Notice[] = [
    { title: 'MBPS જુનિયર-સિનીયર-હેડ ક્લાર્કની મુખ્ય પરીક્ષાનું પરિણામ', date: 'Mar 7, 2026', file: 'pdf/1772866145674.pdf' },
    { title: 'BPAC જુનિયર ક્લાર્કની મુખ્ય પરીક્ષાનું પરિણામ', date: 'Mar 7, 2026', file: 'pdf/1772866127991.pdf' },
    { title: 'Final Answer Key for Jr Clerk Main Exam', date: 'Mar 2, 2026', file: 'pdf/1772442984839.pdf' },
    { title: 'જુ.ક્લાર્કની મુખ્ય પરીક્ષાની પ્રોવિઝનલ આન્સર કી પ્રસિદ્ધ કરવા બાબતની અગત્યની સુચના', date: 'Feb 20, 2026', file: 'pdf/1771592078033.pdf' },
    { title: 'જુનિયર, સિનીયર અને હેડ ક્લાર્કની મુખ્ય પરીક્ષાની તારીખ જાહેર કરવા બાબત', date: 'Feb 9, 2026', file: 'pdf/1770639193747.pdf' },
    { title: 'BPAC જુનિયર ક્લાર્કની મુખ્ય પરીક્ષા માટે લાયક ઉમેદવારનું લીસ્ટ', date: 'Jan 13, 2026', file: 'pdf/1768319959960.pdf' },
    { title: 'MBPS લેબ આસિસ્ટન્ટ અને સ્ટોર કીપર માટે પસંદગી પામેલ ઉમેદવારનું લીસ્ટ', date: 'Jan 13, 2026', file: 'pdf/1768319934663.pdf' },
    { title: 'MBPS જુનિયર-સિનીયર-હેડ ક્લાર્કની મુખ્ય પરીક્ષા માટે લાયક ઉમેદવારનું લીસ્ટ', date: 'Jan 13, 2026', file: 'pdf/1768319904418.pdf' },
    { title: 'Final Answer Key Update', date: 'Jan 11, 2026', file: 'pdf/1768116739490.pdf' },
    { title: 'Provisional Answer Key Date Change', date: 'Jan 4, 2026', file: 'pdf/1767505990133.pdf' },
    { title: 'MBPS Store Keeper Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272606879.pdf' },
    { title: 'MBPS LA Microbiology Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272583713.pdf' },
    { title: 'MBPS LA Chemistry Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272561786.pdf' },
    { title: 'MBPS LA Biochemistry Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272533354.pdf' },
    { title: 'MBPS JC SC HC Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272509317.pdf' },
    { title: 'BPAC JC Provisional Answer Key', date: 'Jan 1, 2026', file: 'pdf/1767272495709.pdf' },
    { title: 'First Exam Date and Time (પ્રાથમિક પરીક્ષાની તારીખ અને સમય)', date: 'Dec 26, 2025', file: 'pdf/1766755358912.pdf' },
    { title: 'લાયક અને ગેરલાયક ઉમેદવાર ની સંખ્યા', date: 'Dec 26, 2025', file: 'pdf/1766755329385.pdf' },
    { title: 'Exam Pattern Changing for LA & SK Post for MBPS', date: 'Dec 19, 2025', file: 'pdf/1766384181166.pdf' },
    { title: 'Exam Pattern All Post', date: 'Dec 11, 2025', file: 'pdf/1765427102264.pdf' },
    { title: 'MBPSC NOC for Jr Clerk, Sr Clerk, Head Clerk, Lab Assi & Store Keeper', date: 'Oct 9, 2025', file: 'pdf/1759937272807.pdf' },
    { title: 'MBPSC NOC for Jr Clerk (Divyang)', date: 'Oct 9, 2025', file: 'pdf/1759937207853.pdf' },
    { title: 'BPAC NOC for Jr Clerk', date: 'Oct 9, 2025', file: 'pdf/1759936989004.pdf' },
    { title: 'Application for the Non Teaching Post (DOCX)', date: 'Oct 9, 2025', file: 'pdf/1759936861468.docx' },
    { title: 'Application for the Non Teaching Post', date: 'Oct 9, 2025', file: 'pdf/1759936786839.pdf' },
    { title: 'Instructions', date: 'Oct 9, 2025', file: 'pdf/1759936654058.pdf' },
    { title: 'Advertisement in News Paper - Advertisement Class - III', date: 'Oct 9, 2025', file: 'pdf/1759936575424.pdf' },
  ];

  readonly noticePager = new Paginator(signal(this.notices), 10);

  private readonly platformId = inject(PLATFORM_ID);

  // ── Image lightbox ──
  /** Source of the image shown in the lightbox, or null when closed. */
  readonly lightboxImage = signal<string | null>(null);

  openImage(src: string): void {
    this.lightboxImage.set(src);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeLightbox();
  }

  // ── File download ──
  /**
   * Force a file to download rather than open in the browser's PDF viewer.
   * Fetches the blob and saves it; falls back to opening in a new tab if the
   * request fails (e.g. the media host blocks cross-origin reads).
   */
  async download(event: Event, file: string, label: string): Promise<void> {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const url = this.resolve(file);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('request failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = this.fileName(label, file);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }

  /** Mirrors MediaUrlPipe: prefix a relative media path with the API host. */
  private resolve(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  /** Build a friendly download filename from the link label + file extension. */
  private fileName(label: string, file: string): string {
    const ext = file.split('.').pop() || 'pdf';
    const base = (label || 'document').replace(/[\\/:*?"<>|\n\r]+/g, ' ').trim().slice(0, 80) || 'document';
    return `${base}.${ext}`;
  }
}
