(() => {
  const PROCEDURES = {
    bp: {
      icon: '🫀', title: 'Control de presión arterial', subtitle: 'Secuencia guiada de valoración',
      materials: ['Higiene de manos', 'Tensiómetro', 'Manguito adecuado', 'Registro'],
      steps: [
        { q: 'Antes de medir, ¿qué corresponde hacer primero?', options: ['Verificar identidad, explicar el procedimiento y preparar al paciente', 'Inflar el manguito inmediatamente', 'Pedirle al paciente que camine unos minutos'], correct: 0 },
        { q: '¿Qué decisión técnica corresponde antes de colocar el manguito?', options: ['Elegir un tamaño adecuado y una posición segura del brazo', 'Colocarlo sobre cualquier prenda gruesa', 'Usar siempre el mismo tamaño de manguito'], correct: 0 },
        { q: 'Una vez preparado el paciente, ¿qué sigue?', options: ['Colocar el manguito y efectuar la medición según el equipo/protocolo', 'Retirar el manguito sin medir', 'Cambiar de procedimiento'], correct: 0 },
        { q: 'Después de obtener el valor, ¿qué completa la actividad?', options: ['Registrar el resultado y relacionarlo con el estado del paciente', 'Descartar el valor si no era el esperado', 'Modificar el valor para que parezca normal'], correct: 0 }
      ],
      result: c => `TA simulada del caso: ${c.vitals.bp} mmHg.`, action: 'vitals'
    },
    oximetry: {
      icon: '🖐️', title: 'Oximetría de pulso', subtitle: 'Control no invasivo de SpO₂',
      materials: ['Higiene de manos', 'Oxímetro', 'Sitio de medición adecuado', 'Registro'],
      steps: [
        { q: '¿Qué conviene hacer antes de colocar el sensor?', options: ['Verificar identidad y revisar que el sitio permita una lectura confiable', 'Anotar un valor estimado', 'Usar el sensor sin observar al paciente'], correct: 0 },
        { q: '¿Dónde se coloca el sensor en esta simulación?', options: ['En un sitio periférico adecuado, como un dedo', 'Sobre la ropa', 'En el abdomen'], correct: 0 },
        { q: 'Antes de registrar el dato, ¿qué corresponde?', options: ['Esperar una lectura estable y valorar si coincide con el estado clínico', 'Registrar el primer número que aparezca', 'Ignorar movimiento o señal deficiente'], correct: 0 },
        { q: '¿Qué cierra correctamente el control?', options: ['Registrar SpO₂ y observaciones relevantes', 'Borrar el resultado', 'Cambiar el número manualmente'], correct: 0 }
      ],
      result: c => `SpO₂ simulada del caso: ${c.vitals.sat}%.`, action: 'vitals'
    },
    glucose: {
      icon: '🩸', title: 'Glucemia capilar', subtitle: 'Secuencia didáctica simplificada',
      warning: 'La técnica real debe practicarse con supervisión y siguiendo el protocolo institucional, bioseguridad y el dispositivo utilizado.',
      materials: ['Higiene de manos / EPP', 'Glucómetro', 'Tira reactiva', 'Dispositivo de punción', 'Contenedor seguro'],
      steps: [
        { q: '¿Cuál es el inicio correcto del procedimiento simulado?', options: ['Verificar identidad, indicación/contexto y preparar el material con bioseguridad', 'Puncionar primero y buscar los materiales después', 'Omitir la identificación porque el paciente ya está en la cama'], correct: 0 },
        { q: 'Antes de obtener la muestra simulada, ¿qué corresponde?', options: ['Preparar glucómetro y tira según el equipo y elegir un sitio apropiado', 'Usar cualquier tira sin comprobar compatibilidad', 'Apoyar el material sobre cualquier superficie'], correct: 0 },
        { q: 'Luego de obtener la muestra dentro del ejercicio, ¿qué sigue?', options: ['Aplicarla al sistema de medición según el dispositivo y esperar el resultado', 'Desechar el glucómetro', 'Estimar el resultado por los síntomas'], correct: 0 },
        { q: '¿Qué debe suceder al finalizar?', options: ['Descartar material punzante de forma segura, higiene y registrar/interpretar el resultado', 'Guardar el punzante usado para otra persona', 'No registrar el valor'], correct: 0 }
      ],
      result: c => c.id === 'metabolico-01' ? 'Glucemia capilar simulada: 62 mg/dL. Integrá el dato con los síntomas del caso.' : 'Control simulado completado. Interpretá el resultado según el caso y la consigna docente.', action: 'glucose'
    },
    dressing: {
      icon: '🩹', title: 'Curación / revisión de apósito', subtitle: 'Secuencia didáctica de cuidado',
      warning: 'Los productos, técnica específica y frecuencia dependen de la herida, la indicación y el protocolo institucional.',
      materials: ['Higiene de manos / EPP', 'Material indicado', 'Campo/insumos limpios o estériles según protocolo', 'Residuos', 'Registro'],
      steps: [
        { q: '¿Qué corresponde antes de tocar el apósito?', options: ['Verificar identidad, indicación, dolor y preparar el material con bioseguridad', 'Retirarlo sin explicar nada', 'Aplicar cualquier producto disponible'], correct: 0 },
        { q: 'Al exponer la zona, ¿qué debe priorizarse?', options: ['Observar y valorar el sitio antes de intervenir', 'Cubrirlo de inmediato sin mirar', 'Ignorar el aspecto de la piel'], correct: 0 },
        { q: '¿Cómo se realiza la parte técnica en este simulador?', options: ['Siguiendo técnica aséptica y el protocolo específico indicado', 'Usando una técnica idéntica para todas las heridas', 'Sin higiene de manos'], correct: 0 },
        { q: '¿Qué completa el procedimiento?', options: ['Proteger/fijar según indicación, eliminar residuos de forma segura y registrar hallazgos', 'Dejar materiales usados en la cama', 'Omitir el registro'], correct: 0 }
      ],
      result: c => c.id === 'quirurgico-01' ? 'Hallazgo del escenario: apósito íntegro. Documentá el aspecto observado y lo realizado.' : 'Revisión simulada completada. El hallazgo debe interpretarse según el escenario.', action: 'wound'
    },
    pump: {
      icon: '💧', title: 'Programación de bomba de infusión', subtitle: 'Configuración simulada · sin conexión real',
      warning: 'La programación real depende del equipo, la solución, la prescripción y las verificaciones institucionales.',
      materials: ['Indicación del ejercicio', 'Solución/rotulado', 'Bomba simulada', 'Línea identificada', 'Registro'],
      steps: [
        { q: '¿Qué debe verificarse antes de programar una bomba?', options: ['Paciente, indicación, solución, volumen, tiempo y compatibilidad con el escenario', 'Solo el color de la bolsa', 'Únicamente que la bomba encienda'], correct: 0 },
        { q: '¿Qué dato necesitás calcular para programar la velocidad?', options: ['mL/h', 'gotas por segundo obligatoriamente', 'temperatura corporal'], correct: 0 },
        { q: 'Antes de iniciar una infusión real, ¿qué enfoque es correcto?', options: ['Realizar las verificaciones requeridas por el protocolo y el equipo', 'Conectar sin revisar el rotulado', 'Cambiar la prescripción si parece lenta'], correct: 0 }
      ],
      numeric: true,
      result: c => `Velocidad esperada para este ejercicio: ${String(c.drip.pump).replace('.', ',')} mL/h.`, action: null
    }
  };

  const CASE_PROCEDURES = {
    'respiratorio-01': ['oximetry', 'bp', 'pump'],
    'metabolico-01': ['glucose', 'bp', 'oximetry'],
    'quirurgico-01': ['dressing', 'bp', 'oximetry', 'pump'],
    'adulto-mayor-01': ['bp', 'oximetry', 'pump']
  };

  let runtime = freshProcedureRuntime();
  let originalLoadCase = null;

  function freshProcedureRuntime() {
    return { active: null, materialSelection: new Set(), step: 0, completed: new Set(), localAttempts: 0, started: false };
  }

  function ensureStyles() {
    if (document.querySelector('link[data-procedure-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './procedures.css';
    link.dataset.procedureStyles = 'true';
    document.head.appendChild(link);
  }

  function mountWorkshop() {
    ensureStyles();
    const anchor = document.querySelector('.bedsideLab') || document.querySelector('.patientIdentity');
    if (!anchor || document.querySelector('.procedureWorkshop')) return;
    const section = document.createElement('section');
    section.className = 'procedureWorkshop';
    anchor.insertAdjacentElement('afterend', section);
    renderWorkshop();
  }

  function availableIds() {
    return CASE_PROCEDURES[currentCase?.id] || ['bp', 'oximetry'];
  }

  function renderWorkshop() {
    const root = document.querySelector('.procedureWorkshop');
    if (!root || !currentCase) return;
    const ids = availableIds();
    root.innerHTML = `
      <div class="procedureHead">
        <div><span class="eyebrow">Taller de procedimientos</span><h3>Practicá la secuencia, no solo el resultado</h3><p>Seleccioná un procedimiento disponible para este paciente y completá sus pasos en orden.</p></div>
        <span class="procedureCounter">${runtime.completed.size}/${ids.length} completados</span>
      </div>
      <div class="procedureCards">
        ${ids.map(id => {
          const p = PROCEDURES[id];
          const done = runtime.completed.has(id);
          return `<button class="procedureCard ${done ? 'done' : ''} ${runtime.active === id ? 'active' : ''}" data-procedure="${id}">
            <span>${p.icon}</span><b>${p.title}</b><small>${p.subtitle}</small><em>${done ? '✓ Completado' : 'Practicar →'}</em>
          </button>`;
        }).join('')}
      </div>
      <div class="procedureRoadmap"><b>Motor preparado para ampliar:</b><span>💉 administración parenteral</span><span>🫁 oxigenoterapia</span><span>🧴 sondas</span><span>💧 accesos y fluidoterapia</span></div>
      <div id="procedureStage" class="procedureStage ${runtime.active ? 'open' : ''}"></div>`;
    root.querySelectorAll('[data-procedure]').forEach(btn => btn.addEventListener('click', () => openProcedure(btn.dataset.procedure)));
    if (runtime.active) renderStage();
  }

  function openProcedure(id) {
    if (!PROCEDURES[id]) return;
    runtime.active = id;
    runtime.materialSelection = new Set();
    runtime.step = 0;
    runtime.localAttempts = 0;
    runtime.started = false;
    renderWorkshop();
    document.querySelector('#procedureStage')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderStage(message = '') {
    const stage = document.querySelector('#procedureStage');
    const p = PROCEDURES[runtime.active];
    if (!stage || !p) return;
    const materialsReady = p.materials.every(m => runtime.materialSelection.has(m));
    if (!runtime.started) {
      stage.innerHTML = `
        <div class="procedureStageTop"><div class="procedureVisual"><span>${p.icon}</span><i></i></div><div><span class="eyebrow">Preparación</span><h4>${p.title}</h4><p>Seleccioná todos los elementos necesarios para iniciar esta secuencia didáctica.</p></div><button class="stageClose" type="button" data-close-procedure>×</button></div>
        ${p.warning ? `<div class="procedureWarning">⚠️ ${p.warning}</div>` : ''}
        <div class="materialTray">${p.materials.map(m => `<button class="materialChip ${runtime.materialSelection.has(m) ? 'selected' : ''}" data-material="${escapeAttr(m)}">${runtime.materialSelection.has(m) ? '✓ ' : ''}${m}</button>`).join('')}</div>
        <button id="startProcedure" class="primaryBtn procedureStart" ${materialsReady ? '' : 'disabled'}>Comenzar secuencia ${materialsReady ? '→' : `(${runtime.materialSelection.size}/${p.materials.length})`}</button>
        ${message ? `<div class="procedureMessage">${message}</div>` : ''}`;
      stage.querySelectorAll('[data-material]').forEach(btn => btn.addEventListener('click', () => toggleMaterial(btn.dataset.material)));
      stage.querySelector('[data-close-procedure]')?.addEventListener('click', closeProcedure);
      stage.querySelector('#startProcedure')?.addEventListener('click', startProcedure);
      return;
    }

    const step = p.steps[runtime.step];
    if (!step) return renderCompletion();
    const progress = Math.round((runtime.step / (p.steps.length + (p.numeric ? 1 : 0))) * 100);
    stage.innerHTML = `
      <div class="procedureStageTop"><div class="procedureVisual active"><span>${p.icon}</span><i></i></div><div><span class="eyebrow">Paso ${runtime.step + 1} de ${p.steps.length + (p.numeric ? 1 : 0)}</span><h4>${p.title}</h4><p>${step.q}</p></div><button class="stageClose" type="button" data-close-procedure>×</button></div>
      <div class="procedureProgress"><i style="width:${progress}%"></i></div>
      <div class="stepChoices">${step.options.map((option, index) => `<button data-step-choice="${index}">${option}</button>`).join('')}</div>
      <div class="procedureMessage ${message ? 'show' : ''}">${message}</div>`;
    stage.querySelectorAll('[data-step-choice]').forEach(btn => btn.addEventListener('click', () => answerStep(Number(btn.dataset.stepChoice))));
    stage.querySelector('[data-close-procedure]')?.addEventListener('click', closeProcedure);
  }

  function toggleMaterial(material) {
    if (runtime.materialSelection.has(material)) runtime.materialSelection.delete(material); else runtime.materialSelection.add(material);
    renderStage();
  }

  function startProcedure() {
    const p = PROCEDURES[runtime.active];
    if (!p.materials.every(m => runtime.materialSelection.has(m))) return;
    runtime.started = true;
    runtime.step = 0;
    renderStage();
  }

  function answerStep(index) {
    const p = PROCEDURES[runtime.active];
    const step = p.steps[runtime.step];
    if (!step) return;
    if (index !== step.correct) {
      runtime.localAttempts += 1;
      if (typeof state !== 'undefined') state.errors += 1;
      if (typeof updateProgress === 'function') updateProgress();
      renderStage('Revisá el orden: esa acción no corresponde todavía. Podés corregirla y continuar.');
      return;
    }
    runtime.step += 1;
    if (runtime.step >= p.steps.length && p.numeric) return renderNumericStep();
    if (runtime.step >= p.steps.length) return renderCompletion();
    renderStage('✓ Paso correcto. Continuá con la secuencia.');
  }

  function renderNumericStep(message = '') {
    const stage = document.querySelector('#procedureStage');
    const p = PROCEDURES[runtime.active];
    if (!stage || !p) return;
    const expected = currentCase.drip.pump;
    stage.innerHTML = `
      <div class="procedureStageTop"><div class="procedureVisual active"><span>${p.icon}</span><i></i></div><div><span class="eyebrow">Paso final</span><h4>Programación simulada</h4><p>Con los datos del caso, ingresá la velocidad que programarías en la bomba del ejercicio.</p></div><button class="stageClose" type="button" data-close-procedure>×</button></div>
      <div class="pumpSimulator"><div class="pumpScreen"><span>VELOCIDAD</span><strong id="pumpProcedureDisplay">--,-</strong><small>mL/h</small></div><label>Velocidad<input id="pumpProcedureInput" inputmode="decimal" placeholder="mL/h"></label></div>
      <button id="checkProcedurePump" class="primaryBtn">Confirmar programación</button>
      <div class="procedureMessage ${message ? 'show' : ''}">${message}</div>`;
    stage.querySelector('[data-close-procedure]')?.addEventListener('click', closeProcedure);
    const input = stage.querySelector('#pumpProcedureInput');
    input?.addEventListener('input', () => { stage.querySelector('#pumpProcedureDisplay').textContent = input.value || '--,-'; });
    stage.querySelector('#checkProcedurePump')?.addEventListener('click', () => {
      const value = Number(String(input.value).replace(',', '.'));
      if (!Number.isFinite(value) || Math.abs(value - expected) > 0.6) {
        runtime.localAttempts += 1;
        if (typeof state !== 'undefined') state.errors += 1;
        if (typeof updateProgress === 'function') updateProgress();
        renderNumericStep('Revisá el cálculo de mL/h antes de confirmar la programación simulada.');
        return;
      }
      renderCompletion();
    });
  }

  function renderCompletion() {
    const stage = document.querySelector('#procedureStage');
    const p = PROCEDURES[runtime.active];
    if (!stage || !p) return;
    runtime.completed.add(runtime.active);
    if (p.action && typeof doAction === 'function') doAction(p.action, 'procedure');
    const result = p.result(currentCase);
    stage.innerHTML = `
      <div class="procedureComplete"><div class="completeMark">✓</div><div><span class="eyebrow">Secuencia completada</span><h4>${p.title}</h4><p>${result}</p><small>Intentos a revisar en este procedimiento: ${runtime.localAttempts}. La técnica real se valida con el protocolo y la práctica supervisada.</small></div></div>
      <div class="procedureCompleteActions"><button class="secondaryBtn" data-repeat-procedure>Repetir</button><button class="primaryBtn" data-close-procedure>Cerrar taller</button></div>`;
    stage.querySelector('[data-repeat-procedure]')?.addEventListener('click', () => openProcedure(runtime.active));
    stage.querySelector('[data-close-procedure]')?.addEventListener('click', closeProcedure);
    updateCounterOnly();
  }

  function updateCounterOnly() {
    const counter = document.querySelector('.procedureCounter');
    if (counter) counter.textContent = `${runtime.completed.size}/${availableIds().length} completados`;
    document.querySelectorAll('[data-procedure]').forEach(btn => {
      const id = btn.dataset.procedure;
      btn.classList.toggle('done', runtime.completed.has(id));
      const em = btn.querySelector('em');
      if (em && runtime.completed.has(id)) em.textContent = '✓ Completado';
    });
  }

  function closeProcedure() {
    runtime.active = null;
    runtime.materialSelection = new Set();
    runtime.step = 0;
    runtime.started = false;
    renderWorkshop();
  }

  function resetForCase() {
    runtime = freshProcedureRuntime();
    const existing = document.querySelector('.procedureWorkshop');
    if (existing) existing.remove();
    setTimeout(mountWorkshop, 0);
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function hookCaseLoader() {
    if (typeof loadCase !== 'function' || originalLoadCase) return;
    originalLoadCase = loadCase;
    loadCase = function(id, shouldScroll = false) {
      const result = originalLoadCase(id, shouldScroll);
      resetForCase();
      return result;
    };
  }

  function init() {
    hookCaseLoader();
    setTimeout(mountWorkshop, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
