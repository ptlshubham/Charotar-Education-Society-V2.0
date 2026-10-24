import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/page-hero/page-hero';

interface Category {
  label: string;
  path: string[];
  questions: string[];
}

@Component({
  selector: 'app-faqs',
  imports: [FormsModule, RouterLink, PageHero],
  templateUrl: './faqs.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faqs.scss',
})
export class Faqs {
  readonly categories: readonly Category[] = [
    {
      label: 'General Information',
      path: ['M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z', 'M9 22V12h6v10'],
      questions: [
        'What is Charotar Education Society (CES)?',
        'When was CES established?',
        'What is the mission of Charotar Education Society?',
        'Where is CES located?',
        'What types of institutions are managed by CES?',
        'How can I contact CES?',
      ],
    },
    {
      label: 'Admissions',
      path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'],
      questions: [
        'When do admissions open for the academic year?',
        'What is the admission process?',
        'Which documents are required for admission?',
        'Is there an entrance test?',
        'Are there any scholarships available?',
        'Can I apply to more than one institute?',
        'How do I check my application status?',
        'Is there a management quota?',
      ],
    },
    {
      label: 'Academics',
      path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
      questions: [
        'What courses are offered at CES institutes?',
        'What is the medium of instruction?',
        'Are the institutes affiliated to a university?',
        'What is the academic calendar?',
        'Do you offer postgraduate programs?',
        'Are there industry collaborations?',
        'How is student performance evaluated?',
      ],
    },
    {
      label: 'Examinations',
      path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'],
      questions: [
        'When are examinations conducted?',
        'Where can I find the exam timetable?',
        'How do I download the answer key?',
        'When are results declared?',
        'What is the re-evaluation process?',
        'How do I apply for a duplicate mark sheet?',
      ],
    },
    {
      label: 'Fees & Payments',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M9 8h6M9 12h6M11 8v8'],
      questions: [
        'What is the fee structure?',
        'What payment methods are accepted?',
        'Can fees be paid in installments?',
        'What is the refund policy?',
        'Are there any additional charges?',
      ],
    },
    {
      label: 'Facilities',
      path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'],
      questions: [
        'What facilities are available on campus?',
        'Is hostel accommodation provided?',
        'Are there sports facilities?',
        'Is there a library?',
        'Do you provide transport?',
        'Are the campuses Wi-Fi enabled?',
      ],
    },
    {
      label: 'Student Support',
      path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'],
      questions: [
        'Is counselling available for students?',
        'Is there a placement cell?',
        'How can I get academic guidance?',
        'What support is available for students with special needs?',
        'Who do I contact for grievances?',
      ],
    },
    {
      label: 'Policies',
      path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
      questions: [
        'What is the anti-ragging policy?',
        'What is the attendance policy?',
        'What is the code of conduct?',
        'What is the privacy policy?',
        'What are the website terms?',
        'What is the disclosure policy?',
        'What is the grievance redressal process?',
      ],
    },
    {
      label: 'Others',
      path: ['M5 12h.01M12 12h.01M19 12h.01'],
      questions: [
        'How can I get an e-Gate Pass?',
        'How do I register as an alumnus?',
        'How can I donate to the Rahatokarsh Fund?',
        'Where can I find current tenders?',
      ],
    },
  ];

  /**
   * Answers CES has published (its history document, cesociety.in and this site), keyed by question.
   * Questions without one show the "being prepared" note until CES supplies the answer.
   */
  readonly answers: Readonly<Record<string, string>> = {
    'What is Charotar Education Society (CES)?':
      'A registered charitable education society in Anand, Gujarat, founded in 1916. It runs 31+ institutes, from pre-primary schools to postgraduate colleges, across three campuses.',
    'When was CES established?':
      'On 16 April 1916, in Anand. Shri Motibhai Amin led the effort, and Shri Vithalbhai Patel, elder brother of Sardar Vallabhbhai Patel, drew up its constitution.',
    'What is the mission of Charotar Education Society?':
      'To make good education affordable and within reach, while supporting innovation, research and the all-round growth of every student.',
    'Where is CES located?':
      'Our office is on the D.N. High School Campus, Station Road, Anand 388001, Gujarat. We have three campuses: Anand (21 acres), Khetiwadi (7.5 acres) and Mogri (12 acres).',
    'What types of institutions are managed by CES?':
      '17 schools, 13 colleges, 4 hostels and 7 other departments, covering everything from pre-primary to Ph.D., as well as teacher training, physical education, performing arts and vocational courses.',
    'How can I contact CES?':
      'Call (02692) 243083, email cesociety@cesociety.in, or send us a message from the Contact Us page.',
    'Are there any scholarships available?':
      'Yes. The Rahatokarsh Fund pays the fees of bright students who are short of money and get no other scholarship, at any CES institution from KG to PG.',
    'What courses are offered at CES institutes?':
      'Pre-school to class 12; B.Sc., B.Sc. IT, B.Com., B.A., BCA, BBA, BSW, B.Ed., B.P.Ed., PTC and medical laboratory technology; and M.Sc., M.Com., M.A., M.Ed., MSW and Ph.D.',
    'Are the institutes affiliated to a university?':
      'Our colleges are affiliated to Sardar Patel University, Vallabh Vidyanagar.',
    'Do you offer postgraduate programs?':
      'Yes: M.Sc., M.Com., M.A., M.Ed. and MSW, and a research centre for doctoral (Ph.D.) study.',
    'Are there industry collaborations?':
      'Our Swami Dayanand Saraswati Vocational Training Centre runs its courses with professional organisations under MoUs, and their experts do the teaching.',
    'How do I download the answer key?':
      'Answer keys are published under Student Corner > Answer Key.',
    'What is the refund policy?':
      'Please read our Refund & Cancellation Policy, linked in the footer of every page.',
    'What facilities are available on campus?':
      'Gyansthali Library and two e-libraries, a gym with free coaching, an amphitheatre, an auditorium, a Saraswati temple, a stationery store and four hostels.',
    'Is hostel accommodation provided?':
      'Yes. We have four hostels for boys and girls, from class 5 to postgraduate, with meals from our own kitchen. See the Hostels page for details.',
    'Are there sports facilities?':
      'Yes. The Sports Academy coaches students for state, national and international events, Project Arjun trains students in shooting, and the gym offers free coaching.',
    'Is there a library?':
      'Yes. Gyansthali Library has books, periodicals, journals and online material on every subject. There are also two e-libraries and a library club that runs book-review contests.',
    'Is counselling available for students?':
      'Yes. Under Project Anandam, students can talk privately with a counsellor about stress, studies, career choices or relationships. Free psychological counselling is also available; see the Counselling page.',
    'What is the privacy policy?': 'You can read it on our Privacy Policy page, linked in the footer.',
    'What are the website terms?': 'You can read them on our Website Terms page, linked in the footer.',
    'What is the disclosure policy?': 'You can read it on our Disclosure Policy page, linked in the footer.',
    'How can I get an e-Gate Pass?': 'Apply on the e-Gate Pass page, under More in the main menu.',
    'How do I register as an alumnus?':
      'Fill in the registration form on the Alumni page. Do come to the Alumni Meet, held every 13 January in Anand.',
    'How can I donate to the Rahatokarsh Fund?':
      'Donate online from the Donation page, or transfer to the "Rahatokarsh Fee Fund" account at State Bank of India, Sardar Gunj Branch, Anand. Donations are tax-exempt under Section 80G(5).',
    'Where can I find current tenders?': 'On the Tenders page, under More in the main menu.',
  };

  /** Which category panel is expanded; the first opens by default. */
  readonly openCategory = signal(0);
  /** Which question inside the open category is expanded. */
  readonly openQuestion = signal(-1);

  search = '';
  private readonly query = signal('');

  toggleCategory(i: number): void {
    this.openCategory.update((c) => (c === i ? -1 : i));
    this.openQuestion.set(-1);
  }

  toggleQuestion(i: number): void {
    this.openQuestion.update((q) => (q === i ? -1 : i));
  }

  applySearch(): void {
    this.query.set(this.search.trim().toLowerCase());
    this.openCategory.set(0);
  }

  readonly visible = computed(() => {
    const q = this.query();
    if (!q) return this.categories;
    return this.categories
      .map((c) => ({ ...c, questions: c.questions.filter((x) => x.toLowerCase().includes(q)) }))
      .filter((c) => c.questions.length);
  });
}
