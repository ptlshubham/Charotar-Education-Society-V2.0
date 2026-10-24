import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Lang = 'en' | 'gu';

/** Everything the section says, in one language. */
interface IntroCopy {
  eyebrow: string;
  years: string;
  title: readonly [string, string];
  period: string;
  paragraphs: readonly string[];
  /** What the 100 events were, shown as a dotted list. */
  breakdown: readonly string[];
  stats: ReadonlyArray<{ value: string; label: string }>;
  recordsLink: string;
}

/**
 * Shatakotsav overview at the top of the Celebration page, in English or Gujarati. The Guinness
 * link scrolls to the records section further down the page.
 */
@Component({
  selector: 'app-centenary-intro',
  imports: [RouterLink],
  templateUrl: './centenary-intro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './centenary-intro.scss',
})
export class CentenaryIntro {
  /** Each tab is labelled in its own language. */
  readonly tabs: ReadonlyArray<{ id: Lang; label: string }> = [
    { id: 'en', label: 'English' },
    { id: 'gu', label: 'ગુજરાતી' },
  ];

  readonly lang = signal<Lang>('en');

  private readonly copy: Record<Lang, IntroCopy> = {
    en: {
      eyebrow: 'Shatakotsav',
      years: '2015 – 2016',
      title: ['A century of learning.', 'A year of celebration.'],
      period: 'April 2015 – April 2016',
      paragraphs: [
        'Charotar Education Society turned 100 in April 2016. Shatakotsav brought together 100 events across ' +
        'academics, culture, social service, sports, health fairs and festivals.',
        'Across 338 days and about 1,900 hours, 41,964 participants made it a year to remember. Students led much ' +
        'of the organising, building leadership and teamwork beyond the classroom.',
      ],
      breakdown: [
        '40 cultural programmes', '16 academic events', '13 social and awareness drives', '9 sports competitions',
        '6 health fairs', '5 get-togethers', '3 festivals', '8 record events',
      ],
      stats: [
        { value: '100', label: 'Events' },
        { value: '338', label: 'Days of celebration' },
        { value: '41,964', label: 'Participants' },
        { value: '8', label: 'Guinness World Records' },
      ],
      recordsLink: 'Explore Guinness World Records',
    },
    // Paragraphs and breakdown are the Society's own Gujarati text (from its history document).
    // Eyebrow, title, period, stat labels and link text are translations - to be checked by CES.
    gu: {
      eyebrow: 'શતકોત્સવ',
      years: '2015 – 2016',
      title: ['શિક્ષણની એક સદી.', 'ઉજવણીનું એક વર્ષ.'],
      period: 'એપ્રિલ 2015 – એપ્રિલ 2016',
      paragraphs: [
        'એપ્રિલ 2016 ના રોજ સંસ્થાએ સ્થાપનાના 100 વર્ષ પૂર્ણ કર્યા. આ અવસરને ચિહ્નિત કરવા સંસ્થાએ શતાબ્દી ઉજવણી, શૈક્ષણિક, સામાજિક, આરોગ્ય, રમતગમત, મેળો, ઉત્સવ જેવી કેટેગરી હેઠળ એપ્રિલ 2015 થી એપ્રિલ 2016 દરમિયાન 100 વિવિધ કાર્યક્રમો “શતકોત્સવ” તરીકે આયોજિત કર્યા.',
        'વર્ષ દરમ્યાન કુલ ૩૩૮ દિવસ વિવિધ કાર્યક્રમોની ઉજવણી થઈ, જેમાં કુલ ૧૯૦૦ કલાક દરમ્યાન ૪૧,૯૬૪ જેટલા સ્પર્ધકોએ ભાગ લીધો. આ કાર્યક્રમો વિદ્યાર્થીઓ માટે અનોખો મંચ બન્યા, જ્યાં તેમને નેતૃત્વ, ટીમવર્ક, સર્જનાત્મકતા અને સામાજિક જવાબદારીનો પ્રેક્ટિકલ અનુભવ મળ્યો.',
      ],
      breakdown: [
        '૪૦ સાંસ્કૃતિક કાર્યક્રમો', 'શૈક્ષણિક ક્ષેત્રની ૧૬ ઇવેન્ટ', 'સામાજિક વિકાસ અને જનજાગૃતિ હેતુલક્ષી ૧૩ કાર્યક્રમો',
        '૯ રમતગમત સ્પર્ધાઓ', '૬ આરોગ્ય મેળા', '૫ મેળાવડા', '૩ ઉત્સવો', 'ગિનીસ વર્લ્ડ રેકોર્ડની ૮ ઇવેન્ટ',
      ],
      stats: [
        { value: '૧૦૦', label: 'કાર્યક્રમો' },
        { value: '૩૩૮', label: 'ઉજવણીના દિવસો' },
        { value: '૪૧,૯૬૪', label: 'સ્પર્ધકો' },
        { value: '૮', label: 'ગિનીસ વર્લ્ડ રેકોર્ડ' },
      ],
      recordsLink: 'ગિનીસ વર્લ્ડ રેકોર્ડ જુઓ',
    },
  };

  readonly c = computed(() => this.copy[this.lang()]);

  select(id: Lang): void {
    this.lang.set(id);
  }

  /** ← / → move between the tabs (WAI-ARIA tabs pattern). */
  move(e: Event): void {
    e.preventDefault();
    const next: Lang = this.lang() === 'en' ? 'gu' : 'en';
    this.lang.set(next);
    document.getElementById(`intro-tab-${next}`)?.focus();
  }
}
