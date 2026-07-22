import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero/hero';
import { SectionComingSoon } from '../../../../layouts/section-coming-soon/section-coming-soon';

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
  selector: 'app-index',
  imports: [SectionComingSoon],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {
  /** "Expert solutions" checklist */
  readonly expertPoints = [
    'Schedule posts across every channel',
    'Approve content before it goes live',
    'Track engagement and growth in one dashboard',
  ];

  /** Alternating "Build to simplify Business" blocks */
  readonly buildBlocks: BuildBlock[] = [
    {
      title: 'Plan and schedule your whole calendar',
      points: [
        'Draft once and publish to every connected channel',
        'See all scheduled posts on a single calendar',
        'Set the best times to post automatically',
        'Reuse top content with saved templates',
      ],
      imageRight: true,
    },
    {
      title: 'Approve, collaborate, and stay on brand',
      points: [
        'Route posts through client or manager approval',
        'Leave comments and feedback right on each draft',
        'Keep brand assets and captions in one library',
        'Give each client their own workspace and access',
      ],
      imageRight: false,
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      quote:
        'We manage social for a dozen clients. ZarklyX lets us plan a month of content in an afternoon and get it all approved in one place.',
      name: 'Chloe Andersen',
      company: 'Hue & Co.',
    },
    {
      quote:
        'Scheduling across every platform used to mean five logins. Now it is one calendar, and our posts actually go out on time.',
      name: 'Marcus Feld',
      company: 'Wavelength Media',
    },
    {
      quote:
        'The approval flow saved us from so many back-and-forth emails. Clients review, we hit publish  done.',
      name: 'Priya Nair',
      company: 'Bloomroot Agency',
    },
  ];

  readonly faqs: Faq[] = [
    {
      question: 'Which social platforms can I manage?',
      answer:
        'You can create, schedule, and publish to Facebook, Instagram, LinkedIn, Threads, Pinterest, X, YouTube, and Google Business Profile  all from one calendar.',
    },
    {
      question: 'Can I schedule posts in advance?',
      answer:
        'Yes. Plan your whole content calendar, set posting times, and let ZarklyX publish automatically so you never miss the best moment to post.',
    },
    {
      question: 'Does it support client or manager approvals?',
      answer:
        'It does. Route each post through an approval step, collect feedback right on the draft, and only publish once it is signed off.',
    },
    {
      question: 'Can I manage social for multiple clients?',
      answer:
        'Yes. Give each client their own workspace with role-based access, so your team sees only the accounts and content relevant to them.',
    },
    {
      question: 'Can I see how my posts are performing?',
      answer:
        'Yes. Track engagement, reach, and follower growth across every channel in one dashboard, and export reports to share with clients.',
    },
  ];

  readonly openFaq = signal<number | null>(0);

  toggleFaq(index: number): void {
    this.openFaq.update((current) => (current === index ? null : index));
  }
}
