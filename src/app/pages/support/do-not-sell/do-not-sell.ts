import { Component } from '@angular/core';
import { LegalPage } from '../legal-page/legal-page';
import { DO_NOT_SELL_SECTIONS } from './do-not-sell.data';

@Component({
  selector: 'app-do-not-sell',
  imports: [LegalPage],
  templateUrl: './do-not-sell.html',
  styleUrl: './do-not-sell.scss',
})
export class DoNotSell {
  readonly sections = DO_NOT_SELL_SECTIONS;
  readonly intro =
    'California residents (and others with similar rights) can opt out of the "sale" or "sharing" of their personal information. This notice explains those rights and how to exercise them.';
  readonly optOutLink =
    'mailto:support@zarklyx.com?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information';
}
