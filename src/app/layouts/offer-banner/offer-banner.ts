import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  signal,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-offer-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-banner.html',
  styleUrl: './offer-banner.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OfferBanner implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  timeLeft = signal<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  private intervalId: any;

  // Example: 5 days 21 hours 8 min 23 sec
  private deadline = new Date(
    Date.now() + (5 * 86400 + 21 * 3600 + 8 * 60 + 23) * 1000
  );

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.tick();

    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private tick(): void {
    const diff = Math.max(0, this.deadline.getTime() - Date.now());

    this.timeLeft.set({
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    });
  }
}