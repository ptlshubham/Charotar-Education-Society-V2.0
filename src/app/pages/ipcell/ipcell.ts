import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
import { Copyright, Patent, Trademark } from '../../shared/models/models';
import { Paginator } from '../../shared/pagination/paginator';
import { Pagination } from '../../shared/pagination/pagination';
import { Sorter } from '../../shared/sorting/sorter';
import { SortHeader } from '../../shared/sorting/sort-header';
import { MediaUrlPipe } from '../../shared/media-url.pipe';

type Tab = 'about' | 'policy' | 'utility' | 'design' | 'copyrights' | 'trademarks' | 'forms';

@Component({
  selector: 'app-ipcell',
  imports: [Pagination, SortHeader, MediaUrlPipe],
  templateUrl: './ipcell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ipcell.scss',
})
export class Ipcell {
  private readonly resources = inject(ResourcesService);

  readonly tabs: ReadonlyArray<{ id: Tab; label: string; path: string[] }> = [
    { id: 'about', label: 'About IP Cell', path: ['m3 10 9-6 9 6', 'M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18'] },
    { id: 'policy', label: 'Policy', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'] },
    { id: 'utility', label: 'Utility Patent', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { id: 'design', label: 'Design Patent', path: ['m15 5 4 4', 'M13 7 3 17v4h4L17 11z', 'm16 4 4 4'] },
    { id: 'copyrights', label: 'Copyrights', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M14.8 9.5a3.5 3.5 0 1 0 0 5'] },
    { id: 'trademarks', label: 'Trademarks', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M7 9h10M12 9v7'] },
    { id: 'forms', label: 'Forms', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8M8 17h5'] },
  ];

  readonly active = signal<Tab>('about');

  select(id: Tab): void {
    this.active.set(id);
  }

  // ─── PDFs (served from the API host under /pdf; resolved by the mediaUrl pipe) ───
  readonly policyPdf = 'pdf/1739950026896.pdf';
  readonly forms: ReadonlyArray<{ title: string; file: string; download: string; desc: string }> = [
    {
      title: 'CES Invention Disclosure Form',
      file: 'pdf/1776245989329.pdf',
      download: 'CES-Invention-Disclosure-Form.pdf',
      desc: 'Used to disclose inventions and innovative ideas to the CES IP Cell for evaluation and potential protection.',
    },
    {
      title: 'CES IP Cell Committee',
      file: 'pdf/1776246039546.pdf',
      download: 'CES-IP-Cell-Committee.pdf',
      desc: 'Details of the CES IP Cell Committee — members and their roles in managing, reviewing and supporting IP activities.',
    },
    {
      title: 'CES NOC Form',
      file: 'pdf/1776246075793.pdf',
      download: 'CES-NOC-Form.pdf',
      desc: 'Used to obtain a No Objection Certificate (NOC) from CES for publishing or filing IP outside the institutional policy.',
    },
  ];

  // ─── IP registers (from the DB) ───
  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly patents = signal<readonly Patent[]>([]);
  private readonly copyrightRows = signal<readonly Copyright[]>([]);
  private readonly trademarkRows = signal<readonly Trademark[]>([]);

  readonly utility = computed(() => this.patents().filter((p) => p.purpose === 'Utility Patent'));
  readonly design = computed(() => this.patents().filter((p) => p.purpose === 'Design Patent'));

  // One sorter + paginator per register (global, reusable).
  readonly utilitySorter = new Sorter(this.utility);
  readonly utilityPager = new Paginator(this.utilitySorter.sorted, 25);
  readonly designSorter = new Sorter(this.design);
  readonly designPager = new Paginator(this.designSorter.sorted, 25);
  readonly copyrightSorter = new Sorter(this.copyrightRows);
  readonly copyrightPager = new Paginator(this.copyrightSorter.sorted, 25);
  readonly trademarkSorter = new Sorter(this.trademarkRows);
  readonly trademarkPager = new Paginator(this.trademarkSorter.sorted, 25);

  /** Utility & Design patents share one table; pick the active register. */
  readonly patentView = computed(() =>
    this.active() === 'design'
      ? { title: 'Design Patents', sorter: this.designSorter, pager: this.designPager }
      : { title: 'Utility Patents', sorter: this.utilitySorter, pager: this.utilityPager },
  );

  constructor() {
    this.resources
      .getPatentData()
      .pipe(
        catchError(() => {
          this.failed.set(true);
          return of<Patent[]>([]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe((d) => {
        this.patents.set(Array.isArray(d) ? d : []);
        this.loading.set(false);
      });

    this.resources
      .getCopyrightData()
      .pipe(catchError(() => of<Copyright[]>([])), takeUntilDestroyed())
      .subscribe((d) => this.copyrightRows.set(Array.isArray(d) ? d : []));

    this.resources
      .getTrademarkData()
      .pipe(catchError(() => of<Trademark[]>([])), takeUntilDestroyed())
      .subscribe((d) => this.trademarkRows.set(Array.isArray(d) ? d : []));
  }

  /** Formats a DB date, tolerating null/empty/unparseable values. */
  fmtDate(value: string): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }

  readonly focusAreas: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Awareness', body: 'Create awareness about IPR & its importance.', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { title: 'Support', body: 'Assist in patent, design, copyright & trademark filings.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { title: 'Guidance', body: 'Provide expert guidance on IPR documentation & procedures.', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { title: 'Protection', body: 'Safeguard innovations and intellectual creations.', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
    { title: 'Commercialization', body: 'Encourage technology transfer & commercialization of innovations.', path: ['M3 3v18h18', 'm19 9-5 5-4-4-4 4'] },
    { title: 'Collaboration', body: 'Promote collaborations with industry, startups & institutions.', path: ['m11 17 2 2a1 1 0 1 0 3-3', 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2.8 2.8 0 0 1 4 0l4 4', 'M3 7l4-4 4 4'] },
  ];

  // Counts come from the live registers, not hard-coded numbers.
  readonly counts = computed(() => [
    { value: `${this.utility().length}`, label: 'Utility Patents', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { value: `${this.design().length}`, label: 'Design Patents', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { value: `${this.trademarkRows().length}`, label: 'Trademarks', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M7 9h10M12 9v7'] },
    { value: `${this.copyrightRows().length}`, label: 'Copyrights', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M14.8 9.5a3.5 3.5 0 1 0 0 5'] },
  ]);

  readonly notices: readonly string[] = [
    'All innovations must be disclosed to IP Cell.',
    'Do not publish your idea before filing.',
    'Use the disclosure forms for submissions.',
    'For any queries, contact the IP Cell.',
  ];

  // ─── Static "About" content, carried over from the legacy site ───
  readonly objectives: ReadonlyArray<{ title: string; body: string }> = [
    { title: 'Encourage Innovation & Creativity', body: 'Foster a culture of research, innovation, and creative expression across disciplines.' },
    { title: 'IP Protection & Management', body: 'Provide guidance on securing patents, industrial designs, copyrights, and trademarks while offering the option to keep novel works in the public domain.' },
    { title: 'Fair Ownership & Revenue Sharing', body: 'Define a transparent system for ownership rights, control, and distribution of revenues generated from intellectual property owned by CES.' },
    { title: 'Technology Transfer & Commercialization', body: 'Facilitate the utilization of intellectual property for societal benefit through licensing, startups, or industry collaborations.' },
    { title: 'Legal Compliance & Ethical Standards', body: 'Ensure adherence to national and international IP laws and ethical research practices.' },
  ];

  readonly scope: readonly string[] = [
    'This policy applies to all academic and research institutions under Charotar Education Society.',
    'Covers faculty, students, project staff, supporting staff, and visitors involved in research, innovation, and creative activities.',
    'Governs all forms of intellectual property including patents, copyrights, industrial designs, and trademarks developed under CES.',
  ];

  readonly disclosureSteps: ReadonlyArray<{ title: string; body: string }> = [
    { title: 'Idea Collection', body: 'The institute gathers innovative ideas and inventions from staff and students.' },
    { title: 'Form Submission', body: 'The CES Invention Disclosure Form is filled out at the institute level, signed, and verified by the Principal.' },
    { title: 'Committee Presentation', body: 'The completed form is presented in the monthly meeting of the CES IP Cell Committee for review.' },
    { title: 'Committee Remarks', body: 'The CES IP Cell Committee provides written remarks on the submission.' },
    { title: 'Final Approval', body: 'The Chairperson of the CES IP Cell Committee grants the final approval.' },
  ];
}
