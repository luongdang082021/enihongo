"""Dojo trên trình duyệt: không còn 5 hiệp, chơi được, dạng soạn từ, câu sai có câu nhắc lại. Cần: npm run build:local; python3 -m http.server 8123 --directory _site."""
import sys
from playwright.sync_api import sync_playwright
BASE='http://localhost:8123'
fails=[]
def check(name,ok,info=''):
    print(('ok   ' if ok else 'FAIL ')+name+('' if ok else ' '+str(info)))
    if not ok: fails.append(name)

def answer_wrong(pg):
    """Trả lời sai câu hiện tại (hoặc bỏ qua)."""
    if pg.locator('.tile').count(): pg.locator('[data-skip]').click()
    elif pg.locator('.opt').count():
        pg.locator('.opt').first.click()   # có thể đúng hoặc sai
    elif pg.locator('.typeform input').count():
        pg.locator('.typeform input').fill('zzz'); pg.locator('.typeform button[type=submit]').click()
    else:
        pg.locator('.mbtn').first.click()  # nối cặp: bỏ qua, sẽ xử lý riêng
        return False
    return True

with sync_playwright() as pw:
    br=pw.chromium.launch()
    for tz,url in [('Asia/Ho_Chi_Minh','/luyen-tap/'),('America/New_York','/en/practice/')]:
        ctx=br.new_context(timezone_id=tz); pg=ctx.new_page(); pg.set_default_timeout(4000)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(BASE+url); pg.wait_for_selector('.picklist input')
        check(url+' không còn tab và 5 hiệp', pg.locator('.tabs, #ladder, .rung').count()==0)
        check(url+' có danh sách khóa', pg.locator('.picklist input').count()>=2)
        pg.locator('#startmix').click(); pg.wait_for_selector('.qcard')
        recall=0; composed=0; total=0
        for n in range(45):
            if pg.locator('.res:not([hidden])').count(): break
            tag=pg.inner_text('[data-tag]')
            if ' · ' in tag: recall+=1
            if pg.locator('.tile').count(): composed+=1
            if pg.locator('.match').count():
                # nối cặp: thử từng ô bên phải cho mỗi ô bên trái (sai vài lần rồi đúng)
                cols=pg.locator('.match .col')
                for _ in range(8):
                    l=cols.nth(0).locator('.mbtn:not(.done)'); before=l.count()
                    if before==0: break
                    for i in range(cols.nth(1).locator('.mbtn:not(.done)').count()):
                        cols.nth(0).locator('.mbtn:not(.done)').first.click()
                        cols.nth(1).locator('.mbtn:not(.done)').nth(i).click()
                        if cols.nth(0).locator('.mbtn:not(.done)').count()<before: break
            else:
                answer_wrong(pg)
            pg.wait_for_selector('[data-next]'); total+=1
            pg.locator('[data-next]').click()
        pg.wait_for_selector('.res:not([hidden])')
        txt=pg.inner_text('.res')
        check(url+' có câu nhắc lại sau khi sai', recall>0, (recall,total))
        check(url+' có dạng soạn từ', composed>0, composed)
        check(url+' kết quả báo số câu nhắc lại', 'nhắc lại' in txt.lower() or 'revisited' in txt.lower(), txt[:300])
        check(url+' không lỗi JS', not errs, errs)

    # Soạn từ đúng: dựng câu có đáp án đã biết bằng chính mô-đun của trang
    ctx=br.new_context(timezone_id='Asia/Ho_Chi_Minh'); pg=ctx.new_page(); pg.set_default_timeout(4000)
    pg.goto(BASE+'/luyen-tap/'); pg.wait_for_selector('.picklist input')
    ans=pg.evaluate("""async()=>{
      const core=await import('/js/quiz-core.js'),ui=await import('/js/quiz-ui.js');
      const words=[{kana:'さかな',vi:'cá',en:'fish'},{kana:'ありがとう',vi:'cảm ơn',en:'thank you'}];
      let q=null;for(let i=0;i<50&&!q;i++)q=core.dojoSession([],words,{}).build().find(x=>x.type==='compose');
      document.getElementById('home').hidden=true;const play=document.getElementById('play');play.hidden=false;
      window.__q=q;
      ui.mountQuiz(play,{questions:[q],title:'t',onFinish:()=>({}),onQuit(){}});
      return {answer:q.answer,tiles:q.tiles,n:q.slotN};
    }""")
    morae=pg.evaluate("async(a)=>(await import('/js/quiz-core.js')).parseMorae(a)",ans['answer'])
    # chạm đúng thứ tự
    used=set()
    for m in morae:
        for i,t in enumerate(ans['tiles']):
            if t==m and i not in used:
                pg.locator(f'[data-tile="{i}"]').click(); used.add(i); break
    check('nút Kiểm tra bật khi đủ ô', pg.locator('[data-go]:not([disabled])').count()==1)
    pg.locator('[data-go]').click(); pg.wait_for_selector('.fb.good')
    check('soạn từ đúng được chấm đúng', pg.locator('.fb.good').count()==1)
    # gỡ ô: chạm ô đã đặt
    pg.evaluate("async()=>{const ui=await import('/js/quiz-ui.js');const play=document.getElementById('play');ui.mountQuiz(play,{questions:[window.__q],title:'t',onFinish:()=>({}),onQuit(){}})}")
    pg.locator('.tile').first.click(); check('chạm ô đặt vào ô trống', pg.locator('.slot.full').count()==1)
    pg.locator('.slot.full').first.click(); check('chạm ô đã đặt để gỡ', pg.locator('.slot.full').count()==0)
    br.close()
print('\n%d lỗi'%len(fails)); sys.exit(1 if fails else 0)
