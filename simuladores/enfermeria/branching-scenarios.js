(() => {
  const CONFIG = {
    'urgencias-01': {
      title:'Ruta de decisiones · urgencias', icon:'🚨',
      stages:[
        {
          title:'El escenario cambia',
          prompt:'El mareo persiste y los parámetros iniciales requieren seguimiento. ¿Cómo continuás dentro del ejercicio?',
          requires:['vitals','consciousness'],
          choices:[
            {id:'organize',label:'Organizar el circuito institucional simulado y mantener vigilancia',quality:'good',feedback:'Priorizaste continuidad, vigilancia y reevaluación.',info:'Nuevo dato: durante la observación el paciente sigue consciente, pero refiere que el mareo reaparece al intentar incorporarse.'},
            {id:'close',label:'Dar por cerrada la evaluación porque el paciente responde preguntas',quality:'bad',feedback:'El escenario todavía presenta cambios que necesitan reevaluación.',info:'Nuevo dato: el mareo continúa y el escenario no puede cerrarse todavía.'},
            {id:'delay',label:'Postergar los parámetros para completar preguntas no prioritarias',quality:'bad',feedback:'La secuencia pierde prioridad frente a un paciente inestable en la simulación.',info:'Nuevo dato: el monitor simulado muestra que los parámetros siguen cambiando.'}
          ]
        },
        {
          title:'Segunda decisión',
          prompt:'Con el nuevo dato disponible, ¿qué completa mejor esta rama del entrenamiento?',
          afterChoice:true,
          choices:[
            {id:'recheck',label:'Reevaluar cambios, registrar la tendencia y continuar el circuito del escenario',quality:'good',feedback:'La rama queda organizada con vigilancia y reevaluación.'},
            {id:'ignore',label:'Ignorar el cambio porque ya se hizo un control inicial',quality:'bad',feedback:'El ejercicio espera integrar la tendencia, no solo un valor aislado.'},
            {id:'walk',label:'Probar tolerancia haciendo caminar al paciente',quality:'bad',feedback:'La simulación plantea inestabilidad; esa decisión agrega un riesgo innecesario.'}
          ]
        }
      ],
      outcomes:{good:['Derivación/observación organizada','Completaste una ruta con vigilancia, circuito simulado y reevaluación.'],watch:['Observación prolongada','La ruta quedó parcialmente resuelta; aún faltan prioridades o una reevaluación completa.'],bad:['Cierre incompleto','El escenario termina con decisiones que requieren revisión antes de darlo por resuelto.']}
    },
    'respiratorio-02': {
      title:'Ruta de decisiones · respiratorio', icon:'🫁',
      stages:[
        {title:'Saturación en descenso',prompt:'La paciente refiere más esfuerzo al hablar y la SpO₂ simulada cambia. ¿Qué rama seguís?',requires:['vitals','resp'],choices:[
          {id:'verify',label:'Verificar la indicación respiratoria del escenario y preparar la reevaluación',quality:'good',feedback:'La decisión integra valoración, indicación y reevaluación.',info:'Nuevo dato: una vez organizada la intervención indicada, la paciente tolera el dispositivo simulado.'},
          {id:'guess',label:'Elegir un dispositivo al azar para avanzar más rápido',quality:'bad',feedback:'El ejercicio requiere verificar la indicación antes de elegir el dispositivo.',info:'Nuevo dato: la respuesta no puede interpretarse porque el procedimiento no siguió la consigna del escenario.'},
          {id:'unrelated',label:'Continuar con datos no respiratorios y dejar la SpO₂ para después',quality:'bad',feedback:'La situación simulada pide priorizar el cambio respiratorio.',info:'Nuevo dato: la disnea sigue siendo el dato dominante del escenario.'}
        ]},
        {title:'Respuesta al cambio',prompt:'¿Qué harías con la información que apareció después?',afterChoice:true,choices:[
          {id:'reassess',label:'Volver a valorar SpO₂, respiración, confort y registrar la respuesta simulada',quality:'good',feedback:'Completaste el circuito de intervención y reevaluación.'},
          {id:'assume',label:'Asumir que la paciente mejoró sin volver a controlar',quality:'bad',feedback:'La simulación espera comprobar la respuesta, no asumirla.'},
          {id:'remove',label:'Modificar el dispositivo sin revisar la indicación del caso',quality:'bad',feedback:'Los cambios deben mantenerse dentro de la indicación simulada.'}
        ]}
      ],
      outcomes:{good:['Estabilización simulada','La rama integra valoración, indicación y reevaluación de la respuesta.'],watch:['Continúa en observación','La paciente queda con seguimiento porque la ruta no se completó por entero.'],bad:['Respuesta no validada','La evolución no puede considerarse resuelta porque faltaron verificaciones o reevaluación.']}
    },
    'cardiovascular-01': {
      title:'Ruta de decisiones · cardiovascular', icon:'❤️',
      stages:[
        {title:'Molestia persistente',prompt:'La molestia torácica continúa y los parámetros cambian dentro del escenario. ¿Qué priorizás?',requires:['pain','vitals'],choices:[
          {id:'monitor',label:'Mantener vigilancia del caso y revisar las indicaciones simuladas',quality:'good',feedback:'Priorizaste vigilancia y continuidad del escenario.',info:'Nuevo dato: durante la vigilancia, la molestia disminuye parcialmente pero no desaparece por completo.'},
          {id:'walk',label:'Hacer caminar al paciente para ver si reaparece la molestia',quality:'bad',feedback:'El ejercicio no necesita provocar esfuerzo para obtener el dato.',info:'Nuevo dato: el escenario obliga a volver a priorizar seguridad y vigilancia.'},
          {id:'close',label:'Cerrar el caso porque la molestia disminuyó un poco',quality:'bad',feedback:'Una mejoría parcial no reemplaza la reevaluación del escenario.',info:'Nuevo dato: la molestia persiste de forma leve y todavía requiere seguimiento.'}
        ]},
        {title:'Tendencia clínica simulada',prompt:'La molestia cambió parcialmente. ¿Cómo cerrás esta rama?',afterChoice:true,choices:[
          {id:'trend',label:'Integrar síntomas, tendencia de parámetros, vigilancia y registro',quality:'good',feedback:'La rama queda cerrada con una reevaluación estructurada.'},
          {id:'single',label:'Usar solamente el último valor de presión para decidir',quality:'bad',feedback:'El ejercicio espera integrar tendencia y síntomas, no un único dato.'},
          {id:'dismiss',label:'Descartar el síntoma porque ahora es menos intenso',quality:'bad',feedback:'El escenario todavía requiere seguimiento y documentación.'}
        ]}
      ],
      outcomes:{good:['Vigilancia organizada','La ruta finaliza con seguimiento, tendencia y registro del escenario.'],watch:['Observación pendiente','Hay datos útiles, pero falta completar la continuidad del caso.'],bad:['Seguimiento insuficiente','El cierre omite parte de la vigilancia o la reevaluación necesarias dentro del ejercicio.']}
    },
    'pediatria-01': {
      title:'Ruta de decisiones · pediatría', icon:'👧',
      stages:[
        {title:'Nuevo dato del acompañante',prompt:'Mateo está más cansado y el acompañante refiere menor ingesta durante el día. ¿Cómo reorganizás la valoración?',requires:['communication','vitals'],choices:[
          {id:'integrate',label:'Integrar respiración, ingesta/hidratación y lo referido por el acompañante',quality:'good',feedback:'La decisión mantiene una valoración pediátrica amplia y centrada en el niño.',info:'Nuevo dato: Mateo acepta pequeños sorbos en el escenario y sigue colaborando cuando se le explica qué se va a hacer.'},
          {id:'temperature',label:'Mirar solo la temperatura y dejar el resto para el final',quality:'bad',feedback:'El caso contiene otros datos relevantes además de la fiebre.',info:'Nuevo dato: el cansancio y la menor ingesta continúan siendo relevantes.'},
          {id:'exclude',label:'Excluir al acompañante de la valoración sin una razón del escenario',quality:'bad',feedback:'La simulación espera integrar al adulto responsable y adaptar la comunicación.',info:'Nuevo dato: se pierde información importante sobre la evolución previa del niño.'}
        ]},
        {title:'Reevaluación pediátrica',prompt:'Con la nueva información, ¿qué cierre es más completo?',afterChoice:true,choices:[
          {id:'recheck',label:'Reevaluar estado general, respiración, ingesta y respuesta del niño',quality:'good',feedback:'La rama termina con reevaluación integral.'},
          {id:'numbers',label:'Registrar solo números sin observar cómo se encuentra Mateo',quality:'bad',feedback:'Los parámetros necesitan integrarse con la observación y la comunicación.'},
          {id:'rush',label:'Cerrar rápido porque el niño sigue despierto',quality:'bad',feedback:'El caso aún requiere integrar la evolución del escenario.'}
        ]}
      ],
      outcomes:{good:['Evolución favorable simulada','La ruta integra comunicación, acompañante, respiración e hidratación.'],watch:['Seguimiento pediátrico','La valoración avanzó, pero quedan elementos por integrar o reevaluar.'],bad:['Valoración incompleta','El cierre deja datos pediátricos relevantes sin integrar.']}
    },
    'salud-mental-01': {
      title:'Ruta de decisiones · salud mental', icon:'🧠',
      stages:[
        {title:'La ansiedad cambia',prompt:'Abril continúa inquieta pero puede expresar lo que siente. ¿Qué priorizás dentro del escenario?',requires:['environment','listen'],choices:[
          {id:'safety',label:'Mantener escucha, valorar seguridad y continuar en un ambiente tranquilo',quality:'good',feedback:'La rama mantiene comunicación terapéutica y seguridad.',info:'Nuevo dato: Abril dice que se siente segura, pero pide que alguien permanezca cerca mientras se calma.'},
          {id:'confront',label:'Confrontarla para que cambie rápidamente de actitud',quality:'bad',feedback:'La confrontación no ayuda al objetivo de comunicación terapéutica del caso.',info:'Nuevo dato: la paciente se muestra más incómoda con la interacción.'},
          {id:'alone',label:'Dejarla sola inmediatamente para que se tranquilice',quality:'bad',feedback:'El escenario todavía requiere valorar seguridad y necesidades de apoyo.',info:'Nuevo dato: Abril vuelve a pedir presencia y contención dentro de la simulación.'}
        ]},
        {title:'Cierre de la interacción',prompt:'¿Cómo integrás la respuesta que acaba de expresar?',afterChoice:true,choices:[
          {id:'reassess',label:'Reevaluar seguridad, respuesta emocional y documentar lo observado',quality:'good',feedback:'La rama se cierra con reevaluación y registro.'},
          {id:'promise',label:'Prometer que no volverá a sentirse así',quality:'bad',feedback:'El ejercicio evita promesas que no pueden garantizarse.'},
          {id:'dismiss',label:'Minimizar lo expresado porque los signos vitales no son extremos',quality:'bad',feedback:'La experiencia subjetiva y la seguridad siguen siendo parte central del escenario.'}
        ]}
      ],
      outcomes:{good:['Contención y seguimiento','La ruta finaliza con escucha, seguridad, reevaluación y registro.'],watch:['Seguimiento necesario','La situación está parcialmente contenida, pero falta completar la reevaluación.'],bad:['Interacción a revisar','El cierre contiene decisiones que dificultan el objetivo de comunicación terapéutica del escenario.']}
    }
  };

  let runtime = fresh();
  let hookAttempts = 0;

  function fresh(){ return {caseId:null, choices:[], info:[], errors:0, outcome:null}; }
  function cfg(){ return currentCase ? CONFIG[currentCase.id] : null; }
  function completedAction(id){ return typeof state!=='undefined' && state.actions instanceof Set && state.actions.has(id); }
  function requirementsMet(stage){ return !stage.requires || stage.requires.every(completedAction); }
  function examMode(){ return document.body.classList.contains('examMode'); }

  function ensureStyles(){
    if(document.querySelector('link[data-branching-styles]')) return;
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='./branching-scenarios.css'; link.dataset.branchingStyles='true'; document.head.appendChild(link);
  }

  function mount(){
    ensureStyles();
    const anchor=document.querySelector('.dynamicScenarioCard') || document.querySelector('.vitalsGrid');
    if(!anchor || document.querySelector('.branchingScenario')) return;
    const el=document.createElement('section'); el.className='branchingScenario'; anchor.insertAdjacentElement('afterend',el); render();
  }

  function render(){
    const root=document.querySelector('.branchingScenario'); if(!root) return;
    const c=cfg();
    if(!c){root.hidden=true;clearRoomOutcome();return;}
    root.hidden=false;
    const nextIndex=runtime.choices.length;
    const stage=c.stages[nextIndex];
    root.innerHTML=`
      <div class="branchHead"><div><span class="eyebrow">Caso ramificado</span><h3>${c.icon} ${c.title}</h3><p>Las decisiones pueden desbloquear nuevos datos y cambiar el cierre del escenario.</p></div><span class="branchBadge">${runtime.choices.length}/${c.stages.length} decisiones</span></div>
      <div class="branchPath">${c.stages.map((s,i)=>`${i?'<span class="branchArrow">→</span>':''}<span class="branchNode ${i<runtime.choices.length?'active':''}">${i<runtime.choices.length?'✓':'○'} ${s.title}</span>`).join('')}</div>
      ${runtime.info.length && !examMode()?`<div class="branchResult"><strong>Dato desbloqueado</strong>${runtime.info[runtime.info.length-1]}</div>`:''}
      ${stage ? renderStage(stage,nextIndex) : renderOutcome()}`;
    root.querySelectorAll('[data-branch-choice]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.branchChoice)));
  }

  function renderStage(stage,index){
    const unlocked=(index===0 ? requirementsMet(stage) : runtime.choices.length>=index);
    if(!unlocked){
      return `<div class="branchEvent locked"><div class="branchEventTop"><span>🔒</span><div><h4>${stage.title}</h4><p>${examMode()?'Este punto se desbloqueará cuando reúnas suficiente información.':`Todavía faltan datos del caso para habilitar esta decisión. Continuá con la valoración.`}</p></div></div></div>`;
    }
    return `<div class="branchEvent"><div class="branchEventTop"><span>🔀</span><div><h4>${stage.title}</h4><p>${stage.prompt}</p></div></div><div class="branchChoices">${stage.choices.map(ch=>`<button class="branchChoice" data-branch-choice="${ch.id}">${ch.label}</button>`).join('')}</div>${!examMode()?'<small class="branchHint">La devolución de esta decisión se integra al informe final del caso.</small>':''}</div>`;
  }

  function choose(id){
    const c=cfg(); if(!c) return;
    const index=runtime.choices.length; const stage=c.stages[index]; if(!stage) return;
    if(index===0 && !requirementsMet(stage)) return;
    const choice=stage.choices.find(x=>x.id===id); if(!choice) return;
    runtime.choices.push({stage:index,id:choice.id,label:choice.label,quality:choice.quality,feedback:choice.feedback});
    if(choice.info) runtime.info.push(choice.info);
    if(choice.quality==='bad'){
      runtime.errors+=1;
      if(typeof state!=='undefined'){state.errors=(state.errors||0)+1; if(typeof updateProgress==='function') updateProgress();}
    }
    if(runtime.choices.length>=c.stages.length){runtime.outcome=calculateOutcome();applyOutcomeVisual(runtime.outcome.key);} 
    render();
  }

  function calculateOutcome(){
    const c=cfg();
    const bad=runtime.choices.filter(x=>x.quality==='bad').length;
    const key=bad===0 && runtime.choices.length===c.stages.length ? 'good' : (bad<=1 && runtime.choices.length===c.stages.length ? 'watch' : 'bad');
    const [title,text]=c.outcomes[key]; return {key,title,text};
  }

  function renderOutcome(){
    const out=runtime.outcome || calculateOutcome(); runtime.outcome=out; applyOutcomeVisual(out.key);
    return `<div class="branchOutcome ${out.key==='bad'?'incomplete':out.key}"><b>${out.key==='good'?'✓':out.key==='watch'?'◐':'!'} ${out.title}</b><span>${examMode()?'La explicación detallada se mostrará al finalizar el caso.':out.text}</span></div>`;
  }

  function applyOutcomeVisual(key){
    const room=document.querySelector('.patientRoom'); if(room) room.dataset.branchOutcome=key==='good'?'good':key==='watch'?'watch':'incomplete';
  }
  function clearRoomOutcome(){const room=document.querySelector('.patientRoom');if(room)delete room.dataset.branchOutcome;}

  function reset(){
    runtime=fresh(); runtime.caseId=currentCase?.id||null; clearRoomOutcome();
    document.querySelector('.branchingScenario')?.remove(); setTimeout(mount,30);
  }

  function hook(){
    let changed=false;
    if(typeof loadCase==='function' && !loadCase.__branchWrapped){const original=loadCase;loadCase=function(id,scroll=false){const r=original(id,scroll);setTimeout(reset,10);return r;};loadCase.__branchWrapped=true;changed=true;}
    if(typeof doAction==='function' && !doAction.__branchWrapped){const original=doAction;doAction=function(id,source='panel'){const r=original(id,source);setTimeout(render,0);return r;};doAction.__branchWrapped=true;changed=true;}
    if(typeof askQuestion==='function' && !askQuestion.__branchWrapped){const original=askQuestion;askQuestion=function(id){const r=original(id);setTimeout(render,0);return r;};askQuestion.__branchWrapped=true;changed=true;}
    if(typeof exploreZone==='function' && !exploreZone.__branchWrapped){const original=exploreZone;exploreZone=function(zone){const r=original(zone);setTimeout(render,0);return r;};exploreZone.__branchWrapped=true;changed=true;}
    if(typeof showResults==='function' && !showResults.__branchWrapped){const original=showResults;showResults=function(){const r=original();setTimeout(appendDebrief,0);return r;};showResults.__branchWrapped=true;changed=true;}
    return changed;
  }

  function appendDebrief(){
    const c=cfg(); if(!c) return;
    const root=document.querySelector('#resultBreakdown'); if(!root || root.querySelector('.branchDebrief')) return;
    const out=runtime.outcome || calculateOutcome();
    const box=document.createElement('div'); box.className='branchDebrief';
    const path=runtime.choices.length?runtime.choices.map((x,i)=>`${i+1}. ${x.label}`).join(' → '):'No se completaron decisiones ramificadas';
    box.innerHTML=`<b>Ruta clínica simulada</b><div><span>Decisiones completadas</span><strong>${runtime.choices.length}/${c.stages.length}</strong></div><div><span>Camino recorrido</span><strong>${path}</strong></div><div><span>Decisiones a revisar</span><strong>${runtime.errors}</strong></div><div><span>Desenlace</span><strong>${out.title}</strong></div><p>${out.text}</p>`;
    root.appendChild(box);
  }

  function init(){
    ensureStyles(); hook(); mount(); reset();
    const retry=setInterval(()=>{hookAttempts+=1;hook();if(hookAttempts>14)clearInterval(retry);},500);
    window.addEventListener('nursing-cases-updated',()=>setTimeout(()=>{hook();reset();},60));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();