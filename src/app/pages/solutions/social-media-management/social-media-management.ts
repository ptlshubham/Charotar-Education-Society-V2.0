import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solutions-social-media-management',
  imports: [NgClass, RouterLink],
  templateUrl: './social-media-management.html',
  styleUrl: './social-media-management.scss',
})
export class SocialMediaManagement {
  readonly heroChecklist = [
    'Manage all your social accounts in one place',
    'Create and schedule content that engages',
    'Track performance and grow your audience',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = ['Overview', 'Accounts', 'Content', 'Calendar', 'Inbox', 'Analytics', 'Reports', 'Team', 'Settings'];
  readonly dashboardStats: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Total Followers', value: '52,685', change: '18.6%' },
    { label: 'Engagement Rate', value: '6.45%', change: '12.5%' },
    { label: 'Total Reach', value: '385.2K', change: '24.3%' },
    { label: 'Impressions', value: '1.2M', change: '20.8%' },
  ];
  readonly topPosts: ReadonlyArray<{ platform: string; color: string; title: string; date: string; value: string }> = [
    { platform: 'instagram', color: '#E1306C', title: 'Summer Collection Launch', date: 'May 18, 2026', value: '12.4K' },
    { platform: 'facebook', color: '#1877F2', title: 'New Blog Post Announcement', date: 'May 16, 2026', value: '8.7K' },
    { platform: 'linkedin', color: '#0A66C2', title: 'Industry Insights 2026', date: 'May 14, 2026', value: '6.3K' },
    { platform: 'x', color: '#0B2827', title: 'Weekend Inspiration', date: 'May 12, 2026', value: '4.9K' },
    { platform: 'tiktok', color: '#0B2827', title: 'Behind the Scenes', date: 'May 10, 2026', value: '3.8K' },
  ];

  readonly trustedLogos = ['noise', 'boAt', 'SUGAR', 'digit', 'zomato', 'mamaearth', 'CRED'];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'calendar', title: 'Content Planning', desc: 'Plan your content calendar, organize campaigns, and never miss a post.' },
    { icon: 'pen', title: 'Create & Customize', desc: 'Design stunning posts with built-in editor, templates, and AI assistance.' },
    { icon: 'send', title: 'Publish & Schedule', desc: 'Schedule posts for the best time and publish across multiple platforms.' },
    { icon: 'chat', title: 'Engage & Respond', desc: 'Manage all messages, comments, and mentions from one unified inbox.' },
    { icon: 'chart', title: 'Analytics & Reports', desc: 'Track performance, measure ROI, and get actionable insights.' },
    { icon: 'team', title: 'Team Collaboration', desc: 'Collaborate with your team, assign roles, and streamline approvals.' },
  ];

  /** "Real results" stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '35%', label: 'Increase in engagement' },
    { icon: 'userplus', value: '50%', label: 'Growth in followers' },
    { icon: 'clock', value: '75%', label: 'Time saved on content scheduling' },
    { icon: 'reply', value: '60%', label: 'Improvement in response time' },
  ];
}
