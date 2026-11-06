// Kiểm tra cú pháp mọi tệp JavaScript trong src/js (lỗi cú pháp làm chết cả trang mà trình dựng không báo).
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const walk=(d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):e.name.endsWith('.js')?[path.join(d,e.name)]:[]);
let bad=0;
for(const f of walk('src/js')){try{execFileSync(process.execPath,['--check',f],{stdio:'pipe'})}catch(e){bad++;console.error('LỖI cú pháp: '+f+'\n'+String(e.stderr).split('\n').slice(0,4).join('\n'))}}
if(bad)process.exit(1);
console.log('Đạt: cú pháp JavaScript trong src/js.');
