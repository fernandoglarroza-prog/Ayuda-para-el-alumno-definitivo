// Nextfuture V4.8 — cotización unificada y puente diagnóstico → costo
(function(){'use strict';
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const LABOR={
 phone:{diagnosis:20000,screen:30000,battery:22000,charge:32000,camera:25000,audio:25000,software:30000,water:30000,board:50000},
 tablet:{diagnosis:20000,screen:38000,battery:32000,charge:38000,software:30000,water:42000,board:55000},
 notebook:{diagnosis:20000,screen:40000,battery:35000,charge:45000,keyboard:40000,ssd:25000,ram:25000,cleaning:50000,software:55000,board:70000},
 pc:{diagnosis:20000,psu:30000,ssd:20000,ram:20000,cleaning:40000,software:55000,assembly:50000,board:50000}
};
const PARTS={
 'samsung galaxy a15':{screen:{economy:[37000,42000],premium:[99000,175000]}},
 'motorola moto g24':{screen:{economy:[24000,34000]}},
 'moto g24':{screen:{economy:[24000,34000]}},
 'xiaomi redmi note 13 4g':{screen:{economy:[40000,69000],premium:[85000,140000]}},
 'redmi note 13 4g':{screen:{economy:[40000,69000],premium:[85000,140000]}}
};
const JOB_LABEL={screen:'Pantalla',battery:'Batería',charge:'Carga / conector',camera:'Cámara',audio:'Audio',software:'Sistema / software',water:'Daño por líquido',board:'Placa / electrónica',keyboard:'Teclado',ssd:'SSD / almacenamiento',ram:'Memoria RAM',cleaning:'Limpieza / mantenimiento',psu:'Fuente',assembly:'Armado / configuración',diagnosis:'Diagnóstico técnico'};
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const round=n=>Math.round(n/1000)*1000;
function jobFromSymptom(k,s){
 const t=norm([k,s?.label,s?.category].join(' '));
 if(/pantalla|display|imagen|tactil/.test(t))return'screen'; if(/bateria|autonomia/.test(t))return'battery';
 if(/carga|puerto|jack|conector/.test(t))return'charge'; if(/camara|webcam/.test(t))return'camera'; if(/audio|microfono|parlante|auricular/.test(t))return'audio';
 if(/liquido|humedad|mojo/.test(t))return'water'; if(/teclado/.test(t))return'keyboard'; if(/ssd|disco|almacenamiento/.test(t))return'ssd';
 if(/ram|memoria/.test(t))return'ram'; if(/temperatura|ventilador|mantenimiento/.test(t))return'cleaning'; if(/windows|software|sistema|virus|cuenta/.test(t))return'software';
 if(/placa|motherboard|corto|electronica/.test(t))return'board'; return'diagnosis';
}
function labor(device,job){return LABOR[device]?.[job]??LABOR[device]?.diagnosis??20000}
function partRef(model,job){const m=PARTS[norm(model)];return m?.[job]||null}
function estimate(device,job,model){
 const l=labor(device,job), p=partRef(model,job); if(!p)return{labor:l,personalized:true};
 const calc=r=>[round(r[0]*1.2+l),round(r[1]*1.2+l)];
 return{labor:l,economy:p.economy?calc(p.economy):null,premium:p.premium?calc(p.premium):null,personalized:false};
}
function ensureControls(){
 const grid=document.querySelector('.qp-grid');if(!grid||$('qpDeviceV48'))return;
 const oldModel=$('qpModel')?.closest('.qp-field'),oldJob=$('qpJob')?.closest('.qp-field'); if(oldModel)oldModel.style.display='none';if(oldJob)oldJob.style.display='none';
 grid.insertAdjacentHTML('afterbegin',`<div class="qp-field"><label>Tipo de equipo</label><select id="qpDeviceV48"><option value="phone">Celular</option><option value="tablet">Tablet</option><option value="notebook">Notebook</option><option value="pc">PC</option></select></div><div class="qp-field"><label>Marca y modelo exactos</label><input id="qpModelV48" placeholder="Ej: Samsung Galaxy A15"></div><div class="qp-field"><label>Trabajo / problemática</label><select id="qpJobV48"></select></div>`);
}
function jobsFor(d){return Object.keys(LABOR[d]||{}).map(k=>`<option value="${k}">${JOB_LABEL[k]||k}</option>`).join('')}
function render(){
 const d=$('qpDeviceV48')?.value||'phone',j=$('qpJobV48')?.value||'diagnosis',model=$('qpModelV48')?.value.trim()||'',out=$('qpResult');if(!out)return;
 const e=estimate(d,j,model),label=JOB_LABEL[j]||j;
 if(e.personalized){
  out.innerHTML=`<small>ESTIMACIÓN RESPONSABLE</small><strong>Mano de obra desde ${money(e.labor)}</strong><p>${label}${model?' · '+model:''}. El repuesto no se suma hasta confirmar la variante exacta y una referencia real disponible.</p><div class="qp-breakdown"><span>Diagnóstico técnico: ${money(20000)}</span><span>Mano de obra base: ${money(e.labor)}</span><span>Repuesto: a confirmar</span></div><div class="qp-warning"><b>No inventamos el precio del repuesto.</b> El presupuesto total se confirma cuando existe una referencia compatible y verificable.</div><div class="qp-actions"><a class="btn btn-primary" href="#solicitud">Solicitar cotización</a></div>`;return;
 }
 const range=e.economy;out.innerHTML=`<small>ESTIMACIÓN ORIENTATIVA CON REPUESTO DE REFERENCIA</small><strong>${money(range[0])} – ${money(range[1])}</strong><p>${model} · ${label}. Incluye repuesto de referencia, margen operativo e instalación.</p>${e.premium?`<div class="qp-options"><div class="qp-option"><small>Opción económica</small><b>${money(range[0])} – ${money(range[1])}</b></div><div class="qp-option"><small>Superior / original</small><b>${money(e.premium[0])} – ${money(e.premium[1])}</b></div></div>`:''}<div class="qp-actions"><a class="btn btn-primary" href="#solicitud">Solicitar reparación</a></div><div class="qp-meta">Referencia de repuesto revisada 02/10/2026. Se reconfirma disponibilidad antes de presupuestar.</div>`;
}
function prefillRequest(device,model,job,summary){const d=$('rqDevice'),b=$('rqBrand'),m=$('rqModel'),i=$('rqIssue');if(d)d.value=device;if(model){const parts=model.trim().split(/\s+/);if(b&&!b.value)b.value=parts[0]||'';if(m&&!m.value)m.value=parts.slice(1).join(' ');}if(i&&!i.value)i.value=summary||('Cotización solicitada: '+(JOB_LABEL[job]||job)+(model?' · '+model:''));location.hash='solicitud';}\nfunction bindQuoteActions(){document.addEventListener('click',e=>{const a=e.target.closest?.('#qpResult a[href="#solicitud"]');if(!a)return;e.preventDefault();const d=$('qpDeviceV48')?.value||'phone',j=$('qpJobV48')?.value||'diagnosis',model=$('qpModelV48')?.value.trim()||'';prefillRequest(d,model,j,'Solicitud desde cotizador: '+(JOB_LABEL[j]||j)+(model?' · '+model:'')+'. Presupuesto orientativo sujeto a confirmación de repuesto y diagnóstico técnico.');});}\nfunction init(){
 ensureControls();bindQuoteActions(); const d=$('qpDeviceV48'),j=$('qpJobV48'),m=$('qpModelV48');if(!d)return;
 const refreshJobs=()=>{j.innerHTML=jobsFor(d.value);render()}; d.addEventListener('change',refreshJobs);j.addEventListener('change',render);m.addEventListener('input',render);refreshJobs();
}
function bridge(){
 const root=document.querySelector('#diagResultCard .diag-result');if(!root||root.querySelector('#nf48QuoteBridge')||typeof diagState==='undefined'||!diagState.symptom)return;
 const s=DIAG_DATA?.[diagState.device]?.symptoms?.[diagState.symptom],job=jobFromSymptom(diagState.symptom,s),brand=$('diagBrand')?.value.trim()||'',model=$('diagModel')?.value.trim()||'',full=[brand,model].filter(Boolean).join(' ');
 root.querySelectorAll('.diag-panel').forEach(p=>{if(/costo orientativo/i.test(p.querySelector('h4')?.textContent||''))p.remove()});
 const e=estimate(diagState.device,job,full),box=document.createElement('div');box.id='nf48QuoteBridge';box.className='nf48-quote-bridge';
 box.innerHTML=`<div><small>ESTIMACIÓN CONECTADA AL DIAGNÓSTICO</small><b>${e.personalized?'Mano de obra desde '+money(e.labor):money(e.economy[0])+' – '+money(e.economy[1])}</b><p>${e.personalized?'Falta confirmar el repuesto/variante para calcular un total responsable.':'Existe referencia de repuesto para este modelo; se reconfirma antes de reparar.'}</p></div><button type="button" class="btn btn-secondary" id="nf48GoQuote">Abrir cotizador</button>`;
 root.querySelector('.diag-result-grid')?.insertAdjacentElement('afterend',box);
 $('nf48GoQuote')?.addEventListener('click',()=>{location.hash='cotizador';setTimeout(()=>{if($('qpDeviceV48'))$('qpDeviceV48').value=diagState.device;if($('qpModelV48'))$('qpModelV48').value=full;if($('qpJobV48')){$('qpJobV48').innerHTML=jobsFor(diagState.device);$('qpJobV48').value=job;}render();},30)});
}
document.addEventListener('DOMContentLoaded',init);
const card=$('diagResultCard');if(card)new MutationObserver(()=>setTimeout(bridge,100)).observe(card,{childList:true,subtree:true});
window.NextfutureQuoteV48={estimate,jobFromSymptom,render,prefillRequest};
})();