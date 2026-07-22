export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const DATA_DELETION_SECTIONS: PolicySection[] = [
  {
    title: 'Overview',
    content: `At ZarklyX, you stay in control of your data. This page explains how you can delete your personal data, your account, and any information we have obtained from third-party platforms you connected (such as Facebook, Instagram, Google, LinkedIn, and others).

If you only want to disconnect an integration without deleting your account, you can do that at any time from your account settings  see "Deleting Data From Connected Platforms" below.`,
    isOpen: false,
  },
  {
    title: 'What You Can Delete',
    content: `You can request deletion of:
• Your ZarklyX account and profile information
• Content, files, and records you have stored in the platform
• Data we obtained from third-party platforms you connected (posts, insights, tokens, etc.)
• Marketing preferences and communication history

Some information may be retained where we are legally required to keep it  see "Data We May Retain" below.`,
    isOpen: false,
  },
  {
    title: 'Delete Your Account and Data (In-App)',
    content: `The fastest way to delete your data is from within ZarklyX:
1. Sign in to your ZarklyX account.
2. Go to Settings → Account (or Billing) → Delete Account.
3. Follow the prompts to confirm.

Deleting your account removes your profile and associated data from active systems and cancels any active subscription. This action cannot be undone, so please export anything you wish to keep beforehand.`,
    isOpen: false,
  },
  {
    title: 'Request Deletion by Email',
    content: `If you are unable to access your account, or prefer to make a request directly, email us at <strong>support@zarklyx.com</strong> from the email address associated with your account, with the subject line "Data Deletion Request".

Please include:
• The email address (and, if applicable, business name) linked to your account
• Whether you want to delete your entire account or specific data
• Any connected platforms whose data you want removed

We may need to verify your identity before processing the request to protect your data.`,
    isOpen: false,
  },
  {
    title: 'Deleting Data From Connected Platforms',
    content: `When you connect a third-party account (such as Facebook, Instagram, Threads, Google, LinkedIn, Pinterest, X, YouTube, WhatsApp, or Dropbox), ZarklyX stores only what is needed to provide the features you use.

<strong>To remove this data:</strong>
• <strong>Disconnect in ZarklyX:</strong> Go to Settings → Integrations, and disconnect the platform. This revokes ZarklyX's access and removes the associated access tokens.
• <strong>Revoke from the platform:</strong> You can also remove ZarklyX from the third-party provider's own app/permissions settings (for example, Facebook Settings → Apps and Websites, or your Google Account → Security → Third-party access).
• <strong>Request full deletion:</strong> To delete the data we already retrieved from that platform, submit a Data Deletion Request as described above and specify the platform.`,
    isOpen: false,
  },
  {
    title: 'Deletion Timeline',
    content: `We aim to acknowledge deletion requests within a few business days and to complete verified deletions within <strong>30 days</strong>. Copies of data may persist in secure backups for a limited period until those backups are rotated, after which they are permanently removed. We will let you know once your request has been completed.`,
    isOpen: false,
  },
  {
    title: 'Data We May Retain',
    content: `We may retain certain information after account deletion where necessary to:
• Comply with legal, tax, or accounting obligations
• Resolve disputes or enforce our agreements
• Prevent fraud and abuse

Any retained data is kept only for as long as required and is protected in line with our Privacy Policy.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `For any questions about deleting your data or the status of a request, please contact us:

<strong>ZarklyX Support</strong>
Email: support@zarklyx.com
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
