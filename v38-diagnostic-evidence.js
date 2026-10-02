// Nextfuture V3.8 — evidencia histórica sólo con muestra suficiente
(function(){
  'use strict';
  const URL='https://abcuvgoipnwiltlbcqxa.supabase.co/functions/v1/nextfuture-diagnostic-evidence';
  const KEY='sb_publishable_qCFyX0zIAgDPIiWQxAIb0g_cFiK21fM';
  let last='';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  async function renderEvidence(){
    const root=document.querySelector('#diagResultCard .diag-result');if(!root||typeof diagState==='undefined'||diagState.symptom==='other')return;
    const snap=window.NextfutureLearning?.snapshot?.();if(!snap)return;
    const sig=[snap.device_type,snap.primary_symptom_key,snap.family||''].join('|');if(sig===last&&document.getElementById('nf38Evidence'))return;last=sig;
    document.getElementById('nf38Evidence')?.remove();
    try{
      const r=await fetch(URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({device_type:snap.device_type,primary_symptom_key:snap.primary_symptom_key,family:snap.family||null})});
      const d=await r.json();if(!r.ok||!d.ready)return;
      const candidates=[['Familia / modelo',d.context?.family],['Síntoma',d.context?.symptom],['Tipo de equipo',d.context?.device]];const chosen=candidates.find(x=>x[1]);
      const box=document.createElement('section');box.id='nf38Evidence';box.className='nf38-evidence';
      if(chosen){const [label,x]=chosen;box.innerHTML=`<small>EVIDENCIA DE CASOS REALES · ${esc(label.toUpperCase())}</small><b>${x.n} casos comparables evaluados</b><p>En ${x.broad_match_pct}% de esos casos, la orientación previa coincidió total o parcialmente con la causa técnica confirmada.</p><span>Dato histórico descriptivo: no es una probabilidad ni garantiza la causa de este equipo.</span>`;}
      else{box.innerHTML=`<small>EVIDENCIA REAL EN CONSTRUCCIÓN</small><b>${d.evaluated_cases} casos evaluados en Nextfuture</b><p>Todavía no hay al menos 5 casos comparables para publicar una métrica específica de esta ruta.</p><span>No mostramos porcentajes de segmentos pequeños para evitar conclusiones engañosas.</span>`;}
      const anchor=root.querySelector('#diagAdaptiveResult')||root.querySelector('#diagCrossResult');if(anchor)anchor.insertAdjacentElement('afterend',box);else root.appendChild(box);
    }catch(e){console.warn('V3.8 evidence',e)}
  }
  const card=document.getElementById('diagResultCard');if(card)new MutationObserver(()=>setTimeout(renderEvidence,120)).observe(card,{childList:true,subtree:true});
})();