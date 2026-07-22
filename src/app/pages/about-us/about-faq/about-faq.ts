import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-about-faq',
  imports: [CommonModule],
  templateUrl: './about-faq.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-faq.scss',
})
export class AboutFaq {
  @ViewChildren('faqAnswer') faqAnswers!: QueryList<ElementRef>;

  faqs: FaqItem[] = [
    {
      question: 'What is ZarklyX?',
      answer:
        'ZarklyX is an all-in-one platform for agencies and growing teams. It brings your CRM, client management, social media, HR, payroll, SEO, accounting, and reporting into one login  so your whole team works from a single system instead of a dozen scattered tools.',
      isOpen: false,
    },
    {
      question: 'Who is ZarklyX built for?',
      answer:
        "It's built for agencies, startups, and marketing teams that are outgrowing spreadsheets and one-off apps. Whether you're a team of five or fifty, ZarklyX scales with you and keeps every department in sync.",
      isOpen: false,
    },
    {
      question: 'How is ZarklyX different from using separate tools?',
      answer:
        'With separate tools, your data lives in ten places and nothing connects. ZarklyX keeps clients, campaigns, people, and finances in one system that talks to itself  so you save time, cut software costs, and always know what is happening.',
      isOpen: false,
    },
    {
      question: 'Can I control what my team members can see?',
      answer:
        'Yes. ZarklyX uses role-based access, so each person only sees the parts of the platform they need. You can set permissions by role, team, or workspace in just a few minutes.',
      isOpen: false,
    },
    {
      question: 'How do I get started?',
      answer:
        "Click Get Started to create your account, or book a quick demo and we'll walk you through how ZarklyX fits your team. Setup takes minutes, not weeks.",
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
