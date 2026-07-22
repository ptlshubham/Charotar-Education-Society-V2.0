import { Component, ChangeDetectionStrategy } from '@angular/core';

/** A single inline run within a change bullet. */
interface Segment {
  text: string;
  /** 'bold' -> highlighted keyword, 'preview' -> underlined Preview link. */
  type?: 'bold' | 'preview';
}

interface ReleaseEntry {
  version: string;
  date: string;
  name: string;
  tag: string;
  changes: Segment[][];
}

@Component({
  selector: 'app-change-log',
  imports: [],
  templateUrl: './change-log.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './change-log.scss',
})
export class ChangeLog {
  private readonly summerRelease: Segment[][] = [
    [
      { text: 'Added:', type: 'bold' },
      { text: ' New ' },
      { text: 'content calendar', type: 'bold' },
      { text: ' with drag-and-drop scheduling across every connected channel. - ' },
      { text: 'Preview', type: 'preview' },
    ],
    [
      { text: 'Added:', type: 'bold' },
      { text: ' The ' },
      { text: 'client portal', type: 'bold' },
      { text: ' now shows live project progress without a separate login. - ' },
      { text: 'Preview', type: 'preview' },
    ],
    [
      { text: 'Improved:', type: 'bold' },
      { text: ' Faster load times across the CRM pipeline and dashboard views.' },
    ],
  ];

  private readonly payrollRelease: Segment[][] = [
    [
      { text: 'Added:', type: 'bold' },
      { text: ' Automated ' },
      { text: 'payroll runs', type: 'bold' },
      { text: ' with configurable pay cycles and one-click payslip export. - ' },
      { text: 'Preview', type: 'preview' },
    ],
    [
      { text: 'Added:', type: 'bold' },
      { text: ' Role-based ' },
      { text: 'permissions', type: 'bold' },
      { text: ' now support per-module access for every team member.' },
    ],
    [
      { text: 'Fixed:', type: 'bold' },
      { text: ' Attendance summaries now sync correctly across multiple branches.' },
    ],
  ];

  private readonly analyticsRelease: Segment[][] = [
    [
      { text: 'Added:', type: 'bold' },
      { text: ' ' },
      { text: 'SEO analysis', type: 'bold' },
      { text: ' with AI-assisted recommendations in the reports module. - ' },
      { text: 'Preview', type: 'preview' },
    ],
    [
      { text: 'Added:', type: 'bold' },
      { text: ' Export any ' },
      { text: 'report', type: 'bold' },
      { text: ' to PDF or CSV in a single click.' },
    ],
    [
      { text: 'Improved:', type: 'bold' },
      { text: ' Redesigned invoicing screen with saved templates and automatic reminders.' },
    ],
  ];

  readonly releases: ReleaseEntry[] = [
    {
      version: 'v2.4.0',
      date: '10 July, 2026',
      name: 'Summer Release',
      tag: 'Features',
      changes: this.summerRelease,
    },
    {
      version: 'v2.3.0',
      date: '18 June, 2026',
      name: 'Payroll & HR Update',
      tag: 'Improvements',
      changes: this.payrollRelease,
    },
    {
      version: 'v2.2.0',
      date: '22 May, 2026',
      name: 'Analytics Release',
      tag: 'Features',
      changes: this.analyticsRelease,
    },
  ];
}
