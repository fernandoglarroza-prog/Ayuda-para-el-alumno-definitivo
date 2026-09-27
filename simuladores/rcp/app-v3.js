const $=id=>document.getElementById(id);

const scenarios={
 adult:{
  kind:'cpr',ey:'RCP adulto',title:'Adulto · colapso súbito',room:'Escenario virtual · hogar',sceneClass:'adultScene',patient:'Adulto',
  compressionMax:25,techniqueMax:10,aedMax:25,needsBreaths:false,depth:'Profundidad orientativa: al menos 5 cm, evitando superar 6 cm. Permití el retroceso completo del tórax.',
  technique:'adult',
  steps:[
   {p:10,title:'Antes de acercarte',text:'Una persona adulta se desploma. ¿Cuál es tu primera acción?',scene:'Una persona adulta acaba de desplomarse. Vos sos quien está más cerca.',o:[['Compruebo rápidamente que el lugar sea seguro para acercarme',1,'Correcto. Primero verificá que la escena sea segura.'],['Empiezo compresiones sin mirar alrededor',0,'Primero comprobá rápidamente que no haya un peligro para vos ni para la persona.'],['Le doy agua para ver si reacciona',0,'No se debe dar agua a una persona inconsciente.']]},
   {p:10,title:'Comprobar respuesta',text:'El entorno parece seguro. ¿Cómo comprobás si responde?',scene:'Te acercaste. La persona permanece inmóvil.',o:[['Le hablo fuerte y estimulo suavemente sus hombros',1,'Correcto. Buscás una respuesta sin perder tiempo.'],['La siento en una silla',0,'No corresponde sentar a una persona inconsciente.'],['Espero unos minutos',0,'En una posible parada no conviene demorar la respuesta.']]},
   {p:10,title:'Respiración',text:'No responde. ¿Qué dato es clave para reconocer una posible parada?',scene:'No responde. Evaluás si respira normalmente.',o:[['Observo si respira normalmente; los jadeos agónicos no cuentan como respiración normal',1,'Correcto. Inconsciencia y ausencia de respiración normal requieren actuar rápidamente.'],['Busco el pulso durante medio minuto',0,'Una búsqueda prolongada de pulso puede retrasar la RCP en una persona no entrenada.'],['Si jadea, asumo que respira bien',0,'Los jadeos agónicos no son respiración normal.']]},
   {p:10,title:'Activar ayuda',text:'No responde y no respira normalmente. ¿Qué hacés?',scene:'La situación es compatible con una emergencia vital.',o:[['Activo emergencias, pido un DEA e inicio RCP cuanto antes',1,'Correcto. Activar ayuda, conseguir un DEA e iniciar RCP deben ocurrir cuanto antes.'],['La traslado por mi cuenta antes de pedir ayuda',0,'Eso puede retrasar la atención y la RCP.'],['Busco primero su documentación',0,'No retrases la respuesta por documentación.']]}
  ]
 },
 child:{
  kind:'cpr',ey:'RCP pediátrica',title:'Niño · paro cardiorrespiratorio',room:'Escenario virtual · espacio público',sceneClass:'childScene',patient:'Niño',
  compressionMax:20,techniqueMax:10,aedMax:20,needsBreaths:true,depth:'Profundidad orientativa: al menos un tercio del diámetro anteroposterior del tórax, aproximadamente 5 cm.',
  technique:'child',
  steps:[
   {p:10,title:'Reconocer la emergencia',text:'Un niño está inconsciente y presenta respiración anormal o jadeos. ¿Qué conducta es la más apropiada?',scene:'El niño no responde y no respira normalmente.',o:[['Activo emergencias e inicio RCP de alta calidad comenzando por compresiones',1,'Correcto. La respuesta debe ser rápida y la RCP comienza con compresiones.'],['Espero unos minutos para confirmar',0,'Esperar retrasa una intervención tiempo-dependiente.'],['Le doy agua',0,'No corresponde dar líquidos a una persona inconsciente.']]},
   {p:10,title:'Ritmo de compresiones',text:'¿Qué frecuencia de compresiones buscás?',scene:'Te preparás para iniciar compresiones.',o:[['100 a 120 por minuto',1,'Correcto. El objetivo pediátrico sigue siendo 100–120/min.'],['60 a 80 por minuto',0,'Ese ritmo es insuficiente para RCP de alta calidad.'],['Más de 150 por minuto',0,'Un ritmo excesivo puede comprometer la calidad de las compresiones.']]},
   {p:10,title:'Relación compresión-ventilación',text:'En este módulo sos un único reanimador y no hay vía aérea avanzada. ¿Qué relación usarías?',scene:'El niño necesita compresiones y ventilaciones.',o:[['30 compresiones y 2 ventilaciones',1,'Correcto para un único reanimador. Con dos reanimadores profesionales se utiliza 15:2.'],['10 compresiones y 1 ventilación',0,'No es la relación enseñada para este escenario.'],['Solo ventilaciones, sin compresiones',0,'En paro se necesitan compresiones de alta calidad.']]},
   {p:10,title:'DEA',text:'Llega un DEA. ¿Qué hacés?',scene:'El DEA ya está disponible.',o:[['Lo conecto cuanto antes y uso parches/atenuador pediátrico si están disponibles',1,'Correcto. El DEA debe colocarse cuanto antes; se prefieren elementos pediátricos si están disponibles.'],['No uso DEA en niños',0,'El DEA puede utilizarse en población pediátrica.'],['Espero a terminar muchos ciclos antes de conectarlo',0,'No conviene retrasar la desfibrilación cuando está indicada.']]}
  ]
 },
 infant:{
  kind:'cpr',ey:'RCP en lactante',title:'Lactante · paro cardiorrespiratorio',room:'Escenario virtual · hogar',sceneClass:'infantScene',patient:'Lactante',
  compressionMax:20,techniqueMax:10,aedMax:20,needsBreaths:true,depth:'Profundidad orientativa: al menos un tercio del diámetro anteroposterior del tórax, aproximadamente 4 cm.',
  technique:'infant',
  steps:[
   {p:10,title:'Reconocer la emergencia',text:'Un lactante está inconsciente y no respira normalmente. ¿Qué hacés?',scene:'El lactante no responde y presenta respiración anormal.',o:[['Activo emergencias e inicio RCP comenzando por compresiones',1,'Correcto. Hay que actuar rápidamente.'],['Lo sacudo para que reaccione',0,'No se debe sacudir a un lactante.'],['Espero a que cambie el color de la piel',0,'No hay que esperar a que aparezcan más signos de gravedad.']]},
   {p:10,title:'Ritmo',text:'¿Cuál es el objetivo de frecuencia de compresiones?',scene:'Te preparás para comprimir el tórax.',o:[['100 a 120 por minuto',1,'Correcto. El objetivo es el mismo rango de frecuencia que en niño y adulto.'],['40 a 60 por minuto',0,'Es demasiado lento para RCP.'],['Más de 160 por minuto',0,'Es demasiado rápido para una RCP de calidad.']]},
   {p:10,title:'Relación compresión-ventilación',text:'Sos un único reanimador sin vía aérea avanzada. ¿Qué relación corresponde?',scene:'El lactante requiere RCP convencional.',o:[['30 compresiones y 2 ventilaciones',1,'Correcto para un único reanimador. Con dos reanimadores profesionales se utiliza 15:2.'],['5 compresiones y 1 ventilación',0,'No es la relación indicada en este escenario.'],['Solo compresiones siempre',0,'En lactantes y niños la RCP convencional con ventilaciones es especialmente importante cuando puede realizarse.']]},
   {p:10,title:'DEA',text:'Tenés un DEA disponible. ¿Cuál es la conducta?',scene:'El DEA está listo para usarse.',o:[['Lo conecto cuanto antes y uso atenuador/parches pediátricos si están disponibles',1,'Correcto. El DEA debe conectarse tan pronto como sea posible.'],['Nunca se usa DEA en lactantes',0,'La guía contempla el uso de DEA también en lactantes.'],['Espero a que llegue un médico para encenderlo',0,'No conviene demorar su uso si el equipo está disponible.']]}
  ]
 },
 adultChoking:{
  kind:'choking',ey:'Primeros auxilios',title:'Adulto · atragantamiento grave',room:'Escenario virtual · comedor',sceneClass:'chokingScene',patient:'Adulto',secondLabel:'Compresiones abdominales',secondButton:'Realizar compresión abdominal',
  steps:[
   {p:20,title:'Reconocer la gravedad',text:'Durante una comida, una persona se lleva las manos al cuello. No puede hablar y su tos es débil. ¿Qué interpretás?',scene:'La persona no puede hablar y casi no logra toser.',o:[['Es una obstrucción grave y necesita ayuda inmediata',1,'Correcto. Incapacidad para hablar y tos débil son signos de obstrucción grave.'],['Mientras esté de pie no es urgente',0,'Poder mantenerse de pie no descarta una obstrucción grave.'],['Le doy agua',0,'No le des agua ante una obstrucción grave.']]},
   {p:20,title:'Pedir ayuda',text:'La obstrucción es grave y sigue consciente. ¿Qué hacés además de iniciar maniobras?',scene:'Confirmaste una obstrucción grave.',o:[['Activo el sistema de emergencias o hago que otra persona lo active',1,'Correcto. Hay que activar la respuesta de emergencias mientras se interviene.'],['Espero a que se desmaye',0,'No conviene esperar para pedir ayuda.'],['Me alejo para buscar información',0,'Necesita intervención inmediata.']]},
   {p:30,title:'Si deja de responder',text:'Durante la asistencia, la persona pierde la respuesta. ¿Cuál es el siguiente paso?',scene:'La persona deja de responder y cae al suelo.',o:[['Inicio RCP comenzando por compresiones y reviso si hay un objeto visible antes de ventilaciones',1,'Correcto. Se pasa al algoritmo de RCP.'],['Sigo con compresiones abdominales de pie',0,'Al quedar inconsciente se inicia RCP.'],['Introduzco los dedos a ciegas en la boca',0,'No se recomiendan barridos digitales a ciegas.']]}
  ]
 },
 infantChoking:{
  kind:'choking',ey:'Primeros auxilios pediátricos',title:'Lactante · atragantamiento grave',room:'Escenario virtual · hogar',sceneClass:'infantChokingScene',patient:'Lactante',secondLabel:'Compresiones torácicas',secondButton:'Realizar compresión torácica',
  steps:[
   {p:20,title:'Reconocer la gravedad',text:'Un lactante no puede llorar, su tos es débil y cambia de color. ¿Qué interpretás?',scene:'El lactante presenta signos de obstrucción grave de la vía aérea.',o:[['Es una obstrucción grave y necesita intervención inmediata',1,'Correcto. Esos son signos de obstrucción grave.'],['Espero a que vuelva a llorar',0,'No conviene esperar ante signos de obstrucción grave.'],['Intento una compresión abdominal',0,'Las compresiones abdominales no se recomiendan en lactantes.']]},
   {p:20,title:'Pedir ayuda',text:'El lactante sigue consciente. ¿Qué hacés además de iniciar las maniobras?',scene:'La obstrucción sigue siendo grave.',o:[['Activo emergencias o hago que otra persona las active',1,'Correcto. La ayuda avanzada debe activarse.'],['Espero a completar muchos ciclos antes de pedir ayuda',0,'No se debe demorar la activación de emergencias.'],['Le doy agua',0,'No corresponde dar líquidos en una obstrucción grave.']]},
   {p:30,title:'Si deja de responder',text:'El lactante deja de responder. ¿Qué hacés?',scene:'El lactante se vuelve inconsciente.',o:[['Inicio RCP con compresiones y busco un objeto visible antes de dar ventilaciones',1,'Correcto. Se inicia RCP y solo se retira un objeto si es visible.'],['Sigo haciendo la misma maniobra sin cambiar nada',0,'Al perder la respuesta se inicia RCP.'],['Hago un barrido digital a ciegas',0,'No se debe buscar el objeto a ciegas con los dedos.']]}
  ]
 }
};

let mode='learn',scenarioKey=null,step=0,stage=1,points=0,mistakes=0,answered=false,taps=[],metroTimer=null,audioCtx=null,breaths=0,backCount=0,secondCount=0,chokingPenalty=0;
const sections={decisions:0,technique:0,compressions:0,breaths:0,aed:0,maneuver:0};
const current=()=>scenarios[scenarioKey];

function setMode(next){mode=next;$('modeLearn').classList.toggle('active',mode==='learn');$('modeExam').classList.toggle('active',mode==='exam')}
$('modeLearn').onclick=()=>setMode('learn');$('modeExam').onclick=()=>setMode('exam');

function applyMode(){
 document.querySelectorAll('.learnOnly').forEach(el=>el.classList.toggle('hidden',mode==='exam'));
 document.querySelectorAll('.examOnly').forEach(el=>el.classList.toggle('hidden',mode!=='exam'));
 $('modeBadge').textContent=mode==='learn'?'Modo aprender':'Modo examen';$('modeBadge').classList.toggle('exam',mode==='exam');
 $('bpm').closest('.metric').classList.toggle('hidden',mode==='exam');
}
function hidePanels(){['decisionPanel','handsPanel','techniquePanel','trainer','ventilationPanel','aedPanel','chokingAction','resultPanel'].forEach(id=>$(id).classList.add('hidden'))}
function resetState(){
 stopMetronome();step=0;stage=1;points=0;mistakes=0;answered=false;taps=[];breaths=0;backCount=0;secondCount=0;chokingPenalty=0;Object.keys(sections).forEach(k=>sections[k]=0);hidePanels();
 $('nextBtn').hidden=true;$('handsNext').hidden=true;$('techniqueNext').hidden=true;$('trainerNext').hidden=true;$('ventNext').hidden=true;$('finishBtn').hidden=true;$('chokingNext').hidden=true;
 $('compressionCount').textContent='0';$('bpm').textContent='—';$('rhythmStatus').textContent='Empezá';$('needle').style.left='50%';
 $('trainerFeedback').innerHTML='<b>Consejo:</b> buscá un ritmo continuo y regular.';
 document.querySelectorAll('.hotspot').forEach(x=>{x.classList.remove('good','bad');x.disabled=false});
 $('handsFeedback').className='feedback';$('handsFeedback').textContent='Tocá una zona del tórax.';
 $('breathCount').textContent='0/2';$('breathBtn').disabled=false;$('ventFeedback').className='feedback';$('ventFeedback').textContent='Realizá dos ventilaciones simuladas.';
 resetAed();$('backCount').textContent='0/5';$('abCount').textContent='0/5';$('backBtn').disabled=false;$('abBtn').disabled=mode==='learn';$('chokingFeedback').className='feedback';$('chokingFeedback').textContent='Comenzá la secuencia.';
}
function configureScene(){
 const s=current();$('scene').className='scene '+s.sceneClass;$('standingPatient').classList.toggle('hidden',s.kind!=='choking'||scenarioKey==='infantChoking');$('infantChokingVisual').classList.toggle('hidden',scenarioKey!=='infantChoking');$('patientTypeBadge').textContent=s.patient;
}
function totalStages(){const s=current();if(s.kind==='choking')return 4;return s.steps.length+3+(s.needsBreaths?1:0)}
function startScenario(key){scenarioKey=key;resetState();applyMode();configureScene();const s=current();$('setupPanel').classList.add('hidden');$('simulation').classList.remove('hidden');$('caseEy').textContent=s.ey;$('caseTitle').textContent=s.title;$('roomLabel').textContent=s.room;renderDecision();updateStats();$('simulation').scrollIntoView({behavior:'smooth',block:'start'})}
$('startAdult').onclick=()=>startScenario('adult');$('startChoking').onclick=()=>startScenario('adultChoking');$('startChild').onclick=()=>startScenario('child');$('startInfant').onclick=()=>startScenario('infant');$('startInfantChoking').onclick=()=>startScenario('infantChoking');

function renderDecision(){
 hidePanels();$('decisionPanel').classList.remove('hidden');answered=false;const q=current().steps[step];$('stepNumber').textContent=`Etapa ${stage} de ${totalStages()}`;$('stepTitle').textContent=q.title;$('stepText').textContent=q.text;$('sceneText').textContent=q.scene;$('choices').innerHTML='';$('feedback').className='feedback';$('feedback').textContent=mode==='learn'?'Elegí una opción.':'Elegí tu respuesta. La corrección aparecerá al final.';$('nextBtn').hidden=true;
 q.o.forEach(([label,ok,msg])=>{const b=document.createElement('button');b.className='choice';b.textContent=label;b.onclick=()=>choose(b,ok,msg,q.p);$('choices').appendChild(b)});updateStats();
}
function choose(btn,ok,msg,value){
 if(answered)return;
 if(mode==='exam'){answered=true;btn.classList.add('selectedExam');[...$('choices').children].forEach(x=>x.disabled=true);if(ok){points+=value;sections.decisions+=value}else mistakes++;$('feedback').className='feedback neutral';$('feedback').textContent='Respuesta registrada.';$('nextBtn').hidden=false;updateStats();return}
 if(ok){answered=true;btn.classList.add('correct');points+=value;sections.decisions+=value;$('feedback').className='feedback ok';$('feedback').textContent='✓ '+msg;[...$('choices').children].forEach(x=>x.disabled=true);$('nextBtn').hidden=false}else{mistakes++;btn.classList.add('wrong');btn.disabled=true;$('feedback').className='feedback bad';$('feedback').textContent='Revisá: '+msg}updateStats();
}
$('nextBtn').onclick=()=>{
 const s=current();
 if(s.kind==='choking'){
  if(step===0){step=1;stage=2;renderDecision();return}
  if(step===1){stage=3;showChokingAction();return}
  finishScenario();return
 }
 if(step<s.steps.length-1){step++;stage++;renderDecision();return}
 stage=s.steps.length+1;s.technique==='adult'?showHands():showTechnique();
};

function showHands(){hidePanels();$('handsPanel').classList.remove('hidden');$('sceneText').textContent='Te preparás para iniciar compresiones en el centro del pecho.';updateStats()}
document.querySelectorAll('.hotspot').forEach(btn=>btn.onclick=()=>selectHandZone(btn));
function selectHandZone(btn){
 if(!$('handsNext').hidden)return;const good=btn.dataset.zone==='center';
 if(mode==='exam'){document.querySelectorAll('.hotspot').forEach(x=>x.disabled=true);if(good){points+=current().techniqueMax;sections.technique=current().techniqueMax}else mistakes++;$('handsFeedback').className='feedback neutral';$('handsFeedback').textContent='Posición registrada.';$('handsNext').hidden=false;updateStats();return}
 if(good){btn.classList.add('good');points+=current().techniqueMax;sections.technique=current().techniqueMax;document.querySelectorAll('.hotspot').forEach(x=>x.disabled=true);$('handsFeedback').className='feedback ok';$('handsFeedback').innerHTML='✓ Talón de una mano en el <b>centro del pecho</b>, con la otra mano encima.';$('handsNext').hidden=false}else{mistakes++;btn.classList.add('bad');btn.disabled=true;$('handsFeedback').className='feedback bad';$('handsFeedback').textContent='Probá otra zona: buscá el centro del pecho.'}updateStats();
}
$('handsNext').onclick=showTrainer;

function showTechnique(){
 hidePanels();$('techniquePanel').classList.remove('hidden');const s=current();$('techniqueTitle').textContent=s.technique==='child'?'Elegí la técnica de compresión en un niño':'Elegí la técnica de compresión en un lactante';$('techniqueText').textContent=s.technique==='child'?'La técnica se adapta al tamaño del niño y del reanimador.':'La recomendación 2025 cambió la técnica para lactantes.';$('techniqueOptions').innerHTML='';
 const options=s.technique==='child'?[['Una o dos manos sobre el esternón, según tamaño del niño y del reanimador',1,'Correcto. Puede utilizarse una o dos manos para lograr una compresión adecuada.'],['Dos dedos sobre el esternón',0,'La técnica de dos dedos corresponde a recomendaciones antiguas para lactantes, no para niños.'],['Comprimir sobre el abdomen',0,'Las compresiones de RCP se realizan sobre el tórax.']]:[['Talón de una mano sobre el esternón o técnica de dos pulgares rodeando el tórax',1,'Correcto. Son las técnicas recomendadas en 2025 para lactantes.'],['Dos dedos sobre el esternón como técnica principal',0,'La guía 2025 eliminó la técnica de dos dedos por su menor eficacia para alcanzar profundidad.'],['Compresiones abdominales',0,'La RCP del lactante se realiza sobre el tórax.']];
 $('techniqueFeedback').className='feedback';$('techniqueFeedback').textContent=mode==='learn'?'Elegí una opción.':'Registrá la técnica que usarías.';$('techniqueNext').hidden=true;let done=false;
 options.forEach(([label,ok,msg])=>{const b=document.createElement('button');b.className='techniqueOption';b.innerHTML=`<b>${label}</b><small>${mode==='learn'?'Seleccioná para comprobar':''}</small>`;b.onclick=()=>{if(done)return;if(mode==='exam'){done=true;document.querySelectorAll('.techniqueOption').forEach(x=>x.disabled=true);b.classList.add('selectedExam');if(ok){points+=s.techniqueMax;sections.technique=s.techniqueMax}else mistakes++;$('techniqueFeedback').className='feedback neutral';$('techniqueFeedback').textContent='Técnica registrada.';$('techniqueNext').hidden=false;updateStats();return}if(ok){done=true;b.classList.add('correct');points+=s.techniqueMax;sections.technique=s.techniqueMax;document.querySelectorAll('.techniqueOption').forEach(x=>x.disabled=true);$('techniqueFeedback').className='feedback ok';$('techniqueFeedback').textContent='✓ '+msg;$('techniqueNext').hidden=false}else{mistakes++;b.classList.add('wrong');b.disabled=true;$('techniqueFeedback').className='feedback bad';$('techniqueFeedback').textContent='Revisá: '+msg}updateStats()};$('techniqueOptions').appendChild(b)});
 $('sceneText').textContent=s.technique==='child'?'Elegís la técnica que permita alcanzar profundidad adecuada.':'Elegís una técnica de compresión eficaz para el lactante.';updateStats();
}
$('techniqueNext').onclick=showTrainer;

function showTrainer(){
 hidePanels();$('trainer').classList.remove('hidden');const s=current();stage=s.steps.length+2;$('depthInfo').textContent=s.depth;$('trainerNext').textContent=s.needsBreaths?'Practicar 2 ventilaciones →':'Continuar al DEA →';$('sceneText').textContent='Comenzás las compresiones y entrenás el ritmo.';updateStats();
}
function compress(){
 if(taps.length>=30)return;const now=performance.now();taps.push(now);$('compressionCount').textContent=taps.length;$('compressBtn').classList.add('pressed');setTimeout(()=>$('compressBtn').classList.remove('pressed'),80);
 if(taps.length>=4){const first=Math.max(0,taps.length-10),dt=(taps[taps.length-1]-taps[first])/1000,rate=((taps.length-1-first)/dt)*60;$('bpm').textContent=Math.round(rate);$('needle').style.left=Math.max(0,Math.min(100,(rate-60)))+'%';$('rhythmStatus').textContent=rate>=100&&rate<=120?'En objetivo':rate<100?'Muy lento':'Muy rápido'}
 if(taps.length===30){stopMetronome();const dt=(taps[29]-taps[0])/1000,avg=29/dt*60,max=current().compressionMax,earned=avg>=100&&avg<=120?max:(avg>=90&&avg<=130?Math.round(max*.65):Math.round(max*.25));points+=earned;sections.compressions=earned;if(mode==='learn')$('trainerFeedback').innerHTML=`<b>Resultado:</b> ritmo promedio estimado <b>${Math.round(avg)}/min</b>. ${avg>=100&&avg<=120?'Estás dentro del objetivo.':'El objetivo es 100–120/min.'}`;else $('trainerFeedback').innerHTML='<b>Serie registrada.</b> El resultado aparecerá al final.';$('trainerNext').hidden=false;updateStats()}
}
$('compressBtn').onclick=compress;document.addEventListener('keydown',e=>{if(e.code==='Space'&&!$('trainer').classList.contains('hidden')){e.preventDefault();compress()}});$('trainerNext').onclick=()=>current().needsBreaths?showVentilation():showAed();
function beep(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=880;g.gain.value=.05;o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.045)}catch(e){}}
function startMetronome(){if(metroTimer)return;beep();metroTimer=setInterval(beep,545);$('metroBtn').classList.add('on');$('metroBtn').textContent='♪ Metrónomo: encendido';$('metroBtn').setAttribute('aria-pressed','true')}
function stopMetronome(){if(metroTimer){clearInterval(metroTimer);metroTimer=null}if($('metroBtn')){$('metroBtn').classList.remove('on');$('metroBtn').textContent='♪ Metrónomo: apagado';$('metroBtn').setAttribute('aria-pressed','false')}}
$('metroBtn').onclick=()=>metroTimer?stopMetronome():startMetronome();

function showVentilation(){hidePanels();$('ventilationPanel').classList.remove('hidden');stage=current().steps.length+3;$('ratioBadge').textContent='Un reanimador · 30:2';$('ventDetail').textContent=scenarioKey==='infant'?'Ventilá solo hasta observar elevación visible del tórax; evitá ventilaciones excesivas.':'Cada ventilación debe ser suficiente para producir elevación visible del tórax; evitá ventilación excesiva.';$('sceneText').textContent='Después de 30 compresiones practicás dos ventilaciones simuladas.';updateStats()}
$('breathBtn').onclick=()=>{if(breaths>=2)return;breaths++;$('breathCount').textContent=`${breaths}/2`;$('airPulse').classList.remove('go');void $('airPulse').offsetWidth;$('airPulse').classList.add('go');if(breaths===2){$('breathBtn').disabled=true;points+=10;sections.breaths=10;$('ventFeedback').className='feedback ok';$('ventFeedback').textContent=mode==='learn'?'✓ Serie 30:2 completada. La pantalla no puede evaluar sello, volumen ni expansión real del tórax.':'Serie registrada.';$('ventNext').hidden=false;updateStats()}};$('ventNext').onclick=showAed;

function resetAed(){$('aedPower').disabled=false;$('aedShock').disabled=true;$('padsBtn').disabled=true;$('clearBtn').disabled=true;$('resumeBtn').disabled=true;['padsBtn','clearBtn','resumeBtn'].forEach(id=>$(id).classList.remove('done'));$('aedScreen').textContent='DEA listo. Encendé el equipo.';$('aedFeedback').className='feedback';$('aedFeedback').textContent='Encendé el DEA para comenzar.'}
function showAed(){hidePanels();$('aedPanel').classList.remove('hidden');const s=current();stage=totalStages();$('aedPeds').classList.toggle('hidden',scenarioKey==='adult');$('sceneText').textContent='Llega un DEA. Seguí sus indicaciones con seguridad.';updateStats()}
$('aedPower').onclick=()=>{$('aedPower').disabled=true;$('padsBtn').disabled=false;$('aedScreen').textContent='Coloque los parches sobre el tórax.';$('aedFeedback').textContent='Ahora colocá los parches.'};
$('padsBtn').onclick=()=>{$('padsBtn').disabled=true;$('padsBtn').classList.add('done');$('clearBtn').disabled=false;$('aedScreen').textContent='Analizando ritmo. No toque al paciente.';$('aedFeedback').textContent='Confirmá que nadie esté tocando a la persona.'};
$('clearBtn').onclick=()=>{$('clearBtn').disabled=true;$('clearBtn').classList.add('done');$('aedShock').disabled=false;$('aedScreen').textContent='Descarga indicada. Manténgase alejado.';$('aedFeedback').className='feedback bad';$('aedFeedback').textContent='Verificá visualmente que nadie toque y realizá la descarga.'};
$('aedShock').onclick=()=>{$('aedShock').disabled=true;$('resumeBtn').disabled=false;$('aedScreen').textContent='Descarga administrada. Reanude RCP.';$('aedFeedback').className='feedback ok';$('aedFeedback').textContent='Reanudá las compresiones inmediatamente.'};
$('resumeBtn').onclick=()=>{$('resumeBtn').disabled=true;$('resumeBtn').classList.add('done');const max=current().aedMax;points+=max;sections.aed=max;$('aedScreen').textContent='RCP reanudada.';$('aedFeedback').className='feedback ok';$('aedFeedback').textContent='✓ Secuencia del DEA completada.';$('finishBtn').hidden=false;updateStats()};$('finishBtn').onclick=finishScenario;

function showChokingAction(){
 hidePanels();$('chokingAction').classList.remove('hidden');const s=current();$('secondActionLabel').textContent=s.secondLabel;$('abBtn').textContent=s.secondButton;$('chokingTitle').textContent=scenarioKey==='infantChoking'?'Secuencia para lactante consciente':'Secuencia para adulto consciente';$('chokingExplain').innerHTML=scenarioKey==='infantChoking'?'Realizá ciclos de <b>5 golpes en la espalda y 5 compresiones torácicas</b>. No uses compresiones abdominales en lactantes.':'Realizá ciclos de <b>5 golpes en la espalda y 5 compresiones abdominales</b>.';$('sceneText').textContent='Practicás un ciclo completo de desobstrucción.';updateStats();
}
$('backBtn').onclick=()=>{if(backCount>=5)return;backCount++;$('backCount').textContent=`${backCount}/5`;if(backCount===5){$('backBtn').disabled=true;$('abBtn').disabled=false;$('chokingFeedback').textContent='Completaste 5 golpes. Ahora realizá 5 '+current().secondLabel.toLowerCase()+'.'}};
$('abBtn').onclick=()=>{if(secondCount>=5)return;if(backCount<5){mistakes++;chokingPenalty+=5;$('chokingFeedback').className='feedback bad';$('chokingFeedback').textContent='El ciclo comienza con 5 golpes en la espalda.';updateStats();return}secondCount++;$('abCount').textContent=`${secondCount}/5`;if(secondCount===5){$('abBtn').disabled=true;const earned=Math.max(15,30-chokingPenalty);points+=earned;sections.maneuver=earned;$('chokingFeedback').className='feedback ok';$('chokingFeedback').textContent='✓ Ciclo completo. Se repite hasta expulsar el objeto o hasta que la persona deje de responder.';$('chokingNext').hidden=false;updateStats()}};
$('chokingNext').onclick=()=>{step=2;stage=4;renderDecision()};

function score(){return Math.max(0,Math.min(100,Math.round(points-Math.min(20,mistakes*2))))}
function finishScenario(){
 hidePanels();$('resultPanel').classList.remove('hidden');const s=current(),final=score();$('finalScore').textContent=final;$('resultTitle').textContent=final>=85?'Muy buen entrenamiento':final>=65?'Simulación completada':'Conviene repetir el caso';
 const rows=[];if(sections.decisions||s.kind==='choking')rows.push(['Decisiones',sections.decisions]);if(s.kind==='cpr'){rows.push(['Técnica',sections.technique],['Compresiones',sections.compressions]);if(s.needsBreaths)rows.push(['Ventilaciones',sections.breaths]);rows.push(['DEA',sections.aed])}else rows.push(['Maniobra',sections.maneuver]);$('breakdown').innerHTML=rows.map(([n,v])=>`<div><span>${n}</span><b>${v} pts</b></div>`).join('');
 $('resultMessage').textContent=`Puntaje educativo ${final}/100 · ${mistakes} error${mistakes===1?'':'es'} registrado${mistakes===1?'':'s'}. Repetir el caso ayuda a automatizar la secuencia, pero esta herramienta no sustituye práctica presencial con maniquí ni formación certificada.`;
 $('sourceBox').innerHTML=s.kind==='cpr'&&scenarioKey!=='adult'?'<b>Base educativa</b><br>Guías 2025 de la American Heart Association y American Academy of Pediatrics para soporte vital básico pediátrico.':'<b>Base educativa</b><br>Guías 2025 de la American Heart Association para soporte vital básico y obstrucción de vía aérea.';updateStats();
}
function updateStats(){if(!scenarioKey)return;$('stepStat').textContent=`${Math.min(stage,totalStages())}/${totalStages()}`;$('pointsStat').textContent=points;$('mistakeStat').textContent=mistakes;$('progressBar').style.width=`${Math.min(100,stage/totalStages()*100)}%`}
$('exitBtn').onclick=()=>{stopMetronome();$('simulation').classList.add('hidden');$('setupPanel').classList.remove('hidden');window.scrollTo({top:$('setupPanel').offsetTop-90,behavior:'smooth'})};$('otherCaseBtn').onclick=$('exitBtn').onclick;$('restartBtn').onclick=()=>startScenario(scenarioKey);
setMode('learn');