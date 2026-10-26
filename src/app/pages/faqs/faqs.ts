import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';

interface Faq {
  q: string;
  a: string;
  /** The page that has the details, shown under the answer. */
  link?: { label: string; link: string };
}

interface Category {
  /** Anchor for the section and the "On this page" list. */
  id: string;
  label: string;
  path: string[];
  faqs: readonly Faq[];
}

/**
 * Questions people ask about CES, answered from what the Society publishes: its history, the
 * institute pages, the Rahatokarsh Fund, Dyuno and the policies on this site. Things that differ
 * by institute (fees, admission dates, documents) point to the institute rather than guess.
 */
@Component({
  selector: 'app-faqs',
  imports: [FormsModule, RouterLink, PageHero],
  templateUrl: './faqs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faqs.scss',
})
export class Faqs {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  readonly categories: readonly Category[] = [
    {
      id: 'general',
      label: 'General Information',
      path: ['M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z', 'M9 22V12h6v10'],
      faqs: [
        {
          q: 'What is Charotar Education Society (CES)?',
          a: 'A registered educational society in Anand, Gujarat, founded in 1916. It runs 31+ institutes, from pre-primary schools to postgraduate colleges and doctoral research, on three campuses, and has more than 5 lakh alumni around the world.',
          link: { label: 'CES at a Glance', link: '/about/profile' },
        },
        {
          q: 'When was CES established?',
          a: 'On 16 April 1916, in Anand. Shri Motibhai Narsinhbhai Amin led the effort, and Shri Vithalbhai Zaverbhai Patel, elder brother of Sardar Vallabhbhai Patel, drew up its constitution. It began with a single school of 27 pupils, today\'s D.N. High School.',
          link: { label: 'Read our history', link: '/about/history' },
        },
        {
          q: 'What is the mission of Charotar Education Society?',
          a: 'To make good education affordable and within reach, while supporting innovation, research and the all-round growth of every student.',
        },
        {
          q: 'Where is CES located?',
          a: 'Our office is on the D.N. High School Campus, Station Road, Anand 388001, Gujarat. We have three campuses: Anand (21 acres), Khetiwadi (7.5 acres) and Mogri (12 acres).',
          link: { label: 'Our campuses', link: '/more/campus' },
        },
        {
          q: 'What types of institutions are managed by CES?',
          a: '17 schools, 13 colleges, 4 hostels and 7 other departments, covering everything from pre-primary to Ph.D., including teacher training, physical education, performing arts and vocational courses.',
        },
        {
          q: 'How can I contact CES?',
          a: 'Call (02692) 243083, email cesociety@cesociety.in, or send us a message from the Contact Us page.',
          link: { label: 'Contact Us', link: '/contact' },
        },
        {
          q: 'How do I reach a particular school or college?',
          a: 'Each institute has its own phone number and website. You will find them for every school and college on our Schools and Colleges pages.',
          link: { label: 'Our schools', link: '/academic/school' },
        },
      ],
    },
    {
      id: 'admissions',
      label: 'Admissions',
      path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
      faqs: [
        {
          q: 'When do admissions open?',
          a: 'Each institute announces its own admission dates. Schools admit for the academic year that begins in June, and college admissions follow the schedule set by the university and the Government of Gujarat.',
        },
        {
          q: 'How do I apply?',
          a: 'Contact the institute you want to join, or visit its website. It will tell you the form, documents and fees for your class or course. Every institute\'s phone number and website is listed on the Schools and Colleges pages.',
          link: { label: 'Our colleges', link: '/academic/colleges' },
        },
        {
          q: 'Which documents are required for admission?',
          a: 'The exact list depends on the class or course, and the institute will give it to you. Keep your latest mark sheet, school leaving certificate and passport-size photographs ready.',
        },
        {
          q: 'Is there an entrance test?',
          a: 'It depends on the course. For university courses the university\'s admission rules apply. The institute will tell you if a test or interview is part of its process.',
        },
        {
          q: 'Can I apply to more than one institute?',
          a: 'Yes. Each CES institute admits students separately, so apply to each one you are interested in.',
        },
        {
          q: 'Are scholarships available?',
          a: 'Yes. The Rahatokarsh Fund pays the fees of bright students who are short of money and get no other scholarship, at any CES institution from KG to PG. Ask your institute about government scholarships too.',
          link: { label: 'The Rahatokarsh Fund', link: '/fund' },
        },
      ],
    },
    {
      id: 'academics',
      label: 'Courses & Academics',
      path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
      faqs: [
        {
          q: 'What courses are offered at CES institutes?',
          a: 'Our schools take children from pre-primary to class 12. Our colleges teach science, applied science, computer applications, commerce, business administration, arts and humanities, law, teacher education (D.El.Ed., B.Ed. and M.Ed.) and physical education, at undergraduate and postgraduate level, with research towards a Ph.D.',
          link: { label: 'See all colleges', link: '/academic/colleges' },
        },
        {
          q: 'What is the medium of instruction?',
          a: 'Charotar English Medium School teaches in English; our other schools teach in Gujarati. For a college course, please check with the college.',
        },
        {
          q: 'Are the colleges affiliated to a university?',
          a: 'Our degree colleges are affiliated to Sardar Patel University, Vallabh Vidyanagar. Each college can tell you the affiliation and approvals for its courses.',
        },
        {
          q: 'Do you offer postgraduate programmes?',
          a: 'Yes: M.Sc., M.Com., M.A., M.Ed. and MSW, and a research centre for doctoral (Ph.D.) study.',
        },
        {
          q: 'What is the academic calendar?',
          a: 'Each institute follows the calendar of its board or university, and shares term dates, holidays and examination schedules with its students.',
        },
        {
          q: 'Is there learning beyond the syllabus?',
          a: 'Yes. Udaan strengthens science and maths, the Sports Academy and the Performing Arts and Fine Arts Academy train students in sport and the arts, and the Vocational Training Centre teaches job skills.',
          link: { label: 'Our projects', link: '/project' },
        },
        {
          q: 'Are there industry collaborations?',
          a: 'Our Swami Dayanand Saraswati Vocational Training Centre runs its courses with professional organisations under MoUs, and their experts do the teaching.',
        },
      ],
    },
    {
      id: 'exams',
      label: 'Examinations & Results',
      path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'],
      faqs: [
        {
          q: 'When are examinations held, and where is the timetable?',
          a: 'Your institute announces the timetable for its own examinations. Board and university examinations follow the schedule of the board or university, which your institute will share with you.',
        },
        {
          q: 'How do I download the answer key?',
          a: 'Answer keys are published under Student Corner > Answer Key.',
          link: { label: 'Answer keys', link: '/student-corner/answer-key' },
        },
        {
          q: 'Where are results published?',
          a: 'Board and university results are published by the board or university. Results of examinations held by the institute are given by the institute.',
        },
        {
          q: 'How do I apply for re-checking or a duplicate mark sheet?',
          a: 'Apply through your institute. It will tell you the process and fees set by the board or university concerned.',
        },
      ],
    },
    {
      id: 'fees',
      label: 'Fees & Payments',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9 8h6M9 12h6M11 8v8'],
      faqs: [
        {
          q: 'What are the fees?',
          a: 'Fees depend on the institute, the class or course and, for some courses, the rules of the university or government. Please ask the institute you are joining.',
        },
        {
          q: 'How do I pay fees?',
          a: 'Fees are paid to the institute, which will tell you the payment methods it accepts. The only payment taken on this website is a donation to the Rahatokarsh Fund.',
        },
        {
          q: 'Can I get help paying my fees?',
          a: 'Yes. The Rahatokarsh Fund pays the fees of bright students who are short of money. Ask the Head of your institute how to apply.',
          link: { label: 'The Rahatokarsh Fund', link: '/fund' },
        },
        {
          q: 'What is the refund policy?',
          a: 'Fees can be refunded if you withdraw before the academic session begins, if the institute cancels your course, or if you paid too much. Registration, examination and event fees are not refundable. Approved refunds are paid within 15–30 working days, the same way you paid.',
          link: { label: 'Refund & Cancellation Policy', link: '/support/refund-cancellation-policy' },
        },
      ],
    },
    {
      id: 'campus',
      label: 'Campus & Hostels',
      path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'],
      faqs: [
        {
          q: 'What facilities are available on campus?',
          a: 'Gyansthali Library and two e-libraries, a gym with free coaching, an amphitheatre, an auditorium, a Saraswati temple, a stationery store and four hostels. CES also runs the first and largest solar power plant in the Charotar region.',
        },
        {
          q: 'Is hostel accommodation provided?',
          a: 'Yes, in four hostels with meals: Vidhyarthi Ashram for boys from class 5 to college, Kasturba Kanya Chhatralay for girls from class 5 to 12, the Ladies Hostel for women in undergraduate and postgraduate courses, and Adhyapan Mandir Chhatralay for boys on the Mogri campus.',
          link: { label: 'Our hostels', link: '/academic/hostels' },
        },
        {
          q: 'Are there sports facilities?',
          a: 'Yes. The Sports Academy coaches students for state, national and international events, Project Arjun trains students in shooting, and the gym offers free coaching.',
        },
        {
          q: 'Is there a library?',
          a: 'Yes. Gyansthali Library has books, periodicals, journals and online material on every subject. There are also two e-libraries and a library club that runs book-review contests.',
        },
        {
          q: 'How can I visit a campus?',
          a: 'Request an e-Gate Pass before your visit, as a visitor or a staff member, and the institute will confirm it.',
          link: { label: 'Request an e-Gate Pass', link: '/more/gate-pass' },
        },
      ],
    },
    {
      id: 'support',
      label: 'Student Support',
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
      faqs: [
        {
          q: 'Is counselling available for students?',
          a: 'Yes, free for students of every CES institute. Dr. Jigar (Jignesh) Jani and his team of counselling psychologists offer one-to-one sessions, on campus or online, about exam stress, career confusion, relationships or anything else on your mind.',
          link: { label: 'Request counselling', link: '/counselling' },
        },
        {
          q: 'Will my counselling session be confidential?',
          a: 'Yes. What you share stays between you and the counsellor. No one else is told unless you ask, or unless there is a serious risk to your safety, which the counsellor will discuss with you first.',
        },
        {
          q: 'Is there help with careers and jobs?',
          a: 'The counselling team helps with career confusion, the Vocational Training Centre teaches job skills with industry partners, and your college can tell you about its placement activities.',
        },
        {
          q: 'Who do I contact with a complaint?',
          a: 'Start with the Head of your institute. If it is not resolved, contact the CES office on (02692) 243083 or cesociety@cesociety.in.',
          link: { label: 'Contact Us', link: '/contact' },
        },
      ],
    },
    {
      id: 'dyuno',
      label: 'Dyuno AI Assistant',
      path: ['M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5h.5a8.5 8.5 0 0 1 8 8z'],
      faqs: [
        {
          q: 'What is Dyuno?',
          a: 'Dyuno is the CES AI assistant. Ask it anything about CES, from institutes and admissions to events, or get help with your studies, at any time. It is free and open to everyone: use the chat button on any page or open the full Dyuno page.',
          link: { label: 'Ask Dyuno', link: '/dyuno' },
        },
        {
          q: 'Can I rely on Dyuno\'s answers?',
          a: 'Dyuno\'s answers are written by AI and can be wrong or out of date. Check anything important, such as admission dates, fees, results or exam rules, with the institute or the official source.',
        },
        {
          q: 'Are my Dyuno chats private?',
          a: 'Your conversations are saved in your own browser and deleted after 30 days without use. Your questions are sent to OpenAI to write the answers. If you share a chat, anyone with the link can read it, so do not share personal details.',
          link: { label: 'Privacy Policy', link: '/support/privacy-policy' },
        },
      ],
    },
    {
      id: 'fund',
      label: 'Rahatokarsh Fund',
      path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
      faqs: [
        {
          q: 'What is the Rahatokarsh Fund?',
          a: 'A fund CES started in its 99th year to pay the fees of bright students who are short of money and get no other scholarship, at any CES institution from KG to PG.',
          link: { label: 'About the fund', link: '/fund' },
        },
        {
          q: 'How can I donate?',
          a: 'Donate online from the Donation page, or transfer to the "Rahatokarsh Fee Fund" account at State Bank of India, Sardar Gunj Branch, Anand.',
          link: { label: 'Donate now', link: '/donation' },
        },
        {
          q: 'Is my donation tax-exempt?',
          a: 'Yes, donations qualify under Section 80G(5) of the Income Tax Act. To receive the 80G certificate, tick the 80G option and upload your PAN card when you donate online.',
        },
        {
          q: 'Can I see how the fund is used?',
          a: 'Yes. We publish the list of donors and the list of students the fund has supported.',
          link: { label: 'Beneficiary students', link: '/beneficiary-students' },
        },
      ],
    },
    {
      id: 'alumni-events',
      label: 'Alumni & Events',
      path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'],
      faqs: [
        {
          q: 'How do I register as an alumnus?',
          a: 'Fill in the registration form on the Alumni page with your institute, course and year.',
          link: { label: 'Register as alumni', link: '/alumni' },
        },
        {
          q: 'When is the Alumni Meet?',
          a: 'Every 13 January in Anand, the birthday of Shri Vitthalbhai J. Patel, when former students from India and abroad come home.',
        },
        {
          q: 'What is Chatkaro?',
          a: 'Our yearly food festival and skill fair, held on 11, 12 and 13 January from 10:30 AM to 10:30 PM. Entry is free for everyone.',
          link: { label: 'Chatkaro', link: '/chatkaro' },
        },
        {
          q: 'Does CES celebrate Navratri?',
          a: 'Yes. Every year the campus celebrates nine nights of devotion, garba and culture, each year with a new theme.',
          link: { label: 'Navratri at CES', link: '/navratri' },
        },
        {
          q: 'Where can I find news, tenders and job openings?',
          a: 'Under More in the main menu: News for announcements, Tenders for current tenders, and Careers for vacancies and recruitment notices.',
          link: { label: 'Careers', link: '/more/career' },
        },
      ],
    },
    {
      id: 'policies',
      label: 'Policies',
      path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
      faqs: [
        {
          q: 'Is ragging allowed?',
          a: 'No. Ragging is a criminal offence and is not tolerated at any CES institute. Report it at once to the Head of your institute.',
        },
        {
          q: 'What attendance is required?',
          a: 'Each institute follows the attendance rules of its board or university, and tells students the minimum at the start of the year.',
        },
        {
          q: 'How does CES handle my personal information?',
          a: 'We collect only what we need for your request, never sell it, and explain what we collect, who sees it and your rights in our Privacy Policy.',
          link: { label: 'Privacy Policy', link: '/support/privacy-policy' },
        },
        {
          q: 'What are the rules for using this website?',
          a: 'Our Website Terms cover the information and content on the site, and our Terms & Conditions cover its services, such as forms, donations and Dyuno.',
          link: { label: 'Website Terms', link: '/support/website-terms' },
        },
        {
          q: 'How do I ask for information (RTI)?',
          a: 'Write to the Secretary, Charotar Education Society. Our Disclosure Policy explains what we publish, how to ask for more and what we keep confidential.',
          link: { label: 'Disclosure Policy', link: '/support/disclosure-policy' },
        },
      ],
    },
  ];

  /** The category in view, for the "On this page" list. */
  readonly current = signal(this.categories[0].id);
  /** The open questions (by text): the first one to begin with, every match while searching. */
  readonly open = signal<ReadonlySet<string>>(new Set([this.categories[0].faqs[0].q]));

  search = '';
  /** The active filter, lower-cased; empty when every question is shown. */
  readonly query = signal('');

  constructor() {
    afterNextRender(() => this.observe());
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  toggle(q: string): void {
    this.open.update((open) => {
      const next = new Set(open);
      if (!next.delete(q)) next.add(q);
      return next;
    });
  }

  /** Filters as you type. */
  onSearch(value: string): void {
    this.search = value;
    this.applySearch();
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
    const visible = this.visible();
    // While filtering, every match is opened so the answers can be read straight away.
    this.open.set(
      new Set(this.query() ? visible.flatMap((c) => c.faqs.map((f) => f.q)) : visible.slice(0, 1).map((c) => c.faqs[0].q)),
    );
    if (visible.length) this.current.set(visible[0].id);
    // The filtered sections are new elements: watch them once they are on the page.
    afterNextRender(() => this.observe(), { injector: this.injector });
  }

  clearSearch(): void {
    this.search = '';
    this.applySearch();
  }

  /** Categories with the questions that match the search (question or answer text). */
  readonly visible = computed(() => {
    const q = this.query();
    if (!q) return this.categories;
    return this.categories
      .map((c) => ({ ...c, faqs: c.faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) }))
      .filter((c) => c.faqs.length);
  });

  /** How many questions match the active filter. */
  readonly matches = computed(() => this.visible().reduce((n, c) => n + c.faqs.length, 0));

  /** Splits text around the filter so matches can be highlighted. */
  parts(text: string): ReadonlyArray<{ t: string; hit: boolean }> {
    const q = this.query();
    if (!q) return [{ t: text, hit: false }];
    const lower = text.toLowerCase();
    const out: { t: string; hit: boolean }[] = [];
    let i = 0;
    for (let j = lower.indexOf(q); j !== -1; j = lower.indexOf(q, i)) {
      if (j > i) out.push({ t: text.slice(i, j), hit: false });
      out.push({ t: text.slice(j, j + q.length), hit: true });
      i = j + q.length;
    }
    if (i < text.length) out.push({ t: text.slice(i), hit: false });
    return out;
  }

  /** Smooth-scrolls to a category (the sections' scroll margin keeps it clear of the sticky header). */
  jump(event: Event, id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.current.set(id);
  }

  /** Track the category in view (the one crossing the upper third of the screen). */
  private observe(): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) this.current.set(entry.target.id);
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );
    for (const c of this.visible()) {
      const el = this.document.getElementById(c.id);
      if (el) this.observer.observe(el);
    }
  }
}
