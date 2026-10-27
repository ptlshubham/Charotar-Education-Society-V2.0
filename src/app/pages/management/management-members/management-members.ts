import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormerBearers } from '../former-bearers/former-bearers';
import { Reveal } from '../../../shared/reveal.directive';

interface Member {
  name: string;
  role: string;
  photo: string;
}

/** Real portraits live in public/assets/images/directors - spaces are URL-encoded. */
const DIR = '/assets/images/directors';

@Component({
  selector: 'app-management-members',
  imports: [FormerBearers, Reveal, NgClass],
  templateUrl: './management-members.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './management-members.scss',
})
export class ManagementMembers {
  // Designations carried over verbatim from the legacy site's management page -
  // the earlier port had flattened every member to "Managing Committee Member".
  readonly members: readonly Member[] = [
    { name: 'Shri Vijay Patel', role: 'Chairman, Anand District Cricket Association · Ex. President, Anand Nagar Palika', photo: `${DIR}/Vijaybhai.webp` },
    { name: 'Shri Vinod Parmar', role: 'College Administrator', photo: `${DIR}/Vinodbhai.webp` },
    { name: 'Dr. Uday Vora', role: 'Doctor', photo: `${DIR}/Udaybhai.webp` },
    { name: 'Shri Dipen Patel', role: 'Counsellor, Anand Nagar Palika · Businessman', photo: `${DIR}/Dipenbhai.webp` },
    { name: 'Shri Ketan Patel', role: 'Engineer and Builder', photo: `${DIR}/Ketanbhai.webp` },
    { name: 'Shri Shailesh Patel', role: 'Advocate · Senate Member of Sardar Patel University', photo: `${DIR}/Shaileshbhai.webp` },
    { name: 'Shri Kalpesh Patel', role: 'BJP Mahamantri, Vadodara District', photo: `${DIR}/Kalpeshbhai.webp` },
    { name: 'Shri Chirag Patel', role: 'Businessman', photo: `${DIR}/chirag.webp` },
    { name: 'Shri Pragnesh Patel', role: 'Senate Member of Sardar Patel University · Ex. President, Anand Nagar Palika', photo: `${DIR}/Pragneshbhai.webp` },
    { name: 'Shri Hemant Patel', role: 'Member of Advisory Committee, Charotar Gas', photo: `${DIR}/Hemantbhai.webp` },
    { name: 'Shri Swetal Patel', role: 'Secretary, Anand District Cricket Association · Ex. Counsellor, Anand Nagar Palika', photo: `${DIR}/Swetalbhai.webp` },
    { name: 'Shri Samir Patel', role: 'Businessman', photo: `${DIR}/Samirbhai.webp` },
    { name: 'Shri Pinal Patel', role: 'Businessman', photo: `${DIR}/Pinalbhai.webp` },
    { name: 'Shri Sandip Patel', role: 'Businessman', photo: `${DIR}/SandipPatel.webp` },
    { name: 'Shri Jay Patel', role: 'Businessman and Lawyer', photo: `${DIR}/Jay.webp` },
  ];

  /** Which member card has its designation expanded, by name. */
  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  /** Whether all members are shown on mobile. */
  readonly showAllMobile = signal(false);

  isExpanded(name: string): boolean {
    return this.expanded().has(name);
  }

  toggle(name: string): void {
    const next = new Set(this.expanded());
    next.has(name) ? next.delete(name) : next.add(name);
    this.expanded.set(next);
  }
}
