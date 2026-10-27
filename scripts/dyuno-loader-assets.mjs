/**
 * Builds the page loader's Dyuno assets from the hanging-Dyuno keyframes (1024×1536 RGBA PNGs).
 * The originals are only read; the optimized copies go to public/assets/images/loader/.
 *
 *   node scripts/dyuno-loader-assets.mjs <base frame.png> <blink frame.png> [preview folder]
 *
 * The keyframes are separate renders, not one aligned sequence (sizes, positions and fur texture
 * differ), so the loader animates a single pose and only borrows the face from the blink frame:
 * - base: keyframe 3 ("descends") - the one pose; the CSS moves and swings it.
 * - blink: keyframe 8 - the same render with closed eyes, aligned within a pixel. Only the face
 *   is lifted from it, so the rest of the body can't shimmer when he blinks.
 * - The baked-in rope is removed - index.html draws one continuous thread behind the sprite.
 *
 * Prints the anchor points (as fractions) that index.html's loader CSS uses. With a preview
 * folder it also writes full PNGs of both sprites there, for checking.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Sprite height in px - 2× the largest on-screen size (170px desktop). */
const OUT_HEIGHT = 344;

const [baseFile, blinkFile, previewDir] = process.argv.slice(2);
if (!baseFile || !blinkFile) {
  throw new Error('Usage: node scripts/dyuno-loader-assets.mjs <base frame.png> <blink frame.png> [preview folder]');
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/assets/images/loader');
mkdirSync(outDir, { recursive: true });

const b64 = (f) => readFileSync(resolve(f)).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(async ({ base, blink, outHeight }) => {
  const load = async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    return x.getImageData(0, 0, img.width, img.height);
  };
  const A = await load(base);
  const B = await load(blink);
  const W = A.width, H = A.height, a = A.data, b = B.data;
  const at = (x, y) => (y * W + x) * 4;
  const isBlue = (d, i) => d[i + 3] > 128 && d[i + 2] > 120 && d[i + 2] > d[i] + 40;
  const isYellow = (d, i) => d[i + 3] > 128 && d[i] > 200 && d[i + 1] > 150 && d[i + 2] < 90;

  // ── Landmarks on the base frame ──
  const rowCount = (test, y) => { let n = 0; for (let x = 0; x < W; x++) if (test(a, at(x, y))) n++; return n; };
  let handsTop = 0; while (rowCount(isBlue, handsTop) <= 3) handsTop++;
  let faceTop = handsTop; while (rowCount(isYellow, faceTop) <= 80) faceTop++;
  let faceBottom = faceTop; while (rowCount(isYellow, faceBottom) > 40) faceBottom++;

  // Rope colour and centre, sampled just above the hands.
  let ropeSum = [0, 0, 0], ropeN = 0, ropeXSum = 0;
  for (let y = handsTop - 60; y < handsTop - 10; y++) for (let x = 0; x < W; x++) {
    const i = at(x, y);
    if (a[i + 3] > 200) { ropeSum[0] += a[i]; ropeSum[1] += a[i + 1]; ropeSum[2] += a[i + 2]; ropeN++; ropeXSum += x; }
  }
  const ropeColor = ropeSum.map((v) => Math.round(v / ropeN));
  const ropeX = ropeXSum / ropeN;
  // Rope width: opaque pixels per row just above the hands.
  const ropeWidth = ropeN / 50;

  // ── Blink: frame 8's expression over frame 3 ──
  // Its closed eyes come with a slightly different laughing mouth, and the open eyes reach down to
  // the smile's corners, so there is no clean line between eyes and mouth - the whole face inside
  // the yellow disc is taken. The blend runs through plain fur just inside the face's edge, so the
  // petals around it never change.
  const region ={ x0: 0, y0: faceTop - 2, x1: W, y1: faceBottom + 2 };
  const RW = region.x1 - region.x0, RH = region.y1 - region.y0;
  // Inside = between the leftmost and rightmost yellow of that row, in both frames.
  const inside = new Uint8Array(RW * RH);
  for (let y = 0; y < RH; y++) {
    let lo = 0, hi = W - 1;
    for (const d of [a, b]) {
      let l = -1, r = -1;
      for (let x = 0; x < W; x++) if (isYellow(d, at(x, y + region.y0))) { if (l < 0) l = x; r = x; }
      if (l < 0) { lo = W; hi = -1; break; }
      lo = Math.max(lo, l); hi = Math.min(hi, r);
    }
    for (let x = lo; x <= hi; x++) inside[y * RW + x] = 1;
  }
  // Distance (px, chamfer) from every pixel to the face's edge.
  const dist = new Float32Array(RW * RH);
  for (let i = 0; i < dist.length; i++) dist[i] = inside[i] ? 1e9 : 0;
  const relax = (x, y, dx, dy, w) => { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= RW || yy >= RH) return; const v = dist[yy * RW + xx] + w; if (v < dist[y * RW + x]) dist[y * RW + x] = v; };
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { relax(x, y, -1, 0, 1); relax(x, y, 0, -1, 1); relax(x, y, -1, -1, 1.4); relax(x, y, 1, -1, 1.4); }
  for (let y = RH - 1; y >= 0; y--) for (let x = RW - 1; x >= 0; x--) { relax(x, y, 1, 0, 1); relax(x, y, 0, 1, 1); relax(x, y, 1, 1, 1.4); relax(x, y, -1, 1, 1.4); }
  const edgeGap = 6, feather = 8;
  const blinkImg = new ImageData(new Uint8ClampedArray(a), W, H);
  const k = blinkImg.data;
  let eMinX = W, eMinY = H, eMaxX = -1, eMaxY = -1;
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
    const dd = dist[y * RW + x];
    const m = dd <= edgeGap ? 0 : dd >= edgeGap + feather ? 1 : (dd - edgeGap) / feather;
    if (!m) continue;
    const X = x + region.x0, Y = y + region.y0, i = at(X, Y);
    for (let c = 0; c < 4; c++) k[i + c] = Math.round(a[i + c] * (1 - m) + b[i + c] * m);
    eMinX = Math.min(eMinX, X); eMaxX = Math.max(eMaxX, X); eMinY = Math.min(eMinY, Y); eMaxY = Math.max(eMaxY, Y);
  }
  // The blended area, for cutting the patch out of the scaled sprite below.
  const ex = (eMinX + eMaxX) / 2, ey = (eMinY + eMaxY) / 2, rx = (eMaxX - eMinX) / 2, ry = (eMaxY - eMinY) / 2;

  // ── Clean both: drop the rope, make the body fully opaque ──
  const clean = (d) => {
    for (let y = 0; y < faceTop; y++) for (let x = 0; x < W; x++) {
      const i = at(x, y);
      if (!d[i + 3]) continue;
      const warm = d[i] > 70 && d[i] - d[i + 2] > 50 && d[i + 1] - d[i + 2] > 15;
      const ropeFringe = Math.abs(x - ropeX) < ropeWidth && d[i + 3] < 200 && d[i + 2] < d[i] + 30;
      if (y < handsTop - 2 || warm || ropeFringe) d[i + 3] = 0;
    }
    // The renders top out at alpha 253, so the body is ~1% see-through - lift it to opaque.
    for (let i = 3; i < d.length; i += 4) if (d[i] >= 250) d[i] = 255;
  };
  clean(a);
  clean(k);

  // ── Crop (same box for both) and downscale ──
  let minX = W, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (a[at(x, y) + 3] > 8) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  const cpad = 6;
  const crop = { x: minX - cpad, y: handsTop - cpad, w: maxX - minX + 1 + 2 * cpad, h: maxY - handsTop + 1 + 2 * cpad };
  const scale = outHeight / crop.h;
  const outW = Math.round(crop.w * scale);

  const toCanvas = (img) => { const c = new OffscreenCanvas(W, H); c.getContext('2d').putImageData(img, 0, 0); return c; };
  const scaled = (img) => {
    const c = new OffscreenCanvas(outW, outHeight);
    const x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(toCanvas(img), crop.x, crop.y, crop.w, crop.h, 0, 0, outW, outHeight);
    return c;
  };
  const baseOut = scaled(A);
  const blinkOut = scaled(blinkImg);

  // Blink patch: the blended face's box (plus a margin) in the scaled sprite, cut from the blink
  // sprite. Outside the face it equals the base, so it lays over the base without a seam; a few px
  // of edge fade hide the difference lossy encoding makes.
  const p = {
    x: Math.max(0, Math.floor((ex - rx - feather - crop.x) * scale) - 2),
    y: Math.max(0, Math.floor((ey - ry - feather - crop.y) * scale) - 2),
  };
  p.w = Math.min(outW, Math.ceil((ex + rx + feather - crop.x) * scale) + 2) - p.x;
  p.h = Math.min(outHeight, Math.ceil((ey + ry + feather - crop.y) * scale) + 2) - p.y;
  const patch = new OffscreenCanvas(p.w, p.h);
  const px = patch.getContext('2d');
  px.drawImage(blinkOut, p.x, p.y, p.w, p.h, 0, 0, p.w, p.h);
  const pd = px.getImageData(0, 0, p.w, p.h);
  const edge = 4;
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const dEdge = Math.min(x, y, p.w - 1 - x, p.h - 1 - y);
    if (dEdge < edge) pd.data[(y * p.w + x) * 4 + 3] *= (dEdge + 1) / (edge + 1);
  }
  px.putImageData(pd, 0, 0);

  const enc = async (c, type, quality) => {
    const blob = await c.convertToBlob({ type, quality });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };

  const visibleH = maxY - handsTop + 1;
  return {
    files: {
      'dyuno-hang.webp': await enc(baseOut, 'image/webp', 0.9),
      'dyuno-hang-blink.webp': await enc(patch, 'image/webp', 0.95),
      // full-size previews for checking, not shipped
      'preview-base.png': await enc(baseOut, 'image/png'),
      'preview-blink.png': await enc(blinkOut, 'image/png'),
    },
    metrics: {
      source: { handsTop, faceTop, faceBottom, ropeX: +ropeX.toFixed(1), ropeWidth: +ropeWidth.toFixed(1), ropeColor, crop, blinkArea: { ex, ey, rx, ry } },
      sprite: { width: outW, height: outHeight },
      css: {
        // sprite box relative to the visible mascot height (hands top → shoe soles)
        spriteHeightPerMascot: +(crop.h / visibleH).toFixed(4),
        spriteWidthPerMascot: +(crop.w / visibleH).toFixed(4),
        // where the rope passes, as a fraction of the sprite width
        ropeXInSprite: +((ropeX - crop.x) / crop.w).toFixed(4),
        // hands top, as a fraction of the sprite height
        handsTopInSprite: +((handsTop - crop.y) / crop.h).toFixed(4),
        // the face's span below the hands - the thread ends behind it, out of sight
        faceBelowHandsPerMascot: [+((faceTop - handsTop) / visibleH).toFixed(4), +((faceBottom - handsTop) / visibleH).toFixed(4)],
        ropeWidthPerMascot: +(ropeWidth / visibleH).toFixed(4),
        patch: { left: +(p.x / outW).toFixed(4), top: +(p.y / outHeight).toFixed(4), width: +(p.w / outW).toFixed(4), height: +(p.h / outHeight).toFixed(4) },
      },
    },
  };
}, { base: b64(baseFile), blink: b64(blinkFile), outHeight: OUT_HEIGHT });
await browser.close();

for (const [name, data] of Object.entries(result.files)) {
  const preview = name.startsWith('preview-');
  if (preview && !previewDir) continue;
  const dest = resolve(preview ? previewDir : outDir, name);
  writeFileSync(dest, Buffer.from(data, 'base64'));
  console.log(`wrote ${dest} (${(Buffer.from(data, 'base64').length / 1024).toFixed(1)} KB)`);
}
console.log(JSON.stringify(result.metrics, null, 2));
