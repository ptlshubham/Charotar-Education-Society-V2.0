import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  photo?: string;
}

@Component({
  selector: 'app-impact',
  imports: [NgClass],
  templateUrl: './impact.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './impact.scss',
})
export class Impact implements OnInit, OnDestroy {
  readonly testimonials: readonly Testimonial[] = [
    { name: 'Harsh Pandya', role: 'Software Engineer, Google', quote: 'CES gave me the right foundation to dream big and achieve bigger. The teachers pushed me to think beyond textbooks and to believe that a student from Anand could compete anywhere.' },
    { name: 'Kruti Shah', role: 'Chartered Accountant', quote: 'The values and exposure I got at CES shaped my entire journey. Discipline, honesty and hard work were taught to us daily, not just in class.' },
    { name: 'Devansh Joshi', role: 'Entrepreneur', quote: 'From a small town to an international stage, CES made it possible. The mentors here believed in my ideas long before I did.' },
    { name: 'Priya Patel', role: 'Marketing Director', quote: 'The teachers at CES were more than just educators; they were true mentors who guided me through every challenge. Campus life was vibrant and inclusive.' },
    { name: 'Rahul Desai', role: 'Senior Consultant', quote: 'I am grateful for the strong values and lifelong friendships I gained during my time here. The environment fostered both academic excellence and personal growth.' },
    { name: 'Sneha Mehta', role: 'Social Entrepreneur', quote: 'Carrying the CES legacy is a matter of immense pride for me wherever I go. The institution instilled a deep sense of responsibility and a desire to give back to the community.' },
  ];

  cardsPerPage = 3;
  currentPage = 0;
  totalPages = 2;
  pages: number[] = [];
  autoSlideInterval: any;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object, 
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.updateCardsPerPage();
      this.startAutoSlide();
    } else {
      this.pages = [0, 1];
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      const prev = this.cardsPerPage;
      this.updateCardsPerPage();
      if (prev !== this.cardsPerPage) {
        this.goToPage(0);
      }
    }
  }

  updateCardsPerPage() {
    if (window.innerWidth <= 768) {
      this.cardsPerPage = 1;
    } else if (window.innerWidth <= 1024) {
      this.cardsPerPage = 2;
    } else {
      this.cardsPerPage = 3;
    }
    this.totalPages = Math.ceil(this.testimonials.length / this.cardsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    this.cdr.detectChanges();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.cdr.detectChanges();
    this.resetAutoSlide();
  }

  nextSlide() {
    this.currentPage = (this.currentPage + 1) % this.totalPages;
    this.cdr.detectChanges();
  }

  startAutoSlide() {
    if (!this.isBrowser) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    this.ngZone.runOutsideAngular(() => {
      this.autoSlideInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.nextSlide();
        });
      }, 3000);
    });
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}
