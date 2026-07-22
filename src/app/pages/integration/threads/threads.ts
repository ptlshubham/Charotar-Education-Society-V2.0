import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-threads-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './threads.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './threads.scss',
})
export class ThreadsIntegration {
  readonly threadsColor = '#000000';

  readonly heroChecklist = [
    'Schedule and publish Threads posts effortlessly',
    'Track engagement and performance in real-time',
    'Grow your audience and build meaningful connections',
  ];

  readonly statCards: ReadonlyArray<{
    label: string;
    value: string;
    change: string;
    color: string;
    points: string;
  }> = [
    {
      label: 'Impressions',
      value: '32.6K',
      change: '18.4%',
      color: '#C587CE',
      points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6',
    },
    {
      label: 'Engagements',
      value: '6.3K',
      change: '22.7%',
      color: '#C587CE',
      points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3',
    },
    {
      label: 'Profile Visits',
      value: '2.1K',
      change: '16.1%',
      color: '#3772FF',
      points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4',
    },
    {
      label: 'Replies',
      value: '1.2K',
      change: '19.3%',
      color: '#E8A33D',
      points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4',
    },
  ];
  readonly trustBadges: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'sync', label: 'Real-time Sync' },
    { icon: 'shield', label: 'Secure Connection' },
    { icon: 'code', label: 'No Code Required' },
  ];

  readonly tabs = ['Overview', 'Features', 'How it works', 'Use cases', 'FAQ'];
  activeTab = 'Overview';

  /** Key features */
  readonly keyFeatures: ReadonlyArray<{
    icon: string;
    color: string;
    title: string;
    desc: string;
  }> = [
    {
      icon: 'calendar',
      color: '#C587CE',
      title: 'Post Scheduling',
      desc: 'Schedule Threads posts in advance and maintain a consistent presence.',
    },
    {
      icon: 'chat',
      color: '#3DAFA9',
      title: 'Engagement Management',
      desc: 'Monitor replies, likes, and mentions in one unified inbox.',
    },
    {
      icon: 'chart',
      color: '#E8A33D',
      title: 'Analytics & Insights',
      desc: 'Track impressions, engagement, profile visits, and more.',
    },
    {
      icon: 'users',
      color: '#F17C9F',
      title: 'Audience Growth',
      desc: 'Understand your audience and grow meaningful connections.',
    },
    {
      icon: 'hash',
      color: '#3772FF',
      title: 'Hashtag & Trend Tracking',
      desc: 'Discover trending topics and hashtags to boost reach.',
    },
    {
      icon: 'pen',
      color: '#C587CE',
      title: 'Content Management',
      desc: 'Create, organize, and manage your Threads content easily.',
    },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: '1. Connect', desc: 'Connect your Threads account securely.' },
    { icon: 'sliders', title: '2. Configure', desc: 'Choose settings and permissions.' },
    { icon: 'sync', title: '3. Sync', desc: "We'll sync your data in real-time." },
    {
      icon: 'calendar',
      title: '4. Create & Schedule',
      desc: 'Create and schedule your Threads posts.',
    },
    {
      icon: 'chart',
      title: '5. Analyze & Grow',
      desc: 'Track performance and grow your presence.',
    },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'megaphone',
      title: 'Brand Building',
      desc: 'Increase brand awareness and visibility.',
    },
    {
      icon: 'users',
      title: 'Community Engagement',
      desc: 'Engage with your audience and build loyalty.',
    },
    {
      icon: 'rocket',
      title: 'Product Launches',
      desc: 'Promote new products and drive excitement.',
    },
    { icon: 'headset', title: 'Customer Support', desc: 'Respond to queries and build trust.' },
    {
      icon: 'handshake',
      title: 'Influencer Collaborations',
      desc: 'Collaborate and grow your reach.',
    },
  ];

  readonly aboutChecklist = [
    'Post Scheduling',
    'Engagement Management',
    'Analytics & Insights',
    'Hashtag & Trend Tracking',
    'Content Management',
  ];
  readonly requirements = [
    'Threads Account',
    'Instagram Account linked to Threads',
    'Read & Write Permissions',
    'Internet connection',
  ];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
