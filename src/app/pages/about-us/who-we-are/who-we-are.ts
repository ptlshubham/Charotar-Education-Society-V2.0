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

  readonly pillars: ReadonlyArray<{ title: string; body: string; icon: string }> = [
    {
      title: 'Our Vision',
      body: 'To be a leading educational organization creating competent professionals and responsible citizens for a better tomorrow.',
      icon: 'visibility',
    },
    {
      title: 'Our Mission',
      body: 'To provide access to affordable and quality education, foster innovation, research and holistic development for nation building.',
      icon: 'track_changes',
    },
    {
      title: 'Our Values',
      body: 'Integrity, Discipline, Excellence, Service and Innovation are the core values that guide our every endeavour.',
      icon: 'diamond',
    },
  ];
}
