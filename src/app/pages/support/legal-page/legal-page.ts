import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface LegalSection {
  title: string;
  content: string;
  isOpen?: boolean;
  icon?: string;
}

/**
 * Shared presentational layout for all legal / policy pages
 * (terms, privacy, cookies, refunds, etc.). Feed it copy + sections;
 * it renders the hero, the numbered accordion, and the help CTA.
 */
@Component({
  selector: 'app-legal-page',
  imports: [NgClass, RouterLink],
  templateUrl: './legal-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './legal-page.scss',
})
export class LegalPage {
  @Input() badge = 'Legal';
  @Input() title = '';
  @Input() titleAccent = '';
  /** Intro paragraph  may contain inline HTML (links, emphasis). */
  @Input() intro = '';
  @Input() sections: LegalSection[] = [];
  @Input() heroImage = '/assets/images/temp.png';

  /** Optional extra button under the intro (e.g. "Submit an Opt-Out Request"). */
  @Input() heroCtaText = '';
  @Input() heroCtaLink = '';

  @Input() ctaTitle = 'Need help understanding these terms?';
  @Input() ctaText = 'If you have any questions, our legal team is here to help.';
  @Input() ctaButtonText = 'Contact Us';
  @Input() ctaButtonLink = '/contact';

  /** Cycle of neutral icons so each row gets a distinct glyph like the design. */
  private readonly iconCycle = [
    'doc',
    'list',
    'user',
    'card',
    'shield',
    'folder',
    'puzzle',
    'copyright',
    'lock',
    'cloud',
    'ban',
    'alert',
  ];

  iconFor(section: LegalSection, index: number): string {
    return section.icon ?? this.iconCycle[index % this.iconCycle.length];
  }

  toggle(index: number): void {
    this.sections[index].isOpen = !this.sections[index].isOpen;
  }
}
