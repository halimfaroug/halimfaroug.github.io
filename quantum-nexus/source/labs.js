/* ======================== المختبر التفاعلي ======================== */
const LABS=[
 {id:"atom",t:"ابنِ ذرّة",e:"⚛️",d:"أضف بروتونات ونيوترونات وإلكترونات، وشاهد العنصر يتكوّن أمامك."},
 {id:"dna",t:"جزيء DNA ثلاثي الأبعاد",e:"🧬",d:"لولب مزدوج يدور؛ اسحبه بإصبعك لتديره."},
 {id:"states",t:"حالات المادة",e:"🧊",d:"غيّر درجة الحرارة وشاهد جسيمات الماء تتجمّد وتغلي."},
 {id:"solar",t:"المجموعة الشمسية",e:"🪐",d:"الكواكب الثمانية تدور حول الشمس؛ اضغط أيّ كوكب."},
 {id:"circuit",t:"الدائرة الكهربائية",e:"💡",d:"أغلق المفتاح، وقارن التوصيل على التوالي والتوازي."}];
const LAB_OF={atom:"atom",table:"atom",states:"states",changes:"states",genetics:"dna",cell:"dna",solar:"solar",space:"solar",electricity:"circuit"};
function labs(){
  show(`<h1 style="font-size:24px;margin:6px 2px">🔭 المختبر التفاعلي</h1><p class="muted" style="margin:0 2px 12px">نماذج حيّة تتحرك وتتفاعل معك. جرّب وغيّر وشاهد ماذا يحدث.</p>
  ${LABS.map(l=>`<button class="lesson" onclick="go(lab,'${l.id}')"><span class="ic">${l.e}</span><span><b>${l.t}</b><small>${l.d}</small></span><span class="stars">‹</span></button>`).join("")}`);
}
function lab(id){({atom:labAtom,dna:labDNA,states:labStates,solar:labSolar,circuit:labCircuit})[id]()}
function canvasLoop(c,h,draw){const r=Math.min(devicePixelRatio||1,2);function size(){c.width=c.clientWidth*r;c.height=h*r;c.style.height=h+"px"}size();
  const ctx=c.getContext("2d");let t0=performance.now();
  (function f(t){if(!document.body.contains(c))return;draw(ctx,c.width,c.height,r,(t-t0)/1000);requestAnimationFrame(f)})(t0);addEventListener("resize",size,{once:true})}
const reduceMotion=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- توزيع الإلكترونات على المستويات (مبسّط للعناصر 1–36) ---------- */
function shells(z){if(z<=0)return[];if(z<=2)return[z];if(z<=10)return[2,z-2];if(z<=18)return[2,8,z-10];if(z<=20)return[2,8,8,z-18];
  if(z===24)return[2,8,13,1];if(z===29)return[2,8,18,1];if(z<=30)return[2,8,8+(z-20),2];if(z<=36)return[2,8,18,z-28];return null}
function drawAtom(ctx,W,H,r,t,p,n,e,opts){
  const cx=W/2,cy=H/2,dark=matchMedia("(prefers-color-scheme: dark)").matches;
  ctx.clearRect(0,0,W,H);
  const sh=shells(e)||null,maxR=Math.min(W,H)/2-10*r,ns=sh?sh.length:3;
  // المدارات والإلكترونات
  if(sh){sh.forEach((k,i)=>{const R=(i+1)*maxR/(ns+0.4);ctx.strokeStyle=dark?"rgba(180,170,255,.35)":"rgba(91,63,217,.25)";ctx.lineWidth=1.5*r;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    for(let j=0;j<k;j++){const a=(reduceMotion()?0:t*(1.2-i*.2))+j*2*Math.PI/k;const x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);
      ctx.fillStyle="#0FB5CE";ctx.beginPath();ctx.arc(x,y,5*r,0,7);ctx.fill();ctx.fillStyle="#fff";ctx.font=`bold ${7*r}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("−",x,y+.5*r)}})}
  else if(e>0){const g=ctx.createRadialGradient(cx,cy,10*r,cx,cy,maxR);g.addColorStop(0,"rgba(15,181,206,.35)");g.addColorStop(1,"rgba(15,181,206,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,maxR,0,7);ctx.fill();
    for(let j=0;j<Math.min(e,60);j++){const a=(reduceMotion()?0:t*.6)+j*2.399,R=maxR*(.3+.7*((j*37)%100)/100);ctx.fillStyle="#0FB5CE";ctx.beginPath();ctx.arc(cx+R*Math.cos(a),cy+R*Math.sin(a),3*r,0,7);ctx.fill()}}
  // النواة
  const tot=p+n,parts=[];for(let i=0;i<tot;i++)parts.push(Math.floor((i+1)*p/tot)>Math.floor(i*p/tot));
  const nr=Math.max(9*r,Math.sqrt(tot)*6*r);
  for(let i=0;i<Math.min(tot,80);i++){const a=i*2.399,d=nr*Math.sqrt(i/Math.max(tot,1))*.9;const x=cx+d*Math.cos(a)+(reduceMotion()?0:Math.sin(t*6+i)*.6*r),y=cy+d*Math.sin(a);
    ctx.fillStyle=parts[i]?"#E5484D":"#8B8FA8";ctx.beginPath();ctx.arc(x,y,6*r,0,7);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.6)";ctx.lineWidth=1*r;ctx.stroke();
    if(parts[i]){ctx.fillStyle="#fff";ctx.font=`bold ${8*r}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("+",x,y+.5*r)}}
}
let AT={p:1,n:0,e:1};
function labAtom(){
  show(`<h1 style="font-size:23px;margin:6px 2px">⚛️ ابنِ ذرّة</h1>
  <div class="card" style="padding:8px"><canvas id="cv" style="width:100%;display:block" aria-label="نموذج الذرة"></canvas></div>
  <div class="card" id="info" aria-live="polite"></div>
  <div class="ctrl">${[["p","بروتون","#E5484D","+"],["n","نيوترون","#8B8FA8","0"],["e","إلكترون","#0FB5CE","−"]].map(([k,n,c,s])=>`<div><span class="dot" style="background:${c}">${s}</span><b>${n}</b><span class="cnt" id="c${k}">0</span><button aria-label="إنقاص ${n}" onclick="atomSet('${k}',-1)">−</button><button aria-label="زيادة ${n}" onclick="atomSet('${k}',1)">+</button></div>`).join("")}</div>
  <p class="fine">البروتونات تحدّد نوع العنصر، والنيوترونات تغيّر الكتلة (النظائر)، والإلكترونات تحدّد الشحنة. (في هذا النموذج حتى 20 بروتونًا.)</p>`);
  atomInfo();canvasLoop($("#cv"),280,(ctx,W,H,r,t)=>drawAtom(ctx,W,H,r,t,AT.p,AT.n,AT.e));
}
function atomSet(k,d){const lim={p:[1,20],n:[0,30],e:[0,AT.p+3]};AT[k]=Math.max(lim[k][0],Math.min(lim[k][1],AT[k]+d));AT.e=Math.min(AT.e,AT.p+3);atomInfo()}
function atomInfo(){const el=ELEMENTS[AT.p-1],q=AT.p-AT.e,common=Math.round(el.m)-AT.p;
  ["p","n","e"].forEach(k=>{const c=$("#c"+k);if(c)c.textContent=AT[k]});
  $("#info").innerHTML=`<div style="display:flex;align-items:center;gap:12px"><div class="elbig c-${el.c}" style="width:70px;height:76px"><span class="n">${el.z}</span><span class="s" style="font-size:28px">${el.s}</span></div>
  <div><b style="font-size:21px">${el.ar}</b> <span class="muted" dir="ltr">${el.en}</span><div>العدد الكتلي: <b>${AT.p+AT.n}</b> · الشحنة: <b dir="ltr">${q>0?"+"+q:q}</b></div>
  <div class="muted">${q===0?"ذرة متعادلة ✅":q>0?"أيون موجب: إلكتروناته أقل من بروتوناته":"أيون سالب: إلكتروناته أكثر من بروتوناته"}</div></div></div>
  <p class="fine" style="margin:8px 0 0">${AT.n===common?"🎯 هذا هو عدد النيوترونات في أكثر نظائر "+el.ar+" شيوعًا.":"💡 أكثر نظائر "+el.ar+" شيوعًا فيه "+common+" "+(common===1?"نيوترون واحد":common===2?"نيوترونان":"نيوترونات")+"."}</p>`;
}

/* ---------- DNA ثلاثي الأبعاد ---------- */
function labDNA(){
  show(`<h1 style="font-size:23px;margin:6px 2px">🧬 جزيء DNA</h1>
  <div class="card" style="padding:6px;background:#0D0A24"><canvas id="cv" style="width:100%;display:block;touch-action:none" aria-label="نموذج لولب DNA المزدوج يدور"></canvas></div>
  <div class="legend" style="justify-content:center"><span class="pillx"><i style="background:#FF6B6B"></i>A أدينين</span><span class="pillx"><i style="background:#4D96FF"></i>T ثايمين</span><span class="pillx"><i style="background:#6BCB77"></i>G جوانين</span><span class="pillx"><i style="background:#FFD93D"></i>C سايتوسين</span></div>
  <div class="card"><b>💡 ماذا ترى؟</b><ul><li>DNA سلّم ملتفّ يُسمّى <b>اللولب المزدوج</b>.</li><li>جانبا السلّم من سكّر وفوسفات، والدرجات أزواج من القواعد.</li><li>تقترن القواعد دائمًا هكذا: <b>A مع T</b>، و<b>G مع C</b>.</li><li>ترتيب هذه القواعد هو «التعليمات» الوراثية؛ وكل جين جزء من هذا الترتيب.</li></ul></div>
  <p class="fine">اسحب النموذج يمينًا ويسارًا لتديره.</p>`);
  const seq="ATGCGTACGTTAGCATGCAATCGG".split(""),pair={A:"T",T:"A",G:"C",C:"G"},col={A:"#FF6B6B",T:"#4D96FF",G:"#6BCB77",C:"#FFD93D"};
  let rot=0,drag=null,vel=.6;const c=$("#cv");
  c.onpointerdown=e=>{drag=e.clientX;c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(drag!==null){rot+=(e.clientX-drag)*.012;vel=(e.clientX-drag)*.4;drag=e.clientX}};c.onpointerup=()=>{drag=null};
  canvasLoop(c,340,(ctx,W,H,r,t)=>{ctx.clearRect(0,0,W,H);if(drag===null&&!reduceMotion()){rot+=.012*Math.sign(vel||1)}
    const n=seq.length,top=24*r,step=(H-2*top)/(n-1),R=Math.min(W*.28,90*r),cx=W/2,items=[];
    for(let i=0;i<n;i++){const a=rot+i*.55,y=top+i*step,x1=cx+R*Math.cos(a),z1=Math.sin(a),x2=cx+R*Math.cos(a+Math.PI),z2=Math.sin(a+Math.PI);items.push({i,y,x1,z1,x2,z2,b:seq[i]})}
    items.sort((a,b)=>(a.z1+a.z2)-(b.z1+b.z2));
    // العمودان الفقريان
    [["x1","z1"],["x2","z2"]].forEach(([X,Z])=>{for(let i=0;i<n-1;i++){const A=items.find(o=>o.i===i),B=items.find(o=>o.i===i+1),d=(A[Z]+B[Z])/2;ctx.strokeStyle=`rgba(190,180,255,${.35+.5*(d+1)/2})`;ctx.lineWidth=(3+2*(d+1))*r;ctx.beginPath();ctx.moveTo(A[X],A.y);ctx.lineTo(B[X],B.y);ctx.stroke()}});
    items.forEach(o=>{const d=(o.z1+o.z2)/2,alpha=.45+.55*(d+1)/2,mx=(o.x1+o.x2)/2;ctx.globalAlpha=alpha;ctx.lineWidth=5*r;
      ctx.strokeStyle=col[o.b];ctx.beginPath();ctx.moveTo(o.x1,o.y);ctx.lineTo(mx,o.y);ctx.stroke();ctx.strokeStyle=col[pair[o.b]];ctx.beginPath();ctx.moveTo(mx,o.y);ctx.lineTo(o.x2,o.y);ctx.stroke();
      [[o.x1,o.z1,o.b],[o.x2,o.z2,pair[o.b]]].forEach(([x,z,b])=>{const s=(5+2*(z+1))*r;ctx.fillStyle="#E8E4FF";ctx.beginPath();ctx.arc(x,o.y,s,0,7);ctx.fill();if(z>.2){ctx.fillStyle="#2B1B6B";ctx.font=`bold ${9*r}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(b,x,o.y+.5*r)}});ctx.globalAlpha=1});
  });
}

/* ---------- حالات المادة ---------- */
let TEMP=20;
function labStates(){
  show(`<h1 style="font-size:23px;margin:6px 2px">🧊 حالات المادة: جسيمات الماء</h1>
  <div class="card" style="padding:8px"><canvas id="cv" style="width:100%;display:block" aria-label="جسيمات الماء تتحرك بحسب درجة الحرارة"></canvas></div>
  <div class="card"><label for="tmp"><b>درجة الحرارة: <span id="tv" dir="ltr"></span></b></label><input id="tmp" type="range" min="-30" max="150" step="1" value="${TEMP}" oninput="TEMP=+this.value;stInfo()" style="width:100%">
  <div id="st" aria-live="polite" style="margin-top:6px"></div></div>
  <p class="fine">عند مستوى سطح البحر: يتجمّد الماء عند 0 °س، ويغلي عند 100 °س.</p>`);
  stInfo();const N=36,P=Array.from({length:N},(_,i)=>({x:0,y:0,vx:Math.random()-.5,vy:Math.random()-.5,i}));let init=false;
  canvasLoop($("#cv"),260,(ctx,W,H,r)=>{const dark=matchMedia("(prefers-color-scheme: dark)").matches;ctx.clearRect(0,0,W,H);const st=TEMP<0?"s":TEMP<100?"l":"g",rad=8*r;
    ctx.strokeStyle=dark?"#4A4380":"#C9C2F0";ctx.lineWidth=2*r;ctx.strokeRect(r,r,W-2*r,H-2*r);
    if(!init){P.forEach(p=>{p.x=W/2;p.y=H/2});init=true}
    const cols=6,gap=rad*2.3,ox=W/2-(cols-1)*gap/2,oy=H-rad*1.6-(Math.ceil(N/cols)-1)*gap;
    const speed=reduceMotion()?0:Math.max(.2,(TEMP+40)/40)*r;
    P.forEach(p=>{if(st==="s"){const tx=ox+(p.i%cols)*gap,ty=oy+Math.floor(p.i/cols)*gap;p.x+=(tx-p.x)*.15;p.y+=(ty-p.y)*.15;p.x+=(Math.random()-.5)*speed*1.2;p.y+=(Math.random()-.5)*speed*1.2}
      else{p.vx+=(Math.random()-.5)*.3*speed;p.vy+=(Math.random()-.5)*.3*speed+(st==="l"?.12*r:0);const m=st==="l"?1.6*speed:4*speed,v=Math.hypot(p.vx,p.vy);if(v>m){p.vx*=m/v;p.vy*=m/v}
        p.x+=p.vx;p.y+=p.vy;const minY=st==="l"?H*.45:rad;if(p.x<rad){p.x=rad;p.vx=Math.abs(p.vx)}if(p.x>W-rad){p.x=W-rad;p.vx=-Math.abs(p.vx)}if(p.y<minY){p.y=minY;p.vy=Math.abs(p.vy)}if(p.y>H-rad){p.y=H-rad;p.vy=-Math.abs(p.vy)}}
      ctx.fillStyle=st==="s"?"#7DD3FC":st==="l"?"#3B82F6":"#A78BFA";ctx.beginPath();ctx.arc(p.x,p.y,rad,0,7);ctx.fill();ctx.fillStyle="rgba(255,255,255,.55)";ctx.beginPath();ctx.arc(p.x-rad*.3,p.y-rad*.3,rad*.3,0,7);ctx.fill()});
    if(st==="l"){ctx.fillStyle="rgba(59,130,246,.10)";ctx.fillRect(2*r,H*.45-rad,W-4*r,H*.55)}
  });
}
function stInfo(){const tv=$("#tv");if(!tv)return;tv.textContent=TEMP+" °C";const st=TEMP<0?"s":TEMP<100?"l":"g";
  $("#st").innerHTML=st==="s"?"🧊 <b>صلب (جليد)</b>: الجسيمات متراصّة في نظام ثابت وتهتزّ في أماكنها فقط.":st==="l"?"💧 <b>سائل (ماء)</b>: الجسيمات متقاربة لكنها تنزلق بعضها فوق بعض، فيأخذ الماء شكل الإناء.":"♨️ <b>غاز (بخار)</b>: الجسيمات متباعدة وسريعة جدًّا وتملأ الإناء كله."}

/* ---------- المجموعة الشمسية ---------- */
const PLANETS=[["عطارد","#B7B7B7",.24,"أقرب الكواكب إلى الشمس وأصغرها، ولا غلاف جوي يُذكر له.","صخري"],["الزهرة","#E8C27A",.62,"أشدّ الكواكب حرارة بسبب غلافه الجوي الكثيف من ثاني أكسيد الكربون.","صخري"],["الأرض","#3B82F6",1,"الكوكب الوحيد المعروف بوجود حياة عليه، وفيه ماء سائل.","صخري"],["المريخ","#E5484D",1.88,"الكوكب الأحمر؛ لونه من أكاسيد الحديد في تربته.","صخري"],["المشتري","#D9A066",11.9,"أكبر الكواكب، عملاق غازي فيه البقعة الحمراء العظيمة (عاصفة ضخمة).","غازي"],["زحل","#E9D58B",29.5,"تحيط به حلقات واضحة من الجليد والصخور.","غازي"],["أورانوس","#7FDBDA",84,"يدور وهو مائل على جنبه تقريبًا.","غازي جليدي"],["نبتون","#4D6BFE",165,"أبعد الكواكب عن الشمس، وفيه أسرع الرياح في المجموعة الشمسية.","غازي جليدي"]];
let SPEED=1,SEL=2;
function labSolar(){
  show(`<h1 style="font-size:23px;margin:6px 2px">🪐 المجموعة الشمسية</h1>
  <div class="card" style="padding:6px;background:#05031A"><canvas id="cv" style="width:100%;display:block" aria-label="الكواكب تدور حول الشمس"></canvas></div>
  <div class="seg2">${["⏸️ إيقاف","▶️ عادي","⏩ سريع"].map((l,i)=>`<button onclick="SPEED=${[0,1,4][i]}">${l}</button>`).join("")}</div>
  <div class="planets">${PLANETS.map((p,i)=>`<button onclick="SEL=${i};plInfo()"><i style="background:${p[1]}"></i>${p[0]}</button>`).join("")}</div>
  <div class="card" id="pl" aria-live="polite"></div>
  <p class="fine">الأحجام والمسافات في الرسم غير حقيقية حتى تظهر الكواكب كلها؛ أما سرعات الدوران فبالنسب الصحيحة تقريبًا.</p>`);
  plInfo();let ang=PLANETS.map((_,i)=>i*.8),last=performance.now();
  canvasLoop($("#cv"),320,(ctx,W,H,r)=>{const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;ctx.clearRect(0,0,W,H);const cx=W/2,cy=H/2,maxR=Math.min(W,H)/2-12*r;
    for(let s=0;s<40;s++){ctx.fillStyle="rgba(255,255,255,.5)";ctx.fillRect((s*97)%W,(s*57)%H,1.2*r,1.2*r)}
    const g=ctx.createRadialGradient(cx,cy,2,cx,cy,22*r);g.addColorStop(0,"#FFF6C2");g.addColorStop(.5,"#FFC94D");g.addColorStop(1,"rgba(255,150,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,22*r,0,7);ctx.fill();
    PLANETS.forEach((p,i)=>{const RR=22*r+(i+.6)*(maxR-22*r)/8.2;ctx.strokeStyle=i===SEL?"rgba(255,255,255,.55)":"rgba(255,255,255,.14)";ctx.lineWidth=1*r;ctx.beginPath();ctx.arc(cx,cy,RR,0,7);ctx.stroke();
      if(!reduceMotion())ang[i]+=dt*SPEED*0.9/p[2];const x=cx+RR*Math.cos(ang[i]),y=cy+RR*Math.sin(ang[i]),s=(i===4?7:i===5?6:i>5?5:i===2?4.5:3.8)*r;
      if(i===5){ctx.strokeStyle="rgba(233,213,139,.8)";ctx.lineWidth=1.5*r;ctx.beginPath();ctx.ellipse(x,y,s*1.9,s*.7,.4,0,7);ctx.stroke()}
      ctx.fillStyle=p[1];ctx.beginPath();ctx.arc(x,y,s,0,7);ctx.fill();if(i===SEL){ctx.strokeStyle="#fff";ctx.lineWidth=2*r;ctx.beginPath();ctx.arc(x,y,s+4*r,0,7);ctx.stroke()}});
  });
}
function plInfo(){const p=PLANETS[SEL];$("#pl").innerHTML=`<b style="font-size:20px">${p[0]}</b> <span class="muted">· الكوكب رقم ${SEL+1} من الشمس · ${p[4]}</span><p style="margin:6px 0 0">${p[3]}</p><p class="fine" style="margin:4px 0 0">يكمل دورته حول الشمس في ${p[2]===1?"سنة أرضية واحدة":p[2]<1?"نحو "+Math.round(p[2]*365)+" يومًا":"نحو "+p[2]+" سنة أرضية"}.</p>`}

/* ---------- الدائرة الكهربائية ---------- */
let CIR={closed:false,par:false,broken:false};
function labCircuit(){
  show(`<h1 style="font-size:23px;margin:6px 2px">💡 الدائرة الكهربائية</h1>
  <div class="card" style="padding:8px"><svg id="sv" viewBox="0 0 320 230" style="width:100%;display:block" role="img" aria-label="دائرة كهربائية فيها بطارية ومفتاح ومصباحان"></svg></div>
  <div class="seg2"><button onclick="CIR.closed=!CIR.closed;cirDraw()">🔘 المفتاح</button><button onclick="CIR.par=!CIR.par;cirDraw()">🔀 توالٍ / توازٍ</button><button onclick="CIR.broken=!CIR.broken;cirDraw()">💥 أتلِف مصباحًا</button></div>
  <div class="card" id="ci" aria-live="polite"></div>`);
  cirDraw();
}
function cirDraw(){const C=CIR,on=C.closed,dim=!C.par;
  const lit1=on&&!C.broken,lit2=C.par?on:on&&!C.broken;
  const bulb=(x,y,lit,broken)=>`<g transform="translate(${x},${y})">${lit?`<circle r="${dim?26:34}" fill="#FFD23F" opacity="${dim?.18:.32}"/>`:""}<circle r="18" fill="${lit?(dim?"#FFE58A":"#FFD23F"):"#E6E3F5"}" stroke="#5B5A7E" stroke-width="2"/><path d="M-7 4 Q0 -10 7 4" stroke="${broken?"#E5484D":"#5B5A7E"}" stroke-width="2" fill="none"/>${broken?`<path d="M-10-10 10 10M10-10-10 10" stroke="#E5484D" stroke-width="3"/>`:""}</g>`;
  const w="stroke:#5B5A7E;stroke-width:4;fill:none";
  let s=`<rect x="20" y="95" width="34" height="50" rx="5" fill="#2B1B6B"/><rect x="31" y="88" width="12" height="8" fill="#2B1B6B"/><text x="37" y="113" fill="#fff" font-size="13" text-anchor="middle" font-family="system-ui">+</text><text x="37" y="138" fill="#fff" font-size="15" text-anchor="middle" font-family="system-ui">−</text>
  <path d="M37 88 V30 H130" style="${w}"/>
  <g transform="translate(130,30)"><circle r="5" fill="#5B5A7E"/><line x1="0" y1="0" x2="${on?60:52}" y2="${on?0:-26}" stroke="#E5484D" stroke-width="5" stroke-linecap="round"/><circle cx="60" r="5" fill="#5B5A7E"/></g>`;
  let paths=[];
  if(!C.par){s+=`<path d="M190 30 H290 V200 H37 V145" style="${w}"/>`+bulb(165,200,lit1,C.broken)+bulb(240,200,lit2,false);if(on&&!C.broken)paths=["M37 88 V30 H290 V200 H37 Z"]}
  else{s+=`<path d="M190 30 H280 M37 145 V200 H280 M210 30 V200 M280 30 V200" style="${w}"/>`+bulb(210,115,lit1,C.broken)+bulb(280,115,lit2,false);
    if(on){paths=["M37 88 V30 H280 V200 H37 Z"];if(!C.broken)paths.push("M37 88 V30 H210 V200 H37 Z")}}
  if(!reduceMotion())paths.forEach(p=>{for(let k=0;k<3;k++)s+=`<circle r="4" fill="#0FB5CE"><animateMotion dur="3s" begin="${k}s" repeatCount="indefinite" path="${p}"/></circle>`});
  $("#sv").innerHTML=s;
  $("#ci").innerHTML=`<b>${C.par?"توصيل على التوازي":"توصيل على التوالي"} · المفتاح ${on?"مغلق ✅":"مفتوح"}</b><p style="margin:6px 0 0">${!on?"الدائرة مفتوحة، فلا يمرّ تيار ولا يضيء أيّ مصباح.":C.par?(C.broken?"أحد المصباحين تالف، لكن الآخر ما زال يضيء؛ لأن لكل مصباح مساره الخاص. لهذا تُوصل أجهزة المنازل على التوازي.":"لكل مصباح مسار خاص، فيضيء كلاهما بقوة كاملة."):(C.broken?"أتلفنا مصباحًا فانقطع المسار الوحيد، فانطفأ المصباحان معًا.":"مسار واحد يمرّ في المصباحين، فيتقاسمان الطاقة ويضيئان بضوء أخفت.")}</p>`;
}
