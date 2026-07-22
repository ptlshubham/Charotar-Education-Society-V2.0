export interface PolicySection {
  title: string;
  content: string;
  isOpen: boolean;
}

export const DISCLOSURE_POLICY_SECTIONS: PolicySection[] = [
  {
    title: 'Our Commitment to Security',
    content: `ZarklyX takes the security of our platform and the data our customers trust us with seriously. We value the work of security researchers and the broader community in helping us keep ZarklyX safe. This Responsible Disclosure Policy explains how to report a security vulnerability to us and what you can expect in return.

If you believe you have found a security vulnerability in any ZarklyX product or service, we encourage you to report it to us responsibly using the process below.`,
    isOpen: false,
  },
  {
    title: 'Scope',
    content: `This policy applies to security vulnerabilities discovered in:
• The ZarklyX website (https://zarklyx.com) and its subdomains
• The ZarklyX web application and platform
• Official ZarklyX APIs and integrations

Third-party services, platforms, and websites that we integrate with are not covered by this policy  please report issues in those services to their respective owners.`,
    isOpen: false,
  },
  {
    title: 'How to Report a Vulnerability',
    content: `Please email your report to <strong><a href="mailto:security@zarklyx.com" class="text-main underline">security@zarklyx.com</a></strong> with the subject line "Security Disclosure".

To help us investigate quickly, include:
• A clear description of the vulnerability and its potential impact
• Step-by-step instructions to reproduce the issue
• Any proof-of-concept code, screenshots, or logs
• The URL, endpoint, or component affected
• Your contact details so we can follow up

Please report issues promptly after discovery and give us a reasonable opportunity to respond before any public disclosure.`,
    isOpen: false,
  },
  {
    title: 'Guidelines for Researchers',
    content: `When investigating a potential vulnerability, we ask that you:
• Act in good faith to avoid privacy violations, data loss, and service disruption
• Only interact with accounts you own or have explicit permission to test
• Use test data rather than real customer data wherever possible
• Report the issue to us as soon as you discover it, and keep details confidential until we have resolved it`,
    isOpen: false,
  },
  {
    title: 'Please Do Not',
    content: `To protect our users and systems, please do not:
• Access, modify, or delete data that does not belong to you
• Perform denial-of-service (DoS/DDoS) attacks or degrade the availability of the Service
• Use social engineering, phishing, or physical attacks against our staff or infrastructure
• Run automated scanners in a way that generates excessive traffic or harm
• Publicly disclose the vulnerability before we have had a reasonable time to fix it`,
    isOpen: false,
  },
  {
    title: 'What to Expect From Us',
    content: `When you submit a report in line with this policy, we will:
• Acknowledge receipt of your report, typically within a few business days
• Investigate and work to validate the issue
• Keep you informed of our progress as we work toward a fix
• Let you know when the issue has been resolved

We do not currently operate a paid bug-bounty program, but we are grateful for responsible reports and are happy to recognize valid contributions where appropriate.`,
    isOpen: false,
  },
  {
    title: 'Safe Harbor',
    content: `We consider security research and vulnerability disclosure conducted in good faith and in accordance with this policy to be authorized. We will not pursue legal action against researchers who follow these guidelines, act in good faith, and avoid privacy violations, data destruction, and service disruption. If legal action is initiated by a third party against you for activities conducted in accordance with this policy, we will make this authorization known.`,
    isOpen: false,
  },
  {
    title: 'Out of Scope',
    content: `The following are generally not considered security vulnerabilities under this policy:
• Reports from automated scanners without a demonstrated, exploitable impact
• Missing security headers or best-practice recommendations without a real-world exploit
• Rate-limiting issues without a meaningful security impact
• Vulnerabilities in third-party services or platforms we integrate with
• Social engineering, spam, or physical security issues`,
    isOpen: false,
  },
  {
    title: 'Contact Information',
    content: `To report a security issue or ask about this policy, please contact us:

<strong>ZarklyX Security Team</strong>
Email: <a href="mailto:security@zarklyx.com" class="text-main underline">security@zarklyx.com</a>
Phone: +91 88662 81236
Website: https://zarklyx.com/`,
    isOpen: false,
  },
];
