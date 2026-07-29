import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { SuccessDialogService } from '../../core/services/success-dialog.service';
import { ResourcesService } from '../../core/services/resources.service';
import { GatePassPayload } from '../../shared/models/models';
import { HeroStat } from '../../shared/page-hero/page-hero';
import { CustomSelect } from '../../shared/custom-select/custom-select';
import { PLACEHOLDER } from '../../shared/placeholder-images';

// Values kept EXACTLY as the legacy backend stores them (including original
// spellings) so gate-pass records stay consistent with the old data.
const VISITOR_MEET = ['P.A to Secretary', 'Campus Direactive', 'Account Department', 'Estate / Maintance', 'Others'];
const STAFF_MEET = ['Secretary', ...VISITOR_MEET];

const PHONE = /^[0-9]{10,15}$/;

@Component({
  selector: 'app-gate-pass',
  imports: [ReactiveFormsModule, RouterLink, CustomSelect],
  templateUrl: './gate-pass.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gate-pass.scss',
})
export class GatePass {
  private readonly successDialog = inject(SuccessDialogService);
  private readonly resources = inject(ResourcesService);
  private readonly fb = inject(FormBuilder);

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
  readonly visitorMeetOptions = VISITOR_MEET;
  readonly staffMeetOptions = STAFF_MEET;

  /** Institute dropdown for the staff tab, fetched from the backend. */
  readonly institutes = signal<readonly string[]>([]);

  readonly visitorForm = this.fb.group({
    whomToMeet: ['', Validators.required],
    visitorName: ['', Validators.required],
    purpose: ['', Validators.required],
    contactNumber: ['', [Validators.required, Validators.pattern(PHONE)]],
  });

  readonly staffForm = this.fb.group({
    institute: ['', Validators.required],
    whomToMeet: ['', Validators.required],
    staffName: ['', Validators.required],
    purpose: ['', Validators.required],
    contactNumber: ['', [Validators.required, Validators.pattern(PHONE)]],
  });

  readonly submitting = signal(false);

  constructor() {
    this.resources
      .getInstitutes()
      .pipe(
        catchError(() => of([])),
        takeUntilDestroyed(),
      )
      .subscribe((list) => {
        // The backend list carries duplicate and test rows (e.g. two "E2E Sync
        // Inst"). Trim, drop blanks, de-duplicate case-insensitively, and sort so
        // the dropdown is clean and predictable. Genuine test entries still need
        // removing at the source.
        const seen = new Set<string>();
        const names = (Array.isArray(list) ? list : [])
          .map((i) => (i?.name ?? '').trim())
          .filter((name) => {
            const key = name.toLowerCase();
            if (!name || seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .sort((a, b) => a.localeCompare(b));
        this.institutes.set(names);
      });
  }

  get f() {
    return this.visitorForm.controls;
  }

  get sf() {
    return this.staffForm.controls;
  }

  selectTab(t: 'visitor' | 'staff'): void {
    this.tab.set(t);
  }

  onSubmit(role: 'Visitor' | 'Office'): void {
    const form = role === 'Visitor' ? this.visitorForm : this.staffForm;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    if (this.submitting()) return;
    this.submitting.set(true);

    const payload: GatePassPayload =
      role === 'Visitor'
        ? {
            role,
            name: this.visitorForm.value.visitorName!,
            purpose: this.visitorForm.value.purpose!,
            contact: this.visitorForm.value.contactNumber!,
            meetingWith: this.visitorForm.value.whomToMeet!,
          }
        : {
            role,
            institute: this.staffForm.value.institute!,
            name: this.staffForm.value.staffName!,
            purpose: this.staffForm.value.purpose!,
            contact: this.staffForm.value.contactNumber!,
            meetingWith: this.staffForm.value.whomToMeet!,
          };

    this.resources.saveGatePass(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        form.reset({ whomToMeet: '', ...(role === 'Office' ? { institute: '' } : {}) });
        this.successDialog.open({
          titleLead: 'Request',
          titleAccent: 'submitted!',
          subtitle: 'Your e-Gate Pass request has been sent to the CES Management Office.',
          infoTitle: "What's next?",
          infoText: 'You will receive a confirmation via email/SMS once your e-Gate Pass is approved.',
          actions: [{ label: 'Close', primary: true }],
        });
      },
      error: () => {
        this.submitting.set(false);
        this.successDialog.open({
          titleLead: '',
          titleAccent: 'Something went wrong',
          subtitle: 'We could not submit your e-Gate Pass request. Please check your details and try again.',
          actions: [{ label: 'Close', primary: true }],
        });
      },
    });
  }
}
