import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SeoService } from '../../../core/services/seo.service';
import { relatedTo } from '../../../shared/programme';
import { ProgrammePage } from '../../../shared/programme-page/programme-page';
import { ACTIVITY_KIND, CATEGORY_LABEL, SOCIAL_ACTIVITIES, activityBySlug } from '../../../shared/social-activities';

/** One social activity's page (/social-activity/chatkaro, /social-activity/red-cross, ...). */
@Component({
  selector: 'app-activity-detail',
  imports: [ProgrammePage],
  templateUrl: './activity-detail.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './activity-detail.scss',
})
export class ActivityDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly kind = ACTIVITY_KIND;
  readonly categoryLabel = CATEGORY_LABEL;

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  readonly activity = computed(() => activityBySlug(this.slug()));

  /** Three more, of the same type first. */
  readonly more = computed(() => {
    const activity = this.activity();
    return activity ? relatedTo(SOCIAL_ACTIVITIES, activity, (a) => a.category) : [];
  });

  constructor() {
    effect(() => {
      const activity = this.activity();
      if (!activity) {
        this.router.navigateByUrl('/social-activity');
        return;
      }
      this.seo.applyCustom(
        {
          title: activity.title,
          description: activity.desc,
          image: activity.heroImage ?? activity.image,
          // An activity that is one of our projects tells the same story as the project's page.
          url: activity.project ? `/project/${activity.project}` : `/social-activity/${activity.slug}`,
        },
        'social-activity',
      );
    });
  }
}
