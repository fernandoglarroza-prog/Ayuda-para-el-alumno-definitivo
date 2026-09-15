(() => {
  const HISTORY_KEY='ayuda_sim_odontologia_exam_history_v1';
  const TARGET=70;
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  const mcq=(category,target,prompt,answers,explanation,reviewKey=null,imageAnchor=null)=>({type:'mcq',category,target,prompt,answers:answers.map((text,i)=>({text,ok:i===0})),explanation,reviewKey,imageAnchor});
  const id3d=(target,prompt,key,explanation)=>({type:'3d',category:'3D · huesos',target,prompt,key,explanation,reviewKey:key});

  const bank={
    '3D · huesos':[
      id3d('Mandíbula','Seleccioná la mandíbula directamente en el cráneo 3D.','mandibula','La mandíbula forma la arcada inferior y es el principal hueso móvil del cráneo.'),
      id3d('Maxilar','Seleccioná uno de los maxilares en el modelo 3D.','maxilar','El maxilar participa en la arcada superior, órbita, cavidad nasal y seno maxilar.'),
      id3d('Esfenoides','Seleccioná el esfenoides en el modelo 3D.','esfenoides','El esfenoides ocupa una posición central en la base del cráneo y se relaciona con V2 y V3.'),
      id3d('Temporal','Seleccioná un hueso temporal en el modelo 3D.','temporal','El temporal participa en la base y pared lateral del cráneo y forma la superficie articular de la ATM.'),
      id3d('Cigomático','Seleccioná un hueso cigomático en el modelo 3D.','cigomatico','El cigomático forma la prominencia malar y parte del reborde orbitario y arco cigomático.')
    ],
    'Accidentes anatómicos':[
      mcq('Accidentes anatómicos','Foramen mandibular','¿Dónde se encuentra el foramen mandibular?',['En la cara medial de la rama mandibular','En la cara lateral del cuerpo mandibular','En el ala mayor del esfenoides'], 'El foramen mandibular se ubica en la cara medial de la rama y da entrada al conducto mandibular.','foramen_mandibular','cbctAnatomyTrainer'),
      mcq('Accidentes anatómicos','Foramen mentoniano','¿Con qué estructura se continúa el foramen mentoniano?',['Con el conducto mandibular','Con el conducto infraorbitario','Con el foramen oval'], 'El foramen mentoniano es una salida del sistema del conducto mandibular.','foramen_mentoniano','realRadiographCase'),
      mcq('Accidentes anatómicos','Foramen oval','¿Qué rama del trigémino atraviesa principalmente el foramen oval?',['V3 · nervio mandibular','V2 · nervio maxilar','V1 · nervio oftálmico'], 'El foramen oval transmite principalmente V3.','esfenoides',null),
      mcq('Accidentes anatómicos','Foramen redondo','¿Qué rama del trigémino atraviesa el foramen redondo?',['V2 · nervio maxilar','V3 · nervio mandibular','Nervio facial'], 'El foramen redondo comunica la fosa craneal media con la región pterigopalatina y transmite V2.','esfenoides',null),
      mcq('Accidentes anatómicos','Cóndilo mandibular','¿Qué accidente mandibular participa directamente en la ATM?',['Proceso condilar','Apófisis coronoides','Língula mandibular'], 'La cabeza del proceso condilar se relaciona con el temporal mediante el disco articular.','condilo_mandibular','realRadiographCase')
    ],
    'Neurovascular':[
      mcq('Neurovascular','Nervio alveolar inferior','¿Por dónde ingresa el nervio alveolar inferior al interior de la mandíbula?',['Por el foramen mandibular','Por el foramen mentoniano','Por el foramen infraorbitario'], 'El nervio alveolar inferior entra por el foramen mandibular y recorre el conducto mandibular.','foramen_mandibular','cbctAnatomyTrainer'),
      mcq('Neurovascular','Nervio mentoniano','¿De qué nervio es rama terminal el nervio mentoniano?',['Del nervio alveolar inferior','Del nervio lingual','Del nervio infraorbitario'], 'El nervio alveolar inferior se divide anteriormente y origina, entre otras, la rama mentoniana.','foramen_mentoniano','realRadiographCase'),
      mcq('Neurovascular','Nervio lingual','¿Cuál de estas afirmaciones sobre el nervio lingual es correcta?',['No recorre el interior del conducto mandibular','Sale por el foramen mentoniano','Atraviesa el foramen redondo'], 'El nervio lingual discurre en tejidos blandos de la región lingual mandibular; no viaja dentro del conducto mandibular.','mandibula',null),
      mcq('Neurovascular','Arteria alveolar inferior','¿Qué vaso acompaña al nervio alveolar inferior dentro del conducto mandibular?',['Arteria alveolar inferior','Arteria facial','Arteria temporal superficial'], 'La arteria alveolar inferior acompaña al nervio dentro del conducto.','conducto_mandibular','cbctAnatomyTrainer'),
      mcq('Neurovascular','V2','¿Qué rama trigeminal continúa hacia la región infraorbitaria?',['V2 · nervio maxilar','V3 · nervio mandibular','V1 · nervio oftálmico'], 'V2 continúa por la región pterigopalatina e infraorbitaria y aporta sensibilidad al territorio maxilar.','maxilar',null)
    ],
    'Panorámica':[
      mcq('Panorámica','Conducto mandibular','En una panorámica, ¿cómo se busca habitualmente el conducto mandibular?',['Como una banda radiolúcida con límites corticales variables','Como una línea radiopaca única sobre los incisivos','Como una cavidad aérea dentro del maxilar'], 'El conducto suele reconocerse como trayecto radiolúcido limitado por corticales, aunque su definición varía.','conducto_mandibular','realRadiographCase'),
      mcq('Panorámica','Foramen mentoniano','Al buscar el foramen mentoniano en una panorámica, ¿qué precaución es correcta?',['Su posición puede variar y debe correlacionarse con el conducto','Siempre está exactamente debajo del primer molar','Debe verse en la rama mandibular'], 'Su posición es variable y conviene relacionarlo con la continuidad del conducto y la región premolar.','foramen_mentoniano','realRadiographCase'),
      mcq('Panorámica','Seno maxilar','¿Dónde se espera reconocer el seno maxilar en una panorámica?',['Por encima de dientes posteriores superiores','Dentro del cuerpo mandibular','Por detrás del cóndilo'], 'El seno maxilar se proyecta sobre el maxilar posterior y puede relacionarse estrechamente con raíces.','seno_maxilar','realRadiographCase'),
      mcq('Panorámica','Cóndilo mandibular','¿Qué comparación es útil al evaluar ambos cóndilos en una panorámica?',['Simetría general, forma y posición, sin asumir identidad perfecta','Solo el tamaño dental de incisivos','La posición del foramen redondo'], 'La panorámica permite una comparación bilateral orientativa, teniendo en cuenta distorsiones y asimetrías.','condilo_mandibular','realRadiographCase'),
      mcq('Panorámica','Apófisis coronoides','¿Qué referencia ayuda a diferenciar coronoides de cóndilo?',['La escotadura mandibular entre ambos','El foramen mentoniano','El seno maxilar'], 'La escotadura mandibular separa la coronoides anterior del proceso condilar posterior.','coronoides_mandibular','realRadiographCase')
    ],
    'CBCT':[
      mcq('CBCT','Cortical vestibular','En un corte transversal mandibular, la cortical vestibular es…',['La cortical externa orientada hacia el vestíbulo','La cortical interna orientada hacia la lengua','El contenido del conducto mandibular'], 'Vestibular corresponde al límite óseo externo hacia el vestíbulo oral.','mandibula','cbctAnatomyTrainer'),
      mcq('CBCT','Cortical lingual','¿Qué relación ayuda especialmente a valorar un corte axial/coronal mandibular?',['La posición bucolingual del conducto respecto de ambas corticales','Solo la longitud mesiodistal de coronas','La sutura sagital'], 'Los cortes permiten ubicar el conducto respecto de cortical vestibular y lingual.','mandibula','cbctAnatomyTrainer'),
      mcq('CBCT','Conducto mandibular','¿Qué ventaja aporta seguir el conducto en varios planos de CBCT?',['Confirmar su continuidad y relación espacial tridimensional','Convertirlo en una medición clínica automática','Eliminar toda variación anatómica'], 'La interpretación multiplanar ayuda a confirmar continuidad y relaciones; el simulador no realiza mediciones clínicas.','conducto_mandibular','cbctAnatomyTrainer'),
      mcq('CBCT','Raíz de molar','En maxilar posterior, ¿qué relación es especialmente importante revisar?',['Raíces con el piso del seno maxilar','Raíces con el foramen mentoniano','Raíces con el cóndilo'], 'Las raíces de premolares y molares superiores pueden estar próximas al piso sinusal.','maxilar','cbctAnatomyTrainer'),
      mcq('CBCT','Plano axial','¿Qué plano es especialmente útil para comparar relaciones derecha-izquierda y bucolinguales en un nivel determinado?',['Axial','Sagital','Reconstrucción panorámica exclusivamente'], 'El axial muestra una sección horizontal y facilita relaciones transversales.','craneo','realCbctCase')
    ],
    'ATM y músculos':[
      mcq('ATM y músculos','ATM','¿Qué estructura se interpone entre el cóndilo mandibular y el temporal?',['Disco articular','Nervio lingual','Seno maxilar'], 'El disco articular divide funcionalmente la articulación y acompaña la biomecánica de la ATM.','condilo_mandibular',null),
      mcq('ATM y músculos','Temporal','¿Dónde se inserta de forma importante el músculo temporal?',['En la apófisis coronoides','En el foramen mentoniano','En el proceso mastoides'], 'El temporal converge hacia la apófisis coronoides y borde anterior de la rama.','coronoides_mandibular',null),
      mcq('ATM y músculos','Masetero','¿Cuál es una función principal del masetero?',['Elevar la mandíbula','Abrir pasivamente el seno maxilar','Transmitir V2'], 'El masetero es uno de los principales elevadores mandibulares.','angulo_mandibular',null),
      mcq('ATM y músculos','Pterigoideo lateral','¿Con qué movimiento se relaciona especialmente el pterigoideo lateral?',['Traslación/protrusión del complejo mandibular','Cierre de la sutura sagital','Descenso del paladar duro'], 'El pterigoideo lateral participa en protrusión y traslación condilar, entre otras acciones.','condilo_mandibular',null)
    ]
  };

  const blueprint=[['3D · huesos',3],['Accidentes anatómicos',2],['Neurovascular',2],['Panorámica',2],['CBCT',2],['ATM y músculos',1]];
  const buildExam=()=>blueprint.flatMap(([cat,n])=>shuffle(bank[cat]).slice(0,n)).map(q=>q.type==='mcq'?{...q,answers:shuffle(q.answers)}:{...q});
  const loadHistory=()=>{try{return {attempts:0,best:null,last:null,history:[],...JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}')};}catch{return {attempts:0,best:null,last:null,history:[]};}};
  const saveHistory=h=>{try{localStorage.setItem(HISTORY_KEY,JSON.stringify(h));}catch{}};
  const fmtTime=sec=>`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;

  function init(){
    if(document.getElementById('examModePanel'))return true;
    const nav=document.querySelector('.simModes');
    const anchor=document.getElementById('adaptiveStudy')||document.getElementById('progressDashboard')||document.querySelector('.simRoadmap');
    if(!nav||!anchor)return false;

    const navBtn=document.createElement('button');navBtn.type='button';navBtn.className='simMode examModeNav';navBtn.textContent='Parcial';navBtn.setAttribute('aria-label','Abrir modo parcial de Anatomía');nav.appendChild(navBtn);

    const section=document.createElement('section');section.id='examModePanel';section.className='examModePanel';
    section.innerHTML=`<div class="examIntro"><div><span class="simEy">Modo parcial · entrenamiento integral</span><h2>Simulacro de Anatomía Odontológica</h2><p>12 preguntas mezcladas: reconocimiento 3D, accidentes, neurovascular, panorámica, CBCT y ATM/músculos. El 70% es un objetivo interno de entrenamiento, no equivale a la nota oficial de ninguna cátedra.</p></div><div class="examLocalStats"><span>Intentos <b id="examAttempts">0</b></span><span>Última <b id="examLast">—</b></span><span>Mejor <b id="examBest">—</b></span></div></div><div class="examStartRow"><button id="examStart" class="primary" type="button">Comenzar parcial</button><span>⏱️ Cronómetro informativo · sin límite automático</span></div><div id="examRunner" class="examRunner" hidden><div class="examTop"><div><span id="examProgress">Pregunta 1 de 12</span><b id="examCategory"></b></div><span id="examTimer">00:00</span></div><div class="examTrack"><span id="examBar"></span></div><div id="examQuestion" class="examQuestion"></div><div id="examFeedback" class="examFeedback" hidden></div><div class="examActions"><button id="examAbort" type="button">Salir del parcial</button><button id="examNext" type="button" class="primary" disabled>Siguiente</button></div></div><div id="examResult" class="examResult" hidden></div>`;
    anchor.insertAdjacentElement('beforebegin',section);

    const startBtn=section.querySelector('#examStart'),runner=section.querySelector('#examRunner'),result=section.querySelector('#examResult'),qHost=section.querySelector('#examQuestion'),feedback=section.querySelector('#examFeedback'),nextBtn=section.querySelector('#examNext'),abortBtn=section.querySelector('#examAbort'),progressEl=section.querySelector('#examProgress'),categoryEl=section.querySelector('#examCategory'),timerEl=section.querySelector('#examTimer'),bar=section.querySelector('#examBar');
    let questions=[],index=0,results=[],answered=false,active=false,awaiting3d=false,startAt=0,timer=null;

    function updateHistoryUI(){const h=loadHistory();section.querySelector('#examAttempts').textContent=h.attempts||0;section.querySelector('#examLast').textContent=h.last==null?'—':`${h.last}%`;section.querySelector('#examBest').textContent=h.best==null?'—':`${h.best}%`;}
    function setExamVisual(on){document.querySelectorAll('.simMode').forEach(b=>b.classList.toggle('active',on?b===navBtn:b.dataset.mode==='explorar'));if(on)document.body.dataset.simMode='parcial';}
    function start(){
      document.querySelector('.simMode[data-mode="explorar"]')?.click();setExamVisual(true);
      questions=buildExam();index=0;results=[];answered=false;active=true;awaiting3d=false;result.hidden=true;runner.hidden=false;startBtn.disabled=true;startAt=Date.now();clearInterval(timer);timer=setInterval(()=>{timerEl.textContent=fmtTime(Math.floor((Date.now()-startAt)/1000));},1000);renderQuestion();runner.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function stopTimer(){clearInterval(timer);timer=null;}
    function renderQuestion(){
      const q=questions[index];answered=false;awaiting3d=q.type==='3d';feedback.hidden=true;feedback.className='examFeedback';nextBtn.disabled=true;nextBtn.textContent=index===questions.length-1?'Ver resultado':'Siguiente';progressEl.textContent=`Pregunta ${index+1} de ${questions.length}`;categoryEl.textContent=q.category;bar.style.width=`${(index/questions.length)*100}%`;
      if(q.type==='3d'){
        qHost.innerHTML=`<span class="examType">Identificación sobre modelo</span><h3>${q.prompt}</h3><p>Rotá el cráneo si lo necesitás y tocá directamente la estructura. La primera selección cuenta como respuesta.</p><button id="examGo3d" type="button">Ir al cráneo 3D ↑</button>`;
        qHost.querySelector('#examGo3d').addEventListener('click',()=>document.getElementById('skullStage')?.scrollIntoView({behavior:'smooth',block:'center'}));
      }else{
        qHost.innerHTML=`<span class="examType">${q.category}</span><h3>${q.prompt}</h3><div class="examOptions">${q.answers.map((a,i)=>`<button type="button" data-exam-answer="${i}">${a.text}</button>`).join('')}</div>`;
        qHost.querySelectorAll('[data-exam-answer]').forEach(b=>b.addEventListener('click',()=>answerMcq(Number(b.dataset.examAnswer))));
      }
    }
    function register(q,ok,chosenLabel){
      answered=true;awaiting3d=false;results.push({q,ok,chosenLabel});document.dispatchEvent(new CustomEvent('simulator:practice-result',{detail:{mode:'Modo parcial',target:q.target,correct:ok}}));feedback.hidden=false;feedback.classList.add(ok?'ok':'bad');feedback.innerHTML=`<b>${ok?'✓ Correcto':'✕ Incorrecto'}</b><p>${q.explanation}</p>`;nextBtn.disabled=false;
    }
    function answerMcq(i){if(!active||answered)return;const q=questions[index],a=q.answers[i],ok=!!a.ok;qHost.querySelectorAll('[data-exam-answer]').forEach((b,j)=>{b.disabled=true;const ans=q.answers[j];b.classList.toggle('correct',!!ans.ok);b.classList.toggle('wrong',j===i&&!ok);});register(q,ok,a.text);}
    function answer3d(key){if(!active||answered||!awaiting3d)return;const q=questions[index],ok=key===q.key;register(q,ok,key);if(!ok)setTimeout(()=>document.dispatchEvent(new CustomEvent('simulator:select',{detail:{key:q.key,sourceName:'Corrección del parcial'}})),250);setTimeout(()=>section.scrollIntoView({behavior:'smooth',block:'center'}),450);}
    function next(){if(!answered)return;if(index<questions.length-1){index++;renderQuestion();section.scrollIntoView({behavior:'smooth',block:'start'});}else finish();}
    function finish(){
      active=false;awaiting3d=false;stopTimer();runner.hidden=true;startBtn.disabled=false;const correct=results.filter(r=>r.ok).length,pct=Math.round(correct/questions.length*100),elapsed=Math.floor((Date.now()-startAt)/1000);bar.style.width='100%';
      const h=loadHistory();h.attempts=(h.attempts||0)+1;h.last=pct;h.best=h.best==null?pct:Math.max(h.best,pct);h.history=[{date:new Date().toISOString(),score:pct,correct,total:questions.length,seconds:elapsed},...(h.history||[])].slice(0,10);saveHistory(h);updateHistoryUI();
      const cats={};results.forEach(r=>{cats[r.q.category]=cats[r.q.category]||{a:0,c:0};cats[r.q.category].a++;if(r.ok)cats[r.q.category].c++;});
      const wrong=results.filter(r=>!r.ok),uniqueWrong=[];const seen=new Set();wrong.forEach(r=>{if(!seen.has(r.q.target)){seen.add(r.q.target);uniqueWrong.push(r.q);}});
      result.hidden=false;result.innerHTML=`<div class="examScore"><div><span class="simEy">Resultado del simulacro</span><h2>${correct}/${questions.length} · ${pct}%</h2><p>${pct>=TARGET?'Objetivo de entrenamiento alcanzado.':'Conviene reforzar los temas débiles y repetir el parcial.'} Tiempo: ${fmtTime(elapsed)}.</p></div><span class="${pct>=TARGET?'pass':'retry'}">${pct>=TARGET?'✓ ≥ 70%':'↻ < 70%'}</span></div><div class="examCategoryGrid">${Object.entries(cats).map(([name,v])=>`<div><span>${name}</span><b>${v.c}/${v.a} · ${Math.round(v.c*100/v.a)}%</b></div>`).join('')}</div><div class="examRecovery"><h3>Plan de recuperación</h3>${uniqueWrong.length?`<p>Estos temas pasan automáticamente a tu historial de repaso:</p><div class="examRecoveryList">${uniqueWrong.map(q=>`<article><div><b>${q.target}</b><small>${q.category}</small></div><div>${q.reviewKey?`<button type="button" data-review-3d="${q.reviewKey}">Ver en 3D</button>`:''}${q.imageAnchor?`<button type="button" data-review-image="${q.imageAnchor}">Ver imagen</button>`:''}</div></article>`).join('')}</div>`:'<p>No hubo errores en esta sesión.</p>'}<div class="examResultActions"><button id="examAdaptive" type="button">Abrir repaso adaptativo</button><button id="examAgain" class="primary" type="button">Nuevo parcial</button></div></div><small class="examDisclaimer">Resultado educativo del simulador. No reemplaza criterios, calificaciones ni evaluaciones oficiales de la cátedra.</small>`;
      result.querySelectorAll('[data-review-3d]').forEach(b=>b.addEventListener('click',()=>{document.dispatchEvent(new CustomEvent('simulator:select',{detail:{key:b.dataset.review3d,sourceName:'Revisión del parcial'}}));document.getElementById('skullStage')?.scrollIntoView({behavior:'smooth',block:'center'});}));
      result.querySelectorAll('[data-review-image]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.reviewImage)?.scrollIntoView({behavior:'smooth',block:'start'})));
      result.querySelector('#examAdaptive')?.addEventListener('click',()=>document.getElementById('adaptiveStudy')?.scrollIntoView({behavior:'smooth',block:'start'}));
      result.querySelector('#examAgain')?.addEventListener('click',start);result.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function abort(){if(!active)return;active=false;awaiting3d=false;stopTimer();runner.hidden=true;startBtn.disabled=false;result.hidden=false;result.innerHTML='<div class="examAborted"><b>Parcial interrumpido</b><p>No se guardó una nota final. Podés empezar otro cuando quieras.</p></div>';}

    navBtn.addEventListener('click',()=>{if(!active){setExamVisual(true);section.scrollIntoView({behavior:'smooth',block:'start'});}else section.scrollIntoView({behavior:'smooth',block:'start'});});
    startBtn.addEventListener('click',start);nextBtn.addEventListener('click',next);abortBtn.addEventListener('click',abort);
    document.addEventListener('simulator:select',e=>answer3d(e.detail?.key));
    document.querySelectorAll('.simMode[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(active)abort();}));
    updateHistoryUI();return true;
  }

  if(init())return;const o=new MutationObserver(()=>{if(init())o.disconnect();});o.observe(document.body,{childList:true,subtree:true});setTimeout(()=>o.disconnect(),10000);
})();