import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { POLICIES } from '../policies.data';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

/**
 * One component serves all five policy pages. The route supplies
 * `data: { policy: '<key>' }`; everything else comes from policies.data.ts.
 */
@Component({
  selector: 'app-policy-page',
  imports: [RouterLink],
  templateUrl: './policy-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './policy-page.scss',
})
export class PolicyPage {
  private readonly route = inject(ActivatedRoute);

  readonly banner = PLACEHOLDER.about.hero;

  readonly policy = computed(() => {
    const key = this.route.snapshot.data['policy'] as string;
    return POLICIES.find((p) => p.key === key) ?? POLICIES[0];
  });

  /** Index of the section highlighted in the left rail. */
  readonly activeSection = signal(0);

  select(i: number): void {
    this.activeSection.set(i);
    if (typeof document === 'undefined') return;
    document.getElementById(`policy-section-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  readonly contact = {
    address: 'D. N. High School Campus, Station Road, Anand – 388001, Gujarat, India',
    phone: '(02692) – 243083',
    phoneHref: 'tel:02692243083',
    email: 'info@cesociety.in',
  };
}
