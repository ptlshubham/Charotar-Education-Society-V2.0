import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error404',
  imports: [RouterLink],
  templateUrl: './error404.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './error404.scss',
})
export class Error404 {
  constructor(private readonly location: Location) {}

  readonly helpfulLinks: ReadonlyArray<{
    icon: string;
    title: string;
    desc: string;
    cta: string;
    route: string;
  }> = [
    {
      icon: 'grid',
      title: 'About Us',
      desc: 'Learn about Charotar Education Society.',
      cta: 'About Us',
      route: '/about',
    },
    {
      icon: 'layers',
      title: 'Blogs',
      desc: 'Read our latest articles and updates.',
      cta: 'Read Blogs',
      route: '/blogs',
    },
    {
      icon: 'book',
      title: 'Help Center',
      desc: 'Browse guides and get answers to common questions.',
      cta: 'Visit Help Center',
      route: '/support',
    },
    {
      icon: 'headset',
      title: 'Contact Support',
      desc: 'Our team is here to help you succeed with ZarklyX.',
      cta: 'Contact Us',
      route: '/contact',
    },
  ];

  goBack(): void {
    this.location.back();
  }
}
