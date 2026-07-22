import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'module-app-download2',
  imports: [],
  templateUrl: './module-app-download2.html',
  styleUrl: './module-app-download2.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAppDownload2 {
  /** Section title */
  @Input() title = '';

  /** Section description */
  @Input() description = '';

  /** Phone mockup image */
  @Input() phoneImage = '';

  /** App Store link */
  @Input() appStoreLink = '';

  /** Play Store link */
  @Input() playStoreLink = '';

  /** QR code image */
  @Input() qrCodeImage = '';
}
