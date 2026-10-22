import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { SeoService } from '../../core/services/seo.service';

/**
 * "Frequently asked questions" at the foot of any page whose SEO entry has FAQs
 * (super admin → SEO Management → AI Search & Assistants).
 *
 * The same questions go out as FAQPage JSON-LD (SeoService). Search engines only accept
 * FAQ markup for text visible on the page, so this block is what makes that markup legit.
 * Answers sit in native <details>, so they are in the HTML even while collapsed - non-JS
 * AI crawlers read them from the prerendered page.
 */
@Component({
  selector: 'app-page-faq',
  templateUrl: './page-faq.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PageFaq {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);

  /** The seoKey of the route actually on screen - its own, never a parent's. */
  private readonly activeKey = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.deepestSeoKey()),
      startWith(this.deepestSeoKey()),
    ),
    { initialValue: null },
  );

  readonly faqs = computed(() => {
    const { pageKey, faqs } = this.seo.pageFaqs();
    const key = this.activeKey();
    return key && key === pageKey ? faqs : [];
  });

  private deepestSeoKey(): string | null {
    let node: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (node.firstChild) node = node.firstChild;
    return (node.routeConfig?.data?.['seoKey'] as string | undefined) ?? null;
  }
}
