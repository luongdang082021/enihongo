// Tạo src/data/strokes.json từ KanjiVG (CC BY-SA 3.0, http://kanjivg.tagaini.net).
// Chạy: node tools/build-strokes.mjs   (cần mạng; kết quả được commit, build bình thường không cần chạy lại)
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {BASIC,DAKU,KBASIC,KDAKU} from '../src/js/quiz-core.js';

const hira=[...BASIC.flat(),...DAKU.flat()].map(x=>x.k).filter(k=>k.length===1&&!'ぢづ'.includes(k)).concat([...'ゃゅょっ']);
const kata=[...KBASIC.flat(),...KDAKU.flat()].map(x=>x.k).filter(k=>k.length===1&&!'ヂヅ'.includes(k)).concat([...'ャュョッ']);
const BASE='https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
async function build(list,file){
  const out={};
  for(const k of [...new Set(list)]){
    const hex=k.codePointAt(0).toString(16).padStart(5,'0');
    const svg=execFileSync('curl',['-sS','-f','-m','30',BASE+hex+'.svg'],{encoding:'utf8'});
    const ds=[...svg.matchAll(/<path id="kvg:[0-9a-f]+-s\d+"[^>]*\sd="([^"]+)"/g)].map(m=>m[1]);
    if(!ds.length)throw new Error('không có nét: '+k);
    out[k]=ds;
  }
  fs.writeFileSync(file,JSON.stringify(out));
  console.log(file+': '+Object.keys(out).length+' chữ, '+fs.statSync(file).size+' byte');
}
// Hiragana giữ nguyên tệp cũ nếu có sẵn (chạy lại với tham số "hira" để tạo mới).
if(process.argv.includes('hira')||!fs.existsSync('src/data/strokes.json'))await build(hira,'src/data/strokes.json');
await build(kata,'src/data/strokes-katakana.json');
