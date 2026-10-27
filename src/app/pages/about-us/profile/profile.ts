import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdmissionsCta } from '../../../shared/admissions-cta/admissions-cta';
import { LEADERS } from '../../../shared/leaders';
import { PageHero } from '../../../shared/page-hero/page-hero';

/** The Society was founded in 1916 - the years move on by themselves. */
const FOUNDED = 1916;

/**
 * CES at a Glance (/about/profile; formerly "Society Profile"): every key fact about CES on one page, laid out to read
 * on screen and to print cleanly ("Download PDF" opens the browser's print dialog, where it can
 * be saved as a PDF; the site's header, footer and widgets are left out of print).
 *
 * Sources: the Society's history document and records (founding, registration, campus areas),
 * cesociety.in (institutions, courses, counts) and the shared leaders data.
 */
@Component({
  selector: 'app-profile',
  imports: [RouterLink, PageHero, AdmissionsCta],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly document = inject(DOCUMENT);

  readonly hero = '/assets/images/hero/about.webp';
  readonly leaders = LEADERS;

  readonly highlights: ReadonlyArray<{ value: string; label: string }> = [
    { value: `${new Date().getFullYear() - FOUNDED}+`, label: 'Years of service' },
    { value: '31+', label: 'Institutes' },
    { value: '40.5', label: 'Acres on 3 campuses' },
    { value: '5 Lakh+', label: 'Alumni' },
    { value: '8', label: 'Guinness World Records' },
  ];

  readonly facts: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Name', value: 'Charotar Education Society, Anand' },
    { label: 'Founded', value: '16 April 1916, in Anand, Gujarat' },
    { label: 'Founder', value: 'Shri Motibhai Narsinhbhai Amin' },
    { label: 'Constitution', value: '17 April 1916, drawn up by Shri Vithalbhai Zaverbhai Patel' },
    { label: 'Registration No.', value: 'F/53/Anand' },
    { label: 'Type', value: 'Registered charitable education society' },
    { label: 'University', value: 'Colleges affiliated to Sardar Patel University, Vallabh Vidyanagar' },
    { label: 'Levels', value: 'Pre-primary to Ph.D.' },
    { label: 'Institutions', value: '17 schools, 13 colleges, 4 hostels and 7 other departments' },
  ];

  readonly bodies: readonly string[] = [
    'Council of the Society',
    'Governing Body of the Society',
    'Trustees of the Society',
    'Volunteers of the Society',
  ];

  readonly campuses: ReadonlyArray<{
    name: string;
    area: string;
    groups: ReadonlyArray<{ label: string; items: readonly string[] }>;
  }> = [
    {
      name: 'Anand (D.N. High School) Campus',
      area: '21 acres',
      groups: [
        {
          label: 'Schools',
          items: [
            'D.N. High School (Std 6 to 12)',
            'Kasturba Kanya Vidyalaya (Std 6 to 12)',
            'V.J. Patel Higher Secondary School',
            'Charotar English Medium School',
            'Ambalal Balshala',
            'Shishuvihar, Nutan Shishuvihar and Nursery',
          ],
        },
        {
          label: 'Colleges',
          items: [
            'M.B. Patel Science College',
            'Shri Alpesh N. Patel Post Graduate Institute of Science and Research',
            'Shri V.Z. Patel Commerce College',
            'Shri D.N. Institute of P.G. Studies in Commerce',
            'Shri Bhikhabhai Patel Arts College',
            'Shri Bhikhabhai Patel Institute of P.G. Studies & Research in Humanities',
            'Shri D.N. Institute of Business Administration',
            'Shri D.N. Institute of Computer Applications',
            'Shri D.N. Institute of Law',
          ],
        },
        { label: 'Hostels', items: ['Vidhyarthi Ashram', 'Kasturba Kanya Chhatralay', 'Ladies Hostel (M.B. Patel Science College)'] },
      ],
    },
    {
      name: 'Khetiwadi Campus',
      area: '7.5 acres',
      groups: [
        {
          label: 'Schools',
          items: ['Sardar Vallabhbhai Patel High School (Std 6 to 12)', 'Sardar Vallabhbhai Patel Shishuvihar and Balshala'],
        },
      ],
    },
    {
      name: 'Mogri Campus',
      area: '12 acres',
      groups: [
        { label: 'Schools', items: ['Mahatma Gandhi Vidyalaya (Std 6 to 12)', 'K.M. Patel Balshala and Shishuvihar'] },
        {
          label: 'Colleges',
          items: [
            'M.B. Patel Applied Science College',
            'Motibhai Amin P.S. Adhyapan Mandir (D.El.Ed.)',
            'Shri I.J. Patel B.Ed. College',
            'Shri I.J. Patel M.Ed. College',
            'Shri V.J. Patel College of Physical Education',
          ],
        },
        { label: 'Hostel', items: ['Adhyapan Mandir Chhatralay'] },
      ],
    },
  ];

  readonly centres: readonly string[] = [
    'CES Performing Arts and Fine Arts Academy',
    'Udaan Education',
    'Swami Dayanand Saraswati Vocational Training Centre',
    'Gyansthali Library',
    'Senior Citizen Forum',
  ];

  /** As cesociety.in lists them. */
  readonly courses: ReadonlyArray<{ level: string; items: readonly string[] }> = [
    { level: 'School', items: ['Pre-school', 'Std 1 to 5', 'Std 6 to 8', 'Std 9 and 10', 'Std 11 and 12'] },
    {
      level: 'Undergraduate',
      items: [
        'B.Sc.', 'B.Sc. IT', 'B.Com.', 'B.A.', 'BCA', 'BBA (General)', 'BBA (ITM)', 'BSW', 'B.Ed.', 'B.P.Ed.',
        'B.P.E.S.', 'PTC (D.El.Ed.)', 'Medical Laboratory Technology',
      ],
    },
    { level: 'Postgraduate', items: ['M.Sc.', 'M.Com.', 'M.A.', 'M.Ed.', 'MSW'] },
    { level: 'Doctoral', items: ['Ph.D.'] },
  ];

  readonly projects: ReadonlyArray<{ name: string; what: string; link: string }> = [
    { name: 'Dyuno AI', what: 'an AI assistant on this website, open to everyone, for questions about CES or any study topic', link: '/project/dyuno-ai' },
    { name: 'Project ADITYA', what: 'the first and largest solar power plant in the Charotar region', link: '/project/aditya' },
    { name: 'Project EKLAVYA', what: 'life skills, personality development and everyday technology', link: '/project/eklavya' },
    { name: 'Project E-GYAN', what: 'e-learning material in simple language', link: '/project/e-gyan' },
    { name: 'Project ANANDAM', what: 'private counselling for students', link: '/project/anandam' },
    { name: 'Project SETU', what: 'one network joining every campus', link: '/project/setu' },
    { name: 'Project SANGAM', what: 'one website for every institution', link: '/project/sangam' },
    { name: 'Project ARJUN', what: 'shooting sport coaching', link: '/project/arjun' },
    { name: 'Udaan Education', what: 'hands-on science and maths, and JEE, NEET and GUJCET coaching', link: '/project/udaan-education' },
    { name: 'Rahatokarsh Fund', what: 'fees for bright students who are short of money', link: '/fund' },
  ];

  readonly recognition: readonly string[] = [
    '8 Guinness World Records in the centenary year (2015-16), the first educational institution in India to set them',
    'Best Teacher award from the Government of India (1966-67) to Shri Vitthalbhai J. Patel, later Principal of D.N. High School',
    'Udaan students: 6 gold, 5 silver and 6 bronze medals at the Ramanujan Maths Olympiad',
  ];

  /** "Download PDF": the browser's print dialog, where the page can be saved as a PDF. */
  print(): void {
    this.document.defaultView?.print();
  }
}
