import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Resolves a backend media path into a full URL. Absolute URLs pass through;
 * relative paths (e.g. "uploads/navratri/cover.jpg") are prefixed with the API
 * host. Mirrors the legacy site's `apiUrl` pipe.
 *
 *   <img [src]="entry.coverimage | mediaUrl" />
 */
@Pipe({ name: 'mediaUrl', standalone: true })
export class MediaUrlPipe implements PipeTransform {
  transform(path: string | null | undefined): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const base = environment.apiUrl.replace(/\/+$/, '');
    return `${base}/${path.replace(/^\/+/, '')}`;
  }
}
