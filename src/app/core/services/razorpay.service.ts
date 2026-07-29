import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/** Options passed to the Razorpay Checkout constructor. */
export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler?: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}

@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);
  private static readonly SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
  private loading?: Promise<boolean>;

  /** Injects the Razorpay Checkout script once. Resolves false on the server or if it fails to load. */
  load(): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);
    const win = this.doc.defaultView as (Window & { Razorpay?: unknown }) | null;
    if (win?.Razorpay) return Promise.resolve(true);
    if (this.loading) return this.loading;

    this.loading = new Promise<boolean>((resolve) => {
      const script = this.doc.createElement('script');
      script.src = RazorpayService.SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        this.loading = undefined;
        resolve(false);
      };
      this.doc.body.appendChild(script);
    });
    return this.loading;
  }

  /** Opens the Checkout modal. Call load() first. */
  open(options: RazorpayOptions): void {
    const win = this.doc.defaultView as
      | (Window & { Razorpay?: new (o: RazorpayOptions) => { open: () => void } })
      | null;
    if (!win?.Razorpay) return;
    new win.Razorpay(options).open();
  }
}
