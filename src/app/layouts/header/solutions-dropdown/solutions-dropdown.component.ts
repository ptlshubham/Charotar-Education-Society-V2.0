import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../shared/safe-html.pipe';

interface LinkItem {
  icon: string;
  title: string;
  desc: string;
  link: string;
}

const I = {
  layout: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h6"/></svg>`,
  users: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  cart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.2 12.4a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H6"/></svg>`,
  clipboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>`,
  workflow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a2 2 0 0 1 2 2v7"/></svg>`,
  card: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  pie: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5A9 9 0 1 1 8.5 3"/><path d="M21.2 8A9 9 0 0 0 16 2.8V8Z"/></svg>`,
  headset: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2ZM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2v2Z"/></svg>`,
  target: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>`,
  arrow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M13 8l4 4-4 4"/></svg>`,
  shuffle: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>`,
  grid: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 3 6.9 7.6.6-5.8 5 1.8 7.5L12 18l-6.4 4 1.8-7.5-5.8-5 7.6-.6L12 2Z"/></svg>`,
  rocket: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9 0Z"/><path d="M12 15 9 12a11 11 0 0 1 2-3.5C13.7 5 17.5 3 20.5 3c0 3-2 6.8-5.5 9.5A11 11 0 0 1 12 15Z"/></svg>`,
};

@Component({
  selector: 'app-solutions-dropdown',
  standalone: true,
  imports: [RouterLink, CommonModule, SafeHtmlPipe],
  templateUrl: './solutions-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './solutions-dropdown.component.scss',
})
export class SolutionsDropdown {
  @Output() closeDropdown = new EventEmitter<void>();

  readonly coreAreas: LinkItem[] = [
    {
      icon: I.layout,
      title: 'Enterprise',
      desc: 'Advanced control, security and scale for large teams.',
      link: '/solutions/enterprise',
    },
    {
      icon: I.users,
      title: 'Agencies',
      desc: 'Run client work and grow your agency in one place.',
      link: '/solutions/agencies',
    },
    {
      icon: I.clipboard,
      title: 'Professional Services',
      desc: 'Deliver billable projects on time and on budget.',
      link: '/solutions/professional-services',
    },
  ];

  readonly popularSolutions: LinkItem[] = [
    {
      icon: I.cart,
      title: 'Small & Medium Business',
      desc: 'Everything a growing business needs to scale.',
      link: '/solutions/small-medium-business',
    },
    {
      icon: I.workflow,
      title: 'Social Media Management',
      desc: 'Plan, schedule and publish across every channel.',
      link: '/solutions/social-media-management',
    },
    {
      icon: I.pie,
      title: 'Social Insights',
      desc: 'Turn engagement data into smarter decisions.',
      link: '/solutions/social-insights',
    },
    {
      icon: I.target,
      title: 'Brand Awareness',
      desc: 'Grow reach and build a brand people trust.',
      link: '/solutions/brand-awareness',
    },
    {
      icon: I.grid,
      title: 'Industries',
      desc: 'Tailored solutions for your specific industry.',
      link: '/solutions/industries',
    },
  ];

  readonly whatsNew: ReadonlyArray<{ icon: string; color: string; title: string; desc: string }> = [
    {
      icon: I.target,
      color: '#3DAFA9',
      title: 'Enterprise-Grade Security',
      desc: 'SSO, audit logs and granular role-based access controls.',
    },
    {
      icon: I.arrow,
      color: '#3772FF',
      title: 'Automation Studio',
      desc: 'Build custom workflows without writing any code.',
    },
    {
      icon: I.shuffle,
      color: '#F17C9F',
      title: 'Unified Reporting',
      desc: 'All your metrics together in one live dashboard.',
    },
  ];

  readonly popularSearches: ReadonlyArray<{ label: string; link: string }> = [
    { label: 'Enterprise', link: '/solutions/enterprise' },
    { label: 'Agencies', link: '/solutions/agencies' },
    { label: 'Social Media Management', link: '/solutions/social-media-management' },
    { label: 'Social Insights', link: '/solutions/social-insights' },
    { label: 'Brand Awareness', link: '/solutions/brand-awareness' },
    { label: 'Industries', link: '/solutions/industries' },
  ];

  onClose(): void {
    this.closeDropdown.emit();
  }
}
