import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-error404',
  imports: [RouterLink],
  templateUrl: './error404.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './error404.scss',
})
export class Error404 {
  constructor(private readonly location: Location) {}

  readonly building = PLACEHOLDER.errorBuilding;

  readonly quickLinks: ReadonlyArray<{ label: string; route: string; path: string[] }> = [
    { label: 'About CES', route: '/about', path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M9 21v-6h6v6'] },
    { label: 'Academics', route: '/academic/school', path: ['m12 3 9 5-9 5-9-5 9-5z', 'M21 8v6', 'M7 10.5V16c0 1.7 2.2 3 5 3s5-1.3 5-3v-5.5'] },
    { label: 'Admissions', route: '/contact', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M19 8v6M22 11h-6'] },
    { label: 'Contact Us', route: '/contact', path: ['M2 4h20v16H2z', 'm2 6 10 7 10-7'] },
  ];

  goBack(): void {
    this.location.back();
  }
}
