const $=id=>document.getElementById(id);

const adultSteps=[
 {title:'Antes de acercarte',text:'Una persona adulta se desploma. ¿Cuál es tu primera acción?',scene:'Una persona adulta acaba de desplomarse. Vos sos quien está más cerca.',points:10,options:[['Compruebo rápidamente que el lugar sea seguro para acercarme',1,'Correcto. Primero verificá que la escena sea segura.'],['Corro y empiezo compresiones sin mirar alrededor',0,'Primero comprobá rápidamente que no haya un peligro para vos ni para la persona.'],['Le doy agua para ver si reacciona',0,'No se debe dar agua a una persona inconsciente.']]},
 {title:'Comprobar respuesta',text:'El entorno parece seguro. ¿Cómo comprobás si responde?',scene:'Te acercaste. La persona permanece inmóvil.',points:10,options:[['Le hablo fuerte y estimulo suavemente sus hombros',1,'Correcto. Buscás una respuesta sin perder tiempo.'],['La siento en una silla',0,'No corresponde sentar a una persona inconsciente.'],['Espero unos minutos a ver si se despierta sola',0,'En una posible parada no conviene demorar la respuesta.']]},
 {title:'Respiración',text:'No responde. ¿Qué dato es clave para reconocer una posible parada?',scene:'No responde. Ahora evaluás si respira normalmente.',points:10,options:[['Observo si respira normalmente; los jadeos agónicos no cuentan como respiración normal',1,'Correcto. Inconsciencia y ausencia de respiración normal requieren actuar rápidamente.'],['Busco el pulso durante medio minuto antes de decidir',0,'Para una persona no entrenada, una búsqueda prolongada de pulso puede retrasar el inicio de RCP.'],['Si jadea, asumo que está respirando bien',0,'Los jadeos agónicos pueden aparecer durante una parada y no son respiración normal.']]},
 {title:'Activar ayuda',text:'No responde y no respira normalmente. ¿Qué hacés?',scene:'La situación es compatible con una emergencia vital.',points:10,options:[['Activo el sistema de emergencias y pido un DEA; si hay alguien, reparto tareas e inicio RCP',1,'Correcto. Activar ayuda, conseguir un DEA e iniciar RCP deben ocurrir cuanto antes.'],['La traslado por mi cuenta antes de pedir ayuda',0,'Eso puede retrasar la atención y la RCP.'],['Busco primero su documentación',0,'No retrases la respuesta por documentación.']]}
];

const chokingSteps=[
 {title:'Reconocer la gravedad',text:'Durante una comida, una persona se lleva las manos al cuello. No puede hablar y su tos es débil. ¿Qué interpretás?',scene:'La persona no puede hablar y casi no logra toser.',points:20,options:[['Es una obstrucción grave de la vía aérea y necesita ayuda inmediata',1,'Correcto. Incapacidad para hablar y tos débil son signos de obstrucción grave.'],['Mientras esté de pie no es una urgencia',0,'Poder mantenerse de pie no descarta una obstrucción grave.'],['Le doy agua para que empuje el objeto',0,'No le des agua ante una obstrucción grave.']]},
 {title:'Pedir ayuda',text:'La obstrucción es grave y la persona sigue consciente. ¿Qué hacés además de iniciar las maniobras?',scene:'Confirmaste signos de obstrucción grave. La persona continúa consciente.',points:20,options:[['Activo el sistema de emergencias o hago que otra persona lo active',1,'Correcto. Hay que activar la respuesta de emergencias mientras se interviene.'],['Espero a ver si se desmaya para pedir ayuda',0,'No conviene esperar a que pierda la respuesta para activar emergencias.'],['Me alejo para buscar información en internet',0,'La persona necesita intervención inmediata.']]},
 {title:'Si deja de responder',text:'Durante la asistencia, la persona pierde la respuesta y cae al suelo. ¿Cuál es el siguiente paso?',scene:'La persona deja de responder. Ahora la conducta cambia.',points:20,options:[['Inicio RCP comenzando por compresiones y reviso si hay un objeto visible antes de dar ventilaciones',1,'Correcto. Al quedar inconsciente se inicia RCP; antes de ventilaciones se mira si hay un objeto visible.'],['Sigo haciendo compresiones abdominales de pie',0,'Al quedar inconsciente se pasa al algoritmo de RCP.'],['Introduzco los dedos a ciegas en la boca para buscar el objeto',0,'No se recomienda hacer barridos digitales a ciegas.']]}
];

let mode='learn';
let scenario=null;
let step=0;
let stage=1;
let totalStages=7;
let points=0;
let mistakes=0;
let decisionPoints=0;
let handPoints=0;
let compressionPoints=0;
let aedPoints=0;
let chokingActionPoints=0;
let answered=false;
let taps=[];
let backCount=0;
let abCount=0;
let chokingPenalty=0;
let metroTimer=null;
let audioCtx=null;

function setMode(next){
 mode=next;
 $('modeLearn').classList.toggle('active',mode==='learn');
 $('modeExam').classList.toggle('active',mode==='exam');
}
$('modeLearn').onclick=()=>setMode('learn');
$('modeExam').onclick=()=>setMode('exam');

function applyMode(){
 document.querySelectorAll('.learnOnly').forEach(el=>el.classList.toggle('hidden',mode==='exam'));
 document.querySelectorAll('.examOnly').forEach(el=>el.classList.toggle('hidden',mode!=='exam'));
 $('modeBadge').textContent=mode==='learn'?'Modo aprender':'Modo examen';
 $('modeBadge').classList.toggle('exam',mode==='exam');
 const bpmMetric=$('bpm').closest('.metric');
 bpmMetric.classList.toggle('hidden',mode==='exam');
}

function resetState(){
 stopMetronome();
 step=0;stage=1;points=0;mistakes=0;decisionPoints=0;handPoints=0;compressionPoints=0;aedPoints=0;chokingActionPoints=0;answered=false;taps=[];backCount=0;abCount=0;chokingPenalty=0;
 $('decisionPanel').classList.remove('hidden');
 $('handsPanel').classList.add('hidden');
 $('trainer').classList.add('hidden');
 $('aedPanel').classList.add('hidden');
 $('chokingAction').classList.add('hidden');
 $('resultPanel').classList.add('hidden');
 $('nextBtn').hidden=true;
 $('handsNext').hidden=true;
 $('trainerNext').hidden=true;
 $('finishBtn').hidden=true;
 $('chokingNext').hidden=true;
 $('compressionCount').textContent='0';$('bpm').textContent='—';$('rhythmStatus').textContent='Empezá';$('needle').style.left='50%';
 $('trainerFeedback').innerHTML='<b>Consejo:</b> buscá un ritmo continuo y regular.';
 document.querySelectorAll('.hotspot').forEach(x=>x.classList.remove('good','bad'));
 $('handsFeedback').className='feedback';$('handsFeedback').textContent='Tocá una zona del tórax.';
 resetAed();
 $('backCount').textContent='0/5';$('abCount').textContent='0/5';$('backBtn').disabled=false;$('abBtn').disabled=mode==='learn';
 $('chokingFeedback').className='feedback';$('chokingFeedback').textContent='Comenzá la secuencia.';
 updateStats();
}

function startScenario(name){
 scenario=name;
 resetState();
 applyMode();
 $('setupPanel').classList.add('hidden');
 $('simulation').classList.remove('hidden');
 $('scene').classList.toggle('chokingScene',scenario==='choking');
 $('standingPatient').classList.toggle('hidden',scenario!=='choking');
 if(scenario==='adult'){
   totalStages=7;$('caseEy').textContent='RCP adulto';$('caseTitle').textContent='Colapso súbito';$('roomLabel').textContent='Escenario virtual · hogar';
 }else{
   totalStages=4;$('caseEy').textContent='Primeros auxilios';$('caseTitle').textContent='Atragantamiento en adulto';$('roomLabel').textContent='Escenario virtual · comedor';
 }
 renderDecision();
 updateStats();
 $('simulation').scrollIntoView({behavior:'smooth',block:'start'});
}
$('startAdult').onclick=()=>startScenario('adult');
$('startChoking').onclick=()=>startScenario('choking');

function currentSteps(){return scenario==='adult'?adultSteps:chokingSteps}

function renderDecision(){
 answered=false;
 $('decisionPanel').classList.remove('hidden');
 $('handsPanel').classList.add('hidden');$('trainer').classList.add('hidden');$('aedPanel').classList.add('hidden');$('chokingAction').classList.add('hidden');
 const s=currentSteps()[step];
 $('stepNumber').textContent=`Etapa ${stage} de ${totalStages}`;
 $('stepTitle').textContent=s.title;$('stepText').textContent=s.text;$('sceneText').textContent=s.scene;
 $('choices').innerHTML='';$('feedback').className='feedback';$('feedback').textContent=mode==='learn'?'Elegí una opción.':'Elegí tu respuesta. No habrá corrección hasta el final.';$('nextBtn').hidden=true;
 s.options.forEach(([label,ok,msg])=>{
   const b=document.createElement('button');b.className='choice';b.textContent=label;b.onclick=()=>choose(b,ok,msg,s.points);$('choices').appendChild(b);
 });
 updateStats();
}

function choose(btn,ok,msg,value){
 if(answered)return;
 if(mode==='exam'){
   answered=true;
   btn.classList.add('selectedExam');
   [...$('choices').children].forEach(x=>x.disabled=true);
   if(ok){decisionPoints+=value;points+=value}else{mistakes++}
   $('feedback').className='feedback neutral';$('feedback').textContent='Respuesta registrada. Continuá con el caso.';$('nextBtn').hidden=false;updateStats();return;
 }
 if(ok){
   answered=true;btn.classList.add('correct');decisionPoints+=value;points+=value;$('feedback').className='feedback ok';$('feedback').textContent='✓ '+msg;[...$('choices').children].forEach(x=>x.disabled=true);$('nextBtn').hidden=false;
 }else{
   mistakes++;btn.classList.add('wrong');btn.disabled=true;$('feedback').className='feedback bad';$('feedback').textContent='Revisá: '+msg;
 }
 updateStats();
}

$('nextBtn').onclick=()=>{
 if(scenario==='adult'){
   if(step<adultSteps.length-1){step++;stage++;renderDecision()}else{showHands()}
 }else{
   if(step===0){step=1;stage=2;renderDecision()}
   else if(step===1){showChokingAction()}
   else finishChoking();
 }
};

function showHands(){
 stage=5;$('decisionPanel').classList.add('hidden');$('handsPanel').classList.remove('hidden');$('sceneText').textContent='Te preparás para iniciar compresiones en el centro del pecho.';updateStats();
}

document.querySelectorAll('.hotspot').forEach(btn=>btn.onclick=()=>selectHandZone(btn));
function selectHandZone(btn){
 if($('handsNext').hidden===false)return;
 const good=btn.dataset.zone==='center';
 if(mode==='exam'){
   document.querySelectorAll('.hotspot').forEach(x=>x.disabled=true);btn.classList.add(good?'good':'bad');if(good){handPoints=10;points+=10}else mistakes++;
   $('handsFeedback').className='feedback neutral';$('handsFeedback').textContent='Posición registrada. La corrección aparecerá en el resultado.';$('handsNext').hidden=false;updateStats();return;
 }
 if(good){
   btn.classList.add('good');handPoints=10;points+=10;document.querySelectorAll('.hotspot').forEach(x=>x.disabled=true);$('handsFeedback').className='feedback ok';$('handsFeedback').innerHTML='✓ Colocá el talón de una mano en el <b>centro del pecho</b> y la otra mano encima.';$('handsNext').hidden=false;
 }else{
   mistakes++;btn.classList.add('bad');btn.disabled=true;$('handsFeedback').className='feedback bad';$('handsFeedback').textContent='Probá otra zona: buscá el centro del pecho.';
 }
 updateStats();
}
$('handsNext').onclick=showTrainer;

function showTrainer(){
 stage=6;$('handsPanel').classList.add('hidden');$('trainer').classList.remove('hidden');$('sceneText').textContent='Comenzás las compresiones mientras llega el DEA.';updateStats();
}

function compress(){
 if(taps.length>=30)return;
 const now=performance.now();taps.push(now);$('compressionCount').textContent=taps.length;$('compressBtn').classList.add('pressed');setTimeout(()=>$('compressBtn').classList.remove('pressed'),80);
 if(taps.length>=4){
   const first=Math.max(0,taps.length-10);const dt=(taps[taps.length-1]-taps[first])/1000;const rate=((taps.length-1-first)/dt)*60;
   $('bpm').textContent=Math.round(rate);const pos=Math.max(0,Math.min(100,(rate-60)/100*100));$('needle').style.left=pos+'%';$('rhythmStatus').textContent=rate>=100&&rate<=120?'En objetivo':rate<100?'Muy lento':'Muy rápido';
 }
 if(taps.length===30){
   stopMetronome();const dt=(taps[29]-taps[0])/1000;const avg=29/dt*60;compressionPoints=avg>=100&&avg<=120?25:(avg>=90&&avg<=130?15:5);points+=compressionPoints;
   if(mode==='learn')$('trainerFeedback').innerHTML=`<b>Resultado:</b> ritmo promedio estimado de <b>${Math.round(avg)}/min</b>. ${avg>=100&&avg<=120?'Estás dentro del objetivo de 100–120/min.':'El objetivo es 100–120/min. Repetir el ejercicio ayuda a estabilizar el ritmo.'}`;
   else $('trainerFeedback').innerHTML='<b>Serie registrada.</b> Tu ritmo se mostrará en la evaluación final.';
   $('trainerNext').hidden=false;updateStats();
 }
}
$('compressBtn').onclick=compress;
document.addEventListener('keydown',e=>{if(e.code==='Space'&&!$('trainer').classList.contains('hidden')){e.preventDefault();compress()}});
$('trainerNext').onclick=showAed;

function beep(){
 try{
   if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
   const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.value=880;gain.gain.value=.05;osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.045);
 }catch(e){}
}
function startMetronome(){
 if(metroTimer)return;beep();metroTimer=setInterval(beep,545);$('metroBtn').classList.add('on');$('metroBtn').textContent='♪ Metrónomo: encendido';$('metroBtn').setAttribute('aria-pressed','true');
}
function stopMetronome(){
 if(metroTimer){clearInterval(metroTimer);metroTimer=null}
 if($('metroBtn')){$('metroBtn').classList.remove('on');$('metroBtn').textContent='♪ Metrónomo: apagado';$('metroBtn').setAttribute('aria-pressed','false')}
}
$('metroBtn').onclick=()=>metroTimer?stopMetronome():startMetronome();

function resetAed(){
 $('aedPower').disabled=false;$('aedShock').disabled=true;$('padsBtn').disabled=true;$('clearBtn').disabled=true;$('resumeBtn').disabled=true;
 ['padsBtn','clearBtn','resumeBtn'].forEach(id=>$(id).classList.remove('done'));
 $('aedScreen').textContent='DEA listo. Encendé el equipo.';$('aedFeedback').className='feedback';$('aedFeedback').textContent='Encendé el DEA para comenzar.';
}
function aedAward(){aedPoints+=5;points+=5;updateStats()}
function showAed(){
 stage=7;$('trainer').classList.add('hidden');$('aedPanel').classList.remove('hidden');$('sceneText').textContent='Llega un DEA. Seguí la secuencia del equipo con seguridad.';updateStats();
}
$('aedPower').onclick=()=>{
 if($('aedPower').disabled)return;$('aedPower').disabled=true;$('padsBtn').disabled=false;$('aedScreen').textContent='COLOQUE LOS PARCHES EN EL TÓRAX DESNUDO SEGÚN LOS DIBUJOS.';$('aedFeedback').className='feedback ok';$('aedFeedback').textContent=mode==='learn'?'✓ DEA encendido. Ahora colocá los parches como muestra el equipo.':'Acción registrada.';aedAward();
};
$('padsBtn').onclick=()=>{
 if($('padsBtn').disabled)return;$('padsBtn').disabled=true;$('padsBtn').classList.add('done');$('clearBtn').disabled=false;$('aedScreen').textContent='ANALIZANDO RITMO. NO TOQUE AL PACIENTE.';$('aedFeedback').textContent=mode==='learn'?'El DEA analiza. Confirmá que nadie esté tocando a la persona.':'Continuá.';aedAward();
};
$('clearBtn').onclick=()=>{
 if($('clearBtn').disabled)return;$('clearBtn').disabled=true;$('clearBtn').classList.add('done');$('aedShock').disabled=false;$('aedScreen').textContent='DESCARGA INDICADA. ASEGÚRESE DE QUE NADIE TOQUE AL PACIENTE.';$('aedFeedback').textContent=mode==='learn'?'Nadie toca. Si el DEA indica descarga, usá el botón de descarga.':'Continuá.';aedAward();
};
$('aedShock').onclick=()=>{
 if($('aedShock').disabled)return;$('aedShock').disabled=true;$('resumeBtn').disabled=false;$('aedScreen').textContent='DESCARGA REALIZADA. REANUDE RCP INMEDIATAMENTE.';$('aedFeedback').textContent=mode==='learn'?'✓ Descarga simulada. Reanudá RCP inmediatamente.':'Continuá.';aedAward();
};
$('resumeBtn').onclick=()=>{
 if($('resumeBtn').disabled)return;$('resumeBtn').disabled=true;$('resumeBtn').classList.add('done');$('aedScreen').textContent='CONTINÚE RCP Y SIGA LAS INDICACIONES DEL DEA.';$('aedFeedback').className='feedback ok';$('aedFeedback').textContent='Secuencia del DEA completada.';aedAward();$('finishBtn').hidden=false;
};
$('finishBtn').onclick=finishAdult;

function showChokingAction(){
 stage=3;$('decisionPanel').classList.add('hidden');$('chokingAction').classList.remove('hidden');$('sceneText').textContent='La persona continúa consciente y presenta una obstrucción grave.';
 $('backBtn').disabled=false;$('abBtn').disabled=mode==='learn';updateStats();
}
$('backBtn').onclick=()=>{
 if(backCount>=5)return;
 if(mode==='exam'&&abCount>0){chokingPenalty=Math.min(40,chokingPenalty+10);mistakes++}
 backCount++;$('backCount').textContent=`${backCount}/5`;
 if(backCount===5){if(mode==='learn')$('abBtn').disabled=false;$('chokingFeedback').className='feedback ok';$('chokingFeedback').textContent=mode==='learn'?'✓ Completaste 5 golpes en la espalda. Ahora realizá 5 compresiones abdominales.':'Continuá la secuencia.'}
 updateStats();
};
$('abBtn').onclick=()=>{
 if(abCount>=5)return;
 if(mode==='exam'&&backCount<5){chokingPenalty=Math.min(40,chokingPenalty+10);mistakes++}
 if(mode==='learn'&&backCount<5)return;
 abCount++;$('abCount').textContent=`${abCount}/5`;
 if(backCount>=5&&abCount>=5){
   chokingActionPoints=Math.max(0,40-chokingPenalty);points+=chokingActionPoints;$('backBtn').disabled=true;$('abBtn').disabled=true;$('chokingFeedback').className='feedback ok';$('chokingFeedback').textContent=mode==='learn'?'✓ Ciclo completo: 5 golpes en la espalda y 5 compresiones abdominales. Se repite hasta expulsar el objeto o hasta que la persona deje de responder.':'Secuencia registrada.';$('chokingNext').hidden=false;
 }
 updateStats();
};
$('chokingNext').onclick=()=>{step=2;stage=4;$('chokingAction').classList.add('hidden');renderDecision()};

function finishAdult(){
 const total=decisionPoints+handPoints+compressionPoints+aedPoints;points=total;showResult([
  ['Decisiones',decisionPoints,40],['Manos',handPoints,10],['Ritmo',compressionPoints,25],['DEA',aedPoints,25]
 ],'RCP adulto');
}
function finishChoking(){
 const total=decisionPoints+chokingActionPoints;points=total;showResult([
  ['Decisiones',decisionPoints,60],['Maniobra',chokingActionPoints,40]
 ],'Atragantamiento adulto');
}
function showResult(parts,label){
 stopMetronome();['decisionPanel','handsPanel','trainer','aedPanel','chokingAction'].forEach(id=>$(id).classList.add('hidden'));$('resultPanel').classList.remove('hidden');
 $('resultTitle').textContent=`${label} · ${mode==='learn'?'práctica':'examen'} completado`;$('finalScore').textContent=points;
 $('breakdown').innerHTML=parts.map(([name,val,max])=>`<div><b>${val}/${max}</b><span>${name}</span></div>`).join('');
 let msg=points>=90?'Muy buen desempeño. Repetí el caso en modo examen y complementá este entrenamiento con práctica presencial.':points>=70?'Buen comienzo. Revisá las etapas con menor puntaje y repetí el escenario para consolidar la secuencia.':'Conviene repetir el caso en modo aprender y prestar especial atención a las devoluciones de cada etapa.';
 if(mode==='exam')msg+=' En modo examen las correcciones se reservaron hasta esta evaluación.';
 $('resultMessage').textContent=msg;$('sceneText').textContent='Simulación terminada. Revisá tu evaluación y repetí para seguir practicando.';stage=totalStages;updateStats(true);
}

function updateStats(done=false){
 $('pointsStat').textContent=points;$('mistakeStat').textContent=mistakes;$('stepStat').textContent=`${Math.min(stage,totalStages)}/${totalStages}`;$('progressBar').style.width=(done?100:Math.max(4,((stage-1)/(Math.max(1,totalStages-1)))*100))+'%';
}

function backToSetup(){
 stopMetronome();$('simulation').classList.add('hidden');$('setupPanel').classList.remove('hidden');window.scrollTo({top:$('setupPanel').offsetTop-90,behavior:'smooth'});
}
$('exitBtn').onclick=backToSetup;
$('otherCaseBtn').onclick=backToSetup;
$('restartBtn').onclick=()=>startScenario(scenario);

setMode('learn');
