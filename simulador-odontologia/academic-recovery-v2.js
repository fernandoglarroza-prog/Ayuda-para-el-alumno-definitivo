(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_recovery_v2';
  const PARTIAL_QUESTION_COUNT = 16;
  const TARGET = 0.70;
  const STOP = new Set(['de','del','la','las','el','los','y','e','o','u','en','por','para','con','sin','un','una','unos','unas','al','a','que','se','su','sus','como','entre']);
  const RECOGNITION_TO_ENTRY = {
    'Mandíbula': 'mandibula',
    'Foramen oval': 'v3',
    'V3': 'v3',
    'Nervio alveolar inferior': 'v3',
    'V2': 'v2',
    'Nervio infraorbitario': 'v2',
    'Arteria maxilar': 'arteria_maxilar',
    'Disco articular de la ATM': 'atm',
    'Masetero': 'masticacion_integrada',
    'Pterigoideo lateral': 'pterigoideo_lateral',
    'Foramen mandibular': 'region_pterigomandibular'
  };

  let partialSession = [];
  let state = loadState();
  let currentId = null;

  const $ = (id) => document.getElementById(id);
  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const significantTokens = (value) => normalize(value).split(' ').filter(token => token.length > 2 && !STOP.has(token));
  const escapeHTML = (value = '') => value.toString().replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function loadState() {
    try {
      return { generatedAt: null, partialScore: null, items: [], ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return { generatedAt: null, partialScore: null, items: [] };
    }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
  function entries() { return window.AcademicV2?.entries?.() || []; }
  function entryById(id) { return entries().find(entry => entry.id === id || entry.modelKey === id); }
  function entryIdForTarget(target) {
    const exact = entries().find(entry => entry.preferredName === target);
    return exact?.id || RECOGNITION_TO_ENTRY[target] || null;
  }
  function requirementMatched(requirement, answerNormalized) {
    const normalizedRequirement = normalize(requirement);
    if (!normalizedRequirement) return false;
    if (answerNormalized.includes(normalizedRequirement)) return true;
    const tokens = significantTokens(requirement);
    if (!tokens.length) return false;
    const hits = tokens.filter(token => answerNormalized.includes(token)).length;
    return hits >= (tokens.length === 1 ? 1 : Math.ceil(tokens.length * 0.65));
  }

  function buildQueueFromPartial() {
    if (partialSession.length < PARTIAL_QUESTION_COUNT) return;
    const score = Math.round(partialSession.reduce((sum, item) => sum + item.score, 0) / PARTIAL_QUESTION_COUNT * 100);
    const weakMap = new Map();
    partialSession.filter(item => item.score < TARGET).forEach(item => {
      const entryId = entryIdForTarget(item.target);
      if (!entryId) return;
      const existing = weakMap.get(entryId);
      if (!existing || item.score < existing.score) weakMap.set(entryId, { entryId, target: item.target, score: item.score, category: item.category || 'Parcial V2' });
    });
    const previous = new Map((state.items || []).map(item => [item.entryId, item]));
    state = {
      generatedAt: new Date().toISOString(),
      partialScore: score,
      items: [...weakMap.values()].sort((a,b) => a.score - b.score).map(item => {
        const old = previous.get(item.entryId) || {};
        return {
          ...item,
          technicalSeen: false,
          oralSeen: false,
          retestScore: null,
          recovered: false,
          attempts: old.attempts || 0,
          previousRecovered: Boolean(old.recovered)
        };
      })
    };
    saveState();
    partialSession = [];
    currentId = state.items[0]?.entryId || null;
    render();
    document.dispatchEvent(new CustomEvent('academic-recovery-v2:generated', { detail: { items: state.items.length, partialScore: score } }));
  }

  function mount() {
    if ($('academicRecoveryV2')) return $('academicRecoveryV2');
    const section = document.createElement('section');
    section.id = 'academicRecoveryV2';
    section.className = 'academicRecoveryV2';
    const route = $('academicStudyRoute');
    if (route) route.before(section);
    else $('studyGuide')?.after(section);
    return section;
  }

  function statusText(item) {
    const bits = [];
    bits.push(item.technicalSeen ? 'Técnico ✓' : 'Técnico pendiente');
    bits.push(item.oralSeen ? 'Oral ✓' : 'Oral pendiente');
    bits.push(item.retestScore == null ? 'Microevaluación pendiente' : `Microevaluación ${Math.round(item.retestScore * 100)}%`);
    return bits.join(' · ');
  }

  function renderList(host) {
    const unresolved = state.items.filter(item => !item.recovered);
    host.innerHTML = state.items.map((item, index) => {
      const entry = entryById(item.entryId);
      const name = entry?.preferredName || item.target || item.entryId;
      return `<button type="button" class="academicRecoveryItem ${item.entryId === currentId ? 'active' : ''} ${item.recovered ? 'recovered' : ''}" data-recovery-id="${escapeHTML(item.entryId)}"><span><b>${index + 1}. ${escapeHTML(name)}</b><small>${escapeHTML(item.category)} · parcial ${Math.round(item.score * 100)}%</small></span><em>${item.recovered ? '✓ recuperado' : 'reforzar'}</em></button>`;
    }).join('');
    host.querySelectorAll('[data-recovery-id]').forEach(button => button.addEventListener('click', () => { currentId = button.dataset.recoveryId; render(); }));
    return unresolved.length;
  }

  function microQuestion(entry) {
    return entry?.exam?.questions?.[0] || null;
  }

  function renderDetail(host, item) {
    const entry = entryById(item.entryId);
    if (!entry) {
      host.innerHTML = '<div class="academicRecoveryEmpty">La ficha asociada ya no está disponible en el corpus actual.</div>';
      return;
    }
    const question = microQuestion(entry);
    host.innerHTML = `<div class="academicRecoveryDetailHead"><div><span class="simEy">Recuperación personalizada</span><h4>${escapeHTML(entry.preferredName)}</h4><p>Resultado que originó el refuerzo: ${Math.round(item.score * 100)}%. No se considera recuperado solo por leer la ficha.</p></div><span class="academicRecoveryScore">${item.recovered ? '✓ recuperado' : `${Math.round(item.score * 100)}%`}</span></div><div class="academicRecoveryMilestones"><span class="${item.technicalSeen ? 'ok' : ''}">📚 Técnico ${item.technicalSeen ? '✓' : ''}</span><span class="${item.oralSeen ? 'ok' : ''}">🎤 Oral ${item.oralSeen ? '✓' : ''}</span><span class="${item.recovered ? 'ok' : ''}">🧠 Microevaluación ${item.retestScore == null ? '' : Math.round(item.retestScore * 100) + '%'}</span></div><div class="academicRecoveryActions"><button id="academicRecoveryTechnical" type="button">${item.technicalSeen ? '✓ ' : ''}Abrir Técnico</button><button id="academicRecoveryOral" type="button">${item.oralSeen ? '✓ ' : ''}Entrenar Oral</button><button id="academicRecovery3D" type="button">Ver relación 3D</button></div>${question ? `<div class="academicRecoveryRetest"><strong>Microevaluación de recuperación</strong><p>${escapeHTML(question.prompt)}</p><textarea id="academicRecoveryAnswer" rows="6" placeholder="Respondé nuevamente sin mirar la respuesta modelo…"></textarea><button id="academicRecoverySubmit" type="button">Evaluar cobertura</button><div id="academicRecoveryFeedback"></div></div>` : '<div class="academicRecoveryEmpty">Esta ficha no tiene una pregunta oral específica para microevaluación.</div>'}<small class="academicRecoveryNote">${escapeHTML(statusText(item))}. La cobertura automática es orientativa y no reemplaza una corrección docente.</small>`;

    $('academicRecoveryTechnical')?.addEventListener('click', () => {
      item.technicalSeen = true; saveState();
      window.AcademicV2?.open(item.entryId, { level: 'technical', scroll: true });
      render();
    });
    $('academicRecoveryOral')?.addEventListener('click', () => {
      item.oralSeen = true; saveState();
      window.AcademicV2?.open(item.entryId, { level: 'oral', scroll: true });
      render();
    });
    $('academicRecovery3D')?.addEventListener('click', () => {
      window.AcademicV2?.open(item.entryId, { level: 'review', scroll: false });
      $('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $('academicRecoverySubmit')?.addEventListener('click', () => evaluateRetest(item, entry, question));
  }

  function evaluateRetest(item, entry, question) {
    const textarea = $('academicRecoveryAnswer');
    const feedback = $('academicRecoveryFeedback');
    const answer = textarea?.value?.trim() || '';
    if (answer.length < 18) {
      if (feedback) feedback.innerHTML = '<div class="academicRecoveryWarn">Desarrollá un poco más antes de evaluar.</div>';
      textarea?.focus();
      return;
    }
    const required = question.requiredElements || [];
    const normalizedAnswer = normalize(answer);
    const matched = required.filter(req => requirementMatched(req, normalizedAnswer));
    const missed = required.filter(req => !matched.includes(req));
    const coverage = required.length ? matched.length / required.length : 1;
    item.retestScore = coverage;
    item.attempts = (item.attempts || 0) + 1;
    item.recovered = Boolean(item.technicalSeen && item.oralSeen && coverage >= TARGET);
    saveState();
    if (feedback) feedback.innerHTML = `<div class="academicRecoveryFeedback ${coverage >= TARGET ? 'ok' : 'bad'}"><b>Cobertura estimada: ${Math.round(coverage * 100)}%</b>${matched.length ? `<p><strong>Reconocido:</strong> ${matched.map(escapeHTML).join(' · ')}</p>` : ''}${missed.length ? `<p><strong>Falta reforzar:</strong> ${missed.map(escapeHTML).join(' · ')}</p>` : '<p>No quedaron elementos obligatorios sin detectar.</p>'}${question.modelAnswer ? `<details><summary>Comparar con respuesta modelo</summary><p>${escapeHTML(question.modelAnswer)}</p></details>` : ''}${item.recovered ? '<p><strong>✓ Tema recuperado:</strong> completaste Técnico, Oral y alcanzaste al menos 70% en la microevaluación.</p>' : coverage >= TARGET ? '<p>La cobertura alcanzó el objetivo, pero todavía falta completar Técnico y/o Oral.</p>' : '<p>Volvé a Técnico/Oral y reintentá la microevaluación.</p>'}</div>`;
    document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Recuperación V2', target: entry.preferredName, correct: item.recovered, score: coverage } }));
    setTimeout(render, 1200);
  }

  function render() {
    const host = mount();
    if (!host) return;
    const items = state.items || [];
    if (!items.length) {
      host.innerHTML = '<div class="academicRecoveryEmpty"><span class="simEy">Recuperación personalizada</span><h3>Sin temas pendientes del último Parcial V2</h3><p>Cuando completes un parcial, los temas con menos de 70% aparecerán acá automáticamente.</p></div>';
      return;
    }
    if (!currentId || !items.some(item => item.entryId === currentId)) currentId = items.find(item => !item.recovered)?.entryId || items[0].entryId;
    const current = items.find(item => item.entryId === currentId) || items[0];
    const generated = state.generatedAt ? new Date(state.generatedAt).toLocaleString('es-AR') : '—';
    host.innerHTML = `<div class="academicRecoveryHead"><div><span class="simEy">Modo Estudiar · recuperación automática</span><h3>Ruta de recuperación del último parcial</h3><p>Ordenada desde los temas de menor rendimiento. Resultado del parcial: <b>${state.partialScore ?? '—'}%</b> · generada ${escapeHTML(generated)}.</p></div><div class="academicRecoveryCounter"><b>${items.filter(item => item.recovered).length}/${items.length}</b><span>recuperados</span></div></div><div class="academicRecoveryLayout"><div id="academicRecoveryList" class="academicRecoveryList"></div><div id="academicRecoveryDetail" class="academicRecoveryDetail"></div></div>`;
    const unresolved = renderList($('academicRecoveryList'));
    renderDetail($('academicRecoveryDetail'), current);
    if (!unresolved) host.classList.add('complete'); else host.classList.remove('complete');
  }

  document.addEventListener('click', event => {
    if (event.target.closest?.('#academicPartialStart')) partialSession = [];
  });
  document.addEventListener('simulator:practice-result', event => {
    const detail = event.detail || {};
    if (detail.mode !== 'Parcial V2') return;
    partialSession.push({ target: detail.target || '', score: Math.max(0, Math.min(1, Number(detail.score ?? (detail.correct ? 1 : 0)))), category: detail.category || '' });
    if (partialSession.length >= PARTIAL_QUESTION_COUNT) buildQueueFromPartial();
  });
  document.addEventListener('academic-v2:ready', render);
  document.addEventListener('academic-recovery-v2:refresh', () => { state = loadState(); render(); });

  function boot() { mount(); render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
