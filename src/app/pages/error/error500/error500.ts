import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-error500',
  imports: [RouterLink],
  templateUrl: './error500.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './error500.scss',
})
export class Error500 {
  constructor(private readonly location: Location) {}

  readonly building = PLACEHOLDER.errorBuilding;

  readonly notes: ReadonlyArray<{ title: string; desc: string; path: string[] }> = [
    {
      title: 'Technical Issue',
      desc: 'An unexpected error occurred on our server.',
      path: ['M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z', 'M8 21h8M12 17v4', 'M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    },
    {
      title: "We're Working On It",
      desc: 'Our team is working hard to resolve the issue.',
      path: ['M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.7-.7-.7-2.7z'],
    },
    {
      title: 'Please Try Again Later',
      desc: 'We appreciate your patience. Please try again after some time.',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
    },
    {
      title: 'Need Immediate Help?',
      desc: 'If the problem persists, contact our support team.',
      path: ['M2 4h20v16H2z', 'm2 6 10 7 10-7'],
    },
  ];

  goBack(): void {
    this.location.back();
  }
}
