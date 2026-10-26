import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_ARCHIVE_TAG } from '../../../shared/blog-post';

/**
 * A post of the Society's 2015 centenary blog, where the memories below were first published - now
 * on the Society's own blog.
 */
const post = (slug: string) => `/blog/${slug}`;

interface Voice {
  /** English rendering of their words (translated where the original is Gujarati). */
  quote: string;
  /** Their words as first published, when that was Gujarati. */
  original?: string;
  name: string;
  role: string;
  initials: string;
  source: string;
}

/**
 * "Voices From Our Community" - the 15,000 letters story as its introduction, then old students'
 * memories, from the Society's 2015 centenary blog only. Quotes are the words they wrote. (The
 * centenary's guests have their own section, CentenaryGuests.)
 */
@Component({
  selector: 'app-community-voices',
  imports: [RouterLink],
  templateUrl: './community-voices.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './community-voices.scss',
})
export class CommunityVoices {
  /** The 2015 centenary blog's posts on the blog page. */
  readonly archive = { tag: BLOG_ARCHIVE_TAG };

  /** The Union minister who answered 15,000 invitations - the section's introduction. */
  readonly letters = {
    name: 'Smriti Irani',
    role: 'Union Minister of Human Resource Development',
    when: 'May 2015',
    link: { label: 'Read the story', href: post('smriti-irani-replies-to-dn-students') },
  };

  readonly voices: readonly Voice[] = [
    {
      quote: 'Nothing compares with CES. Whatever I am today, I owe to CES.',
      original: 'સીઈએસની કોઈ જ સરખામણી પણ શક્ય નથી આજે જે કઈ પણ છું એ સીઈએસને આભારી છે.',
      name: 'Prajnesh Patel',
      role: 'President, Anand Municipality (2015), and former student',
      initials: 'PP',
      source: post('three-generations-with-ces-prajnesh-patel'),
    },
    {
      quote: 'I want to give the credit of my success to Vithal Kaka and will be indebted to him my whole life.',
      name: 'Dr. Bharat J. Patel',
      role: 'Former student',
      initials: 'BP',
      source: post('dr-bharat-patel-diary-of-memories'),
    },
    {
      quote: 'Here I did more than live my life. I enjoyed it.',
      original: 'અહિયાં હું મારી જિંદગીને જીવ્યા કરતા માણી વધારે છે.',
      name: 'R. B. Patel',
      role: 'D.N. High School student, 1952–1959',
      initials: 'RP',
      source: post('bunking-class-cost-dearly-rb-patel'),
    },
    {
      quote: 'My life began right here. Whatever I can say today, whatever I have achieved, was possible only because of D.N. and CES.',
      original: 'મારા જીવનની શરૂઆત જ અહિયાથી થઇ હતી. આજે હું જે પણ કઈ બોલી શકું છું જે પણ સિદ્ધિઓ હાસિલ કરી શક્યો એ ડીએન અને સીઈએસને કારણેજ શક્ય બન્યું છે.',
      name: 'Nirav Patel',
      role: 'Chairman, CES, and former student',
      initials: 'NP',
      source: post('when-the-chairman-was-a-student-nirav-patel'),
    },
  ];
}
