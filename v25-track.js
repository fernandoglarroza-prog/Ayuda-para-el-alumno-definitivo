const TRACK='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-track';
const RESP='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-budget-response';
const labels={requested:'Solicitud recibida',pickup_scheduled:'Retiro programado',awaiting_dropoff:'Esperando recepción',received:'Equipo recibido',diagnosing:'En diagnóstico',awaiting_approval:'Esperando aprobación',budget_approved:'Presupuesto aprobado',awaiting_deposit:'Esperando seña',awaiting_part:'Esperando repuesto',repairing:'En reparación',testing:'Pruebas finales',ready_for_pickup:'Listo para retirar',delivery_scheduled:'Entrega programada',out_for_delivery:'En camino',delivered:'Entregado',budget_rejected:'Presupuesto rechazado',cancelled:'Cancelado'};
const partLabels={searching:'Buscando disponibilidad',awaiting_deposit:'Esperando seña',ordered:'Repuesto solicitado',confirmed:'Pedido confirmado',in_transit:'En tránsito',received:'Repuesto recibido',delayed:'Demorado',unavailable:'Sin disponibilidad'};
const flow=['requested','received','diagnosing','awaiting_approval','budget_approved','awaiting_deposit','awaiting_part','repairing','testing','ready_for_pickup','delivery_scheduled','out_for_delivery','delivered'];
let creds={code:'',phone:''};
const esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
const money=v=>v==null||v===''?'—':new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(v));
const date=v=>v?new Date(v).toLocaleDateString('es-AR'):'—';
const outstanding=o=>Math.max(0,Number(o.deposit_required||0)-Number(o.deposit_received||0));
function whatsappDeposit(o){
  const pending=outstanding(o);
  const text=`Hola Nextfuture, quiero enviar el comprobante de la seña de mi reparación ${o.order_code}. Importe pendiente: ${money(pending)}.`;
  return `https://wa.me/5491130112951?text=${encodeURIComponent(text)}`;
}
function render(data){
  const o=data.order||{},cur=o.order_status||'requested';
  let idx=flow.indexOf(cur); if(idx<0) idx=0;
  const steps=flow.map((s,i)=>`<div class="timeline-step"><div class="dot">${i<idx?'✓':i===idx?'•':''}</div><div><b>${esc(labels[s]||s)}</b><p>${i<idx?'Etapa completada.':i===idx?'Estado actual.':'Pendiente.'}</p></div></div>`).join('');
  const parts=(data.parts||[]).map(p=>`<div class="part"><div class="part-head"><div><strong>${esc(p.part_name)}</strong><div class="part-note">${esc(p.public_note||'Seguimiento del repuesto asociado a la reparación.')}</div></div><span class="part-tag">${esc(partLabels[p.part_status]||p.part_status)}</span></div>${p.eta_at?`<div class="part-note"><b>Llegada estimada:</b> ${date(p.eta_at)}</div>`:''}</div>`).join('');
  let budget='';
  if(o.budget_status==='sent'){
    budget=`<div class="budget-box"><h4>Presupuesto listo para decidir</h4><div>Total: <b>${money(o.budget_total)}</b></div><div class="hint">Seña requerida: ${money(o.deposit_required)}</div><div class="actions"><button class="btn btn-primary" data-budget-action="accept">Aceptar presupuesto</button><button class="btn btn-danger" data-budget-action="reject">Rechazar</button></div><div id="budgetMsg" class="hint"></div></div>`;
  } else if(o.budget_status==='approved'){
    budget=`<div class="budget-box"><h4>Presupuesto aceptado ✓</h4><div class="hint">El trabajo quedó autorizado por el cliente.</div></div>`;
  } else if(o.budget_status==='rejected'){
    budget=`<div class="budget-box"><h4>Presupuesto rechazado</h4><div class="hint">La reparación quedó detenida. Podés comunicarte por WhatsApp si querés revisar alternativas.</div></div>`;
  }
  let payment='';
  if(o.budget_status==='approved' && Number(o.deposit_required||0)>0){
    const pending=outstanding(o);
    if(pending>0){
      payment=`<div class="payment-summary"><h4>Seña pendiente</h4><div class="payment-amount">${money(pending)}</div><p>La seña permite confirmar la compra del repuesto o reservar el trabajo. El pago no se marca como recibido hasta que Nextfuture lo verifica.</p><div class="actions"><a class="btn btn-primary" href="${whatsappDeposit(o)}" target="_blank" rel="noopener">Enviar comprobante por WhatsApp</a></div></div>`;
    } else {
      payment=`<div class="payment-summary"><div class="payment-ok">Seña registrada</div><p>La seña requerida ya fue recibida. El trabajo puede avanzar al siguiente paso.</p></div>`;
    }
  }
  document.getElementById('result').innerHTML=`<div class="status-card"><div class="status-top"><div><small>${esc(o.order_code)}</small><h3>${esc(((o.brand||'')+' '+(o.model||'')).trim()||'Equipo en reparación')}</h3><div class="hint">${esc(o.declared_issue||'Reparación en seguimiento')}</div></div><span class="pill">${esc(labels[cur]||cur)}</span></div><div class="meta"><div class="meta-cell"><small>Presupuesto</small><b>${money(o.budget_total)}</b></div><div class="meta-cell"><small>Seña</small><b>${money(o.deposit_received)} / ${money(o.deposit_required)}</b></div><div class="meta-cell"><small>Modalidad</small><b>${esc(o.service_mode||'Coordinada')}</b></div></div>${o.public_note?`<div class="note">${esc(o.public_note)}</div>`:''}${budget}${payment}${parts}<div class="timeline">${steps}</div></div>`;
  document.querySelectorAll('[data-budget-action]').forEach(btn=>btn.addEventListener('click',()=>answerBudget(btn.dataset.budgetAction)));
}
async function track(){
  const code=document.getElementById('code').value.trim().toUpperCase();
  const phone=document.getElementById('phone').value.replace(/\D/g,'').slice(-4);
  const out=document.getElementById('result');
  if(!code||phone.length!==4){out.innerHTML='<div class="error">Ingresá el código de reparación y los últimos 4 dígitos del teléfono.</div>';return;}
  creds={code,phone}; out.innerHTML='<div class="loading">Consultando el estado de tu reparación…</div>';
  try{
    const r=await fetch(TRACK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,phone_last4:phone})});
    const d=await r.json(); if(!r.ok) throw new Error(d.error||'No se pudo consultar'); render(d);
  }catch(e){out.innerHTML=`<div class="error">${esc(e.message||'No pudimos consultar la reparación.')}</div>`;}
}
async function answerBudget(action){
  if(action==='reject'&&!confirm('¿Querés rechazar este presupuesto?')) return;
  const msg=document.getElementById('budgetMsg'); if(msg) msg.textContent='Registrando respuesta…';
  try{
    const r=await fetch(RESP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:creds.code,phone_last4:creds.phone,action})});
    const d=await r.json(); if(!r.ok) throw new Error(d.error||'No se pudo registrar la respuesta');
    if(msg) msg.textContent=d.message||'Respuesta registrada.'; setTimeout(track,450);
  }catch(e){if(msg) msg.textContent=e.message||'No pudimos registrar la respuesta.';}
}
document.getElementById('track').addEventListener('click',track);
document.getElementById('phone').addEventListener('keydown',e=>{if(e.key==='Enter')track();});
