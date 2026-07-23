/**
 * Content for the five policy pages. They share one layout, so only the copy
 * differs — see `policy-page/policy-page.ts`, which selects by `route.data.policy`.
 */

export interface PolicySection {
  heading: string;
  /** Plain paragraphs. */
  paras?: string[];
  /** Bulleted items; `lead` is bolded before the rest of the line. */
  bullets?: Array<{ lead?: string; text: string }>;
  /** Feather-style icon path(s) for the section marker. */
  path: string[];
}

export interface Policy {
  key: string;
  /** Rendered before the gold accent word. */
  titleLead: string;
  titleAccent: string;
  blurb: string;
  /** Extra breadcrumb hop between Home and the page, e.g. "Policies". */
  crumbParent?: string;
  sections: PolicySection[];
  /** Card in the left rail under the section index. */
  aside: { title: string; body: string };
  /** Banner above the footer. */
  footNote: string;
  /** Contact block only appears on policies that end with contact details. */
  showContactCard?: boolean;
}

const ICON = {
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  user: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
  doc: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  cross: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm15 9-6 6M9 9l6 6'],
  card: ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M2 10h20'],
  refresh: ['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5'],
  mail: ['M2 4h20v16H2z', 'm2 6 10 7 10-7'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  lock: ['M3 11a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M7 9V7a5 5 0 0 1 10 0v2'],
  gear: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'],
  globe: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z'],
  copyright: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M14.8 9.5a3.5 3.5 0 1 0 0 5'],
  link: ['M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7', 'M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7'],
  warn: ['m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0z', 'M12 9v4M12 17h.01'],
  hands: ['M11 17 8.5 19.5a2.1 2.1 0 0 1-3-3l6-6a2.1 2.1 0 0 1 3 0l4 4a2.1 2.1 0 0 1-3 3L13 15'],
  scales: ['M12 3v18M5 7h14', 'm5 7-3 6h6zM19 7l-3 6h6z', 'M7 21h10'],
  monitor: ['M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z', 'M8 21h8M12 17v4'],
  ban: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm4.9 4.9 14.2 14.2'],
  target: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
  check: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'm8 12 3 3 5-6'],
};

const CONTACT_SECTION: PolicySection = {
  heading: 'Contact Us',
  paras: ['For any queries related to this policy, please contact:'],
  path: ICON.mail,
};

export const POLICIES: readonly Policy[] = [
  {
    key: 'refund',
    titleLead: 'Refund ',
    titleAccent: 'Policy',
    crumbParent: 'Policies',
    blurb:
      'At Charotar Education Society, we believe in transparency and fairness in all our policies, including refunds.',
    showContactCard: true,
    aside: {
      title: 'Need Help?',
      body: 'If you have any questions regarding our Refund Policy, please contact us.',
    },
    footNote: '',
    sections: [
      {
        heading: 'Introduction',
        paras: [
          'This Refund Policy outlines the terms and conditions under which fees paid to Charotar Education Society may be refunded. By making a payment to our institutions, you agree to this policy.',
        ],
        path: ICON.book,
      },
      {
        heading: 'Fee Refund Eligibility',
        paras: ['Refunds are applicable under the following conditions:'],
        bullets: [
          { lead: 'Withdrawal of admission before', text: ' the commencement of the academic session.' },
          { lead: 'Cancellation of programs', text: ' or courses by the institution.' },
          { text: 'Overpayment made by the student due to an error.' },
        ],
        path: ICON.user,
      },
      {
        heading: 'Refund Process',
        paras: [
          'To request a refund, please submit a written application to the Head of the Institution along with supporting documents, if required. The request will be reviewed and approved based on eligibility.',
        ],
        path: ICON.doc,
      },
      {
        heading: 'Refund Timeline',
        paras: [
          'Approved refunds will be processed within 15–30 working days from the date of approval. You will be notified once the refund is initiated.',
        ],
        path: ICON.clock,
      },
      {
        heading: 'Non-Refundable Items',
        paras: ['The following are non-refundable:'],
        bullets: [
          { text: 'Registration fees' },
          { text: 'Examination fees' },
          { text: 'Fees for events, workshops, and short-term facilities' },
          { text: 'Any other charges explicitly mentioned at the time of payment' },
        ],
        path: ICON.cross,
      },
      {
        heading: 'Mode of Refund',
        paras: ['Refunds will be made through the original mode of payment only.'],
        path: ICON.card,
      },
      {
        heading: 'Changes to Policy',
        paras: [
          'Charotar Education Society reserves the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website.',
        ],
        path: ICON.refresh,
      },
      { ...CONTACT_SECTION, paras: ['For any queries related to refunds, please contact:'] },
    ],
  },

  {
    key: 'privacy',
    titleLead: 'Privacy ',
    titleAccent: 'Policy',
    blurb:
      'At Charotar Education Society, we are committed to protecting your privacy and safeguarding your personal information.',
    aside: { title: '', body: '' },
    footNote: 'Your privacy matters to us. If you have any questions about this Privacy Policy, please contact us.',
    sections: [
      {
        heading: 'Introduction',
        paras: [
          'Charotar Education Society (CES) values your trust and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website or use our services.',
        ],
        path: ICON.book,
      },
      {
        heading: 'Information We Collect',
        paras: ['We may collect the following types of information:'],
        bullets: [
          { lead: 'Personal Information:', text: ' Name, email address, phone number, and other details you provide.' },
          { lead: 'Usage Information:', text: ' IP address, browser type, pages visited, time spent on our website.' },
          { lead: 'Cookies and Tracking Data:', text: ' To enhance user experience and analyze website performance.' },
        ],
        path: ICON.user,
      },
      {
        heading: 'How We Use Your Information',
        paras: ['We use the information we collect to:'],
        bullets: [
          { text: 'Provide and improve our services.' },
          { text: 'Respond to inquiries and communicate with you.' },
          { text: 'Send updates, newsletters, and important announcements.' },
          { text: 'Ensure website security and prevent fraud.' },
        ],
        path: ICON.gear,
      },
      {
        heading: 'Information Sharing',
        paras: ['We do not sell or rent your personal information. We may share your data with:'],
        bullets: [
          { text: 'Trusted service providers who assist in website operations.' },
          { text: 'Legal authorities if required by law.' },
          { text: 'Institutional partners for academic or administrative purposes.' },
        ],
        path: ICON.users,
      },
      {
        heading: 'Data Security',
        paras: [
          'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.',
        ],
        path: ICON.shield,
      },
      {
        heading: 'Your Rights',
        paras: ['You have the right to:'],
        bullets: [
          { text: 'Access, update, or delete your personal information.' },
          { text: 'Opt-out of promotional communications.' },
          { text: 'Withdraw consent at any time where applicable.' },
        ],
        path: ICON.mail,
      },
      {
        heading: 'Policy Updates',
        paras: [
          'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.',
        ],
        path: ICON.doc,
      },
    ],
  },

  {
    key: 'terms',
    titleLead: 'Terms & ',
    titleAccent: 'Conditions',
    blurb:
      'These terms and conditions outline the rules and regulations for the use of the website and services of Charotar Education Society.',
    aside: {
      title: 'Important Notice',
      body: 'By accessing or using our website and services, you agree to be bound by these Terms & Conditions.',
    },
    footNote:
      'By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        paras: [
          'By accessing and using the website of Charotar Education Society ("we", "us", or "our"), you accept and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.',
        ],
        path: ICON.doc,
      },
      {
        heading: 'Use of Our Website',
        paras: [
          "You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.",
        ],
        path: ICON.globe,
      },
      {
        heading: 'Intellectual Property',
        paras: [
          'All content on this website, including text, graphics, logos, images, and software, is the property of Charotar Education Society and is protected by applicable copyright and trademark laws.',
        ],
        path: ICON.copyright,
      },
      {
        heading: 'User Responsibilities',
        paras: [
          'You agree not to post or transmit any unlawful, threatening, defamatory, or otherwise objectionable content. You are responsible for maintaining the confidentiality of any account credentials.',
        ],
        path: ICON.user,
      },
      {
        heading: 'Third-Party Links',
        paras: [
          'Our website may contain links to external websites. We are not responsible for the content or practices of those sites and encourage you to review their terms and privacy policies.',
        ],
        path: ICON.link,
      },
      {
        heading: 'Limitation of Liability',
        paras: [
          'We are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our website or services.',
        ],
        path: ICON.warn,
      },
      {
        heading: 'Indemnification',
        paras: [
          'You agree to indemnify and hold harmless Charotar Education Society from any claims, damages, or expenses arising from your use of our website or violation of these terms.',
        ],
        path: ICON.hands,
      },
      {
        heading: 'Governing Law',
        paras: [
          'These terms shall be governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Anand, Gujarat.',
        ],
        path: ICON.scales,
      },
      {
        heading: 'Changes to Terms',
        paras: [
          'We may update these Terms & Conditions from time to time. Changes will be posted on this page with an updated effective date.',
        ],
        path: ICON.refresh,
      },
      { ...CONTACT_SECTION, paras: ['If you have any questions about these Terms & Conditions, please contact us.'] },
    ],
  },

  {
    key: 'website-terms',
    titleLead: 'Website ',
    titleAccent: 'Terms',
    crumbParent: 'Policies',
    blurb:
      'These Website Terms govern your use of the website of Charotar Education Society. By accessing or using this website, you agree to comply with and be bound by these terms.',
    aside: {
      title: 'Need Help?',
      body: 'If you have any questions regarding these Website Terms, please contact us.',
    },
    footNote: '',
    sections: [
      {
        heading: 'Acceptance of Terms',
        paras: [
          'By accessing and using this website (cesociety.in), you agree to be bound by these Website Terms and all applicable laws and regulations. If you do not agree, please do not use this website.',
        ],
        path: ICON.doc,
      },
      {
        heading: 'Use of Website',
        paras: [
          "This website is provided for informational and educational purposes only. You agree to use it only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use of the website.",
        ],
        path: ICON.monitor,
      },
      {
        heading: 'Intellectual Property',
        paras: [
          'All content on this website including text, graphics, logos, images, videos, and software is the property of Charotar Education Society unless otherwise stated. Unauthorized use is prohibited.',
        ],
        path: ICON.copyright,
      },
      {
        heading: 'User Responsibilities',
        paras: [
          'You are responsible for maintaining the confidentiality of any account (if applicable) and for all activities under your account. You agree to provide accurate and complete information.',
        ],
        path: ICON.user,
      },
      {
        heading: 'Prohibited Activities',
        paras: [
          "You agree not to engage in any activity that may damage, disable, or impair the website or interfere with any other party's use of the website.",
        ],
        path: ICON.ban,
      },
      {
        heading: 'Third-Party Links',
        paras: [
          'Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party sites.',
        ],
        path: ICON.link,
      },
      {
        heading: 'Disclaimer of Warranties',
        paras: [
          'The website is provided on an "as is" and "as available" basis. We do not make any warranties, express or implied, regarding the accuracy, reliability, or availability of the website.',
        ],
        path: ICON.warn,
      },
      {
        heading: 'Limitation of Liability',
        paras: [
          'Charotar Education Society shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use this website.',
        ],
        path: ICON.shield,
      },
      {
        heading: 'Indemnification',
        paras: [
          'You agree to indemnify and hold harmless Charotar Education Society from any claims, damages, or expenses arising out of your use of this website or violation of these terms.',
        ],
        path: ICON.hands,
      },
      {
        heading: 'Governing Law',
        paras: [
          'These Website Terms shall be governed by and construed in accordance with the laws of India, and subject to the exclusive jurisdiction of the courts in Anand, Gujarat.',
        ],
        path: ICON.scales,
      },
      {
        heading: 'Changes to Terms',
        paras: [
          'We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website constitutes acceptance of changes.',
        ],
        path: ICON.refresh,
      },
      {
        ...CONTACT_SECTION,
        paras: ['If you have any questions or concerns about these Website Terms, please contact us.'],
      },
    ],
  },

  {
    key: 'disclosure',
    titleLead: 'Disclosure ',
    titleAccent: 'Policy',
    crumbParent: 'Policies',
    blurb:
      'At Charotar Education Society, we are committed to transparency and accountability in all our operations and communications.',
    aside: {
      title: 'Need Help?',
      body: 'If you have any questions regarding this Disclosure Policy, please contact us.',
    },
    footNote: 'Transparency builds trust. We are committed to open communication and accountable practices.',
    sections: [
      {
        heading: 'Purpose of Disclosure',
        paras: [
          'The purpose of this Disclosure Policy is to provide clear and accurate information about the policies, practices, and activities of Charotar Education Society to all stakeholders.',
        ],
        path: ICON.target,
      },
      {
        heading: 'Information We Disclose',
        paras: [
          'We disclose information related to our academic programs, admissions, fees, governance, financial statements, infrastructure, faculty, policies, and other relevant matters as required by law or as considered important for stakeholders.',
        ],
        path: ICON.doc,
      },
      {
        heading: 'How We Disclose',
        paras: [
          'Information is disclosed through our official website, prospectus, notice boards, annual reports, publications, and other official communications.',
        ],
        path: ICON.globe,
      },
      {
        heading: 'Accuracy of Information',
        paras: [
          'We ensure that all disclosed information is accurate, complete, and up to date. We take reasonable steps to correct any errors or omissions promptly.',
        ],
        path: ICON.check,
      },
      {
        heading: 'Confidentiality',
        paras: [
          'While we promote transparency, we also respect the confidentiality of personal and sensitive information in accordance with applicable laws and our Privacy Policy.',
        ],
        path: ICON.lock,
      },
      {
        heading: 'Regulatory Compliance',
        paras: [
          'Our disclosures comply with all applicable laws, regulations, and guidelines issued by government authorities and regulatory bodies.',
        ],
        path: ICON.scales,
      },
      {
        heading: 'Third-Party Information',
        paras: [
          'Information provided by third parties is disclosed with their consent or as required by law. We are not responsible for the accuracy of third-party information.',
        ],
        path: ICON.users,
      },
      {
        heading: 'Updates to Disclosure',
        paras: [
          'We may update this Disclosure Policy from time to time. Changes will be posted on our website with the updated effective date.',
        ],
        path: ICON.refresh,
      },
      {
        ...CONTACT_SECTION,
        paras: ['For any questions or concerns about this Disclosure Policy or our disclosures, please contact us.'],
      },
    ],
  },
];
