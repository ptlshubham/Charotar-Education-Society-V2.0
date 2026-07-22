export interface FaqItem {
  title: string;
  content: string;
  category: string;
  icon: string;
  isOpen: boolean;
}

/** Backwards-compatible alias (older imports referenced PolicySection). */
export type PolicySection = FaqItem;

export const FAQ_SECTIONS: FaqItem[] = [
  {
    title: 'What is ZarklyX?',
    content: `ZarklyX is an all-in-one operations platform for agencies and growing businesses. It brings CRM, project management, HR, payroll, accounting, invoicing, social media management, SEO, and cloud storage together in one place  so your team can run daily operations without juggling a dozen separate tools.`,
    category: 'getting-started',
    icon: 'info',
    isOpen: true,
  },
  {
    title: 'Who is ZarklyX for?',
    content: `ZarklyX is built for digital, marketing, and social media agencies, as well as small and mid-sized businesses that manage multiple clients or teams. If you are currently paying for separate tools for scheduling, storage, CRM, and back-office work, ZarklyX consolidates them into a single subscription.`,
    category: 'getting-started',
    icon: 'users',
    isOpen: false,
  },
  {
    title: 'What can I manage in ZarklyX?',
    content: `Depending on your plan, you can manage clients and leads (CRM), projects and tasks, attendance, payroll and HR, accounting and invoicing, social media scheduling and analytics, SEO, inventory, cloud storage, and reporting  all from one dashboard with role-based access for your team.`,
    category: 'features',
    icon: 'briefcase',
    isOpen: false,
  },
  {
    title: 'Which platforms and tools does ZarklyX integrate with?',
    content: `ZarklyX connects natively with Google Drive, Dropbox, Facebook, Instagram, Threads, LinkedIn, Pinterest, WhatsApp, X, YouTube, and Google My Business  so you can manage content, files, and client communication without leaving the platform.`,
    category: 'integrations',
    icon: 'link',
    isOpen: false,
  },
  {
    title: 'Do you offer a free trial?',
    content: `Yes. You can try ZarklyX with a free trial to explore the modules that matter to your team before you pay. You will only be charged if you continue after the trial ends, and you can cancel anytime before then.`,
    category: 'billing',
    icon: 'gift',
    isOpen: false,
  },
  {
    title: 'How does pricing work?',
    content: `ZarklyX uses flexible, modular pricing so you only pay for what your team needs, with per-seat and per-client options that scale as you grow. You can upgrade, downgrade, or add modules at any time from your account settings.`,
    category: 'billing',
    icon: 'dollar',
    isOpen: false,
  },
  {
    title: 'Can I control what each team member can access?',
    content: `Yes. ZarklyX includes granular, role-based access control  from Agency Owner down to individual contributors  so you can decide exactly which modules, clients, and data each team member can see and edit.`,
    category: 'account',
    icon: 'user-check',
    isOpen: false,
  },
  {
    title: 'Can I manage multiple clients from one account?',
    content: `Absolutely. ZarklyX is designed for multi-client management, letting you organize clients, assign them to team members, and give clients their own portal view while keeping your internal data private.`,
    category: 'account',
    icon: 'users',
    isOpen: false,
  },
  {
    title: 'Can I schedule and publish social media posts?',
    content: `Yes. You can plan, schedule, and publish content across connected social platforms, use a visual content calendar, and track engagement and reach analytics  all within ZarklyX.`,
    category: 'features',
    icon: 'calendar',
    isOpen: false,
  },
  {
    title: 'Is my data secure?',
    content: `We take security seriously. ZarklyX uses industry-standard measures including encryption in transit, access controls, and role-based permissions. You can review how we handle data in our Privacy Policy, and report any security concerns through our Disclosure Policy.`,
    category: 'security',
    icon: 'shield',
    isOpen: false,
  },
  {
    title: 'Can I cancel my subscription and get a refund?',
    content: `You can cancel at any time from your account settings, and you will keep access until the end of your current billing cycle. Refund eligibility, including our money-back window, is described in our Refund & Cancellation Policy.`,
    category: 'billing',
    icon: 'refund',
    isOpen: false,
  },
  {
    title: 'How do I get support?',
    content: `Our team is here to help. You can reach us at support@zarklyx.com or by phone at +91 88662 81236. We are happy to help you choose the right setup, onboard your team, and get the most out of ZarklyX.`,
    category: 'support',
    icon: 'headset',
    isOpen: false,
  },
];
