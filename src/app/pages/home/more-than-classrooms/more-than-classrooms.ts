import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-more-than-classrooms',
  imports: [RouterLink],
  templateUrl: './more-than-classrooms.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './more-than-classrooms.scss',
})
export class MoreThanClassrooms {
  readonly cards: ReadonlyArray<{ title: string; image: string; link: string }> = [
    { title: 'Campus Life', image: PLACEHOLDER.moreThanClassrooms[0], link: '/social-activity' },
    { title: 'Social Activities', image: PLACEHOLDER.moreThanClassrooms[1], link: '/social-activity' },
    { title: 'Student Events', image: PLACEHOLDER.moreThanClassrooms[2], link: '/social-activity' },
    { title: 'Community Initiatives', image: PLACEHOLDER.moreThanClassrooms[3], link: '/project' },
  ];
}
