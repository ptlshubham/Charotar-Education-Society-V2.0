import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-professional-services',
  imports: [NgClass, RouterLink],
  templateUrl: './professional-services.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './professional-services.scss',
})
export class ProfessionalServices {
  readonly heroChecklist = [
    'Improve project profitability',
    'Enhance client satisfaction',
    'Optimize resource utilization',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = [
    'Overview',
    'Clients',
    'Projects',
    'Time & Expense',
    'Resourcing',
    'Invoices',
    'Reports',
    'Team',
    'Settings',
  ];
  readonly dashboardStats: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Total Revenue', value: '₹18,75,000', change: '18.6%' },
    { label: 'Billable Hours', value: '1,560', change: '14.3%' },
    { label: 'Utilization Rate', value: '72%', change: '6.1%' },
    { label: 'Profitability', value: '28%', change: '8.7%' },
  ];
  readonly recentActivities: ReadonlyArray<{
    icon: string;
    color: string;
    title: string;
    sub: string;
    time: string;
  }> = [
    {
      icon: 'invoice',
      color: '#3DAFA9',
      title: 'Project Alpha – Phase 2',
      sub: 'Invoice sent',
      time: '2m ago',
    },
    {
      icon: 'clock',
      color: '#C587CE',
      title: 'Client Meeting – Acme Corp',
      sub: 'Logged time',
      time: '15m ago',
    },
    {
      icon: 'doc',
      color: '#3772FF',
      title: 'Proposal for Beta Solutions',
      sub: 'Created by Neha',
      time: '1h ago',
    },
    {
      icon: 'receipt',
      color: '#E8A33D',
      title: 'Expense report submitted',
      sub: 'By Rahul Sharma',
      time: '2h ago',
    },
  ];

  readonly trustedLogos = ['KPMG', 'Deloitte.', 'pwc', 'EY', 'McKinsey & Company', 'BDO'];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'briefcase',
      title: 'Project Management',
      desc: 'Plan, track, and deliver projects on time and within budget with full visibility.',
    },
    {
      icon: 'clock',
      title: 'Time & Expense Tracking',
      desc: 'Accurate time capture and expense management to improve billing and profitability.',
    },
    {
      icon: 'users',
      title: 'Resource Management',
      desc: 'Allocate the right people to the right projects and optimize your team utilization.',
    },
    {
      icon: 'invoice',
      title: 'Invoicing & Payments',
      desc: 'Create professional invoices, automate approvals, and get paid faster.',
    },
    {
      icon: 'chart',
      title: 'Reports & Analytics',
      desc: 'Real-time insights and customizable reports to make data-driven decisions.',
    },
    {
      icon: 'handshake',
      title: 'Client Collaboration',
      desc: 'Keep clients informed and collaborate seamlessly with shared dashboards and communication.',
    },
  ];

  /** "Better results" stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '35%', label: 'Increase in project profitability' },
    { icon: 'clock', value: '28%', label: 'Improvement in resource utilization' },
    { icon: 'smile', value: '40%', label: 'Higher client satisfaction' },
    { icon: 'doc', value: '25%', label: 'Reduction in administrative effort' },
  ];
}
