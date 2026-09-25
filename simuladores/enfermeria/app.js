const questions = [
  { id: 'breathing', label: '¿Desde cuándo siente que le falta el aire?', answer: 'Desde esta mañana. Al caminar hasta el baño me falta más el aire.', points: 6 },
  { id: 'allergy', label: '¿Tiene alergias conocidas?', answer: 'No conozco ninguna alergia a medicamentos.', points: 5 },
  { id: 'meds', label: '¿Toma medicación habitualmente?', answer: 'Sí, tomo medicación para la presión y para la diabetes.', points: 4 },
  { id: 'pain', label: '¿Tiene dolor o molestias en el pecho?', answer: 'No tengo dolor fuerte; siento el pecho cargado cuando toso.', points: 5 },
  { id: 'breakfast', label: '¿Qué desayunó hoy?', answer: 'Tomé té y comí dos tostadas temprano.', points: 0 }
];

const actions = [
  { id: 'identity', icon: '🪪', title: 'Verificar identidad', text: 'Confirmar datos del paciente antes de continuar.', points: 5, feedback: 'Identidad verificada dentro del escenario.' },
  { id: 'vitals', icon: '❤️', title: 'Controlar signos vitales', text: 'Registrar los valores iniciales del caso.', points: 8, feedback: 'Registraste TA, FC, FR, temperatura y SpO₂.' },
  { id: 'resp', icon: '🫁', title: 'Valorar patrón respiratorio', text: 'Observar frecuencia, esfuerzo y síntomas referidos.', points: 10, feedback: 'Detectás taquipnea leve y disnea referida con el esfuerzo.' },
  { id: 'orders', icon: '📋', title: 'Revisar indicaciones', text: 'Consultar qué está indicado en el caso antes de administrar.', points: 7, feedback: 'Revisaste las indicaciones simuladas antes de preparar elementos.' },
  { id: 'position', icon: '🛏️', title: 'Acomodar al paciente', text: 'Modificar la posición dentro del ejercicio y reevaluar confort.', points: 5, feedback: 'Marta refiere sentirse un poco más cómoda. En esta simulación, la SpO₂ pasa a 93%.' },
  { id: 'family', icon: '👥', title: 'Llamar a un familiar', text: 'Acción posible, aunque no es prioritaria para los objetivos actuales.', points: 0, feedback: 'Podría ser útil en otro momento, pero no aporta a la prioridad planteada en este ejercicio.' }
];

const state = {
  questions: new Set(), actions: new Set(),
  breakdown: { interview: 0, assessment: 0, medication: 0, drip: 0, record: 0 },
  medCorrect: false, dripCorrect: false, noteSaved: false, errors: 0
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function totalScore() {
  return Object.values(state.breakdown).reduce((sum, n) => sum + n, 0);
}

function updateProgress() {
  const score = totalScore();
  $('#scoreText').textContent = `${score} / 100`;
  $('#scoreBar').style.width = `${score}%`;
  $('#actionsCount').textContent = state.actions.size;
  $('#findingsCount').textContent = state.questions.size;
  $('#errorsCount').textContent = state.errors;
}

function switchTab(tab) {
  $$('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  $$('.tabPanel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tab}`));
  document.querySelector('.clinicalColumn').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderQuestions() {
  $('#questionList').innerHTML = questions.map(q => `
    <button class="choiceBtn ${state.questions.has(q.id) ? 'done' : ''}" data-question="${q.id}">
      ${state.questions.has(q.id) ? '✓ ' : ''}${q.label}
    </button>`).join('');

  $$('[data-question]').forEach(btn => btn.addEventListener('click', () => askQuestion(btn.dataset.question)));
}

function askQuestion(id) {
  const q = questions.find(item => item.id === id);
  if (!state.questions.has(id)) {
    state.questions.add(id);
    state.breakdown.interview = Math.min(20, state.breakdown.interview + q.points);
  }
  $('#dialogueBox').className = 'dialogueBox';
  $('#dialogueBox').innerHTML = `<b>Marta:</b> “${q.answer}”`;
  renderQuestions();
  updateProgress();
}

function renderActions() {
  $('#actionList').innerHTML = actions.map(a => `
    <button class="actionBtn ${state.actions.has(a.id) ? 'done' : ''}" data-action="${a.id}">
      <span>${a.icon}</span><b>${state.actions.has(a.id) ? '✓ ' : ''}${a.title}</b><small>${a.text}</small>
    </button>`).join('');

  $$('[data-action]').forEach(btn => btn.addEventListener('click', () => doAction(btn.dataset.action)));
}

function doAction(id) {
  const action = actions.find(item => item.id === id);
  if (!state.actions.has(id)) {
    state.actions.add(id);
    state.breakdown.assessment = Math.min(35, state.breakdown.assessment + action.points);
  }
  $('#clinicalFeedback').className = action.points ? 'feedbackBox success' : 'feedbackBox';
  $('#clinicalFeedback').innerHTML = `<b>${action.title}</b><br>${action.feedback}`;

  if (id === 'position') {
    $('#vitalSat').textContent = '93';
    $('#monitorSat').textContent = '93%';
    $('#patientMood').textContent = 'Más confortable';
    $('#patientMood').className = 'statusPill good';
  }
  renderActions();
  updateProgress();
}

function numericValue(input) {
  return Number(String(input).trim().replace(',', '.'));
}

function checkMedication() {
  const answer = numericValue($('#medAnswer').value);
  const box = $('#medFeedback');
  if (Math.abs(answer - 2.5) < 0.01) {
    if (!state.medCorrect) state.breakdown.medication = 15;
    state.medCorrect = true;
    box.className = 'feedbackBox success';
    box.innerHTML = '<b>Correcto: 2,5 mL.</b><br>En este ejercicio: 500 mg están contenidos en 5 mL, por lo que 250 mg corresponden a la mitad del volumen.';
  } else {
    state.errors += 1;
    box.className = 'feedbackBox error';
    box.innerHTML = '<b>Revisá el cálculo.</b><br>Planteá la proporción usando la dosis disponible y el volumen de presentación. Podés volver a intentarlo.';
  }
  updateProgress();
}

function checkDrip() {
  const drops = numericValue($('#dropAnswer').value);
  const pump = numericValue($('#pumpAnswer').value);
  const box = $('#dropFeedback');
  const dropsOk = Math.abs(drops - 42) <= 1;
  const pumpOk = Math.abs(pump - 125) <= 0.5;

  if (dropsOk && pumpOk) {
    if (!state.dripCorrect) state.breakdown.drip = 20;
    state.dripCorrect = true;
    box.className = 'feedbackBox success';
    box.innerHTML = '<b>Ambos resultados son correctos.</b><br>1000 mL en 8 h = 125 mL/h. Con un equipo de 20 gotas/mL, el resultado es aproximadamente 42 gotas/min.';
  } else {
    state.errors += 1;
    box.className = 'feedbackBox error';
    const missing = [];
    if (!dropsOk) missing.push('gotas/min');
    if (!pumpOk) missing.push('mL/h');
    box.innerHTML = `<b>Revisá ${missing.join(' y ')}.</b><br>Recordá convertir el tiempo a minutos para el cálculo de goteo manual.`;
  }
  updateProgress();
}

function saveNote() {
  const note = $('#nursingNote').value.trim();
  const box = $('#recordFeedback');
  if (note.length < 40) {
    state.errors += 1;
    box.className = 'feedbackBox error';
    box.textContent = 'El registro quedó demasiado breve. Intentá incluir estado general, datos relevantes y lo realizado dentro del caso.';
    updateProgress();
    return;
  }
  state.noteSaved = true;
  state.breakdown.record = 10;
  box.className = 'feedbackBox success';
  box.textContent = 'Borrador guardado. El simulador valora que hayas elaborado un registro; la redacción debe revisarse con los criterios de tu cátedra.';
  updateProgress();
}

function finishCase() {
  const box = $('#recordFeedback');
  const missing = [];
  if (!state.questions.size) missing.push('realizar al menos una pregunta');
  if (!state.actions.size) missing.push('hacer al menos una valoración');
  if (!state.medCorrect) missing.push('resolver medicación');
  if (!state.dripCorrect) missing.push('resolver goteo');
  if (!state.noteSaved) missing.push('guardar el registro');

  if (missing.length) {
    box.className = 'feedbackBox error';
    box.innerHTML = `<b>El caso todavía no está listo para cerrar.</b><br>Falta: ${missing.join(', ')}.`;
    return;
  }
  showResults();
}

function showResults() {
  $('#finalScore').textContent = totalScore();
  const rows = [
    ['Entrevista', state.breakdown.interview, 20],
    ['Valoración', state.breakdown.assessment, 35],
    ['Cálculo de medicación', state.breakdown.medication, 15],
    ['Factor goteo', state.breakdown.drip, 20],
    ['Registro', state.breakdown.record, 10]
  ];
  $('#resultBreakdown').innerHTML = rows.map(([name, value, max]) => `<div class="resultRow"><span>${name}</span><b>${value}/${max}</b></div>`).join('');

  const advice = [];
  if (state.breakdown.interview < 20) advice.push('explorar mejor la entrevista');
  if (state.breakdown.assessment < 35) advice.push('revisar las prioridades de valoración');
  if (state.errors) advice.push('repasar los intentos que necesitaron corrección');
  $('#resultAdviceText').textContent = advice.length ? `Podés ${advice.join(', ')} antes de pasar a otro caso.` : 'Completaste todos los objetivos de esta primera versión. El próximo paso será sumar nuevos pacientes y procedimientos.';

  $('#resultModal').classList.add('open');
  $('#resultModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  $('#resultModal').classList.remove('open');
  $('#resultModal').setAttribute('aria-hidden', 'true');
}

function resetCase() {
  state.questions = new Set(); state.actions = new Set();
  state.breakdown = { interview: 0, assessment: 0, medication: 0, drip: 0, record: 0 };
  state.medCorrect = false; state.dripCorrect = false; state.noteSaved = false; state.errors = 0;
  $('#medAnswer').value = ''; $('#dropAnswer').value = ''; $('#pumpAnswer').value = ''; $('#nursingNote').value = '';
  $('#medFeedback').className = 'feedbackBox neutral'; $('#medFeedback').textContent = 'Usá proporcionalidad. El sistema no descuenta puntos por el primer intento.';
  $('#dropFeedback').className = 'feedbackBox neutral'; $('#dropFeedback').textContent = 'Resolvé ambos valores y comprobá el resultado.';
  $('#recordFeedback').className = 'feedbackBox neutral'; $('#recordFeedback').textContent = 'Para cerrar el caso necesitás haber realizado al menos una entrevista, una valoración y los dos cálculos.';
  $('#clinicalFeedback').className = 'feedbackBox'; $('#clinicalFeedback').textContent = 'Todavía no realizaste acciones en esta etapa.';
  $('#dialogueBox').className = 'dialogueBox empty'; $('#dialogueBox').textContent = 'Seleccioná una pregunta para escuchar a la paciente.';
  $('#vitalSat').textContent = '91'; $('#monitorSat').textContent = '91%'; $('#patientMood').textContent = 'Disnea leve'; $('#patientMood').className = 'statusPill warning';
  renderQuestions(); renderActions(); updateProgress(); switchTab('historia');
}

$$('[data-tab]').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
$('#checkMed').addEventListener('click', checkMedication);
$('#checkDrop').addEventListener('click', checkDrip);
$('#saveNote').addEventListener('click', saveNote);
$('#finishCase').addEventListener('click', finishCase);
$('#resetBtn').addEventListener('click', resetCase);
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

renderQuestions();
renderActions();
updateProgress();
