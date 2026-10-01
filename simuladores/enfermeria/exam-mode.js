(() => {
  let mode = localStorage.getItem('nursing-sim-mode') || 'practice';
  let startedAt = Date.now();
  let timerId = null;
  let examMedSubmitted = false;
  let examDripSubmitted = false;
  let examMedAnswer = '';
  let examDropAnswer = '';
  let examPumpAnswer = '';

  function ensureStyles(){
    if(document.querySelector('link[data-exam-mode-styles]')) return;
    const link=document.createElement('link');link.rel='stylesheet';link.href='./exam-mode.css';link.dataset.examModeStyles='true';document.head.appendChild(link);
  }

  function mount(){
    ensureStyles();
    const intro=document.querySelector('.introCard');
    if(!intro || document.querySelector('.studyModeBar')) return;
    const bar=document.createElement('section');bar.className='studyModeBar';
    bar.innerHTML=`<div class="studyModeText"><b>Modo de entrenamiento</b><span>Práctica muestra devoluciones. Examen las reserva para el cierre.</span></div><div class="modeSwitch"><button class="modeBtn" data-mode="practice">🎓 Práctica</button><button class="modeBtn" data-mode="exam">📝 Examen</button></div><div class="examClock" id="examClock">00:00</div>`;
    intro.insertAdjacentElement('afterend',bar);
    bar.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>setMode(btn.dataset.mode)));
    applyMode();startClock();
  }

  function setMode(next){
    if(!['practice','exam'].includes(next) || next===mode) return;
    mode=next;localStorage.setItem('nursing-sim-mode',mode);resetExamRuntime();applyMode();
    if(typeof loadCase==='function' && currentCase) loadCase(currentCase.id,false);
  }

  function applyMode(){
    document.body.classList.toggle('examMode',mode==='exam');
    document.querySelectorAll('[data-mode]').forEach(btn=>btn.classList.toggle('active',btn.dataset.mode===mode));
    const badge=document.querySelector('#caseBadge');
    if(badge && currentCase) badge.innerHTML=`<span class="dot"></span> Caso ${currentCase.number} · ${mode==='exam'?'Modo examen':'En curso'}`;
    if(typeof updateProgress==='function') updateProgress();
  }

  function resetExamRuntime(){
    startedAt=Date.now();examMedSubmitted=false;examDripSubmitted=false;examMedAnswer='';examDropAnswer='';examPumpAnswer='';
  }

  function startClock(){
    if(timerId) clearInterval(timerId);
    const tick=()=>{const el=document.querySelector('#examClock');if(!el)return;const s=Math.max(0,Math.floor((Date.now()-startedAt)/1000));const m=Math.floor(s/60);const r=s%60;el.textContent=`${String(m).padStart(2,'0')}:${String(r).padStart(2,'0')}`;};
    tick();timerId=setInterval(tick,1000);
  }

  function hook(){
    if(typeof loadCase==='function' && !loadCase.__examWrapped){
      const original=loadCase;
      loadCase=function(id,scroll=false){const r=original(id,scroll);resetExamRuntime();applyMode();return r;};
      loadCase.__examWrapped=true;
    }
    if(typeof updateProgress==='function' && !updateProgress.__examWrapped){
      const original=updateProgress;
      updateProgress=function(){original();if(mode==='exam'){const text=document.querySelector('#scoreText');if(text)text.textContent='Puntaje oculto';}};
      updateProgress.__examWrapped=true;
    }
    if(typeof doAction==='function' && !doAction.__examWrapped){
      const original=doAction;
      doAction=function(id,source='panel'){const r=original(id,source);if(mode==='exam' && source==='panel'){const box=document.querySelector('#clinicalFeedback');if(box){box.className='feedbackBox neutral';box.textContent='Acción registrada. La devolución se mostrará al finalizar el caso.';}}return r;};
      doAction.__examWrapped=true;
    }
    if(typeof checkMedication==='function' && !checkMedication.__examWrapped){
      const original=checkMedication;
      checkMedication=function(){if(mode!=='exam')return original();const input=document.querySelector('#medAnswer');examMedAnswer=input?.value||'';examMedSubmitted=true;const value=Number(String(examMedAnswer).trim().replace(',','.'));const expected=currentCase.medication.answer;const ok=Number.isFinite(value)&&Math.abs(value-expected)<0.05;state.medCorrect=ok;state.breakdown.medication=ok?15:0;const box=document.querySelector('#medFeedback');if(box){box.className='feedbackBox neutral';box.textContent='Respuesta registrada para la evaluación final.';}if(typeof updateProgress==='function')updateProgress();};
      checkMedication.__examWrapped=true;
    }
    if(typeof checkDrip==='function' && !checkDrip.__examWrapped){
      const original=checkDrip;
      checkDrip=function(){if(mode!=='exam')return original();examDropAnswer=document.querySelector('#dropAnswer')?.value||'';examPumpAnswer=document.querySelector('#pumpAnswer')?.value||'';examDripSubmitted=true;const d=Number(String(examDropAnswer).trim().replace(',','.'));const p=Number(String(examPumpAnswer).trim().replace(',','.'));const expected=currentCase.drip;const ok=Number.isFinite(d)&&Math.abs(d-expected.drops)<=1&&Number.isFinite(p)&&Math.abs(p-expected.pump)<=0.6;state.dripCorrect=ok;state.breakdown.drip=ok?20:0;const box=document.querySelector('#dropFeedback');if(box){box.className='feedbackBox neutral';box.textContent='Respuestas registradas para la evaluación final.';}if(typeof updateProgress==='function')updateProgress();};
      checkDrip.__examWrapped=true;
    }
    if(typeof saveNote==='function' && !saveNote.__examWrapped){
      const original=saveNote;
      saveNote=function(){if(mode!=='exam')return original();const note=document.querySelector('#nursingNote')?.value.trim()||'';state.noteSaved=note.length>=40;state.breakdown.record=state.noteSaved?10:0;const box=document.querySelector('#recordFeedback');if(box){box.className='feedbackBox neutral';box.textContent=state.noteSaved?'Registro guardado para la corrección final.':'El registro necesita más desarrollo antes de enviarlo.';}if(typeof updateProgress==='function')updateProgress();};
      saveNote.__examWrapped=true;
    }
    if(typeof finishCase==='function' && !finishCase.__examWrapped){
      const original=finishCase;
      finishCase=function(){if(mode!=='exam')return original();const missing=[];if(!state.questions.size)missing.push('entrevista');if(!state.actions.size)missing.push('valoración');if(!examMedSubmitted)missing.push('cálculo de medicación');if(!examDripSubmitted)missing.push('goteo');if(!state.noteSaved)missing.push('registro');const box=document.querySelector('#recordFeedback');if(missing.length){if(box){box.className='feedbackBox neutral';box.innerHTML=`<b>Evaluación incompleta.</b><br>Falta entregar: ${missing.join(', ')}.`;}return;}if(typeof showResults==='function')showResults();appendDebrief();};
      finishCase.__examWrapped=true;
    }
  }

  function appendDebrief(){
    if(mode!=='exam')return;setTimeout(()=>{
      const root=document.querySelector('#resultBreakdown');if(!root || root.querySelector('.examDebrief'))return;
      const expected=currentCase;
      const box=document.createElement('div');box.className='examDebrief';box.innerHTML=`<b>Corrección de cálculos</b><div><span>Medicación</span><strong>${examMedAnswer||'—'} mL → esperado ${String(expected.medication.answer).replace('.',',')} mL</strong></div><div><span>Goteo manual</span><strong>${examDropAnswer||'—'} → aprox. ${expected.drip.drops} gotas/min</strong></div><div><span>Bomba</span><strong>${examPumpAnswer||'—'} → ${String(expected.drip.pump).replace('.',',')} mL/h</strong></div><div><span>Tiempo empleado</span><strong>${document.querySelector('#examClock')?.textContent||'—'}</strong></div>`;root.appendChild(box);
    },0);
  }

  function init(){hook();mount();applyMode();window.addEventListener('nursing-cases-updated',()=>setTimeout(applyMode,0));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();