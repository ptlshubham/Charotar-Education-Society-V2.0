import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Article {
  tag: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
}

@Component({
  selector: 'app-news-events',
  imports: [RouterLink],
  templateUrl: './news-events.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './news-events.scss',
})
export class NewsEvents {
  readonly featured: readonly Article[] = [
    {
      tag: 'Academics',
      image: PLACEHOLDER.news.classes,
      date: 'May 10, 2025',
      title: 'Attend Classes Regularly & Stay Focused',
      excerpt:
        'Consistent attendance and active participation are the first steps towards academic excellence.',
    },
    {
      tag: 'Tips & Guides',
      image: PLACEHOLDER.news.examTips,
      date: 'May 18, 2025',
      title: '10 Powerful Exam Study Tips for Guaranteed Success',
      excerpt:
        'Discover proven study techniques that help students stay focused, score better and achieve their academic goals.',
    },
  ];

  readonly compact: readonly Article[] = [
    { tag: 'Events', date: 'Apr 28, 2025', title: 'Annual Day Celebration 2025', excerpt: 'A Day to Remember!', image: PLACEHOLDER.news.annualDay },
    { tag: 'Research', date: 'May 06, 2025', title: 'CES Research Projects', excerpt: 'Driving Innovation', image: PLACEHOLDER.news.research },
    { tag: 'Achievements', date: 'May 01, 2025', title: 'Our Students Shine', excerpt: 'In State-Level Competitions', image: PLACEHOLDER.news.achievements },
  ];
}
