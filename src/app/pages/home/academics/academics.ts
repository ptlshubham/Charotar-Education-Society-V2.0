import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface Course {
  id: string;
  name: string;
  level: string;
  icon: string;
  link: string;
  image?: string;
  rating?: number;
  reviews?: number;
  duration?: string;
}

// Simple hash function for deterministic pseudo-random values
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}

function withPlaceholderData(course: Course): Course {
  // TODO: PLACEHOLDER DATA. Replace image, rating, reviews and duration with real values before launch.
  const slug = course.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const hash = hashString(course.id);
  
  // Rating between 4.2 and 4.9
  const ratingVal = 4.2 + (hash % 8) / 10;
  
  // Reviews between 120 and 2500
  const reviewsVal = 120 + (hash % 2380);
  
  let duration = "1 Year";
  if (course.level === 'DOCTORATE') duration = "3 Years";
  else if (course.level === "MASTER'S") duration = "2 Years";
  else if (course.level === "BACHELOR'S") duration = "3 Years";
  else if (course.level === 'SCHOOL') {
    if (course.name === 'Pre School') duration = "3 Years";
    else if (course.name === 'Standard 1 to 5') duration = "5 Years";
    else if (course.name === 'Standard 6 to 8') duration = "3 Years";
    else if (course.name === 'Standard 9 to 10') duration = "2 Years";
    else if (course.name === 'Standard 11 to 12') duration = "2 Years";
  }

  return {
    ...course,
    image: course.image || `https://picsum.photos/seed/${slug}/640/400`,
    rating: course.rating || parseFloat(ratingVal.toFixed(1)),
    reviews: course.reviews || reviewsVal,
    duration: course.duration || duration
  };
}

@Component({
  selector: 'app-academics',
  imports: [RouterLink, NgClass],
  templateUrl: './academics.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './academics.scss',
})
export class Academics {
  tabs = [
    { label: 'School', icon: 'backpack' },
    { label: "Bachelor's", icon: 'menu_book' },
    { label: "Master's", icon: 'school' },
    { label: 'Diploma & Certificate', icon: 'description' },
    { label: 'Doctorate', icon: 'workspace_premium' }
  ];
  
  activeTab = "School";

  readonly courses: readonly Course[] = [
    { id: '1', name: 'Doctor of Philosophy', level: 'DOCTORATE', icon: 'school', link: '#', image: '/assets/images/institutes/alpesh-science.jpg' },
    { id: '2', name: 'Master of Science', level: "MASTER'S", icon: 'science', link: '#', image: '/assets/images/institutes/mb-patel-science.jpg' },
    { id: '3', name: 'Master of Commerce', level: "MASTER'S", icon: 'business_center', link: '#', image: '/assets/images/institutes/dn-pg-commerce.jpg' },
    { id: '4', name: 'Master of Arts', level: "MASTER'S", icon: 'palette', link: '#', image: '/assets/images/institutes/bhikhabhai-pg-studies.jpg' },
    { id: '5', name: 'Master of Education', level: "MASTER'S", icon: 'history_edu', link: '#', image: '/assets/images/institutes/ij-patel-med.jpg' },
    { id: '6', name: 'Master of Social Work', level: "MASTER'S", icon: 'group', link: '#', image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '7', name: 'Bachelor of Science', level: "BACHELOR'S", icon: 'science', link: '#', image: '/assets/images/institutes/mb-patel-science.jpg' },
    { id: '8', name: 'Bachelor of Commerce', level: "BACHELOR'S", icon: 'business_center', link: '#', image: '/assets/images/institutes/vz-patel-commerce.jpg' },
    { id: '9', name: 'Bachelor of Arts', level: "BACHELOR'S", icon: 'menu_book', link: '#', image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '10', name: 'Bachelor of Computer Application', level: "BACHELOR'S", icon: 'laptop_mac', link: '#', image: '/assets/images/institutes/dn-computer.jpg' },
    { id: '11', name: 'Bachelor of Science in IT', level: "BACHELOR'S", icon: 'laptop_mac', link: '#', image: '/assets/images/institutes/dn-computer.jpg' },
    { id: '12', name: 'Bachelor of Business Administration General', level: "BACHELOR'S", icon: 'domain', link: '#', image: '/assets/images/institutes/dn-business.jpg' },
    { id: '13', name: 'Bachelor of Business Administration ITM', level: "BACHELOR'S", icon: 'domain', link: '#', image: '/assets/images/institutes/dn-business.jpg' },
    { id: '14', name: 'Bachelor of Education', level: "BACHELOR'S", icon: 'history_edu', link: '#', image: '/assets/images/institutes/ij-patel-bed.jpg' },
    { id: '15', name: 'Bachelor of Physical Education', level: "BACHELOR'S", icon: 'fitness_center', link: '#', image: '/assets/images/institutes/vj-patel-physical.jpg' },
    { id: '16', name: 'Bachelor of Physical Education and Sports', level: "BACHELOR'S", icon: 'emoji_events', link: '#', image: '/assets/images/institutes/vj-patel-physical.jpg' },
    { id: '17', name: 'Bachelor of Social Work', level: "BACHELOR'S", icon: 'group', link: '#', image: '/assets/images/institutes/bhikhabhai-arts.jpg' },
    { id: '18', name: 'Medical Laboratory Technology', level: 'DIPLOMA / CERTIFICATE', icon: 'biotech', link: '#', image: '/assets/images/institutes/alpesh-science.jpg' },
    { id: '19', name: 'Primary Teachers Certificate', level: 'DIPLOMA / CERTIFICATE', icon: 'history_edu', link: '#', image: '/assets/images/institutes/motibhai-amin.jpg' },
    { id: '20', name: 'Pre School', level: 'SCHOOL', icon: 'child_care', link: '#', image: '/assets/images/institutes/shishuvihar.jpg' },
    { id: '21', name: 'Standard 1 to 5', level: 'SCHOOL', icon: 'backpack', link: '#', image: '/assets/images/institutes/ambalal-balshala.jpg' },
    { id: '22', name: 'Standard 6 to 8', level: 'SCHOOL', icon: 'backpack', link: '#', image: '/assets/images/institutes/dn-high-6-8.jpg' },
    { id: '23', name: 'Standard 9 to 10', level: 'SCHOOL', icon: 'backpack', link: '#', image: '/assets/images/institutes/dn-high-9-12.jpg' },
    { id: '24', name: 'Standard 11 to 12', level: 'SCHOOL', icon: 'backpack', link: '#', image: '/assets/images/institutes/kkv-9-12.jpg' }
  ].map(withPlaceholderData);

  get filteredCourses() {
    const levelMap: Record<string, string> = {
      'Doctorate': 'DOCTORATE',
      "Master's": "MASTER'S",
      "Bachelor's": "BACHELOR'S",
      'Diploma & Certificate': 'DIPLOMA / CERTIFICATE',
      'School': 'SCHOOL'
    };
    return this.courses.filter(c => c.level === levelMap[this.activeTab]).slice(0, 4);
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
