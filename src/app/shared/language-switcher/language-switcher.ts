import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  Input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const ICON = '.material-symbols-outlined';

/**
 * Material Symbols draw the icon from their text ("school", "bed"), so Google would translate
 * that into a word ("શાળા", "પલંગ") and the icon would vanish. Marks every icon translate="no" -
 * the ones on the page now and any rendered later - before Google's script starts. An attribute,
 * not the notranslate class, so Angular's [class] bindings can never take it off again.
 */
function keepIconsUntranslated(): void {
  const mark = (root: ParentNode) =>
    root.querySelectorAll(`${ICON}:not([translate])`).forEach((el) => el.setAttribute('translate', 'no'));
  mark(document);
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(ICON)) node.setAttribute('translate', 'no');
        mark(node);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

interface Lang {
  code: string;
  /** English name, shown as a secondary label. */
  label: string;
  /** Endonym, shown as the primary label. */
  native: string;
}

/**
 * Site-wide language switcher (English / Gujarati / Hindi) driven by the Google
 * Website Translator. A hidden Google Translate element does the actual
 * translation; this component is just a themed dropdown that sets the `googtrans`
 * cookie and reloads, which Google reads on load to translate the whole page.
 */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  private readonly platformId = inject(PLATFORM_ID);

  /** 'dark' for the navy top bar (white text); 'light' for a white surface. */
  @Input() variant: 'dark' | 'light' = 'dark';
  @Input() compact = false;

  readonly languages: readonly Lang[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  readonly current = signal('en');
  readonly open = signal(false);

  constructor() {
    afterNextRender(() => {
      this.current.set(this.readCookieLang());
      this.injectGoogleTranslate();
    });
  }

  currentLang(): Lang {
    return this.languages.find((l) => l.code === this.current()) ?? this.languages[0];
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  select(code: string): void {
    this.open.set(false);
    if (code === this.current()) return;
    this.setCookieLang(code);
    location.reload();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (this.open() && !(e.target as HTMLElement).closest('[data-lang-switcher]')) {
      this.open.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }

  /** Load Google's translate element once, hidden - it applies the cookie on load. */
  private injectGoogleTranslate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (document.getElementById('google-translate-script')) return;

    keepIconsUntranslated();

    if (!document.getElementById('google_translate_element')) {
      const host = document.createElement('div');
      host.id = 'google_translate_element';
      host.setAttribute('aria-hidden', 'true');
      host.style.display = 'none';
      document.body.appendChild(host);
    }

    (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit =
      () => {
        const g = (window as unknown as { google?: any }).google;
        new g.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,gu,hi', autoDisplay: false },
          'google_translate_element',
        );
      };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  private readCookieLang(): string {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (!match) return 'en';
    const parts = decodeURIComponent(match[1]).split('/'); // "/en/gu"
    return parts[2] || 'en';
  }

  /** Set (or clear) the googtrans cookie across host/domain variants. */
  private setCookieLang(code: string): void {
    const host = location.hostname;
    const kill = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `googtrans=; ${kill}; path=/${domain}`;
    }
    if (code !== 'en') {
      const value = `/en/${code}`;
      for (const domain of ['', `; domain=${host}`, `; domain=.${host}`]) {
        document.cookie = `googtrans=${value}; path=/${domain}`;
      }
    }
  }
}
