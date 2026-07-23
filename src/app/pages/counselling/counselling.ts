import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../shared/placeholder-images';

@Component({
  selector: 'app-counselling',
  imports: [RouterLink],
  templateUrl: './counselling.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './counselling.scss',
})
export class Counselling {
  readonly hero = PLACEHOLDER.counselling.hero;
  readonly counsellor = PLACEHOLDER.counselling.counsellor;

  readonly assurances: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    { title: '100% Confidential', body: 'Your privacy is our priority.', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
    { title: 'Professional Support', body: 'Guidance by certified psychologist.', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'] },
    { title: 'Free for Students', body: 'Completely free of cost.', path: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'] },
    { title: 'Easy & Accessible', body: 'Online / In-person sessions available.', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'] },
  ];

  readonly points: readonly string[] = [
    'For students of all institutes under CES',
    'One-on-one counselling sessions',
    'Personal and academic concerns',
    'Emotional well-being and personal growth',
  ];

  readonly benefits: readonly string[] = [
    'Reduces stress and anxiety',
    'Improves self-awareness and confidence',
    'Better relationships and communication',
    'Helps you make healthier decisions',
    'Supports academic and personal growth',
  ];

  readonly counsellorInfo = {
    name: 'Dr. Jigyaben Jani',
    role: 'Certified Psychologist & Counselling Expert',
    bio: 'With years of experience in student counselling, Dr. Jigyaben Jani provides a safe, empathetic and non-judgmental approach to help you navigate life\'s challenges.',
    facts: [
      'M.A., M.Phil., Ph.D. in Psychology',
      'Certified Counselling Psychologist',
      'Specialization: Student Mental Health, Stress Management, Anxiety, Relationships',
      'Years of Experience: 15+',
    ],
  };

  readonly faqs: readonly string[] = [
    'Is the counselling service really free?',
    'Is my conversation confidential?',
    'Who can take counselling?',
    'How can I book an appointment?',
    'What issues can I talk about?',
    'Where are the counselling sessions held?',
    'How long is each counselling session?',
    'Can I take more than one session?',
  ];

  readonly openFaq = signal(-1);

  toggleFaq(i: number): void {
    this.openFaq.update((v) => (v === i ? -1 : i));
  }
}
