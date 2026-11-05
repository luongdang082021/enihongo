// Báo cáo dung lượng gzip mỗi trang (HTML + CSS + JS tải ngay) so với ngân sách. Chạy sau khi build.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SITE=process.env.SITE_DIR||'_site';
const BUDGET_KB=100;
const gz=f=>zlib.gzipSync(fs.readFileSync(f),{level:9}).length;

function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
const pages=walk(SITE).filter(f=>f.endsWith('.html'));
const resolve=u=>{u=u.split('?')[0].replace(/^\/enihongo\//,'/');return path.join(SITE,u)};
let over=0;
for(const p of pages){
  const html=fs.readFileSync(p,'utf8');
  const refs=[...html.matchAll(/(?:href|src)="([^"]+\.(?:css|js))(?:\?[^"]*)?"/g)].map(m=>m[1]);
  let total=gz(p);const parts=[`html ${(gz(p)/1024).toFixed(1)}`];
  const seen=new Set();
  const add=f=>{
    if(seen.has(f)||!fs.existsSync(f))return;
    seen.add(f);total+=gz(f);parts.push(`${path.basename(f)} ${(gz(f)/1024).toFixed(1)}`);
    if(f.endsWith('.js')){ // theo các import tĩnh (import ... from './x.js')
      for(const m of fs.readFileSync(f,'utf8').matchAll(/^\s*import[^'"]*from\s*'(\.[^']+)'/gm))add(path.resolve(path.dirname(f),m[1]));
    }
  };
  for(const r of new Set(refs)){if(!/^https?:/.test(r))add(path.resolve(resolve(r)))}
  const kb=total/1024;
  if(kb>BUDGET_KB)over++;
  console.log(`${kb.toFixed(1).padStart(6)} KB  ${path.relative(SITE,p).padEnd(48)} (${parts.join(', ')})`);
}
console.log(`Ngân sách ${BUDGET_KB} KB gzip (chưa tính font).`);
if(over){console.error(`${over} trang vượt ngân sách.`);process.exit(1)}
