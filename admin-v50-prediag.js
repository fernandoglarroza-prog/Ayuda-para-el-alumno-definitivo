// Nextfuture V5.0 — diagnóstico previo visible en la ficha técnica
(function(){'use strict';
const esc2=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const labels={sudden:'De golpe',progressive:'Fue empeorando',intermittent:'Va y viene',event:'Después de un evento',unknown:'No sabe',drop:'Golpe/caída',liquid:'Líquido/humedad',update:'Actualización',charger:'Cargador/accesorio',power:'Corte/sobretensión',repair:'Reparación previa',heat:'Temperatura alta',none:'Sin antecedente'};
function inject(){
 const code=document.getElementById('drawerTitle')?.textContent||'',o=typeof O!=='undefined'?O.find(x=>x.order_code===code):null,r=o?.diagnostic_record,body=document.getElementById('drawerBody');
 if(!body||!o||body.querySelector('#nf50PreDiag'))return;
 const first=body.querySelector('.box');if(!first)return;
 const box=document.createElement('div');box.className='box nf50-prediag';box.id='nf50PreDiag';
 if(!r){box.innerHTML='<h3>Diagnóstico previo del cliente</h3><p class="nf50-muted">Esta orden no tiene un diagnóstico web estructurado asociado.</p>';first.insertAdjacentElement('afterend',box);return}
 const sec=Array.isArray(r.secondary_symptoms)?r.secondary_symptoms:[],hyp=Array.isArray(r.hypotheses)?r.hypotheses:[],answers=r.answers&&typeof r.answers==='object'?Object.entries(r.answers):[];
 box.innerHTML=`<div class="nf50-head"><div><small>INFORMACIÓN PREVIA · NO ES DIAGNÓSTICO TÉCNICO FINAL</small><h3>Diagnóstico realizado por el cliente</h3></div><span>${esc2(r.identification_level||'generic')}</span></div>
 <div class="nf50-grid"><p><b>Síntoma principal</b><span>${esc2(r.primary_symptom_label||r.primary_symptom_key||'—')}</span></p><p><b>Cómo empezó</b><span>${esc2(labels[r.onset]||r.onset||'No indicado')}</span></p><p><b>Antecedente</b><span>${esc2(labels[r.antecedent]||r.antecedent||'No indicado')}</span></p><p><b>Datos importantes</b><span>${r.data_important?'Sí, priorizar conservación':'No indicado'}</span></p></div>
 ${sec.length?'<div class="nf50-block"><b>Otros síntomas</b><div class="nf50-tags">'+sec.map(x=>'<span>'+esc2(x.label||x.key)+'</span>').join('')+'</div></div>':''}
 ${hyp.length?'<div class="nf50-block"><b>Hipótesis orientativas del sistema</b><ul>'+hyp.map(x=>'<li><strong>'+esc2(x.title)+'</strong> — '+esc2(x.reason||'')+'</li>').join('')+'</ul></div>':''}
 ${answers.length?'<details class="nf50-answers"><summary>Ver respuestas del cuestionario ('+answers.length+')</summary><ul>'+answers.map(([k,v])=>'<li><b>'+esc2(r.question_labels?.[k]||k)+':</b> '+esc2(v==='yes'?'Sí':v==='no'?'No':'No sabe')+'</li>').join('')+'</ul></details>':''}
 <p class="nf50-warning">Usar esta información como antecedente. Confirmar físicamente la causa antes de presupuestar o reemplazar piezas.</p>`;
 first.insertAdjacentElement('afterend',box);
}
const drawer=document.getElementById('drawerBody');if(drawer)new MutationObserver(()=>setTimeout(inject,30)).observe(drawer,{childList:true,subtree:false});
})();