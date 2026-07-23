import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-who-we-are',
  imports: [RouterLink],
  templateUrl: './who-we-are.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './who-we-are.scss',
})
export class WhoWeAre {
  readonly image = PLACEHOLDER.about.whoWeAre;

  readonly pillars: ReadonlyArray<{ title: string; body: string; path: string[] }> = [
    {
      title: 'Our Vision',
      body: 'To be a leading educational organization creating competent professionals and responsible citizens for a better tomorrow.',
      path: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
    },
    {
      title: 'Our Mission',
      body: 'To provide access to affordable and quality education, foster innovation, research and holistic development for nation building.',
      path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    },
    {
      title: 'Our Values',
      body: 'Integrity, Discipline, Excellence, Service and Innovation are the core values that guide our every endeavour.',
      path: ['m12 2 4 5h5l-9 15L3 7h5l4-5z', 'M8 7h8'],
    },
  ];
}
