/**
 * Runs after `ng build`. Some page URLs share their name with a folder that already sits in
 * the host's public_html: Hostinger keeps each subdomain's files in public_html/<subdomain>, so
 * public_html/chatkaro is chatkaro.cesociety.in. The build would put the /chatkaro page in a
 * chatkaro/ folder too, and uploading it clashes with (or overwrites) the subdomain's files.
 *
 * So each such page moves to <name>.html at the root, and .htaccess serves /<name> from that
 * file on the main site. The subdomain's folder is never part of the upload.
 *
 * Run via the build scripts (`npm run build:prod` etc.) - a bare `ng build` skips it.
 */
import { existsSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/** Folders in public_html that belong to subdomains - keep in step with public/.htaccess. */
const SUBDOMAIN_FOLDERS = ['chatkaro'];

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browser = resolve(root, 'dist/charotar-education-society-v2/browser');

for (const name of SUBDOMAIN_FOLDERS) {
  const dir = resolve(browser, name);
  const page = resolve(dir, 'index.html');
  if (!existsSync(page)) continue;
  renameSync(page, resolve(browser, `${name}.html`));
  if (readdirSync(dir).length) throw new Error(`${name}/ holds more than the page - it can't be uploaded next to the subdomain's folder`);
  rmdirSync(dir);
  console.log(`after-build - /${name} page moved to ${name}.html (public_html/${name} is a subdomain's folder)`);
}
