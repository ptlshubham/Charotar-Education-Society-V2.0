import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../layouts/section-coming-soon/section-coming-soon';

interface Episode {
  ep: number;
  overlay: string;
  title: string;
  desc: string;
  host: string;
  role: string;
  duration: string;
  accent: string;
}

@Component({
  selector: 'app-podcast',
  imports: [SectionComingSoon],
  templateUrl: './podcast.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './podcast.scss',
})
export class Podcast {
  readonly featured = {
    title: 'Building Scalable Agencies in 2026',
    guest: 'Rohit Sharma',
    duration: '32:45',
  };

  readonly platforms: ReadonlyArray<{ name: string; icon: string }> = [
    { name: 'Spotify', icon: 'spotify' },
    { name: 'Apple Podcasts', icon: 'apple' },
    { name: 'Google Podcasts', icon: 'google' },
    { name: 'YouTube', icon: 'youtube' },
  ];

  readonly episodes: Episode[] = [
    {
      ep: 48,
      overlay: 'Building Scalable Agencies in 2026',
      title: 'Building Scalable Agencies in 2026',
      desc: 'Rohit Sharma shares proven frameworks to scale operations, build strong teams, and increase profitability.',
      host: 'Rohit Sharma',
      role: 'Agency Growth Expert',
      duration: '32:45',
      accent: '#1f6b52',
    },
    {
      ep: 47,
      overlay: 'The Future of Social Media Marketing',
      title: 'The Future of Social Media Marketing',
      desc: 'Neha Verma on emerging trends, content strategies, and platform insights to stay ahead in 2026.',
      host: 'Neha Verma',
      role: 'Social Media Strategist',
      duration: '28:12',
      accent: '#6b5bd0',
    },
    {
      ep: 46,
      overlay: 'Automate More, Grow Faster',
      title: 'Automate More, Grow Faster',
      desc: 'Karan Mehta explains how automation saves time, reduces costs, and drives business growth.',
      host: 'Karan Mehta',
      role: 'Automation Specialist',
      duration: '26:18',
      accent: '#2f6fb0',
    },
    {
      ep: 45,
      overlay: 'Financial Clarity for Agency Owners',
      title: 'Financial Clarity for Agency Owners',
      desc: 'Learn how to read your numbers, improve cash flow, and make confident financial decisions.',
      host: 'Amit Sharma',
      role: 'Finance Advisor',
      duration: '31:07',
      accent: '#3a7d6e',
    },
  ];

  readonly topics: ReadonlyArray<{ icon: string; color: string; title: string; count: number }> = [
    { icon: 'chart', color: '#3DAFA9', title: 'Agency Growth', count: 12 },
    { icon: 'megaphone', color: '#C587CE', title: 'Marketing Strategies', count: 10 },
    { icon: 'gear', color: '#3DAFA9', title: 'Operations & Automation', count: 9 },
    { icon: 'users', color: '#F17C9F', title: 'Sales & Client Success', count: 8 },
    { icon: 'team', color: '#3772FF', title: 'Leadership & Teams', count: 7 },
    { icon: 'dollar', color: '#E8A33D', title: 'Finance & Pricing', count: 6 },
  ];

  readonly testimonials: ReadonlyArray<{ quote: string; name: string; role: string }> = [
    {
      quote:
        'The ZarklyX Podcast is my go-to resource for practical strategies I can implement immediately.',
      name: 'Priya S.',
      role: 'Marketing Agency Owner',
    },
    {
      quote:
        'Every episode is packed with valuable insights from experts who truly understand our challenges.',
      name: 'Rahul M.',
      role: 'Digital Strategist',
    },
    {
      quote:
        "I've implemented so many ideas from the podcast that have helped me scale my agency to the next level.",
      name: 'Sneha K.',
      role: 'Founder, Creative Studio',
    },
  ];
}
