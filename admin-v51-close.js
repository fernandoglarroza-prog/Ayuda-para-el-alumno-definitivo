/* Nextfuture V5.1 — cierre técnico, pruebas y entrega */
(function(){'use strict';
const e=s=>typeof esc==='function'?esc(s):String(s??'');
const DEVTEST={
 phone:['Enciende y reinicia correctamente','Carga y conector probados','Pantalla y táctil probados','Audio, micrófono y cámaras probados','Wi‑Fi / red básica probada'],
 tablet:['Enciende y reinicia correctamente','Carga y conector probados','Pantalla y táctil probados','Audio y cámaras probados','Wi‑Fi probado'],
 notebook:['Arranque y apagado correctos','Cargador y batería comprobados','Pantalla, teclado y touchpad probados','Wi‑Fi, audio, cámara y puertos probados','Temperaturas verificadas bajo uso'],
 pc:['Arranque y apagado correctos','Video y periféricos básicos probados','Red y audio probados','Almacenamiento / memoria comprobados','Temperaturas y estabilidad verificadas']
};
function code(){return document.getElementById('drawerTitle')?.textContent||''}
function current(){return typeof O!=='undefined'?O.find(x=>x.order_code===code()):null}
function inject(){
 const body=document.getElementById('drawerBody'),o=current();if(!body||!o||body.querySelector('#nf51Close'))return;
 if(['cancelled','budget_rejected'].includes(o.order_status))return;
 const tests=DEVTEST[o.device_type]||DEVTEST.phone,delivered=o.order_status==='delivered';
 const box=document.createElement('div');box.className='box nf51-close';box.id='nf51Close';
 box.innerHTML=`<div class="nf51-head"><div><small>CIERRE TÉCNICO</small><h3>Pruebas finales y entrega</h3></div><span>${delivered?'Orden entregada':'Pendiente de cierre'}</span></div>
 <p class="nf51-note">Marcá sólo pruebas realmente realizadas. El checklist no reemplaza una medición técnica cuando la reparación la requiere.</p>
 <div class="nf51-tests">${tests.map((x,i)=>`<label><input type="checkbox" data-nf51-test="${i}" ${delivered?'checked disabled':''}><span>${e(x)}</span></label>`).join('')}</div>
 <div class="form-grid nf51-delivery"><div class="field"><label>Entregado a</label><input id="nf51Who" value="${e(o.customer?.name||'')}" ${delivered?'disabled':''}></div><div class="field full"><label>Observaciones de entrega / prueba</label><textarea id="nf51Note" ${delivered?'disabled':''} placeholder="Ej: pruebas realizadas, aclaraciones al cliente, cuidado recomendado.">${e(o.delivery_note||'')}</textarea></div></div>
 <div class="nf51-balance"><span>Presupuesto: <b>${money(o.budget_total)}</b></span><span>Pagado: <b>${money(o.total_paid||0)}</b></span><span>Saldo: <b>${money(o.balance_due||0)}</b></span></div>
 <div class="row-actions">${delivered?'<b class="nf51-ok">✓ Orden finalizada</b>':`<button class="btn" id="nf51Testing">Pasar a pruebas</button><button class="btn primary" id="nf51Ready">Marcar listo</button><button class="btn primary" id="nf51Deliver">Cerrar y entregar</button>`}</div><div id="nf51Msg" class="msg"></div>`;
 body.appendChild(box);if(delivered)return;
 const all=()=>[...box.querySelectorAll('[data-nf51-test]')].every(x=>x.checked);
 document.getElementById('nf51Testing').onclick=()=>run({action:'set_order_status',order_code:o.order_code,status:'testing',public_label:'Pruebas finales',public_note:'La reparación está en etapa de pruebas finales.'},'#nf51Msg',o.order_code);
 document.getElementById('nf51Ready').onclick=()=>{if(!all())return msg('#nf51Msg','Completá las pruebas finales antes de marcar el equipo como listo.',true);run({action:'set_order_status',order_code:o.order_code,status:'ready_for_pickup',public_label:'Equipo listo',public_note:'Las pruebas finales fueron completadas. El equipo está listo para coordinar la entrega.'},'#nf51Msg',o.order_code)};
 document.getElementById('nf51Deliver').onclick=()=>{if(!all())return msg('#nf51Msg','Completá las pruebas finales antes de entregar.',true);if(Number(o.balance_due||0)>0)return msg('#nf51Msg','Hay saldo pendiente. Registrá el pago antes de cerrar la entrega.',true);if(!confirm('¿Confirmás que las pruebas fueron realizadas y el equipo fue entregado?'))return;run({action:'complete_delivery',order_code:o.order_code,delivered_to:document.getElementById('nf51Who').value.trim(),delivery_note:document.getElementById('nf51Note').value.trim()},'#nf51Msg',o.order_code)};
}
const b=document.getElementById('drawerBody');if(b)new MutationObserver(()=>setTimeout(inject,60)).observe(b,{childList:true,subtree:false});
})();