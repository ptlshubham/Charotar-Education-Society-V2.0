export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const TERMS_OF_SERVICE_SECTIONS: PolicySection[] = [
  {
    title: 'Acceptance of Terms',
    content: `These Terms of Service ("Terms") govern your access to and use of the ZarklyX website, applications, and services (collectively, the "Service"), provided by ZARKLYX PRIVATE LIMITED and its affiliate ZARKLYX LLC ("ZarklyX," "we," "our," or "us").

By creating an account, subscribing to, or otherwise using the Service, you agree to be bound by these Terms and by our Privacy Policy and Refund & Cancellation Policy, which are incorporated by reference. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization, and "you" refers to that organization. If you do not agree to these Terms, do not use the Service.`,
    isOpen: false,
  },
  {
    title: 'Description of the Service',
    content: `ZarklyX is an all-in-one operations platform for agencies and businesses that may include, depending on your plan, CRM and client management, project and task management, HR, attendance and payroll, accounting and invoicing, social media management, SEO tools, cloud storage, reporting, and integrations with third-party platforms.

We may add, change, or remove features over time to improve the Service. We will use reasonable efforts to notify you of material changes that significantly reduce core functionality of a plan you are paying for.`,
    isOpen: false,
  },
  {
    title: 'Eligibility and Accounts',
    content: `To use the Service, you must be at least 18 years old (or the age of majority in your jurisdiction) and capable of forming a binding contract.

<strong>Account Registration:</strong> You agree to provide accurate, current, and complete information and to keep it up to date.
<strong>Account Security:</strong> You are responsible for safeguarding your login credentials and for all activity that occurs under your account. Notify us promptly of any unauthorized use or security breach.
<strong>Team Members and Roles:</strong> If you add team members, you are responsible for their access and for assigning appropriate role-based permissions. You are responsible for the actions of all users in your workspace.`,
    isOpen: false,
  },
  {
    title: 'Subscriptions, Billing, and Renewals',
    content: `Paid features are offered on a subscription basis and may include per-seat or per-client pricing. Subscriptions renew automatically for the same term unless cancelled before the renewal date, and you authorize us to charge your payment method for the applicable fees and taxes.

Cancellations, refund eligibility, free trials, plan changes, and failed payments are governed by our <strong>Refund &amp; Cancellation Policy</strong>. Fees may change; we will give reasonable notice before a price change affects your renewal.`,
    isOpen: false,
  },
  {
    title: 'Acceptable Use',
    content: `You agree not to use the Service to:
• Violate any applicable law, regulation, or third-party rights
• Upload or transmit malware, or attempt to disrupt, damage, or gain unauthorized access to the Service or its infrastructure
• Send spam or unsolicited messages, or violate the terms or policies of any connected third-party platform
• Infringe intellectual property, or publish unlawful, defamatory, or harmful content
• Reverse engineer, resell, or misuse the Service beyond the rights granted in these Terms
• Exceed rate limits or use automated means to access the Service in a way that harms it or other users

We may investigate and take appropriate action, including suspending or terminating accounts, for violations of this section.`,
    isOpen: false,
  },
  {
    title: 'Your Content and Data',
    content: `<strong>Ownership:</strong> You retain all rights to the content, files, client records, and other data you submit to the Service ("Your Content"). We do not claim ownership of Your Content.

<strong>License to Operate:</strong> You grant ZarklyX a limited, non-exclusive license to host, process, transmit, and display Your Content solely as necessary to provide and improve the Service and to enable the features you use, including sending content to third-party platforms you connect.

<strong>Your Responsibility:</strong> You are responsible for Your Content and for having the necessary rights and consents to store and process it in the Service, including any personal data of your clients, employees, or team members, in compliance with applicable law.`,
    isOpen: false,
  },
  {
    title: 'Third-Party Integrations',
    content: `The Service lets you connect third-party platforms (such as Google, Meta, LinkedIn, Pinterest, X, YouTube, WhatsApp, and Dropbox). Your use of those platforms is governed by their own terms and privacy policies, and your access to their data through ZarklyX depends on the permissions you grant.

We are not responsible for third-party services, and we may modify or discontinue an integration if a provider changes or removes its access. How connected data is handled is described in our Privacy Policy.`,
    isOpen: false,
  },
  {
    title: 'Intellectual Property',
    content: `The Service, including its software, design, branding, logos, and content (excluding Your Content), is owned by ZarklyX or its licensors and is protected by intellectual property laws. Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable right to access and use the Service for your internal business purposes during your subscription.

You may not copy, modify, distribute, sell, or create derivative works from any part of the Service except as expressly permitted. The "ZarklyX" name and logo may not be used without our prior written consent.`,
    isOpen: false,
  },
  {
    title: 'Privacy',
    content: `Our collection and use of personal information in connection with the Service is described in our <strong>Privacy Policy</strong>. By using the Service, you acknowledge that you have read and understood the Privacy Policy.`,
    isOpen: false,
  },
  {
    title: 'Service Availability and Changes',
    content: `We work to keep the Service available and reliable but do not guarantee uninterrupted or error-free operation. The Service may be temporarily unavailable due to maintenance, updates, or factors beyond our control. We may modify, suspend, or discontinue features at any time, and will use reasonable efforts to notify you of material changes.`,
    isOpen: false,
  },
  {
    title: 'Suspension and Termination',
    content: `<strong>By You:</strong> You may stop using the Service and cancel your subscription at any time as described in the Refund &amp; Cancellation Policy.

<strong>By Us:</strong> We may suspend or terminate your access if you breach these Terms, fail to pay fees, or use the Service in a way that poses a risk to us, other users, or third parties.

<strong>Effect of Termination:</strong> On termination, your right to use the Service ends. We will make Your Content available for export for a reasonable period where practicable, after which it may be deleted in accordance with our Privacy Policy. Provisions that by their nature should survive termination (such as intellectual property, disclaimers, and limitation of liability) will survive.`,
    isOpen: false,
  },
  {
    title: 'Disclaimers',
    content: `The Service is provided on an "as is" and "as available" basis, without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will meet your requirements, be uninterrupted, secure, or error-free, or that results obtained from it will be accurate or reliable. ZarklyX is a tool to support your operations and does not provide legal, tax, accounting, or professional advice.`,
    isOpen: false,
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, ZarklyX and its affiliates, officers, employees, and suppliers will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising out of or related to your use of (or inability to use) the Service.

To the maximum extent permitted by law, our total aggregate liability for any claim arising out of or related to the Service will not exceed the amount you paid to ZarklyX for the Service in the twelve (12) months preceding the event giving rise to the claim.`,
    isOpen: false,
  },
  {
    title: 'Indemnification',
    content: `You agree to indemnify and hold harmless ZarklyX and its affiliates from and against any claims, damages, liabilities, and expenses (including reasonable legal fees) arising out of or related to Your Content, your use of the Service, your violation of these Terms, or your violation of any law or third-party rights.`,
    isOpen: false,
  },
  {
    title: 'Governing Law and Disputes',
    content: `These Terms are governed by and construed in accordance with the laws of India, without regard to its conflict-of-law principles. You agree that the courts located in Gujarat, India will have exclusive jurisdiction over any dispute arising out of or relating to these Terms or the Service, unless otherwise required by applicable law. Before initiating any formal dispute, you agree to first contact us to seek a good-faith resolution.`,
    isOpen: false,
  },
  {
    title: 'Changes to These Terms',
    content: `We may update these Terms from time to time. Any changes will be posted on this page with an updated revision date, and material changes may be communicated to you directly. By continuing to use the Service after changes take effect, you accept the revised Terms. If you do not agree to the changes, you should stop using the Service.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `If you have any questions about these Terms of Service, please contact us:

<strong>ZarklyX Support</strong>
Email: support@zarklyx.com
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
