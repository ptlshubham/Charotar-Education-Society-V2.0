import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { WEBSITE_TERMS_SECTIONS } from './website-terms.data';

@Component({
  selector: 'app-website-terms',
  imports: [LegalPage],
  templateUrl: './website-terms.html',
  styleUrl: './website-terms.scss',
})
export class WebsiteTerms {
  readonly sections = WEBSITE_TERMS_SECTIONS;
  readonly intro =
    'These Website Terms of Use govern your access to and use of the ZarklyX website. Your use of the ZarklyX product is governed separately by our <a href="/support/terms-of-service">Terms of Service</a>. By using this Website, you agree to these Website Terms.';
}
