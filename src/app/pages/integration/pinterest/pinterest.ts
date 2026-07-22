import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-pinterest-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './pinterest.html',
  styleUrl: './pinterest.scss',
})
export class PinterestIntegration {
  readonly pinColor = '#E60023';

  readonly heroChecklist = [
    'Schedule and publish Pins effortlessly',
    'Track performance with rich analytics',
    'Grow your audience and drive more website traffic',
  ];

  readonly statCards: ReadonlyArray<{ label: string; value: string; change: string; points: string }> = [
    { label: 'Impressions', value: '89.4K', change: '18.5%', points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6' },
    { label: 'Saves', value: '6.7K', change: '22.4%', points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3' },
    { label: 'Outbound Clicks', value: '4.2K', change: '16.9%', points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4' },
    { label: 'Engagements', value: '3.1K', change: '19.3%', points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4' },
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
    { icon: 'pin', color: '#E60023', title: 'Pin Scheduling', desc: 'Create and schedule Pins at the best time to maximize reach and engagement.' },
    { icon: 'folder', color: '#E8A33D', title: 'Board Management', desc: 'Manage your Pinterest boards directly from ZarklyX.' },
    { icon: 'chart', color: '#C587CE', title: 'Rich Analytics', desc: 'Track impressions, saves, clicks, engagements, and audience insights.' },
    { icon: 'trend', color: '#3DAFA9', title: 'Traffic & Conversions', desc: 'Drive more traffic to your website and measure conversion impact.' },
    { icon: 'compass', color: '#3772FF', title: 'Content Discovery', desc: 'Discover trending ideas and content to keep your audience inspired.' },
    { icon: 'team', color: '#F17C9F', title: 'Team Collaboration', desc: 'Collaborate with your team to plan, create, and publish content.' },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: 'Connect', desc: 'Connect your Pinterest Business account with ZarklyX securely.' },
    { icon: 'sliders', title: 'Select & Configure', desc: 'Choose boards, set preferences, and configure your content strategy.' },
    { icon: 'sync', title: 'Sync Data', desc: "We'll sync your boards, Pins, and analytics in real-time." },
    { icon: 'calendar', title: 'Schedule & Publish', desc: 'Create and schedule Pins at the best time to engage your audience.' },
    { icon: 'chart', title: 'Analyze & Optimize', desc: 'Track performance, gain insights, and optimize your Pinterest strategy.' },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'megaphone', title: 'Content Marketing', desc: 'Share inspiring content and drive more traffic to your blog or website.' },
    { icon: 'cart', title: 'E-commerce', desc: 'Promote products and boost catalog visibility with shoppable Pins.' },
    { icon: 'flag', title: 'Brand Awareness', desc: 'Build brand presence and engage new audiences consistently.' },
    { icon: 'chart', title: 'Lead Generation', desc: 'Drive targeted traffic and capture quality leads from Pinterest.' },
    { icon: 'image', title: 'Event Promotion', desc: 'Promote events, webinars, and launches with eye-catching Pins.' },
  ];

  readonly aboutChecklist = ['Pin Scheduling', 'Board Management', 'Analytics & Insights', 'Traffic Tracking', 'Team Collaboration'];
  readonly requirements = ['Pinterest Business Account', 'Pinterest API Access (via Developer Account)', 'Internet connection'];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
