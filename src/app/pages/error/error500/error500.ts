import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error500',
  imports: [RouterLink],
  templateUrl: './error500.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './error500.scss',
})
export class Error500 {
  constructor(private readonly location: Location) {}

  readonly helpfulLinks: ReadonlyArray<{
    icon: string;
    title: string;
    desc: string;
    cta: string;
    route: string;
  }> = [
    {
      icon: 'book',
      title: 'Help Center',
      desc: 'Find answers to common questions',
      cta: 'Visit Help Center',
      route: '/support',
    },
    {
      icon: 'monitor',
      title: 'System Status',
      desc: 'Check our system status and uptime',
      cta: 'View Status',
      route: '/support/system-status',
    },
    {
      icon: 'mail',
      title: 'Contact Support',
      desc: 'Our team is here to help you',
      cta: 'Contact Us',
      route: '/contact',
    },
    {
      icon: 'doc',
      title: 'Documentation',
      desc: 'Browse our guides and documentation',
      cta: 'View Docs',
      route: '/support/tutorials',
    },
  ];

  goBack(): void {
    this.location.back();
  }
}
