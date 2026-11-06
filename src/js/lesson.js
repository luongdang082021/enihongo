import {t as tr,lang} from './i18n.js';
import {canSpeak,speak} from './speak.js';
import {lessonState,completeLesson,saveQuizScore,dueOf,rateCard,nextDue} from './progress.js';

const root=document.querySelector('[data-lesson]');
const id=root.dataset.lesson;
const dataEl=document.getElementById('lesson-data');
const data=dataEl?JSON.parse(dataEl.textContent):null;
const btn=root.querySelector('[data-complete]'),state=root.querySelector('[data-complete-state]');
const PASS=.7;

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function paintDone(){
  const s=lessonState(id);
  if(s&&s.done){state.textContent=tr('l.done');btn.hidden=true}
}
btn.addEventListener('click',()=>{completeLesson(id);paintDone()});
paintDone();

if(data){
  /* flashcard ngắt quãng: chữ đến hạn được ôn trước, nhớ thì lùi lịch ôn, quên thì ôn lại ngay */
  const fc=root.querySelector('[data-flashcards]');
  if(fc){
  const keys=data.chars.map(c=>c.k);
  let deck=[],pos=0,flipped=false;
  const reset=(all)=>{
    const due=all?keys:dueOf(keys);
    deck=data.chars.filter(c=>due.includes(c.k));
    pos=0;flipped=false;drawFlash();
  };
  function drawFlash(){
    if(pos>=deck.length){
      const nd=nextDue(keys);
      const when=nd?tr('l.fcNext',{date:new Date(nd).toLocaleDateString(lang==='en'?'en-GB':'vi-VN')}):'';
      fc.innerHTML=`<div class="quiz-sum"><p>${deck.length?tr('l.fcFinished'):tr('l.fcNothing')}${when}</p><div class="row"><button class="btn" type="button" data-f="all">${tr('l.fcAll')}</button></div></div>`;
      return;
    }
    const c=deck[pos];
    fc.innerHTML=`<p class="hint">${tr('l.fcLeft',{n:deck.length-pos})}</p><button class="flash" type="button" data-f="flip">${flipped?`<span class="fr">${esc(c.r)}</span><span class="ft">${esc(c.tip||'')}</span>`:`<span class="fk">${esc(c.k)}</span><span class="fh">${tr('l.fcTap')}</span>`}</button>${flipped?'<div class="row"><button class="btn" type="button" data-f="no">${tr('l.fcNo')}</button><button class="btn primary" type="button" data-f="yes">${tr('l.fcYes')}</button></div>':''}`;
  }
  fc.addEventListener('click',e=>{
    const b=e.target.closest('[data-f]');if(!b)return;
    const a=b.dataset.f;
    if(a==='flip'){flipped=!flipped;drawFlash()}
    else if(a==='yes'){rateCard(deck[pos].k,true);pos++;flipped=false;drawFlash()}
    else if(a==='no'){rateCard(deck[pos].k,false);deck.push(deck[pos]);pos++;flipped=false;drawFlash()}
    else if(a==='all')reset(true);
  });
  reset(false);
  }

  /* mini quiz */
  const box=root.querySelector('[data-miniquiz]');
  const intro=box.innerHTML;
  const plan=data.plan||{k2r:4,r2k:3,type:2,match:1};
  let q=null;
  const stop=()=>{if(q){q.destroy();q=null}box.innerHTML=intro};
  box.addEventListener('click',async e=>{
    const s=e.target.closest('[data-act="start-quiz"]');if(!s)return;
    s.disabled=true;
    const [{buildLesson},{mountQuiz}]=await Promise.all([import('./quiz-core.js'),import('./quiz-ui.js')]);
    box.innerHTML='';
    q=mountQuiz(box,{
      questions:buildLesson(data.chars||[],plan,data.words),title:tr('l.miniTitle'),quitLabel:tr('ui.quit'),
      rebuild:()=>buildLesson(data.chars||[],plan,data.words),
      onFinish:res=>{
        if(res.review)return {};
        saveQuizScore(id,res.score,res.stars);
        const pass=res.correct/res.total>=PASS;
        if(pass){completeLesson(id,{});paintDone();return {note:tr('l.pass')}}
        return {note:tr('l.fail')};
      },
      onQuit:stop
    });
  });
}

/* thứ tự nét và phát âm (bổ sung, không có thì bài học vẫn dùng bình thường) */
const panel=root.querySelector('[data-stroke-panel]');
const speakOk=canSpeak();
root.querySelectorAll('.char[data-char]').forEach(el=>{
  const k=el.dataset.char;
  const tools=document.createElement('div');tools.className='tools';
  if([...k].length===1)tools.insertAdjacentHTML('beforeend',`<button type="button" class="mini" data-stroke="${esc(k)}">${tr('l.strokeBtn')}</button>`);
  tools.insertAdjacentHTML('beforeend',`<button type="button" class="mini" data-sound="${esc(k)}" hidden>Nghe</button>`);
  el.appendChild(tools);
});
root.querySelectorAll('.words li[data-say]').forEach(li=>{
  li.insertAdjacentHTML('beforeend',`<button type="button" class="mini" data-sound="${esc(li.dataset.say)}" hidden>Nghe</button>`);
});
speakOk.then(ok=>{if(ok)root.querySelectorAll('[data-sound]').forEach(b=>{b.hidden=false})});
root.addEventListener('click',async e=>{
  const snd=e.target.closest('[data-sound]');
  if(snd){speak(snd.dataset.sound);return}
  const sk=e.target.closest('[data-stroke]');
  if(sk&&panel){
    const k=sk.dataset.stroke;
    panel.hidden=false;panel.innerHTML='<p class="hint">'+tr('l.loading')+'</p>';
    try{
      const {loadStrokes,strokeSVG}=await import('./strokes.js');
      const all=await loadStrokes(/[ァ-ヺ]/.test(k)?'katakana':'hiragana');
      if(!all[k]){panel.innerHTML='<p class="hint">'+tr('l.noStroke')+'</p>';return}
      const draw=()=>{panel.innerHTML=`<b>${esc(k)}</b>${strokeSVG(all[k],200)}<p class="hint">${tr('l.strokeInfo',{n:all[k].length})}</p><button type="button" class="mini" data-replay>${tr('l.replay')}</button><p class="credit">${tr('l.credit')}</p>`;panel.querySelector('[data-replay]').addEventListener('click',draw);panel.dataset.k=k};
      draw();
      panel.scrollIntoView({block:'nearest',behavior:'smooth'});
    }catch(err){panel.innerHTML='<p class="hint">'+tr('l.strokeFail')+'</p>'}
  }
});
