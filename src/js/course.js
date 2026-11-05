import {t as tr} from './i18n.js';
/* Trang danh sách bài: hiện trạng thái hoàn thành và sao, sao lưu tiến độ. */
import {getAll,exportJSON,importJSON} from './progress.js';
import {starsHTML} from './quiz-ui.js';

const d=getAll();
let done=0;
document.querySelectorAll('[data-lesson-id]').forEach(li=>{
  const s=d.lessons[li.dataset.lessonId];
  const slot=li.querySelector('[data-status]');
  if(s&&s.done){done++;slot.className='pill done';slot.innerHTML=tr('c.learned')+(s.stars?' '+starsHTML(s.stars,12):'')}
});
const sum=document.querySelector('[data-summary]');
if(sum&&done)sum.textContent=tr('c.summary',{n:done});

const exp=document.querySelector('[data-export]'),imp=document.querySelector('[data-import]'),msg=document.querySelector('[data-backup-msg]');
if(exp)exp.addEventListener('click',()=>{
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([exportJSON()],{type:'application/json'}));
  a.download='enihongo-tien-do.json';a.click();URL.revokeObjectURL(a.href);
});
if(imp)imp.addEventListener('change',async()=>{
  const f=imp.files[0];if(!f)return;
  try{importJSON(await f.text());msg.textContent=tr('c.imported');location.reload()}
  catch(e){msg.textContent=e.message||tr('c.readFail')}
});
