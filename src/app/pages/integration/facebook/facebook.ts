import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-facebook-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './facebook.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './facebook.scss',
})
export class FacebookIntegration {
  readonly fbColor = '#1877F2';

  readonly heroChecklist = [
    'Sync leads and messages in real-time',
    'Manage Facebook Ads and audiences',
    'Track performance with advanced analytics',
  ];

  readonly statCards: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Leads', value: '1,248', change: '' },
    { label: 'Messages', value: '324', change: '' },
    { label: 'Ad Spend', value: '$1,245', change: '18.6%' },
    { label: 'Engagement', value: '2.8K', change: '22.4%' },
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
      icon: 'chat',
      color: '#1877F2',
      title: 'Manage Messages',
      desc: 'Reply to Facebook Page messages directly from ZarklyX inbox and never miss a lead.',
    },
    {
      icon: 'users',
      color: '#3DAFA9',
      title: 'Lead Generation',
      desc: 'Capture leads from Facebook Leads Ads and sync them automatically.',
    },
    {
      icon: 'megaphone',
      color: '#C587CE',
      title: 'Facebook Ads',
      desc: 'Create, manage and optimize Facebook Ads without leaving ZarklyX.',
    },
    {
      icon: 'chart',
      color: '#E8A33D',
      title: 'Advanced Analytics',
      desc: 'Track ad performance, engagement and ROI with powerful reports.',
    },
    {
      icon: 'team',
      color: '#3DAFA9',
      title: 'Audience Sync',
      desc: 'Sync custom audiences and lookalike audiences seamlessly.',
    },
    {
      icon: 'calendar',
      color: '#F17C9F',
      title: 'Post & Content Management',
      desc: 'Publish and schedule posts to your Facebook Page.',
    },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'link',
      title: 'Connect',
      desc: 'Click Connect Facebook and authorize your Facebook account.',
    },
    {
      icon: 'sync',
      title: 'Select Assets',
      desc: 'Choose the Facebook Page, Ad Account or assets you want to sync.',
    },
    {
      icon: 'gear',
      title: 'Configure',
      desc: 'Set permissions and map fields to start sharing data.',
    },
    {
      icon: 'check',
      title: 'Sync Data',
      desc: 'Your data is synced in real-time and ready to use.',
    },
    {
      icon: 'chart',
      title: 'Take Action',
      desc: 'Manage, engage and track performance from your ZarklyX dashboard.',
    },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'headset',
      title: 'Customer Support',
      desc: 'Respond to Facebook messages faster and improve customer satisfaction.',
    },
    {
      icon: 'users',
      title: 'Lead Nurturing',
      desc: 'Automatically capture and nurture leads from Facebook campaigns, sent to sync.',
    },
    {
      icon: 'cart',
      title: 'E-commerce',
      desc: 'Increase sales by running targeted ads and retargeting audiences.',
    },
    {
      icon: 'thumbsup',
      title: 'Brand Engagement',
      desc: 'Boost engagement by managing posts and interactions in one place.',
    },
  ];

  readonly aboutChecklist = [
    'Facebook Page & Messages',
    'Facebook Lead Ads',
    'Facebook Ads Management',
    'Audience & Insights',
    'Post Publishing',
  ];
  readonly requirements = [
    'Facebook Page Admin access',
    'Valid Facebook Ad Account (optional)',
    'Internet connection',
  ];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
