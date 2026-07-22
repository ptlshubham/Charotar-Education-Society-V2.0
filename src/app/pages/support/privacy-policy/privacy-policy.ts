import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { PRIVACY_POLICY_SECTIONS } from './privacy-policy.data';

@Component({
  selector: 'app-privacy-policy',
  imports: [LegalPage],
  templateUrl: './privacy-policy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  readonly sections = PRIVACY_POLICY_SECTIONS;
  readonly intro =
    'ZARKLYX PRIVATE LIMITED and its affiliate ZARKLYX LLC ("ZarklyX," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and share your personal information when you use our website and services (the "Service"). By accessing or using the Service, you agree to the collection and use of information in accordance with this policy.';
}
