import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { switchMap, timeout } from 'rxjs';
import { ResourcesService } from './resources.service';
import { InstituteService } from './institute.service';
import { VisitorCounter } from '../../shared/models/models';

const VISITOR_KEY = 'ces_site_visitor';
/** Check in this often while the page is in view - the API counts a browser as online for 2 minutes. */
const CHECK_IN_MS = 60 * 1000;
/** Coming back to the tab checks in at once, unless the last check-in was this recent. */
const MIN_GAP_MS = 30 * 1000;

/**
 * The footer's visitor counter (Website Management → Visitor Counter). In the browser it checks in
 * when the site opens and once a minute while the page is in view: that counts the visit (once a
 * day per browser, worked out by the API) and keeps this browser in "online now", and each answer
 * refreshes the numbers. `counter` stays null on the server, while loading, when the institute has
 * the counter switched off, or if the first request fails (later failures keep the last numbers).
 */
@Injectable({ providedIn: 'root' })
export class VisitorCounterService {
  private readonly resources = inject(ResourcesService);
  private readonly institute = inject(InstituteService);
  private readonly zone = inject(NgZone);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;
  private lastCheckIn = 0;
  private visitor?: string;

  readonly counter = signal<VisitorCounter | null>(null);

  /** Start checking in (once; later calls do nothing). Server-side it does nothing at all. */
  start(): void {
    if (!this.browser || this.started) return;
    this.started = true;
    // Outside Angular's zone: a never-ending timer inside it would keep the app from ever settling.
    this.zone.runOutsideAngular(() => {
      this.checkIn();
      setInterval(() => {
        if (document.visibilityState === 'visible') this.checkIn();
      }, CHECK_IN_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && Date.now() - this.lastCheckIn > MIN_GAP_MS) this.checkIn();
      });
    });
  }

  private checkIn(): void {
    this.lastCheckIn = Date.now();
    this.institute
      .resolve()
      .pipe(
        switchMap((instituteId) => this.resources.visitorCheckIn(instituteId, this.visitorId())),
        timeout(8000),
      )
      .subscribe({
        next: (c) => this.counter.set(c?.show ? c : null),
        error: () => { /* keep the last numbers; the next check-in tries again */ },
      });
  }

  /** This browser's random id - only a keyed hash of it is stored, and only for two days. */
  private visitorId(): string {
    if (this.visitor) return this.visitor;
    try {
      this.visitor = localStorage.getItem(VISITOR_KEY) || undefined;
      if (!this.visitor || !/^[A-Za-z0-9-]{16,64}$/.test(this.visitor)) {
        this.visitor = newId();
        localStorage.setItem(VISITOR_KEY, this.visitor);
      }
    } catch {
      this.visitor ??= newId(); // storage unavailable (private mode) - one id for this visit
    }
    return this.visitor;
  }
}

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}
