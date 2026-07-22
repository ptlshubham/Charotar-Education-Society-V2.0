import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { DISCLOSURE_POLICY_SECTIONS } from './disclosure-policy.data';

@Component({
  selector: 'app-disclosure-policy',
  imports: [LegalPage],
  templateUrl: './disclosure-policy.html',
  styleUrl: './disclosure-policy.scss',
})
export class DisclosurePolicy {
  readonly sections = DISCLOSURE_POLICY_SECTIONS;
  readonly intro =
    "We value the security community's efforts to keep ZarklyX safe. This Responsible Disclosure Policy explains how to report a security vulnerability to us and what you can expect when you do.";
}
