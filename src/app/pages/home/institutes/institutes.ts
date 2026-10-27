import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { countUp } from '../../../shared/count-up';

interface Institute {
  title: string;
  desc: string;
  link: string;
  /** How many the Society runs - counts up on the card, e.g. "17 Schools". */
  count: number;
  unit: string;
  icon: string;
  colorClass: string;
  underlineClass: string;
}

@Component({
  selector: 'app-institutes',
  imports: [RouterLink],
  templateUrl: './institutes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Institutes {
  /** The cards grid - watched for scrolling into view, to start the count-up. */
  private readonly cards = viewChild.required<ElementRef<HTMLElement>>('cards');

  readonly institutes: readonly Institute[] = [
    { 
      title: 'Schools', 
      desc: 'From pre-primary to class 12, across our three campuses.', 
      link: '/academic/school', 
      count: 17,
      unit: 'Schools',
      icon: '<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/>',
      colorClass: 'bg-teal-100 text-teal-600',
      underlineClass: 'bg-teal-500'
    },
    { 
      title: 'Colleges', 
      desc: 'Science, commerce, arts, computer applications, management and law.', 
      link: '/academic/colleges', 
      count: 13,
      unit: 'Colleges',
      icon: '<path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>',
      colorClass: 'bg-orange-100 text-orange-600',
      underlineClass: 'bg-orange-500'
    },
    { 
      title: 'Professional Institutes', 
      desc: 'Teacher training, physical education, performing arts and skill courses.', 
      link: '/academic/others', 
      count: 7,
      unit: 'Departments',
      icon: '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
      colorClass: 'bg-red-100 text-red-600',
      underlineClass: 'bg-red-500'
    },
    { 
      title: 'Hostels', 
      desc: 'Four hostels for boys and girls, from class 5 to postgraduate.', 
      link: '/academic/hostels', 
      count: 4,
      unit: 'Hostels',
      icon: '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
      colorClass: 'bg-blue-100 text-blue-600',
      underlineClass: 'bg-blue-500'
    }
  ];

  /** What each card's figure shows right now - the final counts until the count-up starts. */
  readonly shown = countUp(this.institutes.map((i) => i.count), () => this.cards().nativeElement);

  /** Two digits, as the old site set them ("04 Hostels"). */
  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
