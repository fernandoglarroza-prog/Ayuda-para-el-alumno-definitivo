/* Nextfuture V3.7 — aprendizaje diagnóstico sobre reparaciones reales */
const NF_DIAG_ANALYTICS=`${SB}/functions/v1/nextfuture-diagnostic-analytics`;
let NF_DIAG_DATA={metrics:{},records:[],by_symptom:[],by_family:[],by_device:[]};
const nfV37PrevLoad=load;
load=async function(){
  await nfV37PrevLoad();
  if(!tok())return;
  try{NF_DIAG_DATA=await call(NF_DIAG_ANALYTICS);nfV37RenderTopStats()}catch(e){console.warn('V3.7 analytics',e)}
};
function nfV37RenderTopStats(){
  document.getElementById('nfV37DiagLinked')?.remove();document.getElementById('nfV37DiagEvaluated')?.remove();
  const s=$('#stats'),m=NF_DIAG_DATA.metrics||{};if(!s)return;
  s.insertAdjacentHTML('beforeend',`<div class="stat" id="nfV37DiagLinked"><small>Diagnósticos reales</small><b>${Number(m.diagnostics_linked||0)}</b></div><div class="stat" id="nfV37DiagEvaluated"><small>Evaluados</small><b>${Number(m.evaluated||0)}</b></div>`);
}
function nfV37RecordFor(code){return (NF_DIAG_DATA.records||[]).find(r=>r.order?.order_code===code)||null}
function nfV37StarsPct(v){return v==null?'—':`${Number(v).toFixed(0)}%`}
function nfV37GroupRows(rows){return (rows||[]).length?(rows||[]).map(r=>`<div class="nf37-row"><div><b>${esc(r.label)}</b><small>${r.total} caso${r.total===1?'':'s'}</small></div><div class="nf37-mini"><span title="Coincidió">✓ ${r.matched}</span><span title="Parcial">≈ ${r.partial}</span><span title="Distinto">≠ ${r.different}</span></div></div>`).join(''):'<div class="empty">Todavía no hay casos evaluados.</div>'}
function nfOpenDiagnosticLearning(){
  const m=NF_DIAG_DATA.metrics||{},valid=Number(m.evaluated||0),ready=!!m.learning_ready;
  drawer('Aprendizaje diagnóstico',`
    <div class="box nf37-learning"><span class="kicker">NEXTFUTURE V3.7</span><h3>Diagnóstico previo vs. reparación real</h3><p class="mgmt-note">Sólo se cuentan diagnósticos que terminaron vinculados a una solicitud real y luego fueron evaluados al cerrar el trabajo.</p>
      <div class="nf37-kpis"><div><small>Diagnósticos vinculados</small><b>${Number(m.diagnostics_linked||0)}</b></div><div><small>Casos evaluados</small><b>${valid}</b></div><div><small>Coincidieron</small><b>${Number(m.matched||0)}</b></div><div><small>Parciales</small><b>${Number(m.partial||0)}</b></div><div><small>Causa distinta</small><b>${Number(m.different||0)}</b></div><div><small>Coincidencia amplia</small><b>${ready?nfV37StarsPct(m.broad_match_pct):'—'}</b></div></div>
      ${ready?`<div class="nf37-note"><b>Ya hay una primera muestra interna.</b><span>“Coincidencia amplia” suma coincidencias completas y parciales. No es una probabilidad de diagnóstico ni garantiza futuros resultados.</span></div>`:`<div class="nf37-note waiting"><b>Todavía estamos acumulando evidencia.</b><span>Los porcentajes se ocultan hasta tener al menos 5 casos evaluados. Para siquiera considerar una métrica pública, Nextfuture exige 20.</span></div>`}
    </div>
    <div class="mgmt-grid"><div class="box"><h3>Por síntoma principal</h3><div class="nf37-list">${nfV37GroupRows(NF_DIAG_DATA.by_symptom)}</div></div><div class="box"><h3>Por familia / marca</h3><div class="nf37-list">${nfV37GroupRows(NF_DIAG_DATA.by_family)}</div></div></div>
    <div class="box"><h3>Por tipo de equipo</h3><div class="nf37-list">${nfV37GroupRows(NF_DIAG_DATA.by_device)}</div></div>
  `);
}
const nfV37PrevOpen=openOrder;
openOrder=function(code){nfV37PrevOpen(code);setTimeout(()=>nfV37OrderEvidence(code),110)};
function nfV37OrderEvidence(code){
  const rec=nfV37RecordFor(code),body=$('#drawerBody');if(!rec||!body||$('#nfV37Evidence'))return;
  const sec=(rec.secondary_symptoms||[]).map(x=>x.label||x.key).filter(Boolean);
  const hs=(rec.hypotheses||[]).map(h=>`<li><b>${esc(h.title)}</b>${h.reason?`<span>${esc(h.reason)}</span>`:''}</li>`).join('');
  const known=Object.values(rec.answers||{}).filter(v=>v==='yes'||v==='no').length,unknown=Object.values(rec.answers||{}).filter(v=>v==='unknown').length,adaptive=Object.keys(rec.adaptive_answers||{}).length;
  body.insertAdjacentHTML('beforeend',`<div class="box nf37-evidence" id="nfV37Evidence"><span class="kicker">DIAGNÓSTICO PREVIO REGISTRADO</span><h3>${esc(rec.primary_symptom_label||rec.primary_symptom_key||'Sin síntoma principal')}</h3><div class="nf37-evidence-grid"><div><small>Equipo reconocido</small><b>${esc(rec.family||[rec.brand,rec.model].filter(Boolean).join(' ')||'Sin identificar')}</b></div><div><small>Síntomas secundarios</small><b>${esc(sec.join(' · ')||'Ninguno')}</b></div><div><small>Antecedente</small><b>${esc(rec.antecedent||'No indicado')}</b></div><div><small>Datos del cuestionario</small><b>${known} confirmados · ${unknown} sin saber · ${adaptive} adaptativos</b></div></div>${hs?`<div class="nf37-hyp"><small>HIPÓTESIS QUE MOSTRÓ NEXTFUTURE</small><ol>${hs}</ol></div>`:''}<p class="mgmt-note">Usá esta evidencia al marcar “Coincidió / Parcial / Causa diferente” en el cierre del caso. La clasificación final sigue siendo técnica y manual.</p></div>`);
}
document.getElementById('learningBtn')?.addEventListener('click',nfOpenDiagnosticLearning);
document.getElementById('refreshBtn').onclick=load;
load();
