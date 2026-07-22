import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enterprise',
  imports: [NgClass, RouterLink],
  templateUrl: './enterprise.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './enterprise.scss',
})
export class Enterprise {
  readonly heroChecklist = [
    'Designed for complex organizations',
    'Built for security and compliance',
    'Backed by dedicated enterprise support',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = ['Overview', 'Clients', 'Projects', 'Team', 'Reports', 'Settings'];
  readonly dashboardStats: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Total Clients', value: '1,284', change: '+18%' },
    { label: 'Active Projects', value: '3,672', change: '+24%' },
    { label: 'Team Members', value: '156', change: '+12%' },
    { label: 'Revenue', value: '₹1,24,50,000', change: '+28%' },
  ];
  readonly teamActivity: ReadonlyArray<{ name: string; action: string; time: string }> = [
    { name: 'Rohit Sharma', action: 'Project updated', time: '2m ago' },
    { name: 'Neha Verma', action: 'Client added', time: '15m ago' },
    { name: 'Karan Mehta', action: 'Task completed', time: '1h ago' },
    { name: 'Priya Singh', action: 'Report generated', time: '2h ago' },
  ];

  readonly trustedLogos = [
    'Deloitte.',
    'WPP',
    'OmnicomGroup',
    'PUBLICIS',
    'accenture',
    'Cognizant',
  ];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'shield',
      title: 'Advanced Security',
      desc: 'Enterprise-grade security with SSO, 2FA, role-based access, and data encryption at every layer.',
    },
    {
      icon: 'users',
      title: 'Scalability Without Limits',
      desc: 'Manage unlimited users, clients, and projects across multiple teams and locations with ease.',
    },
    {
      icon: 'sliders',
      title: 'Custom Solutions',
      desc: 'Flexible workflows, custom reports, and white-label options tailored to your business needs.',
    },
    {
      icon: 'headset',
      title: 'Dedicated Support',
      desc: 'Get priority support with a dedicated account manager and 24/7 enterprise support.',
    },
    {
      icon: 'badge',
      title: 'Compliance & Reliability',
      desc: 'SOC 2 Type II, GDPR-ready and aligned with global standards to keep your data safe and compliant.',
    },
    {
      icon: 'pie',
      title: 'Data & Insights',
      desc: 'Advanced analytics and custom dashboards to make smarter decisions and drive growth.',
    },
  ];

  /** Enterprise-grade benefits strip */
  readonly benefits: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'sso', label: 'Single Sign-On (SSO)' },
    { icon: 'permissions', label: 'Advanced Permissions' },
    { icon: 'audit', label: 'Audit Logs & Tracking' },
    { icon: 'backup', label: 'Automated Data Backup' },
    { icon: 'uptime', label: '99.9% Uptime SLA' },
    { icon: 'global', label: 'Global Infrastructure & Data Centers' },
  ];

  /** Proven impact stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '40%', label: 'Increase in productivity' },
    { icon: 'clock', value: '60%', label: 'Time saved on reporting' },
    { icon: 'users', value: '8+', label: 'Departments using ZarklyX' },
    { icon: 'smile', value: '98%', label: 'Customer satisfaction' },
  ];
}
