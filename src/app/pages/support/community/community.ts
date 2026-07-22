import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { ResourcesService } from '../../../core/services/resources.service';

interface Discussion {
  icon: string;
  color: string;
  title: string;
  featured: boolean;
  author: string;
  category: string;
  time: string;
  replies: number;
  views: string;
}

/** Category icon key → the icon cases the discussion-row template supports */
const DISCUSSION_ICON: Record<string, string> = {
  grid: 'chat', code: 'code', card: 'dollar', users: 'users', bulb: 'megaphone', chat: 'chat', megaphone: 'megaphone',
};

@Component({
  selector: 'app-community',
  imports: [NgClass],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community implements OnInit {
  private resourcesService = inject(ResourcesService);
  private platformId = inject(PLATFORM_ID);
  /** Value proposition cards */
  readonly valueCards: ReadonlyArray<{ icon: string; color: string; title: string; desc: string }> = [
    { icon: 'connect', color: '#3DAFA9', title: 'Connect', desc: 'Network with other users and experts.' },
    { icon: 'learn', color: '#3772FF', title: 'Learn', desc: 'Discover tutorials, guides and best practices.' },
    { icon: 'share', color: '#F17C9F', title: 'Share', desc: 'Share your ideas and help others.' },
    { icon: 'grow', color: '#E8A33D', title: 'Grow', desc: 'Stay updated and grow with the community.' },
  ];

  /** Discussion filter tabs */
  readonly discussionTabs = ['All', 'Popular', 'Recent', 'Unanswered', 'Solved', 'Product Updates'];
  readonly activeTab = signal('All');

  readonly discussions = signal<Discussion[]>([]);
  readonly categories = signal<{ icon: string; color: string; name: string; count: number }[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDiscussions();
      this.loadCategories();
      this.loadStats();
    }
  }

  selectTab(tab: string): void {
    this.activeTab.set(tab);
    this.loadDiscussions();
  }

  private loadDiscussions(): void {
    this.resourcesService.getCommunityDiscussions({ tab: this.activeTab(), limit: 5 }).subscribe({
      next: (res: any) => {
        const rows = res?.data?.data ?? [];
        this.discussions.set(rows.map((d: any) => this.mapDiscussion(d)));
      },
      error: () => this.discussions.set([]),
    });
  }

  private loadCategories(): void {
    this.resourcesService.getCommunityCategories().subscribe({
      next: (res: any) => {
        const rows = res?.data ?? [];
        this.categories.set(rows.map((c: any) => ({
          icon: c.icon || 'chat', color: c.color || '#3DAFA9', name: c.name, count: c.count,
        })));
      },
      error: () => this.categories.set([]),
    });
  }

  private mapDiscussion(d: any): Discussion {
    return {
      icon: DISCUSSION_ICON[d.icon] || 'chat',
      color: d.color || '#3DAFA9',
      title: d.title,
      featured: !!d.featured,
      author: d.author,
      category: d.category,
      time: this.relativeTime(d.createdAt),
      replies: d.replies ?? 0,
      views: this.formatCount(d.views ?? 0),
    };
  }

  private relativeTime(value: string): string {
    if (!value) return '';
    const diff = Date.now() - new Date(value).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  private formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return `${n}`;
  }

  readonly involve: ReadonlyArray<{ icon: string; color: string; title: string; desc: string }> = [
    { icon: 'chat', color: '#3DAFA9', title: 'Start a discussion', desc: 'Ask questions and get help from the community.' },
    { icon: 'users', color: '#3772FF', title: 'Reply & help', desc: 'Share your knowledge and support others.' },
    { icon: 'calendar', color: '#C587CE', title: 'Join events', desc: 'Participate in webinars, AMAs and workshops.' },
    { icon: 'badge', color: '#E8A33D', title: 'Earn badges', desc: 'Contribute and earn exclusive badges.' },
  ];

  readonly stats = signal<{ icon: string; value: string; label: string }[]>([
    { icon: 'users', value: '', label: 'Community Members' },
    { icon: 'chat', value: '', label: 'Discussions' },
    { icon: 'solution', value: '', label: 'Solutions Shared' },
    { icon: 'award', value: '', label: 'Expert Contributors' },
  ]);



  /** Hero members  the avatars sit in a ring around the ZarklyX mark and are linked to each
      OTHER (peer-to-peer), not to a hub. x/y are the avatar centre in the illustration's 0–100
      space. `talkBegin` staggers each member's typing bubble so a conversation appears to move
      around the group, following the bead that loops along `convoPath`. See community.scss. */
  readonly members: ReadonlyArray<{ letter: string; color: string; x: number; y: number; floatDelay: string; img?: string }> = [
    { letter: 'S', color: '#3DAFA9', x: 32.4, y: 25.7, floatDelay: '0s', img: '/assets/images/community/shubham.webp' },
    { letter: 'S', color: '#3772FF', x: 67.6, y: 25.7, floatDelay: '-1.6s', img: '/assets/images/community/shiv.webp' },
    { letter: 'H', color: '#C587CE', x: 78.5, y: 59.3, floatDelay: '-3.2s', img: '/assets/images/community/het.webp' },
    { letter: 'D', color: '#E8A33D', x: 50, y: 80, floatDelay: '-4.8s', img: '/assets/images/community/darshan.webp' },
    { letter: 'P', color: '#F17C9F', x: 21.5, y: 59.3, floatDelay: '-6.4s', img: '/assets/images/community/prarthan.webp' },
  ];

  /** Length of one full conversation loop (seconds). Every message beam + bubble shares this
      period and is offset by its own `begin`, so the whole scene stays in phase and repeats. */
  readonly chatCycle = 19.2;

  /** A scripted-but-random-looking conversation: `from`/`to` index into `members`, `begin` is
      the message's start time within the cycle. Pairs deliberately criss-cross the pentagon so
      messages fly member → member in every direction, not just around the ring. */
  private readonly chats: ReadonlyArray<{ from: number; to: number; text: string; begin: number }> = [
    { from: 0, to: 2, text: 'Hey team 👋', begin: 0 },
    { from: 3, to: 1, text: 'This rocks 🔥', begin: 2.4 },
    { from: 4, to: 0, text: 'Question for you', begin: 4.8 },
    { from: 2, to: 4, text: 'On it! ✅', begin: 7.2 },
    { from: 1, to: 3, text: 'Big win today 🚀', begin: 9.6 },
    { from: 0, to: 3, text: 'Way to go! 🎉', begin: 12 },
    { from: 4, to: 2, text: 'Got you covered', begin: 14.4 },
    { from: 3, to: 0, text: 'Thanks a ton 🙏', begin: 16.8 },
  ];

  /** Each member enriched with the messages they send, so the template can render a text bubble
      above the sender at the right moment. */
  readonly memberFx = this.members.map((m, i) => ({
    ...m,
    outgoing: this.chats.filter((c) => c.from === i).map((c) => ({ text: c.text, begin: c.begin })),
  }));

  /** One travelling beam per message: a colour-matched dot streaks from sender to receiver. */
  readonly beams = this.chats.map((c) => ({
    color: this.members[c.from].color,
    begin: c.begin,
    path: `M${this.members[c.from].x},${this.members[c.from].y} L${this.members[c.to].x},${this.members[c.to].y}`,
  }));

 
  private loadStats(): void {
    this.resourcesService.getCommunityStats().subscribe({
      next: (res: any) => {
        const s = res?.data;
        if (!s) return;
        this.stats.set([
          { icon: 'users', value: this.formatCount(s.members), label: 'Community Members' },
          { icon: 'chat', value: this.formatCount(s.discussions), label: 'Discussions' },
          { icon: 'solution', value: this.formatCount(s.solutions), label: 'Solutions Shared' },
          { icon: 'award', value: this.formatCount(s.contributors), label: 'Expert Contributors' },
        ]);
      },
      error: () => { /* keep placeholders */ },
    });
  }
}
