// Tạo src/data/strokes.json từ KanjiVG (CC BY-SA 3.0, http://kanjivg.tagaini.net).
// Chạy: node tools/build-strokes.mjs   (cần mạng; kết quả được commit, build bình thường không cần chạy lại)
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {BASIC,DAKU} from '../src/js/quiz-core.js';

const KANA=[...BASIC.flat(),...DAKU.flat()].map(x=>x.k).filter(k=>k.length===1&&!'ぢづ'.includes(k));
const BASE='https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
const out={};
for(const k of [...new Set([...KANA,...'ゃゅょっ'])]){
  const hex=k.codePointAt(0).toString(16).padStart(5,'0');
  const svg=execFileSync('curl',['-sS','-f','-m','30',BASE+hex+'.svg'],{encoding:'utf8'});
  const ds=[...svg.matchAll(/<path id="kvg:[0-9a-f]+-s\d+"[^>]*\sd="([^"]+)"/g)].map(m=>m[1]);
  if(!ds.length)throw new Error('không có nét: '+k);
  out[k]=ds;
}
fs.writeFileSync('src/data/strokes.json',JSON.stringify(out));
console.log(Object.keys(out).length+' chữ, '+fs.statSync('src/data/strokes.json').size+' byte');
