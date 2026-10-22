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
      text: 'Admissions Open for Academic Year 2026-27 - apply now and be a part of the CES family.',
    },
  ];

  /** Mirrors the chips inside the floating assistant so both entry points agree. */
  readonly topics: ReadonlyArray<{ label: string; prompt: string }> = [
    { label: 'Explain a concept', prompt: "Explain Newton's three laws of motion in simple words with examples." },
    { label: 'Solve step by step', prompt: 'Solve step by step: x^2 - 5x + 6 = 0' },
    { label: 'Exam preparation', prompt: 'How should I prepare for my board exams in the last two months?' },
    { label: 'Study timetable', prompt: 'Help me make a weekly study timetable for school.' },
    { label: 'Career guidance', prompt: 'What career options do I have after 12th Science?' },
    { label: 'Admissions', prompt: 'How does the admission process work?' },
    { label: 'Institutes', prompt: 'Which institutes are part of Charotar Education Society?' },
    { label: 'Hostels', prompt: 'What hostel facilities does CES have?' },
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

  tagClass(tag: Announcement['tag']): string {
    switch (tag) {
      case 'Examination':
      case 'Result':
      case 'Admission':
        return 'bg-secondary/15 text-secondary-dark';
    }
  }
}
