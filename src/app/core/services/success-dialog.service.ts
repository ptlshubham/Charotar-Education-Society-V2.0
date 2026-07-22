import { Injectable, signal } from '@angular/core';

export interface SuccessDialogAction {
  label: string;
  /** routerLink target; if omitted the button just closes the dialog */
  link?: string;
  /** filled (dark gradient) vs outline */
  primary?: boolean;
}

export interface SuccessDialogConfig {
  /** Heading, split so the accent part renders in the brand colour, e.g. "Message" + "sent!" */
  titleLead: string;
  titleAccent?: string;
  subtitle?: string;
  /** Optional "What's next?" info box */
  infoTitle?: string;
  infoText?: string;
  /** Buttons  defaults to a single primary "Close" */
  actions?: SuccessDialogAction[];
}

/**
 * Shared success popup. Call `open(config)` from anywhere to show the common
 * confirmation modal (envelope + check illustration) with custom copy.
 */
@Injectable({ providedIn: 'root' })
export class SuccessDialogService {
  readonly config = signal<SuccessDialogConfig | null>(null);

  open(config: SuccessDialogConfig): void {
    this.config.set(config);
  }

  close(): void {
    this.config.set(null);
  }
}
