import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-milestones',
  imports: [RouterLink],
  templateUrl: './milestones.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './milestones.scss',
})
export class Milestones {
  readonly records: ReadonlyArray<{ title: string; image: string }> = [
    { title: 'Largest Quiz Competition', image: PLACEHOLDER.milestonePhotos[0] },
    { title: 'Largest Sudoku Solving', image: PLACEHOLDER.milestonePhotos[1] },
    { title: 'Largest Mehndi Art', image: PLACEHOLDER.milestonePhotos[2] },
    { title: 'Maximum Arm-Link Activity', image: PLACEHOLDER.milestonePhotos[3] },
  ];
}
