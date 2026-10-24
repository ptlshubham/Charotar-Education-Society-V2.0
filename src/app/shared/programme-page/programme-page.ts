import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdmissionsCta } from '../admissions-cta/admissions-cta';
import { PageHero } from '../page-hero/page-hero';
import { Programme, ProgrammeKind, ProgrammeSummary } from '../programme';
import { ProgrammeCard } from '../programme-card/programme-card';

/**
 * The page of one project or social activity: the story beside an "At a glance" box that stays
 * in view on desktop, published figures, what it offers, then three more to read. The route
 * components (project-detail, activity-detail) pick the item and set the page's meta.
 */
@Component({
  selector: 'app-programme-page',
  imports: [RouterLink, PageHero, ProgrammeCard, AdmissionsCta],
  templateUrl: './programme-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './programme-page.scss',
})
export class ProgrammePage {
  @Input({ required: true }) item!: Programme;
  @Input({ required: true }) kind!: ProgrammeKind;
  /** The item's group, e.g. "Technology" or "Camp": the banner's eyebrow. */
  @Input({ required: true }) group = '';
  @Input() more: readonly ProgrammeSummary[] = [];

  /** The main button: the item's own, or a question to the Society. */
  get action(): NonNullable<Programme['action']> {
    return this.item.action ?? { label: `Ask about this ${this.kind.noun}`, link: '/contact' };
  }

  telHref(phone: string): string {
    return `tel:${phone.replace(/[^0-9]/g, '')}`;
  }

  /** "www.performing.cesociety.in" for "https://www.performing.cesociety.in/". */
  host(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}
