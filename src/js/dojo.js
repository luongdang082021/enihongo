import {ROUNDS,build,buildLesson,esc} from './quiz-core.js';
import {mountQuiz,starsHTML,fmt} from './quiz-ui.js';
import {dojoBest,saveDojo,getAll} from './progress.js';
import {gather,planFor,mixKey,QCOUNT} from './dojo-mix.js';

const $=id=>document.getElementById(id);
const home=$('home'),play=$('play'),ladder=$('ladder'),total=$('total');
let q=null,round=0;

/* ---------- 5 hiệp cố định ---------- */
function renderLadder(){
  const best=dojoBest();
  ladder.innerHTML=ROUNDS.map((r,i)=>{
    const b=best[i];
    return `<li><button class="rung" type="button" data-r="${i}"><span class="num" aria-hidden="true">${r.num}</span><span class="rbody"><span class="rname">Hiệp ${i+1} · ${esc(r.name)}</span><span class="sub">${esc(r.sub)}</span><span class="chips">${esc(r.chips)}</span></span><span class="best">${b?starsHTML(b.stars,16)+'<b>'+fmt(b.score)+'</b>':'<span>Chưa chơi</span>'}</span></button></li>`;
  }).join('');
  const sum=ROUNDS.reduce((a,_,i)=>a+((best[i]&&best[i].score)||0),0);
  total.innerHTML=sum?`Tổng điểm cao nhất: <b>${fmt(sum)}</b>`:'';
}
function showHome(){
  if(q){q.destroy();q=null}
  play.hidden=true;home.hidden=false;renderLadder();renderPicksum();window.scrollTo(0,0);
}
function startRound(i){
  round=i;
  if(q)q.destroy();
  home.hidden=true;play.hidden=false;
  const r=ROUNDS[i];
  q=mountQuiz(play,{
    questions:build(i),title:`Hiệp ${r.num} · ${r.name}`,quitLabel:'Menu',
    rebuild:()=>build(round),
    extraActions:[...(round<ROUNDS.length-1?[{id:'next',label:'Hiệp tiếp theo'}]:[]),{id:'home',label:'Về menu'}],
    onFinish:res=>res.review?{}:{record:saveDojo(round,res.score,res.stars)},
    onAction:id=>{if(id==='next')startRound(round+1);else showHome()},
    onQuit:showHome
  });
  window.scrollTo(0,0);
}
ladder.addEventListener('click',e=>{const b=e.target.closest('.rung');if(b)startRound(Number(b.dataset.r))});

/* ---------- tab ---------- */
function showTab(name){
  for(const t of document.querySelectorAll('[data-tab]'))t.setAttribute('aria-selected',String(t.dataset.tab===name));
  $('panel-fixed').hidden=name!=='fixed';
  $('panel-custom').hidden=name!=='custom';
  if(name==='custom')loadPool();
}
document.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)showTab(b.dataset.tab)});

/* ---------- tự chọn bài ---------- */
let pool=null,loading=null;
const sel=new Set();
function loadPool(){
  if(pool||loading)return loading;
  loading=fetch(new URL('../data/dojo-pool.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('http');return r.json()}).then(d=>{
    pool=d;
    const params=new URLSearchParams(location.search).get('bai');
    if(params)params.split(',').forEach(id=>{if(pool.lessons.some(l=>l.id===id))sel.add(id)});
    else autoSelectDone();
    renderPicker();
  }).catch(()=>{$('picksum').textContent='Không tải được danh sách bài. Kiểm tra kết nối rồi thử lại.';loading=null});
  return loading;
}
function autoSelectDone(){
  const ls=getAll().lessons;
  pool.lessons.forEach(l=>{if(ls[l.id]&&ls[l.id].done)sel.add(l.id)});
}
const chosen=()=>pool?pool.lessons.filter(l=>sel.has(l.id)):[];
function renderPicker(){
  $('topics').innerHTML=Object.entries(pool.tags).map(([id,label])=>{
    const ls=pool.lessons.filter(l=>l.tags.includes(id));
    if(!ls.length)return '';
    const on=ls.every(l=>sel.has(l.id));
    return `<button type="button" class="topic" data-topic="${esc(id)}" aria-pressed="${on}">${esc(label)}</button>`;
  }).join('');
  const done=getAll().lessons;
  $('picklist').innerHTML=pool.courses.map(c=>{
    const ls=pool.lessons.filter(l=>l.course===c.id);
    const nSel=ls.filter(l=>sel.has(l.id)).length;
    const rows=ls.map(l=>{
      const n=l.chars.length,w=l.words.length;
      const cnt=[n?n+' chữ':'',w?w+' từ':''].filter(Boolean).join(' · ');
      return `<li><label><input type="checkbox" data-lesson="${esc(l.id)}"${sel.has(l.id)?' checked':''}><span>Bài ${l.n} · ${esc(l.title)}${done[l.id]&&done[l.id].done?'<span class="done-mark">Đã học</span>':''}</span><span class="cnt">${cnt}</span></label></li>`;
    }).join('');
    return `<details class="course-group" open><summary><label class="course-all"><input type="checkbox" data-course="${esc(c.id)}"${nSel===ls.length?' checked':''}${nSel>0&&nSel<ls.length?' data-partial="1"':''}><span>Cả khóa: ${esc(c.name)}</span><span class="cnt">${nSel}/${ls.length} bài</span></label></summary><ul class="picklist">${rows}</ul></details>`;
  }).join('');
  document.querySelectorAll('[data-partial]').forEach(el=>{el.indeterminate=true});
  renderPicksum();
}
function renderPicksum(){
  const btn=$('startmix'),el=$('picksum');
  if(!pool)return;
  const {chars,words}=gather(chosen());
  if(!chars.length&&!words.length){el.textContent='Chưa chọn bài nào.';btn.disabled=true;return}
  const b=dojoBest()[mixKey(sel)];
  const nc=new Set(chosen().map(l=>l.course)).size;
  el.innerHTML=`Đã chọn ${sel.size} bài (${nc} khóa): ${chars.length} chữ, ${words.length} từ.${b?` Điểm cao lượt này: <b>${fmt(b.score)}</b> ${starsHTML(b.stars,14)}`:''}`;
  btn.disabled=false;
}
$('panel-custom').addEventListener('change',e=>{
  const cc=e.target.closest('[data-course]');
  if(cc){pool.lessons.filter(l=>l.course===cc.dataset.course).forEach(l=>cc.checked?sel.add(l.id):sel.delete(l.id));renderPicker();return}
  const cb=e.target.closest('[data-lesson]');if(!cb)return;
  if(cb.checked)sel.add(cb.dataset.lesson);else sel.delete(cb.dataset.lesson);
  renderPicker();
});
$('panel-custom').addEventListener('click',e=>{
  const t=e.target.closest('[data-topic]');
  if(t){
    const ls=pool.lessons.filter(l=>l.tags.includes(t.dataset.topic));
    const on=ls.every(l=>sel.has(l.id));
    ls.forEach(l=>on?sel.delete(l.id):sel.add(l.id));
    renderPicker();return;
  }
  const p=e.target.closest('[data-pick]');
  if(p&&pool){
    sel.clear();
    if(p.dataset.pick==='all')pool.lessons.forEach(l=>sel.add(l.id));
    else if(p.dataset.pick==='done')autoSelectDone();
    renderPicker();
  }
});
$('startmix').addEventListener('click',()=>startMix());

function startMix(){
  const ls=chosen(),{chars,words}=gather(ls),plan=planFor(chars,words);
  if(!plan)return;
  const key=mixKey(sel),ids=new Set(sel);
  const mk=()=>buildLesson(chars,plan,words);
  if(q)q.destroy();
  home.hidden=true;play.hidden=false;
  q=mountQuiz(play,{
    questions:mk(),title:`Tự chọn · ${ids.size} bài`,quitLabel:'Menu',
    rebuild:mk,
    extraActions:[{id:'home',label:'Chọn lại bài'}],
    onFinish:res=>res.review?{}:{record:saveDojo(key,res.score,res.stars)},
    onAction:()=>showHome(),
    onQuit:showHome
  });
  window.scrollTo(0,0);
}

renderLadder();
if(new URLSearchParams(location.search).has('bai'))showTab('custom');
