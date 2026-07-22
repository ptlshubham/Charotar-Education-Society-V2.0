import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'module-app-download1',
  imports: [],
  templateUrl: './module-app-download1.html',
  styleUrl: './module-app-download1.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ModuleAppDownload1 {
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
