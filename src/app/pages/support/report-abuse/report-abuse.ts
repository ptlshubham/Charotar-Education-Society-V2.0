import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-report-abuse',
  imports: [NgClass],
  templateUrl: './report-abuse.html',
  styleUrl: './report-abuse.scss',
})
export class ReportAbuse {
  readonly maxLength = 1000;

  /** Abuse type dropdown options */
  readonly reportTypes: readonly string[] = [
    'Harassment or bullying',
    'Hate speech or discrimination',
    'Spam or misleading content',
    'Violence or threats',
    'Illegal activities',
    'Impersonation',
    'Other policy violations',
  ];

  /** "Who is involved?" choices */
  readonly involvedOptions: ReadonlyArray<{ id: string; label: string }> = [
    { id: 'user', label: 'A user' },
    { id: 'content', label: 'A content (post, comment, message, etc.)' },
    { id: 'company', label: 'A company / organization' },
    { id: 'other', label: 'Other' },
  ];

  involved = '';
  description = '';

  /** "What happens next?" steps */
  readonly steps: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'doc', title: 'We receive your report', desc: 'Our team will review your report carefully.' },
    { icon: 'search', title: 'We investigate', desc: 'We analyze the information and take appropriate action.' },
    { icon: 'shield', title: 'Action is taken', desc: 'If a violation is found, we will enforce our policies.' },
  ];

  /** "What can be reported?" list */
  readonly reportable: readonly string[] = [
    'Harassment or bullying',
    'Hate speech or discrimination',
    'Spam or misleading content',
    'Violence or threats',
    'Illegal activities',
    'Impersonation',
    'Other policy violations',
  ];

  onDescription(event: Event): void {
    this.description = (event.target as HTMLTextAreaElement).value;
  }
}
