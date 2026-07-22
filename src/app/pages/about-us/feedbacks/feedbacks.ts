import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feedbacks',
  imports: [RouterLink],
  templateUrl: './feedbacks.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './feedbacks.scss',
})
export class Feedbacks {}
