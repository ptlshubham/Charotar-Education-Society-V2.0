import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  effect,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssistantBridge } from '../../core/services/assistant-bridge.service';
import { CES_TOPICS, ChatTopic, DyunoChat, STUDY_TOPICS } from '../../core/services/dyuno-chat.service';

/** Dyuno mascot frames - /assets/icons/dyuno/dyuno-<frame>.webp, all on one canvas so they swap in place. */
type DyunoFrame = 'stand' | 'wave' | `walk-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

/** One beat of a mascot animation: show `frame` for `ms`. */
type DyunoStep = readonly [frame: DyunoFrame, ms: number];

/**
 * One walk cycle = two steps: near foot lands, rolls, pushes off, legs pass (1-4), then
 * the far foot does the same (5-8). The files are already numbered in walking order.
 */
const WALK_CYCLE: readonly DyunoFrame[] = ['walk-1', 'walk-2', 'walk-3', 'walk-4', 'walk-5', 'walk-6', 'walk-7', 'walk-8'];
/** 2 cycles = 4 steps of ~27px over the 110px slide-in - about one stride each, so feet don't skate. */
const WALK_STEP_MS = 110;
const WALK_CYCLES = 2;
const WALK_IN: readonly DyunoStep[] = Array.from({ length: WALK_CYCLES }).flatMap(() =>
  WALK_CYCLE.map((f): DyunoStep => [f, WALK_STEP_MS]),
);

/** Hand up-down-up, hold, then back to rest - at launcher size this reads as a wave. */
const WAVE: readonly DyunoStep[] = [
  ['wave', 380],
  ['stand', 160],
  ['wave', 380],
  ['stand', 160],
  ['wave', 900],
  ['stand', 0],
];

/** How often an idle Dyuno waves to catch the eye. */
const IDLE_WAVE_MS = 8000;

/**
 * Floating AI assistant - the launcher button and its chat panel live together so the
 * layout only needs <app-ai-assistant />.
 *
 * The conversation itself lives in DyunoChat, shared with the full /dyuno page - the
 * expand button opens that page with the same thread. Nothing here decides what is
 * on-topic; the backend does.
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
  private bridge = inject(AssistantBridge);
  private chat = inject(DyunoChat);

  @ViewChild('scrollBody') scrollBody?: ElementRef<HTMLElement>;

  readonly open = signal(false);
  readonly minimized = signal(false);
  readonly messages = this.chat.messages;
  readonly thinking = this.chat.thinking;
  /** A reply is still coming (maybe in another conversation) - Send waits for it. */
  readonly busy = this.chat.busy;
  /** Closed after repeated abuse - the composer becomes a "Start a new chat" button. */
  readonly closed = this.chat.closed;
  /** Greeting + shortcuts show until the first message is sent. */
  readonly hasConversation = this.chat.hasConversation;
  draft = '';

  // ─── Landing greeting ───

  /** The proactive bubble beside the launcher, shown shortly after landing. */
  readonly greeting = 'Stuck on a topic? Ask me any study question, or anything about Charotar Education Society.';
  readonly greetingVisible = signal(false);

  /** Session-scoped so the bubble greets once, not on every page load. */
  private static readonly GREETED_KEY = 'ces_ai_greeted';
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

  // ─── Dyuno launcher animation ───

  readonly dyunoFrames: readonly DyunoFrame[] = ['stand', 'wave', ...WALK_CYCLE];
  readonly dyunoFrame = signal<DyunoFrame>('stand');
  /** Hidden until the browser takes over, so SSR doesn't paint him before he walks in. */
  readonly dyunoReady = signal(false);
  readonly dyunoWalkingIn = signal(false);
  /** Drives the CSS slide-in so it lasts exactly as long as the walk frames. */
  readonly walkInMs = WALK_IN.length * WALK_STEP_MS;

  private dyunoTimer?: number;
  private dyunoIdle?: number;
  private dyunoBusy = false;
  private reducedMotion = false;

  constructor() {
    // The inline Dyuno card on the home page hands its question over here.
    effect(() => {
      const req = this.bridge.request();
      if (!req || !isPlatformBrowser(this.platformId)) return;
      this.dismissGreeting();
      this.open.set(true);
      this.minimized.set(false);
      if (req.prompt) this.ask(req.prompt);
      else this.scrollToBottom();
    });

    // Bring back the last conversation (after hydration - there is no storage under SSR).
    afterNextRender(() => this.chat.restore());

    // Keep the newest message in view as the thread grows or the typing dots appear.
    effect(() => {
      this.messages();
      this.thinking();
      this.scrollToBottom();
    });

    // Dyuno walks in from the right edge, waves, then waves now and then while idle.
    afterNextRender(() => this.startDyuno());

    // afterNextRender keeps this out of SSR entirely - no timers or storage there,
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
          // Banner ignored - stop burning timers; no greeting this session.
          this.clearConsentPoll();
        }
      }, AiAssistant.CONSENT_POLL_MS);
    });
  }

  ngOnDestroy(): void {
    if (this.greetingTimer) clearTimeout(this.greetingTimer);
    this.clearConsentPoll();
    clearTimeout(this.dyunoTimer);
    clearInterval(this.dyunoIdle);
  }

  private startDyuno(): void {
    this.reducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      // No walking or waving - just a friendly static hello.
      this.dyunoFrame.set('wave');
      this.dyunoReady.set(true);
      return;
    }

    this.dyunoReady.set(true);
    this.dyunoWalkingIn.set(true);
    this.dyunoBusy = true;
    this.playDyuno(WALK_IN, () => {
      this.dyunoWalkingIn.set(false);
      this.playDyuno([['stand', 300], ...WAVE], () => (this.dyunoBusy = false));
    });

    this.dyunoIdle = window.setInterval(() => {
      if (document.visibilityState === 'visible') this.waveDyuno();
    }, IDLE_WAVE_MS);
  }

  /** Waves once - on hover, when the greeting pops up, and on the idle timer. */
  waveDyuno(): void {
    if (this.reducedMotion || this.dyunoBusy || !this.dyunoReady()) return;
    if (this.open() && !this.minimized()) return;   // launcher isn't on screen
    this.dyunoBusy = true;
    this.playDyuno(WAVE, () => (this.dyunoBusy = false));
  }

  /** Shows each step's frame for its duration, then calls `done`. */
  private playDyuno(steps: readonly DyunoStep[], done: () => void): void {
    clearTimeout(this.dyunoTimer);
    let i = 0;
    const next = () => {
      if (i >= steps.length) return done();
      const [frame, ms] = steps[i++];
      this.dyunoFrame.set(frame);
      this.dyunoTimer = window.setTimeout(next, ms);
    };
    next();
  }

  private scheduleGreeting(): void {
    this.greetingTimer = window.setTimeout(() => {
      // Don't interrupt someone who already opened the panel themselves.
      if (!this.open()) {
        this.greetingVisible.set(true);
        this.waveDyuno();
      }
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
      // Storage blocked - the banner can't persist either, so don't wait on it.
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
      // Private mode / storage disabled - greet anyway rather than fail.
      return false;
    }
  }

  private markGreeted(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      sessionStorage.setItem(AiAssistant.GREETED_KEY, '1');
    } catch {
      // Nothing to do - worst case the bubble greets again next load.
    }
  }

  /** Shown as tappable chips until the visitor sends their first message. */
  readonly studyTopics = STUDY_TOPICS;
  readonly cesTopics = CES_TOPICS;

  toggle(): void {
    // Any deliberate open retires the greeting - it has done its job.
    if (this.greetingVisible()) this.dismissGreeting();

    if (this.open() && this.minimized()) {
      this.minimized.set(false);
      this.scrollToBottom();
      return;
    }
    this.open.update((v) => !v);
    this.minimized.set(false);
    // A restored conversation should open at its latest message, not the top.
    if (this.open()) this.scrollToBottom();
  }

  close(): void {
    this.open.set(false);
    this.minimized.set(false);
  }

  minimize(): void {
    this.minimized.set(true);
  }

  /**
   * Continue on the full /dyuno page. The thread is shared, so nothing is lost; the
   * page's Back link returns here, and a half-typed question comes along too.
   */
  openFullPage(): void {
    const state = { returnTo: this.router.url, draft: this.draft };
    this.draft = '';
    this.close();
    this.router.navigate(['/dyuno'], { state });
  }

  /** New chat - back to the greeting. The previous conversation stays in the history. */
  newChat(): void {
    this.chat.newChat();
    this.draft = '';
  }

  send(): void {
    const text = this.draft.trim();
    if (!text || this.busy()) return;
    this.draft = '';
    this.ask(text);
  }

  ask(text: string): void {
    this.chat.ask(text);
  }

  /** Topic chips double as navigation when there's a page for it. */
  runTopic(topic: ChatTopic): void {
    if (topic.label === 'Other Queries') {
      this.close();
      this.router.navigate(['/contact']);
      return;
    }
    this.ask(topic.prompt);
  }

  /** Newest message into view - or, with no conversation, the top of the greeting. */
  private scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      const el = this.scrollBody?.nativeElement;
      if (el) el.scrollTop = this.hasConversation() ? el.scrollHeight : 0;
    }, 30);
  }
}
