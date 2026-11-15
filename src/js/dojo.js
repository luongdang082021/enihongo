import {t as tr,lang} from './i18n.js';
import {dojoSession,esc} from './quiz-core.js';
import {mountQuiz,starsHTML,fmt} from './quiz-ui.js';
import {dojoBest,saveDojo,weakMap,noteWeak} from './progress.js';
import {gather,mixKey} from './dojo-mix.js';

const $=id=>document.getElementById(id);
const home=$('home'),play=$('play');
let q=null;

function showHome(){
  if(q){q.destroy();q=null}
  play.hidden=true;home.hidden=false;renderPicksum();window.scrollTo(0,0);
}

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
    const {chars,words,sents}=gather(lessonsOf(c.id));
    const cnt=[chars.length?tr('d.cntChars',{n:chars.length}):'',words.length?tr('d.cntWords',{n:words.length}):'',sents.length?tr('d.cntSents',{n:sents.length}):''].filter(Boolean).join(' · ');
    return `<li><label><input type="checkbox" data-course="${esc(c.id)}"${sel.has(c.id)?' checked':''}><span>${esc(cname(c))}</span><span class="cnt">${cnt}</span></label></li>`;
  }).join('')+'</ul>';
  renderPicksum();
}
function renderPicksum(){
  const btn=$('startmix'),el=$('picksum');
  if(!pool)return;
  const {chars,words,sents}=gather(chosen());
  if(!chars.length&&!words.length&&!sents.length){el.textContent=tr('d.none');btn.disabled=true;return}
  const b=dojoBest()[mixKey(sel)];
  el.innerHTML=tr('d.picked',{n:sel.size,c:chars.length,w:words.length,s:sents.length})+(b?`${tr('d.best')}<b>${fmt(b.score)}</b> ${starsHTML(b.stars,14)}`:'');
  btn.disabled=false;
}
$('picker').addEventListener('change',e=>{
  const cc=e.target.closest('[data-course]');if(!cc)return;
  if(cc.checked)sel.add(cc.dataset.course);else sel.delete(cc.dataset.course);
  renderPicksum();
});
$('startmix').addEventListener('click',()=>startMix());

function startMix(){
  const ls=chosen(),{chars,words,sents}=gather(ls);
  if(!chars.length&&!words.length&&!sents.length)return;
  const key=mixKey(sel),ids=new Set(sel);
  const dj=dojoSession(chars,words,{weak:weakMap,sents});
  if(q)q.destroy();
  home.hidden=true;play.hidden=false;
  q=mountQuiz(play,{
    questions:dj.build(),title:tr('d.customTitle',{n:ids.size}),quitLabel:tr('d.menu'),
    rebuild:()=>dj.build(),
    followUp:dj.follow,
    extraActions:[{id:'home',label:tr('d.repick')}],
    onFinish:res=>{noteWeak(res.trail);return res.review?{}:{record:saveDojo(key,res.score,res.stars)}},
    onAction:()=>showHome(),
    onQuit:showHome
  });
  window.scrollTo(0,0);
}

loadPool();
