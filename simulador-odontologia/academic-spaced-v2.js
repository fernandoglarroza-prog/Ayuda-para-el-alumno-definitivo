(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_spaced_v2';
  const SESSION_KEY = 'ayuda_sim_odontologia_session_plan_v2';
  const MAX_HISTORY = 30;
  const DAY = 24 * 60 * 60 * 1000;
  let booted = false;
  let state = loadState();
  let aliasIndex = new Map();

  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const escapeHTML = (value = '') => value.toString().replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const now = () => Date.now();
  const toISO = (ms) => new Date(ms).toISOString();

  function emptyState() { return { version: 2, topics: {}, sessions: [], updatedAt: null }; }
  function loadState() {
    try { return { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return emptyState(); }
  }
  function saveState(renderNow = true) {
    state.updatedAt = new Date().toISOString();
    state.sessions = (state.sessions || []).slice(0, MAX_HISTORY);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    if (renderNow) render();
    document.dispatchEvent(new CustomEvent('academic-spaced-v2:updated', { detail: summary() }));
  }

  function entries() { return window.AcademicV2?.entries?.() || []; }
  function rebuildIndex() {
    aliasIndex = new Map();
    entries().forEach(entry => {
      const terms = [entry.id, entry.modelKey, entry.preferredName, entry.terminology?.preferred, ...(entry.terminology?.synonyms || []), ...(entry.terminology?.classicTerms || [])].filter(Boolean);
      terms.forEach(term => aliasIndex.set(normalize(term), entry));
    });
  }
  function resolveEntry(target) {
    if (!target) return null;
    const key = normalize(target);
    if (aliasIndex.has(key)) return aliasIndex.get(key);
    return entries().find(entry => normalize(entry.preferredName).includes(key) || key.includes(normalize(entry.preferredName))) || null;
  }

  function scheduleFor(topic, score) {
    const currentStage = Number(topic.stage) || 0;
    if (score < 0.50) return { stage: 0, days: 1, lapse: true };
    if (score < 0.70) return { stage: Math.max(0, currentStage - 1), days: 1, lapse: true };
    if (score < 0.85) {
      const moderate = [2, 4, 7, 14, 30, 45];
      const stage = Math.min(currentStage + 1, moderate.length - 1);
      return { stage, days: moderate[Math.max(0, stage - 1)] || 2, lapse: false };
    }
    const strong = [3, 7, 14, 30, 60, 90];
    const stage = Math.min(currentStage + 1, strong.length);
    return { stage, days: strong[Math.min(stage - 1, strong.length - 1)] || 3, lapse: false };
  }

  function recordPractice(detail = {}) {
    if (!detail.target) return false;
    const allowed = ['parcial v2', 'recuperacion v2', 'plan de sesion v2', 'ruta academica'];
    const mode = normalize(detail.mode || '');
    if (!allowed.some(value => mode.includes(value))) return false;
    const scoreRaw = Number(detail.score);
    const score = Number.isFinite(scoreRaw) ? Math.max(0, Math.min(1, scoreRaw)) : (detail.correct === true ? 1 : detail.correct === false ? 0 : null);
    if (score == null) return false;
    rebuildIndex();
    const entry = resolveEntry(detail.target);
    if (!entry) return false;
    const existing = state.topics[entry.id] || { entryId: entry.id, title: entry.preferredName, stage: 0, repetitions: 0, lapses: 0, history: [] };
    const schedule = scheduleFor(existing, score);
    const reviewedAt = now();
    const nextDue = reviewedAt + schedule.days * DAY;
    const updated = {
      ...existing,
      title: entry.preferredName,
      stage: schedule.stage,
      repetitions: (existing.repetitions || 0) + 1,
      lapses: (existing.lapses || 0) + (schedule.lapse ? 1 : 0),
      lastScore: score,
      lastMode: detail.mode || 'Práctica',
      lastReviewedAt: toISO(reviewedAt),
      intervalDays: schedule.days,
      nextDue: toISO(nextDue),
      history: [{ at: toISO(reviewedAt), score, mode: detail.mode || 'Práctica', intervalDays: schedule.days }, ...(existing.history || [])].slice(0, 8)
    };
    state.topics[entry.id] = updated;
    saveState();
    return true;
  }

  function dueTopics({ limit = 6, includeUpcomingDays = 2 } = {}) {
    const cutoff = now() + includeUpcomingDays * DAY;
    return Object.values(state.topics || {})
      .filter(topic => topic.nextDue && new Date(topic.nextDue).getTime() <= cutoff)
      .sort((a,b) => {
        const ad = new Date(a.nextDue).getTime(), bd = new Date(b.nextDue).getTime();
        if (ad !== bd) return ad - bd;
        return (a.lastScore ?? 1) - (b.lastScore ?? 1);
      })
      .slice(0, limit);
  }

  function nextDueEntry() {
    const topic = dueTopics({ limit: 1, includeUpcomingDays: 2 })[0];
    if (!topic) return null;
    return entries().find(entry => entry.id === topic.entryId) || null;
  }

  function captureSession() {
    let session;
    try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}'); } catch { return; }
    if (!session?.sessionId || !session?.completedAt || !Array.isArray(session.steps)) return;
    if ((state.sessions || []).some(item => item.sessionId === session.sessionId && item.completedAt === session.completedAt)) return;
    const scores = session.steps.map(step => Number(step.score)).filter(Number.isFinite);
    const average = scores.length ? Math.round(scores.reduce((a,b) => a + b, 0) / scores.length * 100) : null;
    state.sessions = [{
      sessionId: session.sessionId,
      generatedAt: session.generatedAt || null,
      completedAt: session.completedAt,
      average,
      steps: session.steps.map(step => ({ type: step.type, title: step.type === '3d' ? step.target : step.title, area: step.areaLabel || null, score: Number.isFinite(Number(step.score)) ? Number(step.score) : null }))
    }, ...(state.sessions || [])].slice(0, MAX_HISTORY);
    saveState();
  }

  function dateLabel(iso) {
    if (!iso) return '—';
    const target = new Date(iso).getTime();
    const days = Math.ceil((target - now()) / DAY);
    if (days < 0) return `vencido hace ${Math.abs(days)} d`;
    if (days === 0) return 'hoy';
    if (days === 1) return 'mañana';
    return `en ${days} días`;
  }

  function summary() {
    const topics = Object.values(state.topics || {});
    const due = dueTopics({ limit: 99, includeUpcomingDays: 0 });
    const upcoming = dueTopics({ limit: 99, includeUpcomingDays: 7 }).filter(topic => new Date(topic.nextDue).getTime() > now());
    return { topics: topics.length, due: due.length, upcoming: upcoming.length, sessions: (state.sessions || []).length, updatedAt: state.updatedAt };
  }

  function mount() {
    if (document.getElementById('academicSpacedV2')) return document.getElementById('academicSpacedV2');
    const section = document.createElement('section');
    section.id = 'academicSpacedV2';
    section.className = 'academicSpacedV2';
    const session = document.getElementById('academicSessionPlanV2');
    const mastery = document.getElementById('academicMasteryV2');
    if (session) session.after(section);
    else if (mastery) mastery.before(section);
    else document.querySelector('main')?.append(section);
    return section;
  }

  function render() {
    const host = mount();
    if (!host) return;
    const due = dueTopics({ limit: 5, includeUpcomingDays: 2 });
    const sessions = (state.sessions || []).slice(0, 5);
    host.innerHTML = `<div class="academicSpacedHead"><div><span class="simEy">Retención V2 · repetición espaciada</span><h3>Qué conviene volver a comprobar</h3><p>Los intervalos crecen cuando sostenés el rendimiento y se acortan cuando un tema vuelve a fallar. Es una guía de estudio local, no una calificación.</p></div><div class="academicSpacedStats"><span><b>${Object.keys(state.topics || {}).length}</b>temas programados</span><span><b>${due.filter(t => new Date(t.nextDue).getTime() <= now()).length}</b>vencidos hoy</span><span><b>${sessions.length}</b>sesiones recientes</span></div></div><div class="academicSpacedLayout"><div><h4>Próximos repasos</h4><div class="academicSpacedDue">${due.length ? due.map(topic => `<article><div><b>${escapeHTML(topic.title)}</b><small>Último ${Math.round((topic.lastScore || 0) * 100)}% · intervalo ${topic.intervalDays || 0} d · ${escapeHTML(dateLabel(topic.nextDue))}</small></div><button type="button" data-spaced-entry="${escapeHTML(topic.entryId)}">Repasar</button></article>`).join('') : '<p class="academicSpacedEmpty">Todavía no hay repasos vencidos o próximos. Completá prácticas, recuperación o sesiones para empezar a programarlos.</p>'}</div></div><div><h4>Historial de sesiones</h4><div class="academicSpacedHistory">${sessions.length ? sessions.map(item => `<article><div><b>Sesión #${item.sessionId}</b><small>${new Date(item.completedAt).toLocaleString('es-AR')}</small></div><span>${item.average == null ? '—' : item.average + '%'}</span></article>`).join('') : '<p class="academicSpacedEmpty">Todavía no completaste una sesión adaptativa.</p>'}</div></div></div><p class="academicSpacedNote">Privacidad: historial e intervalos se guardan solo en este navegador. La programación es una heurística educativa simple basada en desempeño reciente.</p>`;
    host.querySelectorAll('[data-spaced-entry]').forEach(button => button.addEventListener('click', () => {
      document.querySelector('.simMode[data-mode="estudiar"]')?.click();
      window.AcademicV2?.open(button.dataset.spacedEntry, { level: 'technical', scroll: true });
    }));
  }

  function boot() {
    if (booted) return;
    booted = true;
    rebuildIndex();
    captureSession();
    render();
    document.addEventListener('simulator:practice-result', event => recordPractice(event.detail || {}));
    document.addEventListener('academic-session-v2:completed', () => { captureSession(); render(); });
    document.addEventListener('academic-v2:ready', () => { rebuildIndex(); render(); });
    window.AcademicSpacedV2 = { dueTopics, nextDueEntry, summary, recordPractice, sessions: () => [...(state.sessions || [])], getTopic: id => state.topics[id] || null };
    document.dispatchEvent(new CustomEvent('academic-spaced-v2:ready', { detail: summary() }));
  }

  document.addEventListener('academic-mastery-v2:ready', boot, { once: true });
  if (window.AcademicMasteryV2 && window.AcademicV2) boot();
})();
