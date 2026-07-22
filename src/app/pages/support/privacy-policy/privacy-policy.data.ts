export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'Information We Collect',
    content: `ZarklyX is an all-in-one operations platform for agencies, covering CRM, project management, HR, payroll, accounting, invoicing, social media management, SEO, and cloud storage. Depending on which modules you use, we collect the following types of information:

<strong>Account & Personal Information:</strong>
• Name, email address, and phone number
• Business or organization name and job role
• Billing and subscription details
• Login credentials and profile settings

<strong>Team & Employee Data:</strong>
• Details of team members and employees you add to your workspace (for roles, attendance, payroll, and HR features)
• Attendance, leave, payroll, and performance records you choose to manage in ZarklyX

<strong>Client & CRM Data:</strong>
• Contact details and records of the clients you manage within your account
• Project, task, invoice, and communication history you store on the platform

<strong>Connected Account Data:</strong>
• Data from third-party services you authorize, including social platforms (Facebook, Instagram, Threads, LinkedIn, Pinterest, X, YouTube, WhatsApp, Google My Business) and cloud storage (Google Drive, Dropbox)
• Content you create, schedule, publish, or manage, and related engagement and analytics data (likes, shares, comments, reach, etc.)

<strong>Content & Files:</strong>
• Files, documents, and media you upload to ZarklyX cloud storage or attach to records

<strong>Usage Data:</strong>
• IP address, browser type, and device information
• Page visits and activity logs (time spent, click data, etc.)
• Location data (if enabled)

<strong>Cookies and Tracking Technologies:</strong>
We use cookies, pixels, and similar technologies to track activity on our website and improve the user experience.`,
    isOpen: false,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect for the following purposes:

<strong>Provide the Service:</strong> To operate and maintain the features of our agency operations platform  CRM, project management, HR, payroll, accounting, social media management, SEO, cloud storage, and client portals.
<strong>Account & Billing:</strong> To manage your subscription, process payments, and administer role-based access for your team.
<strong>Customer Support:</strong> To respond to your inquiries, resolve issues, and provide technical support.
<strong>Improve the Service:</strong> To analyze usage and improve the functionality, performance, and security of our platform.
<strong>Marketing and Communications:</strong> To send you product updates, newsletters, or promotional materials based on your interests (you can opt out at any time).
<strong>Analytics and Reporting:</strong> To provide insights, dashboards, and reporting across the modules you use.
<strong>Security & Fraud Prevention:</strong> To detect, prevent, and respond to abuse, unauthorized access, or security incidents.
<strong>Legal Obligations:</strong> To comply with legal requirements or respond to lawful government requests.`,
    isOpen: false,
  },
  {
    title: 'Data From Connected Integrations',
    content: `When you connect a third-party account (such as Google, Meta, LinkedIn, Pinterest, X, YouTube, WhatsApp, or Dropbox), you authorize ZarklyX to access specific data through that provider's secure authorization (OAuth). We access this data only to provide the features you request  for example, scheduling posts, retrieving analytics, or syncing files.

<strong>Limited Use:</strong> ZarklyX's use of information received from Google APIs adheres to the <strong>Google API Services User Data Policy</strong>, including its Limited Use requirements. Data obtained from Meta, LinkedIn, and other platforms is likewise used only to deliver the features you enable and in accordance with each platform's developer terms.

<strong>No Unauthorized Use:</strong> We do not use connected-account data for advertising, and we do not sell it or transfer it to third parties except as needed to provide the Service or as required by law.

<strong>Revoking Access:</strong> You can disconnect any integration at any time from your ZarklyX account settings or from the third-party provider's own security/permissions page. Revoking access stops future data collection from that provider.`,
    isOpen: false,
  },
  {
    title: 'How We Share Your Information',
    content: `We do not sell your personal data. We may share information with the following parties:

<strong>Within Your Organization:</strong> Data is accessible to other users in your workspace according to the role-based permissions you assign.
<strong>Service Providers:</strong> We may share information with vetted third-party vendors and service providers who support our platform (e.g., payment processors, email providers, and cloud hosting services), under confidentiality obligations.
<strong>Connected Platforms:</strong> When you use an integration, the relevant data (such as posts or files) is exchanged with the third-party platform you have connected, at your direction.
<strong>Business Transfers:</strong> If we undergo a merger, acquisition, or asset sale, your data may be transferred as part of that transaction.
<strong>Legal Compliance:</strong> We may disclose data to comply with legal obligations or to protect the rights, property, or safety of ZarklyX, our users, or others.`,
    isOpen: false,
  },
  {
    title: 'Cookies and Tracking Technologies',
    content: `We use cookies and similar technologies to collect information and enhance the user experience. Cookies help us keep you signed in, remember your preferences, analyze usage, and measure our marketing.

<strong>Types of Cookies We Use:</strong>

<strong>Essential Cookies:</strong> Necessary for the operation of the Service, including authentication and security.
<strong>Performance Cookies:</strong> To monitor and analyze how the platform is used so we can improve it.
<strong>Advertising Cookies:</strong> To measure the effectiveness of our marketing and, where applicable, deliver relevant ads.

You can manage your cookie preferences through your browser settings, though disabling cookies may limit your ability to use some features of the Service.`,
    isOpen: false,
  },
  {
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your data, including encryption in transit, access controls, and role-based permissions that limit who in your organization can view or edit specific records. Access tokens for connected integrations are stored securely. However, no method of transmission or storage is 100% secure, and we cannot guarantee the absolute security of your information.`,
    isOpen: false,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal and business data for as long as your account is active or as needed to provide the Service. If you close your account, we will delete or anonymize your personal data within a reasonable period, except where we are required to retain it to comply with legal, tax, or accounting obligations, resolve disputes, or enforce our agreements. You may request earlier deletion as described in "Your Data Protection Rights" below.`,
    isOpen: false,
  },
  {
    title: 'Your Data Protection Rights',
    content: `Depending on your location, you may have the following rights regarding your personal data:

<strong>Access:</strong> You can request a copy of your data.
<strong>Correction:</strong> You may request that we correct inaccurate or incomplete information.
<strong>Deletion:</strong> You can request the deletion of your personal data, subject to our retention policies or legal obligations.
<strong>Data Portability:</strong> You may request a copy of your data in a portable, machine-readable format.
<strong>Objection & Restriction:</strong> You may object to or ask us to restrict the processing of your data in certain circumstances.
<strong>Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time.

To exercise any of these rights, please contact us using the details provided below.`,
    isOpen: false,
  },
  {
    title: 'Third-Party Links',
    content: `Our Service may contain links to third-party websites or services, such as social media platforms or integration partners. These third-party websites have their own privacy policies, and we are not responsible for their practices. We encourage you to review their privacy policies before providing any personal data.`,
    isOpen: false,
  },
  {
    title: 'Children\'s Privacy',
    content: `ZarklyX is a business platform intended for use by organizations and is not directed to children. We do not knowingly collect personal information from children under the age of 13 (or the minimum age required in your jurisdiction). If you believe that we have inadvertently collected data from a child, please contact us immediately, and we will take steps to remove that data.`,
    isOpen: false,
  },
  {
    title: 'International Data Transfers',
    content: `ZarklyX operates globally, and your data may be transferred to and processed in countries other than your country of residence. Where required, we put appropriate safeguards in place for such transfers. By using the Service, you consent to the transfer of your data to countries that may have different data protection laws than those in your jurisdiction.`,
    isOpen: false,
  },
  {
    title: 'Changes to This Privacy Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. By continuing to use our Service after changes are made, you accept the revised Privacy Policy.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `If you have any questions or concerns about this Privacy Policy or wish to exercise your data protection rights, please contact us:

<strong>ZarklyX Support</strong>
Email: support@zarklyx.com
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
