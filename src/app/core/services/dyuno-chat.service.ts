import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription, map, of, tap, throwError } from 'rxjs';
import { ResourcesService } from './resources.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  /** Set on Dyuno's abuse notices, so they render as a warning (or a closed-chat) box. */
  notice?: 'warning' | 'closed';
  /** The backend's signature on a Dyuno answer - what lets it be shared (see shareLink). */
  sig?: string;
}

export interface ChatTopic {
  label: string;
  prompt: string;
}

/** One saved conversation - an entry in the /dyuno history sidebar. */
export interface Conversation {
  id: string;
  /** The first question, shortened - what the sidebar lists. */
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  /** Its share link, and the updatedAt it was taken at - unchanged since means the link is current. */
  share?: { id: string; at: number };
}

interface AssistantReply {
  text: string;
  grounded: boolean;
  sources: { url: string; title: string }[];
  /** Present when the reply is an abuse notice; the backend escalates warning -> final_warning -> closed. */
  moderation?: 'warning' | 'final_warning' | 'closed';
  /** Signature over (question, answer); never set on abuse notices. */
  sig?: string;
}

/**
 * Only for when the request itself fails - a network drop or a 5xx. An off-topic
 * question is a successful response carrying the backend's own redirect text, so it
 * never reaches this.
 */
const ERROR_REPLY =
  "Sorry, I couldn't reach our assistant just now. Please try again in a moment, or contact our support team.";

/** The backend rate-limits per visitor (429) - say so rather than blame the connection. */
const RATE_LIMIT_REPLY =
  "You're asking questions a bit quickly. Please wait a minute and try again.";

/**
 * Chat history is kept in this browser (localStorage), like ChatGPT/Claude's sidebar but
 * device-only: the site has no visitor accounts, so nothing is stored on the server. A
 * conversation only leaves the device as the history the backend already receives with
 * each question.
 */
const HISTORY_KEY = 'ces_ai_chats';
/** The single-conversation format this replaced - migrated once, then removed. */
const LEGACY_KEY = 'ces_ai_chat';
/** Conversations untouched this long are dropped - don't linger forever on a shared lab PC. */
const CHAT_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Most conversations kept; the oldest go first. */
const MAX_CHATS = 30;
/** Per conversation - plenty to continue from, and keeps storage small. */
const MAX_MESSAGES = 40;
const TITLE_CHARS = 60;

interface SavedHistory {
  activeId: string | null;
  chats: Conversation[];
}

/** Starter chips shown until the first message - in the floating panel and on /dyuno. */
export const STUDY_TOPICS: readonly ChatTopic[] = [
  { label: 'Explain a concept', prompt: "Explain Newton's three laws of motion in simple words with examples." },
  { label: 'Solve step by step', prompt: 'Solve step by step: x^2 - 5x + 6 = 0' },
  { label: 'Exam preparation', prompt: 'How should I prepare for my board exams in the last two months?' },
  { label: 'Study timetable', prompt: 'Help me make a weekly study timetable for school.' },
  { label: 'Career guidance', prompt: 'What career options do I have after 12th Science?' },
];

/** "Other Queries" is a link to /contact, not a question - each view handles it. */
export const CES_TOPICS: readonly ChatTopic[] = [
  { label: 'Admissions', prompt: 'How does the admission process work?' },
  { label: 'Institutes', prompt: 'Which institutes are part of Charotar Education Society?' },
  { label: 'Hostels', prompt: 'What hostel facilities does CES have?' },
  { label: 'Fees & Scholarships', prompt: 'What are the fees and scholarship options?' },
  { label: 'Other Queries', prompt: 'How do I get in touch with the institution?' },
];

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function titleFrom(question: string): string {
  const oneLine = question.replace(/\s+/g, ' ').trim();
  return oneLine.length > TITLE_CHARS ? `${oneLine.slice(0, TITLE_CHARS - 1)}…` : oneLine;
}

function isMessage(m: any): m is ChatMessage {
  return (
    (m?.role === 'user' || m?.role === 'assistant') &&
    typeof m.text === 'string' &&
    (m.notice === undefined || m.notice === 'warning' || m.notice === 'closed') &&
    (m.sig === undefined || typeof m.sig === 'string')
  );
}

/**
 * Dyuno's conversations, shared by the floating panel and the full /dyuno page so moving
 * between them keeps the thread. "New chat" starts a fresh conversation and keeps the old
 * one in the history; only Delete / Clear all remove anything.
 */
@Injectable({ providedIn: 'root' })
export class DyunoChat {
  private readonly resources = inject(ResourcesService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Newest first. */
  readonly chats = signal<Conversation[]>([]);
  /** The open conversation; null = a new chat that has no messages yet. */
  readonly activeId = signal<string | null>(null);

  readonly messages = computed(() => this.chats().find((c) => c.id === this.activeId())?.messages ?? []);
  readonly hasConversation = computed(() => this.messages().length > 0);
  /** Closed after repeated abuse - the views swap the composer for a "Start a new chat" button. */
  readonly closed = computed(() => this.messages().some((m) => m.notice === 'closed'));

  /** Which conversation the in-flight question belongs to - its reply goes there even if the visitor switches chats. */
  private readonly pendingChatId = signal<string | null>(null);
  /** A question is in flight somewhere - one at a time, so sending waits for it. */
  readonly busy = computed(() => this.pendingChatId() !== null);
  /** Typing dots - only in the conversation that is actually waiting. */
  readonly thinking = computed(() => this.busy() && this.pendingChatId() === this.activeId());

  private pending?: Subscription;
  /** Set once history has been read back, so the empty start never overwrites it. */
  private restored = false;

  constructor() {
    effect(() => {
      const saved: SavedHistory = { activeId: this.activeId(), chats: this.chats() };
      if (this.restored) this.save(saved);
    });
  }

  /**
   * Reads the history back. Views call this from afterNextRender - i.e. after hydration,
   * so the server-rendered empty state never mismatches. Runs once.
   */
  restore(): void {
    if (this.restored || !this.isBrowser) return;
    try {
      const saved = (JSON.parse(localStorage.getItem(HISTORY_KEY) || 'null') as SavedHistory | null) ?? this.migrateLegacy();
      const now = Date.now();
      const chats = (Array.isArray(saved?.chats) ? saved!.chats : [])
        .filter((c) => c && typeof c.id === 'string' && Array.isArray(c.messages) && c.messages.every(isMessage))
        .filter((c) => now - c.updatedAt < CHAT_TTL_MS && c.messages.length)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, MAX_CHATS);
      this.chats.set(chats);
      // Returning visitors pick up where they left off.
      this.activeId.set(chats.some((c) => c.id === saved?.activeId) ? saved!.activeId : null);
    } catch {
      // Unreadable entry or storage blocked - start fresh.
    }
    this.restored = true;
  }

  /** Start a fresh conversation. The current one stays in the history. */
  newChat(): void {
    this.activeId.set(null);
  }

  open(id: string): void {
    if (this.chats().some((c) => c.id === id)) this.activeId.set(id);
  }

  delete(id: string): void {
    if (this.pendingChatId() === id) this.cancelPending();
    this.chats.update((list) => list.filter((c) => c.id !== id));
    if (this.activeId() === id) this.activeId.set(null);
  }

  clearAll(): void {
    this.cancelPending();
    this.chats.set([]);
    this.activeId.set(null);
  }

  ask(text: string): void {
    if (this.busy() || this.closed()) return;

    let id = this.activeId();
    // Snapshot the thread before adding this turn - the backend wants the prior
    // conversation, not the question it is about to be asked.
    const history = this.messages();
    const now = Date.now();
    if (!id) {
      id = newId();
      this.chats.update((list) => [{ id: id!, title: titleFrom(text), createdAt: now, updatedAt: now, messages: [] }, ...list]);
      this.activeId.set(id);
    }
    this.append(id, { role: 'user', text });

    const chatId = id;
    this.pendingChatId.set(chatId);
    this.pending = this.resources.askAssistant(text, history).subscribe({
      next: (res: any) => {
        const reply = res?.data as AssistantReply | undefined;
        const notice = reply?.moderation === 'closed' ? 'closed' : reply?.moderation ? 'warning' : undefined;
        this.finish(chatId, reply?.text || ERROR_REPLY, notice, reply?.text ? reply.sig : undefined);
      },
      error: (err) => this.finish(chatId, err?.status === 429 ? RATE_LIMIT_REPLY : ERROR_REPLY),
    });
  }

  private finish(chatId: string, text: string, notice?: ChatMessage['notice'], sig?: string): void {
    const message: ChatMessage = notice ? { role: 'assistant', text, notice } : sig ? { role: 'assistant', text, sig } : { role: 'assistant', text };
    this.append(chatId, message);
    this.pendingChatId.set(null);
  }

  /**
   * The open conversation's share-link id. Sharing again with no new messages reuses the link;
   * once the conversation moves on, a new snapshot (and link) is made. Only signed answers are
   * sent - the backend drops anything it didn't write itself.
   */
  shareLink(): Observable<string> {
    const chat = this.chats().find((c) => c.id === this.activeId());
    if (!chat) return throwError(() => new Error('No conversation to share'));
    if (chat.share?.at === chat.updatedAt) return of(chat.share.id);

    const turns = chat.messages.flatMap((m, i) => {
      const question = chat.messages[i - 1];
      return m.role === 'assistant' && m.sig && question?.role === 'user'
        ? [{ question: question.text, answer: m.text, sig: m.sig }]
        : [];
    });
    const at = chat.updatedAt;
    return this.resources.shareAssistantChat(turns).pipe(
      map((res: any) => {
        const id = res?.data?.id;
        if (typeof id !== 'string') throw new Error('No link id in the response');
        return id;
      }),
      tap((id) => this.chats.update((list) => list.map((c) => (c.id === chat.id ? { ...c, share: { id, at } } : c)))),
    );
  }

  /** "Continue this chat" on a shared link: the snapshot becomes a new conversation here. */
  importShared(title: string, messages: ChatMessage[]): void {
    this.restore();
    const copy = messages.filter(isMessage).map(({ role, text, sig }): ChatMessage => (sig ? { role, text, sig } : { role, text }));
    if (!copy.length) return;
    const now = Date.now();
    const id = newId();
    this.chats.update((list) => [{ id, title: titleFrom(title), createdAt: now, updatedAt: now, messages: copy }, ...list].slice(0, MAX_CHATS));
    this.activeId.set(id);
  }

  private cancelPending(): void {
    this.pending?.unsubscribe();
    this.pendingChatId.set(null);
  }

  /** Adds a message and moves its conversation to the top of the history. */
  private append(chatId: string, message: ChatMessage): void {
    this.chats.update((list) => {
      const chat = list.find((c) => c.id === chatId);
      if (!chat) return list;
      const updated: Conversation = { ...chat, updatedAt: Date.now(), messages: [...chat.messages, message] };
      return [updated, ...list.filter((c) => c.id !== chatId)];
    });
  }

  /** The old single-conversation entry, as one history item. */
  private migrateLegacy(): SavedHistory | null {
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null') as { savedAt: number; messages: ChatMessage[] } | null;
    localStorage.removeItem(LEGACY_KEY);
    const firstQuestion = old?.messages?.find((m) => m.role === 'user')?.text;
    if (!old || !firstQuestion) return null;
    const id = newId();
    return {
      activeId: id,
      chats: [{ id, title: titleFrom(firstQuestion), createdAt: old.savedAt, updatedAt: old.savedAt, messages: old.messages }],
    };
  }

  private save(saved: SavedHistory): void {
    try {
      if (!saved.chats.length) {
        localStorage.removeItem(HISTORY_KEY);
        return;
      }
      const chats = saved.chats
        .slice(0, MAX_CHATS)
        .map((c) => (c.messages.length > MAX_MESSAGES ? { ...c, messages: c.messages.slice(-MAX_MESSAGES) } : c));
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ activeId: saved.activeId, chats }));
    } catch {
      // Storage full or blocked (private mode) - the chat still works, it just won't persist.
    }
  }
}
