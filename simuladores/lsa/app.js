const $=id=>document.getElementById(id);

const topics=[
 {id:'saludos',icon:'👋',name:'Saludos y comunicación básica',desc:'Primer contacto y expresiones básicas de comunicación.'},
 {id:'alfabeto',icon:'🔤',name:'Alfabeto manual argentino',desc:'Dactilología y deletreo de nombres y palabras.'},
 {id:'escuela',icon:'🎒',name:'La escuela',desc:'Vocabulario del entorno educativo.'},
 {id:'numeros',icon:'🔢',name:'Los números',desc:'Números y práctica de reconocimiento.'},
 {id:'provincias',icon:'🗺️',name:'Las provincias',desc:'Topónimos y referencias del territorio argentino.'},
 {id:'familia',icon:'🏠',name:'La familia',desc:'Vínculos y vocabulario familiar.'},
 {id:'deportes',icon:'⚽',name:'Deportes',desc:'Actividades deportivas y recreativas.'},
 {id:'juegos',icon:'🎲',name:'Juegos',desc:'Vocabulario vinculado con juegos.'},
 {id:'colores',icon:'🎨',name:'Los colores',desc:'Reconocimiento y producción de colores.'},
 {id:'clima',icon:'☀️',name:'El clima',desc:'Tiempo y expresiones meteorológicas.'}
];

const quiz=[
 {q:'¿La LSA es una versión gestual palabra por palabra del castellano?',a:1,o:['Sí, conserva exactamente la gramática del castellano.','No. Es una lengua con estructura gramatical propia, completa y distinta del castellano.','Solo cambia el alfabeto.'],why:'La Ley 27.710 reconoce que la LSA tiene una estructura gramatical propia y distinta del castellano.'},
 {q:'¿La lengua de señas es universal?',a:1,o:['Sí, todas las personas sordas del mundo usan la misma.','No. Existen distintas lenguas de señas según comunidades y países.','Solo cambia en el alfabeto.'],why:'Las lenguas de señas no son universales; la LSA es la lengua de la comunidad sorda argentina.'},
 {q:'¿Cuál es la modalidad principal de la LSA?',a:2,o:['Exclusivamente auditiva.','Escrita y alfabética.','Visoespacial.'],why:'La LSA se transmite en modalidad visoespacial.'},
 {q:'¿Quiénes son organismos legítimos de consulta sobre la LSA según la Ley 27.710?',a:0,o:['Organizaciones constituidas íntegramente por personas sordas que las representen y estén oficialmente reconocidas.','Cualquier academia privada de idiomas.','Solo universidades extranjeras.'],why:'La ley coloca a las organizaciones representativas de personas sordas como organismos legítimos de consulta.'},
 {q:'¿Para aprender una seña nueva conviene confiar en cualquier imagen encontrada en internet?',a:2,o:['Sí, todas las imágenes representan la misma seña.','Sí, si aparece primero en el buscador.','No. Conviene usar recursos validados por organizaciones y referentes de la comunidad sorda.'],why:'Por eso este simulador enlaza recursos de la CAS en lugar de inventar o aproximar señas.'}
];

let quizIndex=0,quizScore=0,quizAnswered=false;
let currentLetter='A';
let practiceWords=[];

function loadState(){
 try{return JSON.parse(localStorage.getItem('ayuda_lsa_v1')||'{}')}catch(e){return {}}
}
function saveState(partial={}){
 const state={...loadState(),...partial};
 localStorage.setItem('ayuda_lsa_v1',JSON.stringify(state));
 return state;
}
function progressState(){const s=loadState();return s.topics||{}}
function renderTopics(){
 const progress=progressState();
 $('topicGrid').innerHTML='';
 topics.forEach((t,i)=>{
  const status=progress[t.id]||0;
  const card=document.createElement('article');card.className='topicCard'+(status===2?' done':'');
  card.innerHTML=`<div class="topicTop"><span class="topicIcon">${t.icon}</span><span class="topicNum">${i+1}/10</span></div><h3>${t.name}</h3><p>${t.desc}</p><div class="topicProgress"><i style="width:${status*50}%"></i></div><div class="topicActions"><button data-action="study">${status>=1?'✓ Estudiado':'Marcar estudiado'}</button><button data-action="practice" ${status<1?'disabled':''}>${status===2?'✓ Practicado':'Marcar practicado'}</button></div>`;
  card.querySelector('[data-action="study"]').onclick=()=>setTopic(t.id,Math.max(1,status));
  card.querySelector('[data-action="practice"]').onclick=()=>setTopic(t.id,2);
  $('topicGrid').appendChild(card);
 });
 updateOverview();
}
function setTopic(id,value){const state=loadState(),p={...(state.topics||{}),[id]:value};saveState({topics:p});renderTopics()}
function updateOverview(){
 const p=progressState(),studied=topics.filter(t=>(p[t.id]||0)>=1).length,practiced=topics.filter(t=>(p[t.id]||0)===2).length;
 $('studiedCount').textContent=studied;$('practicedCount').textContent=practiced;$('routeBar').style.width=`${practiced/10*100}%`;
}

function renderQuiz(){
 const q=quiz[quizIndex];quizAnswered=false;$('quizNumber').textContent=`Pregunta ${quizIndex+1} de ${quiz.length}`;$('quizQuestion').textContent=q.q;$('quizOptions').innerHTML='';$('quizFeedback').className='quizFeedback';$('quizFeedback').textContent='Elegí una respuesta.';$('quizNext').hidden=true;
 q.o.forEach((label,i)=>{const b=document.createElement('button');b.className='quizOption';b.textContent=label;b.onclick=()=>answerQuiz(b,i);$('quizOptions').appendChild(b)});
 $('quizBar').style.width=`${quizIndex/quiz.length*100}%`;
}
function answerQuiz(btn,index){
 if(quizAnswered)return;quizAnswered=true;const q=quiz[quizIndex];[...$('quizOptions').children].forEach(x=>x.disabled=true);
 if(index===q.a){btn.classList.add('correct');quizScore++;$('quizFeedback').className='quizFeedback ok';$('quizFeedback').textContent='✓ '+q.why}else{btn.classList.add('wrong');$('quizOptions').children[q.a].classList.add('correct');$('quizFeedback').className='quizFeedback bad';$('quizFeedback').textContent=q.why}
 $('quizNext').hidden=false;
}
$('quizNext').onclick=()=>{if(quizIndex<quiz.length-1){quizIndex++;renderQuiz()}else finishQuiz()};
function finishQuiz(){
 $('quizBody').classList.add('hidden');$('quizResult').classList.remove('hidden');$('quizBar').style.width='100%';$('quizScore').textContent=`${quizScore}/${quiz.length}`;$('quizResultText').textContent=quizScore===quiz.length?'Excelente base para empezar la ruta visual.':quizScore>=3?'Buen comienzo. Podés revisar las respuestas y seguir practicando.':'Conviene repasar los fundamentos antes de avanzar.';saveState({foundationQuiz:quizScore});
}
$('quizRestart').onclick=()=>{quizIndex=0;quizScore=0;$('quizBody').classList.remove('hidden');$('quizResult').classList.add('hidden');renderQuiz()};

const letters='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
function pickLetter(){let next=currentLetter;while(next===currentLetter&&letters.length>1)next=letters[Math.floor(Math.random()*letters.length)];currentLetter=next;$('letterPrompt').textContent=currentLetter;$('letterStatus').textContent='Hacé la seña de esta letra y autoevaluá tu intento.';$('letterGood').disabled=false;$('letterRepeat').disabled=false}
$('newLetter').onclick=pickLetter;
$('letterGood').onclick=()=>{const s=loadState(),count=(s.letterSuccess||0)+1;saveState({letterSuccess:count});$('letterSuccess').textContent=count;$('letterStatus').textContent='✓ Registrado. Generá otra letra cuando quieras.';$('letterGood').disabled=true;$('letterRepeat').disabled=true};
$('letterRepeat').onclick=()=>{const s=loadState(),count=(s.letterRepeat||0)+1;saveState({letterRepeat:count});$('letterRepeats').textContent=count;$('letterStatus').textContent='Marcado para repetir. Volvé a mirar el recurso oficial si necesitás confirmar la configuración de la mano.';$('letterGood').disabled=true;$('letterRepeat').disabled=true};

function loadWords(){const s=loadState();practiceWords=Array.isArray(s.words)?s.words:[];renderWords()}
function renderWords(){
 $('wordList').innerHTML='';
 if(!practiceWords.length){$('emptyWords').classList.remove('hidden');$('wordPractice').classList.add('hidden');return}
 $('emptyWords').classList.add('hidden');practiceWords.forEach((w,i)=>{const li=document.createElement('li');li.innerHTML=`<span>${w}</span><button aria-label="Eliminar ${w}">×</button>`;li.querySelector('button').onclick=()=>{practiceWords.splice(i,1);saveState({words:practiceWords});renderWords()};$('wordList').appendChild(li)});$('wordPractice').classList.remove('hidden');
}
$('wordForm').onsubmit=e=>{e.preventDefault();const value=$('wordInput').value.trim();if(!value)return;if(!practiceWords.some(w=>w.toLowerCase()===value.toLowerCase()))practiceWords.push(value);$('wordInput').value='';saveState({words:practiceWords});renderWords()};
$('practiceRandom').onclick=()=>{if(!practiceWords.length)return;const w=practiceWords[Math.floor(Math.random()*practiceWords.length)];$('practicePrompt').textContent=w;$('practiceHint').textContent='Intentá producir la seña sin mirar el material. Después verificá en tu fuente validada.'};

function restoreStats(){const s=loadState();$('letterSuccess').textContent=s.letterSuccess||0;$('letterRepeats').textContent=s.letterRepeat||0;if(typeof s.foundationQuiz==='number')$('savedQuiz').textContent=`Mejor intento guardado: ${s.foundationQuiz}/${quiz.length}`}
$('resetProgress').onclick=()=>{if(confirm('¿Querés borrar el progreso local de LSA guardado en este dispositivo?')){localStorage.removeItem('ayuda_lsa_v1');location.reload()}};

renderTopics();renderQuiz();loadWords();restoreStats();pickLetter();