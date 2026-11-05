import {t as tr,lang} from './i18n.js';
import {ROUNDS,build,buildLesson,esc} from './quiz-core.js';
import {mountQuiz,starsHTML,fmt} from './quiz-ui.js';
import {dojoBest,saveDojo} from './progress.js';
import {gather,planFor,mixKey,QCOUNT} from './dojo-mix.js';

const $=id=>document.getElementById(id);
const home=$('home'),play=$('play'),ladder=$('ladder'),total=$('total');
let q=null,round=0;

/* ---------- 5 hiệp cố định ---------- */
function renderLadder(){
  const best=dojoBest();
  ladder.innerHTML=ROUNDS.map((r,i)=>{
    const b=best[i];
    return `<li><button class="rung" type="button" data-r="${i}"><span class="num" aria-hidden="true">${r.num}</span><span class="rbody"><span class="rname">${esc(tr('d.round',{i:i+1,name:r.name}))}</span><span class="sub">${esc(r.sub)}</span><span class="chips">${esc(r.chips)}</span></span><span class="best">${b?starsHTML(b.stars,16)+'<b>'+fmt(b.score)+'</b>':'<span>'+tr('d.unplayed')+'</span>'}</span></button></li>`;
  }).join('');
  const sum=ROUNDS.reduce((a,_,i)=>a+((best[i]&&best[i].score)||0),0);
  total.innerHTML=sum?tr('d.total',{n:fmt(sum)}):'';
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
    questions:build(i),title:tr('d.roundTitle',{num:r.num,name:r.name}),quitLabel:tr('d.menu'),
    rebuild:()=>build(round),
    extraActions:[...(round<ROUNDS.length-1?[{id:'next',label:tr('d.nextRound')}]:[]),{id:'home',label:tr('d.toMenu')}],
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

/* ---------- tự chọn khóa học ---------- */
/* Phạm vi là khóa học: mặc định chọn toàn bộ nội dung của khóa, không chọn từng bài. */
let pool=null,loading=null;
const sel=new Set(); // id khóa đang chọn
function loadPool(){
  if(pool||loading)return loading;
  loading=fetch(new URL('../data/dojo-pool.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('http');return r.json()}).then(d=>{
    pool=d;
    const want=new URLSearchParams(location.search).get('khoa');
    if(want&&pool.courses.some(c=>c.id===want))sel.add(want);
    else pool.courses.forEach(c=>sel.add(c.id));
    renderPicker();
  }).catch(()=>{$('picksum').textContent=tr('d.loadFail');loading=null});
  return loading;
}
const cname=c=>(lang==='en'&&c.en)||c.name;
const lessonsOf=id=>pool.lessons.filter(l=>l.course===id);
const chosen=()=>pool?pool.lessons.filter(l=>sel.has(l.course)):[];
function renderPicker(){
  $('picklist').innerHTML='<ul class="picklist">'+pool.courses.map(c=>{
    const {chars,words}=gather(lessonsOf(c.id));
    const cnt=[chars.length?tr('d.cntChars',{n:chars.length}):'',words.length?tr('d.cntWords',{n:words.length}):''].filter(Boolean).join(' · ');
    return `<li><label><input type="checkbox" data-course="${esc(c.id)}"${sel.has(c.id)?' checked':''}><span>${esc(cname(c))}</span><span class="cnt">${cnt}</span></label></li>`;
  }).join('')+'</ul>';
  renderPicksum();
}
function renderPicksum(){
  const btn=$('startmix'),el=$('picksum');
  if(!pool)return;
  const {chars,words}=gather(chosen());
  if(!chars.length&&!words.length){el.textContent=tr('d.none');btn.disabled=true;return}
  const b=dojoBest()[mixKey(sel)];
  el.innerHTML=tr('d.picked',{n:sel.size,c:chars.length,w:words.length})+(b?`${tr('d.best')}<b>${fmt(b.score)}</b> ${starsHTML(b.stars,14)}`:'');
  btn.disabled=false;
}
$('panel-custom').addEventListener('change',e=>{
  const cc=e.target.closest('[data-course]');if(!cc)return;
  if(cc.checked)sel.add(cc.dataset.course);else sel.delete(cc.dataset.course);
  renderPicksum();
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
    questions:mk(),title:tr('d.customTitle',{n:ids.size}),quitLabel:tr('d.menu'),
    rebuild:mk,
    extraActions:[{id:'home',label:tr('d.repick')}],
    onFinish:res=>res.review?{}:{record:saveDojo(key,res.score,res.stars)},
    onAction:()=>showHome(),
    onQuit:showHome
  });
  window.scrollTo(0,0);
}

renderLadder();
if(new URLSearchParams(location.search).has('khoa'))showTab('custom');
