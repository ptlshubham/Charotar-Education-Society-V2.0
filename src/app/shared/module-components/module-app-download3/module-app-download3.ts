import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'module-app-download3',
  imports: [],
  templateUrl: './module-app-download3.html',
  styleUrl: './module-app-download3.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAppDownload3 {
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
