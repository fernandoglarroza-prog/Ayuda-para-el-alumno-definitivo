// Nextfuture V3.4 — árbol adaptativo y comprobaciones de síntomas secundarios
(function(){
  'use strict';
  const A={answers:{},visible:[],lastSignature:''};
  const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const ctx=()=>window.NextfutureDiagnostic?.context?.()||{};
  const symptom=(key=diagState.symptom)=>DIAG_DATA?.[diagState.device]?.symptoms?.[key]||null;
  const questionValue=name=>document.querySelector(`input[name="${CSS.escape(name)}"]:checked`)?.value||'';

  const DOMAIN_Q={
    power:{id:'power_known_good',text:'¿El comportamiento cambia usando un cargador, cable, toma o fuente que sabés que funcionan correctamente?',why:'Ayuda a separar el accesorio o alimentación externa del equipo.'},
    battery:{id:'battery_load',text:'¿El problema empeora claramente al exigir el equipo o al bajar el porcentaje de batería?',why:'Ayuda a distinguir autonomía/entrega de energía de otras fallas.'},
    display:{id:'display_alive',text:'Aunque la imagen falle, ¿el equipo parece seguir funcionando (sonidos, vibración, luces o actividad)?',why:'Permite separar pantalla/señal de una falla total de encendido.'},
    thermal:{id:'thermal_load',text:'¿La falla aparece o empeora después de varios minutos de uso o bajo carga?',why:'Relaciona el síntoma con temperatura o refrigeración.'},
    storage:{id:'storage_errors',text:'¿Hay errores al guardar, copiar o abrir archivos, además de lentitud?',why:'Ayuda a separar saturación de software de un almacenamiento degradado.'},
    software:{id:'software_safe',text:'¿El problema apareció después de una actualización, instalación o cambio de configuración?',why:'Da más peso a una causa lógica antes de cambiar piezas.'},
    network:{id:'network_other',text:'¿La misma función falla también con otra red, SIM o accesorio conocido?',why:'Separa el equipo de la red o accesorio externo.'},
    audio:{id:'audio_alt',text:'¿El audio funciona correctamente por otra salida o entrada (altavoz, auriculares, Bluetooth o grabación)?',why:'Ayuda a localizar si falla un módulo concreto o todo el circuito de audio.'},
    input:{id:'input_partial',text:'¿La falla afecta sólo una zona, tecla, botón o accesorio, y el resto responde normalmente?',why:'Diferencia una falla localizada de un problema de controlador o sistema.'},
    camera:{id:'camera_both',text:'¿Falla más de una cámara o sólo una de ellas?',why:'Permite diferenciar aplicación/sistema de un módulo de cámara concreto.'},
    physical:{id:'physical_event',text:'¿El síntoma apareció inmediatamente después de un golpe, humedad o manipulación física?',why:'Relaciona temporalmente la falla con un evento físico.'},
    board:{id:'board_warning',text:'¿Hay olor anormal, calor muy localizado, chasquidos, humo o comportamiento eléctrico extraño?',why:'Si aparece alguno de estos signos conviene suspender nuevas pruebas.',urgentYes:true}
  };

  function textOf(s){return norm([s?.label,s?.category,...(s?.causes||[])].join(' '));}
  function domainsFor(s){
    const t=textOf(s), out=[];
    const add=(id,keys)=>{if(keys.some(k=>t.includes(norm(k))))out.push(id);};
    add('power',['carga','cargador','puerto','jack','fuente','alimentacion','enciende','power']);
    add('battery',['bateria','autonomia','hinch']);
    add('display',['pantalla','display','imagen','tactil','panel','video','backlight','artefact']);
    add('thermal',['calienta','temperatura','ventilador','termic','disip']);
    add('storage',['disco','ssd','hdd','almacenamiento','archivo','espacio','datos']);
    add('software',['sistema','software','windows','android','ios','app','actualizacion','driver','cuenta','pin']);
    add('network',['wifi','bluetooth','senal','sim','gps','ethernet','red']);
    add('audio',['audio','parlante','microfono','auricular','sonido']);
    add('input',['teclado','touchpad','mouse','boton','usb','stylus','lapiz','sensor','huella']);
    add('camera',['camara','webcam','flash','linterna','enfoca']);
    add('physical',['golpe','caida','liquido','humedad','quebrado','bisagra','conector','flex']);
    add('board',['placa','circuito','gpu','motherboard','corto','electronica','baseband']);
    return [...new Set(out)];
  }

  function secondaryQuestions(){
    const c=ctx(); const out=[];
    (c.secondaries||[]).slice(0,2).forEach(key=>{
      const s=symptom(key); const q=s?.questions?.[0];
      if(!s||!q)return;
      out.push({id:`secondary_${key}_${q.id}`,text:`Sobre “${s.label}”: ${q.text}`,why:'Comprueba si el síntoma secundario realmente acompaña a la falla principal.',source:'secondary'});
    });
    return out;
  }

  function antecedentQuestions(){
    const c=ctx();
    const map={
      liquid:{id:'event_liquid_off',text:'Después del contacto con líquido, ¿el equipo quedó apagado y sin volver a cargarse?',why:'Evitar energía después de humedad reduce el riesgo de daño adicional.'},
      drop:{id:'event_drop_immediate',text:'¿La falla apareció inmediatamente después del golpe o caída?',why:'Una relación temporal directa aumenta el peso de conectores, pantalla o placa.'},
      update:{id:'event_update_before',text:'¿Antes de esa actualización o instalación el equipo funcionaba normalmente?',why:'Ayuda a separar una causa de software de una falla previa de hardware.'},
      charger:{id:'event_charger_original',text:'¿Con el cargador o accesorio anterior el equipo funcionaba mejor?',why:'Puede señalar incompatibilidad o falla del accesorio nuevo.'},
      power:{id:'event_power_signs',text:'¿Después del corte o sobretensión apareció olor, chispa, ruido o dejó de encender inmediatamente?',why:'Un evento eléctrico puede afectar fuente o etapas de alimentación.',urgentYes:true},
      repair:{id:'event_repair_after',text:'¿El problema comenzó justo después de la reparación o apertura anterior?',why:'Conviene revisar conexiones, flex y componentes intervenidos.'},
      heat:{id:'event_heat_shutdown',text:'¿El equipo llegó a apagarse o reiniciarse por temperatura?',why:'Un apagado bajo temperatura da más peso al sistema térmico.'}
    };
    return map[c.antecedent]?[map[c.antecedent]]:[];
  }

  function build(){
    if(!diagState.device||!diagState.symptom||diagState.symptom==='other')return [];
    const p=symptom(); const c=ctx();
    const score=new Map();
    domainsFor(p).forEach(d=>score.set(d,(score.get(d)||0)+3));
    (c.secondaries||[]).forEach(k=>domainsFor(symptom(k)).forEach(d=>score.set(d,(score.get(d)||0)+2)));
    if(c.antecedent==='liquid'||c.antecedent==='drop'||c.antecedent==='repair')score.set('physical',(score.get('physical')||0)+4);
    if(c.antecedent==='update')score.set('software',(score.get('software')||0)+5);
    if(c.antecedent==='charger'||c.antecedent==='power')score.set('power',(score.get('power')||0)+5);
    if(c.antecedent==='heat')score.set('thermal',(score.get('thermal')||0)+5);
    const ranked=[...score.entries()].sort((a,b)=>b[1]-a[1]).map(([d])=>d);
    const used=new Set(); const out=[];
    for(const d of ranked){
      const q=DOMAIN_Q[d]; if(q&&!used.has(q.id)){out.push({...q,source:'domain',domain:d});used.add(q.id);} if(out.length>=2)break;
    }
    for(const q of antecedentQuestions()){if(!used.has(q.id)&&out.length<3){out.push({...q,source:'event'});used.add(q.id);}}
    for(const q of secondaryQuestions()){if(!used.has(q.id)&&out.length<4){out.push(q);used.add(q.id);}}
    return out.slice(0,4);
  }

  function signature(qs){const c=ctx();return [diagState.device,diagState.symptom,(c.secondaries||[]).join(','),c.antecedent,qs.map(q=>q.id).join(',')].join('|');}

  function render(){
    const list=document.getElementById('diagQuestions'); if(!list)return;
    const qs=build(); const sig=signature(qs);
    if(sig===A.lastSignature&&document.getElementById('diagAdaptivePanel'))return;
    A.lastSignature=sig; A.visible=qs;
    document.getElementById('diagAdaptivePanel')?.remove();
    if(!qs.length)return;
    const panel=document.createElement('section'); panel.id='diagAdaptivePanel'; panel.className='diag-adaptive-panel';
    panel.innerHTML=`<div class="diag-adaptive-head"><div><small>ÁRBOL ADAPTATIVO</small><h4>Preguntas que dependen de lo que contaste</h4><p>No son obligatorias, pero ayudan a separar mejor las causas. Si no sabés, marcá “No sé”.</p></div><span>${qs.length} comprobación${qs.length!==1?'es':''}</span></div><div class="diag-adaptive-list">${qs.map((q,i)=>`<article class="diag-adaptive-q" data-aqid="${esc(q.id)}"><div class="diag-adaptive-num">${i+1}</div><div><b>${esc(q.text)}</b><small>${esc(q.why)}</small><div class="diag-adaptive-options"><label><input type="radio" name="nf34_${esc(q.id)}" value="yes" ${A.answers[q.id]==='yes'?'checked':''}> Sí</label><label><input type="radio" name="nf34_${esc(q.id)}" value="no" ${A.answers[q.id]==='no'?'checked':''}> No</label><label><input type="radio" name="nf34_${esc(q.id)}" value="unknown" ${A.answers[q.id]==='unknown'?'checked':''}> No sé</label></div></div></article>`).join('')}</div>`;
    list.insertAdjacentElement('afterend',panel);
    panel.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener('change',()=>{
      const id=input.name.replace(/^nf34_/,''); A.answers[id]=input.value;
      if(A.visible.find(q=>q.id===id)?.urgentYes&&input.value==='yes') showSafety();
    }));
  }

  function showSafety(){
    let b=document.getElementById('diagAdaptiveSafety');
    if(!b){b=document.createElement('div');b.id='diagAdaptiveSafety';b.className='diag-adaptive-safety';b.innerHTML='<b>Detené las pruebas.</b><span>Si hay humo, olor a quemado, calor localizado, batería deformada o comportamiento eléctrico anormal, apagá/desconectá el equipo si hacerlo es seguro y coordiná una revisión.</span>';document.getElementById('diagAdaptivePanel')?.prepend(b);}
  }

  function answerByText(re){
    const s=symptom(); if(!s)return '';
    const q=(s.questions||[]).find(x=>re.test(norm(x.text))); if(!q)return '';
    return diagState.answers?.[q.id]||questionValue(`diag_${q.id}`);
  }

  function hypotheses(){
    const c=ctx(); const p=symptom(); const all=[p,...(c.secondaries||[]).map(k=>symptom(k))].filter(Boolean);
    const t=norm(all.map(x=>[x.label,...(x.causes||[])].join(' ')).join(' '));
    const h=[]; const add=(title,reason,priority=1)=>{if(!h.some(x=>x.title===title))h.push({title,reason,priority});};
    if(c.antecedent==='liquid')add('Humedad, corrosión o corto','El antecedente de líquido obliga a revisar primero daño físico y eléctrico.',5);
    if(c.antecedent==='power')add('Alimentación / fuente / etapa de entrada','La falla está asociada a un corte o sobretensión.',5);
    if((/carga|cargador|puerto/.test(t)&&/bateria|autonomia/.test(t))||(/carga/.test(t)&&/calienta|temperatura/.test(t)))add('Sistema de carga y batería','La combinación de carga, autonomía y/o temperatura apunta primero al conjunto de alimentación.',4);
    if(/calienta|temperatura|ventilador/.test(t)&&/reinicia|apaga|congela/.test(t))add('Sistema térmico','La falla aparece junto con temperatura e inestabilidad.',4);
    if(/pantalla|imagen|display/.test(t)&&answerByText(/imagen|monitor externo|tv externo|sonido|vibracion/)==='yes')add('Pantalla, flex o señal de video','Hay señales de que el equipo sigue funcionando aunque la imagen falle.',4);
    if(/wifi/.test(t)&&/bluetooth/.test(t))add('Módulo inalámbrico o software de conectividad','Wi‑Fi y Bluetooth fallando juntos comparten parte del subsistema inalámbrico.',3);
    if(/sim|senal|datos moviles/.test(t)&&/sim|baseband|antena|radiofrecuencia/.test(t))add('SIM, antena o radiofrecuencia','Los síntomas móviles requieren separar operador/SIM de hardware de radio.',3);
    if(/lento|traba|almacenamiento|disco|ssd|hdd/.test(t))add('Almacenamiento y sistema','Lentitud junto con errores de almacenamiento puede venir de saturación o unidad degradada.',3);
    if(c.antecedent==='update')add('Sistema, actualización o controlador','El inicio después de una actualización da prioridad a revisar software antes de sustituir piezas.',4);
    if(c.antecedent==='drop')add('Conectores, pantalla o placa por impacto','La relación con un golpe aumenta el peso de daños físicos o conexiones.',4);
    domainsFor(p).forEach(d=>{const labels={power:'Alimentación',battery:'Batería',display:'Pantalla / imagen',thermal:'Refrigeración',storage:'Almacenamiento',software:'Software / sistema',network:'Conectividad',audio:'Audio',input:'Controles / periféricos',camera:'Cámara',physical:'Daño físico',board:'Placa / electrónica'};if(h.length<3&&labels[d])add(labels[d],'Coincide con el síntoma principal y debe verificarse durante la revisión.',2);});
    return h.sort((a,b)=>b.priority-a.priority).slice(0,3);
  }

  function resultSummary(){
    const card=document.getElementById('diagResultCard'); if(!card||!card.children.length||card.querySelector('#diagAdaptiveResult')||diagState.symptom==='other')return;
    const hs=hypotheses(); const answered=A.visible.map(q=>({q,v:A.answers[q.id]})).filter(x=>x.v);
    const sec=document.createElement('section');sec.id='diagAdaptiveResult';sec.className='diag-adaptive-result';
    sec.innerHTML=`<div class="diag-adaptive-result-head"><div><small>RAZONAMIENTO ADAPTATIVO</small><h3>Qué conviene verificar primero</h3></div><span>NO ES DIAGNÓSTICO FINAL</span></div>${hs.length?`<div class="diag-hypotheses">${hs.map((h,i)=>`<article><span>${i+1}</span><div><b>${esc(h.title)}</b><p>${esc(h.reason)}</p></div></article>`).join('')}</div>`:''}<p class="diag-adaptive-disclaimer">El orden refleja coincidencia con los síntomas declarados y las respuestas; no representa una probabilidad matemática ni reemplaza mediciones o revisión física.</p>${answered.length?`<details class="diag-adaptive-answers"><summary>Ver respuestas adaptativas (${answered.length})</summary><ul>${answered.map(({q,v})=>`<li><b>${esc(q.text)}</b> — ${v==='yes'?'Sí':v==='no'?'No':'No sabe'}</li>`).join('')}</ul></details>`:''}`;
    card.appendChild(sec);
  }

  function adaptiveSummaryText(){
    const answered=A.visible.map(q=>({q,v:A.answers[q.id]})).filter(x=>x.v);
    if(!answered.length)return '';
    return ' Comprobaciones adaptativas: '+answered.map(({q,v})=>`${q.text} ${v==='yes'?'Sí':v==='no'?'No':'No sabe'}.`).join(' ');
  }

  document.addEventListener('change',e=>{
    if(e.target.matches?.('input[name^="diag_"], #crossOnset, #crossAntecedent, #crossDataImportant'))setTimeout(render,0);
  });
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-cross-key]'))setTimeout(render,0);
    if(e.target.closest?.('[data-diag-symptom]'))setTimeout(render,10);
    if(e.target.closest?.('#diagToRequest'))setTimeout(()=>{const issue=document.getElementById('rqIssue');if(issue&&!issue.value.includes('Comprobaciones adaptativas:'))issue.value+=adaptiveSummaryText();},60);
  });

  const qlist=document.getElementById('diagQuestions');
  if(qlist)new MutationObserver(()=>setTimeout(render,0)).observe(qlist,{childList:true,subtree:true});
  const rcard=document.getElementById('diagResultCard');
  if(rcard)new MutationObserver(()=>setTimeout(resultSummary,0)).observe(rcard,{childList:true});
  document.getElementById('diagRestart')?.addEventListener('click',()=>{A.answers={};A.visible=[];A.lastSignature='';document.getElementById('diagAdaptivePanel')?.remove();});
  document.getElementById('diagBackSymptom')?.addEventListener('click',()=>document.getElementById('diagAdaptivePanel')?.remove());
  window.NextfutureAdaptiveDiagnostic={answers:()=>({...A.answers}),hypotheses};
})();