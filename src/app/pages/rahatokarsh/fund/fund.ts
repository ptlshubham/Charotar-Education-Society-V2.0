import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageHero } from '../../../shared/page-hero/page-hero';

/**
 * Objective of the Rahatokarsh Fund. Both language versions are copied verbatim
 * from the legacy cesociety.in fund page.
 */
@Component({
  selector: 'app-fund',
  imports: [PageHero],
  templateUrl: './fund.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './fund.scss',
})
export class Fund {
  readonly active = signal<'english' | 'gujarati'>('english');
  readonly expanded = signal(false);

  select(lang: 'english' | 'gujarati'): void {
    this.active.set(lang);
    this.expanded.set(false);
  }

  readonly english: readonly string[] = [
    'The Rahatokarsh Fund helps bright students who are short of money keep studying at any CES institution, from KG to PG. It is meant for students who get no scholarship or other help but want to carry on and build a career.',
    'The fund is run openly by our Secretary, Shri Ketankumar P. Patel.',
    'We started the fund as part of our centenary celebrations, which ran from April 2015 to April 2016. The interest it earns, the names of donors and the students it has helped are all published on this website.',
    `"When you give, don't look at what is in your hands. Look at what is in your heart."`,
    'Charotar Education Society was set up to teach the children of the Charotar region, and it has been doing that since 1916. Today its name is known well beyond India. Our centenary gave me an idea I would like to share with you.',
    'People often come to me asking for a fee waiver for a bright student who badly wants to study. Some of these children have lost their parents. Others have parents with almost no income, who still scrimp and save so their children can have a better future.',
    "CES has helped students like these ever since it began. With a proper fund behind us we can help many more, so in the Society's 99th year I set up the Rahatokarsh Fund. It pains me to think how many students rising prices could push out of school, so I ask every well-wisher of the Society to give what they can.",
    'You can send your donation to the bank account below. Donations are exempt from income tax under Section 80G(5).',
  ];

  /** Mixed headings and paragraphs, so each block carries its own kind. */
  readonly gujarati: ReadonlyArray<{ kind: 'h' | 'p'; text: string }> = [
    {
      kind: 'p',
      text: 'ચરોતર એજ્યુકેશન સોસાયટી સંચાલિત સંસ્થાઓમાં અભ્યાસ કરતા તેજસ્વી તારલાઓ કે જેમની આર્થિક પરિસ્થિતિ નબળી છે તેમજ જેમને અન્ય કોઈ પ્રકારની મદદ નથી કે અભ્યાસ માટે કોઈ પણ પ્રકારની શિષ્યવૃત્તિ મળતી નથી તેવા બાળકો-વિદ્યાર્થીઓ આગળ અભ્યાસ કરી શકે તે હેતુથી તેમને આર્થિક રીતે સહાયભૂત થવું.',
    },
    { kind: 'h', text: 'રાહતોત્કર્ષ ફંડનું કાર્યક્ષેત્ર' },
    {
      kind: 'p',
      text: 'ચરોતર એજ્યુકેશન સોસાયટી સંચાલિત કોઈ પણ સંસ્થાના તેજસ્વી તારલાઓ કે.જી. થી પી.જી. સુધીમાં અભ્યાસ કરતાં આ શિષ્યવૃતિનો લાભ મેળવી શકે છે.',
    },
    { kind: 'h', text: 'રાહતોત્કર્ષ ફંડનાં મુખ્ય વહીવટકર્તા:-' },
    { kind: 'p', text: 'મંત્રીશ્રી, કેતનભાઈ પી. પટેલ, ચરોતર એજ્યુકેશન સોસાયટી, આણંદ.' },
    { kind: 'h', text: 'રાહતોત્કર્ષ ફંડનું પારદર્શક સંચાલન:-' },
    {
      kind: 'p',
      text: 'ચરોતર એજ્યુકેશન સોસાયટીની સ્થાપનાના ૯૯ મા વર્ષની ભવ્યાતીભવ્ય ઊજવણીનાં ભાગરૂપે સ્થપાયેલ રાહતોત્કર્ષ ફંડનું પારદર્શક સંચાલનના હેતુસર સમગ્ર ફંડની મૂડી તેમજ તેના વ્યાજની વિગતો દાતાશ્રીના નામ તેમજ લાભાર્થી વિદ્યાર્થીઓના નામ સાથે દર્શાવવામાં આવે છે. એકત્રિત થયેલ મૂડીનું વ્યાજ વિદ્યાર્થી સહાય માટે ઉપયોગમાં લેવામાં આવશે.',
    },
    {
      kind: 'p',
      text: '“દાન આપતી વખતે હાથમાં શું હતું એ નહીં, પરંતુ દિલમાં શું હતું એ જોવાની જરૂર છે.”',
    },
    {
      kind: 'p',
      text: 'જેની સ્થાપના પાછળનો હેતુ ચરોતરના નબળા, પછાત તેમજ મધ્યમ વર્ગના વિદ્યાર્થીઓને શિક્ષિત કરવાનો હતો એવી ચરોતર એજ્યુકેશન સોસાયટી છેલ્લાં ૯૮ વર્ષોથી સતત પોતાની સામાજિક જવાબદારી અદા કરી રહી છે. જેની સ્થાપના માત્ર ચરોતરના સામાન્ય પરિવારનાં બાળકો માટે થઇ હતી તે અત્યારે વિશાળ વટવૃક્ષ બની સમગ્ર ગુજરાતના તમામ લોકો માટે પોતાનું સામાજિક ઋણ અદા કરી રહી છે, ત્યારે સોસાયટીનાં ૯૯ મા વર્ષના આ મંગલપ્રવેશ સમયે એક વિચાર મનમાં સ્ફૂર્યો છે તેને તમારી આગળ વહેતો કરું છું.',
    },
    {
      kind: 'p',
      text: 'સમાજના લોકો મારી સમક્ષ વારંવાર રજૂઆત લઈને આવે છે કે આપણી સંસ્થામાં ઘણાં બાળકો છે કે જેમને ભણવું છે. પરંતુ તેમાંના કેટલાંક મા-બાપ વિહોણા છે અથવા તો આર્થિક રીતે અત્યંત ગરીબ છે, જેમની પાસે આવકનો બીજો કોઈ સ્ત્રોત નથી. તેમ છતાં પણ પોતાનાં બાળકોનાં ઉજ્જવળ ભવિષ્ય માટે મા-બાપ ખુબ જ કરકસરપૂર્વક સંચાલન કરે છે. આવા તેજસ્વી તારલાંઓનું ભાવિ ન જોખમાય તે માટે તેમની ફી માફી માટેની જોગવાઈ કરો.',
    },
    {
      kind: 'p',
      text: 'વાસ્તવમાં ચરોતર એજ્યુકેશન સોસાયટી વર્ષોથી ગરીબ વિદ્યાર્થીઓને ભણતર માટે ફી માફીની જોગવાઈ કરી રહી છે. ત્યારે આવું કોઈ મોટું ફંડ એકત્રિત કરાય જેનાથી વધુને વધુ વિદ્યાર્થીઓ તેના લાભાર્થી બને તે માટે સોસાયટીના ૯૯ મા સ્થાપના વર્ષે રાહતોત્કર્ષ ફંડ ઊભું કરવાનું વિચારું છું.',
    },
    {
      kind: 'p',
      text: 'સમાજની આ વાસ્તવિક છબી જોઇને મારું હૃદય દ્રવી ઉઠે છે કે, મોઘવારીનો આ યુગ કેટલાં બાળકોનાં ભવિષ્યનો ભોગ લેશે? માટે હું વિકાસની આ કેડી કંડારવાની પહેલ કરવા માગું છું. જેમાં મારી સાથે ચાલનારા સમાજહિતેત્છકોને વિનવું છું કે આ રાહતોત્કર્ષ ફંડમાં ઉદાર હાથે દાન આપો.',
    },
    {
      kind: 'p',
      text: 'આપ આપણા અમૂલ્ય દાનને નીચે દર્શાવેલ બેંક ખાતામાં જમા કરાવી શકો છો. વધુમાં આપે દાન પેટે આપેલ રકમને આવકવેરાની કલમ 80-G (5) હેઠળ મુક્તિને પાત્ર છે.',
    },
  ];

  readonly bank: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Name of Bank', value: 'State Bank of India, Sardar Gunj Branch, Anand.' },
    { label: 'Account Name', value: 'Rahatokarsh Fee Fund.' },
    { label: 'IFS Code', value: 'SBIN0060137' },
    { label: 'Account No', value: '66016425223' },
  ];
}
