import {ROUNDS,build,esc} from './quiz-core.js';
import {mountQuiz,starsHTML,fmt} from './quiz-ui.js';
import {dojoBest,saveDojo} from './progress.js';

const home=document.getElementById('home'),play=document.getElementById('play'),ladder=document.getElementById('ladder'),total=document.getElementById('total');
let q=null,round=0;

function renderHome(){
  const best=dojoBest();
  ladder.innerHTML=ROUNDS.map((r,i)=>{
    const b=best[i];
    return `<li><button class="rung" type="button" data-r="${i}"><span class="num" aria-hidden="true">${r.num}</span><span class="rbody"><span class="rname">Hiệp ${i+1} · ${esc(r.name)}</span><span class="sub">${esc(r.sub)}</span><span class="chips">${esc(r.chips)}</span></span><span class="best">${b?starsHTML(b.stars,16)+'<b>'+fmt(b.score)+'</b>':'<span>Chưa chơi</span>'}</span></button></li>`;
  }).join('');
  const sum=Object.values(best).reduce((a,b)=>a+(b.score||0),0);
  total.innerHTML=sum?`Tổng điểm cao nhất: <b>${fmt(sum)}</b>`:'';
}
function showHome(){
  if(q){q.destroy();q=null}
  play.hidden=true;home.hidden=false;renderHome();window.scrollTo(0,0);
}
function start(i){
  round=i;
  if(q)q.destroy();
  home.hidden=true;play.hidden=false;
  const r=ROUNDS[i];
  q=mountQuiz(play,{
    questions:build(i),title:`Hiệp ${r.num} · ${r.name}`,quitLabel:'Menu',
    rebuild:()=>build(round),
    extraActions:[...(round<ROUNDS.length-1?[{id:'next',label:'Hiệp tiếp theo'}]:[]),{id:'home',label:'Về menu'}],
    onFinish:res=>res.review?{}:{record:saveDojo(round,res.score,res.stars)},
    onAction:id=>{if(id==='next')start(round+1);else showHome()},
    onQuit:showHome
  });
  window.scrollTo(0,0);
}
ladder.addEventListener('click',e=>{const b=e.target.closest('.rung');if(b)start(Number(b.dataset.r))});
renderHome();
