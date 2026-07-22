import { Component, inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourcesService } from '../../../../core/services/resources.service';
import { SeoService } from '../../../../core/services/seo.service';

/** Known modules → curated nav label + icon; unknown modules fall back to a title-cased label + folder icon */
const MODULE_META: Record<string, { label: string; icon: string }> = {
  general: { label: 'General', icon: 'rocket' },
  crm: { label: 'CRM', icon: 'users' },
  hrm: { label: 'HRM', icon: 'user' },
  invoice: { label: 'Invoice', icon: 'card' },
  billing: { label: 'Billing', icon: 'card' },
};
const moduleLabel = (m: string) => MODULE_META[m]?.label ?? (m.charAt(0).toUpperCase() + m.slice(1));
const moduleIcon = (m: string) => MODULE_META[m]?.icon ?? 'folder';

interface NavCategory {
  module: string;
  name: string;
  icon: string;
  items: { id: string; title: string }[];
}

@Component({
  selector: 'app-tutorial-details',
  imports: [NgClass, RouterLink],
  templateUrl: './tutorial-details.html',
  styleUrl: './tutorial-details.scss',
})
export class TutorialDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private resourcesService = inject(ResourcesService);
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  // ─── Current video, populated from the public video-guide API ───
  readonly currentId = signal('');
  readonly meta = signal({ level: 'Beginner', readTime: '', lessons: '' });
  readonly title = signal('Tutorial');
  readonly subtitle = signal('');
  readonly updated = signal('');
  /** Sanitized YouTube embed URL for the hero player (null until loaded / if no video) */
  readonly videoEmbedUrl = signal<SafeResourceUrl | null>(null);
  readonly author = 'ZarklyX Team';

  // ─── All videos, used to build the sidebars (navigation between real tutorials) ───
  readonly allVideos = signal<any[]>([]);
  readonly expandedModule = signal('');
  /** Left-nav search query */
  readonly searchQuery = signal('');
  helpful = '';

  // ─── Share box ───
  readonly shareOpen = signal(false);
  readonly copied = signal(false);

  ngOnInit(): void {
    // Runs on the server too, so the tutorial's meta tags are serialised into
    // the SSR HTML  social crawlers don't execute JS and would otherwise see none.
    this.loadAllVideos();
    // React to param changes so clicking a sidebar item swaps the video without a full reload.
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (id) {
        this.currentId.set(id);
        this.videoEmbedUrl.set(null);
        this.loadVideo(id);
      }
    });
  }

  private loadAllVideos(): void {
    this.resourcesService.getPublicVideos({ limit: 100 }).subscribe({
      next: (res: any) => {
        const list = res?.data?.data ?? [];
        this.allVideos.set(list);
        const cur = list.find((v: any) => v.id === this.currentId());
        this.expandedModule.set(cur?.module || 'general');
      },
      error: () => this.allVideos.set([]),
    });
  }

  private loadVideo(id: string): void {
    this.resourcesService.getPublicVideoById(id).subscribe({
      next: (res: any) => {
        const v = res?.data;
        if (!v) return;
        this.title.set(v.title || v.name || 'Tutorial');
        this.subtitle.set(v.description || '');
        this.meta.set({
          level: v.category || 'Beginner',
          readTime: v.duration || '',
          lessons: `${v.views || 0} views`,
        });
        this.updated.set(
          v.updatedAt
            ? 'Updated on ' + new Date(v.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            : ''
        );
        this.expandedModule.set(v.module || 'general');
        const embed = this.toEmbedUrl(v.videoUrl);
        if (embed) this.videoEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embed));
        this.seo.applyCustom({
          title: v.title || v.name,
          description: v.description,
          image: v.thumbnail || null,
          url: `/support/tutorials/${id}`,
        });
      },
      error: () => {},
    });
  }

  /** Convert a YouTube watch/short URL into an embeddable /embed/<id> URL */
  private toEmbedUrl(url: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  /** Module of the video currently open */
  private readonly currentModule = computed(() => {
    const v = this.allVideos().find((x) => x.id === this.currentId());
    return v?.module || 'general';
  });

  /** Left-rail: every module with its videos as sub-items, filtered by the search query */
  readonly categories = computed<NavCategory[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const groups = new Map<string, { id: string; title: string }[]>();
    for (const v of this.allVideos()) {
      const title = v.title || v.name || 'Untitled';
      if (q && !title.toLowerCase().includes(q)) continue;
      const mod = v.module || 'general';
      if (!groups.has(mod)) groups.set(mod, []);
      groups.get(mod)!.push({ id: v.id, title });
    }
    return [...groups.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mod, items]) => ({ module: mod, name: moduleLabel(mod), icon: moduleIcon(mod), items }));
  });

  /** A module's sub-items show when it's expanded, or whenever a search is active */
  isOpen(module: string): boolean {
    return !!this.searchQuery().trim() || this.expandedModule() === module;
  }

  /** Right-rail "learning path": the other videos in the current video's module */
  readonly pathVideos = computed(() =>
    this.allVideos()
      .filter((v) => (v.module || 'general') === this.currentModule())
      .map((v, i) => ({
        id: v.id,
        num: i + 1,
        title: v.title || v.name || 'Untitled',
        duration: v.duration || '',
        current: v.id === this.currentId(),
      }))
  );
  readonly pathTitle = computed(() => moduleLabel(this.currentModule()));
  readonly pathTotal = computed(() => this.pathVideos().length);
  readonly pathCompleted = computed(() => {
    const idx = this.pathVideos().findIndex((v) => v.current);
    return idx >= 0 ? idx + 1 : 0;
  });
  readonly pathPercent = computed(() => {
    const total = this.pathTotal();
    return total ? Math.round((this.pathCompleted() / total) * 100) : 0;
  });

  /** Related: other videos, same-module first */
  readonly relatedArticles = computed(() => {
    const cur = this.currentId();
    const mod = this.currentModule();
    return this.allVideos()
      .filter((v) => v.id !== cur)
      .sort((a, b) => Number((b.module || 'general') === mod) - Number((a.module || 'general') === mod))
      .slice(0, 4)
      .map((v) => ({
        id: v.id,
        title: v.title || v.name || 'Untitled',
        readTime: v.duration || `${v.views || 0} views`,
      }));
  });

  /** Popular topics: the distinct modules present in the data */
  readonly popularTopics = computed(() => {
    const mods = new Set<string>();
    for (const v of this.allVideos()) mods.add(v.module || 'general');
    return [...mods].sort().map((m) => moduleLabel(m));
  });

  toggleCategory(module: string): void {
    this.expandedModule.set(this.expandedModule() === module ? '' : module);
  }

  setHelpful(value: string): void {
    this.helpful = value;
  }

  toggleShare(): void {
    this.copied.set(false);
    this.shareOpen.update((v) => !v);
  }

  closeShare(): void {
    this.shareOpen.set(false);
  }

  /** Open a platform share window for the current tutorial URL */
  shareTo(platform: 'facebook' | 'x' | 'linkedin' | 'whatsapp'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.title());
    const targets: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer,width=600,height=520');
    this.closeShare();
  }

  copyLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard?.writeText(window.location.href).then(
      () => this.copied.set(true),
      () => {}
    );
  }
}
