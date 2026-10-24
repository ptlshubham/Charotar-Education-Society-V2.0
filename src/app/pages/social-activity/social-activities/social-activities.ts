import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACTIVITY_KIND, ActivityCategory, SOCIAL_ACTIVITIES, SocialActivity } from '../../../shared/social-activities';

/** One tab, or every activity at once ("View All Activities"). */
type View = ActivityCategory | 'all';

@Component({
  selector: 'app-social-activities',
  imports: [RouterLink],
  templateUrl: './social-activities.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './social-activities.scss',
})
export class SocialActivities {
  readonly tabs: ReadonlyArray<{ id: ActivityCategory; label: string; heading: string }> = [
    { id: 'activity', label: 'Activity', heading: 'Our Social Activities' },
    { id: 'initiative', label: 'Initiative', heading: 'Our Initiatives' },
    { id: 'camp', label: 'Camp', heading: 'Our Camps' },
  ];

  readonly view = signal<View>('activity');

  select(view: View): void {
    this.view.set(view);
  }

  readonly heading = computed(() => this.tabs.find((t) => t.id === this.view())?.heading ?? 'Our Social Activities');

  readonly visible = computed(() => {
    const view = this.view();
    return view === 'all' ? SOCIAL_ACTIVITIES : SOCIAL_ACTIVITIES.filter((a) => a.category === view);
  });

  /** Its own page, or wherever it lives (Chatkaro has a page of its own). */
  linkTo(item: SocialActivity): string | string[] {
    return item.link ?? [ACTIVITY_KIND.list.link, item.slug];
  }
}
