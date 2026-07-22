import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AfterStep { icon: string; color: string; title: string; desc: string; }
interface Faq { q: string; a: string; open: boolean; }

@Component({
  selector: 'app-delete-your-account',
  imports: [RouterLink],
  templateUrl: './delete-your-account.html',
  styleUrl: './delete-your-account.scss',
})
export class DeleteYourAccount {
  /** Portal URL where users complete the deletion */
  readonly portalUrl = 'https://app.zarklyx.com';

  /** What gets permanently removed */
  readonly deleteList = [
    'All your workspaces, projects, and data',
    'Your profile, settings, and preferences',
    'Integrations and connected accounts',
    'Billing history and subscription details',
    'All uploaded files and assets',
  ];

  /** "What happens after you delete your account?" */
  readonly afterSteps: AfterStep[] = [
    { icon: 'user', color: '#3DAFA9', title: 'Account Deactivated', desc: 'Your account will be deactivated immediately.' },
    { icon: 'database', color: '#7C3AED', title: 'Data Removal', desc: 'All your data will be permanently removed from our servers.' },
    { icon: 'cloud-off', color: '#E8A33D', title: 'No Recovery', desc: "You won't be able to recover your account or any of your data." },
    { icon: 'card', color: '#3772FF', title: 'Billing Cancelled', desc: 'All active subscriptions will be cancelled at the end of the billing cycle.' },
    { icon: 'mail', color: '#17C653', title: 'Confirmation Email', desc: 'You will receive an email confirmation once the process is complete.' },
  ];

  readonly faqs: Faq[] = [
    { q: 'Can I temporarily deactivate my account instead?', a: 'Yes. From the ZarklyX portal you can pause or deactivate your account instead of deleting it  your data is preserved and you can reactivate anytime.', open: false },
    { q: 'Can I recover my data after deleting my account?', a: 'No. Once your account is deleted, all associated data is permanently removed from our servers and cannot be recovered. We recommend exporting anything you need beforehand.', open: false },
    { q: 'What happens to my team members?', a: "If you're the workspace owner, deleting your account removes the workspace and its members lose access. Transfer ownership first if the workspace should continue.", open: false },
    { q: 'Will I still be charged after deleting my account?', a: 'No new charges are made after deletion. Any active subscription is cancelled at the end of the current billing cycle, and you keep access until then.', open: false },
  ];

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
