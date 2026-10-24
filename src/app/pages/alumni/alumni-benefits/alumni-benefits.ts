import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LenisService } from '../../../core/services/lenis.service';

/** The Alumni Meet is held every 13 January; this is the next one (today's, on the day itself). */
function nextMeetYear(now = new Date()): number {
  return now.getMonth() === 0 && now.getDate() <= 13 ? now.getFullYear() : now.getFullYear() + 1;
}

/** "The CES Alumni Family" - the welcome, the next Alumni Meet, and what alumni get out of staying in touch. */
@Component({
  selector: 'app-alumni-benefits',
  imports: [RouterLink],
  templateUrl: './alumni-benefits.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-benefits.scss',
})
export class AlumniBenefits {
  private readonly lenis = inject(LenisService);

  readonly meetYear = nextMeetYear();

  /** `icon` is the path data of a 24×24 outline icon (Lucide / Tabler shapes). */
  readonly benefits: ReadonlyArray<{ title: string; desc: string; icon: readonly string[] }> = [
    {
      title: 'Stay Connected',
      desc: 'Reconnect with classmates and old friends.',
      icon: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    },
    {
      title: 'Give Back',
      desc: 'Support a student through the Rahatokarsh Fund.',
      icon: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
    },
    {
      title: 'Career Opportunities',
      desc: 'Discover job openings and career workshops at the Chatkaro skill fair.',
      icon: ['M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M2 13h8', 'M14 13h8', 'M10 11.5h4v3h-4z'],
    },
    {
      title: 'Alumni Meet',
      desc: 'Come home to Anand every 13 January.',
      icon: ['M5.8 11.3 2 22l10.7-3.79', 'M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z', 'M15 2.5v3', 'M20 4.5l-2.5 2.5', 'M21.5 9.5h-3'],
    },
  ];

  /**
   * "Register below": glide to the form, stopping at its scroll-margin so the sticky header
   * does not cover it (the router's anchor jump ignores scroll-margin). Modified clicks keep the link.
   */
  toRegister(e: MouseEvent): void {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const form = document.getElementById('alumni-register');
    if (!form) return;
    e.preventDefault();
    this.lenis.scrollTo(form);
    form.focus({ preventScroll: true });
  }
}
