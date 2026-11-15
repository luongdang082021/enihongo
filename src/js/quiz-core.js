import {t as tr,gloss,has,lang} from './i18n.js';



/* ---------- helpers ---------- */
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const shuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=rnd(i+1);const t=b[i];b[i]=b[j];b[j]=t}return b};
const take=(a,n)=>shuffle(a).slice(0,n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- kana data ---------- */
const parseRows=a=>a.map(s=>s.split(' ').map(t=>{const p=t.split(':');return{k:p[0],r:p[1]}}));
const BASIC=parseRows(['あ:a い:i う:u え:e お:o','か:ka き:ki く:ku け:ke こ:ko','さ:sa し:shi す:su せ:se そ:so','た:ta ち:chi つ:tsu て:te と:to','な:na に:ni ぬ:nu ね:ne の:no','は:ha ひ:hi ふ:fu へ:he ほ:ho','ま:ma み:mi む:mu め:me も:mo','や:ya ゆ:yu よ:yo','ら:ra り:ri る:ru れ:re ろ:ro','わ:wa を:wo ん:n']);
const DAKU=parseRows(['が:ga ぎ:gi ぐ:gu げ:ge ご:go','ざ:za じ:ji ず:zu ぜ:ze ぞ:zo','だ:da ぢ:ji づ:zu で:de ど:do','ば:ba び:bi ぶ:bu べ:be ぼ:bo','ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po']);
const YOON=parseRows(['きゃ:kya きゅ:kyu きょ:kyo','しゃ:sha しゅ:shu しょ:sho','ちゃ:cha ちゅ:chu ちょ:cho','にゃ:nya にゅ:nyu にょ:nyo','ひゃ:hya ひゅ:hyu ひょ:hyo','みゃ:mya みゅ:myu みょ:myo','りゃ:rya りゅ:ryu りょ:ryo','ぎゃ:gya ぎゅ:gyu ぎょ:gyo','じゃ:ja じゅ:ju じょ:jo','びゃ:bya びゅ:byu びょ:byo','ぴゃ:pya ぴゅ:pyu ぴょ:pyo']);
const toK=s=>[...s].map(c=>c>='ぁ'&&c<='ゖ'?String.fromCharCode(c.charCodeAt(0)+96):c).join('');
const kRows=rows=>rows.map(row=>row.map(x=>({k:toK(x.k),r:x.r})));
const KBASIC=kRows(BASIC),KDAKU=kRows(DAKU),KYOON=kRows(YOON);
/* âm mở rộng của Katakana, dùng để đọc từ mượn */
const KEXT=parseRows(['ファ:fa フィ:fi フェ:fe フォ:fo','ティ:ti ディ:di ウィ:wi ウェ:we ウォ:wo','ジェ:je シェ:she チェ:che']);
const R={};[BASIC,DAKU,YOON,KBASIC,KDAKU,KYOON,KEXT].forEach(rows=>rows.flat().forEach(x=>{R[x.k]=x.r}));
const AMB=new Set(['ぢ','づ','ヂ','ヅ']);
const ALT={'を':['o'],'ん':['nn'],'ヲ':['o'],'ン':['nn']};
const isKata=s=>/[ァ-ヺー]/.test(s);
const SMALL='ゃゅょャュョァィゥェォ';
const SOK='っッ';
const noteOf=k=>has('note.'+k)?tr('note.'+k):'';

/* ---------- words (mora based) ---------- */
function parseMorae(s){const out=[];for(const ch of s){if(SMALL.includes(ch)&&out.length)out[out.length-1]+=ch;else out.push(ch)}return out}
function romajiOf(m){let out='',pend=false;for(const x of m){if(SOK.includes(x)){pend=true;continue}if(x==='ー'){out+=out.slice(-1);continue}const r=R[x]||'?';out+=pend?(r.startsWith('ch')?'t':r[0])+r:r;pend=false}return out}

const V=x=>{const r=R[x];return r?r[r.length-1]:''};
const isV=v=>v.length===1&&'aiueo'.includes(v);
function isLong(m,i){
  if(i<1)return false;
  if(m[i]==='ー')return true;
  const c=m[i],pv=V(m[i-1]);
  if(!isV(pv))return false;
  return (c==='あ'&&pv==='a')||(c==='い'&&(pv==='i'||pv==='e'))||(c==='う'&&(pv==='u'||pv==='o'))||(c==='え'&&pv==='e')||(c==='お'&&pv==='o');
}

/* confusable kana for wrong spellings */
const CONF={};
const link=(a,b)=>{(CONF[a]=CONF[a]||[]).push(b);(CONF[b]=CONF[b]||[]).push(a)};
'かが きぎ くぐ けげ こご さざ しじ すず せぜ そぞ ただ てで とど はば ひび ふぶ へべ ほぼ はぱ ぬめ ねれ れわ るろ まも あお さち いり ゆや つし'.split(' ').forEach(p=>link(p[0],p[1]));
'カガ キギ クグ ケゲ コゴ サザ スズ セゼ タダ テデ トド ハバ ヒビ フブ ヘベ ホボ ハパ シツ ソン ノメ クワ ナメ ウワ ヌス コユ チテ ケタ'.split(' ').forEach(p=>link(p[0],p[1]));

const mutations={
  remSok(m){const i=m.findIndex(x=>SOK.includes(x));if(i<0)return null;const b=m.slice();b.splice(i,1);return b},
  addSok(m){const c=[];for(let i=0;i<m.length-1;i++){const n=m[i+1];if(!SOK.includes(m[i])&&m[i]!=='ん'&&m[i]!=='ン'&&m[i]!=='ー'&&!SOK.includes(n)&&R[n]&&/^(k|s|t|p|ch|sh|ts)/.test(R[n]))c.push(i)}if(!c.length)return null;const b=m.slice();b.splice(pick(c)+1,0,m.some(isKata)?'ッ':'っ');return b},
  remLong(m){const c=[];m.forEach((x,i)=>{if(isLong(m,i))c.push(i)});if(!c.length)return null;const b=m.slice();b.splice(pick(c),1);return b},
  addLong(m){const c=[];m.forEach((x,i)=>{if(isV(V(x))&&!(m[i+1]&&isLong(m,i+1)))c.push(i)});if(!c.length)return null;const i=pick(c);const ins=m.some(isKata)?'ー':{a:'あ',i:'い',u:'う',e:'い',o:'う'}[V(m[i])];const b=m.slice();b.splice(i+1,0,ins);return b},
  swapLong(m){if(m.some(isKata))return null;const c=[];m.forEach((x,i)=>{if(!isLong(m,i))return;const pv=V(m[i-1]);if((x==='う'||x==='お')&&pv==='o')c.push(i);if((x==='い'||x==='え')&&pv==='e')c.push(i)});if(!c.length)return null;const i=pick(c);const sw={'う':'お','お':'う','い':'え','え':'い'};const b=m.slice();b[i]=sw[m[i]];return b},
  swap(m){const c=[];m.forEach((x,i)=>{if(CONF[x])c.push(i)});if(!c.length)return null;const i=pick(c);const b=m.slice();b[i]=pick(CONF[m[i]]);return b}
};
function mutants(w,n){
  const names=Object.keys(mutations),out=[],seen=new Set([w.r]);
  const order=shuffle(names).concat(Array.from({length:40},()=>pick(names)));
  for(const nm of order){
    if(out.length>=n)break;
    const b=mutations[nm](w.m);if(!b)continue;
    const r=romajiOf(b);if(seen.has(r))continue;
    seen.add(r);out.push({m:b,k:b.join(''),r:r});
  }
  let guard=0;
  while(out.length<n&&guard++<60){
    const b=w.m.slice();const i=rnd(b.length);if(b[i]==='ー'||SOK.includes(b[i]))continue;b[i]=pick((w.m.some(isKata)?KBASIC:BASIC).flat()).k;
    const r=romajiOf(b);if(seen.has(r))continue;
    seen.add(r);out.push({m:b,k:b.join(''),r:r});
  }
  return out;
}

/* ---------- romaji input normaliser ---------- */
function norm(s){
  return s.toLowerCase().replace(/[\s'’`\-・.]/g,'')
    .replace(/sy([aou])/g,'sh$1').replace(/ty([aou])/g,'ch$1').replace(/cy([aou])/g,'ch$1').replace(/(?:zy|jy)([aou])/g,'j$1')
    .replace(/(^|[^sc])hu/g,'$1fu').replace(/si/g,'shi').replace(/ti/g,'chi').replace(/tu/g,'tsu').replace(/zi/g,'ji').replace(/di/g,'ji').replace(/du/g,'zu');
}

/* ---------- distractors ---------- */
function distract(it,pool,n){
  const seen=new Set([it.r]);
  const c=shuffle(pool).filter(x=>{if(seen.has(x.r))return false;seen.add(x.r);return true});
  const sc=x=>(x.r[0]===it.r[0]?2:0)+(x.r.slice(-1)===it.r.slice(-1)?1.5:0)+Math.random()*1.6;
  return c.map(x=>[x,sc(x)]).sort((a,b)=>b[1]-a[1]).slice(0,n).map(p=>p[0]);
}

/* ---------- explanations ---------- */
function explainK(it){
  let s=tr('e.read',{k:esc(it.k),r:esc(it.r)});
  if(noteOf(it.k))s+=' '+noteOf(it.k);
  if(it.k.length>1)s+=tr(isKata(it.k)?'e.smallK':'e.yoonK');
  return s;
}
function explainW(w){
  const gl=gloss(w);
  let s=`<b>${esc(w.k)}</b> = <b>${esc(w.r)}</b>${gl?' · '+esc(gl):''}<br><span class="mm">${w.m.join('・')}</span>`;
  const n=[];
  if(w.m.some(x=>SOK.includes(x)))n.push(tr(isKata(w.k)?'e.sokK':'e.sok'));
  if(w.m.some((x,i)=>isLong(w.m,i)))n.push(tr(w.m.includes('ー')?'e.longK':'e.long'));
  if(w.m.some(x=>x.length>1))n.push(tr('e.yoonW'));
  return s+(n.length?'<br>'+n.join('<br>'):'');
}

/* ---------- question builders ---------- */
const T=Object.fromEntries(['k2r','r2k','type','match','odd','size','wk2r','wr2k','wtype','fill','mora','compose','wk2m','wm2k','order','particle','sk2m'].map(k=>[k,tr('ty.'+k)]));
const CHOICE=new Set(['k2r','r2k','odd','size','wk2r','wr2k','fill','mora','wk2m','wm2k','particle','sk2m']);
const PLAIN=new Set(['k2r','r2k','odd','size','type','match']);

function qK2R(it,pool){
  return{type:'k2r',prompt:tr('p.k2r'),stage:{m:parseMorae(it.k)},opts:shuffle([it.r,...distract(it,pool,3).map(x=>x.r)]),font:'latin',answer:it.r,explain:explainK(it),sum:`${it.k} = ${it.r}`,src:{c:[it]}};
}
function qR2K(it,pool){
  return{type:'r2k',prompt:tr('p.r2k'),stage:{text:it.r},opts:shuffle([it.k,...distract(it,pool,3).map(x=>x.k)]),font:'kana',answer:it.k,explain:explainK(it),sum:`${it.r} = ${it.k}`,src:{c:[it]}};
}
function qType(it){
  return{type:'type',prompt:tr('p.type'),stage:{m:parseMorae(it.k),hint:tr('h.type')},answer:it.r,alt:ALT[it.k]||[],cap:15,explain:explainK(it),sum:`${it.k} = ${it.r}`,src:{c:[it]}};
}
function qMatch(g){
  return{type:'match',prompt:tr('p.match'),pairs:g,cap:25,explain:g.map(p=>`${esc(p.k)} = ${esc(p.r)}`).join(' · '),sum:g.map(p=>`${p.k} ${p.r}`).join(', '),src:{c:g}};
}
function qOdd(rows){
  const el=rows.map(r=>r.filter(x=>!AMB.has(x.k))).filter(r=>r.length>=3);
  const A=pick(el),trio=take(A,3);
  let out=null;
  for(const B of shuffle(el.filter(r=>r!==A))){const c=B.filter(x=>!A.some(a=>a.r===x.r));if(c.length){out=pick(c);break}}
  return{type:'odd',prompt:tr('p.odd',{list:A.map(x=>x.r).join(', ')}),opts:shuffle([...trio.map(x=>x.k),out.k]),font:'kana',answer:out.k,
    explain:tr('e.odd',{k:esc(out.k),r:esc(out.r),rest:trio.map(x=>esc(x.k)+' ('+esc(x.r)+')').join(', ')}),sum:`${out.k} = ${out.r}`,src:{c:[out]}};
}
const LARGE={'ゃ':'や','ゅ':'ゆ','ょ':'よ','ャ':'ヤ','ュ':'ユ','ョ':'ヨ'};
function qSize(y){
  const c=y.k[0],s=y.k[1],l=LARGE[s];
  const large=c+l;
  const kat=isKata(y.k);
  const other=c+pick((kat?'ャュョ':'ゃゅょ').split('').filter(z=>z!==s));
  const diff=pick((kat?KYOON:YOON).flat().filter(x=>x.k[1]===s&&x.k[0]!==c)).k;
  return{type:'size',prompt:tr('p.size',{r:y.r}),stage:{text:y.r},opts:shuffle([y.k,large,other,diff]),font:'kana',answer:y.k,
    explain:tr('e.size',{k:y.k,r:y.r,s:s,large:large,l:l,r1:R[c],r2:R[l]}),sum:`${y.r} = ${y.k}`,src:{c:[y]}};
}
function qWK2R(w){
  return{type:'wk2r',prompt:tr('p.wk2r'),stage:{m:w.m},opts:shuffle([w.r,...mutants(w,3).map(x=>x.r)]),font:'latin',answer:w.r,explain:explainW(w),sum:`${w.k} = ${w.r}`,src:{w}};
}
function qWR2K(w){
  return{type:'wr2k',prompt:tr('p.wr2k'),stage:{text:w.r,hint:gloss(w)},opts:shuffle([w.k,...mutants(w,3).map(x=>x.k)]),font:'kana',answer:w.k,explain:explainW(w),sum:`${w.r} = ${w.k}`,src:{w}};
}
function qWType(w){
  return{type:'wtype',prompt:tr('p.wtype'),stage:{m:w.m,hint:tr('h.wtype')},answer:w.r,alt:[],cap:20,explain:explainW(w),sum:`${w.k} = ${w.r}`,src:{w}};
}
function qFill(w){
  const c=[];w.m.forEach((x,i)=>{if(SOK.includes(x)||isLong(w.m,i))c.push(i)});
  const i=pick(c),ans=w.m[i],kat=isKata(w.k);
  const ds=ans==='っ'?['つ','う','ん']:ans==='ッ'?['ツ','シ','ン']:kat?take(['ア','イ','ウ','エ','オ','ッ'].filter(x=>x!==ans),3):take(['あ','い','う','え','お','っ'].filter(x=>x!==ans),3);
  return{type:'fill',prompt:tr('p.fill'),stage:{m:w.m,blank:i,hint:`${w.r} · ${gloss(w)}`},opts:shuffle([ans,...ds]),font:'kana',answer:ans,explain:explainW(w),sum:`${w.k} = ${w.r}`,src:{w}};
}
function qMora(w){
  const n=w.m.length,len=[...w.k].length;
  const pr=[len!==n?len:0,n+1,n-1,n+2,n-2].filter(x=>x>=1&&x!==n);
  const ds=[];pr.forEach(x=>{if(!ds.includes(x)&&ds.length<3)ds.push(x)});
  return{type:'mora',prompt:tr('p.mora'),stage:{m:w.m},opts:[n,...ds].sort((a,b)=>a-b).map(String),font:'num',answer:String(n),
    explain:tr('e.mora',{morae:w.m.map(esc).join(' | '),n:n,k:esc(w.k),r:esc(w.r),gl:esc(gloss(w))}),sum:tr('s.mora',{k:w.k,n:n}),src:{w}};
}


/* ---------- nghĩa của từ, câu, trợ từ ---------- */
const PARTS=['は','が','を','に','で','へ','と','も','の','か'];
const sgloss=s=>(lang==='en'&&s.en)||s.vi;
const explainS=s=>`<b>${esc(s.ja)}</b><br>${esc(s.r)}<br>${esc(sgloss(s))}`;
function qWK2M(w,ws){
  const ds=take(shuffle(ws.filter(x=>x.k!==w.k&&gloss(x)!==gloss(w))).filter((x,i,a)=>a.findIndex(y=>gloss(y)===gloss(x))===i),3);
  return{type:'wk2m',prompt:tr('p.wk2m'),stage:{m:w.m,hint:w.r},opts:shuffle([gloss(w),...ds.map(gloss)]),font:'latin',answer:gloss(w),explain:explainW(w),sum:`${w.k} = ${gloss(w)}`,src:{w}};
}
function qWM2K(w,ws){
  const ds=take(shuffle(ws.filter(x=>x.k!==w.k)),3);
  return{type:'wm2k',prompt:tr('p.wm2k'),stage:{text:gloss(w),gloss:true},opts:shuffle([w.k,...ds.map(x=>x.k)]),font:'kana',answer:w.k,explain:explainW(w),sum:`${gloss(w)} = ${w.k}`,src:{w}};
}
function qOrder(sn){
  const extra=sn.t.some(x=>PARTS.includes(x))?take(PARTS.filter(p=>!sn.t.includes(p)),1):[];
  let tiles=shuffle([...sn.t,...extra]);
  for(let i=0;i<6&&sn.t.length>1&&tiles.slice(0,sn.t.length).join('')===sn.t.join('');i++)tiles=shuffle(tiles);
  return{type:'order',prompt:tr('p.order'),stage:{text:sgloss(sn),hint:tr('h.order'),gloss:true},tiles:tiles,slotN:sn.t.length,wide:true,font:'kana',answer:sn.t.join(''),cap:60,explain:explainS(sn),sum:sn.ja,src:{s:sn}};
}
function qParticle(sn){
  const i=pick(sn.b),ans=sn.t[i];
  const ds=take(PARTS.filter(p=>p!==ans),3);
  return{type:'particle',prompt:tr('p.particle'),stage:{text:sn.t.map((x,j)=>j===i?'＿＿':x).join(' '),hint:sgloss(sn)},opts:shuffle([ans,...ds]),font:'kana',answer:ans,explain:explainS(sn),sum:sn.ja,src:{s:sn}};
}
function qSK2M(sn,sns){
  const ds=take(shuffle(sns.filter(x=>x.ja!==sn.ja&&sgloss(x)!==sgloss(sn))).filter((x,i,a)=>a.findIndex(y=>sgloss(y)===sgloss(x))===i),3);
  return{type:'sk2m',prompt:tr('p.sk2m'),stage:{text:sn.ja,hint:sn.r},opts:shuffle([sgloss(sn),...ds.map(sgloss)]),font:'latin',answer:sgloss(sn),explain:explainS(sn),sum:sn.ja,src:{s:sn}};
}

/* ---------- soạn chữ từ romaji ---------- */
/* Người chơi chạm các ô chữ theo đúng thứ tự. Ô thừa lấy từ các lỗi dễ nhầm (chữ giống nhau, âm đục, trường âm, âm ngắt). */
function qCompose(w,src){
  const cnt=m=>{const c=new Map();m.forEach(x=>c.set(x,(c.get(x)||0)+1));return c};
  const have=cnt(w.m),ex=[];
  const kat=w.m.some(isKata),BAS=(kat?KBASIC:BASIC).flat().filter(x=>!AMB.has(x.k)).map(x=>x.k);
  mutants(w,6).forEach(b=>cnt(b.m).forEach((n,x)=>{if(!have.has(x)&&!ex.includes(x))ex.push(x)}));
  const want=w.m.length<=2?2:3;
  const extra=take(ex,want);
  if(extra.length<want)extra.push(...take(BAS.filter(x=>!have.has(x)&&!extra.includes(x)),want-extra.length));
  let tiles=shuffle([...w.m,...extra]);
  for(let i=0;i<6&&w.m.length>1&&tiles.slice(0,w.m.length).join('')===w.k;i++)tiles=shuffle(tiles);
  return{type:'compose',prompt:tr('p.compose'),stage:{text:w.r,hint:gloss(w)||tr('h.compose')},tiles:tiles,slotN:w.m.length,font:'kana',answer:w.k,cap:40,explain:explainW(w),sum:`${w.r} = ${w.k}`,src:src};
}
const NOCHAIN='んンをヲ';
const composable=x=>!AMB.has(x.k)&&!NOCHAIN.includes(x.k);
function qComposeChain(its){
  const m=its.map(x=>x.k);
  return qCompose({k:m.join(''),m:m,r:its.map(x=>x.r).join(''),vi:'',en:''},{c:its});
}

/* ---------- phiên chơi: bộ câu hỏi và câu nhắc lại ---------- */
const isYoonK=k=>k.length===2&&'ゃゅょャュョ'.includes(k[1]);
const hasSpecial=w=>w.m.some((x,i)=>SOK.includes(x)||isLong(w.m,i));
function session(chars,words,o){
  o=o||{};
  const weak=typeof o.weak==='function'?o.weak():(o.weak||{});
  const wt=k=>1+(weak[k]||0);
  let items=chars.map(c=>({k:c.k,r:c.r})).filter(x=>!AMB.has(x.k));
  const srcs=chars.length?chars.map(c=>c.k):(words||[]).map(w=>w.kana);
  const hasK=srcs.some(isKata),hasH=srcs.some(k=>!isKata(k));
  const kat=hasK&&!hasH;
  const BAS=kat?KBASIC:BASIC;
  const ws=(words||[]).filter(w=>w.quiz!==false).map(w=>mkWord(w.kana,w.vi,w.romaji,w.en));
  const sns=(o.sents||[]).map(mkSent);
  const pS=sns.filter(s=>s.b.length),usedS=new Set();
  const dS=f=>draw(sns.map(s=>s),usedS,f);
  if(o.needChars!==false&&items.length<4){ // bài ít chữ (vd わ を ん): thêm vài chữ cũ để ôn
    const extra=take(BAS.flat().filter(x=>!AMB.has(x.k)&&!items.some(i=>i.k===x.k)&&x.k!=='を'&&x.k!=='ヲ'),4);
    items=[...items,...extra];
  }
  const pool=items.length>=8?items:[...items,...BAS.flat().filter(x=>!AMB.has(x.k)&&!items.some(i=>i.k===x.k))];
  const used=new Set(),usedW=new Set();
  const wpick=c=>{let tot=0;for(const x of c)tot+=wt(x.k);let r=Math.random()*tot;for(const x of c){r-=wt(x.k);if(r<0)return x}return c[c.length-1]};
  const draw=(src,set,f)=>{let c=src.filter(x=>!set.has(x.k)&&(!f||f(x)));if(!c.length){set.clear();c=src.filter(x=>!f||f(x))}if(!c.length)return null;const x=wpick(c);set.add(x.k);return x};
  const dI=f=>draw(items,used,f),dW=f=>draw(ws,usedW,f);

  function composeQ(){
    const okC=items.filter(composable);
    if(ws.length&&(okC.length<2||Math.random()<.7)){const w=dW();return qCompose(w,{w})}
    if(okC.length<2)return qK2R(dI(),pool);
    const n=okC.length>=3&&Math.random()<.4?3:2,its=[];
    while(its.length<n){const x=dI(y=>composable(y)&&!its.includes(y));if(!x)break;its.push(x)}
    return its.length<2?qK2R(dI(),pool):qComposeChain(its);
  }
  function make(t){
    switch(t){
      case 'k2r':return qK2R(dI(),pool);
      case 'r2k':return qR2K(dI(),pool);
      case 'type':return qType(dI());
      case 'match':{const g=[];let n=0;while(g.length<Math.min(4,items.length)&&n++<80){const x=dI();if(!g.some(y=>y.k===x.k||y.r===x.r))g.push(x)}return qMatch(g)}
      case 'size':{const y=dI(x=>isYoonK(x.k));if(!y)throw new Error('size cần chữ ghép');return qSize(y)}
      case 'wk2r':return qWK2R(dW());
      case 'wr2k':return qWR2K(dW());
      case 'wtype':return qWType(dW());
      case 'fill':{const w=dW(hasSpecial);return w?qFill(w):qMora(dW())}
      case 'mora':return qMora(dW());
      case 'compose':return composeQ();
      case 'wk2m':return qWK2M(dW(),ws);
      case 'wm2k':return qWM2K(dW(),ws);
      case 'order':return qOrder(dS());
      case 'particle':return qParticle(dS(x=>x.b.length));
      case 'sk2m':return qSK2M(dS(),sns);
    }
    throw new Error('unknown type '+t);
  }
  const firstEasy=order=>{const f=order.findIndex(t=>t==='k2r'||t==='wk2r');if(f>0){const t=order[0];order[0]=order[f];order[f]=t}return order};

  /* Kế hoạch cố định (mini quiz trong bài học) */
  function fromPlan(plan){
    const list=[];Object.entries(plan).forEach(([t,n])=>{for(let i=0;i<n;i++)list.push(t)});
    return firstEasy(shuffle(list)).map(make);
  }

  /* Dojo: chọn dạng câu theo trọng số ngẫu nhiên, có giới hạn mỗi dạng, không để cùng một dạng ba câu liền. */
  function dojo(n){
    n=n||20;
    const T=[];
    const composeW=(items.filter(composable).length>=2?2.5:0)+(ws.length?3:0);
    if(items.length&&(chars.length||!ws.length)){
      T.push(['k2r',3,9],['r2k',3,9],['type',2,5]);
      if(items.length>=4)T.push(['match',1,1]);
      if(items.some(x=>isYoonK(x.k)))T.push(['size',1.5,3]);
    }
    if(ws.length)T.push(['wk2r',2.5,8],['wr2k',2.5,8],['wtype',2,5],['mora',1,2]);
    const mw=ws.filter(w=>gloss(w)).length>=4;
    if(mw)T.push(['wk2m',2.5,6],['wm2k',2,5]);
    if(sns.length>=1){T.push(['order',2.5,5]);if(sns.length>=4)T.push(['sk2m',2,4]);if(pS.length)T.push(['particle',2.5,5])}
    if(ws.some(hasSpecial))T.push(['fill',1.5,3]);
    if(composeW>0)T.push(['compose',composeW,5]);
    const order=[],cnt={};
    for(let i=0;i<n;i++){
      const last=order.slice(-2);
      let c=T.filter(([t,,cap])=>(cnt[t]||0)<cap&&!(last.length===2&&last[0]===t&&last[1]===t));
      if(i===0){const e=c.filter(([t])=>t==='k2r'||t==='wk2r');if(e.length)c=e}
      if(!c.length)c=T;
      const tot=c.reduce((a,x)=>a+x[1],0);
      let r=Math.random()*tot,t=c[c.length-1][0];
      for(const x of c){r-=x[1];if(r<0){t=x[0];break}}
      cnt[t]=(cnt[t]||0)+1;order.push(t);
    }
    return order.map(make);
  }

  /* Câu nhắc lại sau khi sai: cùng chữ hoặc từ đó nhưng ở dạng khác. Tối đa hai lần nhắc cho mỗi câu gốc. */
  function follow(q){
    const d=q.depth||0;
    if(d>=2||!q.src)return null;
    let fq=null;
    if(q.src.s){
      const sn=q.src.s,ts=['order'];if(sns.length>=4)ts.push('sk2m');if(sn.b&&sn.b.length)ts.push('particle');
      const ts2=ts.filter(x=>x!==q.type),t=pick(ts2.length?ts2:ts);
      fq=t==='order'?qOrder(sn):t==='particle'?qParticle(sn):qSK2M(sn,sns);
      if(!fq)return null;
    }else if(q.src.w){
      const w=q.src.w,ts=['wk2r','wr2k','wtype','compose','compose','mora'];
      if(gloss(w)&&ws.filter(x=>gloss(x)).length>=4)ts.push('wk2m','wm2k');
      if(hasSpecial(w))ts.push('fill','fill');
      const t=pick(ts.filter(x=>x!==q.type));
      fq=t==='wk2r'?qWK2R(w):t==='wr2k'?qWR2K(w):t==='wtype'?qWType(w):t==='compose'?qCompose(w,{w}):t==='fill'?qFill(w):t==='wk2m'?qWK2M(w,ws):t==='wm2k'?qWM2K(w,ws):qMora(w);
    }else{
      const cs=q.src.c,miss=q.missK?cs.filter(x=>q.missK.includes(x.k)):[];
      const it=pick(miss.length?miss:cs);
      const ts=['k2r','r2k','type'];
      const others=items.filter(x=>composable(x)&&x.k!==it.k);
      if(composable(it)&&others.length)ts.push('compose','compose');
      if(isYoonK(it.k))ts.push('size');
      const t=pick(ts.filter(x=>x!==q.type));
      fq=t==='k2r'?qK2R(it,pool):t==='r2k'?qR2K(it,pool):t==='type'?qType(it):t==='size'?qSize(it):qComposeChain(shuffle([it,pick(others)]));
    }
    fq.again=true;fq.depth=d+1;
    return fq;
  }
  return{fromPlan,dojo,follow};
}

export const KEYS_OF=q=>q.src?(q.src.s?[q.src.s.k]:q.src.w?[q.src.w.k]:q.src.c.map(x=>x.k)):[];

export {BASIC,DAKU,YOON,KBASIC,KDAKU,KYOON,KEXT,isKata,R,AMB,T,CHOICE,PLAIN,norm,parseMorae,shuffle,pick,take,esc};

/* Bộ câu hỏi cho mini quiz trong bài học: chỉ dùng các chữ và từ của bài, distractor lấy từ cùng bảng. */
export function mkWord(kana,vi,romaji,en){
  const m=parseMorae(kana);
  return{k:kana,vi:vi||'',en:en||'',m:m,r:romaji||romajiOf(m)};
}
const WORD_TYPES=new Set(['wk2r','wr2k','wtype','fill','mora','wk2m','wm2k','order','particle','sk2m']);
/* Câu: {t:[từ…],r,vi,en}. k = chuỗi kana liền, b = chỉ số các trợ từ trong t. */
export function mkSent(s){
  const ja=s.t.join('');
  return{k:ja,ja:ja,t:s.t,r:s.r||'',vi:s.vi||'',en:s.en||'',b:s.t.map((x,i)=>PARTS.includes(x)?i:-1).filter(i=>i>=0)};
}
export function buildLesson(chars,plan,words,sents){
  const needChars=Object.keys(plan).some(t=>!WORD_TYPES.has(t));
  return session(chars,words,{needChars,sents}).fromPlan(plan);
}

/* Dojo: {build(), follow(q)}. build() tạo lượt mới (đọc lại chữ yếu mỗi lần), follow(q) trả câu nhắc lại cho câu sai. */
export function dojoSession(chars,words,o){
  let s=session(chars,words,{needChars:false,...o});
  return{build(n){s=session(chars,words,{needChars:false,...o});return s.dojo(n)},follow:q=>s.follow(q)};
}
