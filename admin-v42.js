/* Nextfuture V4.2 — notification center */
(function(){
 'use strict';
 const RPC=`${SB}/rest/v1/rpc`;
 const DISPATCH=`${SB}/functions/v1/nextfuture-notify-dispatch`;
 const stateLabel={queued:'Pendiente',waiting_consent:'Sin consentimiento',sending:'Enviando',sent:'Enviado automático',manual_sent:'Enviado manual',failed:'Falló',skipped:'Omitido'};
 const channelLabel={whatsapp:'WhatsApp',email:'Email'};
 async function rpc(name,body={},retry=true){
   const r=await fetch(`${RPC}/${name}`,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${tok()}`},body:JSON.stringify(body)});
   if(r.status===401&&retry&&rt()){await renew();return rpc(name,body,false)}
   const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||d.error||'No se pudo completar');return d;
 }
 async function dispatchEmails(retry=true){
   const r=await fetch(DISPATCH,{method:'POST',headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${tok()}`},body:JSON.stringify({limit:20})});
   if(r.status===401&&retry&&rt()){await renew();return dispatchEmails(false)}
   const d=await r.json().catch(()=>({}));if(!r.ok){const e=new Error(d.error||'No se pudieron procesar los emails');e.payload=d;throw e}return d;
 }
 function waNumber(v){let n=String(v||'').replace(/\D/g,'');if(n.startsWith('0'))n=n.slice(1);if(n.startsWith('549'))return n;if(n.startsWith('54'))return '549'+n.slice(2);return '549'+n;}
 function dt42(v){return v?new Date(v).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'}):'—'}
 function badge(state){return `<span class="nf42-state nf42-${esc(state)}">${esc(stateLabel[state]||state)}</span>`}
 async function openCenter(){
   drawer('Centro de avisos','<div class="box"><div class="loading">Cargando avisos…</div></div>');
   try{
     const d=await rpc('nf_admin_notification_center',{p_limit:200});renderCenter(d);
   }catch(e){$('#drawerBody').innerHTML=`<div class="box"><div class="msg error">${esc(e.message)}</div></div>`}
 }
 function renderCenter(d){
   const c=d.counts||{},items=d.items||[];
   $('#drawerBody').innerHTML=`<div class="box"><span class="kicker">NEXTFUTURE V4.2</span><h3>Notificaciones al cliente</h3><p class="mgmt-note">Cada novedad pública genera un aviso según el consentimiento del cliente. WhatsApp puede abrirse manualmente desde acá; los emails se procesan mediante Resend.</p><div class="nf42-kpis"><div><small>Pendientes</small><b>${Number(c.queued||0)}</b></div><div><small>Sin consentimiento</small><b>${Number(c.waiting_consent||0)}</b></div><div><small>Enviados</small><b>${Number(c.sent||0)+Number(c.manual_sent||0)}</b></div><div><small>Fallidos</small><b>${Number(c.failed||0)}</b></div></div><div class="nf42-actions"><button class="btn" id="nf42DispatchEmail">Procesar emails</button><span id="nf42DispatchMsg" class="nf42-note"></span></div></div><div class="box"><div class="nf42-toolbar"><h3>Historial</h3><select id="nf42Filter"><option value="all">Todos</option><option value="queued">Pendientes</option><option value="waiting_consent">Sin consentimiento</option><option value="sent">Enviados automáticos</option><option value="manual_sent">Enviados manualmente</option><option value="failed">Fallidos</option></select></div><div id="nf42List" class="nf42-list"></div></div>`;
   $('#nf42DispatchEmail').onclick=async()=>{const b=$('#nf42DispatchEmail'),m=$('#nf42DispatchMsg');b.disabled=true;m.textContent='Procesando…';try{const x=await dispatchEmails();m.textContent=x.processed?`Procesados ${x.processed}: ${x.sent} enviados, ${x.failed} fallidos.`:'No hay emails pendientes.';setTimeout(openCenter,900)}catch(e){m.textContent=e.message}finally{b.disabled=false}};
   const render=()=>{const f=$('#nf42Filter').value,rows=items.filter(x=>f==='all'||x.state===f);$('#nf42List').innerHTML=rows.length?rows.map(row).join(''):'<div class="empty">Todavía no hay avisos en esta categoría.</div>';bindRows();};
   $('#nf42Filter').onchange=render;render();
 }
 function row(n){
   const canWa=n.channel==='whatsapp'&&n.state==='queued';
   const wa=canWa?`https://wa.me/${waNumber(n.recipient)}?text=${encodeURIComponent(n.message||'')}`:'';
   return `<article class="nf42-row" data-notification="${n.id}"><div class="nf42-row-head"><div><b>${esc(n.order_code||'')}</b><small>${esc(n.customer_name||'Cliente')} · ${esc(channelLabel[n.channel]||n.channel)} · ${dt42(n.created_at)}</small></div>${badge(n.state)}</div><p>${esc(n.message||'')}</p>${n.last_error?`<div class="nf42-error">${esc(n.last_error)}</div>`:''}<div class="nf42-actions">${canWa?`<a class="btn tiny" target="_blank" rel="noopener" href="${wa}">Abrir WhatsApp</a><button class="btn tiny" data-manual-sent="${n.id}">Marcar enviado</button>`:''}${n.channel==='email'&&n.state==='queued'?'<span class="nf42-note">Email listo para Resend.</span>':''}${n.state==='waiting_consent'?'<span class="nf42-note">No enviar hasta que el cliente lo autorice.</span>':''}</div></article>`;
 }
 function bindRows(){
   $$('[data-manual-sent]').forEach(b=>b.onclick=async()=>{if(!confirm('Marcá como enviado sólo después de haber enviado el mensaje por WhatsApp.'))return;b.disabled=true;try{await rpc('nf_admin_mark_notification_manual_sent',{p_id:b.dataset.manualSent,p_note:'Enviado manualmente desde el Centro de avisos'});toast('Aviso marcado como enviado');openCenter()}catch(e){toast(e.message)}finally{b.disabled=false}});
 }
 document.addEventListener('DOMContentLoaded',()=>document.getElementById('notifyBtn')?.addEventListener('click',openCenter));
})();