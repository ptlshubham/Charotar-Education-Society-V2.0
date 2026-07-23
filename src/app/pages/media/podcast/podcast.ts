import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-podcast',
  templateUrl: './podcast.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './podcast.scss',
})
export class Podcast {
  readonly banner = PLACEHOLDER.media.podcastBanner;

  readonly pillars: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Inspiring Stories', body: 'Real journeys of success & struggle', path: ['M3 14v-2a9 9 0 0 1 18 0v2', 'M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z'] },
    { title: 'Expert Talks', body: 'Conversations with visionaries & educators', path: ['M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10a7 7 0 0 1-14 0', 'M12 17v5M8 22h8'] },
    { title: 'Student Voices', body: 'Ideas, innovation & campus experiences', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { title: 'Knowledge & Growth', body: 'Tips, motivation & thoughtful insights', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
  ];

  readonly featured: ReadonlyArray<{
    number: string;
    tag: string;
    title: string;
    desc: string;
    date: string;
    views: string;
    duration: string;
    image: string;
  }> = [
    {
      number: 'EPISODE 02',
      tag: 'Education',
      title: 'Interview with Champions of CES, the toppers of JEE Main 2025!',
      desc: 'Our talented students share their preparation strategies, challenges, and the support system that helped them achieve outstanding results.',
      date: 'May 28, 2025',
      views: '1.2K Views',
      duration: '32:45',
      image: PLACEHOLDER.media.episodes[0],
    },
    {
      number: 'EPISODE 01',
      tag: 'Achievement',
      title: 'Interview with Vaidevi Panchal, qualifier for National Rifle Shooting Competition!',
      desc: 'An inspiring conversation with Vaidevi Panchal on her journey, dedication, training and what it takes to aim for excellence.',
      date: 'Apr 22, 2025',
      views: '980 Views',
      duration: '28:16',
      image: PLACEHOLDER.media.episodes[1],
    },
  ];

  readonly categories: ReadonlyArray<{ label: string; count: string; path: string[]; active?: boolean }> = [
    { label: 'All Episodes', count: '12 Episodes', active: true, path: ['M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10a7 7 0 0 1-14 0', 'M12 17v5M8 22h8'] },
    { label: 'Education', count: '4 Episodes', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { label: 'Achievements', count: '3 Episodes', path: ['M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'm8.2 13.9-1.4 7.1 5.2-2.6 5.2 2.6-1.4-7.1'] },
    { label: 'Campus Life', count: '3 Episodes', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2'] },
    { label: 'Motivation', count: '2 Episodes', path: ['m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.4l7-.9z'] },
  ];

  readonly platforms: ReadonlyArray<{ label: string; sub: string; tone: string }> = [
    { label: 'Listen on Spotify', sub: 'Spotify', tone: 'text-[#1DB954]' },
    { label: 'Listen on YouTube', sub: 'YouTube', tone: 'text-[#FF0000]' },
    { label: 'Listen on Apple Podcasts', sub: 'Apple Podcasts', tone: 'text-[#9933CC]' },
  ];
}
