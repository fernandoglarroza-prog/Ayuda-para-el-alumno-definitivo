(() => {
  const topics = {
    conducto_mandibular: {
      name:'Conducto mandibular', structureKey:'conducto_mandibular', aliases:['conducto mandibular'],
      why:'Conecta anatomía ósea, paquete neurovascular, panorámica y CBCT.',
      imageAnchor:'cbctAnatomyTrainer', imageHint:'Usá primero Mandíbula sagital y después Mandíbula axial/coronal.',
      quiz:{q:'¿Qué estructura principal recorre el conducto mandibular?',options:['Paquete neurovascular alveolar inferior','Nervio lingual','Arteria facial'],correct:0,why:'El conducto aloja el nervio alveolar inferior y los vasos acompañantes.'}
    },
    foramen_mentoniano: {
      name:'Foramen mentoniano', structureKey:'foramen_mentoniano', aliases:['foramen mentoniano'],
      why:'Es una referencia clave en anestesia, cirugía, implantología e interpretación radiográfica.',
      imageAnchor:'realRadiographCase', imageHint:'Comparalo en panorámica y después confirmá continuidad con el conducto en CBCT.',
      quiz:{q:'¿Con qué trayecto óseo se continúa el foramen mentoniano?',options:['Conducto mandibular','Conducto infraorbitario','Meato acústico externo'],correct:0,why:'Es la salida anterior del sistema del conducto mandibular.'}
    },
    seno_maxilar: {
      name:'Seno maxilar', structureKey:'seno_maxilar', aliases:['seno maxilar'],
      why:'Integra maxilar posterior, raíces dentarias, panorámica y cortes CBCT.',
      imageAnchor:'cbctAnatomyTrainer', imageHint:'Abrí Maxilar coronal y relacioná piso sinusal con raíces posteriores.',
      quiz:{q:'¿Qué relación es especialmente importante en Odontología?',options:['Piso del seno con raíces de premolares y molares superiores','Techo del seno con incisivos inferiores','Pared medial con cóndilo mandibular'],correct:0,why:'La proximidad entre piso sinusal y dientes posteriores superiores es clínicamente relevante.'}
    },
    cortical_vestibular: {
      name:'Cortical vestibular', structureKey:'mandibula', aliases:['cortical vestibular'],
      why:'Ayuda a construir orientación bucolingual y espesor óseo en CBCT.',
      imageAnchor:'cbctAnatomyTrainer', imageHint:'Comparala con la cortical lingual en los cortes axial y coronal.',
      quiz:{q:'En un corte transversal mandibular, la cortical vestibular corresponde a…',options:['La cortical externa hacia el vestíbulo','La cortical interna hacia la lengua','El techo del conducto mandibular'],correct:0,why:'Vestibular indica el lado externo orientado hacia el vestíbulo oral.'}
    },
    cortical_lingual: {
      name:'Cortical lingual', structureKey:'mandibula', aliases:['cortical lingual'],
      why:'Es indispensable para interpretar posición bucolingual del conducto y límites mandibulares.',
      imageAnchor:'cbctAnatomyTrainer', imageHint:'Buscala en el mismo corte que la vestibular y compará ambas corticales.',
      quiz:{q:'La cortical lingual de la mandíbula se orienta principalmente hacia…',options:['La lengua','El vestíbulo','La articulación temporomandibular'],correct:0,why:'Lingual describe la cortical interna orientada hacia la lengua.'}
    },
    raiz_molar: {
      name:'Raíz de molar', structureKey:'maxilar', aliases:['raíz de molar','raiz de molar'],
      why:'Permite relacionar dentición, seno maxilar y lectura multiplanar.',
      imageAnchor:'cbctAnatomyTrainer', imageHint:'Usá Maxilar coronal para seguir raíz y piso sinusal.',
      quiz:{q:'En molares superiores, ¿qué relación conviene evaluar en CBCT?',options:['Raíces con el piso del seno maxilar','Raíces con el foramen mentoniano','Raíces con el cóndilo mandibular'],correct:0,why:'El maxilar posterior puede tener raíces muy próximas al piso del seno.'}
    },
    condilo_mandibular: {
      name:'Cóndilo mandibular', structureKey:'condilo_mandibular', aliases:['cóndilo mandibular','condilo mandibular'],
      why:'Integra anatomía mandibular, ATM, panorámica y orientación tridimensional.',
      imageAnchor:'realRadiographCase', imageHint:'Compará ambos cóndilos en panorámica y luego volvé al 3D.',
      quiz:{q:'¿Con qué hueso se articula el cóndilo mandibular?',options:['Temporal','Esfenoides','Maxilar'],correct:0,why:'El cóndilo forma la ATM con la porción articular del temporal, interpuesto el disco.'}
    },
    coronoides_mandibular: {
      name:'Apófisis coronoides', structureKey:'coronoides_mandibular', aliases:['apófisis coronoides','apofisis coronoides'],
      why:'Refuerza la orientación de la rama y su relación con el temporal.',
      imageAnchor:'realRadiographCase', imageHint:'Diferenciala del cóndilo usando la escotadura mandibular.',
      quiz:{q:'¿Qué músculo se inserta de forma importante en la apófisis coronoides?',options:['Temporal','Buccinador','Digástrico'],correct:0,why:'La apófisis coronoides recibe una inserción principal del músculo temporal.'}
    }
  };

  const normalize = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const topicForName = (name='') => {
    const n=normalize(name);
    return Object.entries(topics).find(([,t])=>t.aliases.some(a=>normalize(a)===n))?.[0] || null;
  };
  const score=(v)=>v?.attempts ? Math.round(v.correct*100/v.attempts) : null;
  const progress=()=>window.SimulatorProgress?.get?.() || {byTarget:{},attempts:0};

  function rankedTopics(){
    const data=progress();
    const rows=[];
    for(const [name,v] of Object.entries(data.byTarget||{})){
      const key=topicForName(name); if(!key || !v?.attempts) continue;
      rows.push({key,attempts:v.attempts,correct:v.correct,score:score(v)});
    }
    rows.sort((a,b)=>a.score-b.score || b.attempts-a.attempts);
    const used=new Set();
    const ranked=rows.filter(r=>{if(used.has(r.key))return false;used.add(r.key);return true;});
    for(const fallback of ['conducto_mandibular','foramen_mentoniano','seno_maxilar','cortical_vestibular']){
      if(!used.has(fallback)) ranked.push({key:fallback,attempts:0,correct:0,score:null});
    }
    return ranked.slice(0,3);
  }

  function init(){
    if(document.getElementById('adaptiveStudy')) return true;
    const anchor=document.getElementById('progressDashboard') || document.getElementById('sourcePolicyPanel') || document.getElementById('cbctAnatomyTrainer');
    if(!anchor) return false;
    const section=document.createElement('section');
    section.id='adaptiveStudy'; section.className='adaptiveStudy';
    section.innerHTML=`
      <div class="adaptiveHead">
        <div><span class="simEy">Repaso adaptativo · usa solo tu progreso local</span><h2>Tu próxima sesión de estudio</h2><p>El simulador prioriza automáticamente los temas con más errores. Si todavía no hay suficiente historial, propone una ruta diagnóstica corta.</p></div>
        <span id="adaptiveStatus" class="adaptiveStatus">Plan listo</span>
      </div>
      <div id="adaptiveRecommendations" class="adaptiveRecommendations"></div>
      <div id="adaptiveSession" class="adaptiveSession" hidden>
        <div class="adaptiveSessionTop"><div><span class="simEy">Sesión guiada</span><h3 id="adaptiveTopic"></h3></div><b id="adaptiveStepCount">Paso 1 de 5</b></div>
        <div class="adaptiveProgress"><span id="adaptiveBar"></span></div>
        <div id="adaptiveStep" class="adaptiveStep"></div>
        <div class="adaptiveActions"><button id="adaptiveBack" type="button">← Anterior</button><button id="adaptiveDo" type="button" class="primary">Abrir actividad</button><button id="adaptiveNext" type="button">Siguiente →</button></div>
      </div>`;
    anchor.insertAdjacentElement('beforebegin',section);

    const recHost=section.querySelector('#adaptiveRecommendations'),session=section.querySelector('#adaptiveSession'),topicTitle=section.querySelector('#adaptiveTopic'),stepCount=section.querySelector('#adaptiveStepCount'),bar=section.querySelector('#adaptiveBar'),stepBox=section.querySelector('#adaptiveStep'),back=section.querySelector('#adaptiveBack'),next=section.querySelector('#adaptiveNext'),doBtn=section.querySelector('#adaptiveDo'),status=section.querySelector('#adaptiveStatus');
    let currentKey=null,stepIndex=0,quizAnswered=false;

    const stepsFor=(key)=>{
      const t=topics[key];
      return [
        {title:'1. Recordá la idea central',text:`Leé la ficha de ${t.name} y ubicá qué estructura la contiene, con qué se relaciona y por qué importa en Odontología.`,action:'3d'},
        {title:'2. Ubicala en el cráneo 3D',text:`Observá ${t.name} desde más de una vista. Rotá el modelo y comprobá sus relaciones espaciales.`,action:'3d'},
        {title:'3. Pasá a imagen',text:t.imageHint,action:'image'},
        {title:'4. Compará otra representación',text:'Volvé al 3D después de la imagen y tratá de explicar mentalmente cómo corresponde una representación con la otra.',action:'3d'},
        {title:'5. Cerrá con una pregunta específica',text:'Respondé sin volver a mirar la ficha. El resultado recalcula automáticamente tu prioridad de repaso.',action:'selfquiz'}
      ];
    };

    function renderRecommendations(){
      const ranked=rankedTopics();
      status.textContent=progress().attempts ? 'Basado en tu rendimiento' : 'Ruta diagnóstica inicial';
      recHost.innerHTML=ranked.map((r,i)=>{const t=topics[r.key];const result=r.score===null?'Todavía sin datos':`${r.score}% · ${r.correct}/${r.attempts}`;return `<article><span>${i===0?'Prioridad':'Alternativa'}</span><h3>${t.name}</h3><p>${t.why}</p><div><b>${result}</b><button type="button" data-start-topic="${r.key}">Empezar sesión</button></div></article>`;}).join('');
      recHost.querySelectorAll('[data-start-topic]').forEach(b=>b.addEventListener('click',()=>start(b.dataset.startTopic)));
    }

    function start(key){
      currentKey=key;stepIndex=0;quizAnswered=false;session.hidden=false;topicTitle.textContent=topics[key].name;renderStep();session.scrollIntoView({behavior:'smooth',block:'center'});
    }
    function renderSelfQuiz(){
      const q=topics[currentKey].quiz;
      stepBox.innerHTML=`<h4>5. ${q.q}</h4><div class="adaptiveQuiz">${q.options.map((x,i)=>`<button type="button" data-answer="${i}">${x}</button>`).join('')}</div><p id="adaptiveFeedback">Elegí una opción.</p>`;
      stepBox.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
        if(quizAnswered)return;quizAnswered=true;const chosen=Number(b.dataset.answer),ok=chosen===q.correct;
        stepBox.querySelectorAll('[data-answer]').forEach((x,i)=>{x.disabled=true;x.classList.toggle('correct',i===q.correct);x.classList.toggle('wrong',i===chosen&&!ok);});
        stepBox.querySelector('#adaptiveFeedback').textContent=`${ok?'✓ Correcto.':'✕ Revisalo.'} ${q.why}`;
        document.dispatchEvent(new CustomEvent('simulator:practice-result',{detail:{mode:'Repaso adaptativo',target:topics[currentKey].name,correct:ok}}));
        next.disabled=false;
      }));
    }
    function renderStep(){
      const steps=stepsFor(currentKey),s=steps[stepIndex];
      stepCount.textContent=`Paso ${stepIndex+1} de ${steps.length}`;bar.style.width=`${((stepIndex+1)/steps.length)*100}%`;
      back.disabled=stepIndex===0;next.textContent=stepIndex===steps.length-1?'Terminar sesión':'Siguiente →';
      quizAnswered=false;next.disabled=s.action==='selfquiz';doBtn.hidden=s.action==='selfquiz';
      if(s.action==='selfquiz'){renderSelfQuiz();return;}
      stepBox.innerHTML=`<h4>${s.title}</h4><p>${s.text}</p>`;
      doBtn.textContent=s.action==='image'?'Abrir imágenes':'Mostrar en 3D';
    }
    function openActivity(){
      const t=topics[currentKey],s=stepsFor(currentKey)[stepIndex];
      if(s.action==='3d'){
        document.dispatchEvent(new CustomEvent('simulator:select',{detail:{key:t.structureKey,sourceName:'Repaso adaptativo'}}));
        document.getElementById('skullStage')?.scrollIntoView({behavior:'smooth',block:'center'});
      }else if(s.action==='image'){
        document.getElementById(t.imageAnchor)?.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }
    back.addEventListener('click',()=>{if(stepIndex>0){stepIndex--;renderStep();}});
    next.addEventListener('click',()=>{const steps=stepsFor(currentKey);if(stepIndex<steps.length-1){stepIndex++;renderStep();}else{session.hidden=true;renderRecommendations();section.scrollIntoView({behavior:'smooth',block:'start'});}});
    doBtn.addEventListener('click',openActivity);

    document.addEventListener('simulator:progress-updated',renderRecommendations);
    window.addEventListener('focus',renderRecommendations);
    renderRecommendations();
    return true;
  }

  if(init()) return;
  const o=new MutationObserver(()=>{if(init())o.disconnect();});
  o.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>o.disconnect(),10000);
})();