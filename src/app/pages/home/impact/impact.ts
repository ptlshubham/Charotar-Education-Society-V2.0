import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  /** Real named alumnus — leave unset so a neutral avatar renders until a real photo is supplied. */
  photo?: string;
}

@Component({
  selector: 'app-impact',
  imports: [RouterLink],
  templateUrl: './impact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './impact.scss',
})
export class Impact {
  readonly testimonials: readonly Testimonial[] = [
    { name: 'Harsh Pandya', role: 'Software Engineer, Google', quote: 'CES gave me the right foundation to dream big and achieve bigger.' },
    { name: 'Kruti Shah', role: 'Chartered Accountant', quote: 'The values and exposure I got at CES shaped my entire journey.' },
    { name: 'Devansh Joshi', role: 'Entrepreneur', quote: 'From a small town to an international stage, CES made it possible.' },
  ];
}
