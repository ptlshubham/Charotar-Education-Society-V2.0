export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const DO_NOT_SELL_SECTIONS: PolicySection[] = [
  {
    title: 'Overview',
    content: `This notice is provided under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), and applies to California residents. It explains your right to opt out of the "sale" or "sharing" of your personal information and how to exercise it.

If you are a resident of another region with similar rights, you may also use the methods described here to submit an opt-out request, and we will honor it where applicable law requires.`,
    isOpen: false,
  },
  {
    title: 'What "Sell" and "Share" Mean',
    content: `Under California law, these terms are defined broadly:
• <strong>"Sell"</strong> means disclosing personal information to a third party in exchange for money or other valuable consideration.
• <strong>"Share"</strong> means disclosing personal information to a third party for cross-context behavioral advertising, whether or not for money.

These definitions can include certain uses of cookies and similar technologies by advertising or analytics partners, even when no money changes hands.`,
    isOpen: false,
  },
  {
    title: 'Do We Sell or Share Your Personal Information?',
    content: `ZarklyX does <strong>not</strong> sell your personal information for money, and we do not sell the data you store in the platform (such as your CRM, client, employee, or content data).

However, like many websites, we may use advertising and analytics cookies on our marketing website that could be considered a "sale" or "share" under California law. You can opt out of this activity using the methods below.`,
    isOpen: false,
  },
  {
    title: 'Your Right to Opt Out',
    content: `You can opt out of the sale or sharing of your personal information at any time by:
• <strong>Cookie preferences:</strong> Adjust your choices through our cookie consent banner or your browser settings to decline non-essential cookies.
• <strong>Email request:</strong> Send a request to <a href="mailto:support@zarklyx.com?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information" class="text-main underline">support@zarklyx.com</a> with the subject line "Do Not Sell or Share My Personal Information".

We will process valid requests and may need to verify your identity to protect your information.`,
    isOpen: false,
  },
  {
    title: 'Global Privacy Control (GPC)',
    content: `We recognize opt-out preference signals such as the Global Privacy Control (GPC) where required by law. If your browser or extension sends a GPC signal, we will treat it as a request to opt out of the sale or sharing of personal information for that browser or device.`,
    isOpen: false,
  },
  {
    title: 'Non-Discrimination',
    content: `We will not discriminate against you for exercising your privacy rights. You will not be denied services, charged a different price, or provided a different level or quality of service simply because you submitted an opt-out or other privacy request.`,
    isOpen: false,
  },
  {
    title: 'Authorized Agents',
    content: `You may use an authorized agent to submit an opt-out request on your behalf. We may require the agent to provide proof that you gave them signed permission to act for you, and we may still ask you to verify your own identity directly with us.`,
    isOpen: false,
  },
  {
    title: 'Your Other Privacy Rights',
    content: `Depending on where you live, you may also have the right to know what personal information we collect, request access to or a copy of it, request correction, and request deletion. These rights, and how to exercise them, are described in our <strong>Privacy Policy</strong>. You can also request deletion of your data through our <strong>Data Deletion</strong> page.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `To submit a request or ask about this notice, please contact us:

<strong>ZarklyX Support</strong>
Email: <a href="mailto:support@zarklyx.com?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information" class="text-main underline">support@zarklyx.com</a>
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
