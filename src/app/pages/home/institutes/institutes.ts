import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

interface Institute {
  title: string;
  desc: string;
  link: string;
  /** Set to a campus photograph to replace the placeholder panel. */
  image?: string;
}

@Component({
  selector: 'app-institutes',
  imports: [RouterLink],
  templateUrl: './institutes.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './institutes.scss',
})
export class Institutes {
  @ViewChild('track') track?: ElementRef<HTMLElement>;

  readonly institutes: readonly Institute[] = [
    { title: 'Schools', desc: 'Nurturing young minds for a brighter future.', link: '/academic/school', image: PLACEHOLDER.institutes.schools },
    { title: 'Colleges', desc: 'Empowering learners with knowledge & skills.', link: '/academic/colleges', image: PLACEHOLDER.institutes.colleges },
    { title: 'Professional Institutes', desc: 'Building career-ready professionals.', link: '/academic/others', image: PLACEHOLDER.institutes.professional },
    { title: 'Hostels', desc: 'Safe, comfortable living environment.', link: '/academic/hostels', image: PLACEHOLDER.institutes.hostels },
    { title: 'Other Institutes', desc: 'Diverse programs for holistic development.', link: '/academic/others', image: PLACEHOLDER.institutes.others },
  ];

  /** Scrolls by one card plus its gap, so cards land on the snap points. */
  scrollBy(direction: -1 | 1): void {
    const el = this.track?.nativeElement;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  }
}
