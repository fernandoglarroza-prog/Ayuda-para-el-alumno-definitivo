// Ejecutar: node --test nextfuture-preview/tests/v53-public-integration.test.cjs
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=['v37-diagnostic-learning.js','v38-diagnostic-evidence.js','v45-diagnostic-depth.js','v46-tech-problems.js','v47-differential.js','v49-request-ux.js','v52-quote-fix.js','v53-diagnostic-guard.js'];
test('Todos los módulos están enlazados y disponibles',()=>{
 for(const file of scripts){assert.ok(html.includes('./'+file),file);assert.ok(fs.existsSync(path.join(root,file)),file)}
 for(const src of html.matchAll(/<script[^>]+src="\.\/([^"]+)"/g))assert.ok(fs.existsSync(path.join(root,src[1])),src[1]);
 for(const src of html.matchAll(/<link[^>]+href="\.\/([^"]+)"/g))assert.ok(fs.existsSync(path.join(root,src[1])),src[1]);
});
test('Sintaxis JS de los módulos importados',()=>{for(const file of scripts)new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file})});
function quote(model,device='phone',job='screen'){
 const els={qpDeviceV52:{value:device},qpJobV52:{value:job},qpModelV52:{value:model},qpResult:{innerHTML:''}},window={};
 const document={getElementById:id=>els[id]||null,querySelector(){return null},addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'v52-quote-fix.js'),'utf8'),{document,window,MutationObserver:class{}});
 return {api:window.NextfutureQuoteV52,els};
}
test('Modelo exacto sin precio de repuesto inventado',()=>{
 const known=quote('Samsung Galaxy A15'),unknown=quote('Motorola Moto G52');
 assert.equal(known.api.estimate('phone','screen','Samsung Galaxy A15').known,true);
 assert.equal(unknown.api.estimate('phone','screen','Motorola Moto G52').known,false);
 assert.equal(unknown.api.estimate('phone','screen','Motorola Moto G52').labor,30000);
});
test('Identifica trabajo según síntoma, sin módulo anterior',()=>{
 const {api}=quote('');
 assert.equal(api.jobFromSymptom('pantalla sin imagen',{label:'Pantalla'}),'screen');
 assert.equal(api.jobFromSymptom('bateria',{label:'No mantiene carga'}),'battery');
});
test('Escapa texto malicioso en el cotizador',()=>{
 const {api,els}=quote('<img src=x onerror=alert(1)>');api.render();
 assert.ok(!els.qpResult.innerHTML.includes('<img'));
 assert.ok(els.qpResult.innerHTML.includes('&lt;img'));
});
test('Escapa datos del cliente en el resumen de solicitud',()=>{
 const nodes={
  rqDevice:{selectedOptions:[{textContent:'Celular'}]},rqBrand:{value:'<svg onload=alert(1)>'},
  rqModel:{value:'G52'},rqMode:{selectedOptions:[{textContent:'En local'}]},
  rqLocality:{value:'<script>alert(1)</script>'},rqIssue:{value:'Falla <img src=x>'},
  rqPhone:{value:'1130112951'},rqName:{value:'Cliente de prueba'},rqEmail:{value:''}
 };
 for(const el of Object.values(nodes)){el.addEventListener=()=>{};el.setAttribute=()=>{}}
 const box={innerHTML:''};
 nodes.requestForm={
  querySelector:s=>s==='.request-actions'?{insertAdjacentElement:(_,el)=>{nodes.nf49RequestSummary=el}}:null,
  addEventListener:()=>{}
 };
 let init;
 const document={
  getElementById:id=>nodes[id]||null,
  createElement:()=>box,
  addEventListener:(type,callback)=>{if(type==='DOMContentLoaded')init=callback}
 };
 vm.runInNewContext(fs.readFileSync(path.join(root,'v49-request-ux.js'),'utf8'),{document});
 assert.equal(typeof init,'function');init();
 assert.ok(!box.innerHTML.includes('<svg'));
 assert.ok(!box.innerHTML.includes('<script'));
 assert.ok(!box.innerHTML.includes('<img'));
 assert.ok(box.innerHTML.includes('&lt;svg'));
 assert.ok(box.innerHTML.includes('&lt;script'));
 assert.ok(box.innerHTML.includes('&lt;img'));
});
