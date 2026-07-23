import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PLACEHOLDER } from '../../../shared/placeholder-images';

@Component({
  selector: 'app-guinness-record',
  templateUrl: './guinness-record.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './guinness-record.scss',
})
export class GuinnessRecord {
  readonly certificate = PLACEHOLDER.celebration.certificate;

  readonly records: readonly string[] = [
    'Largest Quiz Competition (3,832 participants)',
    'Largest Ever Kite Mosaic (13,360.19 sq.ft)',
    'Most People Playing Sudoku Simultaneously (1,824 participants)',
    'Longest Human Representation of a Mathematical Equation (499 participants)',
    'Most People Receiving Henna Tattoos Simultaneously (1,200 students)',
  ];
}
