import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-modules',
    imports: [RouterOutlet],
    template: `<router-outlet />`
})
export class IntegrationComponent { }