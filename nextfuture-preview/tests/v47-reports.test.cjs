const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','admin-v47-reports.js'),'utf8');
function agent(orders){
 const window={};
 vm.runInNewContext(source,{
  document:{addEventListener(){}},window,O:orders,DEV:{phone:'Celular'},
  L:{requested:'Solicitud',delivered:'Entregado'},drawer(){},esc:String,
  Blob:class {},URL:{createObjectURL(){return ''},revokeObjectURL(){}},setTimeout(){}
 });
 return window.NextfutureMonthlyReport;
}
const rows=[
 {order_code:'NF-001',created_at:'2026-10-03T14:00:00Z',completed_at:'2026-10-05T17:00:00Z',updated_at:'2026-10-05T17:00:00Z',order_status:'delivered',device_type:'phone',brand:'Samsung',model:'A15',budget_total:50000,total_paid:50000,balance_due:0,customer:{name:'NO EXPORTAR'}},
 {order_code:'NF-002',created_at:'2026-10-01T01:00:00Z',updated_at:'2026-10-01T01:00:00Z',order_status:'requested',device_type:'phone',brand:'=HYPERLINK(1)',model:'G24", test',budget_total:20000,total_paid:0,balance_due:20000}
];
test('Agrupa por mes local argentino, no UTC',()=>{
 const api=agent(rows);
 assert.equal(api.snapshot('2026-10').started.length,1);
 assert.equal(api.snapshot('2026-09').started.length,1);
});
test('Separa las órdenes ingresadas de las entregadas',()=>{
 const o=agent(rows).snapshot('2026-10');
 assert.equal(o.delivered.length,1);
 assert.equal(o.pending.length,0);
 assert.equal(o.budgetTotal,50000);
});
test('CSV seguro para Excel y sin datos personales de contacto',()=>{
 const csv=agent(rows).toCsv(rows);
 assert.ok(csv.startsWith('\uFEFF'));
 assert.ok(csv.includes("'=HYPERLINK(1)"));
 assert.ok(csv.includes('G24""'));
 assert.ok(!csv.includes('NO EXPORTAR'));
 assert.ok(csv.includes('Pagos registrados de la orden'));
});
