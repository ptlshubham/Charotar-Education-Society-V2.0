import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class ErrorComponent {}
