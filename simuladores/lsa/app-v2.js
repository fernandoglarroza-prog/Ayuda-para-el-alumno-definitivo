let mirrorStream=null;
let spelling={letters:[],index:0,success:0,repeat:0};
let activeMission=null,missionIndex=0,missionFluent=0,missionRepeat=0;

function updatePracticeSessions(){
 const s=loadState();
 const el=$('practiceSessions');
 if(el)el.textContent=s.practiceSessions||0;
}
function addPracticeSession(){
 const s=loadState(),next=(s.practiceSessions||0)+1;
 saveState({practiceSessions:next});
 updatePracticeSessions();
}

const normalizeName=value=>value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-ZÑ]/g,'');
function renderSpelling(){
 if(!spelling.letters.length)return;
 const done=spelling.index>=spelling.letters.length;
 $('spellTrainer').classList.remove('hidden');
 if(done){
  $('spellLetter').textContent='✓';
  $('spellPosition').textContent='Completado';
  $('spellWord').textContent=spelling.letters.join('');
  $('spellActions').classList.add('hidden');
  $('spellResult').classList.remove('hidden');
  $('spellResult').textContent=`Nombre completado: ${spelling.success} letras fluidas · ${spelling.repeat} para repetir.`;
  addPracticeSession();
  return;
 }
 $('spellActions').classList.remove('hidden');$('spellResult').classList.add('hidden');
 $('spellLetter').textContent=spelling.letters[spelling.index];
 $('spellPosition').textContent=`Letra ${spelling.index+1} de ${spelling.letters.length}`;
 $('spellWord').textContent=spelling.letters.join('');
}
$('nameForm').onsubmit=e=>{
 e.preventDefault();
 const clean=normalizeName($('nameInput').value.trim());
 if(!clean){$('nameHelp').textContent='Ingresá un nombre usando letras.';return}
 spelling={letters:[...clean],index:0,success:0,repeat:0};
 $('nameHelp').textContent='Hacé cada letra usando el alfabeto oficial como referencia cuando lo necesites.';
 renderSpelling();
};
$('spellGood').onclick=()=>{spelling.success++;spelling.index++;renderSpelling()};
$('spellAgain').onclick=()=>{spelling.repeat++;spelling.index++;renderSpelling()};
$('spellRestart').onclick=()=>{if(spelling.letters.length){spelling.index=0;spelling.success=0;spelling.repeat=0;renderSpelling()}};

async function startMirror(){
 const status=$('mirrorStatus');
 if(mirrorStream)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){status.textContent='Este navegador no ofrece acceso a cámara para esta función.';return}
 try{
  status.textContent='Solicitando permiso de cámara…';
  mirrorStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
  $('mirrorVideo').srcObject=mirrorStream;
  $('mirrorWrap').classList.add('active');
  $('mirrorStart').disabled=true;$('mirrorStop').disabled=false;
  status.textContent='Cámara activa solo en esta página. No se graba ni se envía video.';
 }catch(err){
  mirrorStream=null;
  status.textContent='No se pudo abrir la cámara. Podés continuar usando el resto del simulador sin ella.';
 }
}
function stopMirror(){
 if(mirrorStream){mirrorStream.getTracks().forEach(t=>t.stop());mirrorStream=null}
 if($('mirrorVideo'))$('mirrorVideo').srcObject=null;
 $('mirrorWrap').classList.remove('active');$('mirrorStart').disabled=false;$('mirrorStop').disabled=true;
 $('mirrorStatus').textContent='Cámara apagada.';
}
$('mirrorStart').onclick=startMirror;$('mirrorStop').onclick=stopMirror;
window.addEventListener('beforeunload',stopMirror);

const missions=[
 {id:'encuentro',icon:'👋',name:'Primer encuentro',desc:'Practicá una interacción inicial sin traducir palabra por palabra.',steps:[
  ['Inicio','Realizá un saludo usando una seña que hayas estudiado en una fuente validada.','Si necesitás confirmar la seña, abrí el Señario antes de continuar.'],
  ['Presentación','Presentate e incorporá tu nombre mediante dactilología.','Usá el entrenador de nombre si querés preparar el deletreo antes.'],
  ['Intercambio','Realizá una pregunta o expresión básica que ya hayas aprendido.','No inventes una traducción literal del castellano: usá una construcción aprendida en LSA.'],
  ['Cierre','Cerrá la interacción con una expresión que hayas estudiado.','Priorizá fluidez, mirada y claridad visual.']
 ]},
 {id:'escuela',icon:'🎒',name:'Situación en la escuela',desc:'Combiná vocabulario escolar con una intención comunicativa concreta.',steps:[
  ['Contexto','Elegí tres señas del tema “La escuela” del Señario y repasálas.','Abrí el material oficial si todavía no las tenés seguras.'],
  ['Producción','Usá esas señas dentro de una breve interacción visual.','No hace falta imitar el orden del castellano; mantené la estructura aprendida en LSA.'],
  ['Comprensión','Imaginá que otra persona responde: identificá qué información necesitarías mirar para comprenderla.','Además de las manos, prestá atención a orientación, ubicación, movimiento y componentes no manuales.']
 ]},
 {id:'clima',icon:'☀️',name:'Hablar del clima',desc:'Una misión corta para pasar de vocabulario aislado a comunicación.',steps:[
  ['Repaso','Seleccioná dos o tres entradas del tema “El clima” en el Señario.','Confirmá las formas visuales antes de practicar de memoria.'],
  ['Mensaje','Producí una idea breve sobre el clima usando solo recursos que ya hayas estudiado.','La meta es comunicar, no traducir una oración castellana palabra por palabra.'],
  ['Repetición','Repetí el mensaje mirando tu ejecución en el modo espejo.','Buscá que la segunda producción sea más clara y fluida.']
 ]}
];

function renderMissions(){
 const grid=$('conversationGrid');grid.innerHTML='';
 missions.forEach(m=>{
  const card=document.createElement('article');card.className='missionCard';
  card.innerHTML=`<span class="missionIcon">${m.icon}</span><h3>${m.name}</h3><p>${m.desc}</p><button>Iniciar misión →</button>`;
  card.querySelector('button').onclick=()=>startMission(m.id);grid.appendChild(card);
 });
}
function startMission(id){
 activeMission=missions.find(m=>m.id===id);missionIndex=0;missionFluent=0;missionRepeat=0;
 $('missionPlayer').classList.remove('hidden');$('missionDone').classList.add('hidden');$('missionPlay').classList.remove('hidden');
 renderMissionStep();$('missionPlayer').scrollIntoView({behavior:'smooth',block:'center'});
}
function renderMissionStep(){
 const step=activeMission.steps[missionIndex];
 $('missionName').textContent=activeMission.name;$('missionProgress').textContent=`Paso ${missionIndex+1}/${activeMission.steps.length}`;
 $('missionStage').textContent=step[0];$('missionPrompt').textContent=step[1];$('missionHint').textContent=step[2];
}
function rateMission(fluent){
 if(fluent)missionFluent++;else missionRepeat++;
 missionIndex++;
 if(missionIndex>=activeMission.steps.length){finishMission();return}
 renderMissionStep();
}
function finishMission(){
 $('missionPlay').classList.add('hidden');$('missionDone').classList.remove('hidden');
 $('missionDoneScore').textContent=`${missionFluent}/${activeMission.steps.length}`;
 $('missionDoneText').textContent=missionRepeat===0?'Completaste toda la misión con sensación de fluidez. Volvé a practicarla otro día para consolidarla.':`Completaste la misión. Marcaste ${missionRepeat} paso${missionRepeat===1?'':'s'} para repetir; usá las fuentes oficiales antes del próximo intento.`;
 addPracticeSession();
}
$('missionGood').onclick=()=>rateMission(true);$('missionAgain').onclick=()=>rateMission(false);$('missionClose').onclick=()=>{$('missionPlayer').classList.add('hidden')};$('missionRestart').onclick=()=>startMission(activeMission.id);

renderMissions();updatePracticeSessions();
