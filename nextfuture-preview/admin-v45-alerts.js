/* Nextfuture V4.5 — alertas por demoras */
(function(){
 'use strict';
 const RPC45=`${SB}/rest/v1/rpc`;
 let lastTotal=0;
 async function rpc45(name,body={},retry=true){
   const r=await fetch(`${RPC45}/${name}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${tok()}`},body:JSON.stringify(body)});
   if(r.status===401&&retry&&rt()){await renew();return rpc45(name,body,false)}
   const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||d.error||'No se pudo cargar alertas');return d;
 }
 const dt=v=>v?new Date(v).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'}):'—';
 function setBadge(n){
   lastTotal=Number(n||0);const b=document.getElementById('alertBtn');if(!b)return;
   b.innerHTML=`Alertas${lastTotal?` <span class="nf45-dot">${lastTotal}</span>`:''}`;
 }
 async function refreshBadge(){
   if(!tok())return;
   try{const d=await rpc45('nf_admin_alerts');setBadge(d?.counts?.total||0)}catch(_){}
 }
 function alertRow(a){
   const sev=a.severity==='high'?'Alta':'Media';
   return `<article class="nf45-alert ${esc(a.severity||'medium')}">
    <div class="nf45-head"><div><b>${esc(a.title||'Alerta')}</b><small>${esc(a.order_code||'Sin orden asociada')}</small></div><span class="nf45-sev">${sev}</span></div>
    <p>${esc(a.detail||'')}</p>
    <div class="nf45-meta">${a.due_at?'Vencía '+dt(a.due_at):'Desde '+dt(a.since_at)}</div>
    ${a.order_code?`<div class="row-actions"><button class="btn tiny" data-nf45-order="${esc(a.order_code)}">Abrir reparación</button></div>`:''}
   </article>`;
 }
 async function openAlerts(){
   drawer('Alertas','<div class="box"><div class="loading">Revisando demoras…</div></div>');
   try{
     const d=await rpc45('nf_admin_alerts'),c=d.counts||{},items=d.items||[];setBadge(c.total||0);
     $('#drawerBody').innerHTML=`<div class="box"><span class="kicker">NEXTFUTURE V4.5</span><h3>Alertas operativas</h3><p class="mgmt-note">Se calculan con los datos reales del panel. No cambian estados automáticamente.</p><div class="nf45-kpis"><div><small>Total</small><b>${Number(c.total||0)}</b></div><div><small>Alta</small><b>${Number(c.high||0)}</b></div><div><small>Media</small><b>${Number(c.medium||0)}</b></div></div></div><div class="box"><div class="nf45-list">${items.length?items.map(alertRow).join(''):'<div class="empty">No hay demoras que requieran atención.</div>'}</div></div>`;
     $$('[data-nf45-order]').forEach(x=>x.onclick=()=>openOrder(x.dataset.nf45Order));
   }catch(e){$('#drawerBody').innerHTML=`<div class="box"><div class="msg error">${esc(e.message)}</div></div>`}
 }
 document.addEventListener('DOMContentLoaded',()=>{
   document.getElementById('alertBtn')?.addEventListener('click',openAlerts);
   document.getElementById('refreshBtn')?.addEventListener('click',()=>setTimeout(refreshBadge,250));
   const app=document.getElementById('appView');
   if(app)new MutationObserver(()=>{if(!app.classList.contains('hidden'))refreshBadge()}).observe(app,{attributes:true,attributeFilter:['class']});
   if(tok())refreshBadge();
 });
 window.NextfutureAlerts={refresh:refreshBadge,open:openAlerts};
})();