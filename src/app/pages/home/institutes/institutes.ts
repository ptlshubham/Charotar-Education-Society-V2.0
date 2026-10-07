import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Institute {
  title: string;
  desc: string;
  link: string;
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
  readonly institutes: readonly Institute[] = [
    { 
      title: 'Schools', 
      desc: 'Nurturing young minds for a brighter future.', 
      link: '/academic/school', 
      icon: '<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/>',
      colorClass: 'bg-teal-100 text-teal-600',
      underlineClass: 'bg-teal-500'
    },
    { 
      title: 'Colleges', 
      desc: 'Empowering learners with knowledge & skills.', 
      link: '/academic/colleges', 
      icon: '<path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>',
      colorClass: 'bg-orange-100 text-orange-600',
      underlineClass: 'bg-orange-500'
    },
    { 
      title: 'Professional Institutes', 
      desc: 'Shaping career-ready professionals with industry-focused programs.', 
      link: '/academic/others', 
      icon: '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
      colorClass: 'bg-red-100 text-red-600',
      underlineClass: 'bg-red-500'
    },
    { 
      title: 'Hostels', 
      desc: 'Safe, comfortable & homely environment.', 
      link: '/academic/hostels', 
      icon: '<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>',
      colorClass: 'bg-blue-100 text-blue-600',
      underlineClass: 'bg-blue-500'
    }
  ];
}
