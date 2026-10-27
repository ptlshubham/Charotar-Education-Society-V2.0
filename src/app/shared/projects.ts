import { SearchItem } from './models/models';
import { Programme, ProgrammeKind } from './programme';

/**
 * The Society's projects and initiatives, shared by the Projects page cards and each project's
 * own page (/project/:slug), and indexed by the site search.
 *
 * Sources: the projects on cesociety.in, the Society's history document (the Udaan and
 * Vocational Centre details) and the Social Activity notes on ANANDAM and ARJUN. Only figures
 * CES has published are used; add more to `facts` as CES supplies them.
 */
export type ProjectFocus = 'education' | 'technology' | 'sports' | 'environment' | 'health' | 'skill' | 'arts';

export const FOCUS_LABEL: Record<ProjectFocus, string> = {
  education: 'Education',
  technology: 'Technology',
  sports: 'Sports',
  environment: 'Environment',
  health: 'Health',
  skill: 'Skill Development',
  arts: 'Arts & Culture',
};

export interface Project extends Programme {
  focus: ProjectFocus;
}

export const PROJECT_KIND: ProgrammeKind = {
  noun: 'project',
  plural: 'projects',
  list: { label: 'Projects', link: '/project' },
  cta: 'Read More',
  groupTerm: 'Focus area',
};

/** The Society's office, for projects without a number of their own. */
const OFFICE = '(02692) 243083';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'dyuno-ai',
    title: 'Dyuno AI',
    desc: 'Our AI assistant, open to everyone on this website. Ask Dyuno about CES, admissions or courses, or get help with any study topic, at any hour.',
    focus: 'technology',
    image: '/assets/icons/dyuno/dyuno-stand.webp',
    contain: true,
    heroImage: '/assets/images/hero/home.webp',
    tagline: 'Our AI assistant, free for everyone who visits this website.',
    heading: 'Help with studies, and answers about CES, at any hour.',
    about: [
      'Dyuno is the newest CES project, and the first that anyone can use, whether or not they study with us. It is an AI assistant built into this website. Open it from the chat button on any page, or on its own full page, and ask your question in plain words.',
      'For students, Dyuno is a patient tutor. It explains a concept in simple language, works through a sum one step at a time, and helps plan revision before an exam. When a question is about a syllabus or an exam, it looks the answer up on official university and government websites and shows the links, so you can check the source for yourself.',
      'For parents and anyone thinking of joining CES, Dyuno answers questions about admissions, our institutes, hostels, fees and scholarships. For anything else, the Other Queries button takes you to our contact page.',
      'Chats are saved in your own browser, so you can pick up where you left off, and any chat can be shared with a link.',
    ],
    listHeading: 'What you can ask Dyuno',
    list: [
      'To explain a concept in simple words, with examples',
      'To solve a maths or science problem step by step',
      'For help preparing for an exam or making a study timetable',
      'About career options, for example after 12th Science',
      'About admissions, institutes, hostels, fees and scholarships',
      'About a syllabus or an exam, with links to the official source',
    ],
    facts: [
      { value: 'Free', label: 'For every visitor' },
      { value: '24/7', label: 'Any day, any hour' },
      { value: 'No login', label: 'Just open it and ask' },
    ],
    audience: 'Students, parents, teachers and anyone curious about CES',
    where: 'Online, on every page of this website',
    phone: OFFICE,
    action: { label: 'Talk to Dyuno', link: '/dyuno' },
  },
  {
    slug: 'aditya',
    title: 'Project ADITYA',
    desc: 'The first and largest solar power plant in the Charotar region, built to run our institutions on sunlight and save electricity.',
    focus: 'environment',
    image: '/assets/images/project/aditya.webp',
    tagline: 'Solar power for our schools and colleges, made on our own campus.',
    heading: 'Classrooms that run on sunlight.',
    about: [
      'Aditya is one of the names of the sun, and Project ADITYA puts it to work for CES. Under this project the Society set up a solar power plant for its institutions: the first micro-inverter based solar plant at an educational institute in the Charotar region, and the largest.',
      'In a micro-inverter system, each solar panel has its own small inverter. If one panel is shaded or dusty, the rest keep producing at full strength, and a fault in a single panel is easy to find. The plant lowers the power our campuses draw from the grid, and the bills that come with it.',
      'The aim is simple: more clean energy in education. And our students get to see solar power at work on their own campus, not just in a textbook.',
    ],
    listHeading: 'What the project does',
    list: [
      'Generates solar power for CES institutions, on campus',
      'Cuts the electricity drawn from the grid, and the bills',
      'Uses a micro-inverter on every panel, so output stays steady and faults are easy to trace',
      'Shows students clean energy at work, every day',
    ],
    audience: 'All CES institutions',
    where: 'CES campus, Anand',
    phone: OFFICE,
  },
  {
    slug: 'eklavya',
    title: 'Project EKLAVYA',
    desc: 'Life skills, personality development and everyday technology like computers and the internet, taught alongside the syllabus.',
    focus: 'education',
    image: '/assets/images/project/eklavya.webp',
    tagline: 'Life skills, confidence and everyday technology, taught alongside the syllabus.',
    heading: 'Ready for life, not only for exams.',
    about: [
      'Good marks matter, but they are not all a young person needs. Project EKLAVYA prepares CES students for life beyond the classroom: making sound decisions, speaking up, working with others and carrying themselves with confidence.',
      'It also makes sure every student is at ease with the technology they will use at work and at home, starting with computers and the internet. All of this is taught alongside the regular syllabus, not in place of it.',
      'The project takes its name from Eklavya of the Mahabharata, who taught himself archery through sheer dedication. That is the spirit we hope our students carry with them.',
    ],
    listHeading: 'What students learn',
    list: [
      'Life skills for everyday decisions and problems',
      'Personality development: confidence, communication and teamwork',
      'Computers and the internet, for study and for work',
      'All of it alongside the regular syllabus',
    ],
    audience: 'Students of CES schools and colleges',
    where: 'CES schools and colleges, Anand',
    phone: OFFICE,
  },
  {
    slug: 'e-gyan',
    title: 'Project E-GYAN',
    desc: 'Presentations, e-books and animations gathered and rewritten in simple language, so students can learn and revise online.',
    focus: 'technology',
    image: '/assets/images/project/egyan.webp',
    tagline: 'Good study material from the web, gathered in one place and written in simple language.',
    heading: 'Study material that is easy to find and easy to follow.',
    about: [
      "The internet is full of useful study material, but finding the right piece, at the right level, takes time students don't have. Project E-GYAN does that work for them.",
      'Presentations, e-books, animations and visuals are collected from the web, stored in one place and rewritten in simple language. Students can open them whenever they want, to learn something new or to revise before an exam.',
      'Gyan means knowledge, and E-GYAN is about making it easier to reach.',
    ],
    listHeading: 'What students get',
    list: [
      'Presentations, e-books, animations and visuals in one place',
      'Material rewritten in simple language',
      'Easy to find again whenever it is needed',
      'Help with new topics and with exam revision',
    ],
    audience: 'CES students',
    where: 'Online',
    phone: OFFICE,
  },
  {
    slug: 'setu',
    title: 'Project SETU',
    desc: 'Every CES campus joined on one network, which keeps our digital work and accounts simple.',
    focus: 'technology',
    image: '/assets/images/project/setu.webp',
    tagline: 'Every CES campus joined on one network.',
    heading: 'One network for the whole Society.',
    about: [
      'Setu means bridge. Project SETU bridges the distance between our campuses by connecting every one of them on a single network.',
      'With all campuses on the same network, the Society runs its digital services and its accounts from one central system instead of many separate ones. Records stay in one place, offices can share information easily, and day-to-day work is simpler for staff.',
    ],
    listHeading: 'What the project does',
    list: [
      'Connects every CES campus on one network',
      'Gives all institutions the same central digital services',
      'Runs the accounts of the whole Society from one system',
      'Saves office staff from doing the same work twice',
    ],
    audience: 'CES institutions and their offices',
    where: 'Every CES campus',
    phone: OFFICE,
  },
  {
    slug: 'sangam',
    title: 'Project SANGAM',
    desc: 'All our institutions run from a single website, so the whole Society works as one.',
    focus: 'technology',
    image: '/assets/images/project/sangam.webp',
    tagline: 'All our institutions managed from a single web portal.',
    heading: 'Many institutions, one portal.',
    about: [
      'Sangam means the place where rivers meet. Project SANGAM brings the work of every CES institution together in one web portal, so they are all managed from a single place instead of separate systems.',
      'Information stays consistent across institutions, effort is not wasted on duplicate records, and the Society works as one. That makes CES more effective as a whole, and leaves each institute more time for its students.',
    ],
    listHeading: 'What the project does',
    list: [
      'One web portal for every CES institution',
      'Information kept consistent across the Society',
      'Less duplicate paperwork for each institute',
      'The whole Society managed as one',
    ],
    audience: 'CES institutions and their staff',
    where: 'Online, across all CES institutions',
    phone: OFFICE,
  },
  {
    slug: 'arjun',
    title: 'Project ARJUN',
    desc: "Coaching in shooting sport, from a student's first lesson to competing.",
    focus: 'sports',
    image: '/assets/images/project/arjun.webp',
    tagline: 'Professional coaching in shooting sport, within easy reach of our students.',
    heading: 'A steady hand and a sharp eye.',
    about: [
      'Shooting is a sport of focus, patience and control, and good coaching for it is hard to find. Project ARJUN brings professional shooting coaching to CES and makes it easy for our students to take up the sport.',
      'Students learn at a dedicated training centre, starting with the basics, and those who show promise are trained to compete. It is one of the most popular centres among our students, and CES students have competed and won at state and national level in a range of sports.',
      'The project is named after Arjun of the Mahabharata, the archer who never lost sight of his target.',
    ],
    listHeading: 'What the project offers',
    list: [
      'Professional coaching in shooting sport',
      'A dedicated training centre',
      "Training from a student's first lesson to competition",
      'A path to state and national level events',
    ],
    audience: 'CES students interested in shooting sport',
    where: 'CES campus, Anand',
    phone: OFFICE,
  },
  {
    slug: 'anandam',
    title: 'Project ANANDAM',
    desc: 'Students can talk privately with a counsellor about stress, study worries, career choices or relationships.',
    focus: 'health',
    image: '/assets/images/project/anandam.webp',
    tagline: 'Free, private counselling for any student who needs to talk.',
    heading: 'Someone to talk to, in confidence.',
    about: [
      'Studies, exams, friends, family and the pressure to do well can weigh heavily on a young person. CES knows this, and Project ANANDAM was started so that no student has to carry it alone.',
      'Any student can meet a counsellor one to one, in private, and talk through what is troubling them: stress, worries about studies, a career choice, or difficulties with the people around them. The counsellor helps them work it through, and helps them build the resilience to cope when things get hard again.',
      'Counselling under ANANDAM is free. The project also helps keep students away from harmful habits such as tobacco and substance use. Anandam means joy, and a calm, stress-free student life is what it works towards.',
    ],
    listHeading: 'How it helps',
    list: [
      'One-to-one sessions with a counsellor',
      'Complete privacy',
      'Help with stress, studies, career choices and relationships',
      'Building resilience for difficult times',
      'Free for every student',
    ],
    audience: 'Every CES student',
    where: 'CES campus, Anand',
    phone: OFFICE,
  },
  {
    slug: 'sports-academy',
    title: 'Sports Academy',
    desc: 'Proper coaching for students who want to compete at state, national and international level.',
    focus: 'sports',
    image: '/assets/images/project/sports.webp',
    tagline: 'Professional coaching for students who want to compete.',
    heading: 'From the school ground to the national stage.',
    about: [
      'Some students are happiest on the playing field, and some of them have real talent. The CES Sports Academy gives them professional coaching, so they can take their game as far as it will go.',
      'Coaching covers sports such as cricket and shooting, and opens the door to state, national and international level competition. CES students have already competed and won at state and national tournaments in a range of sports and games.',
    ],
    listHeading: 'What the academy offers',
    list: [
      'Professional coaching',
      'Training in sports such as cricket and shooting',
      'Preparation for state, national and international level events',
      'Sport alongside regular studies',
    ],
    audience: 'CES students with a talent for sport',
    where: 'CES campus, Anand',
    phone: OFFICE,
  },
  {
    slug: 'performing-arts-academy',
    title: 'Performing Arts Academy',
    desc: 'Training in dance, music, drawing, theatre and animation for students who want to take their talent further.',
    focus: 'arts',
    image: '/assets/images/project/performing-arts.webp',
    tagline: 'Theatre, dance, music, singing, drawing, design and animation, taught by people who work in those fields.',
    heading: 'Room for every talent.',
    about: [
      'Not every gift shows up in an exam paper. The CES Performing Arts and Fine Arts Academy was set up so that every student can follow the art they love, with proper training, and not only as a hobby on the side.',
      'Experts from each field teach theatre, dance, music, singing, drawing, design and animation. The academy is open to members of the community too, so children and adults learn alongside our students.',
    ],
    listHeading: 'What you can learn',
    list: ['Theatre', 'Dance', 'Music and singing', 'Drawing and design', 'Animation', 'All taught by working professionals'],
    audience: 'CES students, and children and adults from the community',
    where: 'Anand, Gujarat',
    phone: '(02692) 266789',
    website: 'https://www.performing.cesociety.in/',
    action: { label: 'Visit the academy website', link: 'https://www.performing.cesociety.in/', external: true },
  },
  {
    slug: 'vocational-training-centre',
    title: 'Swami Dayanand Saraswati Vocational Training Centre',
    desc: 'Job-ready courses taught by experts from partner organisations. Now running: Data Structures & Algorithms, the CELTAS English Enrichment Programme and Tally accounting.',
    focus: 'skill',
    // TODO: a photo of the centre; the careers banner stands in until then.
    image: '/assets/images/hero/careers.webp',
    tagline: 'Job-ready courses taught by experts from partner organisations.',
    heading: 'Skills that lead to work.',
    about: [
      'A degree opens doors, but employers also look for practical skills. The Swami Dayanand Saraswati Vocational Training Centre helps students and young people build those skills and grow in their careers.',
      'For each course, the centre signs a Memorandum of Understanding (MoU) with a professional organisation in that field, and the organisation sends experts to teach from real practice and experience. Students get training they can trust, and they meet people from the industry, which can lead to new jobs.',
      'Three courses are running now. More will follow as the centre signs MoUs with more organisations.',
    ],
    listHeading: 'Courses running now',
    list: [
      'Data Structures & Algorithms',
      'CELTAS English Enrichment Programme (Comprehensive English Language Teaching & Assessment Services)',
      'Tally accounting',
    ],
    audience: 'Students and young people looking for job skills',
    where: 'Anand, Gujarat',
    phone: OFFICE,
  },
  {
    slug: 'udaan-education',
    title: 'Udaan Education',
    desc: 'Learning by doing in science and maths for classes 6 to 10, plus JEE, NEET and GUJCET coaching for classes 11 and 12. 134 Udaan students sat the Ramanujan Maths Olympiad and came back with 17 medals.',
    focus: 'education',
    // TODO: a photo of an Udaan class; the Schools banner stands in until then.
    image: '/assets/images/hero/school.webp',
    tagline: 'Hands-on science and maths for Std 6 to 10, and coaching for JEE, NEET and GUJCET.',
    heading: 'Science and maths, learned by doing.',
    about: [
      'Udaan began with one idea: children understand science and maths best when they do it with their own hands. Its classes for Std 6 to 10 run at Charotar English Medium School, D.N. High School and Kasturba Kanya Vidyalaya.',
      'Lessons are built around experiments. Students try things out in the lab, the classroom and the garden, and make their own models, so hard topics become easier to grasp. Each topic is taught in depth: what the student learned about it last year, what this year adds, and how it will come up again in later classes. Every chapter has extra activities beyond the textbook, planned so that every child takes part.',
      'Progress is checked often. There is a test every week and another at the end of each chapter, each child is assessed in several ways, and parents meet the teachers at the end of every month. Students are encouraged to enter maths and science competitions at district, state and national level.',
      'For Std 11 and 12 science students from all CES schools, Udaan also coaches for the board exams and for JEE, NEET and GUJCET.',
      "The results show. In the Maths Olympiad held by the All India Ramanujan Maths Club, 134 Udaan students from Std 6 to 10 took part and won 6 gold, 5 silver and 6 bronze medals. Udaan also came second in the state in the club's maths and science model presentation.",
    ],
    listHeading: 'How Udaan teaches',
    list: [
      'Experiments and model-making in the lab, classroom and garden',
      'Each topic linked to what came before and what comes next',
      'Extra activities in every chapter, for every child',
      'A test every week, and one after every chapter',
      'A meeting with parents at the end of every month',
      'Board, JEE, NEET and GUJCET coaching for Std 11 and 12 science',
    ],
    facts: [
      { value: '134', label: 'Students in the Ramanujan Maths Olympiad' },
      { value: '17', label: 'Medals: 6 gold, 5 silver, 6 bronze' },
      { value: '2nd', label: 'In the state for maths and science models' },
    ],
    audience: 'Std 6 to 12 students of CES schools',
    where: 'Charotar English Medium School, D.N. High School and Kasturba Kanya Vidyalaya, Anand',
    phone: OFFICE,
  },
];

export function projectBySlug(slug: string | null | undefined): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Each project's page in the site search. */
export const PROJECT_SEARCH: readonly SearchItem[] = PROJECTS.map((p) => ({
  title: p.title,
  category: 'Projects',
  link: `/project/${p.slug}`,
  icon: 'file',
  keywords: `${p.title} ${FOCUS_LABEL[p.focus]} project initiative ces`.toLowerCase(),
}));
