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
import { PageHero } from '../../shared/page-hero/page-hero';

type Tab = 'about' | 'policy' | 'utility' | 'design' | 'copyrights' | 'trademarks' | 'forms';

@Component({
  selector: 'app-ipcell',
  imports: [Pagination, SortHeader, MediaUrlPipe, PageHero],
  templateUrl: './ipcell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ipcell.scss',
})
export class Ipcell {
  private readonly resources = inject(ResourcesService);

  readonly tabs: ReadonlyArray<{ id: Tab; label: string; icon: string }> = [
    { id: 'about', label: 'About IP Cell', icon: 'account_balance' },
    { id: 'policy', label: 'Policy', icon: 'description' },
    { id: 'utility', label: 'Utility Patent', icon: 'lightbulb' },
    { id: 'design', label: 'Design Patent', icon: 'edit' },
    { id: 'copyrights', label: 'Copyrights', icon: 'copyright' },
    { id: 'trademarks', label: 'Trademarks', icon: 'verified' },
    { id: 'forms', label: 'Forms', icon: 'article' },
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

  readonly focusAreas: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    { title: 'Awareness', body: 'Create awareness about IPR & its importance.', icon: 'lightbulb' },
    { title: 'Support', body: 'Assist in patent, design, copyright & trademark filings.', icon: 'group' },
    { title: 'Guidance', body: 'Provide expert guidance on IPR documentation & procedures.', icon: 'menu_book' },
    { title: 'Protection', body: 'Safeguard innovations and intellectual creations.', icon: 'shield' },
    { title: 'Commercialization', body: 'Encourage technology transfer & commercialization of innovations.', icon: 'trending_up' },
    { title: 'Collaboration', body: 'Promote collaborations with industry, startups & institutions.', icon: 'handshake' },
  ];

  // Counts come from the live registers, not hard-coded numbers.
  readonly counts = computed(() => [
    { value: `${this.utility().length}`, label: 'Utility Patents', icon: 'lightbulb' },
    { value: `${this.design().length}`, label: 'Design Patents', icon: 'verified_user' },
    { value: `${this.trademarkRows().length}`, label: 'Trademarks', icon: 'verified' },
    { value: `${this.copyrightRows().length}`, label: 'Copyrights', icon: 'copyright' },
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
