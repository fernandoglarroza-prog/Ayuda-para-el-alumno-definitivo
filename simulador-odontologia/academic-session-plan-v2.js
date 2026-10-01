(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_session_plan_v2';
  const TARGET = 0.70;
  const STOP = new Set(['de','del','la','las','el','los','y','e','o','u','en','por','para','con','sin','un','una','unos','unas','al','a','que','se','su','sus','como','entre']);
  const LAYER_BUTTONS = { landmarks: 'toggleLandmarks', nerves: 'toggleNerves', vessels: 'toggleVessels', tmj: 'toggleTMJ', muscles: 'toggleMuscles' };
  const CHALLENGES = [
    { areas: ['osteologia'], entryId: 'mandibula', target: 'Mandíbula', prompt: 'Identificá la mandíbula sobre el modelo 3D.', accepted: ['mandibula'], layers: [] },
    { areas: ['neurologia','topografia'], entryId: 'v3', target: 'V3', prompt: 'Identificá el trayecto esquemático de V3.', accepted: ['v3'], layers: ['nerves'] },
    { areas: ['neurologia'], entryId: 'v2', target: 'V2', prompt: 'Identificá el trayecto esquemático de V2.', accepted: ['v2'], layers: ['nerves'] },
    { areas: ['angiologia'], entryId: 'arteria_maxilar', target: 'Arteria maxilar', prompt: 'Identificá la arteria maxilar en la capa vascular.', accepted: ['maxillary_artery'], layers: ['vessels'] },
    { areas: ['artrologia'], entryId: 'atm', target: 'Disco articular de la ATM', prompt: 'Identificá el disco articular de la ATM.', accepted: ['disco_articular_atm'], layers: ['tmj'] },
    { areas: ['miologia'], entryId: 'masticacion_integrada', target: 'Masetero', prompt: 'Identificá el músculo masetero.', accepted: ['masetero'], layers: ['muscles'] },
    { areas: ['topografia'], entryId: 'region_pterigomandibular', target: 'Foramen mandibular', prompt: 'Identificá el foramen mandibular en la cara medial de la rama.', accepted: ['foramen_mandibular'], layers: ['landmarks'] }
  ];

  let state = loadState();
  let active3DStep = null;
  let booted = false;

  const $ = (id) => document.getElementById(id);
  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const significantTokens = (value) => normalize(value).split(' ').filter(token => token.length > 2 && !STOP.has(token));
  const escapeHTML = (value = '') => value.toString().replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function emptyState() { return { sessionId: 0, generatedAt: null, completedAt: null, steps: [] }; }
  function loadState() {
    try { return { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return emptyState(); }
  }
  function saveState(renderNow = true) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    if (renderNow) render();
  }
  function entries() { return window.AcademicV2?.entries?.() || []; }
  function mastery() { return window.AcademicMasteryV2; }
  function spaced() { return window.AcademicSpacedV2; }
  function profile() { return mastery()?.profile?.() || { areas: [] }; }
  function entryById(id) { return entries().find(entry => entry.id === id || entry.modelKey === id); }

  function requirementMatched(requirement, answerNormalized) {
    const exact = normalize(requirement);
    if (!exact) return false;
    if (answerNormalized.includes(exact)) return true;
    const tokens = significantTokens(requirement);
    if (!tokens.length) return false;
    const hits = tokens.filter(token => answerNormalized.includes(token)).length;
    return hits >= (tokens.length === 1 ? 1 : Math.ceil(tokens.length * 0.65));
  }

  function pickAreas() {
    const data = profile();
    const areas = [...(data.areas || [])];
    const scored = areas.filter(area => area.score != null).sort((a,b) => a.score - b.score || b.weight - a.weight);
    const untested = areas.filter(area => area.score == null);
    const weak = [...scored.slice(0, 2)];
    while (weak.length < 2 && untested.length) weak.push(untested.shift());
    const used = new Set(weak.map(area => area.id));
    const strongest = [...scored].reverse().find(area => !used.has(area.id)) || untested.find(area => !used.has(area.id)) || areas.find(area => !used.has(area.id)) || areas[0];
    return { weak, maintenance: strongest };
  }

  function buildTopicStep(entry, role, ordinal, areaId = null, areaLabel = 'Área general') {
    if (!entry) entry = entries().find(item => item.exam?.questions?.length) || entries()[0];
    const question = entry?.exam?.questions?.[0] || null;
    return {
      id: `topic-${ordinal}`,
      type: 'topic', role, areaId, areaLabel,
      entryId: entry?.id || null, title: entry?.preferredName || 'Tema de repaso',
      question: question ? { prompt: question.prompt, requiredElements: question.requiredElements || [], modelAnswer: question.modelAnswer || '' } : null,
      technicalSeen: false, oralSeen: false, score: null, done: false
    };
  }

  function topicStep(area, role, ordinal) {
    let entry = area ? mastery()?.weakestEntry?.(area.id) : null;
    return buildTopicStep(entry, role, ordinal, area?.id || null, area?.label || 'Área general');
  }

  function spacedTopicStep(entry, ordinal) {
    const topic = spaced()?.getTopic?.(entry?.id);
    const dueText = topic?.nextDue ? new Date(topic.nextDue).toLocaleDateString('es-AR') : 'programado';
    return buildTopicStep(entry, 'Repaso espaciado', ordinal, 'retencion', `Retención programada · vencimiento ${dueText}`);
  }

  function challengeStep(weakAreas) {
    const weaknessOrder = (weakAreas || []).map(area => area.id);
    let challenge = CHALLENGES.find(item => item.areas.some(area => weaknessOrder.includes(area)));
    if (!challenge) challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    return { id: 'challenge-3d', type: '3d', ...challenge, done: false, score: null, selected: null };
  }

  function generateSession(force = false) {
    const active = state.steps?.length && !state.completedAt && state.steps.some(step => !step.done);
    if (active && !force) return;
    const { weak, maintenance } = pickAreas();
    const first = topicStep(weak[0], 'Tema débil prioritario', 1);
    const dueEntry = spaced()?.nextDueEntry?.() || null;
    const second = dueEntry && dueEntry.id !== first.entryId
      ? spacedTopicStep(dueEntry, 2)
      : topicStep(weak[1] || weak[0], 'Segundo tema débil', 2);
    let third = topicStep(maintenance, 'Mantenimiento', 3);
    if (third.entryId === first.entryId || third.entryId === second.entryId) {
      const alternative = entries().find(entry => entry.exam?.questions?.length && entry.id !== first.entryId && entry.id !== second.entryId);
      if (alternative) third = buildTopicStep(alternative, 'Mantenimiento', 3, null, 'Rotación de contenidos');
    }
    const steps = [first, second, third, challengeStep(weak)];
    state = { sessionId: (state.sessionId || 0) + 1, generatedAt: new Date().toISOString(), completedAt: null, steps };
    saveState();
    document.dispatchEvent(new CustomEvent('academic-session-v2:generated', { detail: { sessionId: state.sessionId, steps: steps.length, includesSpacedReview: second.role === 'Repaso espaciado' } }));
  }

  function setLayer(layer, desired) {
    const button = document.getElementById(LAYER_BUTTONS[layer]);
    if (!button) return;
    const active = button.getAttribute('aria-pressed') === 'true' || button.classList.contains('active');
    if (active !== desired) button.click();
  }
  function isolateLayers(layers = []) {
    Object.keys(LAYER_BUTTONS).forEach(layer => setLayer(layer, layers.includes(layer)));
  }

  function mount() {
    if ($('academicSessionPlanV2')) return $('academicSessionPlanV2');
    const section = document.createElement('section');
    section.id = 'academicSessionPlanV2'; section.className = 'academicSessionPlanV2';
    const masteryPanel = $('academicMasteryV2');
    const recovery = $('academicRecoveryV2');
    const route = $('academicStudyRoute');
    if (masteryPanel) masteryPanel.before(section);
    else if (recovery) recovery.before(section);
    else if (route) route.before(section);
    else document.querySelector('main')?.append(section);
    return section;
  }

  function scoreLabel(step) {
    if (step.score == null) return 'pendiente';
    return `${Math.round(step.score * 100)}%`;
  }

  function renderTopic(step, host) {
    const entry = entryById(step.entryId);
    const question = step.question;
    host.innerHTML = `<div class="academicSessionDetailHead"><div><span class="simEy">${escapeHTML(step.role)}</span><h4>${escapeHTML(step.title)}</h4><p>${escapeHTML(step.areaLabel)} · 3–4 min</p></div><span class="academicSessionScore ${step.done ? 'done' : ''}">${step.done ? '✓' : scoreLabel(step)}</span></div><div class="academicSessionMilestones"><span class="${step.technicalSeen ? 'ok' : ''}">📚 Técnico ${step.technicalSeen ? '✓' : ''}</span><span class="${step.oralSeen ? 'ok' : ''}">🎤 Oral ${step.oralSeen ? '✓' : ''}</span><span class="${step.done ? 'ok' : ''}">🧠 Microcheck ${step.score == null ? '' : Math.round(step.score * 100) + '%'}</span></div><div class="academicSessionActions"><button id="sessionTechnical" type="button">Abrir Técnico</button><button id="sessionOral" type="button">Entrenar Oral</button></div>${question ? `<div class="academicSessionCheck"><strong>Microcomprobación</strong><p>${escapeHTML(question.prompt)}</p><textarea id="sessionAnswer" rows="5" placeholder="Respondé sin mirar la respuesta modelo…"></textarea><button id="sessionCheck" type="button">Comprobar respuesta</button><div id="sessionFeedback"></div></div>` : '<p>Esta ficha todavía no tiene una pregunta específica para microcomprobación.</p>'}`;
    $('sessionTechnical')?.addEventListener('click', () => { step.technicalSeen = true; saveState(); window.AcademicV2?.open(step.entryId, { level: 'technical', scroll: true }); });
    $('sessionOral')?.addEventListener('click', () => { step.oralSeen = true; saveState(); window.AcademicV2?.open(step.entryId, { level: 'oral', scroll: true }); });
    $('sessionCheck')?.addEventListener('click', () => evaluateTopic(step, entry, question));
  }

  function evaluateTopic(step, entry, question) {
    const textarea = $('sessionAnswer');
    const feedback = $('sessionFeedback');
    const answer = textarea?.value?.trim() || '';
    if (answer.length < 18) {
      if (feedback) feedback.innerHTML = '<div class="academicSessionWarn">Desarrollá un poco más antes de comprobar.</div>';
      textarea?.focus(); return;
    }
    const required = question?.requiredElements || [];
    const normalizedAnswer = normalize(answer);
    const matched = required.filter(item => requirementMatched(item, normalizedAnswer));
    const missed = required.filter(item => !matched.includes(item));
    const score = required.length ? matched.length / required.length : 1;
    step.score = score;
    step.done = Boolean(step.technicalSeen && step.oralSeen && score >= TARGET);
    saveState(false);
    if (feedback) {
      feedback.innerHTML = `<div class="academicSessionFeedback ${score >= TARGET ? 'ok' : 'bad'}"><b>Cobertura estimada: ${Math.round(score * 100)}%</b>${missed.length ? `<p><strong>Falta reforzar:</strong> ${missed.map(escapeHTML).join(' · ')}</p>` : '<p>No quedaron elementos obligatorios sin detectar.</p>'}${question?.modelAnswer ? `<details><summary>Comparar con respuesta modelo</summary><p>${escapeHTML(question.modelAnswer)}</p></details>` : ''}${score >= TARGET && (!step.technicalSeen || !step.oralSeen) ? '<p>La cobertura alcanzó el objetivo, pero todavía falta completar Técnico y/o Oral.</p>' : ''}<button id="sessionContinue" type="button">Continuar sesión</button></div>`;
      $('sessionContinue')?.addEventListener('click', render);
    }
    document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Plan de sesión V2', target: entry?.preferredName || step.title, correct: step.done, score } }));
    checkCompletion(false);
  }

  function render3D(step, host) {
    host.innerHTML = `<div class="academicSessionDetailHead"><div><span class="simEy">Desafío 3D · 2–3 min</span><h4>${escapeHTML(step.target)}</h4><p>${escapeHTML(step.prompt)}</p></div><span class="academicSessionScore ${step.done ? 'done' : ''}">${step.done ? '✓' : scoreLabel(step)}</span></div><div class="academicSession3D"><p>Durante el desafío, la primera estructura anatómica válida que selecciones cuenta como respuesta.</p><button id="sessionStart3D" type="button">${active3DStep === step.id ? 'Desafío activo…' : 'Iniciar identificación 3D'}</button><button id="sessionReview3D" type="button">Repasar ficha antes</button><div id="session3DFeedback">${step.selected ? `Última selección: ${escapeHTML(step.selected)}` : ''}</div></div>`;
    $('sessionStart3D')?.addEventListener('click', () => {
      isolateLayers(step.layers || []); active3DStep = step.id; document.body.classList.add('academicSession3DActive');
      $('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); render();
    });
    $('sessionReview3D')?.addEventListener('click', () => window.AcademicV2?.open(step.entryId, { level: 'review', scroll: true }));
  }

  function answer3D(event) {
    if (!active3DStep) return;
    const step = state.steps.find(item => item.id === active3DStep);
    const key = event.detail?.key;
    if (!step || !key || key === 'craneo') return;
    const ok = (step.accepted || []).includes(key);
    step.selected = event.detail?.sourceName || key;
    step.score = ok ? 1 : 0;
    step.done = ok;
    active3DStep = null;
    document.body.classList.remove('academicSession3DActive');
    saveState();
    document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Plan de sesión V2 · 3D', target: step.target, correct: ok, score: ok ? 1 : 0 } }));
    setTimeout(() => $('academicSessionPlanV2')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    checkCompletion();
  }

  function checkCompletion(renderNow = true) {
    if (!state.steps.length || state.steps.some(step => !step.done)) return;
    if (!state.completedAt) {
      state.completedAt = new Date().toISOString();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
      document.dispatchEvent(new CustomEvent('academic-session-v2:completed', { detail: { sessionId: state.sessionId } }));
    }
    if (renderNow) render();
  }

  function render() {
    const host = mount();
    if (!host) return;
    if (!state.steps?.length) generateSession(false);
    if (!state.steps?.length) return;
    const done = state.steps.filter(step => step.done).length;
    const current = state.steps.find(step => !step.done) || state.steps[state.steps.length - 1];
    const generated = state.generatedAt ? new Date(state.generatedAt).toLocaleString('es-AR') : '—';
    const hasSpaced = state.steps.some(step => step.role === 'Repaso espaciado');
    const composition = hasSpaced ? 'una prioridad, un repaso espaciado, un mantenimiento y un desafío 3D' : 'dos prioridades, un mantenimiento y un desafío 3D';
    host.innerHTML = `<div class="academicSessionHead"><div><span class="simEy">Sesión adaptativa V2 · 10–15 minutos</span><h3>Plan automático de estudio</h3><p>Generado desde tu perfil de dominio y calendario de retención: ${composition}. Sesión #${state.sessionId} · ${escapeHTML(generated)}.</p></div><div class="academicSessionProgress"><b>${done}/4</b><span>${state.completedAt ? 'sesión completa' : 'pasos completos'}</span></div></div><div class="academicSessionTrack"><span style="width:${done / 4 * 100}%"></span></div><div class="academicSessionLayout"><div class="academicSessionList">${state.steps.map((step,index) => `<button type="button" data-session-step="${step.id}" class="${step.id === current.id ? 'active' : ''} ${step.done ? 'done' : ''}"><span><b>${index + 1}. ${escapeHTML(step.type === '3d' ? step.target : step.title)}</b><small>${escapeHTML(step.type === '3d' ? 'Identificación 3D' : step.role)}</small></span><em>${step.done ? '✓' : step.score == null ? 'pendiente' : Math.round(step.score * 100) + '%'}</em></button>`).join('')}</div><div id="academicSessionDetail" class="academicSessionDetail"></div></div><div class="academicSessionFooter"><span>${state.completedAt ? '✓ Sesión completada. El perfil de dominio y la programación de retención ya incorporaron estas evidencias.' : 'Completá los cuatro pasos para cerrar la sesión.'}</span><button id="sessionNew" type="button">${state.completedAt ? 'Generar nueva sesión' : 'Recalcular plan'}</button></div>`;
    host.querySelectorAll('[data-session-step]').forEach(button => button.addEventListener('click', () => { const step = state.steps.find(item => item.id === button.dataset.sessionStep); const detail = $('academicSessionDetail'); if (step?.type === '3d') render3D(step, detail); else if (step) renderTopic(step, detail); }));
    const detail = $('academicSessionDetail');
    if (current.type === '3d') render3D(current, detail); else renderTopic(current, detail);
    $('sessionNew')?.addEventListener('click', () => { active3DStep = null; document.body.classList.remove('academicSession3DActive'); generateSession(true); });
  }

  function boot() {
    if (booted) return;
    booted = true;
    generateSession(false); render();
    document.addEventListener('simulator:select', answer3D);
    document.addEventListener('academic-mastery-v2:updated', () => { if (state.completedAt) return; render(); });
    document.addEventListener('academic-spaced-v2:updated', () => { if (state.completedAt || state.steps?.some(step => step.done)) return; generateSession(true); });
    window.AcademicSessionPlanV2 = { get: () => state, regenerate: () => generateSession(true) };
  }

  document.addEventListener('academic-spaced-v2:ready', boot, { once: true });
  document.addEventListener('academic-mastery-v2:ready', () => { if (window.AcademicSpacedV2) boot(); }, { once: true });
  if (window.AcademicMasteryV2 && window.AcademicV2 && window.AcademicSpacedV2) boot();
})();
