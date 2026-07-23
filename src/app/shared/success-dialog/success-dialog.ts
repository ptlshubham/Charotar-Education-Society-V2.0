import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  SuccessDialogService,
  SuccessDialogAction,
} from '../../core/services/success-dialog.service';

@Component({
  selector: 'app-success-dialog',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './success-dialog.html',
})
export class SuccessDialog {
  readonly dialog = inject(SuccessDialogService);

  readonly defaultActions: SuccessDialogAction[] = [{ label: 'Close', primary: true }];

  readonly primaryBtnClass =
    'inline-flex items-center justify-center gap-2 h-12 px-10 rounded-[10px] text-white text-[14px] font-semibold bg-[linear-gradient(86.25deg,#203154_0.45%,#182742_73.41%,#203154_99.36%)] hover:opacity-95 transition-opacity';
  readonly outlineBtnClass =
    'inline-flex items-center justify-center gap-2 h-12 px-8 rounded-[10px] border border-primary/15 text-primary text-[14px] font-semibold hover:border-primary hover:text-primary transition-colors';
}
