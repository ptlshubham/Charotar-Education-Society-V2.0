import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { COOKIE_POLICY_SECTIONS } from './cookie-policy.data';

@Component({
  selector: 'app-cookie-policy',
  imports: [LegalPage],
  templateUrl: './cookie-policy.html',
  styleUrl: './cookie-policy.scss',
})
export class CookiePolicy {
  readonly sections = COOKIE_POLICY_SECTIONS;
  readonly intro =
    'This Cookie Policy explains what cookies are, how ZarklyX uses them on our website and platform, and how you can manage your preferences. It should be read together with our <a href="/support/privacy-policy">Privacy Policy</a>.';
}
