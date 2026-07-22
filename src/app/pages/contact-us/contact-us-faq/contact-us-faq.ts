import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact-us-faq',
  imports: [CommonModule, RouterLink],
  templateUrl: './contact-us-faq.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './contact-us-faq.scss',
})
export class ContactUsFaq {
  @ViewChildren('faqAnswer') faqAnswers!: QueryList<ElementRef>;

  faqs: FaqItem[] = [
    {
      question: 'How quickly will I hear back after I get in touch?',
      answer:
        'Most messages get a reply within a few hours on business days. Issues raised through a support ticket are prioritized, so urgent problems are handled first and you are never left waiting.',
      isOpen: false,
    },
    {
      question: 'Which email should I use to reach the right team?',
      answer:
        'Use sales@zarklyx.com for demos and pricing, support@zarklyx.com for setup and workspace help, devops@zarklyx.com for APIs and integrations, and contact@zarklyx.com for anything else.',
      isOpen: false,
    },
    {
      question: 'Can I book a demo before I sign up?',
      answer:
        'Yes. Reach out to our sales team and we will walk you through how ZarklyX fits your agency, answer your questions, and help you get started at your own pace.',
      isOpen: false,
    },
    {
      question: 'Do you help with setup and onboarding?',
      answer:
        'We do. Our support team can help you set up your workspace, add your team, configure modules, and set the right permissions so you are up and running quickly.',
      isOpen: false,
    },
    {
      question: 'Where can I find answers on my own?',
      answer:
        'Browse our Knowledge Base, user guides, and tutorials above, or open the full FAQ page. Most common questions are answered there in just a few minutes.',
      isOpen: false,
    },
  ];

  toggleFaq(index: number): void {
    const faqItem = this.faqs[index];
    const faqElements = document.querySelectorAll('.faq-answer');
    const iconElements = document.querySelectorAll('.faq-icon');
    const answerEl = faqElements[index] as HTMLElement;
    const iconEl = iconElements[index] as HTMLElement;

    if (!answerEl) return;

    if (faqItem.isOpen) {
      // Collapse the clicked item
      this.collapseFaq(index, answerEl, iconEl);
    } else {
      // Close any currently open FAQ first
      this.faqs.forEach((faq, i) => {
        if (faq.isOpen && i !== index) {
          const openAnswerEl = faqElements[i] as HTMLElement;
          const openIconEl = iconElements[i] as HTMLElement;
          this.collapseFaq(i, openAnswerEl, openIconEl);
        }
      });

      // Expand the clicked item
      faqItem.isOpen = true;
      gsap.set(answerEl, { height: 'auto', opacity: 1 });
      const autoHeight = answerEl.offsetHeight;
      gsap.set(answerEl, { height: 0, opacity: 0 });
      gsap.to(answerEl, {
        height: autoHeight,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      });
      gsap.to(iconEl, {
        rotation: 45,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }

  private collapseFaq(index: number, answerEl: HTMLElement, iconEl: HTMLElement): void {
    gsap.to(answerEl, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        this.faqs[index].isOpen = false;
      },
    });
    gsap.to(iconEl, {
      rotation: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }
}
