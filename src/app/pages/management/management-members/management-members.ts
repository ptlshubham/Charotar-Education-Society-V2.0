import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormerBearers } from '../former-bearers/former-bearers';

interface Member {
  name: string;
  role: string;
  photo: string;
}

/** Real portraits live in public/assets/images/directors — spaces are URL-encoded. */
const DIR = '/assets/images/directors';

@Component({
  selector: 'app-management-members',
  imports: [FormerBearers],
  templateUrl: './management-members.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './management-members.scss',
})
export class ManagementMembers {
  readonly members: readonly Member[] = [
    { name: 'Shri Vijay Patel', role: 'Managing Committee Member', photo: `${DIR}/Vijaybhai.png` },
    { name: 'Shri Vinod Parmar', role: 'Managing Committee Member', photo: `${DIR}/Vinodbhai.png` },
    { name: 'Dr. Uday Vora', role: 'Managing Committee Member', photo: `${DIR}/Udaybhai.png` },
    { name: 'Shri Dipen Patel', role: 'Managing Committee Member', photo: `${DIR}/Dipenbhai.png` },
    { name: 'Shri Ketan Patel', role: 'Managing Committee Member', photo: `${DIR}/Ketanbhai.png` },
    { name: 'Shri Shailesh Patel', role: 'Managing Committee Member', photo: `${DIR}/Shaileshbhai.png` },
    { name: 'Shri Kalpesh Patel', role: 'Managing Committee Member', photo: `${DIR}/Kalpeshbhai.png` },
    { name: 'Shri Chirag Patel', role: 'Managing Committee Member', photo: `${DIR}/Chirag%20bhayo.png` },
    { name: 'Shri Pragnesh Patel', role: 'Managing Committee Member', photo: `${DIR}/Pragneshbhai.png` },
    { name: 'Shri Hemant Patel', role: 'Managing Committee Member', photo: `${DIR}/Hemantbhai%20Sanubhai.png` },
    { name: 'Shri Swetal Patel', role: 'Managing Committee Member', photo: `${DIR}/Swetalbhai.png` },
    { name: 'Shri Samir Patel', role: 'Managing Committee Member', photo: `${DIR}/Samirbhai.png` },
    { name: 'Shri Pinal Patel', role: 'Managing Committee Member', photo: `${DIR}/Pinalbhai.png` },
    { name: 'Shri Sandip Patel', role: 'Managing Committee Member', photo: `${DIR}/SandipPatel.png` },
    { name: 'Shri Jay Patel', role: 'Managing Committee Member', photo: `${DIR}/Jay.jpg` },
  ];

  /** Which member card has its designation expanded, by name. */
  private readonly expanded = signal<ReadonlySet<string>>(new Set());

  isExpanded(name: string): boolean {
    return this.expanded().has(name);
  }

  toggle(name: string): void {
    const next = new Set(this.expanded());
    next.has(name) ? next.delete(name) : next.add(name);
    this.expanded.set(next);
  }
}
