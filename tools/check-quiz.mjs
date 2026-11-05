// Mô phỏng sinh câu hỏi để bắt lỗi logic: mỗi hiệp 300 lần, mỗi bộ lesson 200 lần.
import {ROUNDS,build,buildLesson,CHOICE,norm,AMB} from '../src/js/quiz-core.js';
import fs from 'node:fs';
import path from 'node:path';

const problems=[];
const bad=(m)=>{if(problems.length<20)problems.push(m)};

function checkQ(q,where){
  if(!q.prompt||!q.type||!q.explain||!q.sum)bad(`${where}: thiếu trường (${q.type})`);
  if(CHOICE.has(q.type)){
    if(!q.opts.includes(q.answer))bad(`${where}: đáp án không nằm trong lựa chọn (${q.type})`);
    if(new Set(q.opts).size!==q.opts.length)bad(`${where}: lựa chọn trùng ${JSON.stringify(q.opts)}`);
    if(q.opts.length<3)bad(`${where}: ít lựa chọn (${q.type})`);
    if(q.opts.filter(o=>o===q.answer).length!==1)bad(`${where}: đáp án lặp`);
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

// Mọi bài trong src/khoa-hoc/hiragana có chars thì mini quiz phải sinh được.
const dir='src/khoa-hoc/hiragana';
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md'))){
  const txt=fs.readFileSync(path.join(dir,f),'utf8');
  const chars=[...txt.matchAll(/\{ k: "(.+?)", r: "(.+?)"/g)].map(m=>({k:m[1],r:m[2]}));
  if(!chars.length)continue;
  for(let t=0;t<200;t++){
    try{
      const qs=buildLesson(chars,{k2r:4,r2k:3,type:2,match:1});
      if(qs.length!==10)bad(`${f}: ${qs.length} câu`);
      qs.forEach(q=>checkQ(q,f));
    }catch(e){bad(`${f}: ${e.message}`);break}
  }
  console.log(`  ${f}: ${chars.length} chữ, ok`);
}

if(problems.length){console.error('LỖI:\n'+problems.join('\n'));process.exit(1)}
console.log(`Đạt: ${n} bộ câu hỏi hiệp, 0 vấn đề.`);
