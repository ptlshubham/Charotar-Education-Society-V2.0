import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error404',
  imports: [RouterLink],
  templateUrl: './error404.html',
  styleUrl: './error404.scss',
})
export class Error404 {
  constructor(private readonly location: Location) {}

  readonly helpfulLinks: ReadonlyArray<{ icon: string; title: string; desc: string; cta: string; route: string }> = [
    { icon: 'grid', title: 'All Features', desc: 'Explore all powerful features ZarklyX has to offer.', cta: 'Explore Features', route: '/solutions' },
    { icon: 'layers', title: 'Integrations', desc: 'Connect ZarklyX with your favorite tools.', cta: 'View Integrations', route: '/integrations' },
    { icon: 'book', title: 'Help Center', desc: 'Browse guides and get answers to common questions.', cta: 'Visit Help Center', route: '/support' },
    { icon: 'headset', title: 'Contact Support', desc: 'Our team is here to help you succeed with ZarklyX.', cta: 'Contact Us', route: '/contact' },
  ];

  goBack(): void {
    this.location.back();
  }
}
