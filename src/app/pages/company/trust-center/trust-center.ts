import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PolicyLink {
  icon: string;
  label: string;
  route: string | null;
}

@Component({
  selector: 'app-trust-center',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './trust-center.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './trust-center.scss',
})
export class TrustCenter {
  /** "How we earn your trust" cards */
  readonly trustCards: ReadonlyArray<{ icon: string; title: string; desc: string }> = [
    {
      icon: 'lock',
      title: 'Data Security',
      desc: 'Advanced encryption, regular vulnerability scans, and proactive threat detection.',
    },
    {
      icon: 'shield',
      title: 'Privacy First',
      desc: 'We collect only what we need and never sell your data. Ever.',
    },
    {
      icon: 'cloud',
      title: 'High Availability',
      desc: 'Built for reliability with 99.9% uptime and automatic failover.',
    },
    {
      icon: 'medal',
      title: 'Compliance',
      desc: 'GDPR ready and aligned with SOC 2 and other globally recognized standards.',
    },
    {
      icon: 'database',
      title: 'Data Ownership',
      desc: 'You own your data. Export anytime or delete it permanently.',
    },
    {
      icon: 'users',
      title: 'Transparency',
      desc: 'We are open about our policies, practices, and performance.',
    },
  ];

  /** Certification badges */
  readonly certifications: ReadonlyArray<{ abbr: string; name: string; status: string }> = [
    { abbr: 'SOC 2', name: 'SOC 2 Type II', status: 'In Progress' },
    { abbr: 'GDPR', name: 'GDPR', status: 'Ready' },
    { abbr: 'ISO', name: 'ISO/IEC 27001', status: 'In Progress' },
    { abbr: 'AWS', name: 'AWS', status: 'Infrastructure' },
    { abbr: 'SSL', name: 'SSL/TLS', status: 'Encrypted' },
  ];

  /** System status stats */
  readonly statusStats: ReadonlyArray<{ value: string; label: string }> = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '24/7', label: 'Monitoring' },
    { value: '< 30 min', label: 'Incident Response' },
    { value: '100%', label: 'Data Backup Daily' },
  ];

  readonly policyLinksLeft: PolicyLink[] = [
    { icon: 'shield', label: 'Privacy Policy', route: '/support/privacy-policy' },
    { icon: 'doc', label: 'Terms of Service', route: '/support/terms-of-service' },
    { icon: 'database', label: 'Data Processing Agreement', route: null },
  ];

  readonly policyLinksRight: PolicyLink[] = [
    { icon: 'lock', label: 'Security Whitepaper', route: null },
    { icon: 'users', label: 'Sub-processor List', route: null },
    { icon: 'flag', label: 'Responsible Disclosure', route: '/support/disclosure-policy' },
  ];
}
