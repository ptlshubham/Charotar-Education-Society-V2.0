import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { SuccessDialogService } from '../../../core/services/success-dialog.service';

/**
 * Ported from the legacy alumni page: same fields, validators and payload keys
 * (instituteName / alumniName / alumniCourse / …) so the existing
 * SaveAlumniDetails endpoint accepts it unchanged once it is wired up.
 */
@Component({
  selector: 'app-alumni-form',
  imports: [ReactiveFormsModule],
  templateUrl: './alumni-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './alumni-form.scss',
})
export class AlumniForm {
  private readonly successDialog = inject(SuccessDialogService);

  form: FormGroup;
  submitting = false;
  errorMsg = '';

  /**
   * TODO: replace with the live institute list (legacy site called
   * `getAllInstituteData()`); only one name could be verified from the old source.
   */
  readonly institutes: readonly string[] = ['M.B. Patel Applied Science College (Mogri)', 'Other'];

  /** Current year back 100 years, matching the legacy dropdown. */
  readonly years: readonly number[] = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  readonly countries = Country.getAllCountries().map((c) => ({ name: c.name, iso: c.isoCode }));
  readonly states = signal<ReadonlyArray<{ name: string; iso: string; countryIso: string }>>([]);
  readonly cities = signal<readonly string[]>([]);

  readonly statuses: readonly string[] = [
    'Student',
    'Business',
    'Job',
    'Retired',
    'Other (House wife, in search of opportunity, etc)',
  ];

  constructor(private fb: FormBuilder) {
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

    // TODO: POST to the SaveAlumniDetails endpoint once it exists on this API.
    // The form value already matches the legacy payload shape exactly.
    this.submitting = false;
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
  }
}
