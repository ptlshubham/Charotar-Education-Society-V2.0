import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface JobPosition {
  id: number;
  icon: string;
  color: string;
  title: string;
  department: string;
  location: string;
  type: string;
  typeColor: string;
}

const PLACEHOLDER_IMAGE = '/assets/images/blog-placeholder.png';

@Component({
  selector: 'app-careers',
  imports: [SectionComingSoon],
  templateUrl: './careers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './careers.scss',
})
export class Careers {
  readonly heroImage = PLACEHOLDER_IMAGE;

  /** Company values shown in the ribbon under the hero */
  readonly values: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'people', title: 'People First', desc: 'We care about our people and their growth.' },
    {
      icon: 'rocket',
      title: 'Make an Impact',
      desc: 'Your work will help thousands of businesses.',
    },
    { icon: 'bulb', title: 'Innovate Always', desc: 'We encourage new ideas and better ways.' },
    {
      icon: 'heart',
      title: 'Work Together',
      desc: 'Collaboration and trust drive everything we do.',
    },
    {
      icon: 'growth',
      title: 'Grow Continuously',
      desc: 'Learn, upskill, and grow with us every day.',
    },
  ];

  /** Filter dropdown options */
  readonly departments = [
    'All Departments',
    'Engineering',
    'Design',
    'Customer Success',
    'Marketing',
  ];
  readonly locations = ['All Locations', 'Remote', 'On-site', 'Hybrid'];
  readonly employmentTypes = ['All Types', 'Full-time', 'Part-time', 'Contract'];

  /** Open positions */
  readonly positions: JobPosition[] = [
    {
      id: 1,
      icon: 'code',
      color: '#3DAFA9',
      title: 'Senior Angular Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      typeColor: '#3DAFA9',
    },
    {
      id: 2,
      icon: 'server',
      color: '#3DAFA9',
      title: 'Backend Node.js Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      typeColor: '#3DAFA9',
    },
    {
      id: 3,
      icon: 'pen',
      color: '#C587CE',
      title: 'Product Designer (UI/UX)',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      typeColor: '#3DAFA9',
    },
    {
      id: 4,
      icon: 'shield',
      color: '#E8A33D',
      title: 'QA Automation Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      typeColor: '#3DAFA9',
    },
    {
      id: 5,
      icon: 'people',
      color: '#F17C9F',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      typeColor: '#3DAFA9',
    },
    {
      id: 6,
      icon: 'megaphone',
      color: '#E8A33D',
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Part-time',
      typeColor: '#3772FF',
    },
  ];

  /** "Why work with us?" benefits */
  readonly benefits: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    { icon: 'remote', title: 'Flexible & Remote', desc: 'Work from anywhere with flexible hours.' },
    {
      icon: 'wellness',
      title: 'Health & Wellness',
      desc: 'Medical insurance and wellness programs for you.',
    },
    {
      icon: 'learning',
      title: 'Learning & Development',
      desc: 'Budget for courses, conferences and learning.',
    },
    {
      icon: 'career',
      title: 'Career Growth',
      desc: 'Clear path for growth and leadership opportunities.',
    },
    {
      icon: 'fun',
      title: 'Fun & Culture',
      desc: 'Team events, celebrations and a friendly culture.',
    },
  ];

  /** Life-at-ZarklyX culture gallery */
  readonly cultureImages: string[] = Array.from({ length: 4 }, () => PLACEHOLDER_IMAGE);
}
