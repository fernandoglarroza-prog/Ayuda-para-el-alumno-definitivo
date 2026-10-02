// Nextfuture V4.5 — profundidad, riesgo y acciones del diagnóstico
(function(){
'use strict';
const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function profile(){
 const s=DIAG_DATA?.[diagState.device]?.symptoms?.[diagState.symptom]; if(!s)return null;
 const c=window.NextfutureDiagnostic?.context?.()||{}, a=window.NextfutureAdaptiveDiagnostic?.answers?.()||{};
 const t=norm([s.label,s.category,...(s.causes||[])].join(' '));
 const yes=Object.entries(diagState.answers||{}).filter(([,v])=>v==='yes').map(([k])=>k);
 const ayes=Object.entries(a).filter(([,v])=>v==='yes').map(([k])=>k);
 let level='Moderada', stop=false, reason='Conviene revisar el equipo antes de que la falla avance o provoque pérdida de información.';
 if(c.antecedent==='liquid'||/liquido|humedad|hinch/.test(t)||ayes.some(x=>/board_warning|power_signs/.test(x))){level='Alta';stop=true;reason='Hay señales o antecedentes que pueden implicar daño eléctrico, corrosión, batería o temperatura. Evitá seguir probando el equipo.';}
 else if(c.antecedent==='power'||/placa|motherboard|corto|fuente|temperatura|calienta/.test(t)){level='Alta';reason='La falla puede involucrar alimentación, temperatura o electrónica. Repetir encendidos puede agravarla si aparecen signos anormales.';}
 else if(/cuenta|pin|software|app|wifi|bluetooth|gps/.test(t)){level='Baja a moderada';reason='No hay por sí solo un indicio de daño inmediato. Primero conviene descartar configuración, accesorios y software con pruebas reversibles.';}
 if(yes.some(x=>/swollen|powered/.test(x))){level='Alta';stop=true;}
 const checks=(s.safeChecks||[]).slice(0,4);
 const dont=[];
 if(/carga|puerto|usb|jack|conector/.test(t))dont.push('No introduzcas agujas, metal ni líquidos en conectores.');
 if(/pantalla|tactil|display/.test(t))dont.push('No presiones, dobles ni calientes la pantalla para intentar recuperarla.');
 if(/disco|ssd|hdd|almacenamiento|datos/.test(t))dont.push('Si hay datos importantes, evitá formatear, reinstalar o seguir escribiendo en una unidad con errores.');
 if(/temperatura|calienta|ventilador/.test(t))dont.push('No uses freezer, hielo ni enfriamiento brusco; apagá y dejá enfriar naturalmente.');
 if(c.antecedent==='liquid'||/liquido|humedad/.test(t))dont.push('No uses arroz, secador ni intentes cargar el equipo mojado.');
 if(!dont.length)dont.push('No abras el equipo ni fuerces piezas o conectores si no contás con herramientas y experiencia.');
 return {level,stop,reason,checks,dont};
}
function render(){
 const root=document.querySelector('#diagResultCard .diag-result'); if(!root||root.querySelector('#nf45Depth')||diagState.symptom==='other')return;
 const p=profile();if(!p)return;
 const box=document.createElement('section');box.id='nf45Depth';box.className='nf45-depth';
 box.innerHTML=`<div class="nf45-head"><div><small>RIESGO Y PRÓXIMO PASO</small><h3>Qué hacer ahora</h3></div><span class="nf45-risk ${p.stop?'stop':''}">Prioridad: ${esc(p.level)}</span></div>
 <p class="nf45-reason">${esc(p.reason)}</p>
 <div class="nf45-grid"><article><h4>Podés comprobar sin riesgo</h4>${p.checks.length?'<ul>'+p.checks.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>No hace falta seguir haciendo pruebas caseras. La revisión técnica aportará más información.</p>'}</article>
 <article><h4>Qué evitar</h4><ul>${p.dont.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></article></div>
 ${p.stop?'<div class="nf45-stop"><b>Suspendé nuevas pruebas.</b><span>Si es seguro hacerlo, mantené el equipo apagado y desconectado hasta revisarlo.</span></div>':''}`;
 const a=root.querySelector('#diagAdaptiveResult')||root.querySelector('#diagCrossResult'); if(a)a.insertAdjacentElement('afterend',box); else root.appendChild(box);
}
const card=document.getElementById('diagResultCard');if(card)new MutationObserver(()=>setTimeout(render,30)).observe(card,{childList:true,subtree:true});
})();