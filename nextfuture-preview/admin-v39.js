/* Nextfuture V3.9 — fichas por modelo/familia y señal de preguntas */
(function(){
 'use strict';
 const esc39=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
 function causeList(items){return (items||[]).length?(items||[]).map(x=>`<span>${esc39(x.label)} <b>${Number(x.count||0)}</b></span>`).join(''):'<span>Sin causas confirmadas todavía</span>'}
 function symptomList(items){return (items||[]).length?(items||[]).map(x=>`<span>${esc39(x.label)} <b>${Number(x.count||0)}</b></span>`).join(''):'<span>Sin síntomas acumulados</span>'}
 function modelCards(rows){
   if(!(rows||[]).length)return '<div class="empty">Todavía no hay diagnósticos reales suficientes para construir fichas de modelos.</div>';
   return rows.map(r=>`<article class="nf39-model-card" data-nf39-model="${esc39((r.label||'').toLowerCase())}"><div class="nf39-model-head"><div><small>${r.model?'MODELO / EQUIPO':'FAMILIA / MARCA'}</small><h4>${esc39(r.label)}</h4>${r.family&&r.family!==r.label?`<p>${esc39(r.family)}</p>`:''}</div><div class="nf39-count"><b>${Number(r.linked||0)}</b><small>diagnóstico${Number(r.linked||0)===1?'':'s'}</small></div></div><div class="nf39-model-kpis"><span>Evaluados <b>${Number(r.evaluated||0)}</b></span><span>✓ ${Number(r.matched||0)}</span><span>≈ ${Number(r.partial||0)}</span><span>≠ ${Number(r.different||0)}</span></div><div class="nf39-tags"><small>Síntomas recibidos</small>${symptomList(r.top_symptoms)}</div><div class="nf39-tags"><small>Causas confirmadas</small>${causeList(r.top_causes)}</div>${r.sample_ready?'<p class="nf39-ready">Muestra interna inicial: ya hay al menos 3 casos evaluados.</p>':'<p class="nf39-wait">Todavía no alcanza para extraer patrones del modelo.</p>'}</article>`).join('');
 }
 function questionRows(rows){
   if(!(rows||[]).length)return '<div class="empty">Las preguntas empezarán a evaluarse cuando existan reparaciones cerradas con diagnóstico previo.</div>';
   return rows.map(q=>`<article class="nf39-question"><div><small>${q.adaptive?'PREGUNTA ADAPTATIVA':'PREGUNTA BASE'}</small><b>${esc39(q.label)}</b><p>${Number(q.total||0)} respuestas evaluadas · Sí ${Number(q.yes||0)} · No ${Number(q.no||0)} · No sé ${Number(q.unknown||0)}</p></div><div class="nf39-signal ${q.separation_ready?'ready':'waiting'}"><small>Separación de causas</small><b>${q.separation_ready?Number(q.separation_score||0)+'%':'—'}</b></div>${q.separation_ready?`<div class="nf39-qdetail"><span><small>Cuando respondieron Sí</small>${causeList(q.yes_top_causes)}</span><span><small>Cuando respondieron No</small>${causeList(q.no_top_causes)}</span></div>`:'<div class="nf39-qnote">Se muestra una señal recién con 8 casos evaluados y al menos 2 respuestas Sí y 2 No. No representa exactitud diagnóstica.</div>'}</article>`).join('');
 }
 function enhanceLearning(){
   const body=document.querySelector('#drawerBody');if(!body||body.querySelector('#nf39Learning'))return;
   const models=NF_DIAG_DATA?.model_profiles||[],qs=NF_DIAG_DATA?.question_stats||[];
   body.insertAdjacentHTML('beforeend',`<section id="nf39Learning" class="nf39-wrap"><div class="box"><span class="kicker">NEXTFUTURE V3.9</span><h3>Fichas técnicas aprendidas de trabajos reales</h3><p class="mgmt-note">No son una lista de “fallas típicas” inventada. Se construyen únicamente con diagnósticos vinculados a reparaciones reales y causas que después confirmaste en el cierre técnico.</p><input id="nf39ModelSearch" class="nf39-search" type="search" placeholder="Buscar modelo, marca o familia"><div id="nf39Models" class="nf39-models">${modelCards(models)}</div></div><div class="box"><h3>Qué preguntas realmente separan causas</h3><p class="mgmt-note">La señal compara cómo se distribuyen las causas finales entre respuestas Sí y No. Sirve para detectar preguntas prometedoras; no es un porcentaje de acierto.</p><div class="nf39-questions">${questionRows(qs)}</div></div></section>`);
   document.getElementById('nf39ModelSearch')?.addEventListener('input',e=>{const q=String(e.target.value||'').toLowerCase().trim();document.querySelectorAll('[data-nf39-model]').forEach(el=>el.classList.toggle('hidden',!!q&&!String(el.getAttribute('data-nf39-model')||'').includes(q)));});
 }
 function addReadableAnswers(code){
   const rec=typeof nfV37RecordFor==='function'?nfV37RecordFor(code):null,box=document.getElementById('nfV37Evidence');if(!rec||!box||box.querySelector('#nf39AnswerDetail'))return;
   const rows=[];
   for(const [id,v] of Object.entries(rec.answers||{})){rows.push({label:(rec.question_labels||{})[id]||id,value:v,adaptive:false});}
   for(const [id,v] of Object.entries(rec.adaptive_answers||{})){rows.push({label:(rec.adaptive_question_labels||{})[id]||id,value:v,adaptive:true});}
   if(!rows.length)return;
   const val={yes:'Sí',no:'No',unknown:'No sé'};
   box.insertAdjacentHTML('beforeend',`<details id="nf39AnswerDetail" class="nf39-answer-detail"><summary>Ver respuestas del diagnóstico (${rows.length})</summary><div>${rows.map(x=>`<p><span>${x.adaptive?'Adaptativa · ':''}${esc39(x.label)}</span><b>${esc39(val[x.value]||x.value)}</b></p>`).join('')}</div></details>`);
 }
 document.getElementById('learningBtn')?.addEventListener('click',()=>setTimeout(enhanceLearning,120));
 const prevOpen=window.openOrder;
 if(typeof prevOpen==='function')window.openOrder=function(code){prevOpen(code);setTimeout(()=>addReadableAnswers(code),180)};
})();