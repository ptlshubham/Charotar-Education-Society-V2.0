import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { catchError, of } from 'rxjs';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';
import { ResourcesService } from '../../../core/services/resources.service';
import { CustomSelect } from '../../../shared/custom-select/custom-select';
import { AlumniPayload } from '../../../shared/models/models';

/** The Alumni Meet is held every 13 January; this is the next one (today's, on the day itself). */
function nextMeetYear(now = new Date()): number {
  return now.getMonth() === 0 && now.getDate() <= 13 ? now.getFullYear() : now.getFullYear() + 1;
}

/**
 * Ported from the legacy alumni page: same fields, validators, institute list
 * (GET /admin/GetAllInstituteDetails) and payload keys (instituteName / alumniName /
 * alumniCourse / …), posted to the same POST /admin/SaveAlumniDetails.
 */
@Component({
  selector: 'app-alumni-form',
  imports: [ReactiveFormsModule, CustomSelect],
  templateUrl: './alumni-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-form.scss',
})
export class AlumniForm {
  private readonly successDialog = inject(SuccessDialogService);
  private readonly resources = inject(ResourcesService);

  form: FormGroup;
  submitting = false;
  errorMsg = '';

  /** Every CES institute - the same list as the e-Gate Pass form. */
  readonly institutes = signal<readonly string[]>([]);

  /** Current year back 100 years, matching the legacy dropdown. */
  readonly years: readonly number[] = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  readonly countries = Country.getAllCountries().map((c) => ({ name: c.name, iso: c.isoCode }));
  readonly countryNames = this.countries.map((country) => country.name);
  readonly states = signal<ReadonlyArray<{ name: string; iso: string; countryIso: string }>>([]);
  readonly cities = signal<readonly string[]>([]);

  readonly meetYear = nextMeetYear();

  /** Saved as `value` - the dashboard's alumni list shows it as-is. */
  readonly statuses: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Student', value: 'Student' },
    { label: 'Business', value: 'Business' },
    { label: 'Job', value: 'Job' },
    { label: 'Retired', value: 'Retired' },
    { label: 'Other (House wife, in search of opportunity, etc)', value: 'Other' },
  ];

  constructor(private fb: FormBuilder) {
    this.resources
      .getInstituteNames()
      .pipe(
        catchError(() => of<string[]>([])),
        takeUntilDestroyed(),
      )
      .subscribe((names) => this.institutes.set(names));

    this.form = this.fb.group({
      instituteName: ['', Validators.required],
      alumniName: ['', Validators.required],
      alumniCourse: ['', Validators.required],
      alumniYear: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
    });

    // Enable the dependent selects only once their option lists load. Driven through
    // the FormControl (not a template `[disabled]`) to avoid Angular's reactive-forms
    // "disabled attribute" warning.
    effect(() => {
      this.setEnabled('state', this.states().length > 0);
      this.setEnabled('city', this.cities().length > 0);
    });
  }

  private setEnabled(name: string, enabled: boolean): void {
    const ctrl = this.form.get(name);
    if (!ctrl) return;
    if (enabled && ctrl.disabled) ctrl.enable({ emitEvent: false });
    else if (!enabled && ctrl.enabled) ctrl.disable({ emitEvent: false });
  }

  get f() {
    return this.form.controls;
  }

  onCountryChange(name: string): void {
    const country = this.countries.find((c) => c.name === name);
    this.states.set(
      country
        ? State.getStatesOfCountry(country.iso).map((s) => ({
            name: s.name,
            iso: s.isoCode,
            countryIso: s.countryCode,
          }))
        : [],
    );
    this.cities.set([]);
    this.form.patchValue({ state: '', city: '' });
  }

  onStateChange(name: string): void {
    const state = this.states().find((s) => s.name === name);
    this.cities.set(
      state ? City.getCitiesOfState(state.countryIso, state.iso).map((c) => c.name) : [],
    );
    this.form.patchValue({ city: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMsg = '';

    // getRawValue: state/city stay disabled (and so out of .value) for a country without them.
    const v = this.form.getRawValue();
    const payload: AlumniPayload = {
      ...v,
      alumniYear: String(v.alumniYear),
      // A 0/1 column - "yes"/"no" would be rejected by MySQL's strict mode on the live server.
      status: v.status === 'yes' ? 1 : 0,
    };

    this.resources.saveAlumni(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res !== 'success') {
          this.errorMsg = 'We could not save your registration. Please check your details and try again.';
          return;
        }
        this.form.reset({ instituteName: '', alumniYear: '', country: '', state: '', city: '' });
        this.states.set([]);
        this.cities.set([]);

        this.successDialog.open({
          titleLead: 'Registration',
          titleAccent: 'received!',
          subtitle: 'Thank you for registering. Welcome to the CES alumni family.',
          infoTitle: "What's next?",
          infoText: 'Our team will verify your details and keep you posted on alumni events.',
          actions: [{ label: 'Close', primary: true }],
        });
      },
      error: () => {
        this.submitting = false;
        this.errorMsg = 'We could not send your registration just now. Please try again in a moment.';
      },
    });
  }
}
