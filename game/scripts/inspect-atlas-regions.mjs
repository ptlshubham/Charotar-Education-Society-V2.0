import { chromium } from 'playwright';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../public/assets/arcade');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const result = {};
try {
  for (const theme of ['Desert', 'Ice', 'Volcano', 'Village', 'Castle']) {
    result[theme.toLowerCase()] = {};
    for (const file of (await readdir(resolve(root, `${theme} World`))).filter(f => f.endsWith('.png'))) {
      const num = Number(file.match(/\((\d+)\)/)[1]);
      const data = await readFile(resolve(root, `${theme} World`, file));
      result[theme.toLowerCase()][num] = await page.evaluate(async src => {
        const im = new Image(); im.src = src; await im.decode();
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const opaque = (x,y) => { const i = (y*c.width+x)*4; return d[i+3]>64 && Math.max(d[i],d[i+1],d[i+2])>24; };
        const ranges = mask => { const a=[]; let start=-1,last=-1; for(let i=0;i<=mask.length+2;i++){if(mask[i]) {if(start<0)start=i;last=i;}else if(start>=0 && i-last>2){a.push([start,last+1]);start=-1;}}return a; };
        const ys = Array.from({length:c.height}, (_,y)=>{let count=0;for(let x=0;x<c.width;x++)if(opaque(x,y))count++;return count>4;});
        const rects=[];
        for(const [y0,y1] of ranges(ys)) {
          const xs=Array.from({length:c.width},(_,x)=>{let count=0;for(let y=y0;y<y1;y++)if(opaque(x,y))count++;return count>2;});
          for(const [x0,x1] of ranges(xs)) if(x1-x0>12 && y1-y0>12) rects.push([x0,y0,x1-x0,y1-y0]);
        }
        return {width:c.width,height:c.height,rects};
      }, `data:image/png;base64,${data.toString('base64')}`);
    }
  }
  await writeFile(resolve(import.meta.dirname,'../screenshots/atlas-regions.json'), JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }

