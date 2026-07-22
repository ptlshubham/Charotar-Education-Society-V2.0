import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourcesService } from '../../core/services/resources.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AssistantReply {
  text: string;
  grounded: boolean;
  sources: { url: string; title: string }[];
}

interface QuickAction {
  icon: string;
  title: string;
  desc: string;
  prompt: string;
}

/**
 * Only for when the request itself fails — a network drop or a 5xx. An off-topic
 * question is a successful response carrying the backend's own fallback text, so it
 * never reaches this.
 */
const ERROR_REPLY =
  "Sorry, I couldn't reach our assistant just now. Please try again in a moment, or contact our support team.";

/**
 * Floating AI assistant — the launcher button and its chat panel live together so the
 * layout only needs <app-ai-assistant />.
 *
 * Answers come from the backend, which only replies from indexed website content and
 * returns a fallback message for anything else. Nothing here decides what is on-topic.
 */
@Component({
  selector: 'app-ai-assistant',
  imports: [FormsModule],
  templateUrl: './ai-assistant.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ai-assistant.scss',
})
export class AiAssistant implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private resources = inject(ResourcesService);

  @ViewChild('scrollBody') scrollBody?: ElementRef<HTMLElement>;

  readonly open = signal(false);
  readonly minimized = signal(false);
  readonly thinking = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  draft = '';

  // ─── Landing greeting ───

  /** The proactive bubble beside the launcher, shown shortly after landing. */
  readonly greeting = 'Need a hand? Ask me anything about Charotar Education Society.';
  readonly greetingVisible = signal(false);

  /** Session-scoped so the bubble greets once, not on every page load. */
  private static readonly GREETED_KEY = 'zarklyx_ai_greeted';
  /** Written by the cookie banner once the visitor has answered it. */
  private static readonly CONSENT_KEY = 'cookie_consent';
  /** Beat after the cookie banner clears, so the two don't animate over each other. */
  private static readonly GREETING_DELAY_MS = 1200;
  /** How often to re-check whether the cookie banner has been answered. */
  private static readonly CONSENT_POLL_MS = 600;
  /** Give up waiting rather than poll forever if the banner is ignored. */
  private static readonly CONSENT_WAIT_LIMIT_MS = 90_000;

  private greetingTimer?: number;
  private consentPoll?: number;

  constructor() {
    // afterNextRender keeps this out of SSR entirely — no timers or storage there,
    // and the bubble is a client-side affordance anyway.
    afterNextRender(() => {
      if (this.alreadyGreeted()) return;

      // The cookie banner is a full-screen overlay (z-10000) that slides in on a
      // 2.5s delay. Greeting underneath it would waste the one shot we get, so
      // wait until the visitor has answered it.
      if (this.consentAnswered()) {
        this.scheduleGreeting();
        return;
      }

      const waitingSince = Date.now();
      this.consentPoll = window.setInterval(() => {
        if (this.consentAnswered()) {
          this.clearConsentPoll();
          this.scheduleGreeting();
        } else if (Date.now() - waitingSince > AiAssistant.CONSENT_WAIT_LIMIT_MS) {
          // Banner ignored — stop burning timers; no greeting this session.
          this.clearConsentPoll();
        }
      }, AiAssistant.CONSENT_POLL_MS);
    });
  }

  ngOnDestroy(): void {
    if (this.greetingTimer) clearTimeout(this.greetingTimer);
    this.clearConsentPoll();
  }

  private scheduleGreeting(): void {
    this.greetingTimer = window.setTimeout(() => {
      // Don't interrupt someone who already opened the panel themselves.
      if (!this.open()) this.greetingVisible.set(true);
    }, AiAssistant.GREETING_DELAY_MS);
  }

  private clearConsentPoll(): void {
    if (this.consentPoll) {
      clearInterval(this.consentPoll);
      this.consentPoll = undefined;
    }
  }

  /** True once the cookie banner has been answered (any of accept/reject/save). */
  private consentAnswered(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    try {
      return !!localStorage.getItem(AiAssistant.CONSENT_KEY);
    } catch {
      // Storage blocked — the banner can't persist either, so don't wait on it.
      return true;
    }
  }

  /** Hides the bubble and makes sure it doesn't come back this session. */
  dismissGreeting(): void {
    this.greetingVisible.set(false);
    if (this.greetingTimer) clearTimeout(this.greetingTimer);
    this.markGreeted();
  }

  /** Clicking the bubble opens the assistant, same as the launcher. */
  openFromGreeting(): void {
    this.dismissGreeting();
    this.toggle();
  }

  private alreadyGreeted(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true;
    try {
      return sessionStorage.getItem(AiAssistant.GREETED_KEY) === '1';
    } catch {
      // Private mode / storage disabled — greet anyway rather than fail.
      return false;
    }
  }

  private markGreeted(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      sessionStorage.setItem(AiAssistant.GREETED_KEY, '1');
    } catch {
      // Nothing to do — worst case the bubble greets again next load.
    }
  }

  /** Greeting + shortcuts show until the first message is sent. */
  readonly hasConversation = computed(() => this.messages().length > 0);

  readonly quickActions: QuickAction[] = [
    {
      icon: 'info',
      title: 'About Us',
      desc: 'Learn about our institution',
      prompt: 'Tell me about Charotar Education Society.',
    },
    {
      icon: 'calendar',
      title: 'Admissions',
      desc: 'Admission process and dates',
      prompt: 'How does the admission process work?',
    },
    {
      icon: 'plug',
      title: 'Courses',
      desc: 'Programmes we offer',
      prompt: 'Which courses and programmes do you offer?',
    },
    {
      icon: 'tag',
      title: 'Contact',
      desc: 'Reach the right team',
      prompt: 'How do I get in touch with the institution?',
    },
  ];

  readonly suggested: readonly string[] = [
    'What is Charotar Education Society?',
    'Which courses do you offer?',
    'How does the admission process work?',
    'Where is the campus located?',
    'How can I contact the institution?',
  ];

  toggle(): void {
    // Any deliberate open retires the greeting — it has done its job.
    if (this.greetingVisible()) this.dismissGreeting();

    if (this.open() && this.minimized()) {
      this.minimized.set(false);
      return;
    }
    this.open.update((v) => !v);
    this.minimized.set(false);
  }

  close(): void {
    this.open.set(false);
    this.minimized.set(false);
  }

  minimize(): void {
    this.minimized.set(true);
  }

  /** Start over — clears the thread back to the greeting. */
  reset(): void {
    this.messages.set([]);
    this.draft = '';
    this.thinking.set(false);
  }

  send(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.draft = '';
    this.ask(text);
  }

  ask(text: string): void {
    if (this.thinking()) return;

    // Snapshot the thread before adding this turn — the backend wants the prior
    // conversation, not the question it is about to be asked.
    const history = this.messages();
    this.messages.update((list) => [...list, { role: 'user', text }]);
    this.scrollToBottom();
    this.thinking.set(true);

    this.resources.askAssistant(text, history).subscribe({
      next: (res: any) => {
        const reply = res?.data as AssistantReply | undefined;
        this.pushReply(reply?.text || ERROR_REPLY);
      },
      error: () => this.pushReply(ERROR_REPLY),
    });
  }

  private pushReply(text: string): void {
    this.messages.update((list) => [...list, { role: 'assistant', text }]);
    this.thinking.set(false);
    this.scrollToBottom();
  }

  /** Quick action cards double as navigation when there's a page for it. */
  runAction(action: QuickAction): void {
    if (action.title === 'Contact') {
      this.close();
      this.router.navigate(['/contact']);
      return;
    }
    this.ask(action.prompt);
  }

  private scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      const el = this.scrollBody?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 30);
  }
}
