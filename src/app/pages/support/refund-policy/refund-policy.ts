import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { REFUND_POLICY_SECTIONS } from './refund-policy.data';

@Component({
  selector: 'app-refund-policy',
  imports: [LegalPage],
  templateUrl: './refund-policy.html',
  styleUrl: './refund-policy.scss',
})
export class RefundPolicy {
  readonly sections = REFUND_POLICY_SECTIONS;
  readonly intro =
    'ZARKLYX PRIVATE LIMITED and its affiliate ZARKLYX LLC ("ZarklyX," "we," "our," or "us") wants you to be satisfied with your subscription. This Refund & Cancellation Policy explains how subscriptions renew, how you can cancel, and when you may be eligible for a refund. By subscribing to the Service, you agree to the terms set out below.';
}
