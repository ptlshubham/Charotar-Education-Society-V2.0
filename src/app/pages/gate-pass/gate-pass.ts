import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuccessDialogService } from '../../core/services/success-dialog.service';
import { HeroStat } from '../../shared/page-hero/page-hero';
import { PLACEHOLDER } from '../../shared/placeholder-images';

@Component({
  selector: 'app-gate-pass',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './gate-pass.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gate-pass.scss',
})
export class GatePass {
  private readonly successDialog = inject(SuccessDialogService);

  readonly banner = PLACEHOLDER.about.hero;

  readonly stats: readonly HeroStat[] = [
    { value: '110+', label: 'Years of Legacy', path: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'] },
    { value: '31+', label: 'Institutes', path: ['M3 21h18', 'M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16', 'M9 7h2M13 7h2'] },
    { value: '25K+', label: 'Students', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { value: '1000+', label: 'Faculty', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '50+', label: 'Programs', path: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'] },
    { value: '160+', label: 'Research Projects', path: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'] },
  ];

  readonly tab = signal<'visitor' | 'staff'>('visitor');

  selectTab(t: 'visitor' | 'staff'): void {
    this.tab.set(t);
  }

  /** TODO: replace with the management-office directory. */
  readonly people: readonly string[] = ['Chairman', 'Secretary', 'Administrative Officer', 'Accounts Department'];

  form: FormGroup;
  submitting = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      whomToMeet: ['', Validators.required],
      visitorName: ['', Validators.required],
      purpose: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: POST to the e-Gate Pass endpoint once it exists on this API.
    this.form.reset({ whomToMeet: '' });
    this.successDialog.open({
      titleLead: 'Request',
      titleAccent: 'submitted!',
      subtitle: 'Your e-Gate Pass request has been sent to the management office.',
      infoTitle: "What's next?",
      infoText: 'You will receive a confirmation via email/SMS once your e-Gate Pass is approved.',
      actions: [{ label: 'Close', primary: true }],
    });
  }
}
