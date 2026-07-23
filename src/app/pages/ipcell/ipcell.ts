import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Tab = 'about' | 'policy' | 'utility' | 'design' | 'copyrights' | 'trademarks' | 'forms';

@Component({
  selector: 'app-ipcell',
  templateUrl: './ipcell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ipcell.scss',
})
export class Ipcell {
  readonly tabs: ReadonlyArray<{ id: Tab; label: string; path: string[] }> = [
    { id: 'about', label: 'About IP Cell', path: ['m3 10 9-6 9 6', 'M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18'] },
    { id: 'policy', label: 'Policy', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M9 13h6M9 17h4'] },
    { id: 'utility', label: 'Utility Patent', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { id: 'design', label: 'Design Patent', path: ['m15 5 4 4', 'M13 7 3 17v4h4L17 11z', 'm16 4 4 4'] },
    { id: 'copyrights', label: 'Copyrights', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M14.8 9.5a3.5 3.5 0 1 0 0 5'] },
    { id: 'trademarks', label: 'Trademarks', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M7 9h10M12 9v7'] },
    { id: 'forms', label: 'Forms', path: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8M8 17h5'] },
  ];

  readonly active = signal<Tab>('about');

  select(id: Tab): void {
    this.active.set(id);
  }

  readonly focusAreas: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: 'Awareness', body: 'Create awareness about IPR & its importance.', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { title: 'Support', body: 'Assist in patent, design, copyright & trademark filings.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { title: 'Guidance', body: 'Provide expert guidance on IPR documentation & procedures.', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { title: 'Protection', body: 'Safeguard innovations and intellectual creations.', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
    { title: 'Commercialization', body: 'Encourage technology transfer & commercialization of innovations.', path: ['M3 3v18h18', 'm19 9-5 5-4-4-4 4'] },
    { title: 'Collaboration', body: 'Promote collaborations with industry, startups & institutions.', path: ['m11 17 2 2a1 1 0 1 0 3-3', 'm14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2.8 2.8 0 0 1 4 0l4 4', 'M3 7l4-4 4 4'] },
  ];

  readonly counts: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '24+', label: 'Utility Patents', path: ['M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'] },
    { value: '16+', label: 'Design Patents', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'] },
    { value: '10+', label: 'Trademarks', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M7 9h10M12 9v7'] },
    { value: '8+', label: 'Copyrights', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M14.8 9.5a3.5 3.5 0 1 0 0 5'] },
  ];

  readonly notices: readonly string[] = [
    'All innovations must be disclosed to IP Cell.',
    'Do not publish your idea before filing.',
    'Use the disclosure forms for submissions.',
    'For any queries, contact the IP Cell.',
  ];

  readonly filings: ReadonlyArray<{
    title: string;
    category: string;
    application: string;
    date: string;
    status: 'Published' | 'Under Examination' | 'Registered';
  }> = [
    { title: 'Smart Irrigation System Using IoT', category: 'Utility Patent', application: '202421012345', date: 'May 12, 2024', status: 'Published' },
    { title: 'Eco-Friendly Water Purifier', category: 'Utility Patent', application: '202421012346', date: 'May 18, 2024', status: 'Under Examination' },
    { title: 'Foldable Solar Dryer', category: 'Utility Patent', application: '202421012347', date: 'May 25, 2024', status: 'Published' },
    { title: 'Portable Hand Sanitizer Dispenser', category: 'Design Patent', application: '362567-001', date: 'Jun 02, 2024', status: 'Registered' },
    { title: 'Multipurpose Study Table', category: 'Design Patent', application: '362567-002', date: 'Jun 10, 2024', status: 'Under Examination' },
    { title: 'CES Logo', category: 'Trademark', application: '5987654', date: 'Jun 15, 2024', status: 'Registered' },
  ];

  statusClass(status: string): string {
    switch (status) {
      case 'Published':
        return 'bg-accent/10 text-accent';
      case 'Registered':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-secondary/15 text-secondary-dark';
    }
  }
}
