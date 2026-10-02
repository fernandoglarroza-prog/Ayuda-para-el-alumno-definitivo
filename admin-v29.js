/* Nextfuture V2.9 operational enhancements layered over V2.8 */
const nf28OpenOrder = openOrder;
openOrder = function(code){
  nf28OpenOrder(code);
  setTimeout(()=>nfEnhanceOrder(code),0);
};

const nf28NewOrder = newOrder;
newOrder = function(){
  nf28NewOrder();
  setTimeout(()=>{
    const firstBox = document.querySelector('#drawerBody .box');
    if(firstBox && !document.querySelector('#privacyNotice')){
      firstBox.insertAdjacentHTML('beforeend','<div id="privacyNotice" class="warning" style="margin-top:12px">Privacidad: no guardes PIN, patrón, contraseña de Windows, Apple ID, Google ni claves bancarias en la ficha. Si necesitás desbloqueo para una prueba, coordiná el dato con el cliente sólo en el momento necesario.</div>');
    }
  },0);
};

function nfEnhanceOrder(code){
  const o = O.find(x=>x.order_code===code);
  if(!o) return;

  const deliveredOption = document.querySelector('#status option[value="delivered"]');
  if(deliveredOption) deliveredOption.remove();

  const methodField = document.querySelector('#method')?.closest('.field');
  if(methodField && !document.querySelector('#payType')){
    const defaultType = Number(o.deposit_received||0) < Number(o.deposit_required||0) ? 'deposit' : 'balance';
    methodField.insertAdjacentHTML('beforebegin',`<div class="field"><label>Tipo de pago</label><select id="payType"><option value="deposit" ${defaultType==='deposit'?'selected':''}>Seña</option><option value="balance" ${defaultType==='balance'?'selected':''}>Saldo</option><option value="logistics">Traslado</option><option value="refund">Devolución</option></select></div>`);
  }
  const payBtn = document.querySelector('#savePay');
  if(payBtn){
    payBtn.onclick=()=>{
      const amount=Number(document.querySelector('#pay')?.value||0);
      if(!amount || amount<=0){ msg('#stateMsg','Ingresá un monto válido.',true); return; }
      run({action:'record_payment',order_code:code,amount,payment_type:document.querySelector('#payType')?.value||'deposit',method:document.querySelector('#method')?.value||'manual',idempotency_key:crypto.randomUUID()},'#stateMsg',code);
    };
  }

  const drawerBody=document.querySelector('#drawerBody');
  if(!drawerBody || document.querySelector('#nfReceiptBox')) return;
  const due=Number(o.budget_total||0)+Number(o.logistics_fee||0);
  const paid=Number(o.total_paid||0);
  const balance=Math.max(0,Number(o.balance_due??(due-paid)));
  const closed=o.order_status==='delivered';
  const ack=o.receipt_acknowledged_at ? `Confirmado ${new Date(o.receipt_acknowledged_at).toLocaleString('es-AR')}` : 'Sin confirmación registrada';

  drawerBody.insertAdjacentHTML('beforeend',`
    <div class="box" id="nfReceiptBox">
      <h3>Comprobante de recepción</h3>
      <div class="details">
        <div class="detail"><small>Lectura / recepción</small><b>${esc(ack)}</b></div>
        <div class="detail"><small>Versión de condiciones</small><span>${esc(o.receipt_terms_version||'2026-09-v1')}</span></div>
      </div>
      <div class="field" style="margin-top:12px"><label>Nota visible en el comprobante</label><textarea id="receiptNote" rows="3" placeholder="Ej: equipo recibido con funda y cargador; pantalla ya fisurada...">${esc(o.receipt_note||'')}</textarea></div>
      <div class="row-actions"><button class="btn" id="saveReceiptNote">Guardar nota</button><a class="btn" target="_blank" href="${rurl(o)}">Abrir / imprimir comprobante</a></div>
      <div id="receiptMsg" class="msg"></div>
    </div>
    <div class="box" id="nfDeliveryBox">
      <h3>Cierre y entrega</h3>
      <div class="details">
        <div class="detail"><small>Total a cobrar</small><b>${money(due)}</b></div>
        <div class="detail"><small>Total registrado</small><b>${money(paid)}</b></div>
        <div class="detail"><small>Saldo</small><b>${money(balance)}</b></div>
        <div class="detail"><small>Estado</small><span>${closed?'Entregado':'Pendiente de cierre'}</span></div>
      </div>
      ${closed ? `<div class="warning" style="margin-top:12px">Entregado a ${esc(o.delivery_confirmed_name||'cliente')} ${o.delivery_confirmed_at?'el '+new Date(o.delivery_confirmed_at).toLocaleString('es-AR'):''}.${o.delivery_note?' '+esc(o.delivery_note):''}</div>` : `
      <div class="form-grid" style="margin-top:12px">
        <div class="field"><label>Entregado a</label><input id="deliveredTo" value="${esc(o.customer?.name||'')}"></div>
        <div class="field full"><label>Nota de entrega</label><textarea id="deliveryNote" rows="2" placeholder="Ej: retira titular, equipo probado en presencia del cliente"></textarea></div>
      </div>
      ${balance>0?`<div class="warning" style="margin-top:12px">Antes de cerrar, registrá el saldo pendiente de ${money(balance)}.</div>`:'<div class="warning" style="margin-top:12px">Saldo cubierto. La orden puede cerrarse cuando entregues el equipo.</div>'}
      <div class="row-actions"><button class="btn primary" id="completeDelivery">Cerrar y entregar</button></div>`}
      <div id="deliveryMsg" class="msg"></div>
    </div>
  `);

  document.querySelector('#saveReceiptNote')?.addEventListener('click',()=>run({action:'update_order_details',order_code:code,receipt_note:document.querySelector('#receiptNote')?.value||''},'#receiptMsg',code));
  document.querySelector('#completeDelivery')?.addEventListener('click',()=>{
    if(!confirm('¿Confirmás que el equipo fue entregado al cliente?')) return;
    run({action:'complete_delivery',order_code:code,delivered_to:document.querySelector('#deliveredTo')?.value||'',delivery_note:document.querySelector('#deliveryNote')?.value||''},'#deliveryMsg',code);
  });
}
