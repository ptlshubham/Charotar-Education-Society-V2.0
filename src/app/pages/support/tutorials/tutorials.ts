import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ResourcesService } from '../../../core/services/resources.service';
import { environment } from '../../../../environments/environment';
import { SectionComingSoon } from '../../../layouts/section-coming-soon/section-coming-soon';

interface Tutorial {
  /** video-guide id  used for the detail route (/support/tutorials/:id) */
  id: string;
  /** module the video belongs to  drives the category tabs and filtering */
  module: string;
  title: string;
  desc: string;
  duration: string;
  level: string;
  levelColor: string;
  views: number;
  gradient: string;
  /** cover image (uploaded thumbnail or the video's own YouTube cover); '' → fall back to gradient */
  cover: string;
}

/** Card gradients rotated across tutorials so each has a distinct thumbnail tint */
const CARD_GRADIENTS = [
  'linear-gradient(135deg,#2f8f6b,#1f6b52)',
  'linear-gradient(135deg,#9285e6,#6b5bd0)',
  'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  'linear-gradient(135deg,#ffe0c2,#ffc48c)',
  'linear-gradient(135deg,#d6f5f0,#b5ebe3)',
  'linear-gradient(135deg,#fbd5e0,#f7b8cb)',
];

/** Known modules → curated tab label + icon; unknown modules fall back to a title-cased label + folder icon */
const MODULE_META: Record<string, { label: string; icon: string }> = {
  general: { label: 'General', icon: 'rocket' },
  crm: { label: 'CRM', icon: 'users' },
  hrm: { label: 'HRM', icon: 'user' },
  invoice: { label: 'Invoice', icon: 'card' },
  billing: { label: 'Billing', icon: 'card' },
};

@Component({
  selector: 'app-tutorials',
  imports: [SectionComingSoon],
  templateUrl: './tutorials.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tutorials.scss',
})
export class Tutorials implements OnInit {
  private resourcesService = inject(ResourcesService);
  private platformId = inject(PLATFORM_ID);
  /** Active module filter ('all' shows everything) */
  readonly activeModule = signal('all');

  /** All tutorials populated from the public video-guide API in ngOnInit */
  readonly allTutorials = signal<Tutorial[]>([]);

  /** Category tabs derived from the modules present in the data, "All Tutorials" pinned first */
  readonly categories = computed(() => {
    const counts = new Map<string, number>();
    for (const t of this.allTutorials()) {
      counts.set(t.module, (counts.get(t.module) || 0) + 1);
    }
    const fromData = [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => {
        const meta = MODULE_META[id];
        return {
          id,
          label: meta?.label ?? id.charAt(0).toUpperCase() + id.slice(1),
          icon: meta?.icon ?? 'folder',
          sublabel: `${count} ${count === 1 ? 'tutorial' : 'tutorials'}`,
        };
      });
    return [
      {
        id: 'all',
        label: 'All Tutorials',
        icon: 'grid',
        sublabel: `${this.allTutorials().length} total`,
      },
      ...fromData,
    ];
  });

  /** Tutorials shown for the active module tab */
  readonly tutorials = computed(() => {
    const module = this.activeModule();
    const all = this.allTutorials();
    return module === 'all' ? all : all.filter((t) => t.module === module);
  });

  ngOnInit(): void {
    // Fetch only in the browser; zone.js triggers change detection on the response.
    if (isPlatformBrowser(this.platformId)) {
      this.loadTutorials();
    }
  }

  private loadTutorials(): void {
    this.resourcesService.getPublicVideos({ limit: 100 }).subscribe({
      next: (res: any) => {
        const videos = res?.data?.data ?? [];
        this.allTutorials.set(videos.map((v: any, i: number) => this.mapVideo(v, i)));
      },
      error: () => {
        this.allTutorials.set([]);
      },
    });
  }

  /**
   * The help_videos model has no level/lessons/gradient. We derive the badge from
   * `category`, rotate the gradient palette, and default lessons to 1 per video.
   */
  private mapVideo(v: any, index: number): Tutorial {
    return {
      id: v.id,
      module: v.module || 'general',
      title: v.title || v.name || '',
      desc: v.description || '',
      duration: v.duration || '',
      level: v.category || 'Beginner',
      levelColor: '#3DAFA9',
      views: v.views || 0,
      gradient: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
      cover: this.resolveCover(v),
    };
  }

  /** Prefer an uploaded thumbnail; otherwise use the YouTube video's own cover image */
  private resolveCover(v: any): string {
    if (v.thumbnail) {
      return /^https?:\/\//.test(v.thumbnail) ? v.thumbnail : environment.apiUrl + v.thumbnail;
    }
    const match = String(v.videoUrl || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
  }

  readonly learningPaths: ReadonlyArray<{
    icon: string;
    color: string;
    title: string;
    completed: number;
    total: number;
    percent: number;
  }> = [
    {
      icon: 'rocket',
      color: '#3DAFA9',
      title: 'Getting Started',
      completed: 5,
      total: 6,
      percent: 83,
    },
    {
      icon: 'bolt',
      color: '#E8A33D',
      title: 'Become a Power User',
      completed: 7,
      total: 10,
      percent: 70,
    },
    {
      icon: 'shield',
      color: '#3772FF',
      title: 'Admin Essentials',
      completed: 6,
      total: 8,
      percent: 75,
    },
  ];

  readonly popularArticles: ReadonlyArray<{ title: string; readTime: string }> = [
    { title: 'How to invite team members', readTime: '5 min read' },
    { title: 'Understanding user roles', readTime: '4 min read' },
    { title: 'Billing & subscription guide', readTime: '6 min read' },
    { title: 'Troubleshooting common issues', readTime: '7 min read' },
  ];
}
