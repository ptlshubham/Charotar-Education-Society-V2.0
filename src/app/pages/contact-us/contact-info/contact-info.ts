import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Card {
  title: string;
  lines: string[];
  href?: string;
  icon: string;
  subtext?: string;
  actionText?: string;
  actionHref?: string;
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
      icon: 'location_on',
    },
    {
      title: 'Email Address',
      lines: ['info@cesociety.in'],
      href: 'mailto:info@cesociety.in',
      icon: 'mail',
      subtext: 'We typically reply within 24–48 hours.',
    },
    {
      title: 'Phone Number',
      lines: ['(02692) - 243083'],
      href: 'tel:02692243083',
      icon: 'call',
      subtext: 'Mon – Sat | 9:00 AM – 6:00 PM',
    },
  ];
}
