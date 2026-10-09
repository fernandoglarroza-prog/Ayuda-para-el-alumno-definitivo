// Nextfuture V4.6 — agente operativo en panel
(function(){
'use strict';
const AGENT_ADMIN=`${SB}/functions/v1/nextfuture-agent-admin`;
async function agentCall(body,retry=true){
 const r=await fetch(AGENT_ADMIN,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${tok()}`},body:JSON.stringify(body)});
 if(r.status===401&&retry&&rt()){await renew();return agentCall(body,false)}
 const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo consultar el agente');return d;
}
function pct(v){return Math.round(Number(v||0)*100)+'%'}
function dateAge(v){if(!v)return 'Sin fecha';return new Date(v).toLocaleDateString('es-AR')}
function recClass(t){return ['alert','budget','part'].includes(t)?t:''}
async function openAgent(){
 drawer('Agente Nextfuture','<div class="box"><div class="loading">Revisando operación…</div></div>');
 try{
  const d=await agentCall({action:'overview'});
  const open=(d.orders||[]);
  $('#drawerBody').innerHTML=`<div class="box"><span class="kicker">AGENTE OPERATIVO</span><h3>Monitor y recomendaciones</h3><p>Analiza órdenes, catálogo, repuestos y tiempos. Propone acciones; no cambia precios ni compra repuestos.</p><div class="nf46-kpis"><div><small>Órdenes abiertas</small><b>${Number(d.open_orders||0)}</b></div><div><small>Precios base viejos</small><b>${Number(d.stale_price_entries||0)}</b></div><div><small>Refs. de repuestos</small><b>${Number(d.part_references||0)}</b></div></div></div><div class="box"><h3>Analizar una orden</h3><div class="nf46-orders">${open.length?open.map(o=>`<div class="nf46-order"><div><b>${esc(o.order_code)}</b><span>${esc([o.brand,o.model].filter(Boolean).join(' ')||o.device_type)} · ${esc(L[o.order_status]||o.order_status)}</span><span>${esc(o.declared_issue||'')}</span></div><button class="btn tiny" data-agent-order="${esc(o.order_code)}">Analizar</button></div>`).join(''):'<div class="empty">No hay órdenes abiertas.</div>'}</div><div id="nf46Result"></div></div>`;
  bind();
 }catch(e){$('#drawerBody').innerHTML=`<div class="box"><div class="msg error">${esc(e.message)}</div></div>`}
}
function bind(){ $$('[data-agent-order]').forEach(b=>b.onclick=async()=>{const out=$('#nf46Result');out.innerHTML='<div class="nf46-analysis">Analizando orden…</div>';b.disabled=true;try{const d=await agentCall({action:'analyze_order',order_code:b.dataset.agentOrder});renderAnalysis(d)}catch(e){out.innerHTML=`<div class="msg error">${esc(e.message)}</div>`}finally{b.disabled=false}})}
function renderAnalysis(d){
 const a=d.analysis||{},p=a.price_reference,refs=a.part_references||[],recs=a.recommendations||[],mq=a.model_identification||{};
 $('#nf46Result').innerHTML=`<div class="nf46-analysis"><small>ANÁLISIS ${esc(d.order_code||'')}</small><h4>${esc(p?.label||'Revisión orientativa')}</h4><p class="nf46-confidence">Confianza operativa: ${pct(a.confidence)}</p><div class="nf46-ref"><b>Identificación del equipo</b><div>${esc(mq.label||'—')}</div></div><div class="nf46-ref"><b>Rango base</b><div>${p?money(p.min)+' – '+money(p.max):'Sin referencia'}</div><small>${p?('Fuente: '+esc(p.source_label||'sin fuente')+' · verificado '+dateAge(p.last_verified_at)):'Necesita búsqueda/revisión'}</small></div><div class="nf46-ref"><b>Repuesto</b><div>${a.part_key?esc(a.part_key)+' · '+refs.length+' referencia(s) guardada(s)':'No definido para esta ruta'}</div></div><h4>Qué haría ahora</h4>${recs.map(r=>`<div class="nf46-rec ${recClass(r.type)}"><b>${esc(r.title)}</b><div>${esc(r.body||'')}</div></div>`).join('')}<div class="mgmt-note">Estas son recomendaciones. Presupuesto final, compra de repuestos y decisiones irreversibles requieren revisión humana.</div></div>`;
}
document.addEventListener('DOMContentLoaded',()=>document.getElementById('agentBtn')?.addEventListener('click',openAgent));
})();