import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageHero } from '../../../shared/page-hero/page-hero';
import { POLICIES, POLICIES_UPDATED, Policy } from '../policies.data';

/**
 * One component serves all five policy pages, in the chaptered layout of Our History: a sticky
 * "On this page" list beside the sections on desktop (a scrolling row on phones) that tracks the
 * section in view. The route supplies `data: { policy: '<key>' }`; the copy is in policies.data.ts.
 */
@Component({
  selector: 'app-policy-page',
  imports: [RouterLink, PageHero],
  templateUrl: './policy-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './policy-page.scss',
})
export class PolicyPage {
  private readonly document = inject(DOCUMENT);

  readonly hero = '/assets/images/hero/about.webp';
  readonly updated = POLICIES_UPDATED;

  readonly policy: Policy;
  /** The other four, linked at the foot of the page. */
  readonly others: readonly Policy[];

  /** The section currently in view, for the "On this page" list. */
  readonly current = signal('');

  readonly contact = {
    address: 'D. N. High School Campus, Station Road, Anand – 388001, Gujarat, India',
    phone: '(02692) 243083',
    phoneHref: 'tel:+912692243083',
    email: 'cesociety@cesociety.in',
  };

  constructor() {
    const key = inject(ActivatedRoute).snapshot.data['policy'] as string;
    this.policy = POLICIES.find((p) => p.key === key) ?? POLICIES[0];
    this.others = POLICIES.filter((p) => p !== this.policy);
    this.current.set(this.policy.sections[0].id);

    // Track the section in view (the one crossing the upper third of the screen).
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) this.current.set(entry.target.id);
        },
        { rootMargin: '-30% 0px -65% 0px' },
      );
      for (const s of this.policy.sections) {
        const el = this.document.getElementById(s.id);
        if (el) observer.observe(el);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** "01", "02"… for the section markers. */
  num(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  external(link: string): boolean {
    return /^https?:\/\//.test(link);
  }

  /** Smooth-scrolls to a section (the sections' scroll margin keeps it clear of the sticky header). */
  jump(event: Event, id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.current.set(id);
  }
}
