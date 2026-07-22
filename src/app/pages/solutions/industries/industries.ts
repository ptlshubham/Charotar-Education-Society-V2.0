import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-industries',
  imports: [NgClass, RouterLink],
  templateUrl: './industries.html',
  styleUrl: './industries.scss',
})
export class Industries {
  /** Dashboard mockup data */
  readonly dashboardNav = ['Overview', 'Customers', 'Analytics', 'Campaigns', 'Reports', 'Integrations', 'Settings'];
  readonly dashboardStats: ReadonlyArray<{ label: string; value: string; change: string }> = [
    { label: 'Total Customers', value: '18,254', change: '18.6%' },
    { label: 'Revenue Generated', value: '₹24,75,000', change: '22.4%' },
    { label: 'Active Campaigns', value: '152', change: '15.3%' },
    { label: 'Engagement Rate', value: '6.45%', change: '12.8%' },
  ];
  readonly perfLegend: ReadonlyArray<{ label: string; color: string; points: string }> = [
    { label: 'Retail', color: '#3DAFA9', points: '0,44 33,40 66,42 100,30 133,34 166,20 200,10' },
    { label: 'Healthcare', color: '#C587CE', points: '0,48 33,44 66,46 100,38 133,40 166,30 200,22' },
    { label: 'Education', color: '#3772FF', points: '0,50 33,48 66,44 100,42 133,36 166,34 200,26' },
    { label: 'Finance', color: '#E8A33D', points: '0,52 33,50 66,48 100,46 133,42 166,40 200,34' },
    { label: 'Real Estate', color: '#22B8CF', points: '0,54 33,52 66,50 100,48 133,46 166,44 200,40' },
  ];

  /** Industry cards */
  readonly industries: ReadonlyArray<{ icon: string; color: string; title: string; desc: string }> = [
    { icon: 'bag', color: '#3DAFA9', title: 'Retail & E-commerce', desc: 'Boost sales, personalize customer experiences, and increase repeat purchases.' },
    { icon: 'heart', color: '#F17C9F', title: 'Healthcare', desc: 'Improve patient engagement, streamline communication, and deliver better care.' },
    { icon: 'education', color: '#3772FF', title: 'Education', desc: 'Engage students, simplify administration, and enhance learning outcomes.' },
    { icon: 'bank', color: '#E8A33D', title: 'Finance & Banking', desc: 'Build trust, ensure compliance, and deliver personalized financial experiences.' },
    { icon: 'building', color: '#3DAFA9', title: 'Real Estate', desc: 'Generate quality leads, showcase properties, and close deals faster.' },
    { icon: 'bell', color: '#F17C9F', title: 'Hospitality', desc: 'Enhance guest experiences, manage bookings, and increase guest loyalty.' },
    { icon: 'factory', color: '#3DAFA9', title: 'Manufacturing', desc: 'Optimize operations, improve supply chain visibility, and increase productivity.' },
    { icon: 'truck', color: '#E8A33D', title: 'Logistics & Transport', desc: 'Track shipments, optimize routes, and deliver on time, every time.' },
    { icon: 'megaphone', color: '#C587CE', title: 'Media & Entertainment', desc: 'Engage audiences, manage content, and grow your brand presence.' },
    { icon: 'nonprofit', color: '#3772FF', title: 'Non-Profit', desc: 'Drive impact, engage communities, and increase donor retention.' },
  ];

  /** "How ZarklyX helps" strip */
  readonly helpItems: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'workflow', title: 'Industry-specific workflows', desc: 'Pre-built templates and automations' },
    { icon: 'scale', title: 'Scalable & flexible solutions', desc: 'Grow without limits as your business grows' },
    { icon: 'chart', title: 'Actionable insights & analytics', desc: 'Make data-driven decisions with confidence' },
    { icon: 'puzzle', title: 'Seamless integrations', desc: 'Connect with the tools you already use' },
    { icon: 'shield', title: 'Enterprise-grade security', desc: 'Keep your data safe and compliant' },
  ];

  readonly trustedLogos = ['zomato', 'Apollo', "BYJU'S", 'HDFC BANK', 'DLF', 'makemytrip', 'PATANJALI'];
}
