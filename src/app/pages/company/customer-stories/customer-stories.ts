import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface Story {
  id: number;
  image: string;
  category: string;
  color: string;
  title: string;
  description: string;
  stats: [{ value: string; label: string }, { value: string; label: string }];
}

const PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

@Component({
  selector: 'app-customer-stories',
  imports: [SectionComingSoon],
  templateUrl: './customer-stories.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-stories.scss',
})
export class CustomerStories {
  /** Hero headline stats */
  readonly heroStats: ReadonlyArray<{ value: string; label: string }> = [
    { value: '21+', label: 'Growing Agencies' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '30%', label: 'Average Productivity Increase' },
  ];

  /** Filter categories (first is active by default) */
  readonly categories: ReadonlyArray<{ id: string; label: string }> = [
    { id: 'all', label: 'All Stories' },
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'technology', label: 'Technology' },
    { id: 'retail', label: 'Retail' },
    { id: 'services', label: 'Services' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance' },
    { id: 'education', label: 'Education' },
  ];

  activeCategory = 'all';

  readonly heroImage = PLACEHOLDER_IMAGE;

  /** Success stories grid */
  readonly stories: Story[] = [
    {
      id: 1,
      image: PLACEHOLDER_IMAGE,
      category: 'Manufacturing',
      color: '#3DAFA9',
      title: 'Ace Manufacturing improves production efficiency by 40% with ZarklyX',
      description:
        'Streamlined operations and real-time reporting helped Ace Manufacturing reduce downtime and boost output.',
      stats: [
        { value: '40%', label: 'Efficiency Increase' },
        { value: '25%', label: 'Cost Reduction' },
      ],
    },
    {
      id: 2,
      image: PLACEHOLDER_IMAGE,
      category: 'Technology',
      color: '#3DAFA9',
      title: 'TechNova scales support operations and saves 60+ hours weekly',
      description:
        'Unified ticketing and automation helped TechNova deliver faster support with a smaller team.',
      stats: [
        { value: '60+', label: 'Hours Saved' },
        { value: '35%', label: 'Faster Resolution' },
      ],
    },
    {
      id: 3,
      image: PLACEHOLDER_IMAGE,
      category: 'Retail',
      color: '#C587CE',
      title: 'ShopSmart increases sales by 28% with better customer engagement',
      description:
        'Centralized customer data and smart campaigns helped ShopSmart boost conversions and repeat sales.',
      stats: [
        { value: '28%', label: 'Sales Increase' },
        { value: '22%', label: 'Repeat Orders' },
      ],
    },
    {
      id: 4,
      image: PLACEHOLDER_IMAGE,
      category: 'Services',
      color: '#3DAFA9',
      title: 'Bright Consulting delivers 3x faster project delivery',
      description:
        'With ZarklyX, Bright Consulting standardized workflows and improved team collaboration.',
      stats: [
        { value: '3x', label: 'Faster Delivery' },
        { value: '50%', label: 'More Projects' },
      ],
    },
    {
      id: 5,
      image: PLACEHOLDER_IMAGE,
      category: 'Healthcare',
      color: '#3DAFA9',
      title: 'MediCare improves patient experience and reduces admin work',
      description:
        'Automated scheduling and patient communication improved satisfaction and reduced admin burden.',
      stats: [
        { value: '45%', label: 'Less Admin Work' },
        { value: '30%', label: 'Patient Satisfaction' },
      ],
    },
    {
      id: 6,
      image: PLACEHOLDER_IMAGE,
      category: 'Finance',
      color: '#3DAFA9',
      title: 'FinEdge reduces manual work by 70% with workflow automation',
      description:
        'Automation and approvals in ZarklyX helped FinEdge save time and minimize errors.',
      stats: [
        { value: '70%', label: 'Manual Work Reduced' },
        { value: '90%', label: 'Fewer Errors' },
      ],
    },
    {
      id: 7,
      image: PLACEHOLDER_IMAGE,
      category: 'Education',
      color: '#3DAFA9',
      title: 'EduBridge streamlines institute operations and boosts enrollment',
      description:
        'Better communication and inquiry management helped EduBridge increase enrollments.',
      stats: [
        { value: '31%', label: 'More Enrollments' },
        { value: '2x', label: 'Inquiry Response' },
      ],
    },
    {
      id: 8,
      image: PLACEHOLDER_IMAGE,
      category: 'Technology',
      color: '#3DAFA9',
      title: 'InnovaSoft enhances team productivity and collaboration',
      description:
        'Real-time dashboards and task management helped InnovaSoft stay aligned and productive.',
      stats: [
        { value: '55%', label: 'Productivity Boost' },
        { value: '40%', label: 'On-time Delivery' },
      ],
    },
  ];

  /** Pagination */
  readonly pages = [1, 2, 3, 4, 5];
  currentPage = 1;
}
