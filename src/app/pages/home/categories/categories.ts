import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ResourcesService } from '../../../core/services/resources.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [NgTemplateOutlet],
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './categories.scss',
})
export class Categories {
  institutes = toSignal(
    inject(ResourcesService).getInstitutes().pipe(
      map(list => (list || []).map(inst => ({
        ...inst,
        name: this.displayName(inst.name),
        logo: this.resolve(inst.logo),
        website: this.siteUrl(inst.website || inst.link || inst.url),
      })))
    ),
    { initialValue: [] }
  );

  private resolve(path?: string): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${environment.apiUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }

  /**
   * Names are shown as stored (no CSS uppercase - it made DM Sans look like a different
   * font), so tidy the admin-entered quirks: "Administration,Anand", "Vidhyalaya(Upper
   * Primary)", doubled spaces, and the odd all-caps entry ("CHAROTAR EDUCATION SOCIETY").
   * A one-word all-caps name is an acronym ("MBA") and stays as is.
   */
  private displayName(raw: string): string {
    const name = (raw || '')
      .replace(/\s*,\s*/g, ', ')
      .replace(/(\S)\(/g, '$1 (')
      .replace(/\s+/g, ' ')
      .trim();
    if (name !== name.toUpperCase() || !name.includes(' ')) return name;
    return name.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  }

  /**
   * Institute URLs are stored bare ("www.vzcom.ac.in", one with a trailing tab). As an
   * href that resolves as a path on this site, so add the scheme. '' = no website.
   */
  private siteUrl(raw?: string): string {
    const url = (raw || '').trim();
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }
}
