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
  readonly achievements: ReadonlyArray<{ id: number; title: string; image?: string; icon: string }> = [
    { id: 1, title: 'Largest Quiz Competition', image: '/assets/images/home/Quiz.png', icon: '' },
    { id: 2, title: 'Largest Sudoku Solving', image: '/assets/images/home/Sudoku.png', icon: '' },
    { id: 3, title: 'Largest Mehndi Art', image: '/assets/images/home/Mahendi.png', icon: '' },
    { id: 4, title: 'Maximum Arm-Link Activity', image: '/assets/images/home/ArmLinked.png', icon: '' },
    { id: 5, title: 'Maximum T-Shirt Sign Campaign', image: '/assets/images/home/T-ShirtSignature.png', icon: '' },
    { id: 6, title: 'Largest Kite Mosaic Display', image: '/assets/images/home/KiteMosaic.png', icon: '' },
    { id: 7, title: 'Most Number of Signature Campaign', image: '/assets/images/home/Signature.png', icon: '' },
    { id: 8, title: 'Longest Human Maths Equation', image: '/assets/images/home/HumanMathsEquation.png', icon: '' },
  ];
}
