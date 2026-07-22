import { Component, signal, ElementRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { gsap } from 'gsap';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faq.scss',
})
export class Faq {
  private host = inject(ElementRef);

  faqs = signal<FaqItem[]>([
    {
      question: 'What is ZarklyX and who is it for?',
      answer:
        'ZarklyX is an all-in-one operating system for agencies. It brings CRM, project management, HR and payroll, invoicing, social media management, and client portals into a single platform, so growing agencies can run daily operations without stitching together a dozen separate tools.',
      isOpen: true,
    },
    {
      question: 'Which platforms and tools does ZarklyX integrate with?',
      answer:
        'ZarklyX connects natively with Google Drive, Dropbox, Facebook, Instagram, Threads, LinkedIn, Pinterest, WhatsApp, X, YouTube, and Google My Business  so you can manage content, files, and client communication without leaving the platform.',
      isOpen: false,
    },
    {
      question: 'Can I control what each team member can see and do?',
      answer:
        'Yes. ZarklyX uses granular, role-based access control  from Agency Owner down to individual contributors  so managers can assign clients and permissions per module, and employees only see the clients and data relevant to their role.',
      isOpen: false,
    },
    {
      question: 'Does ZarklyX help with SEO and marketing, not just operations?',
      answer:
        'Yes. ZarklyX includes comprehensive SEO analysis with AI-assisted recommendations alongside social media scheduling and sales & marketing tools, so client-facing work and internal operations run on the same platform.',
      isOpen: false,
    },
  ]);

  toggleFaq(index: number, element: HTMLElement): void {
    const currentFaqs = this.faqs();
    const wasOpen = currentFaqs[index].isOpen;

    // Update state to trigger icon change
    this.faqs.update((list) =>
      list.map((item, i) => {
        if (i === index) {
          return { ...item, isOpen: !wasOpen };
        }
        return { ...item, isOpen: false };
      }),
    );

    const cardContainer = element.parentElement?.parentElement;
    if (cardContainer) {
      const allAnswers = Array.from(cardContainer.querySelectorAll('.faq-answer')) as HTMLElement[];

      allAnswers.forEach((el, i) => {
        if (i === index) {
          if (!wasOpen) {
            gsap.killTweensOf(el);
            gsap.fromTo(
              el,
              { height: 0, opacity: 0 },
              {
                height: 'auto',
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
              },
            );
          } else {
            gsap.killTweensOf(el);
            gsap.to(el, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          }
        } else if (currentFaqs[i].isOpen) {
          gsap.killTweensOf(el);
          gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          });
        }
      });
    }
  }
}
