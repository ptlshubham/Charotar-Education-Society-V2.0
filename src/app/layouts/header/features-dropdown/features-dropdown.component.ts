import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  headerIcon: string;
  exploreLabel: string;
  items: LinkItem[];
}

const I = {
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>`,
  layers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/></svg>`,
  clipboard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>`,
  list: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
  workflow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a2 2 0 0 1 2 2v7"/></svg>`,
  idcard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M13 8h5M13 12h5M6 16s.5-2 3-2 3 2 3 2"/></svg>`,
  card: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  calCheck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>`,
  receipt: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2Z"/><path d="M8 8h8M8 12h6"/></svg>`,
  badgeCheck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  userPlus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>`,
  headset: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2ZM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2v2Z"/></svg>`,
  doc: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>`,
  gear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 15H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 8.3a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 4.6h.1"/></svg>`,
  chart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  cloud: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.5A4 4 0 0 0 6.5 19h11Z"/></svg>`,
  puzzle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3a2 2 0 0 1 4 0v1h3a1 1 0 0 1 1 1v3h1a2 2 0 0 1 0 4h-1v3a1 1 0 0 1-1 1h-3v-1a2 2 0 0 0-4 0v1H5a1 1 0 0 1-1-1v-3H3a2 2 0 0 1 0-4h1V5a1 1 0 0 1 1-1h3Z"/></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>`,
  seo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><path d="m21 21-4.3-4.3M7 10l2 2 4-4"/></svg>`,
  bill: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 14h2M14 14h2"/></svg>`,
};

@Component({
  selector: 'app-features-dropdown',
  standalone: true,
  imports: [RouterLink, CommonModule, SafeHtmlPipe],
  templateUrl: './features-dropdown.component.html',
  styleUrl: './features-dropdown.component.scss'
})
export class FeaturesDropdown {
  @Output() closeDropdown = new EventEmitter<void>();

  readonly sparklesIcon = I.sparkles;

  readonly columns: Column[] = [
    {
      title: 'Marketing & Growth', headerIcon: I.chart, exploreLabel: 'Explore all modules',
      items: [
        { icon: I.workflow, title: 'Social Media Management', desc: 'Plan, schedule and publish across channels', link: '/modules/social-media-management', soon: true },
        { icon: I.userPlus, title: 'Influencer Management', desc: 'Discover, manage and pay creators', link: '/modules/influencer-management', soon: true },
        { icon: I.users, title: 'CRM', desc: 'Track leads, deals and relationships', link: '/modules/crm', soon: true },
        { icon: I.clipboard, title: 'Project Management', desc: 'Plan, track and deliver projects on time', link: '/modules/project-management', soon: true },
        { icon: I.seo, title: 'SEO', desc: 'Track keywords, rankings and search performance', link: '/modules/seo', soon: true },
        { icon: I.chart, title: 'Reports & Analytics', desc: 'Custom dashboards and real-time insights', link: '/modules/reports-analytics', soon: true },
      ],
    },
    {
      title: 'People & HR', headerIcon: I.users, exploreLabel: 'Explore all modules',
      items: [
        { icon: I.idcard, title: 'Employee Management', desc: 'Manage your entire workforce in one place', link: '/modules/employee-management', soon: true },
        { icon: I.card, title: 'HRMS', desc: 'Automate core HR operations end to end', link: '/modules/hrms', soon: true },
        { icon: I.receipt, title: 'Payroll', desc: 'Process accurate payroll every cycle', link: '/modules/payroll', soon: true },
        { icon: I.calCheck, title: 'Attendance', desc: 'Check-ins, leave and shift scheduling', link: '/modules/attendance', soon: true },
      ],
    },
    {
      title: 'Finance & Operations', headerIcon: I.layers, exploreLabel: 'Explore all modules',
      items: [
        { icon: I.doc, title: 'Finance & Accounting', desc: 'Invoices, expenses and reports in one hub', link: '/modules/finance-accounting', soon: true },
        { icon: I.gear, title: 'IT Management', desc: 'Track assets, access and IT requests', link: '/modules/it-management', soon: true },
        { icon: I.layers, title: 'Token System', desc: 'Manage credits, usage and billing tokens', link: '/modules/token-management', soon: true },
        { icon: I.bill, title: 'Bills & Utility', desc: 'Manage utility bills and recurring expenses', link: '/modules/bills-utility', soon: true },
        { icon: I.cloud, title: 'Cloud Storage', desc: 'Secure file storage and team collaboration', link: '/modules/cloud-storage', soon: true },
      ],
    },
  ];

  readonly bottomStrip: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: I.shield, title: 'Enterprise Grade Security', desc: 'Your data is 100% safe' },
    { icon: I.cloud, title: 'Cloud Based Platform', desc: 'Access from anywhere' },
    { icon: I.puzzle, title: 'Seamless Integrations', desc: 'Connect 50+ tools' },
    { icon: I.headset, title: '24/7 Expert Support', desc: "We're here to help" },
  ];

  onClose(): void {
    this.closeDropdown.emit();
  }
}
