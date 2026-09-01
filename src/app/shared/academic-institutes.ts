import { SearchItem } from './models/models';

/**
 * Flat, searchable list of every CES institute shown on the Academic pages, so the
 * universal search finds an institute by name and links to its page. Mirrors the
 * arrays in pages/academic/{school,colleges,hostels,others} — keep this in sync
 * when institutes are added or renamed. (That content is static, not backend.)
 */
function inst(name: string, category: string, link: string, icon: string): SearchItem {
  return { title: name, category, link, icon, keywords: `${name} ${category} institute ces`.toLowerCase() };
}

const SCHOOLS = [
  'Charotar English Medium School, Anand',
  'CEMS',
  'Shishuvihar, Nutan Shishuvihar And Nursary, Anand',
  'Ambalal Balshala, Anand',
  'D. N. High School (Std 6 to 8), Anand',
  'DNHS',
  'KKV',
  'Kasturba Kanya Vidyalaya (Std 6 to 8), Anand',
  'D. N. High School (Std 9 to 12), Anand',
  'Kasturba Kanya Vidhyalaya (Std 9 to 12), Anand',
  'V. J. Patel Higher Secondary School, Anand',
  'VJ Patel',
  'Sardar Vallabhbhai Patel Shishuvihar and Balshala, Khetiwadi',
  'SVP',
  'Sardar Vallabhbhai Patel High School (Std 6 to 8), Khetiwadi',
  'Sardar Vallabhbhai Patel High School (Std 9 to 12), Khetiwadi',
  'K. M. Patel Balshala and Shishuvihar, Mogri',
  'KM Patel',
  'Mahatma Gandhi Vidyalaya (Std 6 to 8), Mogri',
  'MGV',
  'Mahatma Gandhi Vidyalaya (Std 9 to 12), Mogri',
];

const COLLEGES = [
  'Shri Alpesh N. Patel Post Graduate Institute of Science and Research',
  'AN Patel',
  'PG Studies in Science and Research',
  'M. B. Patel Science College',
  'MB Patel',
  'Shri D. N. Institute of Computer Applications',
  'DNICA',
  'M. B. Patel Applied Science College',
  'MB Patel',
  'Shri D. N. Institute of Business Administration',
  'DNIBA',
  'Shri D. N. Institute of P. G. Studies in Commerce',
  'Shri V. Z. Patel Commerce College',
  'VZ Patel',
  'Shri Bhikhabhai Patel Institute of P. G. Studies & Research in Humanities',
  'Shri Bhikhabhai Patel Arts College',
  'Shri D. N. Institute of Law',
  'Motibhai Amin P. S. Adhyapan Mandir (D.El.Ed.)',
  'Shri I. J. Patel B.Ed. College',
  'Shri I. J. Patel M.Ed. College',
  'Shri V. J. Patel College of Physical Education',
];

const HOSTELS = ['Vidhyarthi Ashram', 'Kasturba Kanya Chhatalay', 'Ladies Hostel', 'Adhyapan Mandir Chhatalay'];

const OTHERS = [
  'CES Performing Arts And Fine Arts Academy',
  'CES Library & Resource Center',
  'CES Community & Social Welfare',
  'CES Alumni Association',
  'CES Cultural & Events Committee',
];

export const ACADEMIC_INSTITUTES: readonly SearchItem[] = [
  ...SCHOOLS.map((n) => inst(n, 'Schools', '/academic/school', 'building')),
  ...COLLEGES.map((n) => inst(n, 'Colleges', '/academic/colleges', 'building')),
  ...HOSTELS.map((n) => inst(n, 'Hostels', '/academic/hostels', 'bed')),
  ...OTHERS.map((n) => inst(n, 'Others', '/academic/others', 'grid')),
];

/** The three CES campuses — each opens /more/campus with its tab pre-selected. */
export const CAMPUSES: readonly SearchItem[] = ['anand', 'khetiwadi', 'mogri'].map((key) => ({
  title: `${key[0].toUpperCase()}${key.slice(1)} Campus`,
  category: 'Campus',
  link: '/more/campus',
  queryParams: { campus: key },
  icon: 'building',
  keywords: `${key} campus location`,
}));
