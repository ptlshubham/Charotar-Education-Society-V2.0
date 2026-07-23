import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  day: string;
  month: string;
  year: string;
  readTime: string;
  image: string;
}

@Component({
  selector: 'app-blog-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './list.scss',
})
export class BlogList {
  readonly banner = PLACEHOLDER.blog.banner;

  readonly tabs: readonly string[] = [
    'All Posts', 'News', 'Events', 'Achievements', 'Student Corner', 'Research & Innovation',
  ];
  readonly tab = signal('All Posts');
  search = '';
  private readonly query = signal('');

  select(t: string): void {
    this.tab.set(t);
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
  }

  readonly featured: Post = {
    slug: 'ces-honored-gujarat-education-leadership-award-2025',
    title: 'CES Honored with Gujarat Education Leadership Award 2025',
    excerpt:
      'A proud moment for Charotar Education Society as we are recognized for our outstanding contribution to quality education and holistic development.',
    category: 'News',
    date: 'Jul 22, 2026',
    day: '22', month: 'JUL', year: '2026',
    readTime: '5 min read',
    image: PLACEHOLDER.blog.featured,
  };

  /** TODO: replace with the live blog feed. */
  readonly posts: readonly Post[] = [
    { slug: 'hands-on-learning', title: 'Hands-on Learning: The CES Approach to Practical Education', excerpt: 'How our institutes foster experiential learning and prepare students for real-world challenges.', category: 'Academics', date: 'Jul 18, 2026', day: '18', month: 'JUL', year: '2026', readTime: '4 min read', image: PLACEHOLDER.blog.posts[0] },
    { slug: 'tree-plantation-drive', title: 'Tree Plantation Drive Across CES Campuses', excerpt: 'Promoting sustainability and environmental responsibility through student-led initiatives.', category: 'Events', date: 'Jul 15, 2026', day: '15', month: 'JUL', year: '2026', readTime: '3 min read', image: PLACEHOLDER.blog.posts[1] },
    { slug: 'national-robotics-championship', title: 'CES Students Excel at National Robotics Championship', excerpt: 'Our team secured top honors at the national level with their innovative robotic solution.', category: 'Achievements', date: 'Jul 10, 2026', day: '10', month: 'JUL', year: '2026', readTime: '4 min read', image: PLACEHOLDER.blog.posts[2] },
    { slug: 'expert-talk-ai-future-of-work', title: 'Expert Talk on AI & The Future of Work', excerpt: 'Industry expert shares insights on emerging AI trends and career opportunities for students.', category: 'News', date: 'Jul 05, 2026', day: '05', month: 'JUL', year: '2026', readTime: '4 min read', image: PLACEHOLDER.blog.posts[3] },
    { slug: 'industrial-visit-isro', title: 'Industrial Visit to ISRO Ahmedabad', excerpt: 'Students explore space technology and gain insights into real-world applications.', category: 'Student Corner', date: 'Jun 28, 2026', day: '28', month: 'JUN', year: '2026', readTime: '3 min read', image: PLACEHOLDER.blog.posts[4] },
    { slug: 'academic-excellence-results-2025', title: 'Academic Excellence in Action: Results 2025', excerpt: 'Celebrating the hard work and dedication of our students across all institutes.', category: 'Academics', date: 'Jun 20, 2026', day: '20', month: 'JUN', year: '2026', readTime: '2 min read', image: PLACEHOLDER.blog.posts[5] },
  ];

  readonly visible = computed(() => {
    const t = this.tab();
    const q = this.query();
    return this.posts.filter(
      (p) =>
        (t === 'All Posts' || p.category === t) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
    );
  });

  readonly categories: ReadonlyArray<{ label: string; count: number; path: string[] }> = [
    { label: 'News', count: 24, path: ['M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z', 'M10 6h8M10 10h8M10 14h4'] },
    { label: 'Events', count: 18, path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { label: 'Achievements', count: 16, path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { label: 'Academics', count: 22, path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { label: 'Student Corner', count: 15, path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
    { label: 'Research & Innovation', count: 12, path: ['M9 2v6L4.5 17A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.3-4L15 8V2', 'M8 2h8'] },
    { label: 'Campus Life', count: 10, path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16'] },
  ];

  readonly recent = computed(() => [this.featured, ...this.posts].slice(0, 5));

  email = '';

  subscribe(): void {
    this.email = '';
  }
}
