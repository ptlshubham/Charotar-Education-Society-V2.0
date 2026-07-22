import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-linkedin-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './linkedin.html',
  styleUrl: './linkedin.scss',
})
export class LinkedinIntegration {
  readonly liColor = '#0A66C2';

  readonly heroChecklist = [
    'Publish and schedule posts with ease',
    'Track engagement and company page analytics',
    'Capture leads and grow your professional network',
  ];

  readonly statCards: ReadonlyArray<{ label: string; value: string; change: string; color: string; points: string }> = [
    { label: 'Impressions', value: '145.2K', change: '18.3%', color: '#3DAFA9', points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6' },
    { label: 'Engagements', value: '8.7K', change: '21.6%', color: '#C587CE', points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3' },
    { label: 'New Followers', value: '2.3K', change: '16.8%', color: '#3772FF', points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4' },
    { label: 'Clicks', value: '3.6K', change: '14.7%', color: '#E8A33D', points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4' },
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
    { icon: 'calendar', color: '#0A66C2', title: 'Post Scheduling', desc: 'Schedule posts, articles, and updates at the best time for your audience.' },
    { icon: 'chat', color: '#3DAFA9', title: 'Company Page Management', desc: 'Manage your LinkedIn Company Page posts and settings in one place.' },
    { icon: 'users', color: '#C587CE', title: 'Lead Generation', desc: 'Capture leads from LinkedIn and automatically sync to your CRM.' },
    { icon: 'chart', color: '#E8A33D', title: 'Analytics & Reporting', desc: 'Track impressions, clicks, engagement, and follower growth.' },
    { icon: 'doc', color: '#3DAFA9', title: 'Content Management', desc: 'Create, organize, and repurpose content that drives engagement.' },
    { icon: 'hash', color: '#3772FF', title: 'Employee Advocacy', desc: 'Empower your team to share content and expand your reach.' },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'plug', title: 'Connect', desc: 'Connect your LinkedIn Company Page securely.' },
    { icon: 'sliders', title: 'Select & Configure', desc: 'Choose page, set permissions and configure preferences.' },
    { icon: 'sync', title: 'Sync Data', desc: "We'll sync your content, leads, and analytics in real-time." },
    { icon: 'calendar', title: 'Take Action', desc: 'Schedule posts, engage with your audience, and capture quality leads.' },
    { icon: 'chart', title: 'Measure & Grow', desc: 'Track performance and grow your professional presence.' },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'megaphone', title: 'B2B Marketing', desc: 'Share thought leadership content and generate high-quality leads.' },
    { icon: 'headset', title: 'Recruitment', desc: 'Attract top talent and manage job postings efficiently.' },
    { icon: 'image', title: 'Brand Visibility', desc: 'Increase brand awareness through consistent company updates.' },
    { icon: 'calendar', title: 'Event Promotion', desc: 'Promote webinars, events and create more registrations.' },
    { icon: 'user', title: 'Thought Leadership', desc: 'Publish articles and position your brand as an industry leader.' },
  ];

  readonly aboutChecklist = ['Company Page Management', 'Post Scheduling', 'Lead Generation', 'Analytics & Insights', 'Employee Advocacy'];
  readonly requirements = ['LinkedIn Company Page Admin access', 'LinkedIn Account', 'Read & Write Permissions', 'Internet connection'];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
