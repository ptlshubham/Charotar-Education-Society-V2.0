import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaqItem, FAQ_SECTIONS } from './faq.data';

interface PopularArticle {
  icon: string;
  title: string;
  readTime: string;
}

@Component({
  selector: 'app-support-faq',
  imports: [NgClass, RouterLink],
  templateUrl: './faq.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './faq.scss',
})
export class Faq {
  readonly faqs: FaqItem[] = FAQ_SECTIONS;

  /** Topic filter tabs */
  readonly categories: ReadonlyArray<{ id: string; label: string; icon: string }> = [
    { id: 'all', label: 'All Topics', icon: 'grid' },
    { id: 'getting-started', label: 'Getting Started', icon: 'rocket' },
    { id: 'features', label: 'Features', icon: 'layers' },
    { id: 'integrations', label: 'Integrations', icon: 'puzzle' },
    { id: 'billing', label: 'Billing & Plans', icon: 'card' },
    { id: 'account', label: 'Account & Access', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'support', label: 'Support', icon: 'headset' },
  ];

  activeCategory = 'all';
  searchTerm = '';

  readonly popularArticles: PopularArticle[] = [
    { icon: 'doc', title: 'Getting started with ZarklyX', readTime: '5 min read' },
    { icon: 'users', title: 'How to invite your team', readTime: '3 min read' },
    { icon: 'check', title: 'Manage projects efficiently', readTime: '6 min read' },
    { icon: 'target', title: 'Understanding user roles', readTime: '4 min read' },
  ];

  get filteredFaqs(): FaqItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.faqs.filter((f) => {
      const matchesCategory = this.activeCategory === 'all' || f.category === this.activeCategory;
      const matchesSearch =
        !term || f.title.toLowerCase().includes(term) || f.content.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  get heading(): string {
    if (this.activeCategory === 'all') return 'All Frequently Asked Questions';
    return (
      this.categories.find((c) => c.id === this.activeCategory)?.label ??
      'Frequently Asked Questions'
    );
  }

  setCategory(id: string): void {
    this.activeCategory = id;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}
