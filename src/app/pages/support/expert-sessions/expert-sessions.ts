import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../core/services/newsletter.service';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface Session {
  icon: string;
  color: string;
  title: string;
  desc: string;
  date: string;
  time: string;
  registered: string;
}

interface Expert {
  name: string;
  role: string;
  desc: string;
  initial: string;
  color: string;
}

@Component({
  selector: 'app-expert-sessions',
  imports: [FormsModule, SectionComingSoon],
  templateUrl: './expert-sessions.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './expert-sessions.scss',
})
export class ExpertSessions {
  private readonly newsletter = inject(NewsletterService);

  // "Never Miss a Session" subscribe  same flow as the footer newsletter form.
  readonly email = signal('');
  readonly submitting = signal(false);
  readonly errorMsg = signal('');

  subscribe(): void {
    const email = this.email().trim();
    if (!email) {
      this.errorMsg.set('Please enter your email address.');
      return;
    }
    this.submitting.set(true);
    this.errorMsg.set('');
    this.newsletter.subscribe(email, 'expert-sessions').subscribe({
      next: () => {
        this.submitting.set(false);
        this.email.set('');
      },
      error: (err: any) => {
        this.submitting.set(false);
        this.errorMsg.set(err?.error?.message || 'Something went wrong. Please try again.');
      },
    });
  }

  readonly featured = {
    tag: 'Upcoming Live Session',
    title: 'Building Scalable Agencies with ZarklyX',
    date: 'Wednesday, 22 May 2026',
    time: '4:00 PM – 5:00 PM IST',
    hostName: 'Rohit Sharma',
    hostRole: 'Product Growth Expert',
    registered: '1.2k+ Registered',
  };

  /** Value props under the hero */
  readonly values: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'live', title: 'Live & Interactive', desc: 'Real-time sessions with Q&A and chat' },
    { icon: 'experts', title: 'Industry Experts', desc: 'Learn from experienced professionals' },
    {
      icon: 'insights',
      title: 'Actionable Insights',
      desc: 'Practical tips you can implement right away',
    },
    {
      icon: 'certificate',
      title: 'Certificate of Attendance',
      desc: 'Get a certificate for every session',
    },
  ];

  readonly sessions: Session[] = [
    {
      icon: 'chart',
      color: '#3DAFA9',
      title: 'Building Scalable Agencies with ZarklyX',
      desc: 'Learn how to streamline operations, manage clients, and scale your agency efficiently.',
      date: '22 May 2026',
      time: '4:00 PM – 5:00 PM IST',
      registered: '1.2k+ Registered',
    },
    {
      icon: 'megaphone',
      color: '#C587CE',
      title: 'Advanced Social Media Strategies',
      desc: 'Discover advanced strategies to grow your brand, engage your audience, and drive results.',
      date: '29 May 2026',
      time: '4:00 PM – 5:00 PM IST',
      registered: '980+ Registered',
    },
    {
      icon: 'dollar',
      color: '#E8A33D',
      title: 'Automating Workflows & Reporting',
      desc: 'Save time and improve productivity by automating tasks and building smart reports.',
      date: '05 Jun 2026',
      time: '4:00 PM – 5:00 PM IST',
      registered: '760+ Registered',
    },
    {
      icon: 'shield',
      color: '#3772FF',
      title: 'Security Best Practices for Agencies',
      desc: 'Protect your data and clients with essential security practices in ZarklyX.',
      date: '12 Jun 2026',
      time: '4:00 PM – 5:00 PM IST',
      registered: '650+ Registered',
    },
    {
      icon: 'users',
      color: '#F17C9F',
      title: 'Client Retention: Tips from the Pros',
      desc: 'Learn proven techniques to build strong client relationships and improve retention.',
      date: '19 Jun 2026',
      time: '4:00 PM – 5:00 PM IST',
      registered: '540+ Registered',
    },
  ];

  readonly whyAttend: ReadonlyArray<{ icon: string; text: string }> = [
    { icon: 'user', text: 'Learn from industry experts' },
    { icon: 'chat', text: 'Get answers to your questions' },
    { icon: 'trend', text: 'Stay updated with trends' },
    { icon: 'users', text: 'Network with peers' },
    { icon: 'gift', text: 'Free for all ZarklyX users' },
  ];

  readonly topics: readonly string[] = [
    'Agency Growth',
    'Automation',
    'Reporting',
    'Social Media',
    'Analytics',
    'Client Management',
    'Security',
    'Billing & Plans',
  ];

  readonly experts: Expert[] = [
    {
      name: 'Rohit Sharma',
      role: 'Product Growth Expert',
      desc: 'Helps agencies scale with smart systems & processes.',
      initial: 'R',
      color: '#3DAFA9',
    },
    {
      name: 'Ananya Gupta',
      role: 'Digital Marketing Strategist',
      desc: '10+ years in helping brands grow online.',
      initial: 'A',
      color: '#C587CE',
    },
    {
      name: 'Karan Mehta',
      role: 'Automation Specialist',
      desc: 'Expert in workflow automation & productivity.',
      initial: 'K',
      color: '#3772FF',
    },
    {
      name: 'Neha Verma',
      role: 'Data & Analytics Expert',
      desc: 'Turning data into insights that drive results.',
      initial: 'N',
      color: '#E8A33D',
    },
  ];
}
