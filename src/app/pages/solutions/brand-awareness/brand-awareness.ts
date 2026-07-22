import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-awareness',
  imports: [NgClass, RouterLink],
  templateUrl: './brand-awareness.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './brand-awareness.scss',
})
export class BrandAwareness {
  readonly heroChecklist = [
    'Track brand visibility and reach across channels',
    'Measure share of voice and audience perception',
    'Identify what drives awareness and brand recall',
    'Benchmark against competitors',
  ];

  /** Dashboard mockup data */
  readonly dashboardNav = [
    'Overview',
    'Brand Mentions',
    'Reach & Impressions',
    'Share of Voice',
    'Brand Recall',
    'Audience Insights',
    'Channels',
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
      label: 'Total Reach',
      value: '8.45M',
      change: '21.4%',
      color: '#3DAFA9',
      points: '0,14 8,10 16,12 24,6 32,9 40,4 48,7',
    },
    {
      label: 'Impressions',
      value: '24.3M',
      change: '18.7%',
      color: '#3772FF',
      points: '0,12 8,13 16,8 24,10 32,5 40,7 48,3',
    },
    {
      label: 'Share of Voice',
      value: '23.6%',
      change: '5.8%',
      color: '#C587CE',
      points: '0,13 8,9 16,11 24,7 32,8 40,5 48,4',
    },
    {
      label: 'Brand Mentions',
      value: '32.7K',
      change: '19.6%',
      color: '#E8A33D',
      points: '0,10 8,12 16,7 24,9 32,6 40,8 48,4',
    },
  ];

  /** Share of Voice donut segments */
  readonly sovSegments: ReadonlyArray<{
    label: string;
    value: string;
    color: string;
    dash: string;
    offset: string;
  }> = [
    { label: 'Your Brand', value: '23.6%', color: '#3DAFA9', dash: '23.6 76.4', offset: '25' },
    { label: 'Competitor A', value: '18.2%', color: '#3772FF', dash: '18.2 81.8', offset: '1.4' },
    { label: 'Competitor B', value: '14.7%', color: '#C587CE', dash: '14.7 85.3', offset: '-16.8' },
    { label: 'Others', value: '43.5%', color: '#E8A33D', dash: '43.5 56.5', offset: '-31.5' },
  ];

  readonly trustedLogos = ['boAt', 'zomato', 'NYKAA', 'mamaearth', 'SWIGGY', 'MAKEMYTRIP', 'CRED'];

  /** Feature cards */
  readonly features: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'chat',
      title: 'Brand Visibility',
      desc: 'Track how often and where your brand appears across digital, social, news, and other channels.',
    },
    {
      icon: 'compare',
      title: 'Share of Voice',
      desc: "Measure your brand's presence compared to competitors across topics and channels.",
    },
    {
      icon: 'users',
      title: 'Brand Recall',
      desc: 'Understand how easily people remember and recognize your brand through surveys and insights.',
    },
    {
      icon: 'chart',
      title: 'Audience Perception',
      desc: 'Analyze sentiment and perception to see how your brand is viewed by your target audience.',
    },
    {
      icon: 'trophy',
      title: 'Channel Performance',
      desc: 'Identify which channels and content drive the most awareness and engagement.',
    },
    {
      icon: 'doc',
      title: 'Reports & Alerts',
      desc: 'Get real-time alerts and customizable reports to stay on top of your brand awareness goals.',
    },
  ];

  /** "Awareness that makes an impact" stats */
  readonly impactStats: ReadonlyArray<{ icon: string; value: string; label: string }> = [
    { icon: 'chart', value: '32%', label: 'Increase in brand visibility' },
    { icon: 'search', value: '28%', label: 'Growth in organic search volume' },
    { icon: 'clock', value: '45%', label: 'Improvement in brand recall' },
    { icon: 'shield', value: '21%', label: 'Increase in positive brand sentiment' },
    { icon: 'users', value: '2.3x', label: 'Higher engagement on brand content' },
  ];
}
