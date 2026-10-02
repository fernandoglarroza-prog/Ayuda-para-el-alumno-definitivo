// Nextfuture V3.2 — cruce de síntomas, antecedentes, contexto de modelo y traspaso a solicitud
(function(){
  'use strict';

  const state={primary:null,secondaries:new Set(),onset:'',antecedent:'',dataImportant:false};
  const antecedentLabels={
    '':'No indicado',none:'Nada en particular',drop:'Golpe o caída',liquid:'Líquido o humedad',update:'Actualización / instalación',charger:'Cambio de cargador o accesorio',power:'Corte de luz / sobretensión',repair:'Reparación o apertura previa',heat:'Temperatura alta',unknown:'No sé / no recuerdo'
  };
  const onsetLabels={'':'No indicado',sudden:'De golpe',progressive:'Fue empeorando',intermittent:'Va y viene',event:'Justo después de un evento',unknown:'No sé'};

  const DOMAIN_RULES=[
    {id:'power',label:'Alimentación / carga',keys:['carga','cargador','puerto','jack','fuente','alimentación','enciende','power','voltaje','corriente']},
    {id:'battery',label:'Batería',keys:['batería','bateria','autonomía','autonomia','hinchada','hincha']},
    {id:'display',label:'Pantalla / imagen',keys:['pantalla','display','imagen','táctil','tactil','panel','backlight','video','artefact']},
    {id:'thermal',label:'Temperatura / refrigeración',keys:['temperatura','calienta','ventilador','térmica','termica','disip','pasta térmica','pasta termica']},
    {id:'storage',label:'Almacenamiento / datos',keys:['disco','ssd','hdd','almacenamiento','memoria interna','archivo','datos','guardar','espacio']},
    {id:'memory',label:'RAM / memoria',keys:['ram','memoria ram','post','pitidos','beep']},
    {id:'software',label:'Sistema / software',keys:['software','sistema','windows','android','ios','actualización','actualizacion','app','aplicación','aplicacion','driver','controlador','inicio de sesión','inicio de sesion','cuenta','pin']},
    {id:'network',label:'Conectividad',keys:['wifi','wi‑fi','wi-fi','bluetooth','señal','senal','sim','gps','ethernet','red','datos móviles','datos moviles']},
    {id:'audio',label:'Audio',keys:['audio','parlante','micrófono','microfono','auricular','sonido','headphone']},
    {id:'input',label:'Controles / periféricos',keys:['teclado','touchpad','mouse','botón','boton','usb','stylus','lápiz','lapiz','sensor','huella','biometr']},
    {id:'camera',label:'Cámara',keys:['cámara','camara','webcam','flash','linterna','enfoca']},
    {id:'physical',label:'Daño físico / conectores',keys:['golpe','caída','caida','líquido','liquido','humedad','corros','quebrado','bisagra','conector','flex','carcasa']},
    {id:'board',label:'Placa / electrónica',keys:['placa','motherboard','circuito','chip','gpu','baseband','radiofrecuencia','corto','electrónica','electronica']}
  ];

  const MODEL_HINTS=[
    {device:'phone',brand:/apple/i,family:/iphone/i,title:'iPhone / iOS',note:'Para restauraciones, cuentas y activación se priorizan los procedimientos oficiales de Apple. El conector de carga y las piezas deben confirmarse por modelo exacto antes de presupuestar.'},
    {device:'phone',brand:/samsung/i,family:/galaxy|^a\d|^s\d|^m\d|^z\s/i,title:'Samsung Galaxy',note:'Si Samsung Members está disponible, sus diagnósticos pueden aportar datos útiles. Pantalla, batería, puerto y flex deben verificarse por variante exacta.'},
    {device:'phone',brand:/motorola|moto/i,family:/./,title:'Motorola / Moto',note:'Las herramientas de diagnóstico del fabricante pueden variar según el modelo. Conviene conservar el número de modelo completo para confirmar repuestos y procedimientos.'},
    {device:'phone',brand:/xiaomi|redmi|poco/i,family:/./,title:'Xiaomi / Redmi / POCO',note:'La interfaz y opciones de diagnóstico pueden variar entre MIUI y HyperOS. El modelo y variante exactos son importantes para pantalla, batería y puerto.'},
    {device:'tablet',brand:/apple/i,family:/ipad/i,title:'iPad / iPadOS',note:'La familia iPad tiene variantes con conectores y accesorios distintos. Conviene confirmar modelo exacto antes de asumir compatibilidad de pantalla, batería, lápiz o puerto.'},
    {device:'tablet',brand:/samsung/i,family:/tab|galaxy/i,title:'Samsung Galaxy Tab',note:'El modelo completo ayuda a separar variantes de pantalla, batería, S Pen y conectividad. Las pruebas de software pueden complementarse con herramientas oficiales cuando estén disponibles.'},
    {device:'notebook',brand:/lenovo/i,family:/ideapad/i,title:'Lenovo IdeaPad',note:'Dentro de IdeaPad cambian batería, cargador, pantalla, teclado y almacenamiento según submodelo. El código completo del equipo es más útil que el nombre comercial solo.'},
    {device:'notebook',brand:/lenovo/i,family:/thinkpad/i,title:'Lenovo ThinkPad',note:'ThinkPad abarca muchas generaciones. Para piezas y firmware conviene identificar tipo/modelo completo y no sólo la familia.'},
    {device:'notebook',brand:/hp/i,family:/pavilion/i,title:'HP Pavilion',note:'Las variantes Pavilion pueden usar cargadores, baterías, pantallas y teclados diferentes. El submodelo impreso en el equipo ayuda a evitar incompatibilidades.'},
    {device:'notebook',brand:/hp/i,family:/probook|elitebook/i,title:'HP profesional',note:'En ProBook/EliteBook conviene conservar el identificador exacto del equipo para BIOS, batería, teclado y pantalla.'},
    {device:'notebook',brand:/dell/i,family:/inspiron/i,title:'Dell Inspiron',note:'Inspiron incluye configuraciones muy distintas. Service Tag o modelo completo ayudan a confirmar componentes antes de presupuestar.'},
    {device:'notebook',brand:/dell/i,family:/latitude/i,title:'Dell Latitude',note:'Latitude cambia por generación y configuración. Conviene identificar modelo completo antes de asociar batería, pantalla, teclado o cargador.'},
    {device:'notebook',brand:/asus/i,family:/vivobook/i,title:'ASUS VivoBook',note:'VivoBook tiene múltiples variantes; el código completo del modelo es clave para pantalla, teclado, batería y cargador.'},
    {device:'notebook',brand:/asus/i,family:/tuf|rog/i,title:'ASUS gaming',note:'En equipos gaming conviene cruzar temperatura, cargador, GPU y ventilación. El modelo exacto define potencia, batería y sistema térmico.'},
    {device:'notebook',brand:/acer/i,family:/aspire/i,title:'Acer Aspire',note:'Aspire agrupa configuraciones distintas; el submodelo exacto permite confirmar RAM, almacenamiento, pantalla, batería y cargador.'},
    {device:'notebook',brand:/acer/i,family:/nitro/i,title:'Acer Nitro',note:'En Nitro es especialmente útil cruzar temperatura, GPU, cargador y ventilación. La variante exacta define piezas y potencia.'},
    {device:'pc',brand:/armado|custom|gen[eé]rico/i,family:/./,title:'PC armada / custom',note:'En una PC armada importan más los componentes que una marca general. Para afinar el diagnóstico conviene identificar placa madre, fuente, CPU, GPU, RAM y unidades.'}
  ];

  const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  function resetContext(){state.primary=null;state.secondaries.clear();state.onset='';state.antecedent='';state.dataImportant=false;}

  function getSymptoms(){
    if(!diagState.device||!DIAG_DATA[diagState.device]) return [];
    return Object.entries(DIAG_DATA[diagState.device].symptoms||{}).filter(([k])=>k!=='other');
  }

  function inferDomains(symptom){
    if(!symptom) return [];
    const text=norm([symptom.label,symptom.category,(symptom.causes||[]).join(' ')].join(' '));
    return DOMAIN_RULES.filter(d=>d.keys.some(k=>text.includes(norm(k)))).map(d=>d.id);
  }

  function secondaryCandidates(primaryKey){
    const all=getSymptoms().filter(([k])=>k!==primaryKey);
    const primary=DIAG_DATA[diagState.device]?.symptoms?.[primaryKey];
    const pDomains=new Set(inferDomains(primary));
    return all.map(([key,s])=>{
      let score=0;
      const d=inferDomains(s);
      d.forEach(x=>{if(pDomains.has(x))score+=3;});
      if(primary?.category&&s.category===primary.category)score+=4;
      if(/reinicia|apaga|calienta|carga|enciende|imagen|lento|traba/i.test(s.label||''))score+=1;
      return {key,s,score};
    }).sort((a,b)=>b.score-a.score||String(a.s.label).localeCompare(String(b.s.label),'es'));
  }

  function injectContext(primaryKey){
    if(primaryKey==='other') return;
    const list=document.getElementById('diagQuestions');
    if(!list||document.getElementById('diagCrossContext')) return;
    const candidates=secondaryCandidates(primaryKey);
    const suggested=candidates.slice(0,8);
    const panel=document.createElement('div');
    panel.id='diagCrossContext';
    panel.className='cross-context';
    panel.innerHTML=`
      <div class="cross-title"><div><small>CRUCE DE SÍNTOMAS</small><h4>¿Además pasa algo más?</h4><p>Opcional. Podés marcar hasta 3 síntomas secundarios para mejorar la orientación.</p></div><span id="crossCount">0/3</span></div>
      <div class="cross-chips" id="crossSuggested">${suggested.map(({key,s})=>`<button type="button" class="cross-chip" data-cross-key="${esc(key)}">${esc(s.label)}</button>`).join('')}</div>
      <details class="cross-more"><summary>Buscar otro síntoma</summary><div class="cross-search-wrap"><input id="crossSearch" type="search" placeholder="Ej: wifi, cámara, se apaga, USB"><div id="crossAll" class="cross-all"></div></div></details>
      <div class="cross-grid">
        <label><span>¿Cómo empezó?</span><select id="crossOnset"><option value="">No indicado</option><option value="sudden">De golpe</option><option value="progressive">Fue empeorando</option><option value="intermittent">Va y viene</option><option value="event">Justo después de un evento</option><option value="unknown">No sé</option></select></label>
        <label><span>¿Pasó algo antes?</span><select id="crossAntecedent"><option value="">No indicado</option><option value="none">Nada en particular</option><option value="drop">Golpe o caída</option><option value="liquid">Líquido o humedad</option><option value="update">Actualización / instalación</option><option value="charger">Cambio de cargador o accesorio</option><option value="power">Corte de luz / sobretensión</option><option value="repair">Reparación o apertura previa</option><option value="heat">Temperatura alta</option><option value="unknown">No sé / no recuerdo</option></select></label>
      </div>
      <label class="cross-data"><input type="checkbox" id="crossDataImportant"><span><b>Tengo archivos o datos importantes</b><small>Lo tendremos en cuenta antes de sugerir reinstalaciones, formateos o pruebas que puedan afectar información.</small></span></label>`;
    list.insertAdjacentElement('beforebegin',panel);

    const renderAll=(query='')=>{
      const q=norm(query);
      const rows=candidates.filter(x=>!q||norm(x.s.label+' '+(x.s.category||'')).includes(q)).slice(0,30);
      const out=document.getElementById('crossAll');
      out.innerHTML=rows.map(({key,s})=>`<button type="button" class="cross-chip ${state.secondaries.has(key)?'selected':''}" data-cross-key="${esc(key)}">${esc(s.label)}</button>`).join('')||'<div class="cross-empty">No encontré coincidencias. Podés usar “Otro problema” si el síntoma no está listado.</div>';
      bindChips(out);
    };
    const bindChips=root=>root.querySelectorAll('[data-cross-key]').forEach(btn=>btn.addEventListener('click',()=>toggleSecondary(btn.dataset.crossKey)));
    bindChips(panel.querySelector('#crossSuggested'));
    renderAll();
    panel.querySelector('#crossSearch').addEventListener('input',e=>renderAll(e.target.value));
    panel.querySelector('#crossOnset').addEventListener('change',e=>state.onset=e.target.value);
    panel.querySelector('#crossAntecedent').addEventListener('change',e=>state.antecedent=e.target.value);
    panel.querySelector('#crossDataImportant').addEventListener('change',e=>state.dataImportant=e.target.checked);
  }

  function toggleSecondary(key){
    if(state.secondaries.has(key)) state.secondaries.delete(key);
    else {
      if(state.secondaries.size>=3){
        const n=document.getElementById('crossLimitNote');
        if(n){n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1800);} else {
          const p=document.getElementById('diagCrossContext');
          if(p){const x=document.createElement('div');x.id='crossLimitNote';x.className='cross-limit';x.textContent='Podés seleccionar hasta 3 síntomas secundarios.';p.appendChild(x);setTimeout(()=>x.classList.add('show'),0);setTimeout(()=>x.classList.remove('show'),1800);}
        }
        return;
      }
      state.secondaries.add(key);
    }
    document.querySelectorAll('[data-cross-key]').forEach(btn=>btn.classList.toggle('selected',state.secondaries.has(btn.dataset.crossKey)));
    const c=document.getElementById('crossCount'); if(c)c.textContent=`${state.secondaries.size}/3`;
  }

  function scoreDomains(){
    const score=new Map();
    const reasons=new Map();
    const add=(id,points,reason)=>{score.set(id,(score.get(id)||0)+points);if(reason){if(!reasons.has(id))reasons.set(id,[]);reasons.get(id).push(reason);}};
    const primary=DIAG_DATA[diagState.device]?.symptoms?.[state.primary||diagState.symptom];
    inferDomains(primary).forEach(id=>add(id,3,'síntoma principal'));
    state.secondaries.forEach(key=>{
      const s=DIAG_DATA[diagState.device]?.symptoms?.[key];
      inferDomains(s).forEach(id=>add(id,2,`también: ${s?.label||key}`));
    });
    const ant=state.antecedent;
    if(ant==='drop'){add('physical',4,'hubo golpe o caída');add('board',2,'impacto puede afectar conexiones');add('display',1,'impacto puede afectar pantalla');}
    if(ant==='liquid'){add('physical',5,'hubo líquido o humedad');add('board',4,'riesgo de corrosión/corto');}
    if(ant==='update'){add('software',5,'empezó tras actualización/instalación');}
    if(ant==='charger'){add('power',4,'cambio de cargador/accesorio');add('battery',1,'cambio asociado a carga');}
    if(ant==='power'){add('power',5,'corte/sobretensión');add('board',3,'evento eléctrico');}
    if(ant==='repair'){add('physical',2,'hubo intervención previa');add('board',2,'conexiones/componentes deben verificarse');}
    if(ant==='heat'){add('thermal',5,'hubo temperatura alta');}
    if(state.dataImportant){add('storage',2,'hay datos importantes que preservar');}
    return [...score.entries()].map(([id,value])=>({id,value,label:DOMAIN_RULES.find(d=>d.id===id)?.label||id,reasons:[...new Set(reasons.get(id)||[])]})).sort((a,b)=>b.value-a.value).slice(0,4);
  }

  function modelContext(){
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const rule=MODEL_HINTS.find(r=>r.device===diagState.device&&r.brand.test(brand)&&r.family.test(model||brand));
    if(rule) return {title:rule.title,note:rule.note,matched:true};
    if(!brand&&!model) return null;
    if(diagState.device==='pc'&&/armado|custom/i.test(brand+' '+model)) return {title:'PC armada / custom',note:'Para afinar el diagnóstico conviene identificar placa madre, fuente, CPU, GPU, RAM y unidades instaladas.',matched:true};
    return {title:[brand,model].filter(Boolean).join(' '),note:'La orientación usa síntomas generales. Para elegir repuestos o firmware, Nextfuture confirmará el modelo y variante exactos antes de presupuestar.',matched:false};
  }

  function getSummary(){
    const device=DIAG_DATA[diagState.device]?.label||diagState.device||'Equipo';
    const p=DIAG_DATA[diagState.device]?.symptoms?.[state.primary||diagState.symptom];
    const sec=[...state.secondaries].map(k=>DIAG_DATA[diagState.device]?.symptoms?.[k]?.label).filter(Boolean);
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const answers=Object.entries(diagState.answers||{}).map(([id,v])=>`${id}: ${v==='yes'?'sí':v==='no'?'no':v}`).join(', ');
    const parts=[
      `Diagnóstico previo Nextfuture`,
      `Equipo: ${[device,brand,model].filter(Boolean).join(' · ')}`,
      `Síntoma principal: ${p?.label||'No indicado'}`,
      sec.length?`Síntomas secundarios: ${sec.join(' / ')}`:'',
      state.onset?`Inicio: ${onsetLabels[state.onset]}`:'',
      state.antecedent?`Antecedente: ${antecedentLabels[state.antecedent]}`:'',
      state.dataImportant?'Datos importantes: sí, priorizar conservación':'',
      answers?`Respuestas guiadas: ${answers}`:''
    ].filter(Boolean);
    return parts.join('. ')+'.';
  }

  function enhanceResult(){
    const card=document.getElementById('diagResultCard');
    if(!card||!card.children.length||card.querySelector('#diagCrossResult')||diagState.symptom==='other') return;
    const ranked=scoreDomains();
    const model=modelContext();
    const sec=[...state.secondaries].map(k=>DIAG_DATA[diagState.device]?.symptoms?.[k]?.label).filter(Boolean);
    const warning=state.antecedent==='liquid'?'Si hubo líquido, evitá encender o cargar el equipo hasta revisarlo.':state.antecedent==='power'?'Después de una sobretensión conviene evitar pruebas repetidas de encendido si hay olor, calor o comportamiento anormal.':'';
    const wrapper=document.createElement('div');
    wrapper.id='diagCrossResult';
    wrapper.className='cross-result';
    wrapper.innerHTML=`
      <div class="cross-result-head"><div><small>ANÁLISIS COMBINADO</small><h3>Cruce de síntomas y antecedentes</h3><p>${sec.length?`Se cruzó el síntoma principal con ${sec.length} síntoma${sec.length>1?'s':''} secundario${sec.length>1?'s':''}.`:'Podés repetir el diagnóstico y agregar síntomas secundarios si el equipo presenta más de una falla.'}</p></div><span class="cross-method">ORIENTATIVO</span></div>
      ${ranked.length?`<div class="cross-ranking">${ranked.slice(0,3).map((r,i)=>`<article><span>${i+1}</span><div><b>${esc(r.label)}</b><small>Coincidencia relativa dentro de este cuestionario · ${r.value} puntos</small></div></article>`).join('')}</div>`:''}
      <p class="cross-explain">Este puntaje <b>no es una probabilidad de falla</b>. Sólo ordena qué áreas coinciden mejor con lo que se declaró para decidir qué revisar primero.</p>
      ${model?`<div class="cross-model"><small>CONTEXTO DEL EQUIPO</small><b>${esc(model.title)}</b><p>${esc(model.note)}</p></div>`:''}
      ${state.dataImportant?'<div class="cross-preserve"><b>Prioridad: conservar datos.</b> Antes de reinstalar, formatear o hacer pruebas destructivas conviene respaldar o evaluar recuperación.</div>':''}
      ${warning?`<div class="cross-warning">${esc(warning)}</div>`:''}
      <div class="cross-handoff"><div><b>¿Querés pedir la reparación?</b><p>Pasamos automáticamente este diagnóstico a la solicitud para que no tengas que escribir todo de nuevo.</p></div><button type="button" class="btn btn-primary" id="diagToRequest">Usar este diagnóstico en mi solicitud</button></div>`;
    card.appendChild(wrapper);
    document.getElementById('diagToRequest')?.addEventListener('click',handoffToRequest);
  }

  function handoffToRequest(){
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const map={phone:'phone',tablet:'tablet',notebook:'notebook',pc:'pc'};
    const rqDevice=document.getElementById('rqDevice'); if(rqDevice)rqDevice.value=map[diagState.device]||'phone';
    const rqBrand=document.getElementById('rqBrand'); if(rqBrand)rqBrand.value=brand;
    const rqModel=document.getElementById('rqModel'); if(rqModel)rqModel.value=model;
    const rqIssue=document.getElementById('rqIssue'); if(rqIssue)rqIssue.value=getSummary();
    const section=document.getElementById('solicitud'); if(section)section.scrollIntoView({behavior:'smooth',block:'start'});
    if(rqIssue){setTimeout(()=>{rqIssue.focus({preventScroll:true});rqIssue.classList.add('diag-filled');setTimeout(()=>rqIssue.classList.remove('diag-filled'),1600);},500);}
  }

  // Se envuelve la función vigente después de V3.1/V2.6 para conservar toda la lógica previa.
  if(typeof chooseSymptom==='function'){
    const previousChoose=chooseSymptom;
    chooseSymptom=function(key){
      state.primary=key;state.secondaries.clear();state.onset='';state.antecedent='';state.dataImportant=false;
      previousChoose(key);
      setTimeout(()=>injectContext(key),0);
    };
  }

  // Si el resultado cambia por cualquier versión del motor, agregamos la capa de cruce sin interferir con el cálculo original.
  const resultCard=document.getElementById('diagResultCard');
  if(resultCard){
    const observer=new MutationObserver(()=>setTimeout(enhanceResult,0));
    observer.observe(resultCard,{childList:true});
  }

  document.querySelectorAll('[data-diag-device]').forEach(btn=>btn.addEventListener('click',()=>resetContext()));
  document.getElementById('diagBackSymptom')?.addEventListener('click',()=>{document.getElementById('diagCrossContext')?.remove();});
  document.getElementById('diagRestart')?.addEventListener('click',()=>{resetContext();document.getElementById('diagCrossContext')?.remove();});

  // Expuesto sólo como resumen no sensible para futuras integraciones del frontend.
  window.NextfutureDiagnostic={summary:getSummary,context:()=>({device:diagState.device,primary:state.primary,secondaries:[...state.secondaries],onset:state.onset,antecedent:state.antecedent,dataImportant:state.dataImportant})};
})();
