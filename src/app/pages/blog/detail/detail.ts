import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-blog-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detail.scss',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);

  /** TODO: fetch the post by this slug once the blog API is wired. */
  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';

  readonly post = {
    title: 'CES Honored with Gujarat Education Leadership Award 2025',
    date: '22 July, 2026',
    author: 'CES Admin',
    category: 'News',
    image: PLACEHOLDER.blog.featured,
  };

  readonly intro: readonly string[] = [
    'We are proud to announce that Charotar Education Society has been conferred with the prestigious Gujarat Education Leadership Award 2025 in recognition of our outstanding contribution to quality education and holistic development.',
    'This award celebrates our unwavering commitment to academic excellence, innovation, research, and the overall development of students across our 31+ institutes.',
  ];

  readonly sections: ReadonlyArray<{ heading: string; paras: readonly string[] }> = [
    {
      heading: 'A Moment of Pride',
      paras: [
        'The award was presented at the Gujarat Education Leadership Summit 2025, where eminent educationists, policymakers, and industry leaders gathered to honor institutions that are shaping the future of education in the state.',
        'Receiving this award is a testament to the collective efforts of our faculty, staff, students, and management who continuously work towards building a brighter tomorrow.',
      ],
    },
    {
      heading: 'Our Commitment Continues',
      paras: [
        'This recognition strengthens our resolve to keep innovating and setting new benchmarks in education. We remain dedicated to empowering generations through knowledge, values, and opportunities.',
      ],
    },
  ];

  readonly quote = {
    text: 'Education is the most powerful tool that can transform individuals and society. We remain committed to excellence in all that we do.',
    source: '— Charotar Education Society',
  };

  readonly shares: ReadonlyArray<{ label: string; tone: string }> = [
    { label: 'Facebook', tone: 'bg-[#1877F2]' },
    { label: 'Twitter', tone: 'bg-[#1DA1F2]' },
    { label: 'LinkedIn', tone: 'bg-[#0A66C2]' },
    { label: 'WhatsApp', tone: 'bg-[#25D366]' },
  ];

  readonly prev = {
    slug: 'hands-on-learning',
    title: 'Hands-on Learning: The CES Approach to Practical Education',
    date: 'Jul 18, 2026',
    image: PLACEHOLDER.blog.posts[0],
  };

  readonly next = {
    slug: 'tree-plantation-drive',
    title: 'Tree Plantation Drive Across CES Campuses',
    date: 'Jul 25, 2026',
    image: PLACEHOLDER.blog.posts[1],
  };

  readonly categories: ReadonlyArray<{ label: string; count: number }> = [
    { label: 'News', count: 24 },
    { label: 'Events', count: 18 },
    { label: 'Achievements', count: 16 },
    { label: 'Academics', count: 22 },
    { label: 'Student Corner', count: 15 },
    { label: 'Research & Innovation', count: 12 },
    { label: 'Campus Life', count: 10 },
  ];

  readonly recent: ReadonlyArray<{ slug: string; title: string; date: string; image: string }> = [
    { slug: 'ces-honored-gujarat-education-leadership-award-2025', title: 'CES Honored with Gujarat Education Leadership Award 2025', date: 'Jul 22, 2026', image: PLACEHOLDER.blog.featured },
    { slug: 'hands-on-learning', title: 'Hands-on Learning: The CES Approach to Practical Education', date: 'Jul 18, 2026', image: PLACEHOLDER.blog.posts[0] },
    { slug: 'tree-plantation-drive', title: 'Tree Plantation Drive Across CES Campuses', date: 'Jul 15, 2026', image: PLACEHOLDER.blog.posts[1] },
    { slug: 'national-robotics-championship', title: 'CES Students Excel at National Robotics Championship', date: 'Jul 10, 2026', image: PLACEHOLDER.blog.posts[2] },
    { slug: 'expert-talk-ai-future-of-work', title: 'Expert Talk on AI & The Future of Work', date: 'Jul 05, 2026', image: PLACEHOLDER.blog.posts[3] },
  ];

  search = '';
}
