import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agencies',
  imports: [NgClass, RouterLink],
  templateUrl: './agencies.html',
  styleUrl: './agencies.scss',
})
export class Agencies {
  readonly heroChecklist = [
    'Manage unlimited clients and projects',
    'White-label reports with your branding',
    'Save time with automation and templates',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = ['Overview', 'Clients', 'Projects', 'Tasks', 'Reports', 'Templates', 'Billing', 'Team', 'Settings'];
  readonly dashboardStats: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Total Clients', value: '128', change: '+18%' },
    { label: 'Active Projects', value: '342', change: '+24%' },
    { label: 'Team Members', value: '24', change: '+12%' },
    { label: 'Monthly Revenue', value: '₹12,45,000', change: '+28%' },
  ];
  readonly topClients: ReadonlyArray<{ name: string; value: string }> = [
    { name: 'Acme Digital', value: '₹2,45,000' },
    { name: 'Bright Media', value: '₹1,80,000' },
    { name: 'NextWave', value: '₹1,45,000' },
    { name: 'Pixel Perfect', value: '₹1,20,000' },
    { name: 'BrandCraft', value: '₹95,000' },
  ];

  readonly trustedLogos = ['DIGITAL NEST', 'creative room', 'growth hackers', 'pixel perfect', 'BRAND MAKERS', 'web creators'];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'users', title: 'Client Management', desc: 'Centralize all client information, communications, and files in one place.' },
    { icon: 'folder', title: 'Project Management', desc: 'Plan, track, and deliver projects on time with powerful tools.' },
    { icon: 'chart', title: 'Custom Reports', desc: 'Create white-label reports and dashboards that showcase your results.' },
    { icon: 'doc', title: 'Templates & Workflows', desc: 'Save time with reusable templates and automated workflows.' },
    { icon: 'invoice', title: 'Billing & Invoicing', desc: 'Generate invoices, track payments, and manage retainers effortlessly.' },
    { icon: 'team', title: 'Team Collaboration', desc: 'Collaborate with your team and clients seamlessly on every project.' },
  ];

  /** "Deliver more. Grow faster." stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'clock', value: '40%', label: 'Time saved on manual tasks' },
    { icon: 'chart', value: '35%', label: 'Increase in project delivery speed' },
    { icon: 'smile', value: '98%', label: 'Client satisfaction rate' },
    { icon: 'dollar', value: '25%', label: 'Increase in agency profitability' },
  ];
}
