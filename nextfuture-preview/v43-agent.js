// Nextfuture V4.3 — agente operativo sin costo de modelo
(function(){
'use strict';
const URL='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-agent-precheck';
const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
const money=v=>v==null?'A confirmar':new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(v));
function payload(){
  try{
    return {
      device_type:diagState?.device||'',
      symptom_key:diagState?.symptom||'',
      brand:document.getElementById('diagBrand')?.value.trim()||'',
      model:document.getElementById('diagModel')?.value.trim()||''
    };
  }catch{return {device_type:'',symptom_key:'',brand:'',model:''}}
}
async function ask(){
 const p=payload();if(!p.device_type||!p.symptom_key)throw new Error('Primero completá un diagnóstico previo.');
 const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify(p)});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No pude analizar el caso.');return d;
}
function summary(d){
 const e=d.estimate||{}, pr=d.price_reference||{}, part=d.part_search||{};
 return '<div class="nf43-agent-card"><small>AGENTE NEXTFUTURE · PREANÁLISIS</small><h4>'+escapeHtml(d.orientation||'Orientación técnica')+'</h4>'+
 '<div class="nf43-agent-grid"><div class="nf43-agent-metric"><span>Rango orientativo</span><b>'+money(e.min)+' – '+money(e.max)+'</b></div>'+
 '<div class="nf43-agent-metric"><span>Referencia de precio</span><b>'+(pr.stale?'Necesita actualizar':'Vigente')+'</b></div>'+
 '<div class="nf43-agent-metric"><span>Revisión física</span><b>'+(d.requires_inspection?'Sí':'No necesariamente')+'</b></div>'+
 '<div class="nf43-agent-metric"><span>Repuesto específico</span><b>'+(part.needed?(part.references?.length?part.references.length+' referencia(s)':'Buscar referencia'):'No definido')+'</b></div></div>'+
 (pr.age_days!=null?'<div class="nf43-agent-note">La referencia base fue verificada hace '+pr.age_days+' día(s). El valor final depende del modelo exacto, disponibilidad y estado real del equipo.</div>':'')+
 (part.needed&&!part.references?.length?'<div class="nf43-agent-alert">Para afinar este presupuesto el agente necesita buscar el repuesto concreto para '+escapeHtml([d.brand,d.model].filter(Boolean).join(' ')||'este modelo')+'.</div>':'')+
 '<div class="nf43-agent-note">El agente no compra repuestos ni confirma un precio final: la autorización técnica y comercial sigue siendo de Nextfuture.</div></div>';
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function attach(){
 const root=document.querySelector('#diagResultCard .diag-result');if(!root)return;
 root.querySelector('.nf43-agent-card')?.remove();
 const holder=document.createElement('div');holder.className='nf43-agent-card';holder.innerHTML='<small>AGENTE NEXTFUTURE</small><h4>Analizando diagnóstico y precio orientativo…</h4>';
 root.insertBefore(holder,root.querySelector('.diag-disclaimer')||null);
 try{const d=await ask();holder.outerHTML=summary(d)}catch(e){holder.innerHTML='<small>AGENTE NEXTFUTURE</small><h4>No pude completar el preanálisis</h4><div class="nf43-agent-note">'+escapeHtml(e.message)+'</div>'}
}
function panel(){
 if(document.getElementById('nf43Launch'))return;
 const b=document.createElement('button');b.id='nf43Launch';b.className='nf43-launch';b.textContent='Agente Nextfuture';
 const p=document.createElement('section');p.id='nf43Panel';p.className='nf43-panel hidden';
 p.innerHTML='<div class="nf43-panel-head"><div><small>AGENTE NEXTFUTURE</small><h3>Asistente técnico</h3></div><button id="nf43Close" aria-label="Cerrar">×</button></div><p>Analiza el diagnóstico actual, precios base y necesidad de repuestos. La capa conversacional de IA se habilitará sobre este mismo núcleo.</p><div class="nf43-actions"><button data-nf43="analyze"><b>Analizar mi diagnóstico</b><br><small>Causas, rango y revisión física.</small></button><button data-nf43="price"><b>¿Cuánto puede costar?</b><br><small>Consulta la referencia de precio actual.</small></button><button data-nf43="part"><b>¿Hace falta repuesto?</b><br><small>Detecta si hay que buscar una pieza específica.</small></button></div><div id="nf43Answer"></div>';
 document.body.append(b,p);b.onclick=()=>p.classList.toggle('hidden');p.querySelector('#nf43Close').onclick=()=>p.classList.add('hidden');
 p.querySelectorAll('[data-nf43]').forEach(x=>x.onclick=async()=>{const out=p.querySelector('#nf43Answer');out.innerHTML='<div class="nf43-answer">Analizando…</div>';try{const d=await ask(),k=x.dataset.nf43;if(k==='price')out.innerHTML='<div class="nf43-answer"><b>Rango orientativo:</b> '+money(d.estimate?.min)+' – '+money(d.estimate?.max)+'. '+(d.price_reference?.stale?'La referencia necesita actualización.':'La referencia base está vigente.')+'</div>';else if(k==='part')out.innerHTML='<div class="nf43-answer">'+(d.part_search?.needed?(d.part_search.references?.length?'Encontré '+d.part_search.references.length+' referencia(s) guardadas de repuesto.':'Este caso necesita buscar el repuesto exacto para afinar el presupuesto.'):'No aparece un repuesto específico obligatorio en esta orientación.')+'</div>';else out.innerHTML='<div class="nf43-answer">'+escapeHtml(d.orientation||'Orientación')+'. Rango: '+money(d.estimate?.min)+' – '+money(d.estimate?.max)+'. '+(d.requires_inspection?'Requiere revisión física.':'Puede orientarse antes de la revisión física.')+'</div>'}catch(e){out.innerHTML='<div class="nf43-answer">'+escapeHtml(e.message)+'</div>'}});
}
document.addEventListener('DOMContentLoaded',()=>{panel();document.getElementById('diagCalculate')?.addEventListener('click',()=>setTimeout(attach,80));});
})();