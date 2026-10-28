import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CookieConsent } from '../cookie-consent/cookie-consent';
import { ScrollToTop } from '../scroll-to-top/scroll-to-top';
import { AiAssistant } from '../ai-assistant/ai-assistant';
import { SubscribeSuccessModal } from '../../shared/subscribe-success-modal/subscribe-success-modal';
import { SuccessDialog } from '../../shared/success-dialog/success-dialog';
import { Lightbox } from '../../shared/lightbox/lightbox';
import { PageFaq } from '../../shared/page-faq/page-faq';
import { LenisService } from '../../core/services/lenis.service';
import { HeaderBannersService } from '../../core/services/header-banners.service';
import { HeaderAds } from '../header/header-ads/header-ads';
import { NoInternet } from '../../pages/error/no-internet/no-internet';
import { SitePopup } from '../site-popup/site-popup';
import { ConnectionService } from '../../core/services/connection.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    Header,
    Footer,
    CookieConsent,
    ScrollToTop,
    AiAssistant,
    SubscribeSuccessModal,
    SuccessDialog,
    Lightbox,
    PageFaq,
    HeaderAds,
    NoInternet,
    SitePopup,
  ],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  private readonly lenis = inject(LenisService);
  private readonly router = inject(Router);
  /** The header banners (a site-wide notice), for the strip under the header on smaller screens. */
  readonly headerBanners = inject(HeaderBannersService);
  /** Whether the connection is down, for the No Internet screen. */
  readonly connection = inject(ConnectionService);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Browser only  start Lenis after the first render.
    afterNextRender(() => {
      this.lenis.init();

      // Jump to top instantly on route change (keeps Lenis in sync with the new page).
      const sub = this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => this.lenis.scrollTo(0, { immediate: true }));

      destroyRef.onDestroy(() => sub.unsubscribe());
    });

    destroyRef.onDestroy(() => this.lenis.destroy());
  }
}
