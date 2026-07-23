import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Bearer {
  no: number;
  name: string;
  years: string;
}

/**
 * Historical office bearers, copied verbatim (Gujarati) from the legacy
 * cesociety.in "Office Bearers" page. Kept as data rather than markup so the
 * table can be restyled without touching the record.
 */
@Component({
  selector: 'app-former-bearers',
  templateUrl: './former-bearers.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './former-bearers.scss',
})
export class FormerBearers {
  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  readonly chairmen: readonly Bearer[] = [
    { no: 1, name: 'શ્રી ગોપાલદાસ બાઈદાસ દેસાઈ', years: '1916 થી 1925' },
    { no: 2, name: 'શ્રી દાદુભાઈ પુરુષોત્તમદાસ દેસાઈ', years: '1626 થી 1933' },
    { no: 3, name: 'શ્રી ચુનીભાઈ ઉમેદભાઈ પટેલ', years: '1934 થી 1937' },
    { no: 4, name: 'શ્રી મોતીભાઈ નરસિંહભાઈ પટેલ', years: '1938 થી 1939' },
    { no: 5, name: 'શ્રી ભાઈલાલભાઈ શંકરભાઈ પટેલ', years: '1940 થી 1945' },
    { no: 6, name: 'શ્રી ભાઈલાલભાઈ ઘાભાઈ પટેલ', years: '1946 થી 1950' },
    { no: 7, name: 'શ્રી મગનભાઈ શંકરભાઈ પટેલ', years: '1951 થી 1960' },
    { no: 8, name: 'શ્રી ડો. મગનભાઈ ડાહ્યાભાઈ પટેલ', years: '1961 થી 1969' },
    { no: 9, name: 'શ્રી ઈશ્વરભાઈ જેઠાભાઈ પટેલ', years: '1970 થી 1982' },
    { no: 10, name: 'શ્રી ચીમનભાઈ દાદુભાઈ દેસાઈ', years: '1983 થી 1989' },
    { no: 11, name: 'શ્રી બિપીનચંદ્ર પુરુષોત્તમદાસ પટેલ (વકીલ)', years: '1990 થી 1991' },
    { no: 12, name: 'શ્રી આશાભાઈ ગોરધનભાઈ પટેલ', years: '1991 થી 1992' },
    { no: 13, name: 'શ્રી બિપીનચંદ્ર પુરુષોત્તમદાસ પટેલ (વકીલ)', years: '1992 થી 1993' },
    { no: 14, name: 'શ્રી ગિરીશભાઈ મગનભાઈ પટેલ', years: '1993 થી 20-6-1995' },
    { no: 15, name: 'શ્રી દિલીપભાઈ મણિભાઈ પટેલ', years: '20-6-1995 થી 2-11-1995' },
    { no: 16, name: 'શ્રી હસમુખભાઈ મગનભાઈ પટેલ (વકીલ)', years: '1995 થી 1996' },
    { no: 17, name: 'શ્રી હરિશભાઈ ચીમનભાઈ પટેલ', years: '1996 થી 1999' },
    { no: 18, name: 'શ્રી ચીમનભાઈ મણીભાઈ પટેલ (સાથી)', years: '1999 થી 2002' },
    { no: 19, name: 'શ્રી રજનીકાંત ઠાકરલાલ શાહ', years: '2002 થી 2004' },
    { no: 20, name: 'શ્રી પ્રજ્ઞેશભાઈ વિઠ્ઠલભાઈ પટેલ', years: '2004 થી 2007' },
    { no: 21, name: 'શ્રી વિનોદભાઈ વલ્લભભાઈ પરમાર', years: '2007 થી 2008' },
    { no: 22, name: 'શ્રી અલ્પેશભાઈ નવીનચંદ્ર પટેલ', years: '2008 થી 2009' },
    { no: 23, name: 'શ્રી નિરવભાઈ નવીનચંદ્ર પટેલ', years: '2009 થી આજ દીન સુધી' },
  ];

  readonly secretaries: readonly Bearer[] = [
    { no: 1, name: 'શ્રી અંબાલાલ મોતીભાઈ પટેલ', years: '1916 થી 1917' },
    { no: 2, name: 'શ્રી ભીખાભાઈ કુબેરભાઈ પટેલ', years: '1918 થી 1924' },
    { no: 3, name: 'શ્રી ચુનીલાલ વ. ભટ્ટ', years: '1925 થી 1926' },
    { no: 4, name: 'શ્રી ભીખાભાઈ કુબેરભાઈ પટેલ', years: '1926 થી 1927' },
    { no: 5, name: 'શ્રી આશાભાઈ નરસિંહભાઈ પટેલ', years: '1928 થી 1936' },
    { no: 6, name: 'શ્રી ચંદુભાઈ રાવજીભાઈ પટેલ', years: '1937 થી 1938' },
    { no: 7, name: 'શ્રી આશાભાઈ નરસિંહભાઈ પટેલ', years: '1939 થી 1940' },
    { no: 8, name: 'શ્રી ચંદુભાઈ રાવજીભાઈ પટેલ', years: '1941 થી 1943' },
    { no: 9, name: 'શ્રી રાવજીભાઈ ચતુરભાઈ પટેલ', years: '1944 થી 1964' },
    { no: 10, name: 'શ્રી અંબાલાલ છોટાભાઈ પટેલ', years: '1965 થી 1969' },
    { no: 11, name: 'શ્રી વિઠ્ઠલભાઈ જેઠાભાઈ પટેલ', years: '1970 થી 1972' },
    { no: 12, name: 'શ્રી મગનભાઈ પી. ઓઝા', years: '1973 થી 1975' },
    { no: 13, name: 'શ્રી વિઠ્ઠલભાઈ જેઠાભાઈ પટેલ', years: '1976 થી 1977' },
    { no: 14, name: 'શ્રી રમણભાઈ નારણભાઈ પટેલ', years: '1978 થી 1981' },
    { no: 15, name: 'શ્રી માધવલાલ જમનાદાસ દેસાઈ', years: '1982 થી 1984' },
    { no: 16, name: 'શ્રી મનુભાઈ મણિભાઈ પટેલ', years: '1985 થી 1991' },
    { no: 17, name: 'શ્રી દિનેશભાઈ કેશવલાલ પટેલ', years: '1991 થી 1999' },
    { no: 18, name: 'શ્રી બિપીનચંદ્ર પુરુષોત્તમદાસ પટેલ (વકીલ).', years: '1999 થી 2006' },
    { no: 19, name: 'શ્રી પિનલભાઈ કાંતિભાઈ પટેલ', years: '2006 થી 2008' },
    { no: 20, name: 'શ્રી ચેતનભાઈ મણીભાઈ પટેલ', years: '2008 થી 2009' },
    { no: 21, name: 'શ્રી કેતનભાઈ પુરુષોત્તમદાસ પટેલ', years: '2009 આજ સુધી' },
  ];
}
