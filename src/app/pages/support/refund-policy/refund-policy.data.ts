export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const REFUND_POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'Subscriptions and Billing',
    content: `ZarklyX is provided as a subscription service ("Subscription"). Depending on the plan you choose, you are billed on a recurring monthly or annual basis, and subscriptions renew automatically at the end of each billing cycle unless cancelled beforehand.

By subscribing, you authorize us (or our payment processor) to charge your payment method for the applicable fees, including any per-seat or per-client add-ons, until you cancel. Applicable taxes may be added where required by law.`,
    isOpen: false,
  },
  {
    title: 'Free Trial',
    content: `If your plan includes a free trial, you can evaluate ZarklyX during the trial period at no charge. You will not be billed if you cancel before the trial ends.

If you do not cancel before the trial period ends, your subscription will automatically begin and your payment method will be charged for the first billing cycle. Charges made after the trial converts are subject to the refund terms below.`,
    isOpen: false,
  },
  {
    title: 'Cancelling Your Subscription',
    content: `You can cancel your subscription at any time from your ZarklyX account settings under Billing, or by contacting our support team.

<strong>What happens when you cancel:</strong>
• Your cancellation stops the next automatic renewal.
• You will continue to have access to your paid features until the end of the current billing cycle you have already paid for.
• After the cycle ends, your account will move to a free/limited tier or be closed, and recurring billing will stop.

Cancelling does not automatically delete your data  see our Privacy Policy for information about data retention and deletion.`,
    isOpen: false,
  },
  {
    title: 'Refund Eligibility',
    content: `<strong>Money-Back Window:</strong> If you are not satisfied with a new paid subscription, you may request a full refund within <strong>14 days</strong> of your initial paid charge. This applies to your first purchase of a plan only.

<strong>Monthly Plans:</strong> Outside the money-back window, monthly fees are non-refundable. When you cancel, you keep access until the end of the current paid month, but partial months are not refunded.

<strong>Annual Plans:</strong> Outside the 14-day money-back window, annual fees are generally non-refundable for the remainder of the term. You may cancel to prevent the next renewal.

<strong>Add-Ons:</strong> Additional seats, client slots, or module add-ons follow the same terms as the plan they are attached to.`,
    isOpen: false,
  },
  {
    title: 'Non-Refundable Charges',
    content: `The following are generally not eligible for a refund:
• Charges older than the 14-day money-back window
• Renewal charges for subscriptions you did not cancel before the renewal date
• Fees for a billing period that has already been used
• One-time setup, onboarding, or professional-services fees, once the work has been delivered
• Charges where our terms of service have been violated`,
    isOpen: false,
  },
  {
    title: 'How to Request a Refund',
    content: `To request a refund, contact us using the details in the Contact Information section below, or from your account, and include:
• The email address associated with your ZarklyX account
• The plan and the charge you are requesting a refund for
• The reason for your request (optional, but it helps us improve)

We review each request and will let you know whether it qualifies under this policy, usually within a few business days.`,
    isOpen: false,
  },
  {
    title: 'Refund Processing',
    content: `Approved refunds are issued to your original payment method. Once approved, please allow <strong>5–10 business days</strong> for the refund to appear, depending on your bank or payment provider. We are not responsible for delays caused by the payment provider.`,
    isOpen: false,
  },
  {
    title: 'Plan Changes and Downgrades',
    content: `You can upgrade or downgrade your plan at any time.
• <strong>Upgrades</strong> take effect immediately, and the difference may be charged on a prorated basis.
• <strong>Downgrades</strong> take effect at the start of your next billing cycle. Downgrading does not generate a refund for the current cycle, and reducing seats, client slots, or modules may limit access to certain features and data.`,
    isOpen: false,
  },
  {
    title: 'Failed Payments and Involuntary Cancellation',
    content: `If a renewal payment fails, we may retry the charge and notify you. If payment cannot be completed after a reasonable period, your subscription may be suspended or downgraded to a free/limited tier. Restoring access requires a successful payment. We are not obligated to provide credits or refunds for periods during which a subscription was suspended for non-payment.`,
    isOpen: false,
  },
  {
    title: 'Chargebacks',
    content: `If you have a billing concern, please contact us first  we are happy to help. Initiating a chargeback or payment dispute without contacting us may result in immediate suspension of your account while the dispute is resolved. If a chargeback is found to be invalid, we reserve the right to recover the disputed amount and any associated fees.`,
    isOpen: false,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Refund & Cancellation Policy from time to time. Any changes will be posted on this page with an updated revision date. The policy in effect at the time of your purchase applies to that purchase. By continuing to use the Service after changes are made, you accept the revised policy.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `If you have any questions about this Refund & Cancellation Policy or wish to request a refund, please contact us:

<strong>ZarklyX Support</strong>
Email: support@zarklyx.com
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
