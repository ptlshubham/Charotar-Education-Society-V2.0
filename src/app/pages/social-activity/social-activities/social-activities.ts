import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

type Category = 'activity' | 'initiative' | 'camp';

interface Activity {
  title: string;
  desc: string;
  category: Category;
  image: string;
  path: string[];
}

@Component({
  selector: 'app-social-activities',
  templateUrl: './social-activities.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-activities.scss',
})
export class SocialActivities {
  readonly tabs: ReadonlyArray<{ id: Category; label: string; heading: string; path: string[] }> = [
    {
      id: 'activity',
      label: 'Activity',
      heading: 'Our Social Activities',
      path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
    },
    {
      id: 'initiative',
      label: 'Initiative',
      heading: 'Our Initiatives',
      path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
    },
    {
      id: 'camp',
      label: 'Camp',
      heading: 'Our Camps',
      path: ['M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M12 11v6M9 14h6'],
    },
  ];

  readonly active = signal<Category>('activity');

  select(id: Category): void {
    this.active.set(id);
  }

  readonly heading = computed(
    () => this.tabs.find((t) => t.id === this.active())?.heading ?? 'Our Social Activities',
  );

  /**
   * Category split is inferred from each programme's nature — health camps under
   * `camp`, partnerships and standing programmes under `initiative`. Change the
   * `category` field if CES classifies them differently.
   */
  readonly activities: readonly Activity[] = [
    {
      title: 'Performing Arts Activities',
      desc: 'Encouraging creativity and artistic talent through music, dance, theatre, drawing and more.',
      category: 'activity',
      image: PLACEHOLDER.social.activities[0],
      path: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
    },
    {
      title: 'Opportunities in Sports',
      desc: 'Promoting a culture of sportsmanship through training, tournaments and state & national level participation.',
      category: 'activity',
      image: PLACEHOLDER.social.activities[1],
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z', 'M2 12h20'],
    },
    {
      title: 'Organic & Food Festival – Chatkaro',
      desc: 'Promoting healthy living and sustainable food habits through organic and traditional food festivals.',
      category: 'activity',
      image: PLACEHOLDER.social.activities[2],
      path: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'],
    },
    {
      title: 'Left-over Food Distribution',
      desc: 'Reducing food waste and spreading happiness by distributing nutritious food to the needy.',
      category: 'activity',
      image: PLACEHOLDER.social.activities[3],
      path: ['M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2', 'M5 2v20M16 2v20M16 12h4a2 2 0 0 0 0-10h-4z'],
    },
    {
      title: 'Staff Health Check-up Camps',
      desc: 'Regular health check-ups for all staff members to ensure well-being and healthy lives.',
      category: 'camp',
      image: PLACEHOLDER.social.activities[4],
      path: ['M22 12h-4l-3 9L9 3l-3 9H2'],
    },
    {
      title: 'Tie-up with Red Cross Society',
      desc: 'Collaborating with the Red Cross Society for blood donation drives and emergency relief support.',
      category: 'initiative',
      image: PLACEHOLDER.social.activities[5],
      path: ['M12 2v20M2 12h20'],
    },
    {
      title: 'Project Anandam',
      desc: 'Promoting mental peace and stress free living through counselling, yoga and awareness sessions.',
      category: 'initiative',
      image: PLACEHOLDER.social.activities[6],
      path: ['M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M12 8v6', 'M6 22c0-4 2.7-6 6-6s6 2 6 6', 'M4 13h4M16 13h4'],
    },
    {
      title: 'Tie-up with Shivani Foundation',
      desc: 'Supporting underprivileged children with education, healthcare and essential resources.',
      category: 'initiative',
      image: PLACEHOLDER.social.activities[7],
      path: ['M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z', 'M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1'],
    },
  ];

  readonly visible = computed(() =>
    this.activities.filter((a) => a.category === this.active()),
  );
}
