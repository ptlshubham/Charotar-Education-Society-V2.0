import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChatMessage, DyunoChat } from '../../../core/services/dyuno-chat.service';
import { ResourcesService } from '../../../core/services/resources.service';
import { MarkdownPipe } from '../../../shared/markdown.pipe';

interface SharedChat {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

/**
 * A shared Dyuno conversation (/dyuno/share/:id) - the read-only page a "Share this chat"
 * link opens, in the same slim, layout-free frame as /dyuno. "Continue this chat" copies it
 * into the visitor's own history and opens it there.
 *
 * Client-rendered (app.routes.server.ts) - links are made after the build - and kept out of
 * search results: a shared chat is meant for whoever was sent the link.
 */
@Component({
  selector: 'app-dyuno-shared',
  imports: [DatePipe, RouterLink, MarkdownPipe],
  templateUrl: './dyuno-shared.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DyunoShared {
  private readonly route = inject(ActivatedRoute);
  private readonly resources = inject(ResourcesService);
  private readonly chat = inject(DyunoChat);
  private readonly router = inject(Router);

  readonly state = signal<'loading' | 'ready' | 'missing' | 'error'>('loading');
  readonly shared = signal<SharedChat | null>(null);

  constructor() {
    inject(Meta).updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(Title).setTitle('Shared chat - Dyuno | Charotar Education Society');
    afterNextRender(() => this.load());
  }

  load(): void {
    this.state.set('loading');
    this.resources.getSharedAssistantChat(this.route.snapshot.paramMap.get('id') ?? '').subscribe({
      next: (res: any) => {
        const data = res?.data as SharedChat | undefined;
        if (!Array.isArray(data?.messages)) return this.state.set('missing');
        this.shared.set(data!);
        this.state.set('ready');
      },
      error: (err) => this.state.set(err?.status === 404 ? 'missing' : 'error'),
    });
  }

  /** The snapshot becomes a new conversation in this browser, opened on /dyuno. */
  continueChat(): void {
    const shared = this.shared();
    if (!shared) return;
    this.chat.importShared(shared.title, shared.messages);
    this.router.navigate(['/dyuno']);
  }
}
