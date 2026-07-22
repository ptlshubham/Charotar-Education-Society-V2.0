import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-small-medium-business',
  imports: [NgClass, RouterLink],
  templateUrl: './small-medium-business.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './small-medium-business.scss',
})
export class SmallMediumBusiness {
  readonly heroChecklist = [
    'Easy to get started',
    'Affordable and scalable',
    'Everything you need to grow',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = [
    'Overview',
    'Customers',
    'Invoices',
    'Projects',
    'Tasks',
    'Reports',
    'Team',
    'Integrations',
    'Settings',
  ];
  readonly dashboardStats: ReadonlyArray<{
    label: string;
    value: string;
    change: string;
    down: boolean;
  }> = [
    { label: 'Total Revenue', value: '₹24,75,000', change: '18.5%', down: false },
    { label: 'Active Customers', value: '1,245', change: '16.3%', down: false },
    { label: 'Open Invoices', value: '36', change: '8.2%', down: true },
    { label: 'Profit', value: '₹6,45,000', change: '22.1%', down: false },
  ];
  readonly recentActivities: ReadonlyArray<{
    icon: string;
    color: string;
    text: string;
    time: string;
  }> = [
    { icon: 'invoice', color: '#3DAFA9', text: 'Invoice #INV-245 paid', time: '2m ago' },
    { icon: 'user', color: '#3772FF', text: 'New customer added', time: '15m ago' },
    {
      icon: 'folder',
      color: '#E8A33D',
      text: "Project 'Website Redesign' updated",
      time: '1h ago',
    },
    { icon: 'dollar', color: '#E8A33D', text: 'Payment received', time: '2h ago' },
  ];

  readonly trustedLogos: ReadonlyArray<{ name: string; sub: string }> = [
    { name: 'freshbite', sub: 'FOODS' },
    { name: 'UrbanStays', sub: 'HOSPITALITY' },
    { name: 'BOOKHUB', sub: 'SOLUTIONS' },
    { name: 'GreenShift', sub: 'ENERGY' },
    { name: 'Crafted.', sub: 'INTERIORS' },
    { name: 'QuickCare', sub: 'SERVICES' },
  ];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'users',
      title: 'Customer Management',
      desc: 'Organize customer data, track interactions, and build stronger relationships.',
    },
    {
      icon: 'invoice',
      title: 'Sales & Invoicing',
      desc: 'Create quotes, send invoices, and get paid faster with automated workflows.',
    },
    {
      icon: 'clipboard',
      title: 'Project & Task Management',
      desc: 'Plan projects, assign tasks, and keep your team aligned and productive.',
    },
    {
      icon: 'receipt',
      title: 'Expense Tracking',
      desc: 'Track expenses, categorize them and manage your cash flow effectively.',
    },
    {
      icon: 'pie',
      title: 'Reports & Insights',
      desc: 'Get real-time insights and reports to make smarter decisions and grow confidently.',
    },
    {
      icon: 'team',
      title: 'Team Collaboration',
      desc: 'Collaborate with your team in one place with role-based access and activity tracking.',
    },
  ];

  /** "Real impact" stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '35%', label: 'Increase in overall productivity' },
    { icon: 'invoice', value: '28%', label: 'Faster invoice payments' },
    { icon: 'dollar', value: '40%', label: 'Reduction in manual work' },
    { icon: 'smile', value: '98%', label: 'Customer satisfaction rate' },
  ];
}
