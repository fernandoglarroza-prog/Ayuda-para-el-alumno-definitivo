(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_mastery_v2';
  const LEGACY_PROGRESS_KEY = 'ayuda_sim_odontologia_progress_v1';
  const MAX_EVIDENCE = 500;

  const AREAS = [
    { id: 'osteologia', label: 'Osteología', patterns: ['osteologia', 'base craneal', 'hueso'] },
    { id: 'artrologia', label: 'Artrología / ATM', patterns: ['artrologia', 'atm', 'articulacion temporomandibular'] },
    { id: 'miologia', label: 'Miología', patterns: ['miologia', 'masticacion', 'musculo'] },
    { id: 'angiologia', label: 'Angiología y linfáticos', patterns: ['angiologia', 'linfatic', 'vascular', 'arteria', 'vena'] },
    { id: 'neurologia', label: 'Neurología', patterns: ['neurologia', 'trigemino', 'nervio'] },
    { id: 'topografia', label: 'Topografía y cavidad oral', patterns: ['topografia', 'cavidad bucal', 'cavidad oral', 'salivar', 'paladar', 'lengua'] },
    { id: 'estesiologia', label: 'Estesiología', patterns: ['estesiologia', 'gusto', 'olfato', 'vision', 'audicion', 'ganglio parasimpatico'] },
    { id: 'dentaria', label: 'Anatomía dentaria y oclusión', patterns: ['anatomia dentaria', 'denticion', 'oclusion', 'alveolodent', 'diente', 'molar', 'premolar', 'incisivo', 'canino'] },
    { id: 'radiologia', label: 'Radiología anatómica', patterns: ['radiograf', 'radiologia', 'cbct', 'panoramica', 'correlacion didactica radiografica'] }
  ];

  const FALLBACK_TARGET_AREAS = {
    mandibula: ['osteologia'], maxilar: ['osteologia'], esfenoides: ['osteologia'], temporal: ['osteologia','artrologia'], cigomatico: ['osteologia'],
    v2: ['neurologia','topografia'], v3: ['neurologia','topografia'], ian: ['neurologia','topografia'], infraorbital: ['neurologia'],
    maxillary_artery: ['angiologia'], arteria_maxilar: ['angiologia'], disco_articular_atm: ['artrologia'], atm: ['artrologia'],
    masetero: ['miologia'], pterigoideo_lateral: ['miologia','artrologia'], region_pterigomandibular: ['topografia'],
    conducto_mandibular: ['radiologia','topografia'], seno_maxilar: ['radiologia','topografia']
  };

  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const nowISO = () => new Date().toISOString();
  let state = loadState();
  let entries = [];
  let aliasIndex = new Map();

  function emptyState() {
    return { version: 2, evidence: [], seededLegacy: false, updatedAt: null };
  }
  function loadState() {
    try { return { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch { return emptyState(); }
  }
  function saveState() {
    state.updatedAt = nowISO();
    state.evidence = (state.evidence || []).slice(-MAX_EVIDENCE);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    render();
    document.dispatchEvent(new CustomEvent('academic-mastery-v2:updated', { detail: profile() }));
  }

  function rebuildIndex() {
    entries = window.AcademicV2?.entries?.() || [];
    aliasIndex = new Map();
    entries.forEach(entry => {
      const terms = [entry.id, entry.modelKey, entry.preferredName, entry.terminology?.preferred, ...(entry.terminology?.synonyms || []), ...(entry.terminology?.classicTerms || [])].filter(Boolean);
      terms.forEach(term => aliasIndex.set(normalize(term), entry));
    });
  }

  function resolveEntry(target) {
    if (!target) return null;
    const norm = normalize(target);
    if (aliasIndex.has(norm)) return aliasIndex.get(norm);
    return entries.find(entry => normalize(entry.preferredName).includes(norm) || norm.includes(normalize(entry.preferredName))) || null;
  }

  function areasForEntry(entry) {
    if (!entry) return [];
    const text = normalize([entry.category, entry.preferredName, ...(entry.paUnits || [])].join(' '));
    const ids = AREAS.filter(area => area.patterns.some(pattern => text.includes(normalize(pattern)))).map(area => area.id);
    if (entry.category === 'radiology' && !ids.includes('radiologia')) ids.push('radiologia');
    return [...new Set(ids)];
  }

  function resolveAreas(target, entry = resolveEntry(target)) {
    const fromEntry = areasForEntry(entry);
    if (fromEntry.length) return fromEntry;
    const norm = normalize(target).replace(/ /g, '_');
    for (const [key, areas] of Object.entries(FALLBACK_TARGET_AREAS)) {
      if (norm === key || norm.includes(key) || key.includes(norm)) return areas;
    }
    return [];
  }

  function modeWeight(mode = '') {
    const text = normalize(mode);
    if (text.includes('parcial v2')) return 3;
    if (text.includes('recuperacion v2')) return 2.5;
    if (text.includes('ruta academica')) return 1.75;
    if (text.includes('parcial')) return 1.5;
    if (text.includes('cbct') || text.includes('panoramica')) return 1.25;
    return 1;
  }

  function record(detail = {}) {
    if (!detail.target) return false;
    rebuildIndex();
    const entry = resolveEntry(detail.target);
    const areas = resolveAreas(detail.target, entry);
    if (!areas.length) return false;
    const numericScore = Number(detail.score);
    const score = Number.isFinite(numericScore) ? Math.max(0, Math.min(1, numericScore)) : (detail.correct === true ? 1 : detail.correct === false ? 0 : null);
    if (score == null) return false;
    state.evidence.push({
      at: nowISO(), target: detail.target, entryId: entry?.id || null, areas, score,
      mode: detail.mode || 'Práctica', weight: modeWeight(detail.mode)
    });
    saveState();
    return true;
  }

  function seedLegacyProgress() {
    if (state.seededLegacy) return;
    rebuildIndex();
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_PROGRESS_KEY) || '{}');
      Object.entries(legacy.byTarget || {}).forEach(([target, value]) => {
        const attempts = Number(value?.attempts) || 0;
        const correct = Number(value?.correct) || 0;
        if (!attempts) return;
        const entry = resolveEntry(target);
        const areas = resolveAreas(target, entry);
        if (!areas.length) return;
        state.evidence.push({
          at: legacy.updatedAt || nowISO(), target, entryId: entry?.id || null, areas,
          score: Math.max(0, Math.min(1, correct / attempts)), mode: 'Historial previo', weight: Math.min(3, Math.max(1, attempts * 0.5))
        });
      });
    } catch {}
    state.seededLegacy = true;
    saveState();
  }

  function evidenceForArea(areaId) {
    return (state.evidence || []).filter(item => item.areas?.includes(areaId)).slice(-30);
  }
  function weightedAverage(items) {
    const total = items.reduce((sum, item) => sum + (Number(item.weight) || 1), 0);
    if (!total) return null;
    return items.reduce((sum, item) => sum + item.score * (Number(item.weight) || 1), 0) / total;
  }
  function trendFor(items) {
    if (items.length < 4) return { key: 'insufficient', label: 'sin tendencia aún' };
    const recent = weightedAverage(items.slice(-3));
    const previous = weightedAverage(items.slice(-6, -3));
    if (recent == null || previous == null) return { key: 'insufficient', label: 'sin tendencia aún' };
    const diff = recent - previous;
    if (diff >= 0.10) return { key: 'up', label: '↑ mejorando' };
    if (diff <= -0.10) return { key: 'down', label: '↓ bajando' };
    return { key: 'flat', label: '→ estable' };
  }
  function statusFor(score, weight) {
    if (score == null || weight < 1) return { key: 'none', label: 'Sin evidencia' };
    if (weight < 4) return { key: 'early', label: 'Evidencia inicial' };
    if (score >= 0.80) return { key: 'solid', label: 'Sólido' };
    if (score >= 0.65) return { key: 'developing', label: 'En desarrollo' };
    return { key: 'priority', label: 'Prioridad de repaso' };
  }

  function areaProfile(area) {
    const items = evidenceForArea(area.id);
    const weight = items.reduce((sum, item) => sum + (Number(item.weight) || 1), 0);
    const score = weightedAverage(items);
    return { ...area, score, percent: score == null ? null : Math.round(score * 100), evidence: items.length, weight, trend: trendFor(items), status: statusFor(score, weight) };
  }
  function profile() {
    const areas = AREAS.map(areaProfile);
    const withEvidence = areas.filter(area => area.score != null);
    const average = withEvidence.length ? Math.round(withEvidence.reduce((sum, area) => sum + area.score, 0) / withEvidence.length * 100) : null;
    const weakest = [...withEvidence].sort((a,b) => a.score - b.score || b.weight - a.weight)[0] || null;
    return { areas, average, withEvidence: withEvidence.length, weakest, updatedAt: state.updatedAt };
  }

  function entryWeight(entry) {
    const ids = areasForEntry(entry);
    if (!ids.length) return 1;
    const values = ids.map(id => areaProfile(AREAS.find(area => area.id === id))).filter(Boolean);
    if (!values.length) return 1;
    return values.reduce((sum, area) => {
      if (area.score == null) return sum + 1.35;
      const weakness = 1 + (1 - area.score) * 1.8;
      const uncertainty = area.weight < 4 ? 0.25 : 0;
      return sum + weakness + uncertainty;
    }, 0) / values.length;
  }

  function weightedPick(pool, count) {
    const remaining = [...pool];
    const chosen = [];
    while (remaining.length && chosen.length < count) {
      const weights = remaining.map(entry => Math.max(0.15, entryWeight(entry)));
      const total = weights.reduce((a,b) => a + b, 0);
      let cursor = Math.random() * total;
      let index = 0;
      for (; index < remaining.length; index += 1) {
        cursor -= weights[index];
        if (cursor <= 0) break;
      }
      chosen.push(remaining.splice(Math.min(index, remaining.length - 1), 1)[0]);
    }
    return chosen;
  }

  function weakestEntry(areaId) {
    const candidates = entries.filter(entry => areasForEntry(entry).includes(areaId));
    if (!candidates.length) return null;
    const targetScores = new Map();
    (state.evidence || []).filter(item => item.areas?.includes(areaId)).forEach(item => {
      const key = item.entryId;
      if (!key) return;
      const list = targetScores.get(key) || [];
      list.push(item); targetScores.set(key, list);
    });
    return [...candidates].sort((a,b) => {
      const av = weightedAverage(targetScores.get(a.id) || []);
      const bv = weightedAverage(targetScores.get(b.id) || []);
      if (av == null && bv == null) return 0;
      if (av == null) return -1;
      if (bv == null) return 1;
      return av - bv;
    })[0];
  }

  function mount() {
    if (document.getElementById('academicMasteryV2')) return document.getElementById('academicMasteryV2');
    const section = document.createElement('section');
    section.id = 'academicMasteryV2'; section.className = 'academicMasteryV2';
    const recovery = document.getElementById('academicRecoveryV2');
    const route = document.getElementById('academicStudyRoute');
    const progress = document.getElementById('progressDashboard');
    if (recovery) recovery.before(section);
    else if (route) route.before(section);
    else if (progress) progress.after(section);
    else document.querySelector('main')?.append(section);
    return section;
  }

  function render() {
    const host = mount();
    if (!host) return;
    rebuildIndex();
    const data = profile();
    const weakestLabel = data.weakest?.label || 'todavía sin datos';
    host.innerHTML = `<div class="academicMasteryHead"><div><span class="simEy">Perfil de dominio V2 · local</span><h3>Mapa de dominio por unidad</h3><p>Resume evidencia de parciales, recuperación y prácticas. No es una nota oficial: sirve para decidir qué conviene volver a estudiar y qué preguntarte con mayor frecuencia.</p></div><div class="academicMasterySummary"><span><b>${data.average == null ? '—' : data.average + '%'}</b>promedio ponderado</span><span><b>${data.withEvidence}/${AREAS.length}</b>áreas con evidencia</span><span><b>${escapeHTML(weakestLabel)}</b>prioridad actual</span></div></div><div class="academicMasteryGrid">${data.areas.map(area => `<article class="academicMasteryCard ${area.status.key}"><div class="academicMasteryCardTop"><div><h4>${escapeHTML(area.label)}</h4><span>${escapeHTML(area.status.label)} · ${escapeHTML(area.trend.label)}</span></div><b>${area.percent == null ? '—' : area.percent + '%'}</b></div><div class="academicMasteryBar"><span style="width:${area.percent ?? 0}%"></span></div><div class="academicMasteryMeta"><span>${area.evidence} evidencia${area.evidence === 1 ? '' : 's'}</span><span>peso ${area.weight.toFixed(1)}</span></div><button type="button" data-mastery-area="${area.id}">${area.score == null ? 'Explorar esta unidad' : 'Reforzar esta unidad'}</button></article>`).join('')}</div><p class="academicMasteryNote">Privacidad: el perfil se guarda únicamente en este navegador. Las áreas con poca evidencia no se interpretan como dominio bajo; el sistema las explora gradualmente antes de priorizarlas.</p>`;
    host.querySelectorAll('[data-mastery-area]').forEach(button => button.addEventListener('click', () => {
      const areaId = button.dataset.masteryArea;
      const entry = weakestEntry(areaId);
      document.querySelector('.simMode[data-mode="estudiar"]')?.click();
      if (entry) window.AcademicV2?.open(entry.id, { level: 'technical', scroll: true });
      else document.getElementById('academicStudyRoute')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  function escapeHTML(value = '') {
    return value.toString().replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }

  function boot() {
    rebuildIndex();
    seedLegacyProgress();
    render();
    document.addEventListener('simulator:practice-result', event => record(event.detail || {}));
    document.addEventListener('academic-recovery-v2:generated', render);
    document.addEventListener('simulator:progress-updated', render);
    window.AcademicMasteryV2 = {
      profile,
      entryWeight,
      weightedPick,
      record,
      weakestEntry,
      reset() { state = emptyState(); saveState(); seedLegacyProgress(); },
      areas: () => AREAS.map(area => ({ id: area.id, label: area.label }))
    };
    document.dispatchEvent(new CustomEvent('academic-mastery-v2:ready', { detail: profile() }));
  }

  document.addEventListener('academic-v2:ready', () => { rebuildIndex(); render(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
