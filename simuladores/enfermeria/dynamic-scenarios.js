(() => {
  const CONFIG = {
    'respiratorio-02': {
      label:'Evolución respiratoria', tone:'respiratory',
      priority:'Valorar respiración, parámetros, indicación del escenario y reevaluación.',
      phases:[
        { at:3, key:'resp-watch', requires:['vitals','resp'], status:'Disnea en aumento', vitals:{hr:103,rr:29,sat:87}, severity:58, text:'La paciente refiere mayor esfuerzo al hablar y el monitor muestra una caída simulada de la saturación.' },
        { at:6, key:'resp-delay', requires:['orders'], status:'Requiere reevaluación prioritaria', vitals:{hr:108,rr:31,sat:86}, severity:72, text:'El escenario progresa porque todavía no se organizó la intervención indicada. Reevaluá prioridades.' }
      ],
      recovery:{ requires:['vitals','resp','orders','reassess'], status:'Respuesta favorable simulada', vitals:{hr:94,rr:22,sat:93}, severity:24, text:'Tras completar la secuencia prioritaria del escenario, la reevaluación muestra una evolución favorable.' }
    },
    'urgencias-01': {
      label:'Escenario de urgencias', tone:'urgent',
      priority:'Identificar cambios, controlar parámetros, valorar estado neurológico y activar el circuito del escenario.',
      phases:[
        { at:2, key:'urgent-vitals', requires:['vitals'], status:'Mareo persistente', vitals:{bp:'88/54',hr:124,rr:25,sat:94}, severity:68, text:'Sin un control temprano de parámetros, el escenario muestra mayor inestabilidad.' },
        { at:5, key:'urgent-route', requires:['orders'], status:'Inestabilidad simulada', vitals:{bp:'86/52',hr:128,rr:27,sat:94}, severity:82, text:'El estado continúa cambiando mientras no se organiza el circuito de atención del ejercicio.' }
      ],
      recovery:{ requires:['vitals','consciousness','orders','reassess'], status:'En vigilancia simulada', vitals:{bp:'98/62',hr:104,rr:21,sat:96}, severity:30, text:'La reevaluación del caso muestra una tendencia más estable luego de completar las prioridades planteadas.' }
    },
    'cardiovascular-01': {
      label:'Vigilancia cardiovascular', tone:'cardiac',
      priority:'Caracterizar el síntoma, controlar parámetros, mantener vigilancia y revisar indicaciones.',
      phases:[
        { at:4, key:'cardiac-pain', requires:['pain','vitals'], status:'Molestia persistente', vitals:{bp:'162/94',hr:110,rr:23,sat:93}, severity:60, text:'La molestia persiste y los parámetros del escenario cambian mientras falta completar la valoración inicial.' },
        { at:7, key:'cardiac-monitor', requires:['monitor','orders'], status:'Requiere vigilancia estrecha', vitals:{bp:'164/96',hr:112,rr:24,sat:93}, severity:70, text:'El escenario marca que todavía faltan vigilancia e indicaciones organizadas.' }
      ],
      recovery:{ requires:['pain','vitals','monitor','orders'], status:'Más tranquilo y monitorizado', vitals:{bp:'150/88',hr:98,rr:20,sat:95}, severity:28, text:'Con la valoración y vigilancia organizadas, el escenario muestra una evolución más estable.' }
    },
    'pediatria-01': {
      label:'Evolución pediátrica', tone:'pediatric',
      priority:'Comunicación adaptada, respiración, signos vitales e ingesta/hidratación.',
      phases:[
        { at:4, key:'ped-assessment', requires:['communication','vitals','resp'], status:'Más cansado', vitals:{hr:116,rr:27,temp:'38,5',sat:95}, severity:52, text:'Mateo se muestra más cansado en el escenario y requiere que ordenes la valoración.' },
        { at:7, key:'ped-hydration', requires:['hydration'], status:'Decaimiento persistente', vitals:{hr:118,rr:27,temp:'38,6',sat:95}, severity:62, text:'La menor ingesta sigue siendo un dato relevante que todavía no fue integrado a la valoración.' }
      ],
      recovery:{ requires:['communication','vitals','resp','hydration'], status:'Más tranquilo', vitals:{hr:106,rr:22,temp:'38,1',sat:97}, severity:24, text:'Al completar la valoración pediátrica del ejercicio, el niño se muestra más tranquilo y los parámetros se estabilizan dentro de la simulación.' }
    },
    'salud-mental-01': {
      label:'Evolución emocional', tone:'mental',
      priority:'Seguridad, escucha activa y reducción de estímulos antes de cerrar el caso.',
      phases:[
        { at:3, key:'mental-env', requires:['environment','listen'], status:'Ansiedad sostenida', vitals:{hr:108,rr:25,sat:98}, severity:55, text:'El escenario muestra mayor inquietud mientras el ambiente y la comunicación todavía no fueron abordados.' },
        { at:6, key:'mental-safety', requires:['safety'], status:'Necesita mayor contención', vitals:{hr:110,rr:25,sat:98}, severity:66, text:'Aún falta una valoración explícita de seguridad dentro del ejercicio.' }
      ],
      recovery:{ requires:['environment','listen','safety','reassess'], status:'Más contenida', vitals:{hr:92,rr:19,sat:98}, severity:20, text:'La combinación de ambiente tranquilo, escucha, seguridad y reevaluación reduce la intensidad simulada del episodio.' }
    }
  };

  let runtime = freshRuntime();
  let tickId = null;
  let hookAttempts = 0;

  function freshRuntime(){
    return { caseId:null, minute:0, severity:20, events:[], fired:new Set(), badChoices:0, timely:0, recovered:false, lastTick:Date.now(), currentVitals:{}, currentStatus:'' };
  }

  function ensureStyles(){
    if(document.querySelector('link[data-dynamic-scenario-styles]')) return;
    const link=document.createElement('link');link.rel='stylesheet';link.href='./dynamic-scenarios.css';link.dataset.dynamicScenarioStyles='true';document.head.appendChild(link);
  }

  function config(){ return currentCase ? CONFIG[currentCase.id] : null; }

  function mount(){
    ensureStyles();
    const vitals=document.querySelector('.vitalsGrid');
    if(!vitals || document.querySelector('.dynamicScenarioCard')) return;
    const card=document.createElement('section');card.className='dynamicScenarioCard';vitals.insertAdjacentElement('afterend',card);render();
  }

  function render(){
    const root=document.querySelector('.dynamicScenarioCard');if(!root) return;
    const cfg=config();
    if(!cfg){root.hidden=true;clearPatientTone();return;}
    root.hidden=false;
    const level=runtime.severity>=75?'critical':runtime.severity>=50?'warning':runtime.recovered?'stable':'watch';
    const exam=document.body.classList.contains('examMode');
    root.className=`dynamicScenarioCard ${level}`;
    root.innerHTML=`
      <div class="dynamicTop"><div><span class="eyebrow">Paciente dinámico</span><h3>${cfg.label}</h3></div><div class="simClock"><small>Tiempo simulado</small><b>${runtime.minute} min</b></div></div>
      <div class="dynamicMeter"><i style="width:${Math.max(8,Math.min(100,runtime.severity))}%"></i></div>
      <div class="dynamicState"><span class="stateDot"></span><b>${runtime.currentStatus || document.querySelector('#patientMood')?.textContent || currentCase.patient.status}</b></div>
      <p class="dynamicPriority">${exam?'El estado puede cambiar durante la evaluación. Observá y reevaluá.':`<b>Prioridad del ejercicio:</b> ${cfg.priority}`}</p>
      <div class="dynamicEvents">${renderEvents(exam)}</div>
      <div class="dynamicFooter"><span>${runtime.timely} prioridades resueltas antes del evento</span><span>${runtime.badChoices} decisiones de seguridad a revisar</span></div>`;
    applyPatientTone(level,cfg.tone);
  }

  function renderEvents(exam){
    if(!runtime.events.length) return '<span class="dynamicEmpty">Todavía no hubo cambios significativos.</span>';
    return runtime.events.slice(-3).reverse().map(e=>`<article class="dynamicEvent ${e.kind}"><time>Min ${e.minute}</time><p>${exam && e.kind==='warning' ? 'El estado del paciente cambió. Reevaluá los datos disponibles.' : e.text}</p></article>`).join('');
  }

  function applyPatientTone(level,tone){
    const room=document.querySelector('.patientRoom');const figure=document.querySelector('#patientFigure');
    if(room){room.dataset.dynamicLevel=level;room.dataset.dynamicTone=tone||'';}
    if(figure){figure.classList.toggle('dynamicStress',level==='warning'||level==='critical');}
  }
  function clearPatientTone(){const room=document.querySelector('.patientRoom');const figure=document.querySelector('#patientFigure');if(room){delete room.dataset.dynamicLevel;delete room.dataset.dynamicTone;}figure?.classList.remove('dynamicStress');}

  function setVitals(values={}){
    runtime.currentVitals={...runtime.currentVitals,...values};
    const map={bp:'#vitalBp',hr:'#vitalHr',rr:'#vitalRr',temp:'#vitalTemp',sat:'#vitalSat'};
    Object.entries(values).forEach(([key,value])=>{const el=document.querySelector(map[key]);if(el)el.textContent=value;});
    if(values.sat!==undefined){const monitor=document.querySelector('#monitorSat');if(monitor)monitor.textContent=`${values.sat}%`;}
  }

  function addEvent(kind,text){runtime.events.push({kind,text,minute:runtime.minute});showToast(kind,text);}
  function showToast(kind,text){
    let toast=document.querySelector('.dynamicToast');if(!toast){toast=document.createElement('div');toast.className='dynamicToast';document.body.appendChild(toast);}
    toast.className=`dynamicToast show ${kind}`;toast.innerHTML=`<b>${kind==='recovery'?'Evolución favorable':'Cambio en el escenario'}</b><span>${document.body.classList.contains('examMode') && kind==='warning'?'El paciente cambió. Volvé a valorar la situación.':text}</span>`;
    clearTimeout(toast._timer);toast._timer=setTimeout(()=>toast.classList.remove('show'),4200);
  }

  function completed(id){ return typeof state!=='undefined' && state.actions instanceof Set && state.actions.has(id); }
  function allDone(ids=[]){ return ids.every(completed); }

  function evaluate(){
    const cfg=config();if(!cfg || runtime.recovered) return;
    for(const phase of cfg.phases){
      if(runtime.minute<phase.at || runtime.fired.has(phase.key)) continue;
      if(allDone(phase.requires)){runtime.timely+=1;runtime.fired.add(phase.key);continue;}
      runtime.fired.add(phase.key);runtime.severity=Math.max(runtime.severity,phase.severity);setVitals(phase.vitals);setMood(phase.status,'warning');addEvent('warning',phase.text);
    }
    const recovery=cfg.recovery;
    if(recovery && allDone(recovery.requires)){
      runtime.recovered=true;runtime.severity=recovery.severity;setVitals(recovery.vitals);setMood(recovery.status,'good');document.querySelector('#patientFigure')?.classList.add('improved');addEvent('recovery',recovery.text);
    }
    render();
  }

  function setMood(text,type){runtime.currentStatus=text;const mood=document.querySelector('#patientMood');if(mood){mood.textContent=text;mood.className=`statusPill ${type==='good'?'good':'warning'}`;}}

  function restoreDynamicDisplay(){
    if(!config()) return;
    setVitals(runtime.currentVitals);
    setMood(runtime.currentStatus || currentCase.patient.status,runtime.recovered?'good':'warning');
  }

  function advance(amount=1,source='interaction'){
    if(!config()) return;
    runtime.minute+=amount;runtime.lastTick=Date.now();evaluate();render();
  }

  function registerUnsafe(actionId){
    const action=currentCase?.actions?.find(a=>a.id===actionId);if(!action || action.points!==0) return;
    runtime.badChoices+=1;runtime.severity=Math.min(95,runtime.severity+8);addEvent('warning','La decisión elegida no ayuda a la prioridad actual del escenario. El paciente requiere una nueva valoración.');render();
  }

  function resetForCase(){
    runtime=freshRuntime();runtime.caseId=currentCase?.id||null;runtime.severity=config()?28:20;
    if(currentCase){runtime.currentVitals={...currentCase.vitals};runtime.currentStatus=currentCase.patient.status;}
    const root=document.querySelector('.dynamicScenarioCard');if(root)root.remove();clearPatientTone();setTimeout(()=>{mount();render();},20);
  }

  function hookFunctions(){
    let hooked=false;
    if(typeof loadCase==='function' && !loadCase.__dynamicWrapped){const original=loadCase;loadCase=function(id,scroll=false){const r=original(id,scroll);setTimeout(resetForCase,0);return r;};loadCase.__dynamicWrapped=true;hooked=true;}
    if(typeof doAction==='function' && !doAction.__dynamicWrapped){const original=doAction;doAction=function(id,source='panel'){const wasDone=typeof state!=='undefined'&&state.actions?.has(id);const action=currentCase?.actions?.find(a=>a.id===id);const r=original(id,source);if(config()&&!wasDone){const cfg=config();if(action?.evolves && cfg?.recovery && !allDone(cfg.recovery.requires))restoreDynamicDisplay();advance(1,'action');registerUnsafe(id);evaluate();}return r;};doAction.__dynamicWrapped=true;hooked=true;}
    if(typeof askQuestion==='function' && !askQuestion.__dynamicWrapped){const original=askQuestion;askQuestion=function(id){const wasDone=typeof state!=='undefined'&&state.questions?.has(id);const r=original(id);if(config()&&!wasDone)advance(1,'question');return r;};askQuestion.__dynamicWrapped=true;hooked=true;}
    if(typeof exploreZone==='function' && !exploreZone.__dynamicWrapped){const original=exploreZone;exploreZone=function(zone){const before=typeof state!=='undefined'?state.explorations?.size:0;const r=original(zone);const after=typeof state!=='undefined'?state.explorations?.size:0;if(config()&&after>before)advance(1,'exploration');return r;};exploreZone.__dynamicWrapped=true;hooked=true;}
    if(typeof showResults==='function' && !showResults.__dynamicWrapped){const original=showResults;showResults=function(){const r=original();setTimeout(appendDebrief,0);return r;};showResults.__dynamicWrapped=true;hooked=true;}
    return hooked;
  }

  function appendDebrief(){
    if(!config()) return;const root=document.querySelector('#resultBreakdown');if(!root||root.querySelector('.dynamicDebrief'))return;
    const box=document.createElement('div');box.className='dynamicDebrief';box.innerHTML=`<b>Evolución dinámica</b><div><span>Tiempo simulado</span><strong>${runtime.minute} min</strong></div><div><span>Eventos de deterioro</span><strong>${runtime.events.filter(e=>e.kind==='warning').length}</strong></div><div><span>Prioridades resueltas a tiempo</span><strong>${runtime.timely}</strong></div><div><span>Decisiones a revisar</span><strong>${runtime.badChoices}</strong></div><div><span>Estado final</span><strong>${runtime.recovered?'Evolución favorable':'Requiere más reevaluación'}</strong></div>`;root.appendChild(box);
  }

  function startTicker(){
    clearInterval(tickId);tickId=setInterval(()=>{if(document.hidden||!config()||runtime.recovered)return;advance(1,'clock');},30000);
  }

  function init(){
    ensureStyles();mount();hookFunctions();startTicker();resetForCase();
    const retry=setInterval(()=>{hookAttempts+=1;hookFunctions();if(hookAttempts>12)clearInterval(retry);},500);
    window.addEventListener('nursing-cases-updated',()=>setTimeout(()=>{hookFunctions();resetForCase();},40));
    document.addEventListener('visibilitychange',()=>{runtime.lastTick=Date.now();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();