import { Component, signal } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface Testimonial {
  quote: string;
  name: string;
  company: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface BuildBlock {
  title: string;
  points: string[];
  imageRight: boolean;
}

@Component({
  selector: 'app-project-mangement',
  imports: [SectionComingSoon],
  templateUrl: './project-mangement.html',
  styleUrl: './project-mangement.scss',
})
export class ProjectMangement {
  /** "Built for Every Team" tabs */
  readonly teamTabs = ['Agency', 'Startups', 'Enterprise'];
  readonly activeTab = signal(0);

  selectTab(index: number): void {
    this.activeTab.set(index);
  }

  /** Alternating "Build to simplify Business" blocks */
  readonly buildBlocks: BuildBlock[] = [
    {
      title: 'See every project at a glance',
      points: [
        'Track tasks across boards, lists, and timelines',
        'Set priorities, due dates, and owners in seconds',
        'Watch progress update live as work gets done',
        'Keep files, notes, and comments on each task',
      ],
      imageRight: true,
    },
    {
      title: 'Keep clients and teams in sync',
      points: [
        'Give clients a portal view of their projects',
        'Automate handoffs, reminders, and status updates',
        'Spot bottlenecks before they miss a deadline',
        'Report on time, budget, and workload in one click',
      ],
      imageRight: false,
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      quote:
        'We stopped chasing updates across five different apps. Every project lives in ZarklyX now, and our deadlines actually hold.',
      name: 'Laura Bennett',
      company: 'Northlane Studio',
    },
    {
      quote:
        'Our clients love the portal view  they can see progress without emailing us. It saved our project managers hours every week.',
      name: 'Rohan Mehta',
      company: 'BrightPixel Agency',
    },
    {
      quote:
        'Onboarding a new project used to take days. Now it is a template and a few clicks, and the whole team knows their tasks.',
      name: 'Elena Duarte',
      company: 'Stackforge',
    },
  ];

  readonly faqs: Faq[] = [
    {
      question: 'What can I manage with ZarklyX project management?',
      answer:
        'Tasks, deadlines, files, team workload, and client updates  all in one workspace. You can plan work on boards, lists, or timelines and track it from start to finish.',
    },
    {
      question: 'Is it built for agencies or for any team?',
      answer:
        'Both. ZarklyX adapts to agencies, startups, and larger teams, with client portals, role-based access, and workflows that match how you already work.',
    },
    {
      question: 'Can clients see their project progress?',
      answer:
        'Yes. You can give each client a portal view of their projects, so they see status and progress without you sending manual updates.',
    },
    {
      question: 'Does it connect with the rest of ZarklyX?',
      answer:
        'It does. Projects sit alongside CRM, invoicing, HR, and social media in the same platform, so client work and internal operations stay in sync.',
    },
    {
      question: 'Can I automate repetitive work?',
      answer:
        'Yes. Automate reminders, status updates, and handoffs so your team spends less time on busywork and more time delivering.',
    },
  ];

  readonly openFaq = signal<number | null>(0);

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
