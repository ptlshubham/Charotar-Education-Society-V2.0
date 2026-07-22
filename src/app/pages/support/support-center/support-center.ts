import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HelpCategory {
  icon: string;
  title: string;
  desc: string;
  articles: number;
}

interface HelpOption {
  icon: string;
  color: string;
  title: string;
  recommended: boolean;
  desc: string;
  btnText: string;
  outline: boolean;
  note: string;
}

interface Faq {
  question: string;
  answer: string;
  open: boolean;
}

interface Update {
  icon: string;
  color: string;
  text: string;
  date: string;
}

@Component({
  selector: 'app-support-center',
  imports: [RouterLink],
  templateUrl: './support-center.html',
  styleUrl: './support-center.scss',
})
export class SupportCenter {
  readonly heroImage = '/assets/images/blog-placeholder.png';

  readonly popularSearches = ['Getting started', 'Integrations', 'Billing', 'API', 'Account'];

  /** Browse-by-category grid */
  readonly categories: HelpCategory[] = [
    { icon: 'rocket', title: 'Getting Started', desc: 'Learn the basics and set up your account', articles: 12 },
    { icon: 'gear', title: 'Account & Billing', desc: 'Manage your account, plans and payments', articles: 18 },
    { icon: 'grid', title: 'Features & Usage', desc: 'Explore features and learn how to use them', articles: 36 },
    { icon: 'link', title: 'Integrations', desc: 'Connect with third-party tools and apps', articles: 15 },
    { icon: 'shield', title: 'Security & Privacy', desc: 'Learn about security, privacy and compliance', articles: 10 },
    { icon: 'code', title: 'Developers', desc: 'API docs, SDKs and developer resources', articles: 22 },
  ];

  /** Other support channels */
  readonly helpOptions: HelpOption[] = [
    { icon: 'chat', color: '#3DAFA9', title: 'Live Chat', recommended: true, desc: 'Chat with our support team for quick answers.', btnText: 'Start Live Chat', outline: true, note: 'Available 24/7' },
    { icon: 'mail', color: '#E8A33D', title: 'Email Support', recommended: false, desc: "Send us an email and we'll get back to you.", btnText: 'Send an Email', outline: true, note: 'Response within 24 hours' },
    { icon: 'phone', color: '#C587CE', title: 'Request a Call', recommended: false, desc: 'Schedule a call with our support specialist.', btnText: 'Schedule a Call', outline: true, note: 'Mon – Fri, 9 AM – 6 PM (IST)' },
    { icon: 'forum', color: '#3772FF', title: 'Community Forum', recommended: false, desc: 'Ask questions and get help from our community.', btnText: 'Visit Forum', outline: true, note: 'Community-powered' },
  ];

  /** FAQ accordion */
  readonly faqs: Faq[] = [
    { question: 'How do I get started with ZarklyX?', answer: 'Sign up for a free account, complete the quick onboarding, and follow our Getting Started guide to set up your workspace in minutes.', open: false },
    { question: 'Can I change my plan later?', answer: 'Yes. You can upgrade, downgrade, or cancel your plan anytime from your account billing settings  changes take effect immediately.', open: false },
    { question: 'How do I reset my password?', answer: "Click “Forgot password” on the login page and we'll email you a secure link to set a new one.", open: false },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards, UPI, and net banking. Enterprise customers can also pay via invoice.', open: false },
    { question: 'Is my data secure with ZarklyX?', answer: 'Absolutely. We use bank-grade encryption in transit and at rest, and are ISO and IAF certified for information security.', open: false },
  ];

  /** Recent product updates */
  readonly recentUpdates: Update[] = [
    { icon: 'new', color: '#C587CE', text: 'New: Advanced reporting and analytics dashboard', date: 'May 10, 2026' },
    { icon: 'improve', color: '#3DAFA9', text: 'Improvement: Faster data sync for integrations', date: 'May 08, 2026' },
    { icon: 'fix', color: '#3772FF', text: 'Fix: Resolved issue with export on large datasets', date: 'May 05, 2026' },
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
