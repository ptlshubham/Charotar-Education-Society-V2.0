import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IntegrationSidebar } from '../integration-sidebar/integration-sidebar';

@Component({
  selector: 'app-instagram-integration',
  imports: [NgClass, RouterLink, IntegrationSidebar],
  templateUrl: './instagram.html',
  styleUrl: './instagram.scss',
})
export class InstagramIntegration {
  readonly igGradient = 'linear-gradient(45deg,#F09433,#E6683C,#DC2743,#CC2366,#BC1888)';

  readonly heroChecklist = [
    'Sync messages and comments in real-time',
    'Schedule and publish stunning content',
    'Track engagement and grow your audience',
  ];

  readonly statCards: ReadonlyArray<{ label: string; value: string; change: string; color: string; points: string }> = [
    { label: 'Followers', value: '12.8K', change: '18.6%', color: '#3DAFA9', points: '0,13 8,10 16,12 24,7 32,9 40,4 48,6' },
    { label: 'Engagement', value: '2.6K', change: '22.4%', color: '#C587CE', points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3' },
    { label: 'Impressions', value: '98.3K', change: '16.3%', color: '#E1306C', points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4' },
    { label: 'Profile Visits', value: '3.4K', change: '15.7%', color: '#E8A33D', points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4' },
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
    { icon: 'chat', color: '#E1306C', title: 'Direct Messages & Comments', desc: 'Manage Instagram DMs and comments from your unified inbox.' },
    { icon: 'calendar', color: '#3DAFA9', title: 'Content Scheduling', desc: 'Schedule posts, Reels, and Stories at the perfect time.' },
    { icon: 'chart', color: '#3772FF', title: 'Advanced Analytics', desc: 'Track engagement, reach, impressions, and audience growth.' },
    { icon: 'users', color: '#E8A33D', title: 'Audience Insights', desc: 'Get deep insights into your audience and their behavior.' },
    { icon: 'image', color: '#3772FF', title: 'Media Management', desc: 'Organize and manage all your media assets in one place.' },
    { icon: 'bookmark', color: '#F17C9F', title: 'Hashtag & Caption Suggestions', desc: 'Get AI-powered suggestions to boost your content performance.' },
  ];

  /** How it works steps */
  readonly howItWorks: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'link', title: 'Connect', desc: 'Authorize your Instagram Business or Creator Account.' },
    { icon: 'sync', title: 'Select Assets', desc: 'Choose the Instagram account and assets you want to sync.' },
    { icon: 'gear', title: 'Configure', desc: 'Set permissions and map data to start syncing.' },
    { icon: 'refresh', title: 'Sync Data', desc: "We'll sync your messages, comments, and insights in real-time." },
    { icon: 'chart', title: 'Take Action', desc: 'Manage, engage, and grow your Instagram presence from ZarklyX.' },
  ];

  /** Use cases */
  readonly useCases: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'users', title: 'Influencer Marketing', desc: 'Collaborate with influencers and track campaign performance.' },
    { icon: 'chat', title: 'Customer Support', desc: 'Respond to DMs and comments quickly to improve customer experience.' },
    { icon: 'play', title: 'Content Creators', desc: 'Manage content, track analytics, and grow your community easily.' },
    { icon: 'cart', title: 'E-commerce', desc: 'Promote products, drive traffic, and increase sales from Instagram.' },
    { icon: 'megaphone', title: 'Brand Building', desc: 'Build brand awareness and engage your audience effectively.' },
  ];

  readonly aboutChecklist = ['Instagram DMs & Comments', 'Content Scheduling', 'Stories & Reels Publishing', 'Advanced Analytics', 'Audience & Profile Insights'];
  readonly requirements = ['Instagram Business or Creator Account', 'Admin access to Instagram Account', 'Facebook Page connected (optional)', 'Internet connection'];
  readonly resources: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'book', title: 'Integration Guide', desc: 'Step-by-step setup instructions' },
    { icon: 'code', title: 'API Documentation', desc: 'Technical reference for developers' },
    { icon: 'star', title: 'Best Practices', desc: 'Tips to get the most out of integration' },
    { icon: 'wrench', title: 'Troubleshooting', desc: 'Common issues and solutions' },
  ];
}
