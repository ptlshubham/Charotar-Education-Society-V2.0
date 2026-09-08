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

  /** Load Google's translate element once, hidden — it applies the cookie on load. */
  private injectGoogleTranslate(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (document.getElementById('google-translate-script')) return;

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
