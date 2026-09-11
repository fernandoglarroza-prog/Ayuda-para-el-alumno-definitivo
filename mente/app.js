const menuBtn=document.querySelector('.menuBtn');const nav=document.querySelector('#mainNav');menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));const topics={ansiedad:{title:'Ansiedad',intro:'La ansiedad es una respuesta humana frente a situaciones que percibimos como inciertas, exigentes o amenazantes. Puede ser útil, pero merece atención cuando se vuelve intensa, frecuente o empieza a limitar la vida cotidiana.',signs:'Preocupación difícil de frenar, tensión, palpitaciones, sensación de alerta, molestias digestivas, dificultad para dormir o concentrarse.',help:'Respirar más lento, reducir estímulos, ordenar una tarea por vez, hablar con alguien y consultar si persiste o interfiere con el estudio, el trabajo o los vínculos.'},estres:{title:'Estrés',intro:'El estrés aparece cuando sentimos que las demandas superan los recursos disponibles. No siempre es malo, pero la sobrecarga sostenida puede afectar el cuerpo, el ánimo y la concentración.',signs:'Cansancio, irritabilidad, dolores de cabeza o tensión, alteraciones del sueño, olvidos, sensación de estar siempre apurado o de no llegar.',help:'Priorizar, recortar tareas cuando sea posible, hacer pausas reales, dormir, comer con regularidad y pedir ayuda antes de llegar al agotamiento.'},panico:{title:'Ataques de pánico',intro:'Un ataque de pánico puede aparecer de manera súbita con miedo intenso y síntomas físicos fuertes. Aunque la sensación puede ser aterradora, suele alcanzar un pico y luego disminuir.',signs:'Palpitaciones, falta de aire, mareo, temblor, opresión, hormigueo o miedo a perder el control.',help:'Buscar un lugar seguro, respirar sin forzar, recordar que el episodio va a pasar y consultar para evaluar lo ocurrido, especialmente si se repite.'},depresion:{title:'Depresión',intro:'La depresión no es simplemente estar triste. Puede afectar el interés, la energía, el sueño, la concentración, la esperanza y la forma de vincularse durante un período sostenido.',signs:'Pérdida de interés, aislamiento, cansancio persistente, cambios en sueño o apetito, dificultad para funcionar o sentimientos intensos de desesperanza.',help:'No minimizarlo. Hablar con alguien de confianza y buscar evaluación profesional. Si aparecen ideas de muerte o riesgo, usar los recursos de ayuda urgente del sitio.'},sueno:{title:'Sueño y descanso',intro:'Dormir influye en la memoria, el ánimo, la atención y la regulación emocional. En períodos académicos exigentes suele ser de lo primero que se sacrifica.',signs:'Dificultad para dormir o sostener el sueño, horarios muy irregulares, somnolencia durante el día, irritabilidad o dependencia de estimulantes para funcionar.',help:'Intentar sostener horarios, bajar estímulos antes de dormir y evitar convertir la falta de sueño en una rutina. Consultar si el problema persiste.'},duelo:{title:'Duelo y pérdidas',intro:'El duelo es una respuesta a una pérdida significativa y no sigue un calendario fijo. Puede incluir tristeza, enojo, alivio, confusión, culpa o momentos de aparente normalidad.',signs:'Cambios emocionales, dificultad para concentrarse, cansancio, recuerdos intensos o necesidad de aislamiento temporal.',help:'Dar lugar al proceso, mantener vínculos de apoyo y pedir acompañamiento profesional si el sufrimiento resulta inmanejable o se prolonga con gran deterioro.'}};const detail=document.querySelector('#topicDetail');document.querySelectorAll('[data-topic]').forEach(btn=>btn.addEventListener('click',()=>{const x=topics[btn.dataset.topic];if(!x||!detail)return;document.querySelectorAll('[data-topic]').forEach(b=>b.classList.toggle('active',b===btn));detail.hidden=false;detail.innerHTML='<h3>'+x.title+'</h3><p>'+x.intro+'</p><div class="detailGrid"><div class="detailBox"><b>Puede aparecer como</b><span>'+x.signs+'</span></div><div class="detailBox"><b>Qué puede ayudar</b><span>'+x.help+'</span></div></div>';detail.scrollIntoView({behavior:'smooth',block:'nearest'})}));
const MENTAL_SUPA='https://abcuvgoipnwiltlbcqxa.supabase.co';
const MENTAL_KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
const MENTAL_HEADERS={apikey:MENTAL_KEY,Authorization:'Bearer '+MENTAL_KEY,'Content-Type':'application/json'};

async function mentalRpc(name,body){
  const r=await fetch(MENTAL_SUPA+'/rest/v1/rpc/'+name,{method:'POST',headers:MENTAL_HEADERS,body:JSON.stringify(body||{})});
  if(!r.ok)throw new Error(await r.text());
  return r.json();
}
async function submitMentalStory(body){
  const r=await fetch(MENTAL_SUPA+'/functions/v1/mental-story-submit',{method:'POST',headers:MENTAL_HEADERS,body:JSON.stringify(body||{})});
  const data=await r.json().catch(()=>null);
  if(!r.ok)throw new Error(data?.error||'No pudimos enviar el mensaje.');
  return data;
}
function wallEscape(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
async function loadMentalWall(){
  const box=document.querySelector('#wallStories');if(!box)return;
  try{
    const rows=await mentalRpc('get_mental_health_wall',{result_limit:40});
    if(!Array.isArray(rows)||!rows.length){
      box.innerHTML='<div class="wallEmpty"><b>El nuevo muro todavía está empezando.</b><br>Los relatos del espacio anterior se van a migrar después de revisarlos uno por uno.</div>';
      return;
    }
    box.innerHTML=rows.map(x=>'<article class="wallStory"><blockquote>“'+wallEscape(x.story)+'”</blockquote><footer>Relato anónimo · revisado antes de publicarse</footer></article>').join('');
  }catch(e){
    box.innerHTML='<div class="wallEmpty">No pudimos cargar el muro en este momento. Podés volver a intentarlo más tarde.</div>';
  }
}
const storyForm=document.querySelector('#storyForm');
const storyText=document.querySelector('#storyText');
const storyChars=document.querySelector('#storyChars');
const storyStatus=document.querySelector('#storyStatus');
const storySubmit=document.querySelector('#storySubmit');
storyText?.addEventListener('input',()=>{if(storyChars)storyChars.textContent=String(storyText.value.length)});
storyForm?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!storyForm.reportValidity())return;
  const text=storyText.value.trim();
  if(text.length<10){storyStatus.className='formStatus err';storyStatus.textContent='Escribí al menos unas palabras más para poder enviar el mensaje.';return}
  storySubmit.disabled=true;storyStatus.className='formStatus';storyStatus.textContent='Enviando de forma anónima…';
  try{
    await submitMentalStory({story_text:text,publish_consent:document.querySelector('#publishConsent')?.checked===true,website:document.querySelector('#storyWebsite')?.value||''});
    storyForm.reset();if(storyChars)storyChars.textContent='0';
    storyStatus.className='formStatus ok';
    storyStatus.textContent='Gracias por animarte a ponerlo en palabras. Tu mensaje fue recibido y quedó pendiente de revisión. Si autorizaste su publicación, solo podrá aparecer en el muro después de ser moderado.';
  }catch(err){
    storyStatus.className='formStatus err';
    storyStatus.textContent='No pudimos enviar el mensaje en este momento. No se publicó nada; probá nuevamente más tarde.';
  }finally{storySubmit.disabled=false}
});
loadMentalWall();

/* voces-deploy-sync */
import('./uno-protocolo.js').catch(()=>{});
import('./social-fix.js').catch(()=>{});
