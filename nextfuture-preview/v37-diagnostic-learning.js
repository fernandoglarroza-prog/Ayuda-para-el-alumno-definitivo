// Nextfuture V3.7 — snapshot estructurado del diagnóstico para aprendizaje sobre reparaciones reales
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
      return {
        engine_version:'3.7',
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
        hypotheses
      };
    }catch(e){console.warn('Nextfuture V3.7 snapshot',e);return null}
  }
  window.NextfutureLearning={snapshot};
})();