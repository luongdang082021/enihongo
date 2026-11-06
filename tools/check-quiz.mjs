// Kiểm tra: (1) mô phỏng bộ câu hỏi Dojo, (2) nội dung từng bài: romaji khớp, từ chỉ dùng chữ đã học, mini quiz sinh được.
import {ROUNDS,build,buildLesson,mkWord,CHOICE,norm,AMB,R,BASIC,DAKU,YOON,parseMorae} from '../src/js/quiz-core.js';
import {gather,planFor} from '../src/js/dojo-mix.js';
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

// Nội dung bài học của từng khóa
const TAGS=JSON.parse(fs.readFileSync('src/_data/topics.json','utf8'));
const romajiOfWord=kana=>mkWord(kana,'').r;
const COURSES=[
  {id:'hiragana',dir:'src/khoa-hoc/hiragana',exempt:12,extra(num,learned){
    if(num>=9)'ゃゅょ'.split('').forEach(x=>learned.add(x));
    if(num>=10)'あいうえお'.split('').forEach(x=>learned.add(x));
    if(num>=11)learned.add('っ');
    if(num>=12)'ぢづ'.split('').forEach(x=>learned.add(x));
  }},
  {id:'katakana',dir:'src/khoa-hoc/katakana',exempt:0,extra(num,learned){
    if(num>=10)'ャュョー'.split('').forEach(x=>learned.add(x));
    if(num>=11)'ッァィゥェォ'.split('').forEach(x=>learned.add(x));
  }}
];
const allLessons=[];
let nFiles=0;
for(const C of COURSES){
  const files=fs.readdirSync(C.dir).filter(f=>f.endsWith('.md')).sort();
  const learned=new Set();
  for(const f of files){
    nFiles++;
    const fm=matter(fs.readFileSync(path.join(C.dir,f),'utf8')).data;
    allLessons.push(fm);
    const num=fm.n;
    if(fm.writing!==C.id)bad(`${f}: writing phải là ${C.id}`);
    if(fm.lessonId!==`${C.id}-${String(num).padStart(2,'0')}`)bad(`${f}: lessonId ${fm.lessonId} không khớp số bài`);
    (fm.tags||[]).forEach(t=>{if(!TAGS[t])bad(`${f}: tag ${t} chưa khai báo trong src/_data/topics.json`)});
    (fm.chars||[]).forEach(c=>{
      if(R[c.k]===undefined)bad(`${f}: chữ ${c.k} không có trong bảng R`);
      else if(R[c.k]!==c.r)bad(`${f}: ${c.k} ghi ${c.r}, bảng là ${R[c.k]}`);
      learned.add(c.k);[...c.k].forEach(x=>learned.add(x));
    });
    C.extra(num,learned);
    for(const w of fm.words||[]){
      if(num!==C.exempt){
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
}

// Bản tiếng Anh của Katakana phải khớp bản tiếng Việt về dữ liệu (chữ, romaji, từ, kế hoạch quiz)
{
  const vi=fs.readdirSync('src/khoa-hoc/katakana').filter(f=>f.endsWith('.md')).map(f=>matter(fs.readFileSync('src/khoa-hoc/katakana/'+f,'utf8')).data);
  const enDir='src/en/courses/katakana';
  const en=fs.readdirSync(enDir).filter(f=>f.endsWith('.md')).map(f=>matter(fs.readFileSync(path.join(enDir,f),'utf8')).data);
  if(vi.length!==en.length)bad(`Katakana: ${vi.length} bài tiếng Việt, ${en.length} bài tiếng Anh`);
  for(const v of vi){
    const e=en.find(x=>x.lessonId===v.lessonId);
    if(!e){bad(`Katakana: ${v.lessonId} thiếu bản tiếng Anh`);continue}
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    if(!same((v.chars||[]).map(c=>[c.k,c.r]),(e.chars||[]).map(c=>[c.k,c.r])))bad(`${v.lessonId}: chữ khác nhau giữa hai ngôn ngữ`);
    if(!same((v.words||[]).map(w=>[w.kana,w.romaji,w.vi,w.en]),(e.words||[]).map(w=>[w.kana,w.romaji,w.vi,w.en])))bad(`${v.lessonId}: từ khác nhau giữa hai ngôn ngữ`);
    if(!same(v.qplan,e.qplan)||!same(v.tags,e.tags)||v.minutes!==e.minutes||v.n!==e.n)bad(`${v.lessonId}: qplan/tags/minutes/n khác nhau`);
    if(!same((v.objectives||[]).length,(e.objectives||[]).length))bad(`${v.lessonId}: số mục tiêu khác nhau`);
  }
}

// Dojo tự chọn (phạm vi khóa học = toàn bộ bài của khóa) và các tập con bài (kiểm tra thêm cho chắc): đều phải sinh đủ 20 câu hợp lệ.
const lessonsFm=allLessons.filter(d=>(d.chars&&d.chars.length)||(d.words&&d.words.length));
const mixes=[...lessonsFm.map(l=>[l]),lessonsFm,lessonsFm.filter(l=>l.writing==='katakana')];
for(let i=0;i<150;i++)mixes.push(lessonsFm.filter(()=>Math.random()<.4));
let nm=0;
for(const mix of mixes){
  const {chars,words}=gather(mix);
  const plan=planFor(chars,words);
  if(!plan){if(mix.length)bad('Dojo tự chọn: không có kế hoạch cho '+mix.map(l=>l.n));continue}
  const label='Dojo tự chọn bài '+mix.map(l=>l.n).join(',');
  for(let t=0;t<5;t++){
    try{const qs=buildLesson(chars,plan,words);nm++;if(qs.length!==20)bad(`${label}: ${qs.length} câu`);qs.forEach(q=>checkQ(q,label))}
    catch(e){bad(`${label}: ${e.message}`);break}
  }
}
console.log(`  Dojo tự chọn: ${mixes.length} tập bài, ${nm} lượt, ok`);

if(problems.length){console.error('LỖI:\n'+problems.join('\n'));process.exit(1)}
console.log(`Đạt: ${n} bộ câu hỏi hiệp và ${nFiles} bài, 0 vấn đề.`);
