import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-x-twitter-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './x-twitter.html',
  styleUrl: './x-twitter.scss',
})
export class XTwitterIntegration {
  readonly xColor = '#000000';

  readonly heroChecklist = [
    'Schedule and publish tweets effortlessly',
    'Engage with your audience in real-time',
    'Track performance with advanced analytics',
  ];

  readonly statCards: ReadonlyArray<{ label: string; value: string; change: string; color: string; points: string }> = [
    { label: 'Impressions', value: '245.6K', change: '18.7%', color: '#3DAFA9', points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6' },
    { label: 'Engagements', value: '18.3K', change: '21.4%', color: '#C587CE', points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3' },
    { label: 'Profile Visits', value: '6.2K', change: '15.9%', color: '#3772FF', points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4' },
    { label: 'Link Clicks', value: '3.1K', change: '13.2%', color: '#E8A33D', points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4' },
  ];
  readonly trustBadges: ReadonlyArray<{ icon: string; label: string }> = [
    { icon: 'sync', label: 'Real-time Sync' },
    { icon: 'shield', label: 'Secure Connection' },
    { icon: 'code', label: 'No Code Required' },
  ];

  readonly tabs = ['Overview', 'Features', 'How it works', 'Use cases', 'FAQ'];
  activeTab = 'Overview';

  /** Key features */
  readonly keyFeatures: ReadonlyArray<{ icon: string; color: string; title: string; desc: string }> = [
    { icon: 'send', color: '#3772FF', title: 'Tweet Scheduling', desc: 'Schedule tweets in advance and maintain a consistent presence.' },
    { icon: 'chat', color: '#3DAFA9', title: 'Direct Messages', desc: 'Manage and reply to DMs from your unified inbox.' },
    { icon: 'heart', color: '#F17C9F', title: 'Engagement Management', desc: 'Like, reply, retweet, and engage with your audience easily.' },
    { icon: 'chart', color: '#C587CE', title: 'Analytics & Insights', desc: 'Track impressions, engagements, and audience growth.' },
    { icon: 'users', color: '#E8A33D', title: 'Audience Growth', desc: 'Understand your audience and grow your followers.' },
    { icon: 'hash', color: '#3DAFA9', title: 'Hashtag & Trend Tracking', desc: 'Track top trends and hashtags to stay ahead.' },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: 'Connect', desc: 'Connect your X (Twitter) account securely.' },
    { icon: 'sliders', title: 'Select & Configure', desc: 'Choose accounts and configure preferences.' },
    { icon: 'sync', title: 'Sync Data', desc: "We'll sync your tweets, followers, and data in real-time." },
    { icon: 'calendar', title: 'Take Action', desc: 'Schedule tweets, engage with your audience, and manage everything.' },
    { icon: 'chart', title: 'Measure & Grow', desc: 'Track performance and optimize your social media strategy.' },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'megaphone', title: 'Brand Marketing', desc: 'Promote your brand and campaigns effectively.' },
    { icon: 'headset', title: 'Customer Support', desc: 'Respond to queries and engage with customers in real-time.' },
    { icon: 'calendar', title: 'Content Promotion', desc: 'Schedule and promote content to drive more traffic.' },
    { icon: 'chart', title: 'Lead Generation', desc: 'Use tweets and campaigns to generate quality leads.' },
    { icon: 'users', title: 'Community Building', desc: 'Engage with your audience and build a loyal community.' },
  ];

  readonly aboutChecklist = ['Tweet Scheduling', 'Engagement Management', 'Analytics & Insights', 'DM Management', 'Trend & Hashtag Tracking'];
  readonly requirements = ['X (Twitter) Account', 'Read & Write Permissions', 'Internet connection'];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
