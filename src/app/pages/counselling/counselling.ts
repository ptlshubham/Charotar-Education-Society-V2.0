import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHero } from '../../shared/page-hero/page-hero';
import { CustomSelect } from '../../shared/custom-select/custom-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ResourcesService } from '../../core/services/resources.service';
import { CounsellingPayload, Institute } from '../../shared/models/models';

/** Feather-style 24×24 stroke paths for the page's line icons. */
const ICON = {
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  user: ['M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  heart: ['M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  chat: ['M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5h.5a8.5 8.5 0 0 1 8 8z'],
  calendar: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'],
} as const;

@Component({
  selector: 'app-counselling',
  imports: [ReactiveFormsModule, PageHero, CustomSelect],
  templateUrl: './counselling.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './counselling.scss',
})
export class Counselling {
  private readonly fb = inject(FormBuilder);
  private readonly resources = inject(ResourcesService);
  private readonly document = inject(DOCUMENT);

  readonly hero = '/assets/images/hero/counselling.webp';
  // TODO: a photo of Dr. Jani from CES - until then the card shows the outline user icon, not a stock face.
  readonly counsellorPhoto: string | null = null;

  readonly assurances: ReadonlyArray<{ title: string; body: string; icon: readonly string[] }> = [
    { title: 'Privacy respected', body: 'A supportive space to talk', icon: ICON.shield },
    { title: 'Professional support', body: 'Guidance from a certified psychologist', icon: ICON.user },
    { title: 'Free for CES students', body: 'No counselling fees', icon: ICON.heart },
    { title: 'Online or on campus', body: 'Choose a convenient session format', icon: ICON.clock },
  ];

  /** What students most often come to talk about. */
  readonly topics: readonly string[] = [
    'Stress & academic pressure',
    'Relationships & personal challenges',
    'Emotional well-being',
    'Personal growth',
  ];

  readonly usersIcon = ICON.users;
  readonly userIcon = ICON.user;

  readonly benefits: readonly string[] = [
    'Reduces stress and anxiety',
    'Improves self-awareness and confidence',
    'Better relationships and communication',
    'Helps you make healthier decisions',
    'Supports academic and personal growth',
  ];

  /** Topics students can raise - carried over from the legacy counselling page. */
  readonly talkAbout: readonly string[] = [
    'Exam stress & performance anxiety',
    'Career confusion – “What should I do after this?”',
    'Feeling sad, unmotivated, or low',
    'Relationship or adjustment struggles',
    'Puberty, peer adjustment or bullying issues',
    'Loss and grief',
    'Depression, anxiety, eating disorder',
    'Or just… anything on your mind - no problem is “too small.”',
  ];

  readonly counsellorInfo = {
    name: 'Dr. Jigar (Jignesh) Jani',
    role: 'Counselling Psychologist',
    bio: 'Dr. Jigar (Jignesh) Jani and his team offer a private, flexible and non-judgmental space to talk through exam stress, career confusion and personal challenges.',
    facts: [
      { text: 'Leads the CES Campus Counselling Program', icon: ICON.users },
      { text: 'Works with students and young people', icon: ICON.user },
      { text: 'One-to-one support', icon: ICON.chat },
      { text: 'On-campus and online sessions', icon: ICON.calendar },
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

  ];

  /** In-page links to the form and the programme (a plain #book would resolve against the base href). */
  jump(event: Event, id: string): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** The first answer starts open, so the list reads as an accordion at a glance. */
  readonly openFaq = signal(0);

  toggleFaq(i: number): void {
    this.openFaq.update((v) => (v === i ? -1 : i));
  }

  // ── Booking form ──
  readonly WHATSAPP = 'https://wa.me/919426009495';

  readonly institutes = signal<readonly Institute[]>([]);
  readonly instituteNames = computed(() => this.institutes().map(i => i.name));
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
