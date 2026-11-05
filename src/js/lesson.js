import {lessonState,completeLesson,saveQuizScore} from './progress.js';

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
  /* flashcard: chưa nhớ / đã nhớ, không lưu */
  const fc=root.querySelector('[data-flashcards]');
  if(fc){
  let deck=[],pos=0,flipped=false,known=0;
  const reset=()=>{deck=data.chars.slice();pos=0;flipped=false;known=0;drawFlash()};
  function drawFlash(){
    if(pos>=deck.length){
      fc.innerHTML=`<div class="quiz-sum"><p>Xong lượt này. Học lại để nhớ chắc hơn, hoặc làm mini quiz bên dưới.</p><div class="row"><button class="btn primary" type="button" data-f="again">Học lại từ đầu</button></div></div>`;
      return;
    }
    const c=deck[pos];
    fc.innerHTML=`<button class="flash" type="button" data-f="flip" aria-label="Lật thẻ">${flipped?`<span class="fr">${esc(c.r)}</span><span class="ft">${esc(c.tip||'')}</span>`:`<span class="fk">${esc(c.k)}</span><span class="fh">Chạm để lật · ${pos+1}/${deck.length}</span>`}</button>${flipped?'<div class="row"><button class="btn" type="button" data-f="no">Chưa nhớ</button><button class="btn primary" type="button" data-f="yes">Đã nhớ</button></div>':''}`;
  }
  fc.addEventListener('click',e=>{
    const b=e.target.closest('[data-f]');if(!b)return;
    const a=b.dataset.f;
    if(a==='flip'){flipped=!flipped;drawFlash()}
    else if(a==='yes'){known++;pos++;flipped=false;drawFlash()}
    else if(a==='no'){deck.push(deck[pos]);pos++;flipped=false;drawFlash()}
    else if(a==='again')reset();
  });
  reset();
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
