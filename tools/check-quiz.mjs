// Kiểm tra: (1) mô phỏng bộ câu hỏi Dojo, (2) nội dung từng bài: romaji khớp, từ chỉ dùng chữ đã học, mini quiz sinh được.
import {dojoSession,buildLesson,mkWord,CHOICE,norm,AMB,R,BASIC,DAKU,YOON,KBASIC,KDAKU,KYOON,KEXT,parseMorae,KEYS_OF} from '../src/js/quiz-core.js';
import {gather} from '../src/js/dojo-mix.js';
import vocab from '../src/_data/vocab.js';
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
  }else if(q.type==='compose'){
    const m=parseMorae(q.answer);
    if(q.slotN!==m.length)bad(`${where}: compose slotN ${q.slotN} khác số nhịp ${m.length}`);
    const need=[...m].sort().join('|'),got=q.tiles.slice().sort();
    for(const x of m){const i=got.indexOf(x);if(i<0){bad(`${where}: compose thiếu ô ${x} cho ${q.answer}`);break}got.splice(i,1)}
    if(got.length<2)bad(`${where}: compose có ít ô thừa (${q.answer})`);
    if(got.some(x=>m.includes(x)))bad(`${where}: compose ô thừa trùng ô cần (${q.answer})`);
    if(q.tiles.some(x=>AMB.has(x)))bad(`${where}: compose có ぢ/づ`);
    if(!q.stage||!q.stage.text)bad(`${where}: compose thiếu romaji`);
  }else if(q.type==='match'){
    if(new Set(q.pairs.map(p=>p.r)).size!==q.pairs.length)bad(`${where}: cặp nối trùng romaji`);
    if(q.pairs.some(p=>AMB.has(p.k)))bad(`${where}: có ぢ/づ trong nối cặp`);
  }
}

let n=0;

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

// Bản tiếng Anh của mỗi khóa phải khớp bản tiếng Việt về dữ liệu (chữ, romaji, từ, kế hoạch quiz) và có đủ bài
for(const course of ['hiragana','katakana']){
  const viDir=`src/khoa-hoc/${course}`,enDir=`src/en/courses/${course}`;
  const vi=fs.readdirSync(viDir).filter(f=>f.endsWith('.md')).map(f=>matter(fs.readFileSync(path.join(viDir,f),'utf8')).data);
  const en=fs.readdirSync(enDir).filter(f=>f.endsWith('.md')).map(f=>matter(fs.readFileSync(path.join(enDir,f),'utf8')).data);
  if(vi.length!==en.length)bad(`${course}: ${vi.length} bài tiếng Việt, ${en.length} bài tiếng Anh`);
  const slugs=JSON.parse(fs.readFileSync('src/_data/lessons.json','utf8'))[course];
  const enFiles=fs.readdirSync(enDir).filter(f=>f.endsWith('.md')).map(f=>f.replace(/\.md$/,''));
  for(const l of slugs.filter(x=>x.state==='ready'))if(!enFiles.includes(l.en.slug))bad(`${course}: lessons.json ${l.id} có slug en "${l.en.slug}" nhưng không có tệp bài tiếng Anh`);
  for(const v of vi){
    const e=en.find(x=>x.lessonId===v.lessonId);
    if(!e){bad(`${course}: ${v.lessonId} thiếu bản tiếng Anh`);continue}
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    if(!same((v.chars||[]).map(c=>[c.k,c.r]),(e.chars||[]).map(c=>[c.k,c.r])))bad(`${v.lessonId}: chữ khác nhau giữa hai ngôn ngữ`);
    if(!same((v.words||[]).map(w=>[w.kana,w.romaji,w.vi,w.en,w.quiz]),(e.words||[]).map(w=>[w.kana,w.romaji,w.vi,w.en,w.quiz])))bad(`${v.lessonId}: từ khác nhau giữa hai ngôn ngữ`);
    if(!same(v.qplan,e.qplan)||!same(v.qcount,e.qcount)||!same(v.tags,e.tags)||v.minutes!==e.minutes||v.n!==e.n)bad(`${v.lessonId}: qplan/qcount/tags/minutes/n khác nhau`);
    if(!same((v.objectives||[]).length,(e.objectives||[]).length))bad(`${v.lessonId}: số mục tiêu khác nhau`);
    if(!same((v.chars||[]).map(c=>!!c.tip),(e.chars||[]).map(c=>!!c.tip)))bad(`${v.lessonId}: gợi ý (tip) của chữ lệch giữa hai ngôn ngữ`);
  }
}

// Kho từ vựng bổ sung: chỉ dùng chữ của khóa, romaji sinh được, có đủ nghĩa Việt và Anh
const KANA_OK={
  hiragana:new Set([...[...BASIC,...DAKU,...YOON].flat().flatMap(x=>[...x.k]),...'ゃゅょっ'].filter(c=>!'ぢづを'.includes(c))),
  katakana:new Set([...[...KBASIC,...KDAKU,...KYOON,...KEXT].flat().flatMap(x=>[...x.k]),...'ッーャュョァィゥェォ'].filter(c=>!'ヂヅヲ'.includes(c)))
};
const vocabLessons=[];
for(const [course,list] of Object.entries(vocab)){
  const seen=new Set();
  for(const w of list){
    const miss=[...w.kana].filter(c=>!KANA_OK[course].has(c));
    if(miss.length)bad(`vocab ${course}: ${w.kana} dùng chữ ngoài khóa: ${miss.join('')}`);
    if(mkWord(w.kana,'').r.includes('?'))bad(`vocab ${course}: ${w.kana} không sinh được romaji`);
    if(!w.vi||!w.en)bad(`vocab ${course}: ${w.kana} thiếu nghĩa`);
    if(seen.has(w.kana))bad(`vocab ${course}: trùng ${w.kana}`);
    seen.add(w.kana);
  }
  vocabLessons.push({writing:course,n:99,chars:[],words:list.map(w=>({kana:w.kana,vi:w.vi,en:w.en}))});
  console.log(`  vocab ${course}: ${list.length} từ, ok`);
}

// Dojo: phạm vi khóa học (toàn bộ bài + kho từ), tập con để kiểm tra thêm; đều phải sinh đủ 20 câu hợp lệ,
// câu đầu dễ, không ba dạng giống nhau liền nhau, và câu sai luôn có câu nhắc lại cùng chữ hoặc từ.
const lessonsFm=allLessons.filter(d=>(d.chars&&d.chars.length)||(d.words&&d.words.length));
const of=w=>lessonsFm.filter(l=>l.writing===w),voc=w=>vocabLessons.filter(l=>l.writing===w);
const mixes=[[...of('hiragana'),...voc('hiragana')],[...of('katakana'),...voc('katakana')],[...lessonsFm,...vocabLessons],voc('hiragana'),voc('katakana'),of('hiragana'),...lessonsFm.map(l=>[l])];
for(let i=0;i<120;i++)mixes.push([...lessonsFm,...vocabLessons].filter(()=>Math.random()<.3));
let nm=0,nf=0;
for(const mix of mixes){
  const {chars,words}=gather(mix);
  if(!chars.length&&!words.length){continue}
  const label='Dojo '+mix.map(l=>l.writing+l.n).join(',').slice(0,60);
  const dj=dojoSession(chars,words,{weak:{}});
  for(let t=0;t<4;t++){
    try{
      const qs=dj.build();nm++;
      if(qs.length!==20)bad(`${label}: ${qs.length} câu`);
      if(!['k2r','wk2r'].includes(qs[0].type))bad(`${label}: câu đầu là ${qs[0].type}`);
      for(let i=2;i<qs.length;i++)if(qs[i].type===qs[i-1].type&&qs[i].type===qs[i-2].type&&new Set(qs.map(q=>q.type)).size>3)bad(`${label}: ba câu ${qs[i].type} liền nhau`);
      qs.forEach(q=>{
        checkQ(q,label);
        const fq=dj.follow(q);nf++;
        if(!fq){bad(`${label}: không có câu nhắc lại cho ${q.type}`);return}
        checkQ(fq,label+' (nhắc lại)');
        if(!fq.again||fq.depth!==1)bad(`${label}: câu nhắc lại thiếu cờ`);
        if(fq.type===q.type)bad(`${label}: câu nhắc lại cùng dạng ${q.type}`);
        const kq=KEYS_OF(q);
        if(!KEYS_OF(fq).some(k=>kq.includes(k)))bad(`${label}: câu nhắc lại không cùng chữ/từ (${q.type} → ${fq.type})`);
        const f2=dj.follow(fq);
        if(!f2||f2.depth!==2)bad(`${label}: thiếu lần nhắc thứ hai`);
        else{checkQ(f2,label+' (nhắc lần 2)');if(dj.follow(f2))bad(`${label}: nhắc quá hai lần`)}
      });
    }catch(e){bad(`${label}: ${e.stack.split('\n').slice(0,3).join(' ')}`);break}
  }
}
console.log(`  Dojo: ${mixes.length} tập, ${nm} lượt, ${nf} lần nhắc lại, ok`);

// Chữ hay sai phải xuất hiện nhiều hơn
{
  const {chars,words}=gather([...of('hiragana'),...voc('hiragana')]);
  const rate=weak=>{let hit=0;const N=300;for(let i=0;i<N;i++){const qs=dojoSession(chars,words,{weak}).build();if(qs.some(q=>KEYS_OF(q).includes('ぬ')))hit++}return hit/N};
  const base=rate({}),boosted=rate({'ぬ':6});
  if(!(boosted>base+0.08))bad(`chữ hay sai không được ưu tiên: ${base.toFixed(2)} → ${boosted.toFixed(2)}`);
  console.log(`  ưu tiên chữ sai: ぬ xuất hiện ${(base*100).toFixed(0)}% → ${(boosted*100).toFixed(0)}% lượt`);
}

if(problems.length){console.error('LỖI:\n'+problems.join('\n'));process.exit(1)}
console.log(`Đạt: ${nFiles} bài, kho từ vựng và Dojo, 0 vấn đề.`);
