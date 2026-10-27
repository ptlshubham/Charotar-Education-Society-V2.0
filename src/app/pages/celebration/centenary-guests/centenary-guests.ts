import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/** A post of the Society's 2015 centenary blog - now on the Society's own blog. */
const post = (slug: string) => `/blog/${slug}`;
/** Talks recorded at Shatakotsav events, on the Society's YouTube channel. */
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
/** How many guests show before "View all guests" - the first ones in `guests`. */
const HIGHLIGHTS = 3;

interface Guest {
  name: string;
  /** Who they are, as the public knows them. */
  role: string;
  event: string;
  when: string;
  /** What they did at the event - reported, never put in their mouths. */
  note: string;
  /** A Shatakotsav photo of that event (its banner names the event). */
  photo: string;
  link: { label: string; href: string };
}

/**
 * "Distinguished Guests & Memorable Moments" - who came to the centenary and for what, from the
 * Society's own records only: the Shatakotsav photos, the 2015 centenary blog and the talks on
 * its YouTube channel. Guests are described rather than quoted, since their talks are on video.
 * Three highlights show first; "View all guests" opens the rest in place.
 */
@Component({
  selector: 'app-centenary-guests',
  imports: [RouterLink],
  templateUrl: './centenary-guests.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-guests.scss',
})
export class CentenaryGuests {
  /** The first HIGHLIGHTS entries are the ones shown before "View all guests". */
  readonly guests: readonly Guest[] = [
    {
      name: 'Dr. Anil Kakodkar',
      role: 'Nuclear scientist; former Chairman, Atomic Energy Commission',
      event: 'Independence Day',
      when: '15 August 2015',
      note: 'Guest of honour when the Society celebrated Independence Day in its centenary year.',
      photo: '/assets/images/celebration/shatakotsav/19.webp',
      link: { label: 'Watch his speech', href: watch('XeFiYvdN1fk') },
    },
    {
      name: 'Shahbuddin Rathod',
      role: 'Gujarati humorist and retired principal',
      event: "Teachers' Day",
      when: '22 September 2015',
      note: 'Chief guest at Anand Town Hall as the Society honoured its best teachers and those retiring. He told his stories in his own style and had the hall in splits.',
      photo: '/assets/images/celebration/shatakotsav/01.webp',
      link: { label: 'Watch the programme', href: watch('5NM5-MRt_oA') },
    },
    {
      name: 'Vijay Rupani',
      role: 'Chief Minister of Gujarat, 2016–2021',
      event: 'Mega Placement Fair',
      when: 'February 2016',
      note: 'Addressed students at the centenary placement fair for commerce, management and computer graduates.',
      photo: '/assets/images/celebration/shatakotsav/31.webp',
      link: { label: 'Watch his address', href: watch('UNASDvVIwFA') },
    },
    {
      name: 'Osman Mir',
      role: 'Gujarati singer',
      event: 'Dussehra evening',
      when: '22 October 2015',
      note: 'Led the Shatakotsav Dussehra evening of music for students and families at D.N. High School, Anand.',
      photo: '/assets/images/celebration/shatakotsav/04.webp',
      link: { label: 'Watch the performance', href: watch('QbifqY4Y-1A') },
    },
    {
      name: 'Anuj Dhar',
      role: 'Author and researcher on Netaji Subhas Chandra Bose',
      event: 'Netaji Subhas Chandra Bose',
      when: 'July 2015',
      note: 'Presented his research on Netaji and the mystery around his death to students and staff.',
      photo: '/assets/images/celebration/shatakotsav/15.webp',
      link: { label: 'Watch the talk', href: watch('F0HQqmHk3Pk') },
    },
  ];

  /** More guests of the year, named with the event they came for. `href` starting with "/" is a page of this site. */
  readonly alsoWithUs: ReadonlyArray<{ name: string; event: string; href: string }> = [
    { name: 'Dr. Dipak Amrapurkar', event: 'Health is Wealth, April 2016', href: watch('9yyu3KCPM_0') },
    { name: 'Pu. Pa. Yuvraj Vagishkumarji of Kankroli', event: 'blessed the Haveli Sangeet evening, May 2015', href: post('santoor-evening-sangeet-vidyalaya') },
    { name: 'Abhinay Banker and Kalpana Gagdekar', event: '“Kasturba” on stage, October 2015', href: post('kasturba-the-play') },
    { name: 'RJ Aditi Rawal, Red FM', event: 'Skill Fair, 2015', href: post('skill-fair-marathon-lectures') },
    { name: 'Koustuva Mukherjee, Taj Hotels', event: 'Skill Fair, 2015', href: watch('s3ll-mUJzXA') },
  ];

  readonly showAll = signal(false);
  readonly shown = computed(() => (this.showAll() ? this.guests : this.guests.slice(0, HIGHLIGHTS)));

  toggle(): void {
    this.showAll.update((v) => !v);
  }
}
