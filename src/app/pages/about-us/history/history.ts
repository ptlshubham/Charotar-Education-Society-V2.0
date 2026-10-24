import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { PageHero } from '../../../shared/page-hero/page-hero';

interface Chapter {
  id: string;
  years: string;
  title: string;
  paragraphs: readonly string[];
  /** A few figures from the chapter, shown as a row of stats. */
  facts?: ReadonlyArray<{ value: string; label: string }>;
  image?: { src: string; alt: string; caption: string; /** Line drawings sit whole on cream. */ contain?: boolean };
  links?: ReadonlyArray<{ label: string; link: string }>;
}

/**
 * The full history of CES (/about/history), told in chapters from the Petlad Boarding House to
 * today. Sources: the Society's Gujarati history document and the history on cesociety.in. A
 * chapter list sits beside the story on desktop (a scrolling row on phones) and tracks the
 * chapter in view.
 */
@Component({
  selector: 'app-history',
  imports: [RouterLink, PageHero, AdmissionsCta],
  templateUrl: './history.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './history.scss',
})
export class History {
  private readonly document = inject(DOCUMENT);

  readonly hero = '/assets/images/hero/about.png';

  /** The chapter currently in view, for the chapter list. */
  readonly current = signal('beginnings');

  readonly chapters: readonly Chapter[] = [
    {
      id: 'beginnings',
      years: '1906 - 1914',
      title: 'A boarding house in Petlad',
      paragraphs: [
        "The story of CES starts ten years before the Society itself, with one teacher's worry. Shri Motibhai Narsinhbhai Amin of Vaso saw how hard it was for village children in Charotar to keep studying. Getting to school in Petlad meant a long trip, there was nowhere to stay, and college in Vadodara, Pune or Mumbai was out of reach for most families.",
        'So on 16 January 1906 he and a few colleagues opened the Petlad Boarding House. Its first superintendent was his former pupil Mr. Bhokre, followed by Ambalal Patel of Sojitra. Both of them told Motibhai that Charotar needed an education society of its own. Each time the answer was the same: there was no money for it.',
        'The idea would not go away. Around 1911-12 some fifty boys from the boarding house went to study at Fergusson College in Pune, run by the Deccan Education Society, and came home impressed by its teaching and the character it built. Graduates of the boarding house formed the Old Boarding Association and asked for a society like the Deccan in Charotar.',
      ],
    },
    {
      id: 'plan',
      years: '1914 - 1915',
      title: 'From an idea to a plan',
      paragraphs: [
        'In 1914, at the fourth meeting of the Old Boarding Association at Bandhani in Petlad taluka, the proposal was put to the members: Charotar would have an institution like the Deccan Education Society.',
        'Three volunteers took on the groundwork: Ambalal Motibhai Patel of Sojitra; Bhikhabhai Kuberbhai Patel of Karamsad, who started at Borsad on 3 January 1915; and Govardhan Kalidas Patel at Vaso. Motibhai himself went to Pune, sat with the Deccan Society\'s volunteers and studied its constitution and the way it was run.',
        "By October 1915 he had a draft plan, which went out to friends of education for their comments. The Society's founding was announced at the 10th Annual Conference at the Petlad Boarding House, and the next day a meeting chaired by Principal R.P. Paranjpye of Fergusson College worked through the details.",
      ],
    },
    {
      id: 'founding',
      years: '1916',
      title: 'The Society is founded in Anand',
      paragraphs: [
        "Two towns were in the running, and the Society said it would go wherever it was given land. Anand's leaders offered Rs. 30,000 for a building, ten vighas of land free and Rs. 1,200 a year towards running costs. With its railway junction and its place at the centre of Charotar, Anand was the clear choice.",
        "Charotar Education Society was founded there on 16 April 1916. Anand's New English School, with 27 pupils in three standards, was handed over to it on two conditions from Motibhai: the town would not interfere in how the school was run, and it would pay Rs. 2,000 to cover losses in the first three years. He started with two teachers. That school is today's Dadabhai Naoroji (D.N.) High School.",
        "The Society's constitution, dated 17 April 1916 and registered as F/53/Anand, was drawn up by Shri Vithalbhai Zaverbhai Patel, elder brother of Sardar Vallabhbhai Patel. The Council confirmed it by resolution on 30 September 1917.",
        'When Mahatma Gandhi visited in 1916 he called the school "Charotar Bindu", and he called its founder "the Pearl of Charotar". The writer Ramanlal Desai named Motibhai "the Pearl of Mahisagar", and Thakkar Bapa called him "Divya Dayadharmi".',
        'Among those who stood behind the Society in its early years were Shri Vithalbhai Zaverbhai Patel; Shri Ganesh Vasudev Mavalankar, later the first Speaker of the Lok Sabha; Darbar Gopaldas; Maganbhai Shankarbhai Patel; Bhaikaka; and the social worker Thakkar Bapa.',
      ],
      facts: [
        { value: '16 April 1916', label: 'Founded in Anand' },
        { value: '27', label: 'Pupils on the first day' },
        { value: 'F/53/Anand', label: 'Registration number' },
      ],
      image: {
        src: '/assets/images/header/campus.png',
        alt: 'Line drawing of D.N. High School, Anand',
        caption: 'D.N. High School, Anand, where CES began',
        contain: true,
      },
    },
    {
      id: 'governance',
      years: 'Since 1916',
      title: 'How the Society is run',
      paragraphs: [
        'The constitution shares the work between four bodies that support one another: the Council of the Society, its Governing Body, its Trustees and its Volunteers.',
        'The Council had seven members, elected every three years from among the Society\'s patrons, vice-patrons, donors, fellows and volunteers, and they chose the Chairman from among themselves. The Society has been chaired by figures such as Shri Vithalbhai Z. Patel, Thakkar Bapa and Dadasaheb Mavalankar, and in all it has had 23 chairmen and 21 secretaries.',
      ],
      links: [{ label: "Meet today's management", link: '/management' }],
    },
    {
      id: 'freedom',
      years: '1916 - 1947',
      title: 'In the freedom struggle',
      paragraphs: [
        "At CES, education and the fight for freedom went together. Between 1916 and 1932 the Society's president Shri Vithalbhai Zaverbhai Patel, its chairman Shri Dadubhai Desai and volunteer Shri Umedbhai Naranbhai Patel were all jailed for their part in it. When plague struck nearby and 25 of the shelters villagers had fled to burnt down, students helped them rebuild.",
        'Kheda Satyagraha, 1917-18. The year after the Society began, heavy rain ruined the crops, yet the government refused to waive the land revenue. D.N. High School had 195 students then, taught to be fearless, self-reliant and of service to others, and they were encouraged to stand with the farmers of Kheda.',
        'Non-Cooperation, 1919-20. With 318 students on the rolls, the school answered the call of Sardar Patel and the leaders of Gujarat and linked itself to Gujarat Vidyapith. Though short of money, the management paid back a Rs. 10,000 loan in protest against the Rowlatt Act. Students picketed liquor shops and shops selling foreign goods, sent Rs. 256 to the Tilak Swaraj Fund, fasted to raise money for famine-hit Orissa and took up khadi.',
        'Through the 1920s and 30s the school took part in the Flag Satyagraha (1923), the Borsad Satyagraha (1923-24), relief work after the 1927 floods and the Congress convention exhibition of 1938. When Gandhiji camped at Anand during the Dandi March in 1930, 20,000 people gathered on the CES ground to hear him, and the school closed ten days early because so many students wanted to be part of the movement.',
        'Quit India, 1942. On 9 August police lathi-charged a procession of D.N. High School students. The next day the principal, Shri Ishwarbhai J. Patel, resigned and joined the movement, and the school stayed shut for six months. He helped treat those wounded in the Adas firing and was arrested on 4 May 1943 and sent to Sabarmati Jail. His younger brother Vitthalbhai, who would join the school as a teacher in 1944, was jailed in 1943 for his own part. In Borsad, Shri Shivabhai Gokalbhai Patel, director of Vallabh Vidyalaya, was beaten unconscious leading a procession of former D.N. students.',
        "At midnight on 14 August 1947, the Society's buildings were lit up to welcome India's freedom.",
      ],
      facts: [
        { value: '195', label: 'D.N. students in the Kheda Satyagraha' },
        { value: '20,000', label: 'heard Gandhiji on the CES ground in 1930' },
        { value: '6 months', label: 'the school stayed shut after Quit India' },
      ],
      image: {
        src: '/assets/images/about/freedom-fighter.jpeg',
        alt: 'Archive photographs of CES leaders and students in the freedom movement',
        caption: 'From the CES archives',
      },
    },
    {
      id: 'growth',
      years: '1947 onwards',
      title: 'Growing after independence',
      paragraphs: [
        'After 1947 the Society turned its full attention to building schools and colleges and to the all-round development of its students. Over the decades they spread across three campuses and 40.5 acres: the main D.N. High School campus (21 acres), Khetiwadi (7.5 acres) and Mogri (12 acres).',
        'Today that covers everything from pre-primary to class 12; colleges of science, commerce, arts and business administration; teacher training through PTC, B.Ed., M.Ed. and B.P.Ed.; undergraduate and postgraduate courses; and a research centre for doctoral study.',
        'Much of this growth carries the mark of Shri Vitthalbhai J. Patel, who joined D.N. High School as a teacher in 1944 and over 35 years served it as hostel warden, principal and secretary. Every 13 January, his birthday, former students come home for the Alumni Meet held in his memory.',
      ],
      image: {
        src: '/assets/images/history/freedom.jpg',
        alt: 'Shri Vitthalbhai J. Patel at the spinning wheel',
        caption: 'Shri Vitthalbhai J. Patel',
      },
      links: [{ label: 'Read his story', link: '/glory/history-vj' }],
    },
    {
      id: 'centenary',
      years: '2015 - 2016',
      title: 'A hundred years',
      paragraphs: [
        'CES turned 100 in April 2016 and marked it with Shatakotsav: 100 events between April 2015 and April 2016, held on 338 days of the year, with 41,964 people taking part.',
        'Eight of those events set Guinness World Records, making CES the first educational institution in India to reach that milestone. The records were dedicated to the late Dr. A.P.J. Abdul Kalam, who had agreed to come to Anand for the celebrations. In its 99th year the Society also started the Rahatokarsh Fund, which pays the fees of bright students who are short of money.',
      ],
      facts: [
        { value: '100', label: 'events in one year' },
        { value: '41,964', label: 'participants' },
        { value: '8', label: 'Guinness World Records' },
      ],
      image: {
        src: '/assets/images/celebration/shatakotsav/06.jpg',
        alt: 'Students forming a large pattern on the ground during the centenary',
        caption: 'From Shatakotsav, our centenary year (2015-16)',
      },
      links: [
        { label: 'See the centenary', link: '/celebration' },
        { label: 'The Rahatokarsh Fund', link: '/fund' },
      ],
    },
    {
      id: 'today',
      years: 'Today',
      title: 'CES today',
      paragraphs: [
        'From one school of 27 pupils, CES has grown into 31+ institutes: 17 schools, 13 colleges, 4 hostels and 7 other departments, with more than 5 lakh alumni around the world.',
        'Beyond the classroom it runs Dyuno, an AI assistant open to everyone on its website, the first and largest solar power plant in the Charotar region, counselling under Project Anandam, the Udaan science and maths programme, sports and performing arts academies and a vocational training centre. Each January the Chatkaro fair and the Alumni Meet bring former students home, and each autumn the campus celebrates Navratri, every year with a new theme.',
      ],
      image: {
        src: '/assets/images/about/who-we-are.jpeg',
        alt: 'Students in an auditorium at CES',
        caption: 'Students at CES today',
      },
      links: [
        { label: 'Explore our institutes', link: '/academic/school' },
        { label: 'Our projects', link: '/project' },
        { label: 'CES at a Glance', link: '/about/profile' },
      ],
    },
  ];

  constructor() {
    inject(SeoService).applyCustom(
      {
        title: 'Our History',
        description:
          'The full story of Charotar Education Society, from the Petlad Boarding House in 1906 and its founding in Anand in 1916 to the freedom struggle, the centenary and today.',
        url: '/about/history',
      },
      'about',
    );

    // Track the chapter in view (the one crossing the upper third of the screen).
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) this.current.set(entry.target.id);
        },
        { rootMargin: '-30% 0px -65% 0px' },
      );
      for (const c of this.chapters) {
        const el = this.document.getElementById(c.id);
        if (el) observer.observe(el);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  /** Smooth-scrolls to a chapter (the sections' scroll margin keeps it clear of the sticky header). */
  jump(event: Event, id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.current.set(id);
  }
}
