import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
import { CounsellingPayload, Institute } from '../../shared/models/models';
import { PLACEHOLDER } from '../../shared/placeholder-images';

@Component({
  selector: 'app-counselling',
  imports: [ReactiveFormsModule],
  templateUrl: './counselling.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './counselling.scss',
})
export class Counselling {
  private readonly fb = inject(FormBuilder);
  private readonly resources = inject(ResourcesService);

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

  /** Topics students can raise — carried over from the legacy counselling page. */
  readonly talkAbout: readonly string[] = [
    'Exam stress & performance anxiety',
    'Career confusion – “What should I do after this?”',
    'Feeling sad, unmotivated, or low',
    'Relationship or adjustment struggles',
    'Puberty, peer adjustment or bullying issues',
    'Loss and grief',
    'Depression, anxiety, eating disorder',
    'Or just… anything on your mind — no problem is “too small.”',
  ];

  readonly counsellorInfo = {
    name: 'Dr. Jigar (Jignesh) Jani',
    role: 'Counselling Psychologist',
    bio: 'Dr. Jigar (Jignesh) Jani and his team offer a private, flexible and non-judgmental space to help you navigate life’s challenges — from exam stress and career confusion to anxiety and low mood.',
    facts: [
      'Counselling Psychologist',
      'Leads the CES Campus Counselling Program',
      'Experienced in working with students and young people',
      'Sessions available in person on campus or online',
    ],
  };

  /** Real questions and answers ported from the legacy counselling page. */
  readonly faqs: ReadonlyArray<{ q: string; a: string }> = [
    { q: 'Is it really free?', a: 'Yes, all sessions under the Campus Counselling Program are completely free for students.' },
    { q: 'Will my sessions be confidential?', a: 'Absolutely. Everything you share stays strictly between you and the counsellor. No parents, teachers, or friends will be informed unless you explicitly ask for it or there’s a serious safety concern that requires intervention (in which case, this would be discussed with you first).' },
    { q: 'What are the benefits of counselling?', a: 'Counselling can help you manage stress and emotions more effectively, gain clarity for career or personal decisions, express thoughts and feelings you might not be able to share elsewhere, learn coping tools for anxiety, low mood or overthinking, and boost confidence, self-awareness and peace of mind.' },
    { q: 'How will the counselling happen?', a: 'Sessions typically take place one-on-one with your counsellor, either in person on campus or sometimes online, depending on mutual convenience and availability. Your counsellor will discuss the best format with you when you book your session.' },
    { q: 'Who will I talk to?', a: 'You’ll talk to Dr. Jigar Jani and his team of qualified and experienced Counselling Psychologists. They have extensive experience working with young people and are here to help and support you, not to judge.' },
    { q: 'What if I can’t put it into words?', a: 'That’s perfectly okay! You don’t need to have all the answers or a clear problem statement. Just come with what you’re feeling or thinking. Figuring things out together is a core part of what counselling is for.' },
    { q: 'Will it actually help?', a: 'Most students report feeling lighter, clearer, and more in control after just a few sessions. While it’s not a magic fix, it’s a strong and proactive step toward real personal growth and positive change.' },
    { q: 'What if I’m nervous to try?', a: 'It’s completely normal to feel nervous when trying something new, especially counselling. You don’t have to go through tough times alone — help is here for you. Even if nothing feels “wrong”, a confidential conversation can bring unexpected clarity and support.' },
  ];

  readonly openFaq = signal(-1);

  toggleFaq(i: number): void {
    this.openFaq.update((v) => (v === i ? -1 : i));
  }

  // ── Booking form ──
  readonly WHATSAPP = 'https://wa.me/919426009495';

  readonly institutes = signal<readonly Institute[]>([]);
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly failed = signal(false);

  readonly form = this.fb.group({
    instituteName: ['', Validators.required],
    name: ['', Validators.required],
    division: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+()\-\s]{7,20}$/)]],
    message: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  constructor() {
    this.resources
      .getInstitutes()
      .pipe(catchError(() => of<Institute[]>([])), takeUntilDestroyed())
      .subscribe((list) => this.institutes.set(Array.isArray(list) ? list : []));
  }

  submit(): void {
    this.submitted.set(true);
    this.failed.set(false);
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.resources.saveCounseling(this.form.getRawValue() as CounsellingPayload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.failed.set(true);
      },
    });
  }

  bookAnother(): void {
    this.success.set(false);
    this.submitted.set(false);
    this.form.reset({ instituteName: '', name: '', division: '', email: '', phone: '', message: '' });
  }
}
