import { Component, signal } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface BuildBlock {
  title: string;
  points: string[];
  imageRight: boolean;
}

interface Testimonial {
  quote: string;
  name: string;
  company: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-token-management',
  imports: [SectionComingSoon],
  templateUrl: './token-management.html',
  styleUrl: './token-management.scss',
})
export class TokenManagement {
  readonly expertPoints = [
    'Turn every client request into a trackable token',
    'Assign, reassign, and hand off without losing history',
    'See average resolution time at a glance',
  ];

  readonly buildBlocks: BuildBlock[] = [
    {
      title: 'Move every token from raised to resolved',
      points: [
        'Save a request as a draft, then convert it to a live token when it\'s ready',
        'Track each token through Pending, Processing, Review, and Completed',
        'Assign multiple team members to a single token',
        'See every update and change in one threaded timeline',
      ],
      imageRight: false,
    },
    {
      title: 'Keep work moving, even when people are out',
      points: [
        "Hand a manager's tokens to a backup for a set date range",
        'Track time spent per token, per assignee',
        'Star and mark tokens read, like a shared inbox',
        'See resolution time and workload by status and priority',
      ],
      imageRight: true,
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      quote:
        "Client requests used to live in email threads no one else could see. Now every request is a token with an owner, a status, and a due date.",
      name: 'Priya Shah',
      company: 'BrightPath Agency',
    },
    {
      quote:
        "We hand off tickets between managers whenever someone's on leave, and nothing gets dropped. The handover history is right there if a client asks.",
      name: 'Kevin Mendes',
      company: 'CityCare Services',
    },
    {
      quote:
        "Clients used to ask 'what's the status of this?' and I'd have to go dig. Now I just look at the token.",
      name: 'Farah Siddiqui',
      company: 'Metro Creative Studio',
    },
  ];

  readonly faqs: Faq[] = [
    {
      question: 'What is a token in ZarklyX?',
      answer:
        "A token is a work request or ticket raised for a client. It moves through a fixed pipeline  Pending, Processing, Review, and Completed  so you always know where it stands.",
    },
    {
      question: 'How is Token Management different from Project Management?',
      answer:
        'Token Management tracks individual client requests through a support-style pipeline with assignment and handover. Project Management is for broader, multi-task work on a Kanban board or timeline. Most teams use both together.',
    },
    {
      question: 'Can I save a request before turning it into a token?',
      answer:
        "Yes. Save it as a draft first, then convert it into a live token once it's ready to be assigned and worked on.",
    },
    {
      question: "Can I hand off my tokens if I'm out of office?",
      answer:
        'Yes. Hand your tokens over to a backup manager for a set date range, and everything  including history  carries over.',
    },
    {
      question: 'Can I track how long tokens take to resolve?',
      answer:
        'Yes. ZarklyX times each token per assignee and reports average resolution time, so you can see where work is moving fast and where it\'s stuck.',
    },
  ];

  readonly openFaq = signal<number | null>(0);

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
