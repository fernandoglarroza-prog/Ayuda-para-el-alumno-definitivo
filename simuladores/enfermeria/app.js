const cases = window.NURSING_CASES || [];
const roadmap = window.NURSING_CASE_ROADMAP || [];
let currentCase = cases[0];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function freshState() {
  return {
    questions: new Set(), actions: new Set(),
    breakdown: { interview: 0, assessment: 0, medication: 0, drip: 0, record: 0 },
    medCorrect: false, dripCorrect: false, noteSaved: false, errors: 0
  };
}

let state = freshState();

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

function switchTab(tab, shouldScroll = true) {
  $$('.tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  $$('.tabPanel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tab}`));
  if (shouldScroll) document.querySelector('.clinicalColumn').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderCaseLibrary() {
  $('#libraryCount').textContent = `${cases.length} disponibles`;
  $('#caseCards').innerHTML = cases.map(c => `
    <button class="caseCard ${c.id === currentCase.id ? 'active' : ''}" data-case="${c.id}">
      <span class="caseIcon">${c.icon}</span>
      <span class="caseMeta"><b>${c.area}</b><small>${c.difficulty}</small></span>
      <strong>${c.patient.name} · ${c.patient.age} años</strong>
      <p>${c.patient.complaint}</p>
      <em>${c.id === currentCase.id ? 'Caso activo' : 'Abrir caso →'}</em>
    </button>`).join('');

  $$('[data-case]').forEach(btn => btn.addEventListener('click', () => loadCase(btn.dataset.case, true)));
  $('#roadmapList').innerHTML = roadmap.map(([name, icon]) => `<span>${icon} ${name}</span>`).join('');
}

function renderCaseDetails() {
  const c = currentCase;
  $('#caseBadge').innerHTML = `<span class="dot"></span> Caso ${c.number} · En curso`;
  $('#roomLabel').textContent = `Habitación ${c.patient.room}`;
  $('#patientMood').textContent = c.patient.status;
  $('#patientMood').className = 'statusPill warning';
  $('#patientFigure').className = `patientFigure ${c.patient.profile}`;
  $('#patientName').textContent = c.patient.name;
  $('#patientAge').textContent = `${c.patient.age} años`;
  $('#patientComplaint').textContent = c.patient.complaint;
  $('#talkBtn').textContent = `💬 Hablar con ${c.patient.firstName}`;

  $('#vitalBp').textContent = c.vitals.bp;
  $('#vitalHr').textContent = c.vitals.hr;
  $('#vitalRr').textContent = c.vitals.rr;
  $('#vitalTemp').textContent = c.vitals.temp;
  $('#vitalSat').textContent = c.vitals.sat;
  $('#monitorSat').textContent = `${c.vitals.sat}%`;

  $('#historyGrid').innerHTML = c.history.map(([label, value]) => `<article><span>${label}</span><b>${value}</b></article>`).join('');
  $('#caseObjective').textContent = c.objective;
  $('#medOrder').textContent = c.medication.order;
  $('#medAvailable').textContent = c.medication.available;
  $('#dripVolume').textContent = c.drip.volume;
  $('#dripHours').textContent = c.drip.hours;
  $('#dripFactor').textContent = c.drip.factor;
  $('#recordHint').innerHTML = `<b>Para pensar:</b> podrías integrar ${c.recordHint}.`;
  $('#nursingNote').placeholder = `Ej.: ${c.recordHint}...`;
}

function renderQuestions() {
  $('#questionList').innerHTML = currentCase.questions.map(q => `
    <button class="choiceBtn ${state.questions.has(q.id) ? 'done' : ''}" data-question="${q.id}">
      ${state.questions.has(q.id) ? '✓ ' : ''}${q.label}
    </button>`).join('');
  $$('[data-question]').forEach(btn => btn.addEventListener('click', () => askQuestion(btn.dataset.question)));
}

function askQuestion(id) {
  const q = currentCase.questions.find(item => item.id === id);
  if (!q) return;
  if (!state.questions.has(id)) {
    state.questions.add(id);
    state.breakdown.interview = Math.min(20, state.breakdown.interview + q.points);
  }
  $('#dialogueBox').className = 'dialogueBox';
  $('#dialogueBox').innerHTML = `<b>${currentCase.patient.firstName}:</b> “${q.answer}”`;
  renderQuestions();
  updateProgress();
}

function renderActions() {
  $('#actionList').innerHTML = currentCase.actions.map(a => `
    <button class="actionBtn ${state.actions.has(a.id) ? 'done' : ''}" data-action="${a.id}">
      <span>${a.icon}</span><b>${state.actions.has(a.id) ? '✓ ' : ''}${a.title}</b><small>${a.text}</small>
    </button>`).join('');
  $$('[data-action]').forEach(btn => btn.addEventListener('click', () => doAction(btn.dataset.action)));
}

function doAction(id) {
  const action = currentCase.actions.find(item => item.id === id);
  if (!action) return;
  if (!state.actions.has(id)) {
    state.actions.add(id);
    state.breakdown.assessment = Math.min(35, state.breakdown.assessment + action.points);
  }
  $('#clinicalFeedback').className = action.points ? 'feedbackBox success' : 'feedbackBox';
  $('#clinicalFeedback').innerHTML = `<b>${action.title}</b><br>${action.feedback}`;

  if (action.evolves) {
    $('#vitalSat').textContent = currentCase.improvedVitals.sat;
    $('#monitorSat').textContent = `${currentCase.improvedVitals.sat}%`;
    $('#patientMood').textContent = currentCase.improvedVitals.status;
    $('#patientMood').className = 'statusPill good';
    $('#patientFigure').classList.add('improved');
  }
  renderActions();
  updateProgress();
}

function numericValue(input) {
  return Number(String(input).trim().replace(',', '.'));
}

function checkMedication() {
  const answer = numericValue($('#medAnswer').value);
  const expected = currentCase.medication.answer;
  const box = $('#medFeedback');
  if (Number.isFinite(answer) && Math.abs(answer - expected) < 0.05) {
    if (!state.medCorrect) state.breakdown.medication = 15;
    state.medCorrect = true;
    box.className = 'feedbackBox success';
    box.innerHTML = `<b>Correcto: ${String(expected).replace('.', ',')} mL.</b><br>${currentCase.medication.explanation}`;
  } else {
    state.errors += 1;
    box.className = 'feedbackBox error';
    box.innerHTML = '<b>Revisá el cálculo.</b><br>Planteá la proporción usando la dosis indicada, la dosis disponible y el volumen de presentación. Podés volver a intentarlo.';
  }
  updateProgress();
}

function checkDrip() {
  const drops = numericValue($('#dropAnswer').value);
  const pump = numericValue($('#pumpAnswer').value);
  const expected = currentCase.drip;
  const box = $('#dropFeedback');
  const dropsOk = Number.isFinite(drops) && Math.abs(drops - expected.drops) <= 1;
  const pumpOk = Number.isFinite(pump) && Math.abs(pump - expected.pump) <= 0.6;

  if (dropsOk && pumpOk) {
    if (!state.dripCorrect) state.breakdown.drip = 20;
    state.dripCorrect = true;
    box.className = 'feedbackBox success';
    box.innerHTML = `<b>Ambos resultados son correctos.</b><br>${expected.volume} mL en ${expected.hours} h = ${String(expected.pump).replace('.', ',')} mL/h. Con un equipo de ${expected.factor} gotas/mL, el resultado es aproximadamente ${expected.drops} gotas/min.`;
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
  $('#resultTitle').textContent = `${currentCase.patient.name} · Caso ${currentCase.number}`;
  const rows = [
    ['Entrevista', state.breakdown.interview, 20], ['Valoración', state.breakdown.assessment, 35],
    ['Cálculo de medicación', state.breakdown.medication, 15], ['Factor goteo', state.breakdown.drip, 20], ['Registro', state.breakdown.record, 10]
  ];
  $('#resultBreakdown').innerHTML = rows.map(([name, value, max]) => `<div class="resultRow"><span>${name}</span><b>${value}/${max}</b></div>`).join('');
  const advice = [];
  if (state.breakdown.interview < 20) advice.push('explorar mejor la entrevista');
  if (state.breakdown.assessment < 35) advice.push('revisar las prioridades de valoración');
  if (state.errors) advice.push('repasar los intentos que necesitaron corrección');
  $('#resultAdviceText').textContent = advice.length ? `Podés ${advice.join(', ')} antes de pasar a otro caso.` : 'Completaste todos los objetivos. Podés elegir otro paciente de la biblioteca para cambiar el escenario.';
  $('#resultModal').classList.add('open');
  $('#resultModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  $('#resultModal').classList.remove('open');
  $('#resultModal').setAttribute('aria-hidden', 'true');
}

function resetFeedback() {
  $('#medAnswer').value = ''; $('#dropAnswer').value = ''; $('#pumpAnswer').value = ''; $('#nursingNote').value = '';
  $('#medFeedback').className = 'feedbackBox neutral'; $('#medFeedback').textContent = 'Usá proporcionalidad. Podés volver a intentarlo.';
  $('#dropFeedback').className = 'feedbackBox neutral'; $('#dropFeedback').textContent = 'Resolvé ambos valores y comprobá el resultado.';
  $('#recordFeedback').className = 'feedbackBox neutral'; $('#recordFeedback').textContent = 'Para cerrar el caso necesitás haber realizado al menos una entrevista, una valoración y los dos cálculos.';
  $('#clinicalFeedback').className = 'feedbackBox'; $('#clinicalFeedback').textContent = 'Todavía no realizaste acciones en esta etapa.';
  $('#dialogueBox').className = 'dialogueBox empty'; $('#dialogueBox').textContent = 'Seleccioná una pregunta para escuchar al paciente.';
}

function loadCase(id, shouldScroll = false) {
  const selected = cases.find(c => c.id === id);
  if (!selected) return;
  currentCase = selected;
  state = freshState();
  closeModal();
  renderCaseDetails();
  resetFeedback();
  renderQuestions();
  renderActions();
  renderCaseLibrary();
  updateProgress();
  switchTab('historia', false);
  if (shouldScroll) document.querySelector('.workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetCase() {
  loadCase(currentCase.id, false);
}

$$('[data-tab]').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
$('#checkMed').addEventListener('click', checkMedication);
$('#checkDrop').addEventListener('click', checkDrip);
$('#saveNote').addEventListener('click', saveNote);
$('#finishCase').addEventListener('click', finishCase);
$('#resetBtn').addEventListener('click', resetCase);
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

if (cases.length) loadCase(cases[0].id, false);
