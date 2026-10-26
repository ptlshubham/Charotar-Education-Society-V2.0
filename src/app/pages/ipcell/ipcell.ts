import { DOCUMENT, formatDate } from '@angular/common';
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
import { PageHero } from '../../shared/page-hero/page-hero';

type Tab = 'about' | 'policy' | 'utility' | 'design' | 'copyrights' | 'trademarks' | 'forms';

/** A two-tone line icon: navy strokes plus one gold accent (24×24, feather style). */
interface DuoIcon {
  paths: readonly string[];
  accent: readonly string[];
}

@Component({
  selector: 'app-ipcell',
  imports: [Pagination, SortHeader, MediaUrlPipe, PageHero],
  templateUrl: './ipcell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ipcell.scss',
})
export class Ipcell {
  private readonly resources = inject(ResourcesService);
  private readonly document = inject(DOCUMENT);

  readonly tabs: ReadonlyArray<{ id: Tab; label: string }> = [
    { id: 'about', label: 'About IP Cell' },
    { id: 'policy', label: 'Policy' },
    { id: 'utility', label: 'Utility Patent' },
    { id: 'design', label: 'Design Patent' },
    { id: 'copyrights', label: 'Copyrights' },
    { id: 'trademarks', label: 'Trademarks' },
    { id: 'forms', label: 'Forms' },
  ];

  readonly active = signal<Tab>('about');

  select(id: Tab): void {
    this.active.set(id);
  }

  /** "View all IP records": open the first register and bring the tabs into view. */
  showRecords(): void {
    this.select('utility');
    this.document.getElementById('ip-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      desc: 'Details of the CES IP Cell Committee - members and their roles in managing, reviewing and supporting IP activities.',
    },
    {
      title: 'CES NOC Form',
      file: 'pdf/1776246075793.pdf',
      download: 'CES-NOC-Form.pdf',
      desc: 'Used to obtain a No Objection Certificate (NOC) from CES for publishing or filing IP outside the institutional policy.',
    },
  ];

  /** The form the notice asks people to use. */
  readonly disclosureForm = this.forms[0];

  // ─── IP registers (from the DB) ───
  readonly loading = signal(true);
  readonly failed = signal(false);
  private readonly copyrightsLoaded = signal(false);
  private readonly trademarksLoaded = signal(false);
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
      .subscribe((d) => {
        this.copyrightRows.set(Array.isArray(d) ? d : []);
        this.copyrightsLoaded.set(true);
      });

    this.resources
      .getTrademarkData()
      .pipe(catchError(() => of<Trademark[]>([])), takeUntilDestroyed())
      .subscribe((d) => {
        this.trademarkRows.set(Array.isArray(d) ? d : []);
        this.trademarksLoaded.set(true);
      });
  }

  /** Formats a DB date, tolerating null/empty/unparseable values. */
  fmtDate(value: string): string {
    if (!value) return '-';
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : formatDate(d, 'mediumDate', 'en-US');
  }

  readonly protects: readonly string[] = ['Patents', 'Industrial designs', 'Copyrights', 'Trade / service marks'];

  readonly focusAreas: ReadonlyArray<{ title: string; body: string; icon: DuoIcon }> = [
    {
      title: 'Awareness',
      body: 'Create awareness about IPR and its importance.',
      icon: { paths: ['M9 18h6', 'M12 2a7 7 0 0 0-4 12.7c.5.4.9 1 .9 1.6V17h6.2v-.7c0-.6.4-1.2.9-1.6A7 7 0 0 0 12 2z'], accent: ['M10 22h4'] },
    },
    {
      title: 'Support',
      body: 'Assist with patent, design, copyright and trademark filings.',
      icon: {
        paths: ['M15 21v-1a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v1', 'M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
        accent: ['M16.5 4.3a4 4 0 0 1 0 7.4', 'M21 21v-1a5 5 0 0 0-3-4.6'],
      },
    },
    {
      title: 'Guidance',
      body: 'Support IPR documentation and procedures.',
      icon: {
        paths: ['M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z', 'M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z'],
        accent: ['M5 8.5h3.5M5 12h3.5M15.5 8.5H19M15.5 12H19'],
      },
    },
    {
      title: 'Protection',
      body: 'Safeguard innovations and intellectual creations.',
      icon: { paths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'], accent: ['m9 12 2 2 4-4'] },
    },
    {
      title: 'Commercialization',
      body: 'Encourage technology transfer and commercialization.',
      icon: { paths: ['m3 17 6-6 4 4 8-8'], accent: ['M15 7h6v6'] },
    },
    {
      title: 'Collaboration',
      body: 'Connect with industry, startups and institutions.',
      icon: {
        paths: [
          'm11 17 2 2a1 1 0 1 0 3-3',
          'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4',
          'M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3',
        ],
        accent: ['m21 3 1 11h-2', 'M3 4h8'],
      },
    },
  ];

  /** Counts come from the live registers, not hard-coded numbers; a dash until each one has loaded. */
  readonly counts = computed(() => {
    const patentsReady = !this.loading() && !this.failed();
    return [
      { value: patentsReady ? this.utility().length : null, label: 'Utility Patents' },
      { value: patentsReady ? this.design().length : null, label: 'Design Patents' },
      { value: this.trademarksLoaded() ? this.trademarkRows().length : null, label: 'Trademarks' },
      { value: this.copyrightsLoaded() ? this.copyrightRows().length : null, label: 'Copyrights' },
    ];
  });

  /** Read across in two columns, so the order runs row by row. */
  readonly notices: readonly string[] = [
    'Disclose all innovations to the IP Cell.',
    'Use the disclosure form for submissions.',
    'Do not publish your idea before filing.',
    'For queries, contact the IP Cell.',
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
