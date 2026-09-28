import type { SpriteSlot } from './sprites.ts';

const keyed = new WeakMap<HTMLImageElement, HTMLCanvasElement>();
// Key only border-connected black matte. Preserve enclosed eyes and lettering.
const sourceCanvas = (image: HTMLImageElement, keyBlack: boolean): HTMLCanvasElement => {
  const cached = keyBlack ? keyed.get(image) : undefined;
  if (cached) return cached;
  const c = document.createElement('canvas'); c.width = image.naturalWidth; c.height = image.naturalHeight;
  const ctx = c.getContext('2d', { willReadFrequently: true })!; ctx.drawImage(image, 0, 0);
  if (!keyBlack) return c;
  const pixels = ctx.getImageData(0, 0, c.width, c.height), d = pixels.data;
  const visited = new Uint8Array(c.width * c.height), queue = new Int32Array(visited.length);
  let count = 0;
  const add = (p: number): void => {
    if (visited[p]) return;
    const i = p * 4;
    if (d[i + 3] > 4 && Math.max(d[i], d[i + 1], d[i + 2]) > 18) return;
    visited[p] = 1; d[i + 3] = 0; queue[count++] = p;
  };
  for (let x = 0; x < c.width; x++) { add(x); add((c.height - 1) * c.width + x); }
  for (let y = 0; y < c.height; y++) { add(y * c.width); add(y * c.width + c.width - 1); }
  for (let i = 0; i < count; i++) {
    const p = queue[i], x = p % c.width;
    if (x) add(p - 1); if (x + 1 < c.width) add(p + 1);
    if (p >= c.width) add(p - c.width); if (p + c.width < visited.length) add(p + c.width);
  }
  ctx.putImageData(pixels, 0, 0); keyed.set(image, c); return c;
};

export const assembleAtlas = (image: HTMLImageElement, slot: SpriteSlot, images: Readonly<Record<string, HTMLImageElement>> = {}): HTMLCanvasElement => {
  const canvas = document.createElement('canvas'), scale = 4;
  const fw = slot.frameW * scale, fh = slot.frameH * scale;
  canvas.width = fw * slot.cols; canvas.height = fh * slot.rows;
  const ctx = canvas.getContext('2d')!;
  const inputs = new Map<HTMLImageElement, { canvas: HTMLCanvasElement; pixels: Uint8ClampedArray }>();
  const input = (im: HTMLImageElement) => {
    let data = inputs.get(im);
    if (!data) { const c = sourceCanvas(im, !!slot.source?.keyBlack); data = { canvas: c, pixels: c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data }; inputs.set(im, data); }
    return data;
  };
  const boxes = slot.frames.map((_, i) => {
    const cell = slot.source?.frames?.[i];
    const im = cell?.file ? images[cell.file] : image;
    if (!im) throw new Error(slot.slot + ': source image missing for frame ' + i);
    let { canvas: source, pixels } = input(im);
    const [cols, rows] = slot.source?.grid ?? [slot.cols, slot.rows];
    const frame = slot.source?.frameMap?.[i] ?? i;
    let [x, y, width, height] = cell?.rect ?? [Math.round(frame % cols * source.width / cols), Math.round(Math.floor(frame / cols) * source.height / rows), Math.floor(source.width / cols), Math.floor(source.height / rows)];
    if (x < 0 || y < 0 || x + width > source.width || y + height > source.height) throw new Error(slot.slot + ': frame ' + i + ' exceeds source image');
    if (cell && slot.source?.keyBlack && (slot.source.fit === 'prop' && slot.slot !== 'village-layers' || slot.slot === 'desert-flyer')) {
      source = isolateFrame(source, x, y, width, height);
      pixels = source.getContext('2d')!.getImageData(0, 0, width, height).data;
      x = 0; y = 0;
    }
    if (!cell && slot.source?.fit === 'tile') {
      const inset = i === 0 && ['tiles-jungle','tiles-canopy'].includes(slot.slot) ? Math.round(height * .22) : 0;
      return { source, x, y: y + inset, w: width, h: height - inset, fill: true };
    }
    let x0 = x + width, x1 = x, y0 = y + height, y1 = y;
    for (let yy = y; yy < y + height; yy++) for (let xx = x; xx < x + width; xx++) {
      if (pixels[(yy * source.width + xx) * 4 + 3] < 64) continue;
      x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy);
    }
    if (x0 > x1 || y0 > y1) throw new Error(slot.slot + ': frame ' + i + ' contains no visible art');
    x = x0; y = y0; width = x1 - x0 + 1; height = y1 - y0 + 1;
    if (cell?.crop) { const [cx, cy, cw, ch] = cell.crop; x += width * cx; y += height * cy; width *= cw; height *= ch; }
    return { source, x, y, w: width, h: height, fill: cell?.fit === 'fill' };
  });
  const maxW = Math.max(...boxes.map(b => b.w)), maxH = Math.max(...boxes.map(b => b.h));
  boxes.forEach((b, i) => {
    const dx = i % slot.cols * fw, dy = Math.floor(i / slot.cols) * fh;
    if (b.fill) { ctx.drawImage(b.source, b.x, b.y, b.w, b.h, dx, dy, fw, fh); return; }
    const prop = slot.source?.fit === 'prop' || slot.source?.fit === 'tile';
    const margin = slot.source?.fit === 'coin' ? 8 : prop ? 2 : 0;
    const k = Math.min((fw - margin * 2) / (prop ? b.w : maxW), (fh - margin * 2) / (prop ? b.h : maxH));
    const w = Math.round(b.w * k), h = Math.round(b.h * k);
    const centred = slot.slot === 'jungle-parrot' || slot.slot.endsWith('flyer') || slot.source?.fit === 'coin' || prop;
    ctx.save();
    if (slot.source?.flipX) { ctx.translate(dx + fw, dy); ctx.scale(-1, 1); } else ctx.translate(dx, dy);
    ctx.drawImage(b.source, b.x, b.y, b.w, b.h, Math.round((fw - w) / 2), centred ? Math.round((fh - h) / 2) : fh - h, w, h);
    ctx.restore();
  });
  return canvas;
};

// Non-uniform exports sometimes overlap the next pose's bounding rectangle.
// Drop only small disconnected fragments cut by that rectangle's edge. Keep
// the main silhouette and all enclosed details, including detached effect stars.
const isolateFrame = (source: HTMLCanvasElement, x: number, y: number, w: number, h: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!; ctx.drawImage(source, x, y, w, h, 0, 0, w, h);
  const image = ctx.getImageData(0, 0, w, h), data = image.data;
  const labels = new Int32Array(w * h), queue = new Int32Array(w * h);
  const parts: { count: number; edge: boolean }[] = [{ count: 0, edge: false }];
  for (let start = 0; start < labels.length; start++) {
    if (labels[start] || data[start * 4 + 3] < 16) continue;
    const id = parts.length; let tail = 1, edge = false; queue[0] = start; labels[start] = id;
    const add = (p: number) => { if (!labels[p] && data[p * 4 + 3] >= 16) { labels[p] = id; queue[tail++] = p; } };
    for (let head = 0; head < tail; head++) {
      const p = queue[head], px = p % w, py = Math.floor(p / w);
      if (px <= 1 || px >= w - 2 || py <= 1 || py >= h - 2) edge = true;
      if (px) add(p - 1); if (px + 1 < w) add(p + 1);
      if (py) add(p - w); if (py + 1 < h) add(p + w);
    }
    parts.push({ count: tail, edge });
  }
  const largest = Math.max(...parts.map(p => p.count));
  for (let p = 0; p < labels.length; p++) {
    const part = parts[labels[p]];
    if (part.edge && part.count < largest * .25) data[p * 4 + 3] = 0;
  }
  ctx.putImageData(image, 0, 0); return canvas;
};

export const atlasIcon = (sheets: Record<string, CanvasImageSource>, slot: SpriteSlot, index: number, scale: number): string => {
  const canvas = document.createElement('canvas'); canvas.width = slot.frameW * scale; canvas.height = slot.frameH * scale;
  canvas.getContext('2d')!.drawImage(sheets[slot.slot], index % slot.cols * canvas.width, Math.floor(index / slot.cols) * canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};
