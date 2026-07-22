export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const BETA_POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'About the Beta Program',
    content: `ZarklyX is currently offered as a <strong>beta release</strong> ("Beta," "Beta Portal," or "Beta Service"). The Beta Portal is a pre-release environment made available so that you can explore the platform, evaluate its features, and share feedback with our team before general availability.

The Beta Portal is provided for <strong>evaluation and testing purposes only</strong>. It is not a finished product, it is not covered by any service level agreement, and it should not be treated as a live production system.

By creating an account on, accessing, or using the Beta Portal, you acknowledge that you have read and agree to this Beta Program Policy. If you do not agree, please do not use the Beta Portal.`,
    isOpen: false,
  },
  {
    title: 'Your Data Is Temporary',
    content: `<strong>All data you create in the Beta Portal is temporary.</strong> Anything you add during the beta period exists only for the lifetime of the beta environment and may be erased at any time, without prior notice and without the ability to recover it.

This includes, but is not limited to:
• Workspaces, organisations, and account settings
• Clients, contacts, leads, and CRM records
• Projects, tasks, boards, comments, and attachments
• Social media posts, drafts, schedules, and calendars
• Invoices, quotations, tokens, and billing test records
• Team members, roles, permissions, and invitations
• Uploaded files, images, documents, and media
• Reports, analytics, dashboards, and generated exports
• Connected third-party accounts and integration tokens

You should assume that <strong>every record you enter into the Beta Portal will eventually be deleted</strong>. Please do not treat the Beta Portal as a system of record.`,
    isOpen: false,
  },
  {
    title: 'Your Data Cannot Be Migrated',
    content: `<strong>Data created during the beta cannot be migrated, transferred, restored, or carried over into the production version of ZarklyX.</strong>

The beta runs on a separate, isolated environment with its own database and its own data structures. As the product evolves toward general availability, those structures change in ways that are not backward compatible. For this reason:
• Beta data <strong>will not</strong> be copied into your future production account.
• Beta accounts <strong>will not</strong> be automatically converted into production accounts.
• We <strong>do not</strong> offer an export-and-import path from beta into production.
• Recreating your beta content in production will be a <strong>manual process</strong> that you carry out yourself.

If you want to keep anything you produced during the beta, please <strong>export or record it independently before the beta ends</strong>. Where an export option exists in the interface, treat it as a convenience for your own records only  not as a migration path.`,
    isOpen: false,
  },
  {
    title: 'Scheduled Resets and Data Deletion',
    content: `The Beta Portal may be <strong>reset, rebuilt, or wiped at any time</strong> as part of ongoing development. A reset returns the environment to a clean state and permanently removes all accounts and content in it.

Resets may happen for many reasons, including deploying database changes, testing new modules, resolving defects, clearing test data, or preparing for general availability.

We will make reasonable efforts to announce a planned reset in advance, but <strong>we cannot guarantee notice</strong>. Unplanned resets may occur as a result of defects, infrastructure faults, or emergency maintenance.

At the conclusion of the beta program, the entire beta environment and <strong>all data within it will be permanently deleted</strong>. Deleted beta data is not recoverable from backups, and we are under no obligation to retain or restore it.`,
    isOpen: false,
  },
  {
    title: 'Not for Production or Business-Critical Use',
    content: `<strong>Do not use the Beta Portal to run your live business.</strong> It is not intended for, and must not be relied upon for, production, business-critical, or revenue-generating activity.

In particular, you should not use the Beta Portal:
• As the only place where important business records are stored
• To issue real invoices, quotations, or financial documents to your clients
• To publish, schedule, or manage live campaigns for real customers
• To store confidential, regulated, or business-critical information
• To store personal data of third parties beyond what is needed to evaluate the platform
• As a substitute for a backup, an archive, or an accounting system

You remain responsible for maintaining your own independent records and backups. Any decision you make in reliance on the Beta Portal is made at your own risk.`,
    isOpen: false,
  },
  {
    title: 'Sensitive and Personal Information',
    content: `Because beta data is temporary and the environment is under active development, you should <strong>limit what you upload</strong>.

Please do not submit to the Beta Portal:
• Payment card numbers, bank details, or other financial credentials
• Government identifiers, health records, or other sensitive personal data
• Confidential information belonging to your clients or employer
• Real end-customer personal data where sample or anonymised data would serve

Where you do choose to enter personal data, you confirm that you have the necessary rights and lawful basis to do so, and you remain the controller of that data. Our handling of personal information is described in our <a href="/support/privacy-policy">Privacy Policy</a>.`,
    isOpen: false,
  },
  {
    title: 'Availability, Stability, and Changes',
    content: `The Beta Portal is provided on an <strong>"as available"</strong> basis and may be unstable.

You should expect that:
• Features may be added, changed, or removed without notice
• The Service may be slow, interrupted, or unavailable for periods of time
• Defects, errors, and unexpected behaviour are likely to occur
• Calculations, reports, and analytics may be incomplete or inaccurate
• Integrations with third-party services may fail or be disconnected
• No service level agreement, uptime commitment, or support guarantee applies

We may modify, suspend, or discontinue the Beta Portal, in whole or in part, at any time and for any reason.`,
    isOpen: false,
  },
  {
    title: 'Bugs, Errors, and Limited Support',
    content: `The Beta Portal is software under active development, and <strong>you should expect to encounter bugs.</strong> Defects, broken screens, failed actions, missing data, incorrect results, and unexpected behaviour are a normal part of a beta release rather than an exception.

<strong>We do not guarantee full-fledged support during the beta.</strong> Support is offered on a best-effort basis only, which means:
• We do not commit to any response time or resolution time.
• We may not be able to answer every question or reproduce every issue.
• We may choose not to fix a reported bug, or to defer it until general availability.
• Support may be limited to certain hours, channels, or participants.
• No dedicated account manager, onboarding, or priority queue is provided.
• Assistance is not covered by any service level agreement.

Reporting a bug does not create an obligation for us to fix it, to fix it within any timeframe, or to compensate you for any impact it causes. <strong>We are not responsible for any loss, corruption, or inaccuracy of data caused by a defect in the Beta Portal.</strong>

If you do hit a problem, we would genuinely like to hear about it  please report it through our <a href="/support/feature-request">Feature Requests</a> page or by emailing <a href="mailto:connection@zarklyx.com">connection@zarklyx.com</a>. Your reports directly shape what we fix before release.`,
    isOpen: false,
  },
  {
    title: 'Accounts and Access',
    content: `Access to the Beta Portal may be limited, invitation-based, or granted at our discretion. We may decline, suspend, or revoke access to any account at any time, with or without notice or reason.

You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Please use a password that you do not reuse on any other service, and notify us promptly of any suspected unauthorised access.

Beta accounts confer no ongoing right to the Service. Having a beta account does not entitle you to a production account, to pricing concessions, or to continued access once the beta ends.`,
    isOpen: false,
  },
  {
    title: 'Third-Party Integrations',
    content: `The Beta Portal may allow you to connect third-party accounts, such as social media profiles, cloud storage, or other services.

When the beta environment is reset or retired, <strong>those connections are removed along with everything else</strong>, and any tokens issued to us are discarded. You may need to reconnect and re-authorise each integration from scratch in the production version.

Your use of any third-party service remains governed by that provider's own terms and policies. We are not responsible for the availability, behaviour, or data handling of third-party services, and integrations available during the beta may not be available at general availability.`,
    isOpen: false,
  },
  {
    title: 'Feedback',
    content: `Feedback is the purpose of the beta, and we welcome it. You may share bug reports, suggestions, feature requests, and other comments about the Beta Portal at any time.

By submitting feedback, you grant ZarklyX a perpetual, irrevocable, worldwide, royalty-free licence to use, reproduce, modify, and incorporate that feedback into our products and services <strong>without any obligation, attribution, or compensation to you</strong>.

Feedback is provided voluntarily. You should not send us any information that you consider confidential or proprietary, or that you are not free to share.`,
    isOpen: false,
  },
  {
    title: 'Confidentiality',
    content: `The Beta Portal may include unreleased features, designs, and functionality that are not publicly known. Unless we have announced them publicly, you agree to treat non-public aspects of the Beta Portal as <strong>confidential information</strong>.

You agree not to publicly disclose, demonstrate, benchmark, or publish screenshots or details of unreleased functionality without our prior written consent.

This obligation does not apply to information that is or becomes publicly available through no fault of yours, that you already lawfully knew, or that you are required to disclose by law.`,
    isOpen: false,
  },
  {
    title: 'Fees During the Beta',
    content: `Access to the Beta Portal is currently provided <strong>free of charge</strong> unless we have agreed otherwise with you in writing.

Any pricing, plan, subscription, or billing feature shown inside the Beta Portal is present for <strong>testing and illustration only</strong>. It does not represent a live charge, an offer, or a commitment to future pricing, and no real payment is taken.

Free access during the beta creates no entitlement to free or discounted access after general availability. Paid plans and final pricing will be published when the Service becomes generally available.`,
    isOpen: false,
  },
  {
    title: 'No Warranty',
    content: `THE BETA PORTAL IS PROVIDED <strong>"AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND</strong>, WHETHER EXPRESS, IMPLIED, OR STATUTORY.

To the fullest extent permitted by law, ZarklyX disclaims all warranties, including any implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, and any warranties arising from course of dealing or usage of trade.

We do not warrant that the Beta Portal will be uninterrupted, secure, error-free, or that any data you enter will be preserved, accurate, or retrievable.`,
    isOpen: false,
  },
  {
    title: 'Limitation of Liability',
    content: `To the fullest extent permitted by law, ZarklyX and its affiliates, officers, employees, and suppliers will <strong>not be liable for any loss of data</strong>, loss of profits, loss of revenue, loss of business, loss of goodwill, or any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Beta Portal.

This applies regardless of the legal theory and even if we have been advised of the possibility of such damages.

Because the Beta Portal is supplied without charge and is expressly identified as a temporary evaluation environment, <strong>you accept the risk of data loss as a condition of participating</strong>.`,
    isOpen: false,
  },
  {
    title: 'Ending the Beta Program',
    content: `The beta program will end when ZarklyX becomes generally available or at any earlier date we choose.

When the program ends:
• Access to the Beta Portal will be withdrawn.
• <strong>The beta environment and all data in it will be permanently deleted.</strong>
• Beta accounts will not carry over, and no data will be migrated to production.
• You will need to create a new account to use the production Service.

We will make reasonable efforts to give advance notice before the beta closes so that you can record anything you wish to keep, but we are not obliged to do so.`,
    isOpen: false,
  },
  {
    title: 'Relationship to Our Other Terms',
    content: `This Beta Program Policy supplements our <a href="/support/terms-of-service">Terms of Service</a>, <a href="/support/privacy-policy">Privacy Policy</a>, and other applicable policies.

Where this Policy conflicts with those documents, <strong>this Policy governs your use of the Beta Portal</strong> for as long as the beta program continues. All other terms remain in full force.`,
    isOpen: false,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Beta Program Policy from time to time as the beta evolves. When we do, we will revise the "last updated" date shown on this page.

Material changes will be communicated through the Beta Portal or by email where practicable. Your continued use of the Beta Portal after a change takes effect constitutes acceptance of the revised Policy.`,
    isOpen: false,
  },
  {
    title: 'Contact Us',
    content: `If you have questions about this Beta Program Policy, the beta environment, or what happens to your data, we are happy to help.

<strong>Email:</strong> <a href="mailto:connection@zarklyx.com">connection@zarklyx.com</a>

You can also reach us through our <a href="/contact">Contact page</a> or share product feedback via <a href="/support/feature-request">Feature Requests</a>.`,
    isOpen: false,
  },
];
