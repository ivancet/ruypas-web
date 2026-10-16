// Ruypas (ruypas.com): Ruypas Import + Ruypas Rent. Lógica común a los 7 idiomas; textos en js/i18n.js (generado desde i18n/ui.json).
const HTML=document.documentElement,L=(HTML.lang in T)?HTML.lang:"es",B=HTML.dataset.base||"";
const LANGS=["es","ca","en","fr","de","ru","zh"];
const OWNER={email:"ivan@pizarro.cat",wa:"34687812997"};
const t=k=>{const v=(T[L]&&T[L][k]!==undefined)?T[L][k]:T.es[k];return v===undefined?k:v};
const tr=v=>v&&typeof v==="object"&&!Array.isArray(v)?(v[L]??v.es??v.en):v;
const P=p=>!p||/^(https?:|\/|data:)/.test(p)?p:B+p; // rutas relativas a la raíz del sitio
const $=s=>document.querySelector(s);const qs=new URLSearchParams(location.search);
const iso=d=>d.toISOString().slice(0,10);const D=s=>new Date(s+"T00:00:00Z");
let CARS=[],RENT=[],SALE=[],AV={};
function busySet(id){const s=new Set();(AV[id]||[]).forEach(r=>{for(let d=D(r.from);d<=D(r.to);d.setUTCDate(d.getUTCDate()+1))s.add(iso(d))});return s}
function nights(a,b){return Math.round((D(b)-D(a))/864e5)}
function rangeFree(id,a,b){const s=busySet(id);for(let d=D(a);d<D(b);d.setUTCDate(d.getUTCDate()+1))if(s.has(iso(d)))return false;return true}
const img=c=>P(c.photos&&c.photos.length?c.photos[0]:c.silhouette);
function renderGrid(){const g=$("#grid");if(!g)return;const f=$("#s-from").value,to=$("#s-to").value,has=f&&to&&nights(f,to)>0;
g.innerHTML=RENT.map(c=>{const ok=has?rangeFree(c.id,f,to):null;const q=has?`&from=${f}&to=${to}`:"";return `<a class="card" href="car.html?id=${c.id}${q}"><div class="ph"><img src="${img(c)}" alt="${c.name}">${c.example?`<span class="badge">${t("example")}</span>`:""}</div><div class="b"><h3>${c.name}</h3><div class="meta">${tr(c.type)} · ${c.seats?c.seats+" "+t("seats")+" · ":""}${tr(c.fuel)||""}</div><div style="display:flex;justify-content:space-between;align-items:end;margin-top:10px"><div class="price">${c.pricePerDay} €<small>${t("day")}</small></div>${ok===null?"":`<span class="meta" style="color:${ok?"#0b6e63":"#a33"}">${ok?"✓ "+t("free"):"✕ "+t("busy")}</span>`}</div></div></a>`}).join("")}
let calM;
function renderCal(c){const box=$("#cal");if(!box)return;const s=busySet(c.id),today=iso(new Date()),f=$("#b-from").value,to=$("#b-to").value;
const y=calM.getUTCFullYear(),m=calM.getUTCMonth(),first=new Date(Date.UTC(y,m,1)),off=(first.getUTCDay()+6)%7,n=new Date(Date.UTC(y,m+1,0)).getUTCDate();
const wd=t("wd");
let h=wd.map(w=>`<div class="h">${w}</div>`).join("")+"<div></div>".repeat(off);
for(let i=1;i<=n;i++){const d=iso(new Date(Date.UTC(y,m,i)));const cl=["d"];if(s.has(d))cl.push("busy");if(d<today)cl.push("past");if(f&&to&&d>=f&&d<to&&!s.has(d))cl.push("sel");h+=`<div class="${cl.join(" ")}">${i}</div>`}
box.innerHTML=h;$("#cal-m").textContent=first.toLocaleDateString(t("locale"),{month:"long",year:"numeric",timeZone:"UTC"})}
function renderDetail(){const el=$("#detail");if(!el)return;const c=RENT.find(x=>x.id===qs.get("id"))||RENT[0];if(!c){el.innerHTML=t("notfound");return}
document.title=c.name+" · Ruypas Rent";setMeta(c);syncSwitch(c.id);const ph=(c.photos&&c.photos.length?c.photos:[c.silhouette]).map(P);
const sp=[[t("fuel"),tr(c.fuel)||"—"],[t("gear"),tr(c.gearbox)||"—"],[t("seats.l"),c.seats||"—"],[t("range"),c.range?c.range+" km":"—"],[t("year"),c.year||"—"],[t("color"),tr(c.color)||"—"],[t("deposit"),c.deposit+" €"],[t("km"),`${c.kmPerDay} ${t("kmd")} (${c.extraKm} €/${t("extra")})`],[t("fuelp"),tr(c.fuelPolicy)],[t("price"),c.pricePerDay+" €"+t("day")]];
el.innerHTML=`<div><p><a href="rent.html#coches">${t("back")}</a></p><div class="gallery"><img id="main" src="${ph[0]}" alt="${c.name}">${ph.length>1?`<div class="thumbs">${ph.map(p=>`<img src="${p}" onclick="main.src=this.src">`).join("")}</div>`:`<p class="meta">${t("photo")}</p>`}</div>
<h1 style="margin:14px 0 4px">${c.name}</h1><div class="meta">${tr(c.type)} · 📍 ${t("loc")}</div><p>${tr(c.description)}</p>
<div><span class="price">${c.pricePerDay} €<small>${t("day")}</small></span> ${c.example?`<span class="badge">${t("example")}</span>`:""}</div>
<div class="specs">${sp.map(([k,v])=>`<div><span>${k}</span>${v}</div>`).join("")}</div><p class="note">🛡️ ${t("ins")}</p>${(c.notes||[]).map(n=>`<p class="note">${tr(n)}</p>`).join("")}
<div class="box" style="margin-top:16px"><h3 style="margin-top:0">${t("avail")}</h3><div class="cal-head"><button id="pm">‹</button><b id="cal-m"></b><button id="nm">›</button></div><div class="cal" id="cal"></div><div class="legend"><i style="background:#eaf6f3"></i>${t("lfree")}<i style="background:#f6d5d5"></i>${t("lbusy")}<i style="background:#0b6e63"></i>${t("lsel")}</div></div></div>
<div><form class="box" id="bf" style="position:sticky;top:76px"><h2 style="margin:0">${t("book")}</h2>
<label>${t("name")}</label><input id="b-name" autocomplete="name"><div class="row"><div><label>${t("email")}</label><input id="b-email" type="email"></div><div><label>${t("phone")}</label><input id="b-phone" type="tel"></div></div>
<div class="row"><div><label>${t("from")}</label><input id="b-from" type="date"></div><div><label>${t("to")}</label><input id="b-to" type="date"></div></div>
<div class="row"><div><label>${t("age")}</label><input id="b-age" type="number" min="18" value="30"></div><div><label>${t("lic")}</label><input id="b-lic" type="number" min="0" value="5"></div></div>
<label>${t("msg")}</label><textarea id="b-msg" rows="2"></textarea><div class="total" id="tot"></div><div class="err" id="err"></div>
<div class="actions"><a class="btn" id="mail" href="#">✉️ ${t("send")}</a><a class="btn wa" id="wa" href="#" target="_blank" rel="noopener">💬 ${t("sendwa")}</a></div></form></div>`;
const today=iso(new Date());$("#b-from").min=$("#b-to").min=today;if(qs.get("from"))$("#b-from").value=qs.get("from");if(qs.get("to"))$("#b-to").value=qs.get("to");
calM=new Date(Date.UTC(new Date().getFullYear(),new Date().getMonth(),1));
$("#pm").onclick=()=>{calM.setUTCMonth(calM.getUTCMonth()-1);renderCal(c)};$("#nm").onclick=()=>{calM.setUTCMonth(calM.getUTCMonth()+1);renderCal(c)};
const upd=()=>{const f=$("#b-from").value,to=$("#b-to").value,n=f&&to?nights(f,to):0;let e="";
if(!(n>0))e=t("e.dates");else if(!rangeFree(c.id,f,to))e=t("e.busy");else if(+$("#b-age").value<25||+$("#b-lic").value<2)e=t("e.age");else if(!$("#b-name").value||!$("#b-email").value||!$("#b-phone").value)e=t("e.req");
const tot=n>0?n*c.pricePerDay:0;$("#tot").innerHTML=n>0?`${n} ${t("days")} × ${c.pricePerDay} € = <b>${tot} €</b> ${c.example?`<span class="badge">${t("example")}</span>`:""}<br><span class="meta">+ ${t("deposit")}: ${c.deposit} € · ${n*c.kmPerDay} km</span>`:`${t("total")}: —`;
$("#err").textContent=e;const body=`${t("m.hello")}\n\n${c.name}\n${t("from")}: ${f}\n${t("to")}: ${to}\n${n} ${t("days")} → ${t("total")}: ${tot} € (${t("example")})\n${t("deposit")}: ${c.deposit} €\n\n${t("name")}: ${$("#b-name").value}\n${t("email")}: ${$("#b-email").value}\n${t("phone")}: ${$("#b-phone").value}\n${t("age")}: ${$("#b-age").value} · ${t("lic")}: ${$("#b-lic").value}\n${$("#b-msg").value}`;
$("#mail").href=`mailto:${OWNER.email}?subject=${encodeURIComponent(`${t("m.subj")}: ${c.name} ${f} → ${to}`)}&body=${encodeURIComponent(body)}`;$("#wa").href=`https://wa.me/${OWNER.wa}?text=${encodeURIComponent(body)}`;
["mail","wa"].forEach(i=>{$("#"+i).style.opacity=e?.5:1;$("#"+i).dataset.err=e});
if(f&&D(f).getUTCMonth()!==calM.getUTCMonth()&&n>0){calM=new Date(Date.UTC(D(f).getUTCFullYear(),D(f).getUTCMonth(),1))}renderCal(c)};
$("#bf").addEventListener("input",upd);["mail","wa"].forEach(i=>$("#"+i).addEventListener("click",ev=>{if(ev.currentTarget.dataset.err){ev.preventDefault();$("#err").textContent=ev.currentTarget.dataset.err}}));upd()}
function render(){renderImport();renderGrid();renderDetail();renderSale()}
async function init(){[CARS,AV]=await Promise.all([fetch(B+"cars.json").then(r=>r.json()).then(j=>j.cars),fetch(B+"availability.json").then(r=>r.json())]);
RENT=CARS.filter(c=>(c.category||"rent")!=="sale");SALE=CARS.filter(c=>c.category==="sale");
const s=$("#search");if(s){const a=new Date();a.setDate(a.getDate()+3);const b=new Date(a);b.setDate(b.getDate()+4);$("#s-from").value=iso(a);$("#s-to").value=iso(b);s.onsubmit=e=>{e.preventDefault();renderGrid();$("#coches").scrollIntoView({behavior:"smooth"})};s.oninput=renderGrid}
render();suggest()}


// Selector de idioma: mantiene el coche (?id=) y las fechas al cambiar de idioma
function syncSwitch(id){const q=new URLSearchParams(location.search);if(id)q.set("id",id);const qs=q.toString();
document.querySelectorAll(".lang-link").forEach(a=>{a.href=a.dataset.href+(qs?"?"+qs:"")+location.hash;a.onclick=()=>{try{localStorage.setItem("ruypas-lang",a.hreflang)}catch(e){}}})}
// Ficha de coche: título, descripción, canonical y hreflang con el id del coche
function setMeta(c){const d=tr(c.description);const m=document.querySelector('meta[name="description"]');if(d&&m)m.content=c.name+" — "+d;
const q="?id="+encodeURIComponent(c.id);const cn=document.querySelector('link[rel="canonical"]');if(cn&&!cn.href.includes("?"))cn.href+=q;
document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(a=>{if(!a.href.includes("?"))a.href+=q})}
// Sugerencia de idioma según el navegador (nunca redirige)
function suggest(){let chosen=null;try{chosen=localStorage.getItem("ruypas-lang")}catch(e){}if(chosen)return;
const pref=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""]).map(x=>String(x).slice(0,2).toLowerCase()).find(x=>LANGS.includes(x));
if(!pref||pref===L)return;const a=document.querySelector(`.lang-link[hreflang="${pref}"]`),b=document.getElementById("lang-sug");if(!a||!b)return;const S=T[pref];
b.innerHTML=`<span lang="${pref}">${S["sug.t"]}</span><a class="btn" lang="${pref}" hreflang="${pref}" href="${a.href}">${S["sug.go"]}</a><button type="button" aria-label="${S["sug.no"]}" title="${S["sug.no"]}">×</button>`;b.hidden=false;
b.querySelector("a").onclick=()=>{try{localStorage.setItem("ruypas-lang",pref)}catch(e){}};b.querySelector("button").onclick=()=>{try{localStorage.setItem("ruypas-lang",L)}catch(e){}b.hidden=true}}
syncSwitch(new URLSearchParams(location.search).get("id"));
window.addEventListener("hashchange",()=>syncSwitch(new URLSearchParams(location.search).get("id")));
// ---- Ruypas Import (venta) ----
const esc=x=>String(x??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const fmtKm=c=>c.km?(c.kmApprox?t("sale.approx")+" ":"")+Number(c.km).toLocaleString(t("locale"))+" km":"—";
const priceTxt=c=>c.price?Number(c.price).toLocaleString(t("locale"))+" €":(tr(c.priceText)||t("price.req"));
function saleMsg(c){return `${t("m.sale.hello")}\n\n${c.name} · ${tr(c.unit)} · ${c.year} · ${fmtKm(c)}\n${location.href.split("#")[0]}\n\n${t("m.sale.ask")}`}
const waHref=txt=>`https://wa.me/${OWNER.wa}?text=${encodeURIComponent(txt)}`;
const mailHref=(subj,txt)=>`mailto:${OWNER.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(txt)}`;
function renderImport(){const g=$("#sale-grid");if(!g)return;
g.innerHTML=SALE.map(c=>`<article class="card sale-card"><a class="ph" href="sale.html?id=${c.id}"><img src="${img(c)}" alt="${esc(c.name+" · "+tr(c.unit))}" loading="lazy"><span class="badge price-badge">${esc(priceTxt(c))}</span></a><div class="b"><h3><a href="sale.html?id=${c.id}">${esc(c.name)}</a> <small class="meta">· ${esc(tr(c.unit))}</small></h3>
<div class="meta">${c.year} · ${fmtKm(c)} · ${esc(tr(c.specs.wltp))} WLTP · ${esc(tr(c.specs.power))}</div><div class="meta">🔋 ${esc(t("sale.batt"))}: ${esc(tr(c.battery))}</div><p class="eta">🚚 ${esc(tr(c.eta))}</p>
<div class="actions"><a class="btn" href="sale.html?id=${c.id}">${esc(t("imp.more"))}</a><a class="btn wa" target="_blank" rel="noopener" href="${waHref(saleMsg(c).replace(location.href.split("#")[0],new URL("sale.html?id="+c.id,location.href).href))}">💬 WhatsApp</a></div></div></article>`).join("")}
function renderSale(){const el=$("#sale");if(!el)return;const c=SALE.find(x=>x.id===qs.get("id"))||SALE[0];if(!c){el.innerHTML=t("notfound");return}
document.title=`${c.name} · ${tr(c.unit)} · Ruypas Import`;setMeta(c);syncSwitch(c.id);const ph=(c.photos&&c.photos.length?c.photos:[c.silhouette]).map(P);
const S=c.specs,rows=[[t("sale.price"),priceTxt(c)],[t("sale.km"),fmtKm(c)],[t("sale.batt"),tr(c.battery)],[t("sale.eta"),tr(c.eta)],[t("sale.version"),tr(S.version)],[t("sale.reg"),tr(S.reg)],[t("sale.power"),tr(S.power)],[t("sale.accel"),tr(S.accel)],[t("sale.wltp"),tr(S.wltp)],[t("color"),tr(S.color)],[t("sale.interior"),tr(S.interior)],[t("seats.l"),tr(S.seats)],[t("sale.charge"),tr(S.charge)]];
const msg=saleMsg(c);
el.innerHTML=`<div><p><a href="import.html#unidades">${esc(t("sale.back"))}</a></p><div class="gallery"><img id="main" src="${ph[0]}" alt="${esc(c.name)}"><div class="thumbs">${ph.map(p=>`<img src="${p}" alt="" loading="lazy" onclick="main.src=this.src">`).join("")}</div></div>
<p class="kicker dark">Ruypas Import</p><h1 style="margin:4px 0">${esc(c.name)} <small class="meta">· ${esc(tr(c.unit))}</small></h1><p>${esc(tr(c.description))}</p>
<h2 class="h3">${esc(t("sale.specs"))}</h2><div class="specs">${rows.map(([k,v])=>`<div><span>${esc(k)}</span>${esc(v)}</div>`).join("")}</div>
<h2 class="h3">${esc(t("sale.equip"))}</h2><ul class="feat">${(tr(c.features)||[]).map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div>
<div><div class="box" style="position:sticky;top:76px"><p class="kicker dark">Ruypas Import</p><div class="price">${esc(priceTxt(c))}</div><p class="meta">🚚 ${esc(tr(c.eta))}</p><h2 style="font-size:1.15rem">${esc(t("sale.ask"))}</h2>
<div class="actions"><a class="btn wa" target="_blank" rel="noopener" href="${waHref(msg)}">💬 ${esc(t("imp.wa"))}</a><a class="btn" href="${mailHref(t("m.sale.subj")+": "+c.name+" · "+tr(c.unit),msg)}">✉️ ${esc(t("imp.mail"))}</a></div><p class="meta" style="margin-top:12px">💶 ${esc(t("imp.price.note"))} <a href="import.html#costes">${esc(t("imp.price.how"))} →</a></p><p class="meta">${esc(t("imp.note"))}</p></div></div>`;carLD(c,ph)}
// Datos estructurados del coche en venta (sin precio: precio a consultar)
function carLD(c,ph){const S=c.specs||{};const j={"@context":"https://schema.org","@type":"Car","name":c.name+" · "+tr(c.unit),"brand":{"@type":"Brand","name":"Tesla"},"model":"Model 3",
 "vehicleModelDate":String(c.year),"color":tr(S.color),"fuelType":"Electricity","numberOfSeats":5,"image":ph.map(p=>new URL(p,location.href).href),"description":tr(c.description),
 "mileageFromOdometer":{"@type":"QuantitativeValue","value":c.km,"unitCode":"KMT"},"offers":{"@type":"Offer","availability":"https://schema.org/PreOrder","seller":{"@id":"https://ruypas.com/#org"}}};
 let e=document.getElementById("car-ld");if(!e){e=document.createElement("script");e.type="application/ld+json";e.id="car-ld";document.head.appendChild(e)}e.textContent=JSON.stringify(j)}
// Menú: marca la sección activa (clic y desplazamiento)
function navSpy(){const links=[...document.querySelectorAll(".main-nav a[data-nav]")];const def=document.body.dataset.nav||"";
 const set=k=>links.forEach(a=>{const on=a.dataset.nav===k;a.classList.toggle("is-active",on);on?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
 const secs=[...document.querySelectorAll("[data-nav]:not(a)")].filter(e=>e!==document.body);
 const upd=()=>{const y=innerHeight*0.35;let k=def;for(const e of secs){const r=e.getBoundingClientRect();if(r.top<=y&&r.bottom>y){k=e.dataset.nav;break}}
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)k="contact";set(k)};
 addEventListener("scroll",upd,{passive:true});addEventListener("hashchange",upd);links.forEach(a=>a.addEventListener("click",()=>set(a.dataset.nav)));upd()}
// Formulario de contacto -> WhatsApp o email (sitio estático, sin servidor)
function contactForm(){const f=$("#ct-form");if(!f)return;const pg=document.body.dataset.nav;if(["import","consult","rent"].includes(pg))$("#ct-topic").value=pg;
 const build=()=>{const m=$("#ct-msg").value.trim();if(!m){$("#ct-err").hidden=false;$("#ct-msg").focus();return null}$("#ct-err").hidden=true;
  const n=$("#ct-name").value.trim(),tp=$("#ct-topic").selectedOptions[0].text;return{subj:`${t("ct.subj")} · ${tp}`,body:`${n?t("ct.name")+": "+n+"\n":""}${t("ct.topic")}: ${tp}\n\n${m}\n\n${location.href}`}};
 $("#ct-wa").onclick=()=>{const b=build();if(b)window.open(waHref(b.body),"_blank","noopener")};
 $("#ct-mail").onclick=()=>{const b=build();if(b)location.href=mailHref(b.subj,b.body)}}
// Comentarios con Giscus (GitHub Discussions en ivancet/ruypas-web), carga diferida.
// Para activarlos: instalar la app https://github.com/apps/giscus en el repo y poner enabled:true.
const GISCUS={enabled:true,repo:"ivancet/ruypas-web",repoId:"R_kgDOVMDpLQ",category:"Announcements",categoryId:"DIC_kwDOVMDpLc4DIqpP"};
const GLANG={es:"es",ca:"ca",en:"en",fr:"fr",de:"de",ru:"ru",zh:"zh-CN"};
function comments(){const el=$("#comments");if(!el)return;const id=qs.get("id");const term=el.dataset.term+(id?":"+id:"");
 if(!GISCUS.enabled){el.innerHTML=`<div class="box cm-soon"><p>${esc(t("cm.soon"))}</p><div class="cta-row"><a class="btn wa" target="_blank" rel="noopener" href="${waHref(t("m.con.gen"))}">💬 WhatsApp</a><a class="btn" href="${mailHref(t("ct.subj"),"")}">✉️ Email</a></div></div>`;return}
 const load=()=>{if(el.dataset.loaded)return;el.dataset.loaded=1;const sc=document.createElement("script");sc.src="https://giscus.app/client.js";sc.async=true;sc.crossOrigin="anonymous";
  Object.entries({repo:GISCUS.repo,"repo-id":GISCUS.repoId,category:GISCUS.category,"category-id":GISCUS.categoryId,mapping:"specific",term,strict:"1","reactions-enabled":"1",
   "emit-metadata":"0","input-position":"top",theme:"light",lang:GLANG[L]||"en",loading:"lazy"}).forEach(([k,v])=>sc.setAttribute("data-"+k,v));el.appendChild(sc)};
 if("IntersectionObserver"in window){const o=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){o.disconnect();load()}},{rootMargin:"300px"});o.observe(el)}else load()}
navSpy();contactForm();
init().then(comments);
