import { SearchItem } from './models/models';
import { PLACEHOLDER } from './placeholder-images';
import { Programme, ProgrammeKind, ProgrammeSummary } from './programme';
import { projectBySlug } from './projects';

/**
 * The Society's social activities, initiatives and camps, shared by the Social Activity page
 * cards and each one's own page (/social-activity/:slug), and indexed by the site search.
 *
 * Sources: the Social Activity page on cesociety.in and the Society's history document (staff
 * cover, the Senior Citizen Forum, the vaccination camp and Chatkaro). Only figures CES has
 * published are used.
 *
 * The category split is inferred from each programme's nature - health camps under `camp`,
 * partnerships and standing programmes under `initiative`. Change the `category` field if CES
 * classifies them differently.
 */
export type ActivityCategory = 'activity' | 'initiative' | 'camp';

export const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  activity: 'Activity',
  initiative: 'Initiative',
  camp: 'Camp',
};

interface ActivityFields {
  category: ActivityCategory;
  /** What it is about, shown above the title on its card. */
  theme: string;
}

/** An activity with its page here, at /social-activity/{slug}. */
export interface ActivityPage extends Programme, ActivityFields {
  /**
   * When the activity is one of our projects, that project's slug: the page tells the same
   * story, and search engines are pointed at the project's page as the main one.
   */
  project?: string;
}

/** An activity whose page lives elsewhere on the site (Chatkaro has its own, /chatkaro). */
export interface ActivityLink extends ProgrammeSummary, ActivityFields {
  link: string;
}

export type SocialActivity = ActivityPage | ActivityLink;

export const ACTIVITY_KIND: ProgrammeKind = {
  noun: 'activity',
  plural: 'activities',
  list: { label: 'Social Activity', link: '/social-activity' },
  cta: 'Explore',
  groupTerm: 'Type',
};

/** The Society's office, for activities without a number of their own. */
const OFFICE = '(02692) 243083';

/** A project's page content, for an activity that is that project. */
function asProject(slug: string) {
  return { ...projectBySlug(slug)!, project: slug };
}

export const SOCIAL_ACTIVITIES: readonly SocialActivity[] = [
  {
    ...asProject('performing-arts-academy'),
    slug: 'performing-arts',
    title: 'Performing Arts Activities',
    desc: 'Theatre, music, drawing, design, dance and animation for students and the community.',
    category: 'activity',
    theme: 'Arts & Culture',
    // The project's dance photo: social-activity/performing-arts.png is actually of shooting practice.
  },
  {
    slug: 'sports',
    title: 'Opportunities in Sports',
    desc: 'Project Arjun and our sports academy support students in shooting, cricket and other sports.',
    category: 'activity',
    theme: 'Sports',
    image: '/assets/images/social-activity/sports.png',
    tagline: 'Coaching in shooting, cricket and more, for every student who loves sport.',
    heading: 'Room to play, and a path to compete.',
    about: [
      'A good education builds the body as well as the mind. Alongside their studies, CES students can train in shooting, cricket and other sports, with proper coaching.',
      'Shooting is coached under Project ARJUN at a dedicated training centre, and the CES Sports Academy gives professional coaching to students who want to compete. Both are among the most popular choices with our students. There is also a modern gym where students are coached free of charge.',
      'The training shows in the results. CES students have competed and won at state and national level tournaments in a range of sports and games.',
    ],
    listHeading: 'What students can do',
    list: [
      'Shooting, under Project ARJUN',
      'Cricket and other sports',
      'Professional coaching through the Sports Academy',
      'Free coaching at the CES gym',
      'Compete at state and national level',
    ],
    related: [
      { label: 'Project ARJUN', link: '/project/arjun' },
      { label: 'Sports Academy', link: '/project/sports-academy' },
    ],
    audience: 'CES students',
    where: 'CES campus, Anand',
    phone: OFFICE,
  },
  {
    slug: 'chatkaro',
    title: 'Organic & Food Festival – Chatkaro',
    desc: 'A three-day campus festival every January, with traditional and organic food, skill workshops and the Alumni Meet.',
    category: 'activity',
    theme: 'Community Events',
    image: '/assets/images/social-activity/food-festival.png',
    link: '/chatkaro',
  },
  {
    slug: 'left-over-food',
    title: 'Left-over Food Distribution',
    desc: 'Volunteers collect surplus food, pack it hygienically and take it to people in need and to animal shelters.',
    category: 'activity',
    theme: 'Social Service',
    image: '/assets/images/social-activity/left-over-food.png',
    tagline: 'Good food from weddings and restaurants, sent to people who need it instead of the bin.',
    heading: 'No good food wasted.',
    about: [
      'After a wedding, a function or a busy evening at a restaurant, a lot of good food is left over, and too much of it ends up thrown away. CES volunteers step in.',
      "Our team collects the leftover food in the Society's own van, packs it in clean, hygienic packets, and takes it to people in need, and to animal shelters too.",
      'It is simple, practical service: food that would have been wasted becomes a meal for someone.',
    ],
    listHeading: 'How it works',
    list: [
      'Leftover food collected from weddings, functions and restaurants',
      "Carried in the Society's own van",
      'Packed in clean, hygienic packets',
      'Given to people in need and to animal shelters',
      'Run by a dedicated team of volunteers',
    ],
    audience: 'People in need, and animal shelters',
    where: 'Anand, Gujarat',
    phone: OFFICE,
  },
  {
    slug: 'staff-health',
    title: 'Staff Health Check-up Camps',
    desc: 'Regular check-ups for every employee, with free medical cover of Rs. 1 lakh and accident insurance of Rs. 2 lakh.',
    category: 'camp',
    theme: 'Staff Wellbeing',
    image: '/assets/images/social-activity/staff-health.png',
    tagline: 'Regular check-ups, and free medical and accident cover, for every CES employee.',
    heading: 'Looking after the people who look after our students.',
    about: [
      'Our teachers and staff give their days to our students, and the Society looks after their health in return. Regular check-up camps are held for the whole CES family, to keep everyone fit and to catch problems early.',
      'Every employee also gets free medical cover (mediclaim) of Rs. 1 lakh and accident insurance of Rs. 2 lakh, paid for by the Society. The cover has helped many staff members meet the cost of treatment, operations and long illnesses.',
    ],
    listHeading: 'What staff receive',
    list: [
      'Regular health check-up camps',
      'Free mediclaim cover of Rs. 1 lakh',
      'Free accident insurance of Rs. 2 lakh',
      'Help with medical bills when it is needed most',
    ],
    facts: [
      { value: 'Rs. 1 lakh', label: 'Free medical cover for every employee' },
      { value: 'Rs. 2 lakh', label: 'Free accident insurance' },
    ],
    audience: 'Every CES employee',
    where: 'CES campuses, Anand',
    phone: OFFICE,
  },
  {
    slug: 'red-cross',
    title: 'Tie-up with Red Cross Society',
    desc: 'Regular blood donation camps with the Red Cross Society, because every drop of blood counts.',
    category: 'initiative',
    theme: 'Blood Donation',
    image: '/assets/images/social-activity/red-cross.png',
    tagline: 'Regular blood donation camps, held with the Red Cross Society.',
    heading: 'Every drop of blood counts.',
    about: [
      'Blood cannot be made in a factory. It can only come from people willing to give it. With that in mind, CES has signed an agreement with the Red Cross Society to hold blood donation camps.',
      'The camps are held regularly, and the blood collected over the years has helped save the lives of thousands of people. Giving blood is quick and safe, and one donation can help more than one patient.',
    ],
    listHeading: 'About the camps',
    list: [
      'Held regularly, with the Red Cross Society',
      'Run under a formal agreement between CES and the Red Cross',
      'Open to healthy adults who wish to give blood',
      'Blood that has helped save thousands of lives',
    ],
    audience: 'Anyone healthy, aged 18 or over, who wants to give blood',
    where: 'Anand, Gujarat',
    phone: OFFICE,
  },
  {
    ...asProject('anandam'),
    slug: 'project-anandam',
    title: 'Project Anandam',
    desc: 'Free, private counselling for students dealing with stress, studies, career choices or relationships.',
    category: 'initiative',
    theme: 'Wellbeing',
    image: '/assets/images/social-activity/project-anandam.png',
  },
  {
    slug: 'shivani-foundation',
    title: 'Tie-up with Shivani Foundation',
    desc: 'With the Dr. Shivani Bhatt Foundation, we help girls from poorer families with study costs and medical needs.',
    category: 'initiative',
    theme: "Girls' Education",
    image: '/assets/images/social-activity/shivani-foundation.png',
    tagline: 'Help with study costs and medical needs for girls from poorer families.',
    heading: 'No girl should have to stop studying for want of money.',
    about: [
      'For many families, the cost of education, or of a sudden illness, forces a hard choice, and too often it is a daughter who stops studying. CES works with the Dr. Shivani Bhatt Foundation to keep that from happening.',
      'Through this tie-up, many female students from underprivileged families have been helped with their education needs, and with their medical needs too, so they can stay healthy and keep studying.',
    ],
    listHeading: 'How the tie-up helps',
    list: [
      'Support with education costs for girls from poorer families',
      'Help with medical needs',
      'A better chance to finish their studies',
    ],
    audience: 'Female students from underprivileged families',
    where: 'CES institutions, Anand',
    phone: OFFICE,
  },
  {
    slug: 'cervical-cancer-vaccination',
    title: 'Cervical Cancer Vaccination Camp',
    desc: 'Free HPV vaccination for girls at CES schools, given with the help of donors, to protect them from cervical cancer.',
    category: 'camp',
    theme: "Women's Health",
    image: PLACEHOLDER.social.activities[4],
    tagline: 'Free HPV vaccination for girls at CES schools, made possible by donors.',
    heading: 'Protection today against a cancer of tomorrow.',
    about: [
      'Cervical cancer is one of the most common cancers among women in India, and most cases are caused by the HPV virus. A vaccine given at a young age protects against it.',
      'With the help of donors, CES holds vaccination camps where girls at the schools we run receive the HPV vaccine free of charge. Hundreds of girls have already been vaccinated.',
      'The camps also spread awareness. Girls and their families learn how cervical cancer can be prevented, which encourages healthier habits at home and saves on medical costs in the long run. It is an important step for the health of women in our community.',
    ],
    listHeading: 'What the camp offers',
    list: [
      'Free HPV vaccine for girls at CES schools',
      'Supported by donors',
      'Awareness for girls and their families',
      'A lower risk of cervical cancer later in life',
    ],
    facts: [
      { value: 'Free', label: 'HPV vaccine for girls at CES schools' },
      { value: 'Hundreds', label: 'Girls vaccinated so far' },
    ],
    audience: 'Girls studying at CES schools, and their families',
    where: 'CES schools, Anand',
    phone: OFFICE,
  },
  {
    slug: 'senior-citizen-forum',
    title: 'Senior Citizen Forum',
    desc: 'Since 2011, a club for former students and staff over 60, with monthly meetings, trips, and free gym, library and computer classes.',
    category: 'initiative',
    theme: 'Senior Citizens',
    image: PLACEHOLDER.social.moments[0],
    tagline: 'A club for former CES students and staff over 60, since 2011.',
    heading: 'Still part of the CES family.',
    about: [
      'Senior citizens carry a lifetime of experience and wisdom, and the Society values all they have given. On 5 May 2011, CES started the Senior Citizen Forum for anyone over 60 who once studied or worked at any CES school or college.',
      'Members meet on the last day of every month and share a meal, go on a trip together every three months, and can use the gym and the library and take computer classes, all free of charge.',
      'The forum is also a bridge between generations. Its members share their experience with younger people and guide them on the many sides of life.',
    ],
    listHeading: 'What members enjoy',
    list: [
      'A meeting and a meal on the last day of every month',
      'A trip every three months',
      'Free use of the gym',
      'Free use of the library',
      'Free computer classes',
      'Time with younger generations, sharing what they know',
    ],
    facts: [
      { value: '2011', label: 'Started on 5 May' },
      { value: '60+', label: 'Former students and staff' },
      { value: 'Free', label: 'Gym, library and computer classes' },
    ],
    audience: 'Anyone aged 60 or over who studied or worked at CES',
    where: 'Anand, Gujarat',
    phone: OFFICE,
  },
];

/** The activities with their page here, under /social-activity. */
export const ACTIVITY_PAGES = SOCIAL_ACTIVITIES.filter((a): a is ActivityPage => !a.link);

export function activityBySlug(slug: string | null | undefined): ActivityPage | undefined {
  return ACTIVITY_PAGES.find((a) => a.slug === slug);
}

/** Each activity's page in the site search (Chatkaro is found through the header menu). */
export const ACTIVITY_SEARCH: readonly SearchItem[] = ACTIVITY_PAGES.map((a) => ({
  title: a.title,
  category: 'Social Activity',
  link: `/social-activity/${a.slug}`,
  icon: 'heart',
  keywords: `${a.title} ${CATEGORY_LABEL[a.category]} social activity ces`.toLowerCase(),
}));
