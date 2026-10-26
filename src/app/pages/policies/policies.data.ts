/**
 * Content for the five policy pages (/support/...). They share one layout - the chaptered
 * layout of Our History - so only the copy differs; `policy-page.ts` picks a policy by
 * `route.data.policy`.
 *
 * The copy describes what cesociety.in actually does: its forms (contact, counselling, alumni,
 * gate pass), Rahatokarsh donations through Razorpay with a PAN upload for 80G, the public donor
 * and beneficiary lists, Dyuno (OpenAI; chats kept in the browser for 30 days, shared links on the
 * server), Google Analytics / Tag Manager and Google Translate.
 *
 * TODO (CES to confirm before publishing): the Grievance Officer's name, retention periods, the
 * 7-day window for donation refund requests, who sees counselling requests, and the RTI Public
 * Information Officer details.
 */

export type PolicyKey = 'privacy' | 'terms' | 'refund' | 'website-terms' | 'disclosure';

export interface PolicySection {
  id: string;
  title: string;
  /** Shorter label for the "On this page" list, when the title is long. */
  nav?: string;
  paras?: readonly string[];
  /** Bulleted items; `lead` is set in bold before the rest of the line. */
  bullets?: ReadonlyArray<{ lead?: string; text: string }>;
  /** Paragraphs that follow the bullets. */
  after?: readonly string[];
  /** Arrow links under the section; an http(s) link opens in a new tab. */
  links?: ReadonlyArray<{ label: string; link: string }>;
  /** Ends with the Society's address, phone and email. */
  contact?: boolean;
}

export interface Policy {
  key: PolicyKey;
  title: string;
  path: string;
  blurb: string;
  sections: readonly PolicySection[];
}

/** When the policies were last revised; shown above each page's title. */
export const POLICIES_UPDATED = 'October 2026';

const CONTACT_SECTION: PolicySection = {
  id: 'contact',
  title: 'Contact us',
  contact: true,
};

const link = {
  privacy: { label: 'Privacy Policy', link: '/support/privacy-policy' },
  terms: { label: 'Terms & Conditions', link: '/support/terms' },
  refund: { label: 'Refund & Cancellation Policy', link: '/support/refund-cancellation-policy' },
  websiteTerms: { label: 'Website Terms', link: '/support/website-terms' },
  disclosure: { label: 'Disclosure Policy', link: '/support/disclosure-policy' },
};

const GOVERNING_LAW: PolicySection = {
  id: 'law',
  title: 'Governing law',
  paras: [
    'These terms are governed by the laws of India. Any dispute arising from them will be subject to the exclusive jurisdiction of the courts at Anand, Gujarat.',
  ],
};

export const POLICIES: readonly Policy[] = [
  // ─────────────────────────── Privacy ───────────────────────────
  {
    key: 'privacy',
    title: 'Privacy Policy',
    path: '/support/privacy-policy',
    blurb: 'What personal information Charotar Education Society collects through this website, why, who sees it and the choices you have.',
    sections: [
      {
        id: 'who-we-are',
        title: 'Who we are and what this covers',
        nav: 'Who we are',
        paras: [
          'Charotar Education Society (CES) is an educational society founded in Anand, Gujarat on 16 April 1916 and registered as F/53/Anand. It runs 31+ schools, colleges, hostels and other institutes. In this policy, "CES", "we" and "us" mean the Society, and "you" means anyone who uses cesociety.in.',
          'This policy covers the personal information we collect through this website and its services: the contact, counselling, alumni and gate pass forms, online donations to the Rahatokarsh Fund and Dyuno, our AI assistant. We handle it in line with the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000 and the rules made under them.',
        ],
      },
      {
        id: 'what-we-collect',
        title: 'Information we collect',
        paras: ['We ask only for what we need for the request you are making:'],
        bullets: [
          { lead: 'Contact form: ', text: 'your name, email address, phone number, subject and message.' },
          { lead: 'Counselling requests: ', text: 'your name, class and division, email address, phone number, institute and whatever you choose to tell us in your message.' },
          { lead: 'Alumni registration: ', text: 'your name, institute, course and year, phone number, email address, the country, state and city you live in, your current work or studies, and whether you plan to attend the Alumni Meet.' },
          { lead: 'Gate pass requests: ', text: 'the name of the visitor or staff member, the institute and person being visited, the purpose of the visit and a phone number.' },
          { lead: 'Donations to the Rahatokarsh Fund: ', text: 'your name, email address, phone number, city and the amount. If you claim a tax benefit under Section 80G, we also ask for a copy of your PAN card. Card, UPI and bank details are entered on Razorpay\'s secure payment page; we receive a confirmation of the payment, never your card number or banking passwords.' },
          { lead: 'Update requests: ', text: 'your email address, when you ask to be told that a section of the site is ready.' },
          { lead: 'Dyuno: ', text: 'the questions you type and the conversation so far (see "Dyuno, our AI assistant" below).' },
          { lead: 'Collected automatically: ', text: 'your IP address, browser and device type, approximate location, the pages you visit and how you reached them, through Google Analytics, Google Tag Manager and our server logs.' },
        ],
        after: [
          'Share only what you are comfortable sharing in the message boxes, and please never send passwords, Aadhaar numbers or bank details through a form.',
        ],
      },
      {
        id: 'how-we-use',
        title: 'How we use your information',
        nav: 'How we use it',
        bullets: [
          { text: 'To do what you asked: answer your enquiry, arrange counselling, process a gate pass or add you to our alumni records.' },
          { text: 'To receive and acknowledge your donation and, if you asked for one, issue an 80G certificate.' },
          { text: 'To keep in touch with alumni about events such as the Alumni Meet, and to send the updates you asked for.' },
          { text: 'To answer your questions through Dyuno.' },
          { text: 'To understand how the site is used and improve it.' },
          { text: 'To keep the site and its users safe, prevent misuse and meet our legal, tax and accounting obligations.' },
        ],
        after: ['We do not sell your personal information, and we do not let others use it for advertising.'],
      },
      {
        id: 'public-lists',
        title: 'Donor and beneficiary lists',
        paras: [
          'To be open about how the Rahatokarsh Fund is raised and spent, this site publishes lists of donors (name, city, amount and date of the donation) and of the students the fund has supported (name, institute, course, year and the amount of support).',
          'If you would rather your name was not shown, tell us when you donate or at any time afterwards, and we will remove it from the public list.',
        ],
        links: [
          { label: 'Donor list', link: '/donner-list' },
          { label: 'Beneficiary students', link: '/beneficiary-students' },
        ],
      },
      {
        id: 'counselling',
        title: 'Counselling requests are confidential',
        nav: 'Counselling requests',
        paras: [
          'Counselling requests are shared only with the counselling team of the CES Campus Counselling Program. They are not passed to parents, teachers or classmates unless you ask for that, or unless there is a serious risk to your safety or someone else\'s; in that case the counsellor will talk to you first wherever possible.',
        ],
        links: [{ label: 'About counselling', link: '/counselling' }],
      },
      {
        id: 'dyuno',
        title: 'Dyuno, our AI assistant',
        nav: 'Dyuno',
        paras: [
          'When you ask Dyuno a question, your message and the recent conversation are sent to our server and to OpenAI, whose models write the answer. For syllabus and exam questions Dyuno may also look things up on official education websites.',
          'Your conversations are saved in your own browser, not on our servers, so you can come back to them. A conversation you have not opened for 30 days is deleted automatically, and you can delete any conversation yourself. Dyuno also gives your browser a random ID so it can tell visits apart; the ID does not identify you.',
          'If you use "Share this chat", a copy of that conversation is stored on our server and anyone with the link can read it, so only share conversations that contain no personal details.',
        ],
        links: [{ label: 'Ask Dyuno', link: '/dyuno' }],
      },
      {
        id: 'sharing',
        title: 'Who we share it with',
        paras: ['We share personal information only where it is needed for the reason you gave it:'],
        bullets: [
          { lead: 'CES institutes: ', text: 'for example, a gate pass request goes to the institute you are visiting, and an alumni registration to the institute you studied at.' },
          { lead: 'Service providers working for us: ', text: 'Razorpay processes donations, OpenAI writes Dyuno\'s answers, Google provides analytics and page translation, and our hosting and storage providers keep the site and its files running. They may use the information only to provide their service to us.' },
          { lead: 'Authorities: ', text: 'where the law requires it, for example reporting donations claimed under Section 80G to the Income Tax Department, or in response to a lawful order.' },
        ],
        after: [
          'Some of these providers store data outside India. Where they do, we rely on their security and contractual commitments to protect it.',
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies and browser storage',
        paras: ['The site keeps a few small pieces of information in your browser:'],
        bullets: [
          { lead: 'Your notice choice: ', text: 'remembers that you have seen the cookie notice, so it is not shown again.' },
          { lead: 'Language: ', text: 'the googtrans cookie remembers the language you chose, and Google Translate translates the page.' },
          { lead: 'Dyuno: ', text: 'your saved conversations and Dyuno\'s random visitor ID.' },
          { lead: 'Analytics: ', text: 'Google Analytics, loaded through Google Tag Manager, sets cookies such as _ga to count visits and see which pages are used.' },
        ],
        after: [
          'You can delete or block cookies in your browser\'s settings, and you can stop Google Analytics with Google\'s opt-out browser add-on. Saved Dyuno conversations will not work if browser storage is blocked.',
        ],
        links: [{ label: 'Google Analytics opt-out', link: 'https://tools.google.com/dlpage/gaoptout' }],
      },
      {
        id: 'retention',
        title: 'How long we keep it',
        paras: ['We keep personal information only as long as we need it for the reason it was collected, or as long as the law requires:'],
        bullets: [
          { text: 'Enquiries, counselling requests and gate pass requests: while we deal with them, and for a reasonable time afterwards in case you follow up.' },
          { text: 'Donation records, including PAN details for 80G: for as long as tax and accounting laws require.' },
          { text: 'Alumni details: until you ask us to remove them.' },
          { text: 'Dyuno: conversations stay in your browser and are deleted after 30 days without use; shared links stay available until we remove them.' },
        ],
      },
      {
        id: 'security',
        title: 'How we protect it',
        paras: [
          'The site uses an encrypted (HTTPS) connection, donations are processed by Razorpay, a PCI DSS-compliant payment gateway, and only the staff who need the information you send can see it. No system is completely secure, so if you think your information has been misused, please tell us at once.',
        ],
      },
      {
        id: 'children',
        title: 'Children and students',
        paras: [
          'Many people who use this site are students, some of them under 18. Where the law requires a parent\'s or guardian\'s consent before we use a child\'s information, we will ask for it. Parents and guardians can contact us about any information their child has shared with us.',
        ],
      },
      {
        id: 'rights',
        title: 'Your rights',
        paras: ['You can ask us to:'],
        bullets: [
          { text: 'Tell you what personal information we hold about you and how we use it.' },
          { text: 'Correct, complete or update it.' },
          { text: 'Delete it, unless the law requires us to keep it (for example, donation records).' },
          { text: 'Stop using it where you gave consent, for example for alumni updates.' },
          { text: 'Act on these rights for someone you nominate, if you die or become unable to act yourself.' },
        ],
        after: [
          'Write to us using the details below; we may need to confirm who you are first. If you are not satisfied with our reply, you can complain to the Data Protection Board of India.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        paras: [
          'We will update this policy when the website or the law changes. The date at the top of this page shows when it last changed.',
        ],
      },
      {
        ...CONTACT_SECTION,
        title: 'Questions and complaints',
        paras: [
          'For any question or complaint about how we handle personal information, write to the Grievance Officer, Charotar Education Society, at the address below, with "Privacy" in the subject line. We will acknowledge it and reply within the time the law allows.',
        ],
      },
    ],
  },

  // ─────────────────────── Terms & Conditions ───────────────────────
  {
    key: 'terms',
    title: 'Terms & Conditions',
    path: '/support/terms',
    blurb: 'The terms for using the services Charotar Education Society offers through this website: forms and requests, online donations, Dyuno and online logins.',
    sections: [
      {
        id: 'about',
        title: 'About these terms',
        paras: [
          'These terms apply to the services that Charotar Education Society (CES), Anand runs on cesociety.in: the contact, counselling, alumni and gate pass forms, online donations to the Rahatokarsh Fund, the Dyuno AI assistant and the logins for staff and students. By using any of them, you agree to these terms.',
          'How you may use the website and its content is covered by our Website Terms, and how we handle your personal information by our Privacy Policy. Both form part of these terms.',
        ],
        links: [link.websiteTerms, link.privacy],
      },
      {
        id: 'information',
        title: 'Giving us accurate information',
        nav: 'Accurate information',
        paras: [
          'Please give true and complete details when you fill in a form, and only make a request for someone else, such as a family member, with their permission. We may decline or cancel a request that uses false details or someone else\'s identity.',
        ],
      },
      {
        id: 'requests',
        title: 'Requests are not confirmations',
        nav: 'Requests',
        bullets: [
          { lead: 'Counselling: ', text: 'a request is not a booked session. The counselling team will contact you to agree a time.' },
          { lead: 'Gate passes: ', text: 'a request must be approved by the institute before the visit. During the visit, please follow the campus rules and the instructions of staff.' },
          { lead: 'Alumni registration: ', text: 'your details may be checked with your institute before they are added to our records.' },
          { lead: 'Enquiries: ', text: 'we try to answer every message, but sending one does not create an admission, booking or any other commitment.' },
        ],
      },
      {
        id: 'donations',
        title: 'Donations to the Rahatokarsh Fund',
        nav: 'Donations',
        paras: ['The Rahatokarsh Fund pays the fees of bright students who are short of money. When you donate online:'],
        bullets: [
          { text: 'Your donation is voluntary and is used for the purposes of the fund.' },
          { text: 'The payment is processed by Razorpay, whose terms also apply to it.' },
          { text: 'To claim a tax benefit under Section 80G of the Income Tax Act, 1961, upload your PAN card before you pay. We issue the certificate once the donation has been received and verified, and report it to the Income Tax Department as the law requires.' },
          { text: 'Your name, city, the amount and the date may appear in the public donor list, unless you ask us not to show them.' },
          { text: 'Please check the amount before you pay. Refunds are given only in the cases set out in our Refund & Cancellation Policy.' },
        ],
        links: [{ label: 'Donate to the fund', link: '/donation' }, link.refund],
      },
      {
        id: 'dyuno',
        title: 'Using Dyuno',
        paras: [
          'Dyuno is an AI assistant that answers questions about CES and helps with studies. Its answers are written by AI and can be wrong or out of date, so please check anything important, such as admission dates, fees, results or exam rules, with the institute or the official source before you rely on it.',
          'Dyuno does not give medical, legal or financial advice, and it is not a replacement for counselling. If you are going through a hard time, talk to someone you trust, ask for a session with our counselling team, or call Tele-MANAS, the national mental health helpline, on 14416.',
          'Please use Dyuno respectfully: conversations that turn abusive are closed. Anything you share through "Share this chat" can be read by anyone with the link.',
        ],
        links: [{ label: 'Ask Dyuno', link: '/dyuno' }, { label: 'Request counselling', link: '/counselling' }],
      },
      {
        id: 'logins',
        title: 'Staff and student logins',
        nav: 'Logins',
        paras: [
          'Logins to CES systems, such as the staff dashboard, are only for the people they were issued to. Keep your password private, do not share your account, and tell your institute or the CES office at once if you think someone else has used it. Activity in these systems may be recorded to keep them secure.',
        ],
      },
      {
        id: 'acceptable-use',
        title: 'What you must not do',
        bullets: [
          { text: 'Submit false, misleading or automated requests, or use a form to send spam or advertising.' },
          { text: 'Try to get into accounts, systems or data you are not allowed to use, or interfere with the security of the site.' },
          { text: 'Upload anything unlawful or harmful, or anything you have no right to share.' },
          { text: 'Harass, threaten or impersonate anyone, including CES staff and students.' },
        ],
        after: [
          'We may refuse a request, remove content or block access if these terms are broken, and report unlawful activity to the authorities.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to our services and these terms',
        nav: 'Changes',
        paras: [
          'We may change, pause or stop any service on the site, and we may update these terms. The date at the top of this page shows when they last changed; if you keep using the services after a change, the updated terms apply.',
        ],
      },
      {
        id: 'liability',
        title: 'Our responsibility to you',
        nav: 'Liability',
        paras: [
          'We provide these services in good faith and with reasonable care, but we cannot promise they will always be available or free of errors. To the extent the law allows, CES is not liable for indirect losses or for losses caused by events outside our reasonable control. If you break these terms or the law while using our services, you are responsible for the claims and costs that result. Nothing in these terms takes away rights you have by law.',
        ],
      },
      GOVERNING_LAW,
      { ...CONTACT_SECTION, paras: ['For questions about these terms, contact the CES office:'] },
    ],
  },

  // ──────────────────── Refund & Cancellation ────────────────────
  {
    key: 'refund',
    title: 'Refund & Cancellation Policy',
    path: '/support/refund-cancellation-policy',
    blurb: 'When money paid to Charotar Education Society, online or at one of its institutes, can be refunded, and how to ask for it.',
    sections: [
      {
        id: 'covers',
        title: 'What this policy covers',
        nav: 'What it covers',
        paras: [
          'The only payment you can make on cesociety.in is a donation to the Rahatokarsh Fund, processed by Razorpay. Fees for admission, tuition, hostels and examinations are paid to the CES institute concerned. This policy explains when each can be refunded.',
          'Where a university, board or government authority sets refund rules for a course, those rules apply and take precedence over this policy.',
        ],
      },
      {
        id: 'donations',
        title: 'Donations to the Rahatokarsh Fund',
        nav: 'Donations',
        paras: [
          'Donations are voluntary and are not normally refunded once received, because they go towards students\' fees. We will refund a donation if:',
        ],
        bullets: [
          { text: 'You were charged more than once for the same donation.' },
          { text: 'A technical error took a different amount from the one you entered.' },
          { text: 'Money left your account but the donation did not go through.' },
        ],
        after: [
          'Please tell us within 7 days of the payment, with your name, the date, the amount and the Razorpay payment ID from your confirmation. If an 80G certificate has already been issued for the donation, it will be withdrawn before the refund is made.',
        ],
      },
      {
        id: 'failed-payments',
        title: 'Failed or pending payments',
        nav: 'Failed payments',
        paras: [
          'If money is taken from your account but the payment fails, your bank or Razorpay usually reverses it automatically within 5–7 working days. If it has not come back by then, contact us with the payment details and we will follow it up.',
        ],
      },
      {
        id: 'fees',
        title: 'Fees paid to CES institutes',
        nav: 'Institute fees',
        paras: ['Fees may be refunded:'],
        bullets: [
          { text: 'If you withdraw from your admission before the academic session begins.' },
          { text: 'If the institute cancels the course or programme you have paid for.' },
          { text: 'If you paid more than was due, or paid twice by mistake.' },
        ],
      },
      {
        id: 'non-refundable',
        title: 'What cannot be refunded',
        nav: 'Non-refundable',
        bullets: [
          { text: 'Registration fees.' },
          { text: 'Examination fees.' },
          { text: 'Fees for events, workshops and short-term facilities.' },
          { text: 'Any other charge marked as non-refundable when you paid it.' },
        ],
      },
      {
        id: 'how-to-ask',
        title: 'How to ask for a refund',
        nav: 'How to ask',
        bullets: [
          { lead: 'Fees: ', text: 'write to the Head of the Institution, with your fee receipt and any documents they ask for.' },
          { lead: 'Donations: ', text: 'write to the CES office at the email address below, with your Razorpay payment ID.' },
        ],
        after: ['Every request is checked against this policy, and we will tell you the outcome.'],
      },
      {
        id: 'timeline',
        title: 'When you will get it',
        paras: [
          'Approved refunds are processed within 15–30 working days of approval and paid back the same way you paid. For online payments that means the same card, UPI ID or bank account; we cannot send a refund to someone else\'s account.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        paras: [
          'We may update this policy from time to time. The date at the top of this page shows when it last changed, and a refund request is decided under the policy in force when the payment was made.',
        ],
      },
      { ...CONTACT_SECTION, paras: ['For questions about a refund, contact the CES office:'] },
    ],
  },

  // ───────────────────────── Website Terms ─────────────────────────
  {
    key: 'website-terms',
    title: 'Website Terms',
    path: '/support/website-terms',
    blurb: 'The rules for using cesociety.in and its content: what you can rely on, what you may reuse, and the limits of our responsibility.',
    sections: [
      {
        id: 'using',
        title: 'Using this website',
        paras: [
          'cesociety.in is the official website of Charotar Education Society (CES), Anand. By using it, you agree to these Website Terms. The services on the site, such as forms, donations, Dyuno and logins, are covered by our Terms & Conditions, and your personal information by our Privacy Policy.',
        ],
        links: [link.terms, link.privacy],
      },
      {
        id: 'information',
        title: 'About the information on this site',
        nav: 'Information on the site',
        paras: [
          'We work to keep the site accurate and up to date, but details such as admission dates, fees, courses, results and events can change. The official notice, prospectus or circular of the institute concerned always takes precedence over this website, so please confirm important details with the institute before you act on them.',
          'Answers from Dyuno, our AI assistant, are generated automatically and are not official statements of CES.',
        ],
      },
      {
        id: 'translations',
        title: 'Translated pages',
        paras: [
          'The Gujarati and Hindi versions of the site are produced automatically by Google Translate and may contain mistakes. If a translation differs from the English page, the English page applies.',
        ],
      },
      {
        id: 'content',
        title: 'Our content and how you may use it',
        nav: 'Using our content',
        paras: [
          'The text, photographs, videos, logos, designs and documents on this site belong to CES or are used with permission. The CES name and logo belong to the Society.',
          'You may view, download and print pages for your own personal, non-commercial use, and share links to them. Anything else, such as republishing our content, reusing our photographs, or using the CES name or logo, needs our written permission.',
          'Inventions and other intellectual property created at CES are governed by the policy of the CES IP Cell.',
        ],
        links: [{ label: 'The IP Cell', link: '/ipcell' }],
      },
      {
        id: 'photographs',
        title: 'Photographs of students and staff',
        nav: 'Photographs',
        paras: [
          'We publish photographs from CES events and campus life to share the life of our institutes. If you appear in a photograph and would like it removed, or you are a parent or guardian asking on behalf of your child, contact us and we will look at your request promptly.',
        ],
      },
      {
        id: 'acceptable-use',
        title: 'Acceptable use',
        bullets: [
          { text: 'Use the site only for lawful purposes.' },
          { text: 'Do not try to gain unauthorised access to the site, its servers or the systems connected to it, or test its security without our written permission.' },
          { text: 'Do not copy the site in bulk, scrape it in a way that slows it down, or introduce viruses or other harmful code.' },
          { text: 'Do not use the site to send spam, or to pretend to be CES or one of its institutes.' },
        ],
      },
      {
        id: 'links',
        title: 'Links and embedded content',
        nav: 'Links and embeds',
        paras: [
          'The site links to other websites and shows content from other services, such as YouTube videos and Google Maps. Those services have their own terms and privacy policies, and CES is not responsible for their content or for how they handle your information.',
        ],
      },
      {
        id: 'availability',
        title: 'Availability and liability',
        nav: 'Liability',
        paras: [
          'We aim to keep the site running at all times, but it may be unavailable during maintenance or for reasons beyond our control. To the extent the law allows, the site is provided "as is", and CES is not liable for any loss arising from your use of it, from relying on its content or from its being unavailable.',
          'If you misuse the site or break these terms, you are responsible for the claims and costs that result.',
        ],
      },
      GOVERNING_LAW,
      {
        id: 'changes',
        title: 'Changes to these terms',
        paras: [
          'We may update these terms from time to time. The date at the top of this page shows when they last changed; continuing to use the site after a change means you accept the updated terms.',
        ],
      },
      { ...CONTACT_SECTION, paras: ['For questions about these terms, or to ask permission to use our content, contact the CES office:'] },
    ],
  },

  // ─────────────────────── Disclosure (RTI) ───────────────────────
  {
    key: 'disclosure',
    title: 'Disclosure Policy',
    path: '/support/disclosure-policy',
    blurb: 'What Charotar Education Society makes public, how to ask for information, and what we keep confidential.',
    sections: [
      {
        id: 'commitment',
        title: 'Our commitment',
        paras: [
          'CES has served the Charotar region since 1916 and is accountable to its students, parents, staff, donors and the public. This policy sets out what we publish, how you can ask for more, and what we keep confidential.',
        ],
      },
      {
        id: 'published',
        title: 'What we publish',
        bullets: [
          { lead: 'History and governance: ', text: 'the Society\'s history, its registration and the members of its management.' },
          { lead: 'Our institutes: ', text: 'every school, college, hostel and department, with the key facts in CES at a Glance.' },
          { lead: 'The Rahatokarsh Fund: ', text: 'its objectives, its donors and the students it has supported.' },
          { lead: 'Intellectual property: ', text: 'the IP Cell\'s policy and its registers of patents, designs, copyrights and trademarks.' },
          { lead: 'News and notices: ', text: 'news, events, tenders and other announcements.' },
        ],
        links: [
          { label: 'Our history', link: '/about/history' },
          { label: 'Management', link: '/management' },
          { label: 'CES at a Glance', link: '/about/profile' },
          { label: 'Rahatokarsh Fund', link: '/fund' },
          { label: 'IP Cell', link: '/ipcell' },
        ],
      },
      {
        id: 'statutory',
        title: 'Statutory disclosures',
        paras: [
          'Some CES institutes must publish particular information under the rules of the university, board or council they are affiliated to. Those disclosures are published by the institute concerned, on its own website or notice board.',
        ],
      },
      {
        id: 'requests',
        title: 'Asking for information (RTI)',
        nav: 'Asking for information',
        paras: [
          'If you need information that is not published, write to the Secretary, Charotar Education Society, at the address below, describing the information you need as clearly as you can. We will reply within a reasonable time, and if something cannot be shared we will tell you why.',
          'Where a CES institute is a public authority under the Right to Information Act, 2005, applications for its information are handled by its Public Information Officer as the Act requires.',
        ],
      },
      {
        id: 'confidential',
        title: 'What we keep confidential',
        bullets: [
          { text: 'Personal information about students, parents, staff, alumni and donors, as set out in our Privacy Policy.' },
          { text: 'Counselling records.' },
          { text: 'Question papers before an examination, and other assessment material.' },
          { text: 'Information given to us in confidence, or whose disclosure the law restricts.' },
        ],
        links: [link.privacy],
      },
      {
        id: 'automated',
        title: 'AI and translated content',
        paras: [
          'Dyuno, the assistant on this site, uses AI models from OpenAI to write its answers, and the Gujarati and Hindi versions of the site are translated automatically by Google. Neither is an official statement of CES; the English pages and the notices of our institutes are.',
        ],
      },
      {
        id: 'announcements',
        title: 'Announcements and sponsorship',
        nav: 'Announcements',
        paras: [
          'Banners and announcements on this site promote CES\'s own events, institutes and programmes. If any content is ever sponsored or produced with a partner, we will say so clearly.',
        ],
      },
      {
        id: 'corrections',
        title: 'Corrections',
        paras: [
          'We aim to publish information that is accurate and up to date. If you notice something wrong or out of date, tell us and we will correct it promptly.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        paras: ['We may update this policy from time to time. The date at the top of this page shows when it last changed.'],
      },
      { ...CONTACT_SECTION, paras: ['For information requests or questions about this policy, contact the CES office:'] },
    ],
  },
];
