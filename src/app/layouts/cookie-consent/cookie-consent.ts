import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './cookie-consent.scss',
})
export class CookieConsent implements AfterViewInit {
  @ViewChild('cookieBanner') bannerRef!: ElementRef<HTMLElement>;
  @ViewChild('cookieBackdrop') backdropRef!: ElementRef<HTMLElement>;

  dismissed = signal(false);
  showPreferences = signal(false);

  // Toggle state for the preferences modal (cosmetic  see acceptEverything()).
  analyticsEnabled = signal(true);
  functionalEnabled = signal(true);
  marketingEnabled = signal(true);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Check if user already responded
    if (localStorage.getItem('cookie_consent')) {
      this.dismissed.set(true);
      return;
    }

    const banner = this.bannerRef.nativeElement;
    const backdrop = this.backdropRef.nativeElement;

    // Start hidden
    gsap.set(banner, { y: 120, autoAlpha: 0 });
    gsap.set(backdrop, { autoAlpha: 0 });

    // Slide in after 2.5 seconds (before coming-soon modal)
    gsap.to(backdrop, {
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power2.out',
      delay: 2.5,
    });
    gsap.to(banner, {
      y: 0,
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power3.out',
      delay: 2.5,
    });
  }

  accept(): void {
    this.acceptEverything();
  }

  reject(): void {
    this.acceptEverything();
  }

  /** Opens the detailed cookie preferences modal. */
  customize(): void {
    this.showPreferences.set(true);
  }

  /** Called by the buttons inside the preferences modal. */
  savePreferences(): void {
    this.acceptEverything();
  }

  /**
   * Every path (Accept All, Reject All, Save Preferences) stores "accepted"  all cookies are
   * accepted regardless of the choice, as required. The toggles are presentational only.
   */
  private acceptEverything(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie_consent', 'accepted');
    }
    this.showPreferences.set(false);
    this.animateOut();
  }

  private animateOut(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.to(this.bannerRef.nativeElement, {
      y: 120,
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power2.in',
    });
    gsap.to(this.backdropRef.nativeElement, {
      autoAlpha: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        this.dismissed.set(true);
        window.dispatchEvent(new CustomEvent('cookieConsentDismissed'));
      },
    });
  }
}
