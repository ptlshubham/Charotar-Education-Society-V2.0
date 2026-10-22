import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CES_TOPICS, ChatTopic, Conversation, DyunoChat, STUDY_TOPICS } from '../../core/services/dyuno-chat.service';

/** The composer grows with the question up to this height, then scrolls. */
const COMPOSER_MAX_PX = 200;
const DAY_MS = 24 * 60 * 60 * 1000;
/** "Clear all" asks once more; the second click must come within this window. */
const CONFIRM_CLEAR_MS = 4000;

/**
 * Dyuno on a page of its own - the ChatGPT/Claude-style full view the floating panel's
 * expand button opens. Deliberately outside the main layout: no site header or footer,
 * just a slim top bar, so the whole height goes to the conversation.
 *
 * The thread is the same DyunoChat the floating panel uses, so it carries over both ways.
 * The left sidebar is the chat history (a drawer on phones), grouped by date like
 * ChatGPT's - all of it stored in this browser only.
 */
@Component({
  selector: 'app-dyuno',
  imports: [FormsModule, RouterLink],
  templateUrl: './dyuno.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dyuno.scss',
})
export class Dyuno {
  private readonly chat = inject(DyunoChat);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('thread') thread?: ElementRef<HTMLElement>;
  @ViewChild('composer') composer?: ElementRef<HTMLTextAreaElement>;

  readonly messages = this.chat.messages;
  readonly thinking = this.chat.thinking;
  /** A reply is still coming (maybe in another conversation) - Send waits for it. */
  readonly busy = this.chat.busy;
  readonly hasConversation = this.chat.hasConversation;
  /** Closed after repeated abuse - the composer becomes a "Start a new chat" button. */
  readonly closed = this.chat.closed;
  readonly activeId = this.chat.activeId;
  readonly hasHistory = computed(() => this.chat.chats().length > 0);
  readonly studyTopics = STUDY_TOPICS;
  readonly cesTopics = CES_TOPICS;

  /** History grouped like ChatGPT's sidebar: Today / Yesterday / Previous 7 days / Older. */
  readonly groups = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.getTime();
    const buckets = [
      { label: 'Today', from: start },
      { label: 'Yesterday', from: start - DAY_MS },
      { label: 'Previous 7 days', from: start - 7 * DAY_MS },
      { label: 'Older', from: -Infinity },
    ].map((b) => ({ ...b, chats: [] as Conversation[] }));
    for (const c of this.chat.chats()) buckets.find((b) => c.updatedAt >= b.from)!.chats.push(c);
    return buckets.filter((b) => b.chats.length);
  });

  draft = '';
  /** Where "Back" goes - the page the panel was opened from, else home. */
  returnTo = '/';
  /** Index of the answer whose Copy button just worked, for the brief "Copied" state. */
  readonly copied = signal<number | null>(null);
  /** "Share this chat" dialog: while open it shows the link being made, the link, or why it failed. */
  readonly shareOpen = signal(false);
  readonly shareUrl = signal<string | null>(null);
  readonly shareError = signal<string | null>(null);
  readonly linkCopied = signal(false);
  /** Browsers with a native share sheet (phones mostly) get a "More options" button. */
  readonly canNativeShare = signal(false);
  readonly whatsappHref = computed(() => `https://wa.me/?text=${encodeURIComponent(`Chat with Dyuno: ${this.shareUrl()}`)}`);
  private shareSub?: Subscription;
  /** The history drawer on phones/tablets; the sidebar is always shown on desktop. */
  readonly sidebarOpen = signal(false);
  readonly confirmClear = signal(false);
  private confirmTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.chat.restore();
      this.canNativeShare.set(typeof navigator.share === 'function');

      // Handed over by the floating panel's expand button (router navigation state).
      const state = history.state ?? {};
      if (typeof state.returnTo === 'string' && state.returnTo.startsWith('/') && !state.returnTo.startsWith('/dyuno')) {
        this.returnTo = state.returnTo;
      }
      if (typeof state.draft === 'string' && state.draft) {
        this.draft = state.draft;
        setTimeout(() => this.autoGrow());
      }
      this.composer?.nativeElement.focus();
    });

    // Keep the newest message in view as the thread grows or the typing dots appear.
    effect(() => {
      this.messages();
      this.thinking();
      this.scrollToBottom();
    });
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.busy()) return;
    this.draft = '';
    this.chat.ask(text);
    setTimeout(() => this.autoGrow());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.sidebarOpen.set(false);
    this.closeShare();
  }

  /** Enter sends, Shift+Enter starts a new line - and never mid-IME composition (Gujarati/Hindi input). */
  onComposerKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    e.preventDefault();
    this.send();
  }

  autoGrow(): void {
    const el = this.composer?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_PX)}px`;
  }

  /** Fresh conversation; the current one stays in the history. */
  newChat(): void {
    this.chat.newChat();
    this.sidebarOpen.set(false);
    this.draft = '';
    setTimeout(() => this.autoGrow());
    this.composer?.nativeElement.focus();
  }

  openChat(id: string): void {
    this.chat.open(id);
    this.sidebarOpen.set(false);
    this.composer?.nativeElement.focus();
  }

  deleteChat(id: string): void {
    this.chat.delete(id);
  }

  /** First click arms it, a second within a few seconds clears - no browser confirm() dialog. */
  clearHistory(): void {
    clearTimeout(this.confirmTimer);
    if (!this.confirmClear()) {
      this.confirmClear.set(true);
      this.confirmTimer = setTimeout(() => this.confirmClear.set(false), CONFIRM_CLEAR_MS);
      return;
    }
    this.confirmClear.set(false);
    this.chat.clearAll();
    this.sidebarOpen.set(false);
  }

  /** Suggestion cards ask straight away; "Other Queries" is the contact page. */
  runTopic(topic: ChatTopic): void {
    if (topic.label === 'Other Queries') {
      this.router.navigate(['/contact']);
      return;
    }
    this.chat.ask(topic.prompt);
  }

  copy(text: string, index: number): void {
    navigator.clipboard?.writeText(text).then(
      () => {
        this.copied.set(index);
        setTimeout(() => this.copied.set(null), 1500);
      },
      () => {
        // Clipboard blocked (insecure origin / permissions) - nothing useful to show.
      },
    );
  }

  /**
   * Opens the share dialog and makes (or reuses) the conversation's link. The dialog's own
   * buttons then copy or share it - a fresh click each, which the clipboard and the native
   * share sheet need (some browsers refuse them after waiting on a request).
   */
  share(): void {
    this.shareOpen.set(true);
    this.shareUrl.set(null);
    this.shareError.set(null);
    this.linkCopied.set(false);
    this.shareSub?.unsubscribe();
    this.shareSub = this.chat.shareLink().subscribe({
      next: (id) => this.shareUrl.set(`${location.origin}/dyuno/share/${id}`),
      error: (err) =>
        this.shareError.set(err?.error?.error?.message || "Couldn't create a link right now. Please try again."),
    });
  }

  closeShare(): void {
    this.shareSub?.unsubscribe();
    this.shareOpen.set(false);
  }

  copyLink(): void {
    const url = this.shareUrl();
    if (!url) return;
    navigator.clipboard?.writeText(url).then(
      () => {
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 1500);
      },
      () => {
        // Clipboard blocked - the link is still in the field to copy by hand.
      },
    );
  }

  nativeShare(): void {
    const url = this.shareUrl();
    if (!url) return;
    navigator.share({ title: 'Chat with Dyuno', url }).catch(() => {
      // Closing the sheet rejects too - nothing to show.
    });
  }

  /** Newest message into view - or, with no conversation, the top of the welcome screen. */
  private scrollToBottom(): void {
    if (!this.isBrowser) return;
    setTimeout(() => {
      const el = this.thread?.nativeElement;
      if (el) el.scrollTop = this.hasConversation() ? el.scrollHeight : 0;
    }, 30);
  }
}
