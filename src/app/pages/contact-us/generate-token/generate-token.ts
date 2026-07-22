import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResourcesService } from '../../../core/services/resources.service';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';

@Component({
  selector: 'app-generate-token',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './generate-token.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './generate-token.scss',
})
export class GenerateToken {
  private readonly resources = inject(ResourcesService);
  private readonly successDialog = inject(SuccessDialogService);

  contactForm: FormGroup;

  submitting = false;
  errorMsg = '';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMsg = '';

    this.resources.submitContactForm(this.contactForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.contactForm.reset({ subject: '' });
        this.successDialog.open({
          titleLead: 'Message',
          titleAccent: 'sent!',
          subtitle:
            'Thank you for contacting us. Our team will get back to you as soon as possible.',
          infoTitle: "What's next?",
          infoText: 'You will receive a confirmation email shortly with your message details.',
          actions: [{ label: 'Close', primary: true }],
        });
      },
      error: (err: any) => {
        this.submitting = false;
        this.errorMsg = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
