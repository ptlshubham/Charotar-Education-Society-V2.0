import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { DATA_DELETION_SECTIONS } from './data-deletion.data';

@Component({
  selector: 'app-data-deletion',
  imports: [LegalPage],
  templateUrl: './data-deletion.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './data-deletion.scss',
})
export class DataDeletion {
  readonly sections = DATA_DELETION_SECTIONS;
  readonly intro =
    'You are in control of your data. This page explains how to delete your ZarklyX account, your stored data, and any information obtained from third-party platforms you have connected. It should be read together with our <a href="/support/privacy-policy">Privacy Policy</a>.';
}
