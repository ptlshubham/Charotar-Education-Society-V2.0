import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SeoService } from '../../core/services/seo.service';

/** Chatkaro runs 11 to 13 January every year, 10:30 AM to 10:30 PM. */
const FIRST_DAY = 11;
const LAST_DAY = 13;

/** This January's Chatkaro until it ends on the 13th, then next year's. */
function chatkaroYear(now: Date): number {
  return now.getMonth() === 0 && now.getDate() <= LAST_DAY ? now.getFullYear() : now.getFullYear() + 1;
}

const VENUE = 'D.N. High School Campus';
const STREET = 'Station Road, Anand 388001';
const PAGE_URL = `${environment.frontendUrl}/chatkaro`;
const EVENT_SCRIPT_ID = 'chatkaro-event-jsonld';

/**
 * Chatkaro (/chatkaro): the Society's three-day food festival, skill fair and Alumni Meet.
 *
 * Sources: the Chatkaro site and its 2026 menu (chatkaro.cesociety.in: dates, hours, free entry,
 * 22 stalls, the dishes), the Society's history document (venue, skill fair, alumni reunion) and
 * the Social Activity notes on cesociety.in (millets, its popularity). The hero takes its look
 * from the festival's own menu: pink, ticket stubs and the CES mascot.
 */
@Component({
  selector: 'app-chatkaro',
  imports: [RouterLink],
  templateUrl: './chatkaro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chatkaro.scss',
})
export class Chatkaro {
  private readonly document = inject(DOCUMENT);

  readonly photo = '/assets/images/social-activity/food-festival.png';
  readonly menuSite = 'https://chatkaro.cesociety.in/';
  readonly venue = VENUE;
  readonly street = STREET;
  readonly phone = '(02692) 243083';
  readonly phoneHref = 'tel:02692243083';
  readonly days = [FIRST_DAY, 12, LAST_DAY];
  readonly year = chatkaroYear(new Date());

  /** True during the festival. Set in the browser, so a prerendered page never claims it. */
  readonly live = signal(false);

  readonly mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`D.N. High School, ${STREET}`)}`;

  /** All three days as one all-day entry; Google's end date is exclusive. */
  readonly calendarLink =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`CES Chatkaro ${this.year}`)}` +
    `&dates=${this.year}01${FIRST_DAY}/${this.year}01${LAST_DAY + 1}` +
    `&location=${encodeURIComponent(`${VENUE}, ${STREET}`)}` +
    `&details=${encodeURIComponent(`Food festival, skill fair and the CES Alumni Meet. 10:30 AM to 10:30 PM each day. Free entry for all. ${PAGE_URL}`)}`;

  readonly facts: ReadonlyArray<{ value: string; label: string }> = [
    { value: '3 days', label: '11, 12 and 13 January' },
    { value: '12 hours', label: 'A day, 10:30 AM to 10:30 PM' },
    { value: '22', label: 'Food stalls in 2026' },
    { value: 'Free', label: 'Entry for everyone' },
  ];

  readonly parts: ReadonlyArray<{ icon: string; title: string; body: string; link?: { label: string; path: string } }> = [
    {
      icon: 'restaurant',
      title: 'Food Festival',
      body: "Gujarat's traditional and organic food, street-style favourites and old family recipes, with millets and other whole grains in many of the dishes.",
    },
    {
      icon: 'work',
      title: 'Skill Fair',
      body: 'Career workshops, training programmes and job opportunities, for students and for anyone looking to learn a skill or find work.',
    },
    {
      icon: 'groups',
      title: 'Alumni Meet',
      body: 'On 13 January, the birthday of Shri Vitthalbhai J. Patel, former students from India and abroad come home to Anand.',
      link: { label: 'Register as an alumnus', path: '/alumni' },
    },
    {
      icon: 'theater_comedy',
      title: 'Culture on Stage',
      body: 'Cultural programmes and student performances run through all three days, from morning till late.',
    },
  ];

  /** A few dishes from the 2026 menu. */
  readonly menu: ReadonlyArray<{ title: string; dishes: readonly string[] }> = [
    {
      title: 'Millets and whole grains',
      dishes: [
        'Millet pani puri',
        'Millet sev puri',
        'Millet momos',
        'Millet frankie',
        'Ragi idli with chutney',
        'Multigrain khichdi',
        'Multigrain dhebra',
        'Multigrain dal bati',
      ],
    },
    {
      title: 'Gujarati favourites',
      dishes: ['Handvo', 'Dudhiyo bajro', 'Makai nu khichu', 'Ragda pattice', 'Corn chatpati', 'Shakkariya chaat', 'Capsicum ring chilla'],
    },
    {
      title: 'Sweets and drinks',
      dishes: ['Gajar no halwo', 'Masala chhaas', 'Millet masala chai', 'Methi coffee', 'Aparajita and hibiscus sharbat'],
    },
  ];

  readonly more: ReadonlyArray<{ title: string; when: string; body: string; image: string; link: string }> = [
    {
      title: 'Navratri Mahotsav',
      when: 'Every autumn',
      body: 'Nine nights of devotion, garba and culture on the CES campus, with a new theme every year.',
      image: '/assets/images/hero/navratri.jpeg',
      link: '/navratri',
    },
    {
      title: 'Centenary Celebration',
      when: '2015-16',
      body: 'A hundred years of CES, marked with 100 events over 338 days and 8 Guinness World Records.',
      image: '/assets/images/hero/centenary-celebration.jpeg',
      link: '/celebration',
    },
  ];

  constructor() {
    inject(SeoService).applyCustom(
      {
        title: 'Chatkaro: Food Festival and Skill Fair',
        description:
          "CES Chatkaro: Gujarat's traditional food, a skill fair and the Alumni Meet, 11 to 13 January every year on the D.N. High School campus, Anand. Free entry for all.",
        image: this.photo,
      },
      'chatkaro',
    );
    this.setEventData();
    inject(DestroyRef).onDestroy(() => this.document.getElementById(EVENT_SCRIPT_ID)?.remove());

    afterNextRender(() => {
      const now = new Date();
      this.live.set(now.getMonth() === 0 && now.getDate() >= FIRST_DAY && now.getDate() <= LAST_DAY);
    });
  }

  /** In-page link to "Plan your visit" (a plain #visit would resolve against the base href). */
  jump(event: Event, id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** schema.org Festival data, so search engines can show the dates, venue and free entry. */
  private setEventData(): void {
    const head = this.document.head;
    if (!head) return;
    let script = this.document.getElementById(EVENT_SCRIPT_ID);
    if (!script) {
      script = this.document.createElement('script');
      script.id = EVENT_SCRIPT_ID;
      script.setAttribute('type', 'application/ld+json');
      head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Festival',
      name: `CES Chatkaro ${this.year}`,
      description: 'Food festival, skill fair and the CES Alumni Meet, with traditional Gujarati and millet dishes.',
      startDate: `${this.year}-01-${FIRST_DAY}T10:30:00+05:30`,
      endDate: `${this.year}-01-${LAST_DAY}T22:30:00+05:30`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree: true,
      image: [`${environment.frontendUrl}${this.photo}`],
      url: PAGE_URL,
      location: {
        '@type': 'Place',
        name: VENUE,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Station Road',
          addressLocality: 'Anand',
          postalCode: '388001',
          addressRegion: 'Gujarat',
          addressCountry: 'IN',
        },
      },
      organizer: { '@type': 'Organization', name: 'Charotar Education Society', url: environment.frontendUrl },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: PAGE_URL },
    }).replace(/</g, '\\u003c');
  }
}
