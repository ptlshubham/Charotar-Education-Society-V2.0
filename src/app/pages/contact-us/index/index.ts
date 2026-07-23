import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContactHero } from '../contact-hero/contact-hero';
import { ContactInfo } from '../contact-info/contact-info';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  selector: 'app-index',
  imports: [ContactHero, ContactInfo, ContactForm],
  templateUrl: './index.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './index.scss',
})
export class Index {}
