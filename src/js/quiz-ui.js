/* Giao diện quiz dùng chung: mountQuiz(root, opts) vẽ phần chơi và màn kết quả vào root. */
import {t as tr,lang,num} from './i18n.js';
import {T,CHOICE,PLAIN,norm,shuffle,esc} from './quiz-core.js';

export const fmt=n=>num(n);
export const fmtTime=secs=>Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');
export const starsOf=acc=>acc>=.95?3:acc>=.8?2:acc>=.6?1:0;
export const starsHTML=(n,sz)=>'<span class="stars" role="img" aria-label="'+tr('ui.stars',{n})+'">'+[0,1,2].map(i=>`<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" aria-hidden="true"><path class="${i<n?'st-on':'st-off'}" stroke-width="1.6" stroke-linejoin="round" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z"/></svg>`).join('')+'</span>';

function cellsHTML(m,blank){
  const n=m.length,s=n===1?140:n===2?108:n===3?96:n===4?84:n===5?74:n===6?66:58;
  return `<div class="cells" style="--s:${s}px">`+m.map((x,i)=>{const b=i===blank;return `<span class="cell${x.length>1?' y':''}${b?' blank':''}">${b?'?':esc(x)}</span>`}).join('')+'</div>';
}

/*
 opts: {questions, title, review, rebuild?, extraActions?:[{id,label}], onFinish(result), onAction(id), onQuit()}
 result: {score,stars,correct,total,maxStreak,secs,wrong,review}
*/
export function mountQuiz(root,opts){
  let S;
  const q$=s=>root.querySelector(s);
  const cur=()=>S.qs[S.i];
  const ac=new AbortController();
  const sig={signal:ac.signal};

  function shell(){
    root.innerHTML=`<div data-play><div class="bar"><button class="ghost" type="button" data-quit>← ${esc(opts.quitLabel||tr('ui.quit'))}</button><span class="rtitle" data-title></span><span class="score" data-score aria-live="off">0</span></div><div class="segs" data-segs></div><div class="meta"><span data-cnt></span><span class="combo" data-combo></span></div><div class="qcard"><span class="tag" data-tag></span><p class="prompt" data-prompt></p><div class="stage" data-stage></div><div data-answer></div></div><div data-fb aria-live="polite"></div></div><div class="res" data-result hidden></div>`;
  }
  function start(qs,review){
    clearTimeout(S&&S.timer);
    S={qs,i:0,score:0,streak:0,maxStreak:0,correct:0,marks:[],wrong:[],review:!!review,start:Date.now(),locked:false,timer:null};
    shell();
    q$('[data-title]').textContent=(review?tr('ui.review'):'')+(opts.title||'');
    showQ();
  }
  function hud(){
    const n=S.qs.length,sg=q$('[data-segs]');
    sg.style.gridTemplateColumns=`repeat(${n},1fr)`;
    sg.innerHTML=S.qs.map((_,i)=>`<i class="${S.marks[i]===true?'ok':S.marks[i]===false?'no':i===S.i?'cur':''}"></i>`).join('');
    q$('[data-cnt]').textContent=tr('ui.qn',{i:S.i+1,n});
    q$('[data-combo]').textContent=S.streak>=2?tr('ui.combo',{n:S.streak}):'';
    q$('[data-score]').textContent=fmt(S.score);
  }
  function showQ(){
    const q=cur();
    clearTimeout(S.timer);S.locked=false;S.t0=Date.now();
    hud();
    q$('[data-tag]').textContent=T[q.type];
    q$('[data-prompt]').textContent=q.prompt;
    let st='';
    if(q.stage){
      if(q.stage.m)st+=cellsHTML(q.stage.m,q.stage.blank);
      if(q.stage.text)st+=`<div class="romaji">${esc(q.stage.text)}</div>`;
      if(q.stage.hint)st+=`<p class="hint">${esc(q.stage.hint)}</p>`;
    }
    const stage=q$('[data-stage]');stage.innerHTML=st;stage.hidden=!st;
    let a='';
    if(CHOICE.has(q.type)){
      a='<div class="opts">'+q.opts.map((o,i)=>`<button type="button" class="opt ${q.font==='kana'?'kana':''}${q.font==='kana'&&[...o].length>5?' long':''}" data-v="${esc(o)}"><span class="k" aria-hidden="true">${i+1}</span>${esc(o)}</button>`).join('')+'</div>';
    }else if(q.type==='type'||q.type==='wtype'){
      a=`<form class="typeform" autocomplete="off"><input data-ans type="text" inputmode="text" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="romaji…" aria-label="${esc(tr('ui.romajiAns'))}"><div class="row"><button class="btn primary" type="submit">${tr('ui.check')}</button><button class="btn" data-skip type="button">${tr('ui.skip')}</button></div></form>`;
    }else if(q.type==='match'){
      S.mm={sel:null,done:0,miss:0};
      const L=shuffle(q.pairs),Rr=shuffle(q.pairs);
      a='<div class="match"><div class="col">'+L.map(p=>`<button type="button" class="mbtn kana" data-side="k" data-v="${esc(p.k)}">${esc(p.k)}</button>`).join('')+'</div><div class="col">'+Rr.map(p=>`<button type="button" class="mbtn" data-side="r" data-v="${esc(p.r)}">${esc(p.r)}</button>`).join('')+'</div></div>';
    }
    q$('[data-answer]').innerHTML=a;
    q$('[data-fb]').innerHTML='';
    const inp=q$('[data-ans]');if(inp)inp.focus({preventScroll:true});
  }
  function settle(ok,note){
    const q=cur();
    S.locked=true;
    const sec=(Date.now()-S.t0)/1000,cap=q.cap||10;
    let pts=0;
    if(ok){pts=100+Math.round(50*(1-Math.min(sec,cap)/cap))+Math.min(S.streak,10)*5;S.streak++;S.maxStreak=Math.max(S.maxStreak,S.streak);S.correct++}
    else{S.streak=0;S.wrong.push(q)}
    S.score+=pts;S.marks[S.i]=ok;
    hud();
    const last=S.i>=S.qs.length-1;
    const head=ok?tr('ui.right',{pts}):tr('ui.wrong');
    const ansLine=(!ok&&q.type!=='match')?`<div>${tr('ui.answer')} <b class="ans">${esc(q.answer)}</b></div>`:'';
    const fb=q$('[data-fb]');
    fb.innerHTML=`<div class="fb ${ok?'good':'bad'}"><strong>${head}</strong>${ansLine}<div class="ex">${q.explain}${note?'<br>'+note:''}</div><button class="btn primary" data-next type="button">${last?tr('ui.seeResult'):tr('ui.continue')} ↵</button></div>`;
    fb.scrollIntoView({block:'nearest',behavior:'smooth'});
    if(ok&&PLAIN.has(q.type))S.timer=setTimeout(next,1300);
  }
  function next(){
    if(!S||!S.locked)return;
    clearTimeout(S.timer);
    if(S.i>=S.qs.length-1)finish();else{S.i++;showQ()}
  }
  function choose(v){
    const q=cur(),ok=v===q.answer;
    S.locked=true;
    root.querySelectorAll('[data-answer] .opt').forEach(b=>{b.disabled=true;if(b.dataset.v===q.answer)b.classList.add('good');else if(b.dataset.v===v)b.classList.add('bad')});
    settle(ok);
  }
  function onMatch(btn){
    if(S.locked||btn.classList.contains('done'))return;
    const q=cur(),side=btn.dataset.side,sel=S.mm.sel;
    if(sel&&sel.side!==side){
      const kB=side==='k'?btn:sel.btn,rB=side==='r'?btn:sel.btn;
      const ok=q.pairs.some(p=>p.k===kB.dataset.v&&p.r===rB.dataset.v);
      sel.btn.classList.remove('sel');S.mm.sel=null;
      if(ok){[kB,rB].forEach(b=>{b.classList.add('done');b.disabled=true});S.mm.done++;if(S.mm.done===q.pairs.length)settle(S.mm.miss===0,S.mm.miss?tr('ui.matchMiss',{n:S.mm.miss}):'')}
      else{S.mm.miss++;[kB,rB].forEach(b=>{b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake')})}
    }else{
      if(sel)sel.btn.classList.remove('sel');
      btn.classList.add('sel');S.mm.sel={side,btn};
    }
  }
  function submitTyped(giveUp){
    const q=cur(),inp=q$('[data-ans]');
    const v=inp.value.trim();
    if(!giveUp&&!v)return;
    const ok=!giveUp&&[q.answer,...(q.alt||[])].some(a=>norm(a)===norm(v));
    inp.readOnly=true;inp.classList.add(ok?'good':'bad');
    root.querySelectorAll('[data-answer] button').forEach(b=>b.disabled=true);
    settle(ok);
  }
  function finish(){
    const total=S.qs.length,acc=S.correct/total,stars=starsOf(acc);
    const secs=Math.round((Date.now()-S.start)/1000);
    const result={score:S.score,stars,correct:S.correct,total,maxStreak:S.maxStreak,secs,wrong:S.wrong.slice(),review:S.review};
    const info=opts.onFinish?opts.onFinish(result)||{}:{};
    const msg=tr('ui.msg'+stars);
    const miss=S.wrong.length?`<h3>${tr('ui.toReview',{n:S.wrong.length})}</h3><ul class="miss">${S.wrong.map(q=>`<li><span class="t">${T[q.type]}</span><span class="a">${esc(q.sum)}</span></li>`).join('')}</ul>`:'<p class="hint">'+tr('ui.noMiss')+'</p>';
    const acts=[];
    if(S.wrong.length)acts.push(`<button class="btn primary" type="button" data-a="review">${tr('ui.redo',{n:S.wrong.length})}</button>`);
    if(opts.rebuild)acts.push(`<button class="btn${S.wrong.length?'':' primary'}" type="button" data-a="again">${tr('ui.again')}</button>`);
    (opts.extraActions||[]).forEach(x=>acts.push(`<button class="btn" type="button" data-a="x:${esc(x.id)}">${esc(x.label)}</button>`));
    const el=q$('[data-result]');
    el.innerHTML=`<p class="hint" style="text-align:left">${S.review?tr('ui.review'):''}${esc(opts.title||'')}</p><h2>${msg}</h2><div class="bigscore"><span class="big">${fmt(S.score)}</span>${starsHTML(stars,34)}</div>${info.record?'<p class="newbest">'+tr('ui.newBest')+'</p>':''}${info.note?'<p>'+esc(info.note)+'</p>':''}<div class="stats"><div class="stat"><b>${S.correct}/${total}</b><span>${tr('ui.correct')}</span></div><div class="stat"><b>${S.maxStreak}</b><span>${tr('ui.maxStreak')}</span></div><div class="stat"><b>${fmtTime(secs)}</b><span>${tr('ui.time')}</span></div></div>${miss}<div class="actions">${acts.join('')}</div>`;
    q$('[data-play]').hidden=true;el.hidden=false;
    el.scrollIntoView({block:'start'});
  }

  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||!S)return;
    if(b.hasAttribute('data-quit')){clearTimeout(S.timer);opts.onQuit&&opts.onQuit();return}
    if(b.classList.contains('opt')&&!S.locked)choose(b.dataset.v);
    else if(b.classList.contains('mbtn'))onMatch(b);
    else if(b.hasAttribute('data-skip')&&!S.locked)submitTyped(true);
    else if(b.hasAttribute('data-next'))next();
    else if(b.dataset.a){
      const a=b.dataset.a;
      if(a==='review')start(shuffle(S.wrong),true);
      else if(a==='again')start(opts.rebuild());
      else if(a.startsWith('x:'))opts.onAction&&opts.onAction(a.slice(2));
    }
  },sig);
  root.addEventListener('submit',e=>{e.preventDefault();if(!S)return;if(S.locked){next();return}submitTyped(false)},sig);
  document.addEventListener('keydown',e=>{
    if(!S||!root.isConnected||q$('[data-play]')==null||q$('[data-play]').hidden)return;
    const q=cur();if(!q)return;
    if(e.key==='Enter'&&S.locked){e.preventDefault();next();return}
    if(!S.locked&&CHOICE.has(q.type)&&/^[1-4]$/.test(e.key)){
      const b=root.querySelectorAll('[data-answer] .opt')[Number(e.key)-1];
      if(b)choose(b.dataset.v);
    }
  },sig);

  start(opts.questions,opts.review);
  return {destroy(){clearTimeout(S&&S.timer);ac.abort();root.innerHTML=''}};
}
