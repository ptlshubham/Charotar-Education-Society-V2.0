import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** The Society's centenary blog (2015) - where the memories below were first published. */
const BLOG = 'https://ces100anand.blogspot.com/';

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
  /** The Union minister who answered 15,000 invitations - the section's introduction. */
  readonly letters = {
    name: 'Smriti Irani',
    role: 'Union Minister of Human Resource Development',
    when: 'May 2015',
    link: { label: 'Read the story', href: `${BLOG}2015/05/smriti-irani-replies-to-15000-students.html` },
  };

  readonly voices: readonly Voice[] = [
    {
      quote: 'Nothing compares with CES. Whatever I am today, I owe to CES.',
      original: 'સીઈએસની કોઈ જ સરખામણી પણ શક્ય નથી આજે જે કઈ પણ છું એ સીઈએસને આભારી છે.',
      name: 'Prajnesh Patel',
      role: 'President, Anand Municipality (2015), and former student',
      initials: 'PP',
      source: `${BLOG}2015/08/blog-post_31.html`,
    },
    {
      quote: 'I want to give the credit of my success to Vithal Kaka and will be indebted to him my whole life.',
      name: 'Dr. Bharat J. Patel',
      role: 'Former student',
      initials: 'BP',
      source: `${BLOG}2015/05/if-you-dont-get-100-marks-in.html`,
    },
    {
      quote: 'Here I did more than live my life. I enjoyed it.',
      original: 'અહિયાં હું મારી જિંદગીને જીવ્યા કરતા માણી વધારે છે.',
      name: 'R. B. Patel',
      role: 'D.N. High School student, 1952–1959',
      initials: 'RP',
      source: `${BLOG}2015/07/blog-post_27.html`,
    },
    {
      quote: 'My life began right here. Whatever I can say today, whatever I have achieved, was possible only because of D.N. and CES.',
      original: 'મારા જીવનની શરૂઆત જ અહિયાથી થઇ હતી. આજે હું જે પણ કઈ બોલી શકું છું જે પણ સિદ્ધિઓ હાસિલ કરી શક્યો એ ડીએન અને સીઈએસને કારણેજ શક્ય બન્યું છે.',
      name: 'Nirav Patel',
      role: 'Chairman, CES, and former student',
      initials: 'NP',
      source: `${BLOG}2015/08/blog-post_91.html`,
    },
  ];
}
