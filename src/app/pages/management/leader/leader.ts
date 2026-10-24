import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SeoService } from '../../../core/services/seo.service';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { LEADERS, leaderByRole } from '../../../shared/leaders';
import { PageHero } from '../../../shared/page-hero/page-hero';

/**
 * One office-bearer's page (/management/chairman, /management/secretary): portrait beside the
 * message, the rest of the message full width and signed, then a profile beside an event photo,
 * two more photos side by side, and links on to the other leader and back to Management.
 */
@Component({
  selector: 'app-leader-page',
  imports: [NgTemplateOutlet, RouterLink, PageHero, AdmissionsCta],
  templateUrl: './leader.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './leader.scss',
})
export class LeaderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly heroImage = '/assets/images/hero/management.jpeg';

  private readonly role = toSignal(this.route.paramMap.pipe(map((p) => p.get('role'))), {
    initialValue: this.route.snapshot.paramMap.get('role'),
  });

  readonly leader = computed(() => leaderByRole(this.role()));
  /** The other office-bearer, for the "read next" link. */
  readonly other = computed(() => LEADERS.find((l) => l.role !== this.role()));
  /** Everything after the opening paragraph, which sits beside the portrait. */
  readonly rest = computed(() => this.leader()?.message.slice(1) ?? []);

  constructor() {
    effect(() => {
      const leader = this.leader();
      if (!leader) {
        // Only the two office-bearers have pages.
        this.router.navigateByUrl('/management');
        return;
      }
      this.seo.applyCustom(
        {
          title: `${leader.name}, ${leader.title}`,
          description: leader.quote,
          image: leader.photo,
          url: `/management/${leader.role}`,
        },
        'management',
      );
    });
  }
}
