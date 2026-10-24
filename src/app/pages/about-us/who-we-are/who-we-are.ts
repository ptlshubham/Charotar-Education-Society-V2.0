import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-who-we-are',
  imports: [RouterLink],
  templateUrl: './who-we-are.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './who-we-are.scss',
})
export class WhoWeAre {
  readonly pillars: ReadonlyArray<{ title: string; body: string }> = [
    {
      title: 'Our Vision',
      body: 'Develop capable professionals and responsible citizens who shape a better tomorrow.',
    },
    {
      title: 'Our Mission',
      body: 'Make quality education accessible while supporting innovation, research and holistic development.',
    },
    {
      title: 'Our Values',
      body: 'Integrity, Discipline, Excellence, Service and Innovation.',
    },
  ];
}
