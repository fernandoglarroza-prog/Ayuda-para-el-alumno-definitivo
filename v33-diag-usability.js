// Nextfuture V3.3 — accesibilidad diagnóstica: "No sé", resumen humano y datos aportados
(function(){
  'use strict';
  const esc=s=>typeof diagEsc==='function'?diagEsc(s):String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));

  function addUnknownAnswers(){
    if(!diagState.device||!diagState.symptom||diagState.symptom==='other') return;
    const symptom=DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom];
    if(!symptom) return;
    symptom.questions.forEach(q=>{
      const existing=document.querySelector(`input[name="diag_${CSS.escape(q.id)}"][value="unknown"]`);
      if(existing) return;
      const group=document.querySelector(`input[name="diag_${CSS.escape(q.id)}"]`)?.closest('.question-options');
      if(!group) return;
      const label=document.createElement('label');
      label.className='diag-unknown-option';
      label.innerHTML=`<input type="radio" name="diag_${esc(q.id)}" value="unknown"> No sé`;
      group.appendChild(label);
    });
    const list=document.getElementById('diagQuestions');
    if(list&&!document.getElementById('diagDontGuess')){
      list.insertAdjacentHTML('afterbegin','<div id="diagDontGuess" class="diag-dont-guess"><b>No hace falta saber de tecnología.</b> Si no conocés una respuesta, elegí <b>No sé</b>. Es mejor dejar un dato sin confirmar que adivinar.</div>');
    }
  }

  // El motor original interpreta cualquier valor distinto de "yes" como "no" al armar observaciones.
  // Mantenemos su validación y urgencias, pero corregimos el texto cuando el usuario eligió "No sé".
  if(typeof renderDiagnosis==='function'){
    const previousRender=renderDiagnosis;
    renderDiagnosis=function(symptom,observations,urgent){
      const fixed=(symptom.questions||[]).map(q=>{
        const value=diagState.answers?.[q.id];
        if(value==='unknown') return `Sin confirmar: ${q.text}`;
        return value==='yes'?q.yes:q.no;
      });
      previousRender(symptom,fixed,urgent);
      setTimeout(addInformationSummary,0);
    };
  }

  if(typeof chooseSymptom==='function'){
    const previousChoose=chooseSymptom;
    chooseSymptom=function(key){
      previousChoose(key);
      setTimeout(addUnknownAnswers,0);
    };
  }

  function answerStats(){
    const symptom=DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom];
    const qs=symptom?.questions||[];
    let known=0,unknown=0;
    qs.forEach(q=>{
      const v=diagState.answers?.[q.id];
      if(v==='unknown')unknown++; else if(v==='yes'||v==='no')known++;
    });
    const ctx=window.NextfutureDiagnostic?.context?.()||{};
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const extras=(ctx.secondaries||[]).length;
    return {total:qs.length,known,unknown,extras,brand:!!brand,model:!!model};
  }

  function addInformationSummary(){
    const root=document.querySelector('#diagResultCard .diag-result');
    if(!root||root.querySelector('#diagInfoQuality')||diagState.symptom==='other')return;
    const s=answerStats();
    const pieces=[];
    if(s.total)pieces.push(`${s.known}/${s.total} respuestas confirmadas`);
    if(s.unknown)pieces.push(`${s.unknown} sin confirmar`);
    if(s.extras)pieces.push(`${s.extras} síntoma${s.extras>1?'s':''} secundario${s.extras>1?'s':''}`);
    if(s.brand&&s.model)pieces.push('marca y modelo informados');
    else if(s.brand||s.model)pieces.push('identificación parcial del equipo');
    const box=document.createElement('div');
    box.id='diagInfoQuality';
    box.className='diag-info-quality';
    box.innerHTML=`<small>DATOS USADOS PARA ORIENTAR</small><b>${esc(pieces.join(' · ')||'Información básica')}</b><p>Las respuestas “No sé” no se toman como negativas. Quedan expresamente sin confirmar para la revisión técnica.</p>`;
    const cross=root.querySelector('#diagCrossResult');
    if(cross)cross.insertAdjacentElement('beforebegin',box);else root.appendChild(box);
  }

  function humanSummary(){
    const ctx=window.NextfutureDiagnostic?.context?.()||{};
    const device=DIAG_DATA[diagState.device]?.label||'Equipo';
    const symptom=DIAG_DATA[diagState.device]?.symptoms?.[diagState.symptom];
    const brand=document.getElementById('diagBrand')?.value.trim()||'';
    const model=document.getElementById('diagModel')?.value.trim()||'';
    const secondary=(ctx.secondaries||[]).map(k=>DIAG_DATA[diagState.device]?.symptoms?.[k]?.label).filter(Boolean);
    const onsetMap={sudden:'de golpe',progressive:'fue empeorando',intermittent:'va y viene',event:'empezó justo después de un evento',unknown:'no sabe precisar cómo empezó'};
    const antMap={none:'sin un evento previo identificado',drop:'después de un golpe o caída',liquid:'con antecedente de líquido o humedad',update:'después de una actualización o instalación',charger:'después de cambiar cargador o accesorio',power:'después de un corte de luz o sobretensión',repair:'después de una reparación o apertura previa',heat:'con antecedente de temperatura alta',unknown:'sin poder identificar qué ocurrió antes'};
    const answers=(symptom?.questions||[]).map(q=>{
      const v=diagState.answers?.[q.id];
      if(v==='yes')return `${q.text} Sí.`;
      if(v==='no')return `${q.text} No.`;
      if(v==='unknown')return `${q.text} No sabe.`;
      return '';
    }).filter(Boolean);
    const lines=[
      `Diagnóstico previo Nextfuture.`,
      `Equipo: ${[device,brand,model].filter(Boolean).join(' · ')}.`,
      `Síntoma principal: ${symptom?.label||'no indicado'}.`,
      secondary.length?`También presenta: ${secondary.join(', ')}.`:'',
      ctx.onset&&onsetMap[ctx.onset]?`El problema ${onsetMap[ctx.onset]}.`:'',
      ctx.antecedent&&antMap[ctx.antecedent]?`Antecedente: ${antMap[ctx.antecedent]}.`:'',
      ctx.dataImportant?'El cliente indicó que tiene archivos o datos importantes y desea priorizar su conservación.':'',
      answers.length?`Respuestas: ${answers.join(' ')}`:''
    ].filter(Boolean);
    return lines.join(' ');
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#diagToRequest');
    if(!btn)return;
    setTimeout(()=>{
      const issue=document.getElementById('rqIssue');
      if(issue)issue.value=humanSummary();
    },20);
  });

  // Pequeñas mejoras para lectores de pantalla y cambios de etapa.
  document.getElementById('diagProgress')?.setAttribute('aria-live','polite');
  document.getElementById('diagResultCard')?.setAttribute('aria-live','polite');
  document.getElementById('requestMsg')?.setAttribute('aria-live','polite');
})();

// Carga desacoplada de V3.4: si la capa adaptativa falla, el diagnóstico V3.3 sigue operativo.
(function loadAdaptiveV34(){
  if(!document.querySelector('link[data-nf-v34]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href='./v34-adaptive-diagnosis.css';link.dataset.nfV34='1';document.head.appendChild(link);
  }
  if(!document.querySelector('script[data-nf-v34]')){
    const script=document.createElement('script');script.src='./v34-adaptive-diagnosis.js';script.dataset.nfV34='1';script.async=false;document.head.appendChild(script);
  }
})();
