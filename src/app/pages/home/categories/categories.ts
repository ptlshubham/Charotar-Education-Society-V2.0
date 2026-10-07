import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ResourcesService } from '../../../core/services/resources.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './categories.scss',
})
export class Categories {
  institutes = toSignal(
    inject(ResourcesService).getInstitutes().pipe(
      map(list => (list || []).map(inst => ({
        ...inst,
        logo: this.resolve(inst.logo)
      })))
    ),
    { initialValue: [] }
  );

  private resolve(path?: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}
