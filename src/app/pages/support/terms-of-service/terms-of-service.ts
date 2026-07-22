import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { TERMS_OF_SERVICE_SECTIONS } from './terms-of-service.data';

@Component({
  selector: 'app-terms-of-service',
  imports: [LegalPage],
  templateUrl: './terms-of-service.html',
  styleUrl: './terms-of-service.scss',
})
export class TermsOfService {
  readonly sections = TERMS_OF_SERVICE_SECTIONS;
  readonly intro =
    'These Terms of Service govern your access to and use of ZarklyX. Please read them carefully. By creating an account, subscribing to, or otherwise using the Service, you agree to be bound by these Terms, together with our <a href="/support/privacy-policy">Privacy Policy</a> and <a href="/support/refund-policy">Refund &amp; Cancellation Policy</a>.';
}
