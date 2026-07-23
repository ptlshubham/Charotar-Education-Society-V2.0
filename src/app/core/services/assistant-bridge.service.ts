import { Injectable, signal } from '@angular/core';

/**
 * Lets page sections hand a question to the floating assistant without owning it.
 * The inline Sarthi card on the home page is a shopfront — the real chat, its
 * transport and its history all stay in <app-ai-assistant />.
 *
 * `seq` makes each request distinct so asking the same question twice still fires.
 */
@Injectable({ providedIn: 'root' })
export class AssistantBridge {
  private seq = 0;
  readonly request = signal<{ prompt: string; seq: number } | null>(null);

  /** Opens the assistant; with a prompt, sends it straight away. */
  open(prompt = ''): void {
    this.request.set({ prompt, seq: ++this.seq });
  }
}
