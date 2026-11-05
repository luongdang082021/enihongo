

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
const R={};[BASIC,DAKU,YOON].forEach(rows=>rows.flat().forEach(x=>{R[x.k]=x.r}));
const AMB=new Set(['ぢ','づ']);
const ALT={'を':['o'],'ん':['nn']};
const NOTE={'し':'し đọc là "shi", không phải "si".','ち':'ち đọc là "chi".','つ':'つ đọc là "tsu".','ふ':'ふ đọc là "fu", âm nằm giữa "hu" và "fu".','を':'を đọc như "o", chỉ dùng làm trợ từ.','ん':'ん là một nhịp riêng, đọc "n".','は':'は đọc "ha"; khi làm trợ từ thì đọc "wa".','へ':'へ đọc "he"; khi làm trợ từ thì đọc "e".','じ':'じ đọc là "ji".','ず':'ず đọc là "zu".','ぢ':'ぢ đọc giống じ (ji), ít dùng.','づ':'づ đọc giống ず (zu), ít dùng.'};

/* ---------- words (mora based) ---------- */
function parseMorae(s){const out=[];for(const ch of s){if('ゃゅょ'.includes(ch)&&out.length)out[out.length-1]+=ch;else out.push(ch)}return out}
function romajiOf(m){let out='',pend=false;for(const x of m){if(x==='っ'){pend=true;continue}const r=R[x]||'?';out+=pend?(r.startsWith('ch')?'t':r[0])+r:r;pend=false}return out}
const mkWords=s=>s.split('|').map(t=>{const p=t.split(':');const m=parseMorae(p[0]);return{k:p[0],vi:p[1],m:m,r:romajiOf(m)}});
const LONGW=mkWords('おかあさん:mẹ|おとうさん:bố|おにいさん:anh trai|おねえさん:chị gái|おばあさん:bà|おじいさん:ông|ゆうめい:nổi tiếng|せんせい:giáo viên|おおきい:to, lớn|ちいさい:nhỏ|とおい:xa|ありがとう:cảm ơn|こうこう:trường cấp 3|くうき:không khí|ひこうき:máy bay|とうきょう:Tokyo|えいが:phim|ふうふ:vợ chồng|きのう:hôm qua|おおさか:Osaka');
const SOKW=mkWords('がっこう:trường học|きって:tem thư|ざっし:tạp chí|いっぱい:nhiều, đầy|ちょっと:một chút|にっぽん:Nhật Bản|しゅっぱつ:xuất phát|まっすぐ:thẳng|けっこん:kết hôn|きっぷ:vé|いっしょ:cùng nhau|みっつ:ba cái|やっつ:tám cái|ほっかいどう:Hokkaido|さっぽろ:Sapporo|はっぱ:chiếc lá|ずっと:suốt, mãi|ぜったい:nhất định|もっと:hơn nữa');
const YOONW=mkWords('しゃしん:ảnh|かいしゃ:công ty|おちゃ:trà|ひゃく:một trăm|りょこう:du lịch|びょういん:bệnh viện|じてんしゃ:xe đạp|しゅくだい:bài tập về nhà|ぎゅうにゅう:sữa bò|きょう:hôm nay|ちゅうごく:Trung Quốc|きゅう:số chín|じゃがいも:khoai tây|びょうき:bệnh|りょうり:món ăn|ちゃいろ:màu nâu|うんてんしゅ:tài xế');
const ALLW=[...LONGW,...SOKW,...YOONW];

const V=x=>{const r=R[x];return r?r[r.length-1]:''};
const isV=v=>v.length===1&&'aiueo'.includes(v);
function isLong(m,i){
  if(i<1)return false;
  const c=m[i],pv=V(m[i-1]);
  if(!isV(pv))return false;
  return (c==='あ'&&pv==='a')||(c==='い'&&(pv==='i'||pv==='e'))||(c==='う'&&(pv==='u'||pv==='o'))||(c==='え'&&pv==='e')||(c==='お'&&pv==='o');
}

/* confusable kana for wrong spellings */
const CONF={};
const link=(a,b)=>{(CONF[a]=CONF[a]||[]).push(b);(CONF[b]=CONF[b]||[]).push(a)};
'かが きぎ くぐ けげ こご さざ しじ すず せぜ そぞ ただ てで とど はば ひび ふぶ へべ ほぼ はぱ ぬめ ねれ れわ るろ まも あお さち いり ゆや つし'.split(' ').forEach(p=>link(p[0],p[1]));

const mutations={
  remSok(m){const i=m.indexOf('っ');if(i<0)return null;const b=m.slice();b.splice(i,1);return b},
  addSok(m){const c=[];for(let i=0;i<m.length-1;i++){const n=m[i+1];if(m[i]!=='っ'&&m[i]!=='ん'&&n!=='っ'&&R[n]&&/^(k|s|t|p|ch|sh|ts)/.test(R[n]))c.push(i)}if(!c.length)return null;const b=m.slice();b.splice(pick(c)+1,0,'っ');return b},
  remLong(m){const c=[];m.forEach((x,i)=>{if(isLong(m,i))c.push(i)});if(!c.length)return null;const b=m.slice();b.splice(pick(c),1);return b},
  addLong(m){const c=[];m.forEach((x,i)=>{if(isV(V(x))&&!(m[i+1]&&isLong(m,i+1)))c.push(i)});if(!c.length)return null;const i=pick(c);const ins={a:'あ',i:'い',u:'う',e:'い',o:'う'}[V(m[i])];const b=m.slice();b.splice(i+1,0,ins);return b},
  swapLong(m){const c=[];m.forEach((x,i)=>{if(!isLong(m,i))return;const pv=V(m[i-1]);if((x==='う'||x==='お')&&pv==='o')c.push(i);if((x==='い'||x==='え')&&pv==='e')c.push(i)});if(!c.length)return null;const i=pick(c);const sw={'う':'お','お':'う','い':'え','え':'い'};const b=m.slice();b[i]=sw[m[i]];return b},
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
    const b=w.m.slice();const i=rnd(b.length);b[i]=pick(BASIC.flat()).k;
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
  let s=`「${esc(it.k)}」 đọc là <b>${esc(it.r)}</b>.`;
  if(NOTE[it.k])s+=' '+NOTE[it.k];
  if(it.k.length>1)s+=' ゃゅょ nhỏ gộp vào chữ trước, cả cụm là 1 nhịp.';
  return s;
}
function explainW(w){
  let s=`<b>${esc(w.k)}</b> = <b>${esc(w.r)}</b> · ${esc(w.vi)}<br><span class="mm">${w.m.join('・')}</span>`;
  const n=[];
  if(w.m.includes('っ'))n.push('っ nhỏ (âm ngắt) làm đôi phụ âm kế tiếp, ví dụ っ + こ = kko.');
  if(w.m.some((x,i)=>isLong(w.m,i)))n.push('Nguyên âm kéo dài chiếm thêm 1 nhịp, viết bằng cách lặp nguyên âm (aa, ii, uu, ei, ou, oo).');
  if(w.m.some(x=>x.length>1))n.push('ゃゅょ nhỏ gộp vào chữ đứng trước thành 1 nhịp.');
  return s+(n.length?'<br>'+n.join('<br>'):'');
}

/* ---------- question builders ---------- */
const T={k2r:'Chữ → romaji',r2k:'Romaji → chữ',type:'Gõ romaji',match:'Nối cặp',odd:'Tìm chữ khác nhóm',voice:'Dấu ゛ ゜',size:'Âm ghép',wk2r:'Từ → romaji',wr2k:'Romaji → từ',wtype:'Gõ cả từ',fill:'Điền chữ thiếu',mora:'Đếm nhịp'};
const CHOICE=new Set(['k2r','r2k','odd','voice','size','wk2r','wr2k','fill','mora']);
const PLAIN=new Set(['k2r','r2k','odd','voice','size','type','match']);

function qK2R(it,pool){
  return{type:'k2r',prompt:'Chữ này đọc là gì?',stage:{m:parseMorae(it.k)},opts:shuffle([it.r,...distract(it,pool,3).map(x=>x.r)]),font:'latin',answer:it.r,explain:explainK(it),sum:`${it.k} = ${it.r}`};
}
function qR2K(it,pool){
  return{type:'r2k',prompt:'Chọn chữ đọc là:',stage:{text:it.r},opts:shuffle([it.k,...distract(it,pool,3).map(x=>x.k)]),font:'kana',answer:it.k,explain:explainK(it),sum:`${it.r} = ${it.k}`};
}
function qType(it){
  return{type:'type',prompt:'Gõ cách đọc của chữ này bằng romaji:',stage:{m:parseMorae(it.k),hint:'Gõ chữ Latinh, không cần dấu cách.'},answer:it.r,alt:ALT[it.k]||[],cap:15,explain:explainK(it),sum:`${it.k} = ${it.r}`};
}
function qMatch(g){
  return{type:'match',prompt:'Nối mỗi chữ với cách đọc của nó:',pairs:g,cap:25,explain:g.map(p=>`${esc(p.k)} = ${esc(p.r)}`).join(' · '),sum:g.map(p=>`${p.k} ${p.r}`).join(', ')};
}
function qOdd(rows){
  const el=rows.map(r=>r.filter(x=>!AMB.has(x.k))).filter(r=>r.length>=3);
  const A=pick(el),trio=take(A,3);
  let out=null;
  for(const B of shuffle(el.filter(r=>r!==A))){const c=B.filter(x=>!A.some(a=>a.r===x.r));if(c.length){out=pick(c);break}}
  return{type:'odd',prompt:`Chữ nào KHÔNG đọc là một trong: ${A.map(x=>x.r).join(', ')}?`,opts:shuffle([...trio.map(x=>x.k),out.k]),font:'kana',answer:out.k,
    explain:`「${esc(out.k)}」 đọc là <b>${esc(out.r)}</b>, nằm ngoài nhóm này. Ba chữ còn lại: ${trio.map(x=>esc(x.k)+' ('+esc(x.r)+')').join(', ')}.`,sum:`${out.k} = ${out.r}`};
}
const VP=[];
(function(){const add=(b,v,mk)=>{[...b].forEach((c,i)=>VP.push({base:c,voiced:[...v][i],mark:mk}))};
  add('かきくけこ','がぎぐげご','゛');add('さしすせそ','ざじずぜぞ','゛');add('たてと','だでど','゛');add('はひふへほ','ばびぶべぼ','゛');add('はひふへほ','ぱぴぷぺぽ','゜');})();
function qVoice(){
  const v=pick(VP);
  if(Math.random()<.6){
    const alt=VP.find(x=>x.base===v.base&&x.mark!==v.mark);
    const vIt={k:v.voiced,r:R[v.voiced]};
    const pool=VP.map(x=>({k:x.voiced,r:R[x.voiced]}));
    const opts=[vIt];
    if(alt)opts.push({k:alt.voiced,r:R[alt.voiced]});
    distract(vIt,pool.filter(x=>!alt||x.k!==alt.voiced),3).forEach(x=>{if(opts.length<4)opts.push(x)});
    return{type:'voice',prompt:`Thêm dấu ${v.mark} vào 「${v.base}」 thì được chữ nào?`,stage:{m:[v.base]},opts:shuffle(opts.map(x=>x.k)),font:'kana',answer:v.voiced,
      explain:`${v.base} (${R[v.base]}) + ${v.mark} = <b>${v.voiced}</b> (${R[v.voiced]}).${v.mark==='゜'?' Dấu ゜ chỉ đi với hàng は: ぱ ぴ ぷ ぺ ぽ.':''}`,sum:`${v.base} + ${v.mark} = ${v.voiced}`};
  }
  const bIt={k:v.base,r:R[v.base]};
  const pool=BASIC.flat().filter(x=>!AMB.has(x.k));
  return{type:'voice',prompt:`Bỏ dấu khỏi 「${v.voiced}」 thì được chữ nào?`,stage:{m:[v.voiced]},opts:shuffle([v.base,...distract(bIt,pool,3).map(x=>x.k)]),font:'kana',answer:v.base,
    explain:`${v.voiced} (${R[v.voiced]}) = <b>${v.base}</b> (${R[v.base]}) + ${v.mark}.`,sum:`${v.voiced} − ${v.mark} = ${v.base}`};
}
const LARGE={'ゃ':'や','ゅ':'ゆ','ょ':'よ'};
function qSize(y){
  const c=y.k[0],s=y.k[1],l=LARGE[s];
  const large=c+l;
  const other=c+pick('ゃゅょ'.split('').filter(z=>z!==s));
  const diff=pick(YOON.flat().filter(x=>x.k[1]===s&&x.k[0]!==c)).k;
  return{type:'size',prompt:`Chữ nào đọc liền thành một nhịp 「${y.r}」?`,stage:{text:y.r},opts:shuffle([y.k,large,other,diff]),font:'kana',answer:y.k,
    explain:`<b>${y.k}</b> = ${y.r}, chỉ 1 nhịp vì ${s} viết nhỏ. ${large} có ${l} cỡ thường nên đọc 2 nhịp: ${R[c]} + ${R[l]}.`,sum:`${y.r} = ${y.k}`};
}
function qWK2R(w){
  return{type:'wk2r',prompt:'Từ này đọc là gì?',stage:{m:w.m},opts:shuffle([w.r,...mutants(w,3).map(x=>x.r)]),font:'latin',answer:w.r,explain:explainW(w),sum:`${w.k} = ${w.r}`};
}
function qWR2K(w){
  return{type:'wr2k',prompt:'Chọn cách viết hiragana đúng của từ:',stage:{text:w.r,hint:w.vi},opts:shuffle([w.k,...mutants(w,3).map(x=>x.k)]),font:'kana',answer:w.k,explain:explainW(w),sum:`${w.r} = ${w.k}`};
}
function qWType(w){
  return{type:'wtype',prompt:'Gõ romaji của cả từ:',stage:{m:w.m,hint:'Âm kéo dài: lặp nguyên âm (aa, ii, uu, ei, ou). Âm ngắt っ: gấp đôi phụ âm.'},answer:w.r,alt:[],cap:20,explain:explainW(w),sum:`${w.k} = ${w.r}`};
}
function qFill(w){
  const c=[];w.m.forEach((x,i)=>{if(x==='っ'||isLong(w.m,i))c.push(i)});
  const i=pick(c),ans=w.m[i];
  const ds=ans==='っ'?['つ','う','ん']:take(['あ','い','う','え','お','っ'].filter(x=>x!==ans),3);
  return{type:'fill',prompt:'Điền chữ còn thiếu để ra đúng từ:',stage:{m:w.m,blank:i,hint:`${w.r} · ${w.vi}`},opts:shuffle([ans,...ds]),font:'kana',answer:ans,explain:explainW(w),sum:`${w.k} = ${w.r}`};
}
function qMora(w){
  const n=w.m.length,len=[...w.k].length;
  const pr=[len!==n?len:0,n+1,n-1,n+2,n-2].filter(x=>x>=1&&x!==n);
  const ds=[];pr.forEach(x=>{if(!ds.includes(x)&&ds.length<3)ds.push(x)});
  return{type:'mora',prompt:'Từ này có mấy nhịp (mora)?',stage:{m:w.m},opts:[n,...ds].sort((a,b)=>a-b).map(String),font:'num',answer:String(n),
    explain:`${w.m.map(esc).join(' | ')} = <b>${n} nhịp</b>. Mỗi っ, ん và nguyên âm kéo dài tính 1 nhịp; ゃゅょ nhỏ không tính riêng.<br>${esc(w.k)} = ${esc(w.r)} · ${esc(w.vi)}`,sum:`${w.k}: ${n} nhịp`};
}

/* ---------- rounds ---------- */
const ALLK=[...BASIC,...DAKU,...YOON].flat();
const ROUNDS=[
  {num:'一',name:'Chữ cơ bản',sub:'あ → わ, ん · 46 chữ',chips:'あ き す ち ぬ',pool:BASIC.flat(),rows:BASIC,words:[],plan:{k2r:7,r2k:6,type:3,odd:2,match:2}},
  {num:'二',name:'Âm đục & bán đục',sub:'dấu ゛ và ゜ · が ざ だ ば ぱ',chips:'が じ ず べ ぽ',pool:DAKU.flat(),rows:DAKU,words:[],plan:{k2r:6,r2k:5,type:3,odd:2,match:1,voice:3}},
  {num:'三',name:'Âm ghép',sub:'ゃ ゅ ょ nhỏ · 1 nhịp',chips:'きゃ しゅ ちょ りゃ',pool:YOON.flat(),rows:YOON,words:YOONW,plan:{k2r:4,r2k:4,type:3,odd:2,match:1,size:3,wk2r:2,wtype:1}},
  {num:'四',name:'Trường âm & âm ngắt',sub:'おう・ええ・いい · っ',chips:'おかあさん がっこう',pool:[],rows:[],words:[...LONGW,...SOKW],plan:{wk2r:6,wr2k:4,wtype:3,fill:4,mora:3}},
  {num:'五',name:'Tổng hợp',sub:'mọi dạng câu hỏi, mọi loại chữ',chips:'ぎゅうにゅう ざっし',pool:ALLK,rows:[...BASIC,...DAKU,...YOON],words:ALLW,plan:{k2r:3,r2k:3,type:3,wk2r:3,wr2k:2,wtype:2,fill:1,mora:1,odd:1,match:1}}
];
function buildFromCtx(ctx){
  const used=new Set();
  const noamb=x=>!AMB.has(x.k);
  const draw=(pool,f)=>{let c=pool.filter(x=>!used.has(x.k)&&(!f||f(x)));if(!c.length)c=pool.filter(x=>!f||f(x));const x=pick(c);used.add(x.k);return x};
  const list=[];Object.entries(ctx.plan).forEach(e=>{for(let i=0;i<e[1];i++)list.push(e[0])});
  const order=shuffle(list);
  const f=order.findIndex(t=>t==='k2r'||t==='wk2r');
  if(f>0){const tmp=order[0];order[0]=order[f];order[f]=tmp}
  const poolNA=ctx.pool.filter(noamb);
  return order.map(t=>{
    switch(t){
      case 'k2r':return qK2R(draw(ctx.pool),ctx.pool);
      case 'r2k':return qR2K(draw(ctx.pool,noamb),poolNA);
      case 'type':return qType(draw(ctx.pool));
      case 'match':{const g=[];let n=0;while(g.length<4&&n++<80){const x=draw(ctx.pool,noamb);if(!g.some(y=>y.r===x.r))g.push(x)}return qMatch(g)}
      case 'odd':return qOdd(ctx.rows);
      case 'voice':return qVoice();
      case 'size':return qSize(draw(YOON.flat()));
      case 'wk2r':return qWK2R(draw(ctx.words));
      case 'wr2k':return qWR2K(draw(ctx.words));
      case 'wtype':return qWType(draw(ctx.words));
      case 'fill':return qFill(draw(ctx.words,w=>w.m.some((x,i)=>x==='っ'||isLong(w.m,i))));
      case 'mora':return qMora(draw(ctx.words));
    }
    throw new Error('unknown type '+t);
  });
}

export function build(idx){return buildFromCtx(ROUNDS[idx])}
export {BASIC,DAKU,YOON,R,AMB,ROUNDS,T,CHOICE,PLAIN,buildFromCtx,norm,parseMorae,shuffle,pick,take,esc,ALLK,ALLW,LONGW,SOKW,YOONW};

/* Bộ câu hỏi cho mini quiz trong bài học: chỉ dùng các chữ và từ của bài, distractor lấy từ cùng bảng. */
export function mkWord(kana,vi,romaji){
  const m=parseMorae(kana);
  return{k:kana,vi:vi||'',m:m,r:romaji||romajiOf(m)};
}
const WORD_TYPES=new Set(['wk2r','wr2k','wtype','fill','mora']);
export function buildLesson(chars,plan,words){
  let items=chars.map(c=>({k:c.k,r:c.r})).filter(x=>!AMB.has(x.k));
  const ws=(words||[]).filter(w=>w.quiz!==false).map(w=>mkWord(w.kana,w.vi,w.romaji));
  const needChars=Object.keys(plan).some(t=>!WORD_TYPES.has(t));
  if(needChars&&items.length<4){ // bài ít chữ (vd わ を ん): thêm vài chữ cũ để ôn
    const extra=take(BASIC.flat().filter(x=>!AMB.has(x.k)&&!items.some(i=>i.k===x.k)&&x.k!=='を'),4);
    items=[...items,...extra];
  }
  const pool=items.length>=8?items:[...items,...BASIC.flat().filter(x=>!AMB.has(x.k)&&!items.some(i=>i.k===x.k))];
  const used=new Set(),usedW=new Set();
  const draw=(src,set,f)=>{let c=src.filter(x=>!set.has(x.k)&&(!f||f(x)));if(!c.length){set.clear();c=src.filter(x=>!f||f(x))}if(!c.length)return null;const x=pick(c);set.add(x.k);return x};
  const dI=f=>draw(items,used,f),dW=f=>draw(ws,usedW,f);
  const hasSpecial=w=>w.m.some((x,i)=>x==='っ'||isLong(w.m,i));
  const list=[];Object.entries(plan).forEach(([t,n])=>{for(let i=0;i<n;i++)list.push(t)});
  const order=shuffle(list);
  const f=order.findIndex(t=>t==='k2r'||t==='wk2r');if(f>0){const t=order[0];order[0]=order[f];order[f]=t}
  return order.map(t=>{
    switch(t){
      case 'k2r':return qK2R(dI(),pool);
      case 'r2k':return qR2K(dI(),pool);
      case 'type':return qType(dI());
      case 'match':{const g=[];let n=0;while(g.length<Math.min(4,items.length)&&n++<80){const x=dI();if(!g.some(y=>y.k===x.k||y.r===x.r))g.push(x)}return qMatch(g)}
      case 'voice':return qVoice();
      case 'size':{const y=dI(x=>x.k.length===2&&'ゃゅょ'.includes(x.k[1]));if(!y)throw new Error('size cần chữ ghép');return qSize(y)}
      case 'wk2r':return qWK2R(dW());
      case 'wr2k':return qWR2K(dW());
      case 'wtype':return qWType(dW());
      case 'fill':{const w=dW(hasSpecial);return w?qFill(w):qMora(dW())}
      case 'mora':return qMora(dW());
    }
    throw new Error('unknown type '+t);
  });
}
