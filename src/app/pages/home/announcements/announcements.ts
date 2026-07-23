import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssistantBridge } from '../../../core/services/assistant-bridge.service';

interface Announcement {
  tag: 'Examination' | 'Result' | 'Admission';
  date: string;
  text: string;
}

@Component({
  selector: 'app-announcements',
  imports: [FormsModule],
  templateUrl: './announcements.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './announcements.scss',
})
export class Announcements {
  private readonly assistant = inject(AssistantBridge);

  draft = '';

  readonly announcements: readonly Announcement[] = [
    {
      tag: 'Examination',
      date: '21-Jul-2026',
      text: 'Notification for result declaration of Bachelor of Hotel Management and Catering Technology Sem - 1 (Remedial) of Summer - 2026 Examination',
    },
    {
      tag: 'Result',
      date: '21-Jul-2026',
      text: 'Notification for Result Declaration of Doctor of Pharmacy (Post Baccalaureate) Year - 1 (Regular) Summer - 2026 Examination',
    },
    {
      tag: 'Admission',
      date: '21-Jul-2026',
      text: 'Admissions Open for Academic Year 2026-27 — apply now and be a part of the CES family.',
    },
  ];

  /** Mirrors the chips inside the floating assistant so both entry points agree. */
  readonly topics: ReadonlyArray<{ label: string; prompt: string }> = [
    { label: 'Admissions', prompt: 'How does the admission process work?' },
    { label: 'Institutes', prompt: 'Which institutes are part of Charotar Education Society?' },
    { label: 'Examinations', prompt: 'Tell me about the examination schedule and notifications.' },
    { label: 'Results', prompt: 'Where can I check my results?' },
    { label: 'Placements', prompt: 'What placement support do you offer?' },
    { label: 'Scholarships', prompt: 'Which scholarships are available to students?' },
    { label: 'Events', prompt: 'What events are coming up at CES?' },
    { label: 'Fees & Scholarships', prompt: 'What are the fees and scholarship options?' },
    { label: 'Other Queries', prompt: 'How do I get in touch with the institution?' },
  ];

  askTopic(prompt: string): void {
    this.assistant.open(prompt);
  }

  send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.draft = '';
    this.assistant.open(text);
  }

  /** Tag colours are deliberate: examination amber, result red, admission green. */
  tagClass(tag: Announcement['tag']): string {
    switch (tag) {
      case 'Examination':
        return 'bg-secondary/15 text-secondary-dark';
      case 'Result':
        return 'bg-red-50 text-red-600';
      case 'Admission':
        return 'bg-accent/10 text-accent';
    }
  }
}
