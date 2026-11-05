/* Tiến độ lưu cục bộ trong localStorage (khóa enihongo:v1). Không có tài khoản hay máy chủ. */
const KEY='enihongo:v1',OLD='hiragana-dojo-best';
const empty=()=>({v:1,lessons:{},dojo:{},cards:{}});
function read(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){const d=JSON.parse(raw);if(d&&d.v===1)return {...empty(),...d}}
    const d=empty();
    const old=localStorage.getItem(OLD);
    if(old){const o=JSON.parse(old);if(o&&typeof o==='object')d.dojo=o}
    return d;
  }catch(e){return empty()}
}
function write(d){try{localStorage.setItem(KEY,JSON.stringify(d));return true}catch(e){return false}}

export const getAll=read;
export function lessonState(id){return read().lessons[id]||null}
export function completeLesson(id,extra){
  const d=read(),p=d.lessons[id]||{};
  d.lessons[id]={...p,...extra,done:true,at:Date.now()};
  return write(d);
}
export function saveQuizScore(id,score,stars){
  const d=read(),p=d.lessons[id]||{};
  d.lessons[id]={...p,score:Math.max(score,p.score||0),stars:Math.max(stars,p.stars||0)};
  return write(d);
}
export function dojoBest(){return read().dojo}
export function saveDojo(round,score,stars){
  const d=read(),p=d.dojo[round];
  const record=!!p&&score>p.score;
  d.dojo[round]={score:Math.max(score,p?p.score:0),stars:Math.max(stars,p?p.stars:0)};
  write(d);
  return record;
}
export function exportJSON(){return JSON.stringify(read(),null,2)}
export function importJSON(text){
  const d=JSON.parse(text);
  if(!d||d.v!==1||typeof d.lessons!=='object'||typeof d.dojo!=='object')throw new Error('Tệp không đúng định dạng enihongo.');
  return write({...empty(),...d});
}

/* Flashcard ngắt quãng (Leitner 5 hộp). Mỗi chữ: {b: hộp 1..5, d: thời điểm đến hạn (ms)}. */
const DAY=86400000,GAP=[0,0,1,3,7,16]; // số ngày chờ theo hộp
export function cardDue(k,now=Date.now()){const c=read().cards[k];return !c||c.d<=now}
export function dueOf(keys,now=Date.now()){const cs=read().cards;return keys.filter(k=>!cs[k]||cs[k].d<=now)}
export function rateCard(k,known,now=Date.now()){
  const d=read(),c=d.cards[k]||{b:1,d:0};
  const b=known?Math.min(5,c.b+1):1;
  d.cards[k]={b,d:known?now+GAP[b]*DAY:now};
  write(d);return b;
}
export function nextDue(keys){const cs=read().cards;const t=keys.map(k=>cs[k]?cs[k].d:0).filter(x=>x>Date.now());return t.length?Math.min(...t):null}
