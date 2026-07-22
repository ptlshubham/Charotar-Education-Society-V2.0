import { Component, ChangeDetectionStrategy } from '@angular/core';

interface ServiceStatus {
  name: string;
  description: string;
  icon: string;
  status: 'Operational';
  detail: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-system-status',
  templateUrl: './system-status.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './system-status.scss',
})
export class SystemStatus {
  readonly lastUpdated = 'May 12, 2026 • 10:30 AM IST';

  services: ServiceStatus[] = [
    {
      name: 'Web Application',
      description: 'Dashboard, login, and core app experience',
      icon: 'globe',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.99%.',
      isOpen: false,
    },
    {
      name: 'API',
      description: 'Public and internal API services',
      icon: 'code',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.98%.',
      isOpen: false,
    },
    {
      name: 'Social Media Publishing',
      description: 'Scheduling and publishing to connected platforms',
      icon: 'megaphone',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.97%.',
      isOpen: false,
    },
    {
      name: 'Third-Party Integrations',
      description: 'Google, Meta, LinkedIn, Dropbox, and other connections',
      icon: 'link',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.95%.',
      isOpen: false,
    },
    {
      name: 'Cloud Storage',
      description: 'File uploads, storage, and downloads',
      icon: 'cloud',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.99%.',
      isOpen: false,
    },
    {
      name: 'Reports & Analytics',
      description: 'Dashboards, insights, and reporting',
      icon: 'chart',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.98%.',
      isOpen: false,
    },
    {
      name: 'Notifications & Email',
      description: 'In-app notifications and transactional email',
      icon: 'bell',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.96%.',
      isOpen: false,
    },
    {
      name: 'Billing & Payments',
      description: 'Subscriptions, invoices, and payment processing',
      icon: 'card',
      status: 'Operational',
      detail: 'No incidents reported in the last 90 days. Uptime 99.99%.',
      isOpen: false,
    },
  ];

  /** True when every service above is operational. */
  get allOperational(): boolean {
    return this.services.every((s) => s.status === 'Operational');
  }

  toggle(index: number): void {
    this.services[index].isOpen = !this.services[index].isOpen;
  }
}
