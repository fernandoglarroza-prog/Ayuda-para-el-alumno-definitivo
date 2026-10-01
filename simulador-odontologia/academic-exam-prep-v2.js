(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_exam_prep_v2';
  const DAY = 24 * 60 * 60 * 1000;
  const AREA_COUNT = 9;
  let booted = false;
  let state = loadState();

  const $ = (id) => document.getElementById(id);
  const escapeHTML = (value = '') => value.toString().replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function emptyState() {
    return { version: 2, examDate: null, activatedAt: null, daily: {}, partialAnswers: {}, updatedAt: null };
  }
  function loadState() {
    try { return { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return emptyState(); }
  }
  function saveState() {
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    render();
  }

  function localDay(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  function dateKey(date = new Date()) {
    const d = localDay(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  function dateFromKey(key) {
    if (!key) return null;
    const [y,m,d] = key.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }
  function addDays(date, days) {
    const out = localDay(date);
    out.setDate(out.getDate() + Number(days || 0));
    return out;
  }
  function daysRemaining() {
    const exam = dateFromKey(state.examDate);
    if (!exam) return null;
    return Math.round((exam.getTime() - localDay().getTime()) / DAY);
  }

  function phaseFor(days) {
    if (days == null) return { key: 'inactive', label: 'Sin fecha', description: 'Definí cuántos días faltan para organizar el estudio.' };
    if (days < 0) return { key: 'expired', label: 'Fecha pasada', description: 'El parcial configurado ya pasó. Generá un plan nuevo.' };
    if (days === 0) return { key: 'exam', label: 'Día del parcial', description: 'Repaso breve de relaciones clave. Evitá abrir temas nuevos en esta etapa.' };
    if (days === 1) return { key: 'closing', label: 'Cierre', description: 'Consolidación: debilidades puntuales, retención y una revisión final sin sobrecarga.' };
    if (days <= 3) return { key: 'intensive', label: 'Intensivo', description: 'Prioridad alta a áreas débiles, repasos vencidos y simulacros frecuentes.' };
    if (days <= 7) return { key: 'consolidation', label: 'Consolidación', description: 'Alterna sesiones adaptativas, retención y simulacros cada pocos días.' };
    return { key: 'construction', label: 'Construcción', description: 'Cobertura progresiva del programa, fortalecimiento de debilidades y simulacros espaciados.' };
  }

  function masteryProfile() {
    return window.AcademicMasteryV2?.profile?.() || { areas: [], average: null, withEvidence: 0 };
  }
  function spacedApi() { return window.AcademicSpacedV2; }
  function sessionApi() { return window.AcademicSessionPlanV2; }

  function orderedAreas() {
    const areas = [...(masteryProfile().areas || [])];
    const weak = areas.filter(area => area.score != null).sort((a,b) => a.score - b.score || b.weight - a.weight);
    const unseen = areas.filter(area => area.score == null);
    const ordered = [];
    if (weak[0]) ordered.push(weak.shift());
    if (unseen[0]) ordered.push(unseen.shift());
    ordered.push(...weak, ...unseen);
    return ordered;
  }

  function partialRecommended(daysLeft, offset = 0) {
    if (daysLeft <= 0) return false;
    if (daysLeft === 1) return true;
    if (daysLeft <= 3) return true;
    if (daysLeft <= 7) return offset % 2 === 0 || daysLeft === 2;
    return offset % 3 === 0 || daysLeft === 7 || daysLeft === 3;
  }

  function buildCalendar() {
    const remaining = daysRemaining();
    if (remaining == null || remaining < 0) return [];
    const areas = orderedAreas();
    const total = Math.min(remaining + 1, 14);
    const rows = [];
    for (let offset = 0; offset < total; offset += 1) {
      const date = addDays(new Date(), offset);
      const left = Math.max(0, remaining - offset);
      const phase = phaseFor(left);
      const focusA = areas.length ? areas[offset % areas.length] : null;
      const focusB = areas.length > 1 ? areas[(offset + 1) % areas.length] : null;
      const dueCount = spacedApi()?.dueTopics?.({ limit: 99, includeUpcomingDays: offset === 0 ? 2 : 0 })?.length || 0;
      rows.push({
        key: dateKey(date), date, left, phase,
        focus: [focusA?.label, focusB?.label].filter(Boolean),
        partial: partialRecommended(left, offset),
        dueCount: offset === 0 ? dueCount : null
      });
    }
    return rows;
  }

  function todayRecord() {
    const key = dateKey();
    if (!state.daily[key]) state.daily[key] = { sessionDone: false, partialDone: false, reviewOpened: 0 };
    return state.daily[key];
  }

  function setDays(days) {
    const safe = Math.max(0, Math.min(120, Math.round(Number(days) || 0)));
    state.examDate = dateKey(addDays(new Date(), safe));
    state.activatedAt = new Date().toISOString();
    saveState();
  }

  function clearPlan() {
    state.examDate = null;
    state.activatedAt = null;
    saveState();
  }

  function startAdaptiveSession() {
    document.querySelector('.simMode[data-mode="estudiar"]')?.click();
    sessionApi()?.regenerate?.();
    setTimeout(() => $('academicSessionPlanV2')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
  }

  function openPriority(areaId) {
    const entry = window.AcademicMasteryV2?.weakestEntry?.(areaId);
    document.querySelector('.simMode[data-mode="estudiar"]')?.click();
    if (entry) window.AcademicV2?.open(entry.id, { level: 'technical', scroll: true });
  }

  function openDueReview() {
    const entry = spacedApi()?.nextDueEntry?.();
    if (!entry) return;
    const today = todayRecord();
    today.reviewOpened = (today.reviewOpened || 0) + 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    document.querySelector('.simMode[data-mode="estudiar"]')?.click();
    window.AcademicV2?.open(entry.id, { level: 'technical', scroll: true });
    render();
  }

  function openPartial() {
    document.querySelector('.examModeNav')?.click();
    setTimeout(() => $('academicPartialV2Panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }

  function noteSessionCompleted() {
    const today = todayRecord();
    today.sessionDone = true;
    saveState();
  }

  function notePartialQuestion(detail = {}) {
    if ((detail.mode || '') !== 'Parcial V2') return;
    const key = dateKey();
    const count = (state.partialAnswers[key] || 0) + 1;
    state.partialAnswers[key] = count;
    if (count % 16 === 0) todayRecord().partialDone = true;
    saveState();
  }

  function mount() {
    if ($('academicExamPrepV2')) return $('academicExamPrepV2');
    const section = document.createElement('section');
    section.id = 'academicExamPrepV2';
    section.className = 'academicExamPrepV2';
    const session = $('academicSessionPlanV2');
    const spaced = $('academicSpacedV2');
    const mastery = $('academicMasteryV2');
    if (session) session.before(section);
    else if (spaced) spaced.before(section);
    else if (mastery) mastery.before(section);
    else document.querySelector('main')?.append(section);
    return section;
  }

  function renderSetup(host) {
    host.innerHTML = `<div class="examPrepSetup"><div><span class="simEy">Preparar parcial V2</span><h3>Organizá el estudio según el tiempo que falta</h3><p>El plan usa tu perfil de dominio, repasos programados y Parcial V2. Por ahora toma como alcance todo el corpus académico del simulador.</p></div><div class="examPrepSetupForm"><label for="examPrepDays">¿Cuántos días faltan?</label><div><input id="examPrepDays" type="number" min="0" max="120" value="7" inputmode="numeric"><button id="examPrepActivate" type="button">Crear plan</button></div><small>Podés recalcularlo después si cambia la fecha.</small></div></div>`;
    $('examPrepActivate')?.addEventListener('click', () => setDays($('examPrepDays')?.value || 7));
  }

  function renderActive(host, remaining) {
    const phase = phaseFor(remaining);
    const profile = masteryProfile();
    const areas = orderedAreas();
    const today = todayRecord();
    const due = spacedApi()?.dueTopics?.({ limit: 5, includeUpcomingDays: 2 }) || [];
    const calendar = buildCalendar();
    const todayPlan = calendar[0];
    const priorityAreas = areas.slice(0, 2);
    const examDate = dateFromKey(state.examDate);
    const examDateLabel = examDate?.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: '2-digit' }) || state.examDate;
    const partialClass = todayPlan?.partial ? 'recommended' : 'optional';
    const coverage = `${profile.withEvidence || 0}/${AREA_COUNT}`;

    host.innerHTML = `<div class="examPrepHead"><div><span class="simEy">Preparar parcial V2 · ${escapeHTML(phase.label)}</span><h3>${remaining === 0 ? 'El parcial es hoy' : `Faltan ${remaining} día${remaining === 1 ? '' : 's'}`}</h3><p>${escapeHTML(phase.description)}</p><small>Fecha objetivo: ${escapeHTML(examDateLabel)} · plan local al dispositivo</small></div><div class="examPrepMetrics"><span><b>${profile.average == null ? '—' : profile.average + '%'}</b>dominio medio registrado</span><span><b>${coverage}</b>áreas con evidencia</span><span><b>${due.length}</b>repasos próximos</span></div></div>
      <div class="examPrepToday"><div class="examPrepTodayTitle"><div><h4>Plan de hoy</h4><p>${priorityAreas.length ? `Foco: ${priorityAreas.map(a => escapeHTML(a.label)).join(' · ')}` : 'Todavía falta evidencia para priorizar áreas.'}</p></div><button id="examPrepChange" type="button">Cambiar fecha</button></div><div class="examPrepActions">
        <article class="${today.sessionDone ? 'done' : ''}"><span>1</span><div><b>Sesión adaptativa</b><small>${today.sessionDone ? 'Completada hoy' : remaining <= 1 ? 'Repaso corto de prioridades y retención' : '10–15 min con prioridades + 3D'}</small></div><button id="examPrepSession" type="button">${today.sessionDone ? 'Hacer otra' : 'Iniciar'}</button></article>
        <article class="${due.length ? 'due' : ''}"><span>2</span><div><b>Retención</b><small>${due.length ? `${escapeHTML(due[0].title)} · ${due.length} próximo${due.length === 1 ? '' : 's'}` : 'No hay repasos vencidos o próximos'}</small></div><button id="examPrepReview" type="button" ${due.length ? '' : 'disabled'}>${due.length ? 'Repasar' : 'Al día'}</button></article>
        <article class="${partialClass} ${today.partialDone ? 'done' : ''}"><span>3</span><div><b>Parcial V2</b><small>${today.partialDone ? 'Simulacro completo realizado hoy' : todayPlan?.partial ? 'Recomendado hoy por la fase del plan' : 'Opcional hoy; mantené prioridad en estudio/retención'}</small></div><button id="examPrepPartial" type="button">${today.partialDone ? 'Repetir' : 'Abrir'}</button></article>
        <article><span>4</span><div><b>Foco técnico</b><small>${priorityAreas[0] ? escapeHTML(priorityAreas[0].label) : 'Explorar una unidad todavía no evaluada'}</small></div><button id="examPrepFocus" type="button" ${priorityAreas[0] ? '' : 'disabled'}>Ir al tema</button></article>
      </div></div>
      <div class="examPrepCalendar"><div class="examPrepCalendarHead"><div><h4>Hoja de ruta</h4><p>${remaining > 13 ? 'Se muestran los próximos 14 días; el plan se recalcula cada día.' : 'Se recalcula con tu progreso real al volver a entrar.'}</p></div></div><div class="examPrepDays">${calendar.map((row, index) => `<article class="${index === 0 ? 'today' : ''} ${row.phase.key}"><div><b>${index === 0 ? 'Hoy' : row.date.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</b><span>${escapeHTML(row.phase.label)}</span></div><p>${row.focus.length ? row.focus.map(escapeHTML).join(' · ') : 'Cobertura general'}</p><small>${row.partial ? '📝 Parcial V2' : '📚 Sesión + retención'}${row.left === 0 ? ' · 🎯 examen' : ''}</small></article>`).join('')}</div></div>
      <p class="examPrepNote">Este plan prioriza todo el programa cargado en el simulador y usa el rendimiento registrado como guía. No representa una predicción de aprobación ni reemplaza el cronograma de la cátedra.</p>`;

    $('examPrepChange')?.addEventListener('click', () => clearPlan());
    $('examPrepSession')?.addEventListener('click', startAdaptiveSession);
    $('examPrepReview')?.addEventListener('click', openDueReview);
    $('examPrepPartial')?.addEventListener('click', openPartial);
    $('examPrepFocus')?.addEventListener('click', () => priorityAreas[0] && openPriority(priorityAreas[0].id));
  }

  function render() {
    const host = mount();
    if (!host) return;
    const remaining = daysRemaining();
    if (!state.examDate || remaining == null || remaining < 0) renderSetup(host);
    else renderActive(host, remaining);
  }

  function boot() {
    if (booted) return;
    booted = true;
    render();
    document.addEventListener('academic-session-v2:completed', noteSessionCompleted);
    document.addEventListener('simulator:practice-result', event => notePartialQuestion(event.detail || {}));
    document.addEventListener('academic-mastery-v2:updated', render);
    document.addEventListener('academic-spaced-v2:updated', render);
    window.AcademicExamPrepV2 = { get: () => ({ ...state, daysRemaining: daysRemaining(), phase: phaseFor(daysRemaining()) }), setDays, clear: clearPlan, render };
  }

  document.addEventListener('academic-spaced-v2:ready', () => {
    if (window.AcademicSessionPlanV2) boot();
    else document.addEventListener('academic-session-v2:ready', boot, { once: true });
  }, { once: true });
  if (window.AcademicSpacedV2 && window.AcademicSessionPlanV2) boot();
})();
