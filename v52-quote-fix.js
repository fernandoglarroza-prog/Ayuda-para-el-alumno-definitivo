/* Nextfuture V5.2 — cotizador/diagnóstico sin defaults fantasma */
(function(){'use strict';
const $=id=>document.getElementById(id),norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');
const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const LAB={phone:{diagnosis:20000,screen:30000,battery:22000,charge:32000,camera:25000,audio:25000,software:30000,water:30000,board:50000},tablet:{diagnosis:20000,screen:38000,battery:32000,charge:38000,software:30000,water:42000,board:55000},notebook:{diagnosis:20000,screen:40000,battery:35000,charge:45000,keyboard:40000,ssd:25000,ram:25000,cleaning:50000,software:55000,board:70000},pc:{diagnosis:20000,psu:30000,ssd:20000,ram:20000,cleaning:40000,software:55000,assembly:50000,board:50000}};
const LABEL={diagnosis:'Diagnóstico técnico',screen:'Pantalla / display',battery:'Batería',charge:'Carga / conector',camera:'Cámara',audio:'Audio / micrófono / parlante',software:'Sistema / software',water:'Daño por líquido',board:'Placa / electrónica',keyboard:'Teclado',ssd:'SSD / almacenamiento',ram:'Memoria RAM',cleaning:'Limpieza / temperatura',psu:'Fuente de alimentación',assembly:'Armado / configuración'};
const PARTS={
 'samsung galaxy a15':{screen:{economy:[37000,42000],premium:[99000,175000]}},
 'samsung a15':{screen:{economy:[37000,42000],premium:[99000,175000]}},
 'galaxy a15':{screen:{economy:[37000,42000],premium:[99000,175000]}},
 'motorola moto g24':{screen:{economy:[24000,34000]}},'motorola g24':{screen:{economy:[24000,34000]}},'moto g24':{screen:{economy:[24000,34000]}},
 'xiaomi redmi note 13 4g':{screen:{economy:[40000,69000],premium:[85000,140000]}},'redmi note 13 4g':{screen:{economy:[40000,69000],premium:[85000,140000]}}
};
const round=n=>Math.round(n/1000)*1000;
function matchModel(v){const k=norm(v);return PARTS[k]||null}
function estimate(d,j,m){const labor=LAB[d]?.[j]??LAB[d]?.diagnosis??20000,p=matchModel(m)?.[j];if(!p)return{labor,known:false};const calc=x=>[round(x[0]*1.2+labor),round(x[1]*1.2+labor)];return{labor,known:true,economy:p.economy&&calc(p.economy),premium:p.premium&&calc(p.premium)}}
function jobs(d){return Object.keys(LAB[d]||{}).map(k=>`<option value="${k}">${LABEL[k]||k}</option>`).join('')}
function render(){
 const d=$('qpDeviceV52')?.value||'phone',m=$('qpModelV52')?.value.trim()||'',j=$('qpJobV52')?.value||'diagnosis',out=$('qpResult');if(!out)return;
 if(!m){out.innerHTML='<div class="qp-warning"><b>Escribí la marca y el modelo.</b><br>No seleccionamos ningún modelo por defecto.</div>';return}
 const x=estimate(d,j,m),title=`${m} · ${LABEL[j]||j}`;
 if(!x.known){out.innerHTML=`<small>COTIZACIÓN SEGÚN EL EQUIPO INGRESADO</small><strong>${title}</strong><p>Mano de obra de referencia: <b>${money(x.labor)}</b>. Para este modelo y trabajo todavía no hay una referencia de repuesto suficientemente verificada en la base.</p><div class="qp-warning"><b>Cotización personalizada</b><br>No se reemplaza tu modelo por un Galaxy A15 ni se inventa el precio del repuesto. Se confirma variante y disponibilidad antes de dar el total.</div><div class="qp-actions"><a class="btn btn-primary" href="#solicitud" data-v52-request>Solicitar cotización</a></div>`;return}
 const e=x.economy;out.innerHTML=`<small>ESTIMACIÓN ORIENTATIVA</small><strong>${money(e[0])} – ${money(e[1])}</strong><p>${title}. Incluye referencia de repuesto e instalación.</p>${x.premium?`<div class="qp-options"><div class="qp-option"><small>Compatible seleccionada</small><b>${money(e[0])} – ${money(e[1])}</b></div><div class="qp-option"><small>Superior / original</small><b>${money(x.premium[0])} – ${money(x.premium[1])}</b></div></div>`:''}<div class="qp-actions"><a class="btn btn-primary" href="#solicitud" data-v52-request>Solicitar reparación</a></div><div class="qp-meta">La disponibilidad y variante exacta se reconfirman antes del presupuesto definitivo.</div>`;
}
function mount(){
 const grid=document.querySelector('#cotizador .qp-grid');if(!grid||$('qpDeviceV52'))return;
 grid.innerHTML=`<div class="qp-field"><label>Tipo de equipo</label><select id="qpDeviceV52"><option value="phone">Celular</option><option value="tablet">Tablet</option><option value="notebook">Notebook</option><option value="pc">PC de escritorio</option></select></div><div class="qp-field"><label>Marca y modelo exactos</label><input id="qpModelV52" autocomplete="off" placeholder="Ej: Motorola Moto G52"></div><div class="qp-field"><label>Problema / reparación</label><select id="qpJobV52"></select></div><div class="qp-field"><label>Diagnóstico físico</label><input value="Desde $20.000 · se confirma al recibir" disabled></div>`;
 const d=$('qpDeviceV52'),j=$('qpJobV52'),m=$('qpModelV52');const refill=()=>{j.innerHTML=jobs(d.value);render()};d.onchange=refill;j.onchange=render;m.oninput=render;refill();
 document.querySelector('#cotizador')?.addEventListener('click',ev=>{const a=ev.target.closest('[data-v52-request]');if(!a)return;const full=m.value.trim(),parts=full.split(/\s+/);if($('rqDevice'))$('rqDevice').value=d.value;if($('rqBrand'))$('rqBrand').value=parts.shift()||'';if($('rqModel'))$('rqModel').value=parts.join(' ');if($('rqIssue'))$('rqIssue').value=`Cotización solicitada: ${LABEL[j.value]||j.value} · ${full}. Requiere confirmación técnica y de repuesto.`;});
}
function diagBridge(){
 const root=document.querySelector('#diagResultCard .diag-result');if(!root||root.querySelector('#nf52Identity')||typeof diagState==='undefined'||!diagState.symptom)return;
 const brand=$('diagBrand')?.value.trim()||'',model=$('diagModel')?.value.trim()||'',full=[brand,model].filter(Boolean).join(' '),s=DIAG_DATA?.[diagState.device]?.symptoms?.[diagState.symptom];
 const job=window.NextfutureQuoteV48?.jobFromSymptom?.(diagState.symptom,s)||'diagnosis',x=estimate(diagState.device,job,full);
 root.querySelector('#nf48QuoteBridge')?.remove();
 const b=document.createElement('div');b.id='nf52Identity';b.className='nf48-quote-bridge';b.innerHTML=`<div><small>EQUIPO ANALIZADO</small><b>${full||'Modelo no informado'} · ${LABEL[job]||s?.label||'Diagnóstico'}</b><p>${x.known?`Estimación con referencia: ${money(x.economy[0])} – ${money(x.economy[1])}.`:`Mano de obra de referencia: ${money(x.labor)}. Repuesto a confirmar para este modelo exacto.`}</p></div><button class="btn btn-secondary" type="button" id="nf52Quote">Cotizar este equipo</button>`;
 root.querySelector('.diag-result-grid')?.insertAdjacentElement('afterend',b);
 $('nf52Quote').onclick=()=>{location.hash='cotizador';setTimeout(()=>{const d=$('qpDeviceV52'),m=$('qpModelV52'),j=$('qpJobV52');d.value=diagState.device;j.innerHTML=jobs(d.value);j.value=job;m.value=full;render()},30)};
}
document.addEventListener('DOMContentLoaded',mount);const card=$('diagResultCard');if(card)new MutationObserver(()=>setTimeout(diagBridge,130)).observe(card,{childList:true,subtree:true});
window.NextfutureQuoteV52={estimate,render};
})();