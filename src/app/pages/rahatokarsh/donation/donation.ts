import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-donation',
  imports: [DecimalPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './donation.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './donation.scss',
})
export class Donation {
  private readonly successDialog = inject(SuccessDialogService);

  readonly heroImage = PLACEHOLDER.social.heroCollage[0];
  readonly aboutImage = PLACEHOLDER.about.whoWeAre;

  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '2,500+', label: 'Students Supported', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '₹1.8 Cr+', label: 'Total Donations Received', path: ['M6 3h12M6 8h12M6 13h5a5 5 0 0 0 0-10M6 13l8 8'] },
    { value: '150+', label: 'Donors & Well Wishers', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '4', label: 'Institutions Benefited', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2M9 11h2M13 11h2'] },
    { value: 'Since 2015', label: 'Continuing the Legacy', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
  ];

  readonly points: readonly string[] = [
    'Support for tuition fees, books, and educational expenses',
    'Help for economically weaker and deserving students',
    'Transparent fund management and proper utilization',
    'Building a stronger, educated, and empowered society',
  ];

  readonly bank: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Bank Name', value: 'State Bank of India' },
    { label: 'Branch', value: 'Sardar Gunj Branch, Anand' },
    { label: 'Account Name', value: 'Rahatokarsh Fee Fund' },
    { label: 'Account No.', value: '66016425223' },
    { label: 'IFSC Code', value: 'SBIN0060137' },
  ];

  readonly presets: readonly number[] = [100, 500, 1000, 5000];

  readonly raised = 1845000;
  readonly goal = 25000000;
  readonly progress = computed(() => Math.round((this.raised / this.goal) * 100));

  readonly voices: ReadonlyArray<{ quote: string; name: string; role: string; photo: string }> = [
    {
      quote:
        'Thanks to the support from Rahatokarsh Fund, I could continue my education and achieve my dream of becoming an engineer.',
      name: 'Hetal Patel',
      role: 'Engineering Student',
      photo: PLACEHOLDER.celebration.voices[0],
    },
    {
      quote: 'The financial help came at the right time. I am grateful to the donors for believing in students like me.',
      name: 'Ravi Kumar',
      role: 'B.Sc. Student',
      photo: PLACEHOLDER.celebration.voices[1],
    },
    {
      quote: 'This fund not only helps financially but also gives us the confidence to aim higher in life.',
      name: 'Nisha Parmar',
      role: 'M.Com. Student',
      photo: PLACEHOLDER.celebration.voices[2],
    },
  ];

  form: FormGroup;
  submitting = false;
  readonly customAmount = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      city: ['', Validators.required],
      amount: [500, [Validators.required, Validators.min(10)]],
      taxBenefit: [false],
    });
  }

  get f() {
    return this.form.controls;
  }

  choose(amount: number): void {
    this.customAmount.set(false);
    this.form.patchValue({ amount });
  }

  chooseOther(): void {
    this.customAmount.set(true);
    this.form.patchValue({ amount: null });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: hand off to the payment gateway (legacy site used Razorpay checkout).
    this.successDialog.open({
      titleLead: 'Thank',
      titleAccent: 'you!',
      subtitle: 'Your donation to the Rahatokarsh Fund helps a deserving student continue their education.',
      infoTitle: "What's next?",
      infoText: 'You will receive a receipt by email once the payment is confirmed.',
      actions: [{ label: 'Close', primary: true }],
    });
  }
}
