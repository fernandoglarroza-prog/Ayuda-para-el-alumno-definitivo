(()=>{
 const style=document.createElement('link');style.rel='stylesheet';style.href='./v4.css';document.head.appendChild(style);
 const heroEy=document.querySelector('.heroMain .ey');if(heroEy)heroEy.textContent='Lengua de Señas Argentina · v4';

 const goals={
  general:'Aprender LSA desde cero',
  everyday:'Comunicación cotidiana',
  university:'Universidad y estudio',
  health:'Salud y emergencias',
  family:'Acompañamiento familiar'
 };
 const recs={
  general:'Seguí la ruta completa y priorizá la sesión diaria para construir continuidad.',
  everyday:'Priorizá Saludos, Familia, Números, Clima y misiones breves de interacción.',
  university:'Priorizá La escuela, dactilología de nombres y situaciones académicas.',
  health:'Construí primero una base general y después tu mazo de emergencia con señas validadas.',
  family:'Priorizá vocabulario cotidiano, familia y práctica frecuente con referencias visuales.'
 };

 const profile=document.createElement('section');profile.className='learnerProfile';profile.id='perfil-lsa';profile.innerHTML=`
  <div class="profileTop"><div><span class="ey">LSA v4 · perfil local</span><h2>Tu ruta de aprendizaje</h2><p>Elegí un objetivo y una frecuencia. Todo queda guardado únicamente en este dispositivo.</p></div><span class="profileBadge">Sin cuenta · datos locales</span></div>
  <div class="profileGrid"><form class="profileForm" id="v4ProfileForm"><div class="profileField"><label for="v4Alias">Nombre o apodo (opcional)</label><input id="v4Alias" maxlength="30" autocomplete="off" placeholder="Cómo querés que te muestre"></div><div class="profileField"><label for="v4Goal">Objetivo principal</label><select id="v4Goal"><option value="general">Aprender LSA desde cero</option><option value="everyday">Comunicación cotidiana</option><option value="university">Universidad y estudio</option><option value="health">Salud y emergencias</option><option value="family">Acompañamiento familiar</option></select></div><div class="profileField full"><label for="v4Pace">Meta diaria</label><select id="v4Pace"><option value="5">5 minutos · suave</option><option value="10">10 minutos · constante</option><option value="15">15 minutos · intensiva</option></select></div><button class="profileSave" type="submit">Guardar perfil</button></form><div class="profileSummary"><div class="profileSummaryTop"><div class="profileAvatar">🤟</div><div><h3 id="v4ProfileName">Estudiante LSA</h3><small id="v4ProfileGoal">Aprender LSA desde cero</small></div></div><div class="profileMeta"><div><b id="v4CurrentLevel">1</b><span>nivel actual</span></div><div><b id="v4XP">0</b><span>XP local</span></div><div><b id="v4Passed">0/5</b><span>checkpoints</span></div></div><div class="recommendation" id="v4Recommendation"></div><div class="profileNotice">Este perfil organiza la práctica. No acredita nivel lingüístico ni reemplaza formación con referentes, docentes u organizaciones de la comunidad sorda.</div><div class="badgeShelf" id="v4BadgeShelf"></div></div></div>`;
 const hero=document.querySelector('.hero');if(hero)hero.insertAdjacentElement('afterend',profile);

 const levels=[
  {id:1,icon:'🌱',title:'Inicio',desc:'Fundamentos, alfabeto manual y primeras rutinas de práctica.',requirements:s=>[
   ['Fundamentos: 3/5 o más',(s.foundationQuiz||0)>=3],['Dactilología: 3 letras logradas',(s.letterSuccess||0)>=3]
  ],tasks:['Completé el módulo de fundamentos.','Practiqué al menos tres letras con el alfabeto oficial.'],q:'Si no conocés una seña, ¿cuál es la mejor conducta dentro de esta plataforma?',o:['Inventar un gesto parecido.','Buscarla en una fuente validada, como materiales de la CAS o formación confiable.','Traducir literalmente la palabra del castellano.'],a:1,xp:100},
  {id:2,icon:'👋',title:'Comunicación cotidiana',desc:'Pasar de elementos aislados a intercambios breves y vocabulario de uso frecuente.',requirements:s=>[
   ['Checkpoint Inicio',passed(1)],['2 temas practicados',countPracticed(s)>=2],['1 sesión completa',(s.practiceSessions||0)>=1]
  ],tasks:['Practiqué al menos dos temas del Señario.','Hice una misión o sesión guiada completa.'],q:'Para construir una interacción en LSA, ¿conviene copiar el orden del castellano palabra por palabra?',o:['Sí, siempre.','No; la LSA tiene estructura propia y debo practicar construcciones aprendidas en LSA.','Solo cuando uso números.'],a:1,xp:120},
  {id:3,icon:'🎓',title:'Universidad',desc:'Vocabulario y situaciones del ámbito educativo, nombres y comunicación académica.',requirements:s=>[
   ['Checkpoint Comunicación cotidiana',passed(2)],['Tema “La escuela” practicado',((s.topics||{}).escuela||0)===2],['3 tarjetas personales',(s.words||[]).length>=3]
  ],tasks:['Practiqué el tema “La escuela” con material visual validado.','Tengo al menos tres tarjetas propias estudiadas previamente.'],q:'Si querés practicar una situación universitaria y no conocés una seña específica, ¿qué hacés?',o:['La invento para no cortar la conversación.','La verifico en una fuente validada y recién después la incorporo a mi práctica.','Uso cualquier gesto que entienda un compañero.'],a:1,xp:140},
  {id:4,icon:'🫀',title:'Salud y emergencias',desc:'Preparar repertorio personal para situaciones urgentes sin sustituir protocolos de emergencia.',requirements:s=>[
   ['Checkpoint Universidad',passed(3)],['3 tarjetas en mazo de emergencia',(s.v3EmergencyWords||[]).length>=3],['3 sesiones completas',(s.practiceSessions||0)>=3]
  ],tasks:['Preparé un mazo de emergencia con señas que ya había estudiado.','Entiendo que comunicar no debe demorar la activación del sistema de emergencias.'],q:'En una emergencia real, ¿la práctica de comunicación en LSA debe retrasar RCP o la activación de emergencias?',o:['Sí, primero hay que terminar de comunicarse.','No; la comunicación accesible es complementaria y no debe demorar acciones críticas.','Depende de cuántas señas conozca.'],a:1,xp:160},
  {id:5,icon:'💬',title:'Conversación',desc:'Integrar repertorio, comprensión, fluidez y práctica sostenida en situaciones más completas.',requirements:s=>[
   ['Checkpoint Salud y emergencias',passed(4)],['5 temas practicados',countPracticed(s)>=5],['3 días de práctica',(s.v3DailyDates||[]).length>=3]
  ],tasks:['Practiqué al menos cinco temas diferentes.','Sostuve práctica en tres días distintos.'],q:'Completar esta ruta significa que la plataforma te certificó competencia en LSA?',o:['Sí, equivale a una certificación formal.','No; es una herramienta de práctica y progreso personal, no una certificación lingüística.','Sí, si completé todas las misiones.'],a:1,xp:180}
 ];

 const roadmap=document.createElement('section');roadmap.className='levelRoadmap';roadmap.id='ruta-niveles';roadmap.innerHTML=`<div class="roadmapTop"><div><span class="ey">Ruta progresiva · v4</span><h2>Cinco niveles desbloqueables</h2><p>Cada nivel se abre con práctica real registrada en este navegador y un checkpoint breve. Los checkpoints validan hábitos y conceptos; no califican la ejecución lingüística de una seña.</p></div><span class="profileBadge" id="v4RoadmapBadge">Nivel 1 en curso</span></div><div class="levelPath" id="v4LevelPath"></div>`;
 const daily=document.getElementById('sesion-diaria');if(daily)daily.insertAdjacentElement('afterend',roadmap);else profile.insertAdjacentElement('afterend',roadmap);

 const checkpoint=document.createElement('section');checkpoint.className='checkpointPanel hidden';checkpoint.id='v4Checkpoint';checkpoint.innerHTML=`<div class="checkpointTop"><div><span class="ey" id="v4CheckEy">Checkpoint</span><h2 id="v4CheckTitle"></h2><p id="v4CheckDesc"></p></div><button class="checkpointClose" id="v4CheckClose">Cerrar</button></div><div class="checkpointBody"><div class="checkpointTasks"><h3>Confirmá tu práctica</h3><div id="v4CheckTasks"></div></div><div class="checkpointQuiz"><h3>Chequeo conceptual</h3><div class="checkpointQuestion" id="v4CheckQuestion"></div><div class="checkpointOptions" id="v4CheckOptions"></div><div class="checkpointFeedback" id="v4CheckFeedback">Elegí una respuesta.</div></div></div><div class="checkpointFooter"><small>La aprobación de este checkpoint solo desbloquea la siguiente etapa dentro del simulador. No constituye examen ni certificación de LSA.</small><button class="checkpointPass" id="v4CheckPass" disabled>Completar checkpoint</button></div><div class="levelCelebration hidden" id="v4Celebration"></div>`;
 roadmap.insertAdjacentElement('afterend',checkpoint);

 const badgeDefs=[
  ['🌱','Primer paso',s=>(s.foundationQuiz||0)>=3],['🔤','Dactilología 10',s=>(s.letterSuccess||0)>=10],['📚','3 temas practicados',s=>countPracticed(s)>=3],['🔥','Racha de 3 días',s=>(s.v3DailyDates||[]).length>=3],['🧠','Repaso activo',s=>weakCount(s)>0],['🫀','Mazo de emergencia',s=>(s.v3EmergencyWords||[]).length>=3],['💬','Ruta completa',s=>passed(5)],['🎯','5 sesiones',s=>(s.practiceSessions||0)>=5]
 ];

 function state(){return loadState()}
 function passed(id){return Array.isArray(state().v4PassedLevels)&&state().v4PassedLevels.includes(id)}
 function countPracticed(s){return topics.filter(t=>((s.topics||{})[t.id]||0)===2).length}
 function weakCount(s){const a=Object.values(s.v3WeakLetters||{}).filter(v=>v>0).length,b=Object.values(s.v3WeakWords||{}).filter(v=>v>0).length;return a+b}
 function currentLevel(){for(let i=1;i<=5;i++)if(!passed(i))return i;return 5}
 function totalXP(){const s=state();return s.v4XP||0}
 function profileState(){const s=state();return s.v4Profile||{alias:'',goal:'general',pace:'5'}}
 function requirements(level){return level.requirements(state())}
 function ready(level){if(level.id>1&&!passed(level.id-1))return false;return requirements(level).every(([,ok])=>ok)}

 function renderProfile(){const p=profileState(),s=state();$('v4Alias').value=p.alias||'';$('v4Goal').value=p.goal||'general';$('v4Pace').value=p.pace||'5';$('v4ProfileName').textContent=p.alias||'Estudiante LSA';$('v4ProfileGoal').textContent=goals[p.goal]||goals.general;$('v4Recommendation').textContent=(recs[p.goal]||recs.general)+` Meta sugerida: ${p.pace||5} minutos por día.`;$('v4CurrentLevel').textContent=currentLevel();$('v4XP').textContent=totalXP();$('v4Passed').textContent=`${(s.v4PassedLevels||[]).length}/5`;renderBadges(s)}
 function renderBadges(s){$('v4BadgeShelf').innerHTML=badgeDefs.map(([icon,label,test])=>`<div class="v4Badge${test(s)?' earned':''}"><span>${icon}</span><b>${label}</b></div>`).join('')}
 function renderLevels(){const s=state();$('v4LevelPath').innerHTML='';levels.forEach(level=>{const done=passed(level.id),reqs=requirements(level),isReady=ready(level),prevOpen=level.id===1||passed(level.id-1),card=document.createElement('article');card.className='levelCard'+(done?' passed':(!prevOpen?' locked':''));const stateText=done?'Completado':(!prevOpen?'Bloqueado':(isReady?'Checkpoint disponible':'En progreso'));card.innerHTML=`<div class="levelNumber">${done?'✓':level.id}</div><div class="levelMain"><h3>${level.icon} ${level.title}</h3><p>${level.desc}</p><div class="levelReqs">${reqs.map(([txt,ok])=>`<span class="levelReq ${ok?'ok':'miss'}">${ok?'✓':'○'} ${txt}</span>`).join('')}</div></div><div class="levelAction"><span class="levelState ${done?'done':(!prevOpen?'lock':'open')}">${stateText}</span><button class="levelButton${done?' secondary':''}" ${(!isReady&&!done)?'disabled':''}>${done?'Revisar checkpoint':isReady?'Abrir checkpoint':'Faltan requisitos'}</button></div>`;card.querySelector('button').onclick=()=>openCheckpoint(level.id);$('v4LevelPath').appendChild(card)});$('v4RoadmapBadge').textContent=passed(5)?'Ruta completa':`Nivel ${currentLevel()} en curso`;renderProfile()}

 let activeLevel=null,selectedAnswer=null;
 function openCheckpoint(id){const level=levels.find(l=>l.id===id);if(!level)return;if(!passed(id)&&!ready(level))return;activeLevel=level;selectedAnswer=null;$('v4Checkpoint').classList.remove('hidden');$('v4Celebration').classList.add('hidden');$('v4CheckEy').textContent=`Checkpoint · Nivel ${id}`;$('v4CheckTitle').textContent=`${level.icon} ${level.title}`;$('v4CheckDesc').textContent=level.desc;$('v4CheckTasks').innerHTML=level.tasks.map((t,i)=>`<label class="checkTask"><input type="checkbox" data-task="${i}"><span>${t}</span></label>`).join('');$('v4CheckQuestion').textContent=level.q;$('v4CheckOptions').innerHTML='';level.o.forEach((txt,i)=>{const b=document.createElement('button');b.className='checkpointOption';b.textContent=txt;b.onclick=()=>selectAnswer(i,b);$('v4CheckOptions').appendChild(b)});$('v4CheckFeedback').className='checkpointFeedback';$('v4CheckFeedback').textContent=passed(id)?'Este checkpoint ya fue completado. Podés revisarlo sin perder progreso.':'Elegí una respuesta.';$('v4CheckPass').disabled=passed(id);$('v4CheckPass').textContent=passed(id)?'Checkpoint completado':'Completar checkpoint';document.querySelectorAll('#v4CheckTasks input').forEach(x=>x.onchange=updatePassButton);$('v4Checkpoint').scrollIntoView({behavior:'smooth',block:'start'});updatePassButton()}
 function selectAnswer(i,btn){selectedAnswer=i;document.querySelectorAll('.checkpointOption').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');const ok=i===activeLevel.a;$('v4CheckFeedback').className='checkpointFeedback '+(ok?'ok':'bad');$('v4CheckFeedback').textContent=ok?'✓ Correcto.':'Revisá el concepto antes de completar el checkpoint.';updatePassButton()}
 function updatePassButton(){if(!activeLevel||passed(activeLevel.id))return;const allChecks=[...document.querySelectorAll('#v4CheckTasks input')].every(x=>x.checked),answerOk=selectedAnswer===activeLevel.a;$('v4CheckPass').disabled=!(allChecks&&answerOk)}
 function passCheckpoint(){if(!activeLevel||$('v4CheckPass').disabled)return;const s=state(),arr=Array.isArray(s.v4PassedLevels)?s.v4PassedLevels.slice():[];if(!arr.includes(activeLevel.id))arr.push(activeLevel.id);arr.sort((a,b)=>a-b);saveState({v4PassedLevels:arr,v4XP:(s.v4XP||0)+activeLevel.xp});$('v4CheckPass').disabled=true;$('v4CheckPass').textContent='Checkpoint completado';$('v4Celebration').classList.remove('hidden');$('v4Celebration').textContent=activeLevel.id<5?`✓ Nivel ${activeLevel.id} completado. Ganaste ${activeLevel.xp} XP y ya podés preparar el siguiente nivel.`:`✓ Ruta inicial completada. Ganaste ${activeLevel.xp} XP. Esto registra tu progreso dentro del simulador; no es una certificación lingüística.`;renderLevels()}

 $('v4ProfileForm').onsubmit=e=>{e.preventDefault();const p={alias:$('v4Alias').value.trim(),goal:$('v4Goal').value,pace:$('v4Pace').value};saveState({v4Profile:p});renderProfile()};$('v4CheckClose').onclick=()=>$('v4Checkpoint').classList.add('hidden');$('v4CheckPass').onclick=passCheckpoint;

 const refresh=()=>renderLevels();
 ['quizNext','quizRestart','letterGood','letterRepeat','practiceRandom','wordRemembered','wordRepeatV3','dailyGood','dailyRepeat','dailyAgain','missionGood','missionAgain','emergencyNext'].forEach(id=>{const el=$(id);if(el)el.addEventListener('click',()=>setTimeout(refresh,20))});
 if($('wordForm'))$('wordForm').addEventListener('submit',()=>setTimeout(refresh,20));
 if($('emergencyWords'))$('emergencyWords').addEventListener('click',()=>setTimeout(refresh,20));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
 renderLevels();
})();
