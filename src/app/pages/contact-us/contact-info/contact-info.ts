import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Card {
  title: string;
  lines: string[];
  href?: string;
  path: string[];
}

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-info.scss',
})
export class ContactInfo {
  readonly cards: readonly Card[] = [
    {
      title: 'Address',
      lines: ['D. N. High School Campus,', 'Station Road, Anand – 388001,', 'Gujarat, India'],
      path: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    },
    {
      title: 'Email Address',
      lines: ['info@cesociety.in'],
      href: 'mailto:info@cesociety.in',
      path: ['M2 4h20v16H2z', 'm2 6 10 7 10-7'],
    },
    {
      title: 'Phone Number',
      lines: ['(02692) - 243083'],
      href: 'tel:02692243083',
      path: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z'],
    },
  ];
}
