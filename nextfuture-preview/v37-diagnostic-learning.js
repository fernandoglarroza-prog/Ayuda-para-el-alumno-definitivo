// Nextfuture V3.9 — snapshot estructurado del diagnóstico para aprendizaje sobre reparaciones reales
(function(){
  'use strict';
  const clean=s=>String(s??'').trim();
  function snapshot(){
    try{
      if(typeof diagState==='undefined'||typeof DIAG_DATA==='undefined'||!diagState?.device||!diagState?.symptom)return null;
      const device=diagState.device;
      const symptom=DIAG_DATA?.[device]?.symptoms?.[diagState.symptom]||null;
      const ctx=window.NextfutureDiagnostic?.context?.()||{};
      const adaptive=window.NextfutureAdaptiveDiagnostic||{};
      const identity=window.NextfutureModelKnowledge?.identify?.()||{};
      const brand=clean(document.getElementById('diagBrand')?.value||document.getElementById('rqBrand')?.value||'');
      const model=clean(document.getElementById('diagModel')?.value||document.getElementById('rqModel')?.value||'');
      const secondary=(ctx.secondaries||[]).slice(0,3).map(key=>({key:clean(key),label:clean(DIAG_DATA?.[device]?.symptoms?.[key]?.label||key)}));
      const rule=identity?.rule||null;
      const brandLabel=clean(identity?.brandLabel||'');
      const level=rule?'family':brandLabel?'brand':(brand||model)?'partial':'generic';
      const hypotheses=(adaptive.hypotheses?.()||[]).slice(0,3).map(h=>({title:clean(h?.title),reason:clean(h?.reason),priority:Number(h?.priority)||0}));
      const questionLabels={};
      (symptom?.questions||[]).slice(0,50).forEach(q=>{if(q?.id&&q?.text)questionLabels[clean(q.id)]=clean(q.text)});
      const adaptiveQuestionLabels={};
      document.querySelectorAll('#diagAdaptivePanel [data-aqid]').forEach(el=>{
        const id=clean(el.getAttribute('data-aqid'));const text=clean(el.querySelector('b')?.textContent||'');
        if(id&&text)adaptiveQuestionLabels[id]=text;
      });
      return {
        engine_version:'3.9',
        device_type:device,
        brand:brand||null,
        model:model||null,
        family:clean(rule?.family||brandLabel)||null,
        identification_level:level,
        primary_symptom_key:clean(diagState.symptom),
        primary_symptom_label:clean(symptom?.label||diagState.symptom),
        secondary_symptoms:secondary,
        onset:clean(ctx.onset||''),
        antecedent:clean(ctx.antecedent||''),
        data_important:!!ctx.dataImportant,
        answers:{...(diagState.answers||{})},
        adaptive_answers:{...(adaptive.answers?.()||{})},
        question_labels:questionLabels,
        adaptive_question_labels:adaptiveQuestionLabels,
        hypotheses
      };
    }catch(e){console.warn('Nextfuture V3.9 snapshot',e);return null}
  }
  window.NextfutureLearning={snapshot};
})();