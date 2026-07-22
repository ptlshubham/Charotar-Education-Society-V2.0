import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-social-insights',
  imports: [NgClass, RouterLink],
  templateUrl: './social-insights.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-insights.scss',
})
export class SocialInsights {
  readonly heroChecklist = [
    'Track brand mentions and conversations',
    'Analyze sentiment and audience behavior',
    'Benchmark performance against competitors',
    'Discover trends and growth opportunities',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = [
    'Overview',
    'Mentions',
    'Sentiment',
    'Audience',
    'Topics',
    'Competitors',
    'Reports',
    'Alerts',
    'Settings',
  ];
  readonly dashboardStats: ReadonlyArray<{
    label: string;
    value: string;
    change: string;
    color: string;
    points: string;
  }> = [
    {
      label: 'Total Mentions',
      value: '24.8K',
      change: '18.6%',
      color: '#C587CE',
      points: '0,14 8,10 16,12 24,6 32,9 40,4 48,7',
    },
    {
      label: 'Positive Sentiment',
      value: '68%',
      change: '12.3%',
      color: '#3DAFA9',
      points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3',
    },
    {
      label: 'Potential Reach',
      value: '3.2M',
      change: '24.1%',
      color: '#3772FF',
      points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4',
    },
    {
      label: 'Engagement',
      value: '126K',
      change: '20.7%',
      color: '#E8A33D',
      points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4',
    },
  ];

  readonly trustedLogos = ['CRED', 'boAt', 'zomato', 'SWIGGY', 'makemytrip', 'NYKAA'];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'chat',
      title: 'Social Listening',
      desc: 'Monitor brand mentions, keywords, hashtags, and conversations across all major platforms.',
    },
    {
      icon: 'smile',
      title: 'Sentiment Analysis',
      desc: 'Understand audience sentiment with advanced AI-powered sentiment detection.',
    },
    {
      icon: 'users',
      title: 'Audience Insights',
      desc: 'Discover demographics, interests, behaviors, and engagement patterns of your audience.',
    },
    {
      icon: 'chart',
      title: 'Trend Discovery',
      desc: 'Identify emerging trends and topics to stay ahead of the competition and industry shifts.',
    },
    {
      icon: 'trophy',
      title: 'Competitor Benchmarking',
      desc: 'Compare your brand performance with competitors and identify growth opportunities.',
    },
    {
      icon: 'doc',
      title: 'Custom Reports',
      desc: 'Create beautiful, shareable reports and automate insights delivery for your team.',
    },
  ];

  /** "Smarter insights" stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '35%', label: 'Increase in brand engagement' },
    { icon: 'chat', value: '50%', label: 'Faster response to emerging trends' },
    { icon: 'pie', value: '40%', label: 'Improvement in campaign performance' },
    { icon: 'users', value: '2.5x', label: 'Better ROI with data-driven social strategies' },
  ];
}
