import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { BETA_POLICY_SECTIONS } from './beta-policy.data';

@Component({
  selector: 'app-beta-policy',
  imports: [LegalPage],
  templateUrl: './beta-policy.html',
  styleUrl: './beta-policy.scss',
})
export class BetaPolicy {
  readonly sections = BETA_POLICY_SECTIONS;
  readonly intro =
    'ZarklyX is currently available as a beta release. This Beta Program Policy explains what that means for you and, most importantly, what happens to your data: <strong>everything you create in the Beta Portal is temporary, will be deleted when the beta ends, and cannot be migrated into the production version of ZarklyX.</strong> Please use the Beta Portal to explore and evaluate the platform  not to run your live business.';
}
