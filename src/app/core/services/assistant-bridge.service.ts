import { Injectable, signal } from '@angular/core';

/**
 * Lets page sections hand a question to the floating assistant without owning it.
 * The inline Dyuno card on the home page is a shopfront - the real chat, its
 * transport and its history all stay in <app-ai-assistant />. The full /dyuno page
 * uses it too, to minimize back into the floating panel.
 *
 * `seq` makes each request distinct so asking the same question twice still fires.
 * The assistant clears a request once handled, so one left over doesn't fire again
 * when the layout (and the assistant with it) is rebuilt after a visit to /dyuno.
 */
@Injectable({ providedIn: 'root' })
export class AssistantBridge {
  private seq = 0;
  readonly request = signal<{ prompt: string; draft?: string; seq: number } | null>(null);

  /** Opens the assistant; with a prompt, sends it straight away; a draft is put in the composer. */
  open(prompt = '', draft = ''): void {
    this.request.set({ prompt, draft, seq: ++this.seq });
  }
}
