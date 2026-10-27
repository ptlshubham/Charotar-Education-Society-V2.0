import { Pipe, PipeTransform } from '@angular/core';

/**
 * Chat-sized Markdown → HTML, for Dyuno's answers: paragraphs and line breaks, headings, bold,
 * italic, strikethrough, inline code and code blocks, bullet and numbered lists (nested by
 * indent), quotes, tables, rules and links. Not a full CommonMark parser - just what a chat
 * answer uses. Style the output with the global `.chat-md` class (styles.scss).
 *
 * Safe by construction: the text is HTML-escaped before any tag is added, and only http(s)
 * links are made. Bind it with [innerHTML] - no bypass - so Angular's sanitizer checks it again.
 *
 *   <div class="chat-md" [innerHTML]="m.text | markdown"></div>
 */
@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return renderMarkdown(value ?? '');
  }
}

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>/;
const LIST_ITEM = /^(\s*)([-*+•]|\d{1,3}[.)])\s+(.*)$/;
const TABLE_RULE = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/;

export function renderMarkdown(src: string): string {
  const lines = src
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/^\t+/, (tabs) => '    '.repeat(tabs.length)));
  return blocks(lines);
}

function blocks(lines: string[]): string {
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (FENCE.test(line)) {
      const [code, next] = fenced(lines, i);
      out.push(`<pre><code>${esc(code)}</code></pre>`);
      i = next;
    } else if (HEADING.test(line)) {
      const [, hashes, text] = line.match(HEADING)!;
      // # and ## read as section titles in a chat answer; h1/h2 would shout.
      const tag = hashes.length <= 2 ? 'h3' : hashes.length === 3 ? 'h4' : 'h5';
      out.push(`<${tag}>${inline(text)}</${tag}>`);
      i++;
    } else if (RULE.test(line)) {
      out.push('<hr>');
      i++;
    } else if (QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) body.push(lines[i++].replace(/^\s{0,3}>\s?/, ''));
      out.push(`<blockquote>${blocks(body)}</blockquote>`);
    } else if (isTable(lines, i)) {
      const [html, next] = table(lines, i);
      out.push(html);
      i = next;
    } else if (LIST_ITEM.test(line)) {
      const [html, next] = list(lines, i);
      out.push(html);
      i = next;
    } else {
      // A paragraph keeps its line breaks, as the plain-text answers always did.
      const para = [lines[i++].trim()];
      while (i < lines.length && lines[i].trim() && !startsBlock(lines, i)) para.push(lines[i++].trim());
      out.push(`<p>${para.map(inline).join('<br>')}</p>`);
    }
  }
  return out.join('');
}

function startsBlock(lines: string[], i: number): boolean {
  const line = lines[i];
  return FENCE.test(line) || HEADING.test(line) || RULE.test(line) || QUOTE.test(line) || LIST_ITEM.test(line) || isTable(lines, i);
}

/** A fenced code block from its opening line: [the code, the index after the closing fence]. */
function fenced(lines: string[], start: number): [string, number] {
  const marker = lines[start].match(FENCE)![1];
  const indent = lines[start].match(/^\s*/)![0].length;
  const body: string[] = [];
  let i = start + 1;
  // An unclosed fence runs to the end, so a cut-off answer still shows its code.
  while (i < lines.length && !lines[i].trim().startsWith(marker)) body.push(lines[i++].replace(new RegExp(`^ {0,${indent}}`), ''));
  return [body.join('\n'), i + 1];
}

function isTable(lines: string[], i: number): boolean {
  return lines[i].includes('|') && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1]);
}

function table(lines: string[], start: number): [string, number] {
  const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const align = cells(lines[start + 1]).map((c) => (c.endsWith(':') ? (c.startsWith(':') ? 'center' : 'right') : ''));
  const cell = (tag: string, text: string, col: number) =>
    `<${tag}${align[col] ? ` align="${align[col]}"` : ''}>${inline(text)}</${tag}>`;

  const head = cells(lines[start]).map((c, col) => cell('th', c, col)).join('');
  const rows: string[] = [];
  let i = start + 2;
  while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
    rows.push(`<tr>${cells(lines[i++]).map((c, col) => cell('td', c, col)).join('')}</tr>`);
  }
  // The wrapper scrolls sideways, so a wide table never widens the chat.
  return [`<div class="chat-md-table"><table><thead><tr>${head}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`, i];
}

interface Item {
  indent: number;
  ordered: boolean;
  num: number;
  /** The item's own lines, de-indented - rendered as blocks, so it can hold code or paragraphs. */
  lines: string[];
}

/** A run of list items, nested by indent: [html, index after the list]. */
function list(lines: string[], start: number): [string, number] {
  const items: Item[] = [];
  let contentIndent = 0;
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(LIST_ITEM);
    if (m) {
      contentIndent = m[1].length + m[2].length + 1;
      items.push({ indent: m[1].length, ordered: /\d/.test(m[2]), num: parseInt(m[2], 10), lines: [m[3]] });
      i++;
    } else if (FENCE.test(line)) {
      // A code block inside an item (usually indented under it) - kept whole, blank lines and all.
      const end = fenced(lines, i)[1];
      const dedent = new RegExp(`^ {0,${contentIndent}}`);
      items.at(-1)!.lines.push(...lines.slice(i, end).map((l) => l.replace(dedent, '')));
      i = end;
    } else if (!line.trim()) {
      // A blank line ends the list unless an item or indented text follows.
      const next = lines[i + 1];
      if (next === undefined || !(LIST_ITEM.test(next) || /^\s{2,}\S/.test(next))) break;
      items.at(-1)!.lines.push('');
      i++;
    } else if (/^\s/.test(line) || !startsBlock(lines, i)) {
      // Text under an item (indented or not) belongs to it, as in CommonMark.
      items.at(-1)!.lines.push(line.replace(new RegExp(`^ {0,${contentIndent}}`), ''));
      i++;
    } else {
      break;
    }
  }

  let html = '';
  const open: { indent: number; tag: string }[] = [];
  for (const item of items) {
    const tag = item.ordered ? 'ol' : 'ul';
    const openList = () => {
      html += `<${tag}${item.ordered && item.num !== 1 ? ` start="${item.num}"` : ''}>`;
      open.push({ indent: item.indent, tag });
    };
    while (open.length && item.indent < open.at(-1)!.indent) html += `</li></${open.pop()!.tag}>`;
    const top = open.at(-1);
    if (!top || item.indent > top.indent) {
      openList();
    } else if (top.tag !== tag) {
      // "1." after "-" at the same depth: a new list of the other kind.
      html += `</li></${open.pop()!.tag}>`;
      openList();
    } else {
      html += '</li>';
    }
    html += `<li>${itemBody(item.lines)}`;
  }
  while (open.length) html += `</li></${open.pop()!.tag}>`;
  return [html, i];
}

/** An item's content - a lone paragraph is unwrapped, so a plain list stays tight. */
function itemBody(lines: string[]): string {
  while (lines.length && !lines.at(-1)!.trim()) lines.pop();
  const html = blocks(lines);
  const lone = html.match(/^<p>(.*)<\/p>$/s);
  return lone && !lone[1].includes('<p>') ? lone[1] : html;
}

/** Inline formatting for one line of text, HTML-escaped. */
function inline(text: string): string {
  // Code spans and links are set aside first so nothing inside them is formatted or linked twice.
  const kept: string[] = [];
  const keep = (html: string) => `\u0000${kept.push(html) - 1}\u0000`;
  const link = (url: string, label: string) =>
    keep(`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);

  const html = esc(
    text
      .replace(/`([^`]+)`/g, (_, code: string) => keep(`<code>${esc(code)}</code>`))
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label: string, url: string) => link(url, esc(label)))
      .replace(/https?:\/\/[^\s<>"'`]+/g, (raw) => {
        const url = raw.replace(/[.,;:!?)\]]+$/, ''); // sentence punctuation after a bare URL
        return link(url, esc(url)) + raw.slice(url.length);
      }),
  )
    // ** only on word boundaries, so code like x**2 + y**2 is left as written. No lookbehind
    // (older iPhones can't parse it) and no _/__ forms (they would eat snake_case and __init__).
    .replace(/(^|[^\w*])\*\*(\S|\S.*?\S)\*\*(?![\w*])/g, '$1<strong>$2</strong>')
    .replace(/(^|[^\w*])\*(\S|\S.*?\S)\*(?![\w*])/g, '$1<em>$2</em>')
    .replace(/~~(\S|\S.*?\S)~~/g, '<del>$1</del>');

  return html.replace(/\u0000(\d+)\u0000/g, (_, n: string) => kept[+n]);
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
