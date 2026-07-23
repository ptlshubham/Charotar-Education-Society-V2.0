import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourcesService } from '../../../core/services/resources.service';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly resources = inject(ResourcesService);
  private readonly successDialog = inject(SuccessDialogService);

  contactForm: FormGroup;
  submitting = false;
  errorMsg = '';

  /** Google Maps embed for the Anand campus — a keyless place-query embed. */
  readonly mapEmbed: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    sanitizer: DomSanitizer,
  ) {
    this.mapEmbed = sanitizer.bypassSecurityTrustResourceUrl(
      'https://maps.google.com/maps?q=Charotar%20Education%20Society%20Anand&t=&z=15&ie=UTF8&iwloc=&output=embed',
    );
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
