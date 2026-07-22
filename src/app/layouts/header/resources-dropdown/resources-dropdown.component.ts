import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';

interface LinkItem {
  icon: string;
  title: string;
  desc: string;
  link: string;
  soon?: boolean;
}

interface Column {
  title: string;
  subtitle: string;
  headerIcon: string;
  items: LinkItem[];
}

const I = {
  book: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5a2 2 0 0 1 2-2h6v16H4a2 2 0 0 0-2 2V5ZM22 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V5Z"/></svg>`,
  cap: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  doc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>`,
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8Z"/></svg>`,
  rocket: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9 0Z"/><path d="M12 15 9 12a11 11 0 0 1 2-3.5C13.7 5 17.5 3 20.5 3c0 3-2 6.8-5.5 9.5A11 11 0 0 1 12 15Z"/></svg>`,
  help: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg>`,
  pen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  bookOpen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5a2 2 0 0 1 2-2h6v16H4a2 2 0 0 0-2 2V5ZM22 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V5Z"/></svg>`,
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  calPlay: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M10 14l4 2-4 2v-4Z"/></svg>`,
  calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  handshake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a2 2 0 0 0 .3-2.4l-2.3-3.5"/><path d="m18 12-5.5-5.5a2 2 0 0 0-2.8 0L3 13l3 3 4-4 3 3"/></svg>`,
  code: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>`,
};

@Component({
  selector: 'app-resources-dropdown',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, SafeHtmlPipe],
  templateUrl: './resources-dropdown.component.html',
  styleUrl: './resources-dropdown.component.scss'
})
export class ResourcesDropdown {
  @Output() closeDropdown = new EventEmitter<void>();

  readonly columns: Column[] = [
    {
      title: 'Learn', subtitle: 'Guides and tutorials to help you get started', headerIcon: I.book,
      items: [
        { icon: I.play, title: 'Tutorials', desc: 'Step-by-step guides to master ZarklyX', link: '/support/tutorials', soon: true },
        { icon: I.rocket, title: 'Help Center', desc: 'Answers and how-tos for every feature', link: '/support' },
        { icon: I.help, title: 'FAQs', desc: 'Quick answers to common questions', link: '/support/faq' },
        { icon: I.calPlay, title: 'Expert Sessions', desc: 'Live and on-demand expert webinars', link: '/support/expert-sessions', soon: true },
      ],
    },
    {
      title: 'Explore', subtitle: 'Insights, stories and updates from ZarklyX', headerIcon: I.cap,
      items: [
        { icon: I.pen, title: 'Blogs', desc: 'Latest trends, tips and product news', link: '/blogs' },
        { icon: I.doc, title: 'Newsroom', desc: 'Announcements, press and company updates', link: '/company/newsroom' },
        { icon: I.play, title: 'Podcast', desc: 'Conversations on growth and operations', link: '/podcast' },
        { icon: I.users, title: 'Community', desc: 'Connect and learn with other users', link: '/support/community' },
      ],
    },
    {
      title: 'Support', subtitle: 'Help and platform status when you need it', headerIcon: I.help,
      items: [
        { icon: I.calendar, title: 'System Status', desc: 'Live uptime and incident history', link: '/support/system-status' },
        { icon: I.bookOpen, title: 'Report Abuse', desc: 'Flag violations of our guidelines', link: '/support/report-abuse' },
        { icon: I.pen, title: 'Feature Requests', desc: 'Suggest and vote on new features', link: '/support/feature-requests' },
        { icon: I.handshake, title: 'Contact Support', desc: 'Get help from our support team', link: '/contact' },
      ],
    },
  ];

  readonly featured = {
    tag: 'EBOOK',
    title: 'The Complete Guide to Business Automation',
    desc: 'Learn how to automate workflows, improve productivity and grow faster with ZarklyX.',
  };

  readonly popularArticles: ReadonlyArray<{ title: string; link: string }> = [
    { title: 'How to Automate Your Workflow', link: '/blogs' },
    { title: '10 Ways to Improve Team Productivity', link: '/blogs' },
   
  ];

  onClose(): void {
    this.closeDropdown.emit();
  }
}
