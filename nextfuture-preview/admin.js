const SB='https://abcuvgoipnwiltlbcqxa.supabase.co';
const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
const DASH=`${SB}/functions/v1/nextfuture-admin-dashboard`;
const ACTION=`${SB}/functions/v1/nextfuture-admin-action`;
const AUTH=`${SB}/auth/v1/token`;

const labels={requested:'Solicitud',pickup_scheduled:'Retiro programado',awaiting_dropoff:'A recibir',received:'Recibido',diagnosing:'Diagnóstico',awaiting_approval:'Presupuesto',budget_approved:'Aprobado',awaiting_deposit:'Esperando seña',awaiting_part:'Esperando repuesto',repairing:'Reparando',testing:'Pruebas',ready_for_pickup:'Listo para retirar',delivery_scheduled:'Entrega programada',out_for_delivery:'En camino',delivered:'Entregado',budget_rejected:'Presupuesto rechazado',cancelled:'Cancelado'};
const partLabels={searching:'Buscando',awaiting_deposit:'Esperando seña',ordered:'Solicitado',confirmed:'Confirmado',in_transit:'En tránsito',received:'Recibido',delayed:'Demorado',unavailable:'Sin disponibilidad'};
const groups=[
  {key:'entry',label:'Recepción',statuses:['requested','pickup_scheduled','awaiting_dropoff','received']},
  {key:'diagnosis',label:'Diagnóstico',statuses:['diagnosing']},
  {key:'budget',label:'Presupuesto',statuses:['awaiting_approval','budget_approved']},
  {key:'deposit',label:'Esperando seña',statuses:['awaiting_deposit']},
  {key:'part',label:'Repuesto',statuses:['awaiting_part']},
  {key:'repair',label:'Reparación',statuses:['repairing']},
  {key:'test',label:'Pruebas',statuses:['testing']},
  {key:'ready',label:'Listos / Entrega',statuses:['ready_for_pickup','delivery_scheduled','out_for_delivery']},
  {key:'done',label:'Entregados',statuses:['delivered']},
  {key:'other',label:'Pausados',statuses:['budget_rejected','cancelled']}
];
const statusOptions=['requested','pickup_scheduled','awaiting_dropoff','received','diagnosing','awaiting_approval','budget_approved','awaiting_deposit','awaiting_part','repairing','testing','ready_for_pickup','delivery_scheduled','out_for_delivery','delivered','cancelled'];
let orders=[];let selectedCode=null;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
const money=v=>v==null||v===''?'—':new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(v));
const token=()=>sessionStorage.getItem('nf_admin_token')||'';

async function signIn(email,password){
  const r=await fetch(`${AUTH}?grant_type=password`,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({email,password})});
  const d=await r.json();
  if(!r.ok) throw new Error(d.error_description||d.msg||'No pudimos iniciar sesión');
  sessionStorage.setItem('nf_admin_token',d.access_token);
  sessionStorage.setItem('nf_admin_refresh',d.refresh_token||'');
  return d;
}
async function api(url,body){
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY,'Authorization':`Bearer ${token()}`},body:JSON.stringify(body||{})});
  const d=await r.json().catch(()=>({}));
  if(r.status===401){logout();throw new Error('La sesión venció. Volvé a ingresar.');}
  if(!r.ok) throw new Error(d.error||'No se pudo completar la operación');
  return d;
}
async function loadDashboard(){
  $('#syncState').textContent='Sincronizando…';
  const d=await api(DASH,{action:'dashboard'});
  orders=d.orders||[];
  $('#syncState').textContent=`Actualizado ${new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`;
  renderStats();renderFilter();renderBoard();
}
function renderStats(){
  const open=orders.filter(o=>!['delivered','cancelled'].includes(o.order_status)).length;
  const deposits=orders.filter(o=>Number(o.deposit_required||0)>Number(o.deposit_received||0)&&o.budget_status==='approved').length;
  const parts=orders.filter(o=>o.parts?.some(p=>['ordered','confirmed','in_transit','delayed'].includes(p.part_status))).length;
  const repairing=orders.filter(o=>o.order_status==='repairing').length;
  const ready=orders.filter(o=>['ready_for_pickup','delivery_scheduled','out_for_delivery'].includes(o.order_status)).length;
  $('#stats').innerHTML=[['Abiertas',open],['Señas pendientes',deposits],['Repuestos en curso',parts],['Reparando',repairing],['Listos / entrega',ready]].map(([l,v])=>`<div class="stat"><small>${l}</small><b>${v}</b></div>`).join('');
}
function renderFilter(){
  const sel=$('#statusFilter');
  if(sel.options.length>1)return;
  statusOptions.forEach(s=>sel.insertAdjacentHTML('beforeend',`<option value="${s}">${esc(labels[s]||s)}</option>`));
}
function filteredOrders(){
  const q=$('#searchInput').value.trim().toLowerCase();
  const st=$('#statusFilter').value;
  return orders.filter(o=>{
    if(st!=='all'&&o.order_status!==st)return false;
    if(!q)return true;
    const hay=[o.order_code,o.customer?.name,o.customer?.phone,o.brand,o.model,o.locality,o.declared_issue].join(' ').toLowerCase();
    return hay.includes(q);
  });
}
function renderBoard(){
  const data=filteredOrders();
  $('#board').innerHTML=groups.map(g=>{
    const list=data.filter(o=>g.statuses.includes(o.order_status));
    return `<section class="column"><div class="column-head"><h3>${g.label}</h3><span class="count">${list.length}</span></div><div class="cards">${list.length?list.map(card).join(''):'<div class="empty">Sin órdenes</div>'}</div></section>`;
  }).join('');
  document.querySelectorAll('.order-card').forEach(el=>el.addEventListener('click',()=>openOrder(el.dataset.code)));
}
function card(o){
  const missing=Math.max(0,Number(o.deposit_required||0)-Number(o.deposit_received||0));
  const device=[o.brand,o.model].filter(Boolean).join(' ')||o.device_type;
  return `<article class="order-card" data-code="${esc(o.order_code)}"><div class="order-top"><span class="order-code">${esc(o.order_code)}</span><span class="status-pill">${esc(labels[o.order_status]||o.order_status)}</span></div><h4>${esc(device)}</h4><p>${esc(o.customer?.name||'Cliente')} · ${esc(o.locality||o.customer?.locality||'')}</p><p>${esc(o.declared_issue||'')}</p><div class="order-meta"><div><small>Presupuesto</small><b>${money(o.budget_total)}</b></div><div><small>Seña</small><b>${money(o.deposit_received)} / ${money(o.deposit_required)}</b></div></div>${missing>0&&o.budget_status==='approved'?`<div class="deposit-warning">Falta seña: ${money(missing)}</div>`:''}</article>`;
}
function openOrder(code){
  const o=orders.find(x=>x.order_code===code);if(!o)return;
  selectedCode=code;$('#drawerCode').textContent=code;
  const missing=Math.max(0,Number(o.deposit_required||0)-Number(o.deposit_received||0));
  const canPart=o.budget_status==='approved'&&missing<=0;
  $('#drawerBody').innerHTML=`
    <div class="section-box"><h3>Equipo y cliente</h3><div class="detail-grid"><div class="detail"><small>Cliente</small><b>${esc(o.customer?.name||'—')}</b></div><div class="detail"><small>Teléfono</small><span>${esc(o.customer?.phone||'—')}</span></div><div class="detail"><small>Equipo</small><b>${esc([o.brand,o.model].filter(Boolean).join(' ')||o.device_type)}</b></div><div class="detail"><small>Localidad</small><span>${esc(o.locality||o.customer?.locality||'—')}</span></div><div class="detail"><small>Falla declarada</small><span>${esc(o.declared_issue||'—')}</span></div><div class="detail"><small>Diagnóstico</small><span>${esc(o.diagnosis||'Pendiente')}</span></div></div></div>
    <div class="section-box"><h3>Estado de la orden</h3><div class="form-grid"><div><label>Nuevo estado</label><select id="orderStatus">${statusOptions.map(s=>`<option value="${s}" ${s===o.order_status?'selected':''}>${esc(labels[s]||s)}</option>`).join('')}</select></div><div class="full"><label>Nota pública para el cliente</label><textarea id="orderNote" rows="3">${esc(o.public_note||'')}</textarea></div></div><button class="action-btn" id="saveStatus">Guardar estado</button><div id="statusMsg" class="msg"></div></div>
    <div class="section-box"><h3>Presupuesto y pagos</h3><div class="detail-grid"><div class="detail"><small>Total</small><b>${money(o.budget_total)}</b></div><div class="detail"><small>Seña requerida</small><b>${money(o.deposit_required)}</b></div><div class="detail"><small>Seña registrada</small><b>${money(o.deposit_received)}</b></div><div class="detail"><small>Pendiente</small><b>${money(missing)}</b></div></div><div class="form-grid"><div><label>Monto a registrar</label><input id="payAmount" type="number" min="1" step="1" value="${missing>0?missing:''}"></div><div><label>Tipo</label><select id="payType"><option value="deposit">Seña</option><option value="balance">Saldo</option><option value="logistics">Traslado</option></select></div><div><label>Medio</label><select id="payMethod"><option value="transferencia">Transferencia</option><option value="efectivo">Efectivo</option><option value="mercado_pago">Mercado Pago</option><option value="otro">Otro</option></select></div><div><label>Referencia</label><input id="payRef" placeholder="Opcional"></div></div><button class="action-btn" id="recordPayment">Registrar pago</button><div id="payMsg" class="msg"></div></div>
    <div class="section-box"><h3>Repuestos</h3>${o.parts?.length?o.parts.map(partRow).join(''):'<div class="empty">Todavía no hay repuestos asociados.</div>'}<div class="form-grid"><div class="full"><label>Nuevo repuesto</label><input id="partName" placeholder="Ej: Módulo Samsung A54"></div><div><label>Proveedor</label><input id="supplier" placeholder="Interno"></div><div><label>Llegada estimada</label><input id="partEta" type="date"></div><div><label>Costo proveedor</label><input id="supplierCost" type="number" min="0"></div><div><label>Precio al cliente</label><input id="customerPrice" type="number" min="0"></div></div>${canPart?'<button class="action-btn" id="requestPart">Solicitar repuesto</button>':`<div class="notice">Para solicitar un repuesto, el presupuesto debe estar aprobado y la seña requerida cubierta.</div>`}<div id="partMsg" class="msg"></div></div>`;
  bindDrawer(o,canPart);
  $('#drawer').classList.remove('hidden');$('#drawerBackdrop').classList.remove('hidden');
}
function partRow(p){
  return `<div class="part-row"><strong>${esc(p.part_name)}</strong><small>${esc(partLabels[p.part_status]||p.part_status)}${p.eta_at?` · ETA ${new Date(p.eta_at).toLocaleDateString('es-AR')}`:''}</small><div class="part-actions"><select data-part-select="${p.id}">${['searching','awaiting_deposit','ordered','confirmed','in_transit','received','delayed','unavailable'].map(s=>`<option value="${s}" ${s===p.part_status?'selected':''}>${esc(partLabels[s]||s)}</option>`).join('')}</select><button class="ghost" data-part-save="${p.id}">Guardar</button></div></div>`;
}
function bindDrawer(o,canPart){
  $('#saveStatus').onclick=async()=>runAction({action:'set_order_status',order_code:o.order_code,status:$('#orderStatus').value,public_label:labels[$('#orderStatus').value]||$('#orderStatus').value,public_note:$('#orderNote').value.trim()},'#statusMsg');
  $('#recordPayment').onclick=async()=>{const amount=Number($('#payAmount').value||0);if(amount<=0){showMsg('#payMsg','Ingresá un monto válido',true);return;}await runAction({action:'record_payment',order_code:o.order_code,amount,payment_type:$('#payType').value,method:$('#payMethod').value,external_reference:$('#payRef').value.trim()||null},'#payMsg');};
  if(canPart&&$('#requestPart'))$('#requestPart').onclick=async()=>{const name=$('#partName').value.trim();if(!name){showMsg('#partMsg','Indicá el repuesto',true);return;}await runAction({action:'request_part',order_code:o.order_code,part_name:name,supplier_name:$('#supplier').value.trim()||null,eta_at:$('#partEta').value?`${$('#partEta').value}T12:00:00`:null,supplier_cost:$('#supplierCost').value?Number($('#supplierCost').value):null,customer_price:$('#customerPrice').value?Number($('#customerPrice').value):null},'#partMsg');};
  document.querySelectorAll('[data-part-save]').forEach(btn=>btn.onclick=async()=>{const id=btn.dataset.partSave;const select=document.querySelector(`[data-part-select="${id}"]`);await runAction({action:'update_part_status',order_code:o.order_code,part_id:id,status:select.value},'#partMsg');});
}
async function runAction(payload,msgSel){
  showMsg(msgSel,'Guardando…');
  try{await api(ACTION,payload);showMsg(msgSel,'Guardado ✓');await loadDashboard();setTimeout(()=>openOrder(payload.order_code),80);}catch(e){showMsg(msgSel,e.message,true);}
}
function showMsg(sel,text,error=false){const el=$(sel);if(!el)return;el.textContent=text;el.classList.toggle('error',error);}
function closeDrawer(){selectedCode=null;$('#drawer').classList.add('hidden');$('#drawerBackdrop').classList.add('hidden');}
function logout(){sessionStorage.removeItem('nf_admin_token');sessionStorage.removeItem('nf_admin_refresh');$('#appView').classList.add('hidden');$('#loginView').classList.remove('hidden');closeDrawer();}
async function boot(){
  if(!token())return;
  try{$('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');await loadDashboard();}catch(e){logout();showMsg('#loginMsg',e.message,true);}
}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();showMsg('#loginMsg','Ingresando…');try{await signIn($('#loginEmail').value.trim(),$('#loginPassword').value);$('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');$('#loginPassword').value='';await loadDashboard();}catch(err){showMsg('#loginMsg',err.message,true);}});
$('#logoutBtn').onclick=logout;$('#refreshBtn').onclick=()=>loadDashboard().catch(e=>alert(e.message));$('#closeDrawer').onclick=closeDrawer;$('#drawerBackdrop').onclick=closeDrawer;$('#searchInput').addEventListener('input',renderBoard);$('#statusFilter').addEventListener('change',renderBoard);
boot();
