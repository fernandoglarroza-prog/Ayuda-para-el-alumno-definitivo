/* Nextfuture V3.0 business management */
let NF_CUSTOMERS=[],NF_INVENTORY=[],NF_EXPENSES=[],NF_MOVES=[],NF_BUSINESS={};
const nfV29OpenOrder=openOrder;
openOrder=function(code){nfV29OpenOrder(code);setTimeout(()=>nfProfitBox(code),30)};

load=async function(){
 if(!tok())return;
 try{
  const d=await call(DASH);
  O=d.orders||[];NF_CUSTOMERS=d.customers||[];NF_INVENTORY=d.inventory||[];NF_EXPENSES=d.expenses||[];NF_MOVES=d.inventory_movements||[];NF_BUSINESS=d.business||{};
  $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');$('#syncState').textContent=`Actualizado ${new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}`;
  render();nfRenderBusinessStats();
 }catch(e){logout();msg('#loginMsg',e.message,true)}
};

function nfRenderBusinessStats(){
 const s=$('#stats');if(!s)return;
 const cards=[['Caja hoy',money(NF_BUSINESS.today_net||0)],['Caja mes',money(NF_BUSINESS.month_net||0)],['Stock bajo',String(NF_BUSINESS.low_stock_count||0)]];
 cards.forEach(([l,v])=>s.insertAdjacentHTML('beforeend',`<div class="stat"><small>${esc(l)}</small><b>${esc(v)}</b></div>`));
}

function nfProfitBox(code){
 const o=O.find(x=>x.order_code===code),body=$('#drawerBody');if(!o||!body||$('#nfProfitBox'))return;
 const cost=Number(o.estimated_cost||0),paid=Number(o.total_paid||0),profit=Number(o.estimated_profit??(paid-cost));
 body.insertAdjacentHTML('beforeend',`<div class="box profit-box" id="nfProfitBox"><h3>Resultado de esta reparación</h3><div class="profit-grid"><div><small>Cobrado</small><b>${money(paid)}</b></div><div><small>Costos cargados</small><b>${money(cost)}</b></div><div><small>Resultado estimado</small><b class="${profit>=0?'cash-positive':'cash-negative'}">${money(profit)}</b></div></div><p class="mgmt-note" style="margin-top:10px">El resultado usa pagos confirmados, costo de repuestos pedidos, stock consumido y gastos asociados. No incluye gastos generales que no estén vinculados a esta orden.</p></div>`);
}

function nfOrderCodeForId(id){return O.find(o=>o.id===id)?.order_code||''}
function nfOpenManagement(){
 const b=NF_BUSINESS||{},low=NF_INVENTORY.filter(i=>Number(i.qty_on_hand)<=Number(i.min_stock));
 drawer('Gestión del negocio',`
 <div class="box"><h3>Resumen</h3><div class="mgmt-summary"><div class="mgmt-kpi"><small>Ingresos hoy</small><b>${money(b.today_income||0)}</b></div><div class="mgmt-kpi"><small>Gastos hoy</small><b>${money(b.today_expenses||0)}</b></div><div class="mgmt-kpi"><small>Neto hoy</small><b class="${Number(b.today_net||0)>=0?'cash-positive':'cash-negative'}">${money(b.today_net||0)}</b></div><div class="mgmt-kpi"><small>Ingresos mes</small><b>${money(b.month_income||0)}</b></div><div class="mgmt-kpi"><small>Gastos mes</small><b>${money(b.month_expenses||0)}</b></div><div class="mgmt-kpi"><small>Neto mes</small><b class="${Number(b.month_net||0)>=0?'cash-positive':'cash-negative'}">${money(b.month_net||0)}</b></div></div></div>
 <div class="mgmt-grid">
  <div class="box"><h3>Caja · registrar gasto</h3><div class="form-grid"><div class="field"><label>Monto</label><input id="exAmount" type="number" min="0" step="0.01"></div><div class="field"><label>Categoría</label><select id="exCategory"><option value="part">Repuesto</option><option value="logistics">Traslado</option><option value="tool">Herramienta</option><option value="consumable">Consumible</option><option value="service">Servicio</option><option value="other">Otro</option></select></div><div class="field"><label>Medio</label><select id="exMethod"><option value="cash">Efectivo</option><option value="transferencia">Transferencia</option><option value="mercado_pago">Mercado Pago</option><option value="tarjeta">Tarjeta</option><option value="otro">Otro</option></select></div><div class="field"><label>Orden asociada</label><input id="exOrder" placeholder="Opcional · NF-..."></div><div class="field"><label>Proveedor</label><input id="exSupplier"></div><div class="field full"><label>Detalle</label><input id="exNote" placeholder="Qué se pagó"></div></div><div class="row-actions"><button class="btn primary" id="saveExpense">Guardar gasto</button></div><div id="expenseMsg" class="msg"></div></div>
  <div class="box"><h3>Stock · nuevo artículo</h3><div class="form-grid"><div class="field"><label>Nombre</label><input id="stName" placeholder="Ej: Batería Moto G52"></div><div class="field"><label>SKU</label><input id="stSku" placeholder="Opcional"></div><div class="field"><label>Cantidad inicial</label><input id="stQty" type="number" min="0" value="0"></div><div class="field"><label>Stock mínimo</label><input id="stMin" type="number" min="0" value="1"></div><div class="field"><label>Costo unitario</label><input id="stCost" type="number" min="0"></div><div class="field"><label>Precio orientativo</label><input id="stSale" type="number" min="0"></div><div class="field full"><label>Compatibilidad</label><input id="stCompat" placeholder="Modelos compatibles"></div><div class="field full"><label>Proveedor</label><input id="stSupplier"></div></div><div class="row-actions"><button class="btn primary" id="createStock">Agregar al stock</button></div><div id="stockCreateMsg" class="msg"></div></div>
 </div>
 <div class="box"><h3>Stock actual ${low.length?`· ${low.length} con stock bajo`:''}</h3><div id="stockAction"></div><div class="mgmt-list">${NF_INVENTORY.length?NF_INVENTORY.map(i=>`<div class="mgmt-row ${Number(i.qty_on_hand)<=Number(i.min_stock)?'low-stock':''}"><div><strong>${esc(i.name)}</strong><small>${i.sku?esc(i.sku)+' · ':''}Stock ${esc(i.qty_on_hand)} · mínimo ${esc(i.min_stock)} · costo ${money(i.unit_cost)}</small>${i.compatible_with?`<small>${esc(i.compatible_with)}</small>`:''}</div><div class="mgmt-actions"><button class="btn tiny" data-stock-act="purchase" data-item="${i.id}">Entrada</button><button class="btn tiny" data-stock-act="use" data-item="${i.id}">Usar</button><button class="btn tiny" data-stock-act="adjustment_out" data-item="${i.id}">Ajustar −</button></div></div>`).join(''):'<div class="empty">Todavía no cargaste stock.</div>'}</div></div>
 <div class="mgmt-grid">
  <div class="box"><h3>Clientes</h3><div class="mgmt-list">${NF_CUSTOMERS.length?NF_CUSTOMERS.slice(0,30).map(c=>`<div class="mgmt-row"><div><strong>${esc(c.name)}</strong><small>${esc(c.phone)} · ${c.order_count} reparación/es · cobrado ${money(c.total_paid)}</small></div><button class="btn tiny" data-customer-phone="${esc(c.phone)}">Ver trabajos</button></div>`).join(''):'<div class="empty">Todavía no hay clientes.</div>'}</div></div>
  <div class="box"><h3>Últimos gastos</h3><div class="mgmt-list">${NF_EXPENSES.length?NF_EXPENSES.slice(0,20).map(e=>`<div class="mgmt-row"><div><strong>${money(e.amount)} · ${esc(e.category)}</strong><small>${esc(e.supplier_name||e.note||'Sin detalle')}${e.order_id?` · ${esc(nfOrderCodeForId(e.order_id))}`:''}</small></div><small>${new Date(e.incurred_at||e.created_at).toLocaleDateString('es-AR')}</small></div>`).join(''):'<div class="empty">No hay gastos cargados.</div>'}</div></div>
 </div>`);
 nfBindManagement();
}

function nfBindManagement(){
 $('#saveExpense')?.addEventListener('click',async()=>{const amount=Number($('#exAmount').value||0);if(amount<=0)return msg('#expenseMsg','Ingresá un monto válido.',true);msg('#expenseMsg','Guardando…');try{await call(ACTION,{action:'record_expense',amount,category:$('#exCategory').value,method:$('#exMethod').value,order_code:$('#exOrder').value.trim()||null,supplier_name:$('#exSupplier').value.trim()||null,note:$('#exNote').value.trim()||null,idempotency_key:crypto.randomUUID()});await load();nfOpenManagement();toast('Gasto registrado')}catch(e){msg('#expenseMsg',e.message,true)}});
 $('#createStock')?.addEventListener('click',async()=>{const name=$('#stName').value.trim();if(!name)return msg('#stockCreateMsg','Indicá el nombre.',true);msg('#stockCreateMsg','Guardando…');try{await call(ACTION,{action:'create_inventory_item',name,sku:$('#stSku').value.trim()||null,initial_qty:Number($('#stQty').value||0),min_stock:Number($('#stMin').value||0),unit_cost:$('#stCost').value===''?null:Number($('#stCost').value),sale_price:$('#stSale').value===''?null:Number($('#stSale').value),compatible_with:$('#stCompat').value.trim()||null,supplier_name:$('#stSupplier').value.trim()||null,idempotency_key:crypto.randomUUID()});await load();nfOpenManagement();toast('Artículo agregado')}catch(e){msg('#stockCreateMsg',e.message,true)}});
 $$('[data-stock-act]').forEach(btn=>btn.addEventListener('click',()=>nfStockMovementForm(btn.dataset.item,btn.dataset.stockAct)));
 $$('[data-customer-phone]').forEach(btn=>btn.addEventListener('click',()=>{closeD();$('#searchInput').value=btn.dataset.customerPhone||'';renderBoard();window.scrollTo({top:0,behavior:'smooth'})}));
}

function nfStockMovementForm(itemId,type){
 const item=NF_INVENTORY.find(i=>i.id===itemId);if(!item)return;const label=type==='purchase'?'Entrada / compra':type==='use'?'Usar en reparación':'Ajustar salida';
 $('#stockAction').innerHTML=`<div class="stock-form"><h4>${esc(label)} · ${esc(item.name)}</h4><div class="form-grid"><div class="field"><label>Cantidad</label><input id="mvQty" type="number" min="0.01" step="0.01" value="1"></div><div class="field"><label>Costo unitario</label><input id="mvCost" type="number" min="0" value="${item.unit_cost??''}"></div>${type==='use'?'<div class="field"><label>Orden</label><input id="mvOrder" placeholder="NF-... (recomendado)"></div>':''}<div class="field full"><label>Nota</label><input id="mvNote" placeholder="Detalle opcional"></div></div><div class="row-actions"><button class="btn primary" id="saveMovement">Guardar movimiento</button></div><div id="movementMsg" class="msg"></div>${type==='purchase'?'<p class="mgmt-note">Si esta entrada fue una compra, cargá también el gasto en Caja para que el flujo de dinero quede correcto.</p>':''}</div>`;
 $('#saveMovement').onclick=async()=>{const qty=Number($('#mvQty').value||0);if(qty<=0)return msg('#movementMsg','Cantidad inválida.',true);msg('#movementMsg','Guardando…');try{await call(ACTION,{action:'inventory_movement',item_id:itemId,movement_type:type,quantity:qty,unit_cost:$('#mvCost').value===''?null:Number($('#mvCost').value),order_code:type==='use'?($('#mvOrder').value.trim()||null):null,note:$('#mvNote').value.trim()||null,idempotency_key:crypto.randomUUID()});await load();nfOpenManagement();toast('Stock actualizado')}catch(e){msg('#movementMsg',e.message,true)}};
}

$('#mgmtBtn')?.addEventListener('click',nfOpenManagement);
$('#refreshBtn').onclick=load;
load();
