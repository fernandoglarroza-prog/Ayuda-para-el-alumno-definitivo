// Nextfuture V3.5 — conocimiento por familia/modelo sin inventar fallas por modelo
(function(){
  'use strict';
  const S={rule:null,answers:{},level:'generic'};
  const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();

  const FAMILIES=[
    {device:'phone',brand:/apple/,model:/iphone\s*(1[5-9]|[2-9]\d)/,family:'iPhone con USB‑C',platform:'iOS',identify:'Modelo exacto y capacidad desde Ajustes > General > Información, si el equipo inicia.',note:'En generaciones con USB‑C conviene confirmar cable/cargador compatible y modelo exacto antes de asociar repuestos.',tags:['iphone','ios','usb-c'],examples:['iPhone 15','iPhone 15 Pro','iPhone 16']},
    {device:'phone',brand:/apple/,model:/iphone/,family:'iPhone',platform:'iOS',identify:'Modelo exacto desde Ajustes > General > Información o referencia del equipo.',note:'La generación exacta define pantalla, batería, cámaras, conector y procedimientos. Las cuentas y activación se gestionan sólo por vías oficiales.',tags:['iphone','ios'],examples:['iPhone 11','iPhone 12','iPhone 13','iPhone 14']},
    {device:'phone',brand:/samsung/,model:/\b(a\d{1,3}|galaxy\s*a)/,family:'Samsung Galaxy A',platform:'Android / One UI',identify:'Conviene conservar el número de modelo completo además del nombre comercial.',note:'Dentro de Galaxy A hay variantes con piezas diferentes. Si Samsung Members está disponible, sus pruebas pueden aportar información adicional sin abrir el equipo.',tags:['galaxy','android','oneui'],examples:['A14','A15','A24','A34','A54','A55']},
    {device:'phone',brand:/samsung/,model:/\b(s\d{1,3}|galaxy\s*s)/,family:'Samsung Galaxy S',platform:'Android / One UI',identify:'Confirmar nombre y número de modelo completo antes de cotizar componentes.',note:'Pantalla, cámaras, batería y placa cambian por generación y variante. Las pruebas de software no reemplazan la verificación física.',tags:['galaxy','android','oneui'],examples:['S21','S22','S23','S24']},
    {device:'phone',brand:/samsung/,model:/\b(m\d{1,3}|galaxy\s*m)/,family:'Samsung Galaxy M',platform:'Android / One UI',identify:'Confirmar modelo completo y variante.',note:'La identificación exacta evita asumir compatibilidad de batería, pantalla o puerto entre equipos visualmente similares.',tags:['galaxy','android'],examples:['M12','M14','M23','M54']},
    {device:'phone',brand:/samsung/,model:/\b(z\s*flip|z\s*fold|galaxy\s*z)/,family:'Samsung Galaxy Z',platform:'Android / One UI',identify:'Confirmar generación exacta de Flip/Fold.',note:'En equipos plegables, pantalla, bisagra y flex requieren revisión física cuidadosa; no conviene forzar apertura/cierre si hay resistencia o daño.',tags:['galaxy','foldable','android'],examples:['Z Flip','Z Fold']},
    {device:'phone',brand:/motorola|moto/,model:/\bg\s*\d|moto\s*g/,family:'Motorola Moto G',platform:'Android',identify:'Usar el nombre completo, por ejemplo G52/G54/G84, y variante si figura.',note:'La familia Moto G abarca generaciones distintas. Pantalla, batería, puerto y flex deben confirmarse por modelo exacto.',tags:['motorola','moto','android'],examples:['G32','G42','G52','G54','G72','G84']},
    {device:'phone',brand:/motorola|moto/,model:/edge/,family:'Motorola Edge',platform:'Android',identify:'Confirmar número/generación completa de Edge.',note:'El nombre Edge cubre equipos muy distintos; la variante exacta es necesaria para pantalla, batería, cámaras y carga.',tags:['motorola','edge','android'],examples:['Edge 30','Edge 40','Edge 50']},
    {device:'phone',brand:/motorola|moto/,model:/\be\s*\d|moto\s*e/,family:'Motorola Moto E',platform:'Android',identify:'Confirmar número completo de modelo.',note:'No asumir que dos Moto E comparten pantalla, batería o puerto aunque el aspecto sea parecido.',tags:['motorola','moto','android'],examples:['E13','E22','E32']},
    {device:'phone',brand:/xiaomi/,model:/./,family:'Xiaomi',platform:'Android / HyperOS o MIUI',identify:'Confirmar nombre, número de modelo y variante regional cuando figure.',note:'Las opciones de sistema cambian entre MIUI/HyperOS y versiones. Repuestos y firmware deben asociarse al modelo exacto.',tags:['xiaomi','android'],examples:['Xiaomi 12','Xiaomi 13','Xiaomi 14']},
    {device:'phone',brand:/redmi/,model:/./,family:'Redmi',platform:'Android / HyperOS o MIUI',identify:'Confirmar serie y número completo, especialmente Note.',note:'La misma familia comercial puede tener variantes 4G/5G u otras revisiones. No conviene asumir compatibilidad de piezas.',tags:['redmi','android'],examples:['Redmi Note 11','Redmi Note 12','Redmi Note 13']},
    {device:'phone',brand:/poco/,model:/./,family:'POCO',platform:'Android / HyperOS o MIUI',identify:'Confirmar serie y variante exacta.',note:'Para pantalla, batería, puerto y firmware se necesita el modelo completo, no sólo X/F/M.',tags:['poco','android'],examples:['POCO X5','POCO X6','POCO F5','POCO M6']},
    {device:'phone',brand:/honor/,model:/./,family:'HONOR',platform:'Android / MagicOS',identify:'Confirmar nombre y código de modelo.',note:'La capa de sistema y el hardware varían por generación; las pruebas deben adaptarse al modelo exacto.',tags:['honor','android'],examples:['HONOR X','HONOR 90']},
    {device:'phone',brand:/oppo|realme|vivo/,model:/./,family:'Android de fabricante',platform:'Android',identify:'Confirmar marca y modelo completos.',note:'La interfaz cambia por fabricante. Para piezas y procedimientos se usa siempre el modelo exacto.',tags:['android'],examples:[]},

    {device:'tablet',brand:/apple/,model:/ipad/,family:'Apple iPad',platform:'iPadOS',identify:'Confirmar generación/modelo; si es posible, número de modelo.',note:'Pantalla, batería, conector y compatibilidad con Apple Pencil cambian por generación.',tags:['ipad','apple'],examples:['iPad','iPad Air','iPad mini','iPad Pro']},
    {device:'tablet',brand:/samsung/,model:/tab|galaxy/,family:'Samsung Galaxy Tab',platform:'Android / One UI',identify:'Confirmar serie (A/S/etc.) y modelo completo.',note:'Pantalla, batería, S Pen y conectividad cambian según variante.',tags:['galaxy','tablet','android'],examples:['Tab A','Tab S6','Tab S9']},
    {device:'tablet',brand:/lenovo/,model:/tab|m\d|p\d/,family:'Lenovo Tab',platform:'Android',identify:'Confirmar denominación y código de modelo.',note:'Dentro de Lenovo Tab cambian pantalla, batería, conector y accesorios por submodelo.',tags:['lenovo','tablet'],examples:['Tab M10','Tab P11']},
    {device:'tablet',brand:/xiaomi|redmi/,model:/pad/,family:'Xiaomi / Redmi Pad',platform:'Android',identify:'Confirmar Pad y generación exacta.',note:'Accesorios, pantalla y batería dependen de la variante exacta.',tags:['xiaomi','tablet'],examples:['Xiaomi Pad 6','Redmi Pad']},

    {device:'notebook',brand:/lenovo/,model:/ideapad/,family:'Lenovo IdeaPad',platform:'Windows / Linux según configuración',identify:'Buscar submodelo completo o Machine Type/MTM cuando esté disponible.',note:'IdeaPad agrupa configuraciones diferentes; pantalla, teclado, batería, cargador, RAM y almacenamiento deben confirmarse por submodelo.',tags:['lenovo','ideapad'],examples:['IdeaPad 1','IdeaPad 3','IdeaPad 5']},
    {device:'notebook',brand:/lenovo/,model:/thinkpad/,family:'Lenovo ThinkPad',platform:'Windows / Linux según configuración',identify:'Conviene registrar serie y Type/Model completo.',note:'ThinkPad tiene muchas generaciones; firmware y piezas se verifican por Type/Model.',tags:['lenovo','thinkpad'],examples:['ThinkPad E14','T14','L15']},
    {device:'notebook',brand:/hp/,model:/pavilion/,family:'HP Pavilion',platform:'Windows',identify:'Buscar Product Number/modelo completo en etiqueta o sistema.',note:'Pavilion contiene múltiples variantes de batería, pantalla, teclado y cargador.',tags:['hp','pavilion'],examples:['Pavilion 15','Pavilion x360']},
    {device:'notebook',brand:/hp/,model:/probook|elitebook/,family:'HP ProBook / EliteBook',platform:'Windows',identify:'Registrar Product Number y modelo completo.',note:'Para BIOS y repuestos conviene identificar la variante exacta antes de intervenir.',tags:['hp','business'],examples:['ProBook 440','EliteBook 840']},
    {device:'notebook',brand:/dell/,model:/inspiron/,family:'Dell Inspiron',platform:'Windows',identify:'Registrar modelo completo y Service Tag si está disponible.',note:'El Service Tag ayuda a distinguir configuraciones. Pantalla, batería, RAM y cargador pueden variar dentro del mismo nombre comercial.',tags:['dell','inspiron'],examples:['Inspiron 15','Inspiron 14']},
    {device:'notebook',brand:/dell/,model:/latitude/,family:'Dell Latitude',platform:'Windows',identify:'Registrar modelo y Service Tag.',note:'Latitude cambia por generación; identificar la unidad evita mezclar piezas o firmware.',tags:['dell','latitude'],examples:['Latitude 5420','Latitude 7490']},
    {device:'notebook',brand:/asus/,model:/vivobook/,family:'ASUS VivoBook',platform:'Windows',identify:'Registrar código completo del modelo, no sólo VivoBook.',note:'Pantalla, teclado, batería y cargador varían mucho entre submodelos.',tags:['asus','vivobook'],examples:['VivoBook 15','VivoBook 16']},
    {device:'notebook',brand:/asus/,model:/tuf|rog/,family:'ASUS TUF / ROG',platform:'Windows',identify:'Registrar código completo y potencia del cargador si el problema es de energía.',note:'En equipos de alto consumo conviene cruzar temperatura, ventilación, cargador y GPU antes de concluir la causa.',tags:['asus','gaming'],examples:['TUF Gaming','ROG Strix','ROG Zephyrus']},
    {device:'notebook',brand:/acer/,model:/aspire/,family:'Acer Aspire',platform:'Windows',identify:'Registrar submodelo completo.',note:'RAM, almacenamiento, pantalla, batería y cargador dependen de la variante.',tags:['acer','aspire'],examples:['Aspire 3','Aspire 5']},
    {device:'notebook',brand:/acer/,model:/nitro/,family:'Acer Nitro',platform:'Windows',identify:'Registrar AN/variante completa y cargador.',note:'Si hay reinicios o bajo rendimiento conviene cruzar temperatura, GPU, alimentación y ventilación.',tags:['acer','gaming'],examples:['Nitro 5','Nitro V']},
    {device:'notebook',brand:/apple/,model:/macbook/,family:'Apple MacBook',platform:'macOS',identify:'Registrar MacBook Air/Pro, año/generación y número de modelo cuando sea posible.',note:'La arquitectura y piezas cambian mucho por generación; procedimientos y compatibilidad deben verificarse por modelo exacto.',tags:['apple','macbook','macos'],examples:['MacBook Air','MacBook Pro']},
    {device:'notebook',brand:/msi/,model:/./,family:'MSI Notebook',platform:'Windows',identify:'Registrar serie y código completo.',note:'En líneas gaming/creator es especialmente útil cruzar alimentación, GPU y sistema térmico.',tags:['msi','gaming'],examples:['MSI GF','Katana','Modern']},

    {device:'pc',brand:/armado|custom|generico|genérico/,model:/./,family:'PC armada / custom',platform:'Depende de la configuración',identify:'Identificar placa madre, fuente, CPU, GPU, RAM y unidades.',note:'En una PC armada importan más los componentes que una marca general. La potencia y modelo de la fuente son especialmente útiles en fallas de encendido o reinicio.',tags:['pc','custom'],examples:[]},
    {device:'pc',brand:/dell|hp|lenovo|acer|asus/,model:/./,family:'PC de marca',platform:'Windows / Linux según configuración',identify:'Registrar modelo/serie del equipo y, si es posible, configuración de RAM, almacenamiento y GPU.',note:'El modelo completo ayuda a ubicar fuente, placa, formatos y opciones de expansión compatibles.',tags:['pc','oem'],examples:[]}
  ];

  const BRAND_FALLBACK={
    phone:{apple:'Apple / iPhone',samsung:'Samsung Galaxy',motorola:'Motorola',moto:'Motorola',xiaomi:'Xiaomi',redmi:'Redmi',poco:'POCO',tcl:'TCL',honor:'HONOR',huawei:'Huawei',zte:'ZTE',realme:'Realme',oppo:'Oppo',vivo:'Vivo',nokia:'Nokia / HMD'},
    tablet:{apple:'Apple iPad',samsung:'Samsung',lenovo:'Lenovo',xiaomi:'Xiaomi',redmi:'Redmi',tcl:'TCL',huawei:'Huawei',honor:'HONOR'},
    notebook:{lenovo:'Lenovo',hp:'HP',dell:'Dell',asus:'ASUS',acer:'Acer',samsung:'Samsung',msi:'MSI',apple:'Apple',bangho:'Banghó',positivo:'Positivo',exo:'EXO'},
    pc:{dell:'Dell',hp:'HP',lenovo:'Lenovo',asus:'ASUS',acer:'Acer',bangho:'Banghó',positivo:'Positivo',exo:'EXO'}
  };

  function current(){return {device:diagState?.device||'',brand:(document.getElementById('diagBrand')?.value||'').trim(),model:(document.getElementById('diagModel')?.value||'').trim()};}
  function findRule(){
    const x=current(), b=norm(x.brand), m=norm(x.model);
    S.rule=FAMILIES.find(r=>r.device===x.device&&r.brand.test(b)&&r.model.test(m))||null;
    const fb=BRAND_FALLBACK[x.device]||{}; const brandKey=Object.keys(fb).find(k=>b.includes(k));
    S.level=S.rule?(m?'family':'brand'):(brandKey?'brand':(b||m?'partial':'generic'));
    return {x,rule:S.rule,brandLabel:brandKey?fb[brandKey]:''};
  }

  function levelLabel(){return {family:'Familia reconocida',brand:'Marca reconocida',partial:'Identificación parcial',generic:'Sin identificar'}[S.level]||'Identificación parcial';}
  function renderIdentity(){
    const stage=document.getElementById('diagSymptomStage'); if(!stage)return;
    document.getElementById('nf35Identity')?.remove();
    const {x,rule,brandLabel}=findRule();
    if(!x.brand&&!x.model)return;
    const box=document.createElement('section');box.id='nf35Identity';box.className='nf35-identity';
    const title=rule?.family||brandLabel||[x.brand,x.model].filter(Boolean).join(' ');
    const note=rule?.note||'El diagnóstico seguirá por síntomas. Para cotizar repuestos o firmware se confirmará el modelo y variante exactos antes de intervenir.';
    const identify=rule?.identify||'Si podés, completá marca y modelo exactos. Esa información mejora compatibilidad de piezas y procedimientos.';
    box.innerHTML=`<div class="nf35-id-head"><div><small>CONTEXTO DEL EQUIPO</small><b>${esc(title||'Equipo')}</b></div><span>${esc(levelLabel())}</span></div><p>${esc(note)}</p><div class="nf35-identify"><b>Para identificarlo mejor:</b> ${esc(identify)}</div>${rule?.examples?.length?`<div class="nf35-examples">Ejemplos de la familia: ${rule.examples.map(esc).join(' · ')}</div>`:''}`;
    const row=stage.querySelector('.diag-equipment-row'); if(row)row.insertAdjacentElement('afterend',box);
  }

  function symptomText(){const s=DIAG_DATA?.[diagState?.device]?.symptoms?.[diagState?.symptom];return norm([s?.label,...(s?.causes||[])].join(' '));}
  function modelQuestions(){
    const {x,rule}=findRule(); if(!rule||!diagState?.symptom||diagState.symptom==='other')return [];
    const t=symptomText(), out=[];
    const add=(id,text,why)=>out.push({id,text,why});
    if(/carga|cargador|bateria|enciende|alimentacion|fuente/.test(t)) add('power_match','¿El cargador que estás usando es conocido, compatible con este equipo y funcionaba correctamente antes?','Ayuda a separar accesorio/alimentación externa de una falla interna.');
    if(/pantalla|imagen|display|tactil/.test(t)&&diagState.device==='notebook') add('external_display','¿Probaste una salida de video externa compatible sin abrir el equipo?','Si da imagen externa, pantalla/flex ganan importancia frente a una falla total de video.');
    if(/sistema|software|windows|android|ios|app|actualizacion|inicio/.test(t)) add('os_before','¿Antes de una actualización, instalación o cambio de configuración el equipo funcionaba normalmente?','Relaciona la falla con software sin asumir que el hardware está sano.');
    if(/wifi|bluetooth|red|senal|sim|gps/.test(t)) add('network_compare','¿Probaste la misma función con otra red, SIM o accesorio conocido cuando corresponde?','Ayuda a separar el equipo del servicio o accesorio externo.');
    if(/calienta|temperatura|ventilador|reinicia|apaga/.test(t)&&diagState.device==='notebook') add('thermal_pattern','¿La falla aparece más al exigir el equipo, jugar o usarlo varios minutos?','Cruza inestabilidad con temperatura y carga de trabajo.');
    if(/disco|ssd|hdd|almacenamiento|lento|traba/.test(t)&&diagState.device==='notebook') add('data_backup','¿Tenés una copia reciente de tus archivos importantes?','Si el almacenamiento está degradado conviene priorizar datos antes de pruebas intensivas.');
    return out.slice(0,2);
  }

  function renderModelQuestions(){
    document.getElementById('nf35Questions')?.remove();
    const qs=modelQuestions(); if(!qs.length)return;
    const host=document.getElementById('diagQuestions'); if(!host)return;
    const sec=document.createElement('section');sec.id='nf35Questions';sec.className='nf35-questions';
    sec.innerHTML=`<div class="nf35-q-head"><div><small>PREGUNTAS POR FAMILIA</small><b>${esc(S.rule?.family||'Equipo')}</b><p>Estas comprobaciones aparecen porque informaste una familia/modelo concreto.</p></div></div>${qs.map((q,i)=>`<article><span>${i+1}</span><div><b>${esc(q.text)}</b><small>${esc(q.why)}</small><div class="nf35-options"><label><input type="radio" name="nf35_${esc(q.id)}" value="yes" ${S.answers[q.id]==='yes'?'checked':''}> Sí</label><label><input type="radio" name="nf35_${esc(q.id)}" value="no" ${S.answers[q.id]==='no'?'checked':''}> No</label><label><input type="radio" name="nf35_${esc(q.id)}" value="unknown" ${S.answers[q.id]==='unknown'?'checked':''}> No sé</label></div></div></article>`).join('')}`;
    host.insertAdjacentElement('afterend',sec);
    sec.querySelectorAll('input').forEach(i=>i.addEventListener('change',()=>{S.answers[i.name.replace('nf35_','')]=i.value;}));
  }

  function resultCard(){
    const card=document.getElementById('diagResultCard'); if(!card||!card.children.length||card.querySelector('#nf35Result'))return;
    const {x,rule,brandLabel}=findRule(); if(!x.brand&&!x.model)return;
    const sec=document.createElement('section');sec.id='nf35Result';sec.className='nf35-result';
    const title=rule?.family||brandLabel||[x.brand,x.model].filter(Boolean).join(' ');
    const ans=modelQuestions().map(q=>({q,v:S.answers[q.id]})).filter(a=>a.v);
    sec.innerHTML=`<div class="nf35-result-head"><div><small>IDENTIFICACIÓN DEL EQUIPO</small><h3>${esc(title||'Equipo')}</h3></div><span>${esc(levelLabel())}</span></div><p>${esc(rule?.note||'El modelo no coincide aún con una familia específica de la base. El diagnóstico se mantiene guiado por síntomas y antecedentes.')}</p>${rule?`<div class="nf35-result-id"><b>Dato útil para recepción:</b> ${esc(rule.identify)}</div>`:''}${ans.length?`<details><summary>Ver respuestas por familia (${ans.length})</summary><ul>${ans.map(a=>`<li>${esc(a.q.text)} — <b>${a.v==='yes'?'Sí':a.v==='no'?'No':'No sabe'}</b></li>`).join('')}</ul></details>`:''}`;
    card.appendChild(sec);
  }

  function summary(){
    const {x,rule}=findRule(); if(!x.brand&&!x.model)return '';
    const ans=modelQuestions().map(q=>({q,v:S.answers[q.id]})).filter(a=>a.v);
    const p=[`Identificación: ${[x.brand,x.model].filter(Boolean).join(' ')}`];
    if(rule)p.push(`Familia reconocida: ${rule.family}`);
    if(ans.length)p.push('Comprobaciones por familia: '+ans.map(a=>`${a.q.text} ${a.v==='yes'?'Sí':a.v==='no'?'No':'No sabe'}.`).join(' '));
    return p.join('. ')+'.';
  }

  ['diagBrand','diagModel'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>{clearTimeout(window.__nf35t);window.__nf35t=setTimeout(()=>{renderIdentity();renderModelQuestions();},120);}));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-diag-device]'))setTimeout(renderIdentity,10);
    if(e.target.closest?.('[data-diag-symptom]'))setTimeout(()=>{renderIdentity();renderModelQuestions();},20);
    if(e.target.closest?.('#diagToRequest'))setTimeout(()=>{const i=document.getElementById('rqIssue');const s=summary();if(i&&s&&!i.value.includes('Familia reconocida:'))i.value+=' '+s;},100);
  });
  const q=document.getElementById('diagQuestions'); if(q)new MutationObserver(()=>setTimeout(renderModelQuestions,0)).observe(q,{childList:true});
  const r=document.getElementById('diagResultCard'); if(r)new MutationObserver(()=>setTimeout(resultCard,0)).observe(r,{childList:true});
  document.getElementById('diagRestart')?.addEventListener('click',()=>{S.rule=null;S.answers={};S.level='generic';document.getElementById('nf35Identity')?.remove();document.getElementById('nf35Questions')?.remove();});
  window.NextfutureModelKnowledge={identify:findRule,summary};
})();