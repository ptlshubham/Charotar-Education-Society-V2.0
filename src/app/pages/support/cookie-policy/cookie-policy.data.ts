export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const COOKIE_POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'What Are Cookies',
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work, to remember your preferences, and to provide information to the site owner. Similar technologies  such as pixels, tags, and local storage  perform comparable functions, and we refer to all of them collectively as "cookies" in this policy.

This Cookie Policy explains how ZarklyX uses cookies on our website and in our platform, and how you can manage them.`,
    isOpen: false,
  },
  {
    title: 'How We Use Cookies',
    content: `We use cookies to:
• Keep you signed in and maintain the security of your session
• Remember your settings and preferences
• Understand how our website and platform are used so we can improve them
• Measure the performance of our marketing and content
• Deliver and, where applicable, personalize relevant content

Some cookies are essential for the site to function, while others are optional and used only with your consent where required by law.`,
    isOpen: false,
  },
  {
    title: 'Types of Cookies We Use',
    content: `<strong>Strictly Necessary Cookies:</strong> Required for the website and platform to operate, including authentication, security, and load balancing. These cannot be switched off in our systems.

<strong>Performance & Analytics Cookies:</strong> Help us understand how visitors interact with our site by collecting information such as pages visited and time spent, so we can improve the experience.

<strong>Functional Cookies:</strong> Remember choices you make (such as language or region) to provide enhanced, more personal features.

<strong>Advertising & Marketing Cookies:</strong> Used to measure the effectiveness of campaigns and, where applicable, to show you more relevant content. These may be set by us or our advertising partners.`,
    isOpen: false,
  },
  {
    title: 'Third-Party Cookies',
    content: `Some cookies are placed by third-party services that appear on our pages, such as analytics providers, embedded content, and advertising or social media platforms. These providers may use cookies to collect information about your activity across different websites. We do not control these third-party cookies; please refer to the relevant provider's privacy and cookie policies for more information.`,
    isOpen: false,
  },
  {
    title: 'Managing Your Cookie Preferences',
    content: `You can control and manage cookies in several ways:
• <strong>Cookie Banner:</strong> Where shown, you can accept or decline non-essential cookies through our consent banner.
• <strong>Browser Settings:</strong> Most browsers let you block or delete cookies and alert you when a cookie is set. Refer to your browser's help pages for instructions.

Please note that if you block or delete essential cookies, some parts of the website or platform may not function correctly.`,
    isOpen: false,
  },
  {
    title: 'Do Not Track',
    content: `Some browsers offer a "Do Not Track" (DNT) signal. Because there is not yet a common industry standard for how to respond to DNT signals, our website may not currently respond to them. We will update this policy if that changes.`,
    isOpen: false,
  },
  {
    title: 'Changes to This Cookie Policy',
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, law, or our practices. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `If you have any questions about our use of cookies, please contact us:

<strong>ZarklyX Support</strong>
Email: support@zarklyx.com
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
