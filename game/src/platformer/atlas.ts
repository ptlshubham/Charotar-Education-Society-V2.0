import type { SpriteSlot } from './sprites.ts';

// Runtime atlas sampling preserves original generated PNGs. Transparent padding
// is excluded from actor bounds so feet stay at the collision body's baseline.
export const assembleAtlas = (image: HTMLImageElement, slot: SpriteSlot): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const scale = 4;
  const fw = slot.frameW * scale, fh = slot.frameH * scale;
  canvas.width = fw * slot.cols;
  canvas.height = fh * slot.rows;
  const ctx = canvas.getContext('2d')!;
  const source = document.createElement('canvas');
  source.width = image.naturalWidth; source.height = image.naturalHeight;
  const read = source.getContext('2d', { willReadFrequently: true })!;
  read.drawImage(image, 0, 0);
  const pixels = read.getImageData(0, 0, source.width, source.height).data;
  const boxes = slot.frames.map((_, i) => {
    const left = Math.round((i % slot.cols) * source.width / slot.cols);
    const right = Math.round(((i % slot.cols) + 1) * source.width / slot.cols);
    const top = Math.round(Math.floor(i / slot.cols) * source.height / slot.rows);
    const bottom = Math.round((Math.floor(i / slot.cols) + 1) * source.height / slot.rows);
    if (slot.source?.fit === 'tile') {
      // The grass source has background foliage above its walkable fringe.
      const inset = i === 0 ? Math.round((bottom - top) * .22) : 0;
      return { x: left, y: top + inset, w: right - left, h: bottom - top - inset };
    }
    let x0 = right, x1 = left, y0 = bottom, y1 = top;
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      if (pixels[(y * source.width + x) * 4 + 3] < 64) continue;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    return x0 <= x1 && y0 <= y1
      ? { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 }
      : { x: left, y: top, w: right - left, h: bottom - top };
  });
  const maxW = Math.max(...boxes.map(b => b.w));
  const maxH = Math.max(...boxes.map(b => b.h));
  boxes.forEach((b, i) => {
    const dx = (i % slot.cols) * fw, dy = Math.floor(i / slot.cols) * fh;
    if (slot.source?.fit === 'tile') {
      ctx.drawImage(source, b.x, b.y, b.w, b.h, dx, dy, fw, fh);
      return;
    }
    const prop = slot.source?.fit === 'prop';
    const margin = slot.source?.fit === 'coin' ? 8 : prop ? 2 : 0;
    const k = Math.min((fw - margin * 2) / (prop ? b.w : maxW), (fh - margin * 2) / (prop ? b.h : maxH));
    const w = Math.round(b.w * k), h = Math.round(b.h * k);
    const centred = slot.slot === 'flyer' || slot.slot === 'jungle-parrot' || slot.source?.fit === 'coin' || prop;
    ctx.drawImage(source, b.x, b.y, b.w, b.h,
      dx + Math.round((fw - w) / 2), dy + (centred ? Math.round((fh - h) / 2) : fh - h), w, h);
  });
  return canvas;
};

export const atlasIcon = (sheets: Record<string, CanvasImageSource>, slot: SpriteSlot, index: number, scale: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = slot.frameW * scale; canvas.height = slot.frameH * scale;
  canvas.getContext('2d')!.drawImage(sheets[slot.slot],
    index % slot.cols * canvas.width, Math.floor(index / slot.cols) * canvas.height,
    canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};
