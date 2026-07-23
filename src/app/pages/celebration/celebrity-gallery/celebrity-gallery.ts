import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-celebrity-gallery',
  imports: [RouterLink],
  templateUrl: './celebrity-gallery.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './celebrity-gallery.scss',
})
export class CelebrityGallery {
  /** [0] is the tall feature tile; [1..] fill the 3×2 grid beside it. */
  readonly feature = PLACEHOLDER.celebration.gallery[0];
  readonly tiles = PLACEHOLDER.celebration.gallery.slice(1);

  readonly stats: ReadonlyArray<{ value: string; label: string; path: string[] }> = [
    { value: '15+', label: 'Chief Guests', path: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87'] },
    { value: '25K+', label: 'Participants', path: ['M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 11h-6'] },
    { value: '100+', label: 'Events', path: ['M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M16 2v4M8 2v4M3 10h18'] },
    { value: '50+', label: 'Institutions', path: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M10 21v-6h4v6'] },
    { value: '1', label: 'Unforgettable Year', path: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'] },
  ];
}
