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
  if(s&&s.done){state.textContent='Đã hoàn thành';btn.hidden=true}
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
      const when=nd?` Lần ôn kế tiếp: ${new Date(nd).toLocaleDateString('vi-VN')}.`:'';
      fc.innerHTML=`<div class="quiz-sum"><p>${deck.length?'Xong lượt ôn hôm nay.':'Hôm nay không còn chữ nào cần ôn.'}${when}</p><div class="row"><button class="btn" type="button" data-f="all">Xem lại tất cả chữ</button></div></div>`;
      return;
    }
    const c=deck[pos];
    fc.innerHTML=`<p class="hint">Còn ${deck.length-pos} thẻ trong lượt này</p><button class="flash" type="button" data-f="flip">${flipped?`<span class="fr">${esc(c.r)}</span><span class="ft">${esc(c.tip||'')}</span>`:`<span class="fk">${esc(c.k)}</span><span class="fh">Chạm để lật</span>`}</button>${flipped?'<div class="row"><button class="btn" type="button" data-f="no">Chưa nhớ</button><button class="btn primary" type="button" data-f="yes">Đã nhớ</button></div>':''}`;
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
      questions:buildLesson(data.chars||[],plan,data.words),title:'Mini quiz',quitLabel:'Thoát',
      rebuild:()=>buildLesson(data.chars||[],plan,data.words),
      onFinish:res=>{
        if(res.review)return {};
        saveQuizScore(id,res.score,res.stars);
        const pass=res.correct/res.total>=PASS;
        if(pass){completeLesson(id,{});paintDone();return {note:'Đạt yêu cầu, bài này đã được đánh dấu hoàn thành.'}}
        return {note:'Cần đúng từ 7/10 câu để hoàn thành bài. Xem lại bảng chữ rồi thử lại nhé.'};
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
  if([...k].length===1)tools.insertAdjacentHTML('beforeend',`<button type="button" class="mini" data-stroke="${esc(k)}">Nét viết</button>`);
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
    panel.hidden=false;panel.innerHTML='<p class="hint">Đang tải…</p>';
    try{
      const {loadStrokes,strokeSVG}=await import('./strokes.js');
      const all=await loadStrokes();
      if(!all[k]){panel.innerHTML='<p class="hint">Chưa có dữ liệu nét cho chữ này.</p>';return}
      const draw=()=>{panel.innerHTML=`<b>${esc(k)}</b>${strokeSVG(all[k],200)}<p class="hint">${all[k].length} nét. Số cho biết thứ tự.</p><button type="button" class="mini" data-replay>Xem lại</button><p class="credit">Dữ liệu nét: KanjiVG, giấy phép CC BY-SA 3.0.</p>`;panel.querySelector('[data-replay]').addEventListener('click',draw);panel.dataset.k=k};
      draw();
      panel.scrollIntoView({block:'nearest',behavior:'smooth'});
    }catch(err){panel.innerHTML='<p class="hint">Không tải được dữ liệu nét. Kiểm tra kết nối rồi thử lại.</p>'}
  }
});
