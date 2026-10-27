/** Trims a DB text value and blanks out missing ones. Legacy rows sometimes
 *  carry the literal strings "undefined"/"null" (an empty form or Excel cell
 *  saved as text), which should read as empty, not be shown to visitors. */
export function cleanText(value: unknown): string {
  const text = value == null ? '' : String(value).trim();
  return /^(undefined|null)$/i.test(text) ? '' : text;
}
