/* Dojo tự chọn: từ các bài đã chọn gom chữ và từ, rồi lập kế hoạch 20 câu. Không đụng DOM nên kiểm tra được trong Node. */
const VOICED='がぎぐげござじずぜぞだでどばびぶべぼぱぴぷぺぽ';
export const QCOUNT=20;

export function gather(lessons){
  const chars=[],words=[],ck=new Set(),wk=new Set();
  for(const l of lessons){
    for(const c of l.chars||[])if(!ck.has(c.k)){ck.add(c.k);chars.push({k:c.k,r:c.r})}
    for(const w of l.words||[])if(!wk.has(w.kana)){wk.add(w.kana);words.push(w)}
  }
  return {chars,words};
}

/* Kế hoạch tổng 20 câu, tùy nội dung đang có. */
export function planFor(chars,words){
  const hasC=chars.length>0,hasW=words.length>0;
  if(!hasC&&!hasW)return null;
  const voiced=chars.some(c=>VOICED.includes(c.k)),yoon=chars.some(c=>c.k.length===2);
  let plan;
  if(hasC&&hasW)plan={k2r:4,r2k:3,type:2,match:1,wk2r:3,wr2k:3,wtype:2,fill:1,mora:1};
  else if(hasC)plan={k2r:8,r2k:6,type:4,match:2};
  else plan={wk2r:6,wr2k:5,wtype:4,fill:3,mora:2};
  const total=o=>Object.values(o).reduce((a,b)=>a+b,0);
  const swap=(extra,n)=>{ // thay n câu k2r/r2k bằng dạng đặc thù của nội dung
    for(let i=0;i<n;i++){const t=plan.k2r>=plan.r2k?'k2r':'r2k';if(plan[t]>1){plan[t]--;plan[extra]=(plan[extra]||0)+1}}
  };
  if(hasC&&voiced)swap('voice',2);
  if(hasC&&yoon)swap('size',2);
  if(total(plan)!==QCOUNT)throw new Error('kế hoạch không đủ '+QCOUNT+' câu');
  return plan;
}

/* Khóa lưu điểm cao theo tập bài đã chọn. */
export function mixKey(ids){
  const s=[...ids].sort().join('|');
  let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;
  return 'm'+h.toString(36);
}
