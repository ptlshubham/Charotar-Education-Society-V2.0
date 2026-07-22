import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsletterService } from '../../core/services/newsletter.service';

@Component({
  selector: 'app-subscribe-success-modal',
  imports: [RouterLink],
  templateUrl: './subscribe-success-modal.html',
})
export class SubscribeSuccessModal {
  readonly newsletter = inject(NewsletterService);
}
