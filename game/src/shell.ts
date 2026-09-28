import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { GameComponent } from './game';
import { ArcadeComponent } from './platformer/arcade';

type Route = 'quiz' | 'arcade';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.html',
  imports: [GameComponent, ArcadeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly route = signal<Route>('quiz');

  constructor() {
    this.readRoute();
  }

  @HostListener('window:hashchange')
  readRoute(): void {
    this.route.set(window.location.hash.startsWith('#/arcade') ? 'arcade' : 'quiz');
  }
}
