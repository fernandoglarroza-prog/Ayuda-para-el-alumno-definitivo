/* Nextfuture V4.7 — reporte operativo mensual, sólo lectura y exportación local. */
(function(){
'use strict';
const TZ='America/Argentina/Buenos_Aires';
const $r=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(n)||0);
function monthOf(date){
  if(!date)return '';
  const d=new Date(date);if(Number.isNaN(d.getTime()))return '';
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit'}).formatToParts(d);
  const year=parts.find(p=>p.type==='year')?.value,month=parts.find(p=>p.type==='month')?.value;
  return year&&month?year+'-'+month:'';
}
function todayMonth(){return monthOf(new Date())}
function dateLabel(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('es-AR',{timeZone:TZ})}
function validMonth(v){return /^20\d\d-(0[1-9]|1[0-2])$/.test(v)?v:todayMonth()}
function snapshot(month){
 const all=typeof O==='undefined'?[]:O;
 const started=all.filter(o=>monthOf(o.created_at)===month);
 const delivered=all.filter(o=>o.order_status==='delivered'&&monthOf(o.completed_at)===month);
 const pending=started.filter(o=>!['delivered','cancelled'].includes(o.order_status));
 const budgetTotal=started.reduce((n,o)=>n+(Number(o.budget_total)||0),0);
 return {all,started,delivered,pending,budgetTotal,limited:all.length>=200};
}
function safeCell(value){
 let s=String(value??'').replace(/[\r\n]+/g,' ').trim();
 if(/^[=+\-@\t]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
function toCsv(rows){
 const head=['Código','Ingreso','Última actualización','Equipo','Marca','Modelo','Estado actual','Presupuesto cargado (ARS)','Pagos registrados de la orden (ARS)','Saldo registrado (ARS)'];
 const lines=rows.map(o=>[o.order_code,dateLabel(o.created_at),dateLabel(o.updated_at),DEV[o.device_type]||o.device_type,o.brand||'',o.model||'',L[o.order_status]||o.order_status,o.budget_total??'',o.total_paid??'',o.balance_due??'']);
 return '\uFEFF'+[head,...lines].map(row=>row.map(safeCell).join(';')).join('\r\n')+'\r\n';
}
function exportCsv(month,rows){
 if(!rows.length)return;
 const blob=new Blob([toCsv(rows)],{type:'text/csv;charset=utf-8;'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='nextfuture-ordenes-'+month+'.csv';
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function show(month=todayMonth()){
 const m=validMonth(month),s=snapshot(m);
 drawer('Reporte mensual','<div class="box"><span class="kicker">NEXTFUTURE V4.7 · SÓLO LECTURA</span><h3>Actividad del mes</h3><div class="nf47-controls"><label for="nf47Month">Mes a consultar</label><input id="nf47Month" type="month" value="'+m+'"><button class="btn" id="nf47Update" type="button">Actualizar vista</button></div><div class="nf47-kpis"><div><small>Órdenes ingresadas</small><b>'+s.started.length+'</b></div><div><small>Entregadas en el mes</small><b>'+s.delivered.length+'</b></div><div><small>De este mes, todavía pendientes</small><b>'+s.pending.length+'</b></div><div><small>Presupuestos cargados de órdenes del mes</small><b>'+fmt(s.budgetTotal)+'</b></div></div><p class="mgmt-note">Este es un reporte de órdenes y presupuestos, no una liquidación contable. Los pagos registrados pertenecen a cada orden y pueden haberse recibido en otro mes. El panel carga hasta 200 órdenes recientes; si existen más, el informe puede ser incompleto.</p>'+(s.limited?'<p class="nf47-warning">Se alcanzó el límite de 200 órdenes cargadas: este reporte no es exhaustivo.</p>':'')+'</div><div class="box"><div class="nf47-head"><h3>Órdenes ingresadas en '+m+'</h3><button class="btn primary" id="nf47Export" type="button" '+(!s.started.length?'disabled':'')+'>Descargar CSV</button></div><div class="nf47-table-wrap"><table class="nf47-table"><thead><tr><th>Orden</th><th>Ingreso</th><th>Equipo</th><th>Estado actual</th><th>Presupuesto</th></tr></thead><tbody>'+((s.started.length?s.started.map(o=>'<tr><td>'+esc(o.order_code)+'</td><td>'+dateLabel(o.created_at)+'</td><td>'+esc(([o.brand,o.model].filter(Boolean).join(' ')||DEV[o.device_type]||'Equipo'))+'</td><td>'+esc(L[o.order_status]||o.order_status||'—')+'</td><td>'+fmt(o.budget_total)+'</td></tr>').join(''):'<tr><td colspan="5">No hay órdenes registradas en este mes dentro de los datos cargados.</td></tr>'))+'</tbody></table></div><p class="mgmt-note">El CSV excluye nombres, teléfonos y datos de contacto de clientes.</p></div>');
 $r('nf47Update')?.addEventListener('click',()=>show($r('nf47Month')?.value));
 $r('nf47Month')?.addEventListener('change',e=>show(e.target.value));
 $r('nf47Export')?.addEventListener('click',()=>exportCsv(m,s.started));
}
document.addEventListener('DOMContentLoaded',()=>$r('reportBtn')?.addEventListener('click',()=>show()));
window.NextfutureMonthlyReport={monthOf,snapshot,toCsv,show};
})();
