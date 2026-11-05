/* Thứ tự nét: vẽ lần lượt từng nét từ dữ liệu KanjiVG (CC BY-SA 3.0). Dữ liệu chỉ tải khi người học bấm xem. */
let data=null;
const url=new URL('../data/strokes.json',import.meta.url);
export async function loadStrokes(){
  if(!data){const r=await fetch(url);if(!r.ok)throw new Error('không tải được dữ liệu nét');data=await r.json()}
  return data;
}
const start=d=>{const m=/^M\s*([\d.]+)[ ,]([\d.]+)/.exec(d);return m?[Number(m[1]),Number(m[2])]:[10,10]};
/* Trả về HTML SVG. Mỗi nét có animation-delay theo thứ tự; số thứ tự đặt ở điểm bắt đầu nét. */
export function strokeSVG(paths,size){
  const step=.7;
  const ps=paths.map((d,i)=>`<path d="${d}" pathLength="1" class="sk" style="animation-delay:${(i*step).toFixed(2)}s"/>`).join('');
  const ns=paths.map((d,i)=>{const [x,y]=start(d);return `<text x="${x-5}" y="${y-2}" class="sn" style="animation-delay:${(i*step).toFixed(2)}s">${i+1}</text>`}).join('');
  return `<svg viewBox="0 0 109 109" width="${size}" height="${size}" role="img" aria-label="Thứ tự ${paths.length} nét"><path class="guide" d="M54.5 6v97M6 54.5h97"/>${ps}${ns}</svg>`;
}
