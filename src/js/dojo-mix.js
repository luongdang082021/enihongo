/* Dojo: từ các khóa đã chọn gom chữ và từ. Không đụng DOM nên kiểm tra được trong Node. */
export const QCOUNT=20;

export function gather(lessons){
  const chars=[],words=[],sents=[],ck=new Set(),wk=new Set(),sk=new Set();
  for(const l of lessons){
    for(const c of l.chars||[])if(!ck.has(c.k)){ck.add(c.k);chars.push({k:c.k,r:c.r})}
    for(const w of l.words||[])if(!wk.has(w.kana)){wk.add(w.kana);words.push(w)}
    for(const s of l.sents||[]){const k=s.t.join('');if(!sk.has(k)){sk.add(k);sents.push(s)}}
  }
  return {chars,words,sents};
}

/* Khóa lưu điểm cao theo tập khóa đã chọn. */
export function mixKey(ids){
  const s=[...ids].sort().join('|');
  let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;
  return 'm'+h.toString(36);
}
