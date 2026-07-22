import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { register } from 'swiper/element/bundle';

interface HighlightCard {
  title: string;
  desc: string;
}

/**
 * This carousel previously held customer testimonials. ZarklyX is pre-launch, so
 * those quotes were placeholders attributed to invented people at real companies
 * — removed rather than shipped. It now carries capability highlights instead.
 *
 * When real agencies are live and have agreed to be quoted, restore the
 * testimonial cards (quote / avatar / name / company + star rating) here.
 */
const CARDS: HighlightCard[] = [
  {
    title: 'Every client in one place',
    desc: 'CRM, projects, files and conversations for each client — without switching between five tools to find them.',
  },
  {
    title: 'HR and payroll built in',
    desc: 'Onboarding, leave, attendance and payslips for your own team, so you do not need a separate HR system.',
  },
  {
    title: 'Publish across 11 platforms',
    desc: 'Schedule and publish to every channel you manage for every client, from a single shared calendar.',
  },
  {
    title: 'Invoicing that follows the work',
    desc: 'Turn delivered work into invoices without re-entering anything, and keep billing beside the project it came from.',
  },
  {
    title: 'Client portals, safely',
    desc: 'Role-based permissions give clients their own view while your internal data stays locked down.',
  },
  {
    title: 'One login for the whole team',
    desc: 'Stop paying for five disconnected tools and reconciling five sets of data every month.',
  },
];

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Testimonials {
  /**
   * One card per slide. With 6 unique cards there are always more than fit on
   * screen (even at 3-per-view on lg), so loop + autoplay animate on every
   * breakpoint and each dot maps to a distinct card.
   */
  cards: HighlightCard[] = CARDS;

  constructor() {
    // Register Swiper's custom elements in the browser only (safe for SSR).
    afterNextRender(() => register());
  }
}
