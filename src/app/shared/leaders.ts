/**
 * The Society's two office-bearers, shared by the About page messages, the Management page,
 * the home page's Secretary message and each leader's own page (/management/:role).
 *
 * Sources: tenure and order from the former-bearers lists (Management page); the Secretary's
 * words from his message and his signed Rahatokarsh appeal on cesociety.in; centenary facts from
 * the Society's history. No full message from the Chairman has been published yet - add his
 * paragraphs to `message` when CES supplies them.
 */
export type LeaderRole = 'chairman' | 'secretary';

export interface LeaderPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface Leader {
  role: LeaderRole;
  /** Name as printed on cards. */
  name: string;
  /** Name in full, for the profile. */
  fullName: string;
  /** The office alone ("Chairman"), for the signature and the Management card. */
  position: string;
  /** Short title on cards ("Chairman, CES"). */
  title: string;
  /** Second line on the Management card. */
  subRole: string;
  /** Line under the name in the leader page's hero. */
  heroBlurb: string;
  photo: string;
  /** The short message the cards quote; also the first paragraph of the full message. */
  quote: string;
  /** Heading over the message on the leader's page. */
  messageHeading: string;
  /** The message in full, first paragraph first (the first is always `quote`). */
  message: readonly string[];
  profileHeading: string;
  profile: readonly string[];
  /** Event photographs: the first sits beside the profile, the next two side by side. */
  photos: readonly LeaderPhoto[];
  /** The page's closing call to action. */
  cta: { label: string; link: string };
}

const CENTENARY = 'From Shatakotsav, our centenary year (2015-16)';
const centenary = (n: string, alt: string): LeaderPhoto => ({
  src: `/assets/images/celebration/shatakotsav/${n}.jpg`,
  alt,
  caption: CENTENARY,
});

const CHAIRMAN_QUOTE =
  'Our mission is to create institutions that inspire, innovate and impact lives. Together, we can build a stronger and brighter tomorrow.';

const SECRETARY_QUOTE =
  "Education is one of the most important parts of a student's life. It helps you think clearly when big decisions come along, and it points you to the right career. That is how our children go on to do well in life.";

export const LEADERS: readonly Leader[] = [
  {
    role: 'chairman',
    name: 'Shri Niravkumar N. Patel',
    fullName: 'Shri Niravkumar Navinchandra Patel',
    position: 'Chairman',
    title: 'Chairman, CES',
    subRole: 'Charotar Education Society',
    heroBlurb: 'Chairman of Charotar Education Society since 2009',
    photo: '/assets/images/directors/chairman.jpg',
    quote: CHAIRMAN_QUOTE,
    messageHeading: 'A message from our Chairman',
    message: [CHAIRMAN_QUOTE],
    profileHeading: 'About Shri Niravkumar N. Patel',
    profile: [
      'Shri Niravkumar Navinchandra Patel has been Chairman of Charotar Education Society since 2009. He is the 23rd person to hold the post, in a line that began with Shri Gopaldas Baidas Desai in 1916.',
      'His years in the chair have included the Society\'s centenary. Between April 2015 and April 2016 CES held 100 events and set 8 Guinness World Records, and in its 99th year it started the Rahatokarsh Fund to pay the fees of bright students who are short of money.',
      'Today the Society he leads runs 31+ institutes on three campuses in Anand, from pre-primary to Ph.D., and counts more than 5 lakh alumni.',
    ],
    photos: [
      centenary('18', 'Students gathered in front of the D.N. High School building during the centenary'),
      centenary('06', 'Students forming a large pattern on the ground during a centenary record attempt'),
      centenary('03', 'A large evening audience at a centenary programme'),
    ],
    cta: { label: 'Explore Our Institutes', link: '/academic/school' },
  },
  {
    role: 'secretary',
    name: 'Shri Ketankumar P. Patel',
    fullName: 'Shri Ketankumar Purushottamdas Patel',
    position: 'Hon. Secretary',
    title: 'Hon. Secretary, CES',
    subRole: 'Syndicate and Senate Member of Sardar Patel University',
    heroBlurb: 'Honorary Secretary of Charotar Education Society since 2009',
    photo: '/assets/images/directors/vc.jpg',
    quote: SECRETARY_QUOTE,
    messageHeading: 'A message from our Secretary',
    message: [
      SECRETARY_QUOTE,
      'People often come to me asking for a fee waiver for a bright student who badly wants to study. Some of these children have lost their parents. Others have parents with almost no income, who still scrimp and save so their children can have a better future.',
      "CES has helped students like these ever since it began. With a proper fund behind us we can help many more, so in the Society's 99th year I set up the Rahatokarsh Fund. I ask every well-wisher of the Society to give what they can.",
    ],
    profileHeading: 'About Shri Ketankumar P. Patel',
    profile: [
      'Shri Ketankumar Purushottamdas Patel has been Honorary Secretary of Charotar Education Society since 2009. He is the 21st person to hold the post, in a line that began with Shri Ambalal Motibhai Patel in 1916.',
      'He is also a member of the Syndicate and the Senate of Sardar Patel University, Vallabh Vidyanagar.',
      'He runs the Rahatokarsh Fund himself, and publishes its interest, its donors and the students it helps on this website, so anyone can see where the money goes.',
    ],
    photos: [
      centenary('08', 'Students at a drawing activity during the centenary'),
      centenary('40', 'A kabaddi team at a centenary sports event'),
      centenary('04', 'Musicians on stage at a centenary cultural programme'),
    ],
    cta: { label: 'Give to the Rahatokarsh Fund', link: '/fund' },
  },
];

export const leaderByRole = (role: string | null | undefined): Leader | undefined =>
  LEADERS.find((l) => l.role === role);
