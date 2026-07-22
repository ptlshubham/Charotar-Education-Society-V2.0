import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';

interface Capability {
  icon: string;
  title: string;
  desc: string;
}
interface Step {
  n: number;
  title: string;
  desc: string;
}
interface Reason {
  icon: string;
  title: string;
  desc: string;
}
interface Faq {
  q: string;
  a: string;
  open: boolean;
}

@Component({
  selector: 'app-schedule-demo',
  imports: [NgClass, FormsModule, RouterLink],
  templateUrl: './schedule-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './schedule-demo.scss',
})
export class ScheduleDemo {
  // ─── Hero ───
  readonly heroChecklist: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'gift', label: '14-Day Free Trial' },
    { icon: 'card', label: 'Every Module Included' },
    { icon: 'refresh', label: 'Cancel Anytime' },
  ];

  // Pre-launch: these describe what we actually offer rather than customer
  // counts or review scores we don't have yet.
  readonly heroStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'users', value: '11', label: 'Platform Integrations' },
    { icon: 'star', value: 'All-in-One', label: 'CRM, HR & Social' },
    { icon: 'shield', value: 'Role-Based', label: 'Access Control' },
    { icon: 'headset', value: 'Free', label: 'Onboarding Help' },
  ];

  // ─── Demo request form ───
  readonly countries = [
    'India',
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Australia',
    'Canada',
    'Singapore',
    'Germany',
    'Other',
  ];

  readonly form = {
    workEmail: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    jobFunction: '',
    jobLevel: '',
    country: 'India',
    consent: true,
  };
  private resourcesService = inject(ResourcesService);

  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal('');

  /** Contact details echoed back in the thank-you popup (captured before the form resets) */
  readonly submittedEmail = signal('');
  readonly submittedPhone = signal('');

  /** "What happens next?" steps shown in the popup */
  readonly nextSteps: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'calendar', label: "We'll schedule your demo" },
    { icon: 'users', label: 'Our expert will reach out to you' },
    { icon: 'chat', label: 'Get a personalized product walkthrough' },
  ];

  closeThankYou(): void {
    this.submitted.set(false);
    this.form.workEmail = '';
    this.form.firstName = '';
    this.form.lastName = '';
    this.form.company = '';
    this.form.phone = '';
    this.form.jobFunction = '';
    this.form.jobLevel = '';
    this.form.country = 'India';
    this.form.consent = true;
  }

  submitDemo(formValid: boolean): void {
    if (!formValid || this.submitting()) return;
    this.submitting.set(true);
    this.submitError.set('');

    this.resourcesService
      .submitScheduleDemo({
        workEmail: this.form.workEmail,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        company: this.form.company,
        phone: this.form.phone,
        jobFunction: this.form.jobFunction,
        jobLevel: this.form.jobLevel,
        country: this.form.country,
        consent: this.form.consent,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submittedEmail.set(this.form.workEmail);
          this.submittedPhone.set(this.form.phone);
          this.submitted.set(true);
        },
        error: (err: any) => {
          this.submitting.set(false);
          this.submitError.set(err?.error?.message || 'Something went wrong. Please try again.');
        },
      });
  }

  // ─── What you can do ───
  readonly capabilities: Capability[] = [
    {
      icon: 'agency',
      title: 'Agency Management',
      desc: 'Manage clients, teams and projects in one place.',
    },
    {
      icon: 'automation',
      title: 'Workflow Automation',
      desc: 'Automate repetitive tasks and save time.',
    },
    {
      icon: 'billing',
      title: 'Billing & Invoicing',
      desc: 'Create invoices, track payments and get paid.',
    },
    {
      icon: 'chart',
      title: 'Reports & Analytics',
      desc: 'Get real-time insights and make data-driven decisions.',
    },
    { icon: 'team', title: 'Team Collaboration', desc: 'Collaborate seamlessly with your team.' },
  ];

  // ─── Get started ───
  readonly steps: Step[] = [
    { n: 1, title: 'Create Your Account', desc: 'Sign up for free in less than a minute.' },
    { n: 2, title: 'Setup Your Workspace', desc: 'Add your team and configure settings.' },
    { n: 3, title: 'Invite Your Team', desc: 'Collaborate and assign roles.' },
    { n: 4, title: 'Start Managing', desc: 'Streamline your operations and grow.' },
  ];

  // ─── Why choose ───
  readonly whyChoose: Reason[] = [
    {
      icon: 'grid',
      title: 'All-in-One Platform',
      desc: 'Everything you need to run your business.',
    },
    {
      icon: 'shield',
      title: 'Secure & Reliable',
      desc: 'Enterprise-grade security and 99.9% uptime.',
    },
    { icon: 'bolt', title: 'Easy to Use', desc: 'Intuitive interface and easy to get started.' },
    { icon: 'scale', title: 'Scalable', desc: 'Grow your business without limitations.' },
    {
      icon: 'headset',
      title: 'Dedicated Support',
      desc: '24/7 expert support whenever you need it.',
    },
  ];

  // ─── Early access ───
  // Replaces the old testimonial block: ZarklyX is pre-launch, so there are no
  // customer quotes to show yet. Swap this section back to real testimonials
  // once agencies are live and have agreed to be quoted.
  readonly earlyAccessPerks: Reason[] = [
    {
      icon: 'unlock',
      title: 'Every module unlocked',
      desc: 'CRM, social scheduling, projects, HR, payroll and invoicing. The full platform during your trial, not a cut-down tier.',
    },
    {
      icon: 'headset',
      title: 'Hands-on onboarding',
      desc: 'We help you move your clients across and set your workspace up properly, at no cost.',
    },
    {
      icon: 'bolt',
      title: 'Shape what we build',
      desc: 'Early agencies get direct input into the roadmap and priority on the features they need most.',
    },
  ];

  // ─── Logos ───
  // Real clients — keep in step with the homepage marquee (company-logos.ts).
  readonly logos = ['CyberNGO', 'Eventure', 'Forenzy', 'Keryar', 'Rayrak', 'RideIt'];

  // ─── FAQ ───
  readonly faqs: Faq[] = [
    {
      q: 'What is ZarklyX?',
      a: 'ZarklyX is an all-in-one business management platform that helps agencies and businesses manage clients, automate workflows, handle billing, and collaborate  all from one place.',
      open: false,
    },
    {
      q: 'How does the free trial work?',
      a: 'You get full access to ZarklyX for 14 days. Explore every feature and cancel anytime before the trial ends.',
      open: false,
    },
    {
      q: 'Can I upgrade or downgrade my plan?',
      a: 'Yes. You can change your plan at any time from your account settings  upgrades apply instantly and downgrades take effect at the next billing cycle.',
      open: false,
    },
    {
      q: 'Is my data secure with ZarklyX?',
      a: 'Absolutely. We use enterprise-grade encryption, secure data centers, and follow industry best practices to keep your data safe.',
      open: false,
    },
    {
      q: 'Can I integrate ZarklyX with other tools?',
      a: 'Yes. ZarklyX integrates with popular tools across social media, cloud storage, analytics, CRM and more  with new integrations added regularly.',
      open: false,
    },
  ];

  // ─── "Get Started" orbit illustration  8 person nodes evenly around the ring ───
  // `angle` drives a fixed-pixel-radius transform (perfect circle, direction-independent).
  // `x`/`y` (percent) place the matching spoke + bead in the SVG at the exact same points.
  readonly orbitNodes: ReadonlyArray<{ x: number; y: number; angle: number; delay: string }> = [
    { x: 92, y: 50, angle: 90, delay: '0s' },
    { x: 79.7, y: 79.7, angle: 135, delay: '-0.6s' },
    { x: 50, y: 92, angle: 180, delay: '-1.2s' },
    { x: 20.3, y: 79.7, angle: 225, delay: '-1.8s' },
    { x: 8, y: 50, angle: 270, delay: '-2.4s' },
    { x: 20.3, y: 20.3, angle: 315, delay: '-3s' },
    { x: 50, y: 8, angle: 0, delay: '-3.6s' },
    { x: 79.7, y: 20.3, angle: 45, delay: '-4.2s' },
  ];

  // ─── Support ───
  readonly supportItems = [
    '24/7 Email Support',
    'Live Chat Support',
    'Help Center & Documentation',
    'Video Tutorials',
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
