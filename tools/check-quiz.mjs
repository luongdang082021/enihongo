// Kiểm tra: (1) mô phỏng bộ câu hỏi Dojo, (2) nội dung từng bài: romaji khớp, từ chỉ dùng chữ đã học, mini quiz sinh được.
import {ROUNDS,build,buildLesson,mkWord,CHOICE,norm,AMB,R,BASIC,DAKU,YOON,parseMorae} from '../src/js/quiz-core.js';
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';

const problems=[];
const bad=(m)=>{if(problems.length<30)problems.push(m)};

function checkQ(q,where){
  if(!q.prompt||!q.type||!q.explain||!q.sum)bad(`${where}: thiếu trường (${q.type})`);
  if(CHOICE.has(q.type)){
    if(!q.opts.includes(q.answer))bad(`${where}: đáp án không nằm trong lựa chọn (${q.type})`);
    if(new Set(q.opts).size!==q.opts.length)bad(`${where}: lựa chọn trùng ${JSON.stringify(q.opts)}`);
    if(q.opts.length<3)bad(`${where}: ít lựa chọn (${q.type})`);
  }else if(q.type==='type'||q.type==='wtype'){
    if(!norm(q.answer))bad(`${where}: đáp án rỗng`);
  }else if(q.type==='match'){
    if(new Set(q.pairs.map(p=>p.r)).size!==q.pairs.length)bad(`${where}: cặp nối trùng romaji`);
    if(q.pairs.some(p=>AMB.has(p.k)))bad(`${where}: có ぢ/づ trong nối cặp`);
  }
}

let n=0;
ROUNDS.forEach((_,i)=>{
  for(let t=0;t<300;t++){
    const qs=build(i);n++;
    if(qs.length!==20)bad(`hiệp ${i+1}: ${qs.length} câu`);
    if(!['k2r','wk2r'].includes(qs[0].type))bad(`hiệp ${i+1}: câu đầu là ${qs[0].type}`);
    qs.forEach(q=>checkQ(q,`hiệp ${i+1}`));
  }
});

// Nội dung bài học
const dir='src/khoa-hoc/hiragana';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.md')).sort();
const learned=new Set();
const romajiOfWord=kana=>mkWord(kana,'').r;
for(const f of files){
  const fm=matter(fs.readFileSync(path.join(dir,f),'utf8')).data;
  const num=fm.n;
  (fm.chars||[]).forEach(c=>{
    if(R[c.k]===undefined)bad(`${f}: chữ ${c.k} không có trong bảng R`);
    else if(R[c.k]!==c.r)bad(`${f}: ${c.k} ghi ${c.r}, bảng là ${R[c.k]}`);
    learned.add(c.k);
  });
  if(num>=9)'ゃゅょ'.split('').forEach(x=>learned.add(x));
  if(num>=10)'あいうえお'.split('').forEach(x=>learned.add(x));
  if(num>=11)learned.add('っ');
  if(num>=12)'ぢづ'.split('').forEach(x=>learned.add(x));
  for(const w of fm.words||[]){
    if(num!==12){
      const miss=[...w.kana].filter(ch=>!learned.has(ch));
      if(miss.length)bad(`${f}: từ ${w.kana} dùng chữ chưa học: ${miss.join('')}`);
    }
    if(w.quiz!==false&&romajiOfWord(w.kana)!==w.romaji)bad(`${f}: ${w.kana} ghi ${w.romaji}, tự sinh ${romajiOfWord(w.kana)}`);
  }
  if(!fm.qplan){console.log(`  ${f}: không có mini quiz`);continue;}
  const cnt=Object.values(fm.qplan).reduce((a,b)=>a+b,0);
  if(cnt!==fm.qcount)bad(`${f}: qcount ${fm.qcount} khác tổng plan ${cnt}`);
  for(let t=0;t<200;t++){
    try{
      const qs=buildLesson(fm.chars||[],fm.qplan,fm.words);
      if(qs.length!==cnt)bad(`${f}: ${qs.length} câu, cần ${cnt}`);
      qs.forEach(q=>checkQ(q,f));
    }catch(e){bad(`${f}: ${e.message}`);break}
  }
  console.log(`  ${f}: ${(fm.chars||[]).length} chữ, ${(fm.words||[]).length} từ, quiz ${cnt} câu, ok`);
}

if(problems.length){console.error('LỖI:\n'+problems.join('\n'));process.exit(1)}
console.log(`Đạt: ${n} bộ câu hỏi hiệp và ${files.length} bài, 0 vấn đề.`);
