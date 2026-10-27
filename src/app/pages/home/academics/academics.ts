import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TabBar, TabItem } from '../../../shared/tab-bar/tab-bar';

type Level = 'SCHOOL' | "BACHELOR'S" | "MASTER'S" | 'DIPLOMA / CERTIFICATE' | 'DOCTORATE';

interface Course {
  id: string;
  name: string;
  /** Short name on the card's pill - B.Sc., BCA, Primary… */
  short: string;
  level: Level;
  image: string;
}

interface Tab {
  label: string;
  level: Level;
  /** Material Symbols name. */
  icon: string;
  /** Where "Explore programme" and "View All Programmes" go for this level. */
  link: string;
}

/** Cards per tab - the most-asked programmes of each level, in this order. */
const PER_TAB = 4;

/**
 * "Our Programmes" - a tab per level (School … Doctorate) and four programme cards for
 * it, each a photo with the programme's short name, its full name and a link to the
 * School or Colleges page (there are no per-programme pages yet).
 */
@Component({
  selector: 'app-academics',
  imports: [RouterLink, TabBar],
  templateUrl: './academics.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './academics.scss',
})
export class Academics {
  readonly tabs: readonly Tab[] = [
    { label: 'School', level: 'SCHOOL', icon: 'backpack', link: '/academic/school' },
    { label: "Bachelor's", level: "BACHELOR'S", icon: 'school', link: '/academic/colleges' },
    { label: "Master's", level: "MASTER'S", icon: 'history_edu', link: '/academic/colleges' },
    { label: 'Diploma & Certificate', level: 'DIPLOMA / CERTIFICATE', icon: 'description', link: '/academic/colleges' },
    { label: 'Doctorate', level: 'DOCTORATE', icon: 'workspace_premium', link: '/academic/colleges' },
  ];

  readonly courses: readonly Course[] = [
    { id: '1', name: 'Doctor of Philosophy', short: 'Ph.D.', level: 'DOCTORATE', image: '/assets/images/institutes/alpesh-science.jpg' },
    { id: '2', name: 'Master of Science', short: 'M.Sc.', level: "MASTER'S", image: '/assets/images/institutes/mb-patel-science.jpg' },
    { id: '3', name: 'Master of Commerce', short: 'M.Com.', level: "MASTER'S", image: '/assets/images/institutes/dn-pg-commerce.jpg' },
    { id: '4', name: 'Master of Arts', short: 'M.A.', level: "MASTER'S", image: '/assets/images/institutes/bhikhabhai-pg-studies.jpg' },
    { id: '5', name: 'Master of Education', short: 'M.Ed.', level: "MASTER'S", image: '/assets/images/institutes/ij-patel-med.jpg' },
    { id: '6', name: 'Master of Social Work', short: 'MSW', level: "MASTER'S", image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '7', name: 'Bachelor of Science', short: 'B.Sc.', level: "BACHELOR'S", image: '/assets/images/institutes/mb-patel-science.jpg' },
    { id: '8', name: 'Bachelor of Commerce', short: 'B.Com.', level: "BACHELOR'S", image: '/assets/images/institutes/vz-patel-commerce.jpg' },
    { id: '9', name: 'Bachelor of Arts', short: 'B.A.', level: "BACHELOR'S", image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '10', name: 'Bachelor of Computer Application', short: 'BCA', level: "BACHELOR'S", image: '/assets/images/institutes/dn-computer.jpg' },
    { id: '11', name: 'Bachelor of Science in IT', short: 'B.Sc. IT', level: "BACHELOR'S", image: '/assets/images/institutes/dn-computer.jpg' },
    { id: '12', name: 'Bachelor of Business Administration General', short: 'BBA', level: "BACHELOR'S", image: '/assets/images/institutes/dn-business.jpg' },
    { id: '13', name: 'Bachelor of Business Administration ITM', short: 'BBA (ITM)', level: "BACHELOR'S", image: '/assets/images/institutes/dn-business.jpg' },
    { id: '14', name: 'Bachelor of Education', short: 'B.Ed.', level: "BACHELOR'S", image: '/assets/images/institutes/ij-patel-bed.jpg' },
    { id: '15', name: 'Bachelor of Physical Education', short: 'B.P.Ed.', level: "BACHELOR'S", image: '/assets/images/institutes/vj-patel-physical.jpg' },
    { id: '16', name: 'Bachelor of Physical Education and Sports', short: 'B.P.E.S.', level: "BACHELOR'S", image: '/assets/images/institutes/vj-patel-physical.jpg' },
    { id: '17', name: 'Bachelor of Social Work', short: 'BSW', level: "BACHELOR'S", image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '18', name: 'Medical Laboratory Technology', short: 'MLT', level: 'DIPLOMA / CERTIFICATE', image: '/assets/images/institutes/alpesh-science.jpg' },
    { id: '19', name: 'Primary Teachers Certificate', short: 'PTC', level: 'DIPLOMA / CERTIFICATE', image: '/assets/images/institutes/motibhai-amin.jpg' },
    { id: '20', name: 'Pre School', short: 'Pre-Primary', level: 'SCHOOL', image: '/assets/images/institutes/shishuvihar.jpg' },
    { id: '21', name: 'Standard 1 to 5', short: 'Primary', level: 'SCHOOL', image: '/assets/images/institutes/ambalal-balshala.jpg' },
    { id: '22', name: 'Standard 6 to 8', short: 'Upper Primary', level: 'SCHOOL', image: '/assets/images/institutes/dn-high-6-8.jpg' },
    { id: '23', name: 'Standard 9 to 10', short: 'Secondary', level: 'SCHOOL', image: '/assets/images/institutes/dn-high-9-12.jpg' },
    { id: '24', name: 'Standard 11 to 12', short: 'Higher Secondary', level: 'SCHOOL', image: '/assets/images/institutes/kkv-9-12.jpg' },
  ];

  readonly active = signal<Tab>(this.tabs[0]); // School - the first tab

  readonly visible = computed(() => this.courses.filter((c) => c.level === this.active().level).slice(0, PER_TAB));

  readonly tabItems: readonly TabItem[] = this.tabs.map((t) => ({ id: t.level, label: t.label, icon: t.icon }));

  select(level: string): void {
    this.active.set(this.tabs.find((t) => t.level === level) ?? this.tabs[0]);
  }
}
