import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LightboxService } from '../../../core/services/lightbox.service';

/**
 * "Eight records. One remarkable year." - the centenary's Guinness World Records beside the
 * certificate (which opens in the site-wide viewer). "View All Records" goes to the home page's
 * World Records slider, which has a photo of each record.
 */
@Component({
  selector: 'app-guinness-record',
  imports: [RouterLink],
  templateUrl: './guinness-record.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './guinness-record.scss',
})
export class GuinnessRecord {
  private readonly lightbox = inject(LightboxService);

  readonly certificate = '/assets/images/celebration/certificate.jpeg';

  /** Short name and figure for the list; `official` is the record's full title (shown on hover). */
  readonly records: ReadonlyArray<{ title: string; detail: string; official: string }> = [
    { title: 'Largest quiz competition', detail: '3,832 participants', official: 'Largest quiz competition' },
    { title: 'Simultaneous Sudoku', detail: '3,824 participants', official: 'Most people playing Sudoku at the same time' },
    { title: 'Simultaneous henna tattoos', detail: '1,200 students', official: 'Most people receiving henna tattoos at the same time' },
    { title: 'Largest kite mosaic', detail: '14,037 kites', official: 'Largest kite mosaic - 14,037 kites over 1,360.19 sq m (14,641 sq ft)' },
    { title: 'Longest human mathematical equation', detail: '499 participants', official: 'Longest human representation of a mathematical equation' },
    { title: 'Simultaneous T-shirt signing', detail: '500 participants', official: "Most people signing each other's T-shirts at the same time" },
    { title: 'Standing with linked arms', detail: '118 participants', official: 'Most people standing with linked arms' },
    { title: 'Most signatures on a scroll', detail: '14,120 signatures', official: 'Most signatures on a scroll' },
  ];

  viewCertificate(): void {
    this.lightbox.open([{ src: this.certificate, caption: 'Guinness World Records certificate · Centenary 2015–16' }]);
  }

  /** "01" … "08" */
  pad(n: number): string { return String(n).padStart(2, '0'); }
}
