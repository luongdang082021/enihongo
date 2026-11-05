/* Phát âm bằng giọng đọc có sẵn của trình duyệt (Web Speech API). Không tải file âm thanh nào. */
let ready=null;
export function canSpeak(){
  if(ready)return ready;
  ready=new Promise(res=>{
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return res(false);
    const has=()=>speechSynthesis.getVoices().some(v=>/^ja/i.test(v.lang));
    if(has())return res(true);
    const done=()=>res(has());
    speechSynthesis.addEventListener('voiceschanged',done,{once:true});
    setTimeout(done,1200);
  });
  return ready;
}
export function speak(text){
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='ja-JP';u.rate=.8;
    const v=speechSynthesis.getVoices().find(v=>/^ja/i.test(v.lang));
    if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch(e){}
}
