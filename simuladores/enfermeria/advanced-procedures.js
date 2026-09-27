(() => {
  const ADVANCED = {
    oxygen: {
      icon:'🫁', title:'Oxigenoterapia simulada', subtitle:'Dispositivo · indicación · reevaluación',
      warning:'Ejercicio educativo. El dispositivo, los parámetros y los objetivos reales dependen de la prescripción, el paciente y el protocolo institucional.',
      materials:['Indicación del escenario','Dispositivo indicado','Fuente simulada de oxígeno','Oxímetro','Registro'],
      steps:[
        { q:'¿Qué corresponde verificar antes de iniciar?', options:['Identidad, valoración respiratoria e indicación del escenario','Elegir un dispositivo al azar','Modificar la indicación según preferencia'], correct:0 },
        { q:'¿Cómo elegís el dispositivo en esta práctica?', options:['Usando el dispositivo especificado por la indicación simulada y el protocolo','Usando siempre el mismo para todos','Eligiendo el que tenga mejor aspecto'], correct:0 },
        { q:'Una vez colocado el dispositivo en la simulación, ¿qué sigue?', options:['Comprobar tolerancia, funcionamiento y volver a valorar al paciente','Dar por terminado el caso sin reevaluar','Ignorar la respuesta del paciente'], correct:0 },
        { q:'¿Qué completa el procedimiento?', options:['Registrar dispositivo, parámetros indicados, SpO₂ y respuesta simulada','Anotar solamente que se usó oxígeno','Modificar el registro para obtener un valor normal'], correct:0 }
      ],
      result:c => `Reevaluación simulada: SpO₂ ${c.improvedVitals?.sat ?? c.vitals.sat}% · ${c.improvedVitals?.status || 'paciente reevaluado'}.`,
      action:'reassess'
    },
    medication: {
      icon:'💉', title:'Administración segura de medicación', subtitle:'Verificaciones · cálculo · registro',
      warning:'La simulación usa medicamentos ficticios y no enseña una técnica invasiva real. Vías, preparación y administración deben aprenderse con docentes y protocolos institucionales.',
      materials:['Indicación ficticia','Registro del paciente','Cálculo verificado','Material simulado','Registro final'],
      steps:[
        { q:'¿Qué verificás antes de preparar la medicación ficticia?', options:['Identidad, alergias, indicación, medicamento, dosis, vía y momento del escenario','Solo el nombre del medicamento','Únicamente el horario'], correct:0 },
        { q:'¿Qué debe ocurrir con el cálculo?', options:['Debe comprobarse antes de continuar y concordar con la presentación del ejercicio','Se puede estimar mentalmente sin revisar','Se corrige después de administrar'], correct:0 },
        { q:'Antes de la administración simulada, ¿qué corresponde?', options:['Comparar nuevamente indicación, paciente, vía ficticia y registro','Omitir la segunda verificación','Cambiar la vía si parece más cómoda'], correct:0 },
        { q:'¿Cómo se cierra el procedimiento?', options:['Registrar lo realizado y reevaluar la respuesta simulada','Descartar el registro','Asumir que no habrá cambios'], correct:0 }
      ],
      result:c => `Administración ficticia completada. Cálculo del caso: ${String(c.medication.answer).replace('.', ',')} mL.`,
      action:'reassess'
    }
  };

  const AVAILABILITY = {
    'respiratorio-01':['oxygen'],
    'quirurgico-01':['medication'],
    'cardiovascular-01':['medication'],
    'respiratorio-02':['oxygen','medication'],
    'medicacion-01':['medication'],
    'urgencias-01':['oxygen']
  };

  let runtime = { active:null, materials:new Set(), step:0, errors:0, completed:new Set(), started:false };
  let originalLoadCase = null;

  function ensureStyles(){
    if(document.querySelector('link[data-advanced-procedure-styles]')) return;
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='./advanced-procedures.css'; link.dataset.advancedProcedureStyles='true'; document.head.appendChild(link);
  }

  function extendInteractions(){
    const cfg=window.NURSING_INTERACTIONS; if(!cfg) return;
    Object.assign(cfg.cases, {
      'cardiovascular-01': { defaultHint:'Explorá estado general, tórax, presión y saturación antes de avanzar.', findings:{
        'observe:head':{title:'Estado general',text:'Paciente consciente, preocupado y capaz de responder.',actionId:'identity'},
        'observe:chest':{title:'Síntoma principal',text:'Refiere opresión torácica de inicio reciente.',actionId:'pain'},
        'bp:arm':{title:'Presión arterial',text:'TA simulada: 158/92 mmHg.',actionId:'vitals'},
        'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 94%.',actionId:'vitals'},
        'stethoscope:chest':{title:'Auscultación simulada',text:'Hallazgo presentado solo como dato del escenario; integralo con el resto de la valoración.',actionId:'monitor'}
      }},
      'respiratorio-02': { defaultHint:'Priorizá tórax, oximetría y reevaluación respiratoria.', findings:{
        'observe:chest':{title:'Patrón respiratorio',text:'Se observa aumento del trabajo respiratorio dentro del escenario.',actionId:'resp'},
        'stethoscope:chest':{title:'Auscultación simulada',text:'El caso presenta ruidos respiratorios alterados como dato educativo.',actionId:'resp'},
        'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada inicial: 89%.',actionId:'vitals'},
        'bp:arm':{title:'Presión arterial',text:'TA simulada: 138/84 mmHg.',actionId:'vitals'},
        'observe:head':{title:'Estado general',text:'Paciente consciente, fatigada y colaboradora.',actionId:'identity'}
      }},
      'medicacion-01': { defaultHint:'Antes de administrar, explorá identidad, alergias, parámetros y registro.', findings:{
        'observe:head':{title:'Estado general',text:'Paciente consciente, orientada y clínicamente estable.',actionId:'identity'},
        'bp:arm':{title:'Presión arterial',text:'TA simulada: 122/76 mmHg.',actionId:'vitals'},
        'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 98%.',actionId:'vitals'},
        'observe:arm':{title:'Revisión del escenario',text:'No realices una administración invasiva desde este mapa. Primero completá las verificaciones del taller.',actionId:'orders'}
      }},
      'urgencias-01': { defaultHint:'Priorizá estado general, parámetros y vigilancia del paciente.', findings:{
        'observe:head':{title:'Estado neurológico',text:'Paciente consciente, ansioso y responde adecuadamente.',actionId:'consciousness'},
        'bp:arm':{title:'Presión arterial',text:'TA simulada: 92/58 mmHg.',actionId:'vitals'},
        'oximeter:hand':{title:'Oximetría',text:'SpO₂ simulada: 95%.',actionId:'vitals'},
        'observe:legs':{title:'Seguridad',text:'El paciente refiere mareo intenso; el escenario requiere precaución con la movilización.'}
      }}
    });
  }

  function available(){ return AVAILABILITY[currentCase?.id] || []; }

  function mount(){
    ensureStyles(); extendInteractions();
    const anchor=document.querySelector('.procedureWorkshop') || document.querySelector('.bedsideLab');
    if(!anchor || document.querySelector('.advancedProcedureWorkshop')) return;
    const section=document.createElement('section'); section.className='advancedProcedureWorkshop'; anchor.insertAdjacentElement('afterend',section); render();
  }

  function render(){
    const root=document.querySelector('.advancedProcedureWorkshop'); if(!root || !currentCase) return;
    const ids=available();
    if(!ids.length){ root.innerHTML=''; root.hidden=true; return; }
    root.hidden=false;
    root.innerHTML=`<div class="advancedHead"><div><span class="eyebrow">Procedimientos aplicados al caso</span><h3>Simulación visual avanzada</h3><p>Completá las verificaciones y observá cómo cambia el estado del paciente en el ejercicio.</p></div><span>${runtime.completed.size}/${ids.length}</span></div>
      <div class="advancedCards">${ids.map(id=>{const p=ADVANCED[id];const done=runtime.completed.has(id);return `<button data-advanced="${id}" class="advancedCard ${done?'done':''}"><span>${p.icon}</span><b>${p.title}</b><small>${p.subtitle}</small><em>${done?'✓ Completado':'Abrir simulación →'}</em></button>`}).join('')}</div>
      <div id="advancedStage" class="advancedStage ${runtime.active?'open':''}"></div>`;
    root.querySelectorAll('[data-advanced]').forEach(btn=>btn.addEventListener('click',()=>open(btn.dataset.advanced)));
    if(runtime.active) renderStage();
  }

  function open(id){ if(!ADVANCED[id]) return; runtime.active=id;runtime.materials=new Set();runtime.step=0;runtime.errors=0;runtime.started=false;render();document.querySelector('#advancedStage')?.scrollIntoView({behavior:'smooth',block:'nearest'}); }

  function renderStage(message=''){
    const stage=document.querySelector('#advancedStage');const p=ADVANCED[runtime.active];if(!stage||!p)return;
    if(!runtime.started){
      const ready=p.materials.every(x=>runtime.materials.has(x));
      stage.innerHTML=`<div class="advTop"><div class="advIcon">${p.icon}</div><div><span class="eyebrow">Preparación</span><h4>${p.title}</h4><p>Prepará el escenario seleccionando los elementos necesarios.</p></div><button data-adv-close>×</button></div><div class="advWarning">⚠️ ${p.warning}</div><div class="advMaterials">${p.materials.map(m=>`<button data-adv-material="${escapeAttr(m)}" class="${runtime.materials.has(m)?'selected':''}">${runtime.materials.has(m)?'✓ ':''}${m}</button>`).join('')}</div><button id="advStart" class="primaryBtn" ${ready?'':'disabled'}>Comenzar ${ready?'→':`(${runtime.materials.size}/${p.materials.length})`}</button>${message?`<div class="advMessage">${message}</div>`:''}`;
      stage.querySelectorAll('[data-adv-material]').forEach(btn=>btn.addEventListener('click',()=>{const m=btn.dataset.advMaterial;runtime.materials.has(m)?runtime.materials.delete(m):runtime.materials.add(m);renderStage()}));
      stage.querySelector('[data-adv-close]')?.addEventListener('click',close); stage.querySelector('#advStart')?.addEventListener('click',()=>{if(ready){runtime.started=true;renderStage()}}); return;
    }
    const step=p.steps[runtime.step]; if(!step) return complete();
    const progress=Math.round((runtime.step/p.steps.length)*100);
    stage.innerHTML=`<div class="advTop"><div class="advIcon active">${p.icon}</div><div><span class="eyebrow">Paso ${runtime.step+1} de ${p.steps.length}</span><h4>${p.title}</h4><p>${step.q}</p></div><button data-adv-close>×</button></div><div class="advProgress"><i style="width:${progress}%"></i></div><div class="advChoices">${step.options.map((o,i)=>`<button data-adv-choice="${i}">${o}</button>`).join('')}</div>${message?`<div class="advMessage">${message}</div>`:''}`;
    stage.querySelectorAll('[data-adv-choice]').forEach(btn=>btn.addEventListener('click',()=>answer(Number(btn.dataset.advChoice)))); stage.querySelector('[data-adv-close]')?.addEventListener('click',close);
  }

  function answer(index){const p=ADVANCED[runtime.active],step=p.steps[runtime.step];if(index!==step.correct){runtime.errors++;if(typeof state!=='undefined')state.errors++;if(typeof updateProgress==='function')updateProgress();return renderStage('Esa opción no corresponde en este punto. Revisá la secuencia y volvé a intentar.')}runtime.step++;runtime.step>=p.steps.length?complete():renderStage('✓ Paso correcto. Continuá.');}

  function complete(){
    const stage=document.querySelector('#advancedStage'),p=ADVANCED[runtime.active];runtime.completed.add(runtime.active);
    if(p.action && typeof doAction==='function' && currentCase.actions?.some(a=>a.id===p.action)) doAction(p.action,'advanced');
    if(runtime.active==='oxygen' && currentCase.improvedVitals){
      document.querySelector('#vitalSat').textContent=currentCase.improvedVitals.sat;
      document.querySelector('#monitorSat').textContent=`${currentCase.improvedVitals.sat}%`;
      document.querySelector('#patientMood').textContent=currentCase.improvedVitals.status;
      document.querySelector('#patientMood').className='statusPill good';
      document.querySelector('#patientFigure')?.classList.add('improved');
    }
    stage.innerHTML=`<div class="advComplete"><span>✓</span><div><span class="eyebrow">Procedimiento completado</span><h4>${p.title}</h4><p>${p.result(currentCase)}</p><small>Intentos a revisar: ${runtime.errors}. La técnica real siempre se valida con práctica supervisada y protocolos institucionales.</small></div></div><div class="advActions"><button class="secondaryBtn" data-adv-repeat>Repetir</button><button class="primaryBtn" data-adv-close>Cerrar</button></div>`;
    stage.querySelector('[data-adv-repeat]')?.addEventListener('click',()=>open(runtime.active));stage.querySelector('[data-adv-close]')?.addEventListener('click',close);
    document.querySelector('.advancedHead>span').textContent=`${runtime.completed.size}/${available().length}`;document.querySelectorAll('[data-advanced]').forEach(btn=>{if(runtime.completed.has(btn.dataset.advanced)){btn.classList.add('done');btn.querySelector('em').textContent='✓ Completado'}});
  }

  function close(){runtime.active=null;runtime.materials=new Set();runtime.step=0;runtime.started=false;render();}
  function reset(){runtime={active:null,materials:new Set(),step:0,errors:0,completed:new Set(),started:false};document.querySelector('.advancedProcedureWorkshop')?.remove();setTimeout(mount,20);}
  function escapeAttr(v){return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function hook(){if(typeof loadCase!=='function'||originalLoadCase)return;originalLoadCase=loadCase;loadCase=function(id,scroll=false){const r=originalLoadCase(id,scroll);reset();return r}}
  function init(){extendInteractions();hook();setTimeout(mount,120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();