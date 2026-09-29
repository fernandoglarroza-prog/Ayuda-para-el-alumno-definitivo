(() => {
  const HISTORY_KEY = 'ayuda_sim_odontologia_partial_v2_history';
  const TARGET = 70;
  const WRITTEN_MIN_CHARS = 18;
  const STOP = new Set(['de','del','la','las','el','los','y','e','o','u','en','por','para','con','sin','un','una','unos','unas','al','a','que','se','su','sus','como','entre']);
  const LAYER_BUTTONS = { landmarks: 'toggleLandmarks', nerves: 'toggleNerves', vessels: 'toggleVessels', canal: 'toggleCanal', tmj: 'toggleTMJ', muscles: 'toggleMuscles' };

  const RECOGNITION_BANK = [
    { target: 'Mandíbula', prompt: 'Identificá la mandíbula directamente sobre el modelo 3D.', accepted: ['mandibula'], layers: [], review: 'mandibula' },
    { target: 'Foramen oval', prompt: 'Identificá el foramen oval en la base del cráneo.', accepted: ['foramen_oval'], layers: ['landmarks'], review: 'v3' },
    { target: 'V3', prompt: 'Identificá el trayecto esquemático del nervio mandibular (V3).', accepted: ['v3'], layers: ['nerves'], review: 'v3' },
    { target: 'Nervio alveolar inferior', prompt: 'Identificá el nervio alveolar inferior antes y durante su trayecto mandibular.', accepted: ['ian'], layers: ['nerves'], review: 'v3' },
    { target: 'V2', prompt: 'Identificá el trayecto esquemático del nervio maxilar (V2).', accepted: ['v2'], layers: ['nerves'], review: 'v2' },
    { target: 'Nervio infraorbitario', prompt: 'Dentro del sistema de V2, identificá el nervio infraorbitario.', accepted: ['infraorbital'], layers: ['nerves'], review: 'v2' },
    { target: 'Arteria maxilar', prompt: 'Identificá la arteria maxilar en la capa vascular esquemática.', accepted: ['maxillary_artery'], layers: ['vessels'], review: 'arteria_maxilar' },
    { target: 'Disco articular de la ATM', prompt: 'Identificá el disco articular esquemático de la ATM.', accepted: ['disco_articular_atm'], layers: ['tmj'], review: 'atm' },
    { target: 'Masetero', prompt: 'Identificá el músculo masetero en la capa muscular.', accepted: ['masetero'], layers: ['muscles'], review: 'masticacion_integrada' },
    { target: 'Pterigoideo lateral', prompt: 'Identificá el músculo pterigoideo lateral.', accepted: ['pterigoideo_lateral'], layers: ['muscles'], review: 'pterigoideo_lateral' },
    { target: 'Foramen mandibular', prompt: 'Identificá el foramen mandibular en la cara medial de la rama.', accepted: ['foramen_mandibular'], layers: ['landmarks'], review: 'region_pterigomandibular' }
  ];

  const shuffle = (array) => {
    const out = [...array];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const normalize = (value = '') => value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const significantTokens = (value) => normalize(value).split(' ').filter(token => token.length > 2 && !STOP.has(token));
  const fmtTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const escapeHTML = (value = '') => value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));

  function requirementMatched(requirement, answerNormalized) {
    const requirementNormalized = normalize(requirement);
    if (!requirementNormalized) return false;
    if (answerNormalized.includes(requirementNormalized)) return true;
    const tokens = significantTokens(requirement);
    if (!tokens.length) return false;
    const hits = tokens.filter(token => answerNormalized.includes(token)).length;
    const threshold = tokens.length === 1 ? 1 : Math.ceil(tokens.length * 0.65);
    return hits >= threshold;
  }

  function loadHistory() {
    try {
      return { attempts: 0, best: null, last: null, history: [], ...JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}') };
    } catch {
      return { attempts: 0, best: null, last: null, history: [] };
    }
  }
  function saveHistory(history) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
  }

  function setLayer(layer, desired) {
    const button = document.getElementById(LAYER_BUTTONS[layer]);
    if (!button) return;
    const active = button.getAttribute('aria-pressed') === 'true';
    if (active !== desired) button.click();
  }
  function isolateLayers(layers = []) {
    Object.keys(LAYER_BUTTONS).forEach(layer => setLayer(layer, layers.includes(layer)));
  }

  function writtenQuestion(entry, family) {
    const q = entry.exam?.questions?.[0];
    if (!q?.prompt) return null;
    return {
      type: 'written', family, category: family, target: entry.preferredName, entryId: entry.id,
      prompt: q.prompt,
      requiredElements: q.requiredElements || [],
      modelAnswer: q.modelAnswer || '',
      followUp: q.followUp || [],
      criticalErrors: entry.exam?.criticalErrors || []
    };
  }

  function weightedRecognitionPick(pool, count, entries) {
    const mastery = window.AcademicMasteryV2;
    if (!mastery?.entryWeight) return shuffle(pool).slice(0, count);
    const remaining = [...pool];
    const chosen = [];
    while (remaining.length && chosen.length < count) {
      const weights = remaining.map(item => {
        const entry = entries.find(candidate => candidate.id === item.review || candidate.modelKey === item.review);
        return entry ? Math.max(0.15, mastery.entryWeight(entry)) : 1;
      });
      const total = weights.reduce((sum, value) => sum + value, 0);
      let cursor = Math.random() * total;
      let idx = 0;
      for (; idx < remaining.length; idx += 1) {
        cursor -= weights[idx];
        if (cursor <= 0) break;
      }
      chosen.push(remaining.splice(Math.min(idx, remaining.length - 1), 1)[0]);
    }
    return chosen;
  }

  function buildExam(entries) {
    const usable = entries.filter(entry => entry.exam?.questions?.length);
    const dentition = usable.filter(entry => (entry.paUnits || []).some(unit => unit.includes('Unidad VIII')));
    const radiology = usable.filter(entry => entry.category === 'radiology' || (entry.paUnits || []).some(unit => unit.includes('Correlación didáctica radiográfica')));
    const general = usable.filter(entry => !dentition.includes(entry) && !radiology.includes(entry) && entry.status === 'technical-review');
    const fallbackGeneral = usable.filter(entry => !dentition.includes(entry) && !radiology.includes(entry));
    const adaptivePick = (pool, n) => window.AcademicMasteryV2?.weightedPick ? window.AcademicMasteryV2.weightedPick(pool, n) : shuffle(pool).slice(0, n);
    const pickWritten = (pool, n, family) => adaptivePick(pool, n).map(entry => writtenQuestion(entry, family)).filter(Boolean);
    const recognition = weightedRecognitionPick(RECOGNITION_BANK, 4, entries).map(item => ({ type: '3d', family: 'Reconocimiento 3D', category: 'Reconocimiento 3D', ...item }));
    const oral = pickWritten(general.length >= 4 ? general : fallbackGeneral, 4, 'Oral técnico');
    const teeth = pickWritten(dentition, 4, 'Anatomía dentaria');
    const radio = pickWritten(radiology, 4, 'Radiología anatómica');
    return shuffle([...recognition, ...oral, ...teeth, ...radio]);
  }

  function init() {
    if (document.getElementById('academicPartialV2Panel')) return true;
    const academic = window.AcademicV2;
    const entries = academic?.entries?.() || [];
    if (!entries.length) return false;

    document.body.classList.add('academicPartialV2Ready');
    const legacyPanel = document.getElementById('examModePanel');
    if (legacyPanel) legacyPanel.hidden = true;

    let navBtn = document.querySelector('.examModeNav');
    if (navBtn) {
      const clean = navBtn.cloneNode(true);
      clean.textContent = 'Parcial V2';
      clean.setAttribute('aria-label', 'Abrir parcial académico integral V2');
      navBtn.replaceWith(clean);
      navBtn = clean;
    } else {
      const nav = document.querySelector('.simModes');
      if (!nav) return false;
      navBtn = document.createElement('button');
      navBtn.type = 'button'; navBtn.className = 'simMode examModeNav'; navBtn.textContent = 'Parcial V2';
      nav.appendChild(navBtn);
    }

    const panel = document.createElement('section');
    panel.id = 'academicPartialV2Panel';
    panel.className = 'academicPartialV2Panel';
    panel.innerHTML = `
      <div class="academicPartialHead">
        <div><span class="simEy">Parcial V2 · integración académica adaptativa</span><h2>Simulacro técnico de Anatomía Odontológica</h2><p>16 consignas equilibradas: reconocimiento 3D, desarrollo oral/técnico, anatomía dentaria y radiología. Dentro de cada bloque, el perfil de dominio aumenta la frecuencia de los temas más débiles sin dejar de explorar áreas todavía poco evaluadas.</p></div>
        <div class="academicPartialStats"><span>Intentos <b id="academicPartialAttempts">0</b></span><span>Último <b id="academicPartialLast">—</b></span><span>Mejor <b id="academicPartialBest">—</b></span></div>
      </div>
      <div class="academicPartialStart"><button id="academicPartialStart" type="button">Comenzar parcial V2</button><span>⏱️ Cronómetro informativo · sin límite automático · objetivo interno 70%</span></div>
      <div id="academicPartialRunner" class="academicPartialRunner" hidden>
        <div class="academicPartialTop"><div><span id="academicPartialProgress">Consigna 1 de 16</span><b id="academicPartialCategory"></b></div><span id="academicPartialTimer">00:00</span></div>
        <div class="academicPartialTrack"><span id="academicPartialBar"></span></div>
        <div id="academicPartialQuestion" class="academicPartialQuestion"></div>
        <div id="academicPartialFeedback" class="academicPartialFeedback" hidden></div>
        <div class="academicPartialActions"><button id="academicPartialAbort" type="button">Salir del parcial</button><button id="academicPartialNext" class="primary" type="button" disabled>Siguiente</button></div>
      </div>
      <div id="academicPartialResult" class="academicPartialResult" hidden></div>`;
    const anchor = document.getElementById('academicV2') || document.getElementById('adaptiveStudy') || document.querySelector('.simRoadmap');
    if (anchor) anchor.before(panel); else document.querySelector('main')?.appendChild(panel);

    const startBtn = panel.querySelector('#academicPartialStart');
    const runner = panel.querySelector('#academicPartialRunner');
    const result = panel.querySelector('#academicPartialResult');
    const qHost = panel.querySelector('#academicPartialQuestion');
    const feedback = panel.querySelector('#academicPartialFeedback');
    const nextBtn = panel.querySelector('#academicPartialNext');
    const abortBtn = panel.querySelector('#academicPartialAbort');
    const progressEl = panel.querySelector('#academicPartialProgress');
    const categoryEl = panel.querySelector('#academicPartialCategory');
    const timerEl = panel.querySelector('#academicPartialTimer');
    const bar = panel.querySelector('#academicPartialBar');

    let questions = [], index = 0, results = [], active = false, answered = false, awaiting3d = false, startAt = 0, timer = null;

    function updateHistoryUI() {
      const history = loadHistory();
      panel.querySelector('#academicPartialAttempts').textContent = history.attempts || 0;
      panel.querySelector('#academicPartialLast').textContent = history.last == null ? '—' : `${history.last}%`;
      panel.querySelector('#academicPartialBest').textContent = history.best == null ? '—' : `${history.best}%`;
    }
    function setExamVisual(on) {
      document.querySelectorAll('.simMode').forEach(button => button.classList.toggle('active', on ? button === navBtn : button.dataset.mode === 'explorar'));
      if (on) document.body.dataset.simMode = 'parcial';
    }
    function stopTimer() { if (timer) clearInterval(timer); timer = null; }
    function clearRecognitionState() {
      awaiting3d = false;
      document.body.classList.remove('academicPartialRecognitionActive');
    }
    function start() {
      document.querySelector('.simMode[data-mode="explorar"]')?.click();
      setExamVisual(true);
      questions = buildExam(entries);
      index = 0; results = []; active = true; answered = false; awaiting3d = false;
      result.hidden = true; runner.hidden = false; startBtn.disabled = true;
      startAt = Date.now(); stopTimer(); timerEl.textContent = '00:00';
      timer = setInterval(() => { timerEl.textContent = fmtTime(Math.floor((Date.now() - startAt) / 1000)); }, 1000);
      renderQuestion(); panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderQuestion() {
      const q = questions[index];
      answered = false; clearRecognitionState(); feedback.hidden = true; feedback.className = 'academicPartialFeedback';
      nextBtn.disabled = true; nextBtn.textContent = index === questions.length - 1 ? 'Ver resultado' : 'Siguiente';
      progressEl.textContent = `Consigna ${index + 1} de ${questions.length}`; categoryEl.textContent = q.category;
      bar.style.width = `${Math.round((index / questions.length) * 100)}%`;

      if (q.type === '3d') {
        awaiting3d = true; isolateLayers(q.layers || []); document.body.classList.add('academicPartialRecognitionActive');
        qHost.innerHTML = `<span class="academicPartialType">Reconocimiento sobre modelo</span><h3>${escapeHTML(q.prompt)}</h3><p>La primera estructura que selecciones cuenta como respuesta. Las etiquetas y la ficha lateral se ocultan durante esta consigna.</p><button id="academicPartialGo3d" type="button">Ir al cráneo 3D ↑</button>`;
        qHost.querySelector('#academicPartialGo3d')?.addEventListener('click', () => document.getElementById('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      } else {
        const reqCount = q.requiredElements.length;
        qHost.innerHTML = `<span class="academicPartialType">${escapeHTML(q.category)}</span><h3>${escapeHTML(q.prompt)}</h3><p>Respondé como si fuera un desarrollo escrito/oral. Se buscarán ${reqCount} elementos anatómicos obligatorios del corpus.</p><textarea id="academicPartialAnswer" rows="8" placeholder="Desarrollá tu respuesta con terminología anatómica precisa…"></textarea><div class="academicPartialWrittenActions"><small>La comparación automática estima cobertura conceptual; no interpreta calidad discursiva como un docente.</small><button id="academicPartialSubmit" type="button">Entregar respuesta</button></div>`;
        qHost.querySelector('#academicPartialSubmit')?.addEventListener('click', answerWritten);
      }
    }

    function register(q, points, detail) {
      answered = true; clearRecognitionState();
      const safePoints = Math.max(0, Math.min(1, Number(points) || 0));
      results.push({ q, points: safePoints, detail });
      document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Parcial V2', target: q.target, category: q.category, correct: safePoints >= 0.6, score: safePoints } }));
      nextBtn.disabled = false;
    }

    function answerWritten() {
      if (!active || answered) return;
      const q = questions[index];
      const textarea = qHost.querySelector('#academicPartialAnswer');
      const answer = textarea?.value?.trim() || '';
      if (answer.length < WRITTEN_MIN_CHARS) {
        textarea?.focus();
        const old = qHost.querySelector('.academicPartialMinWarning');
        if (!old) {
          const warning = document.createElement('div'); warning.className = 'academicPartialMinWarning'; warning.textContent = 'Desarrollá un poco más la respuesta antes de entregarla.';
          textarea?.after(warning);
        }
        return;
      }
      const normalized = normalize(answer);
      const required = q.requiredElements || [];
      const matched = required.filter(item => requirementMatched(item, normalized));
      const missed = required.filter(item => !matched.includes(item));
      const coverage = required.length ? matched.length / required.length : 1;
      textarea.disabled = true; qHost.querySelector('#academicPartialSubmit').disabled = true;
      feedback.hidden = false; feedback.classList.add(coverage >= 0.7 ? 'ok' : coverage >= 0.45 ? 'mid' : 'bad');
      feedback.innerHTML = `<b>Cobertura estimada: ${Math.round(coverage * 100)}%</b><div class="academicPartialCoverage"><div><strong>Elementos reconocidos</strong>${matched.length ? `<ul>${matched.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : '<p>Ninguno detectado de forma clara.</p>'}</div><div><strong>Elementos a reforzar</strong>${missed.length ? `<ul>${missed.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : '<p>No quedaron elementos obligatorios sin detectar.</p>'}</div></div>${q.modelAnswer ? `<details><summary>Ver respuesta modelo</summary><p>${escapeHTML(q.modelAnswer)}</p></details>` : ''}${q.followUp?.length ? `<div class="academicPartialFollow"><strong>Repreguntas:</strong> ${q.followUp.map(escapeHTML).join(' · ')}</div>` : ''}${q.criticalErrors?.length ? `<div class="academicPartialCritical"><strong>Errores graves a evitar:</strong> ${q.criticalErrors.map(escapeHTML).join(' · ')}</div>` : ''}`;
      register(q, coverage, { answer, matched, missed });
    }

    function answer3D(event) {
      if (!active || answered || !awaiting3d) return;
      const key = event.detail?.key;
      if (!key || key === 'craneo') return;
      const q = questions[index];
      const ok = (q.accepted || []).includes(key);
      feedback.hidden = false; feedback.classList.add(ok ? 'ok' : 'bad');
      feedback.innerHTML = `<b>${ok ? '✓ Identificación correcta' : '✕ Identificación incorrecta'}</b><p>${ok ? `Seleccionaste ${escapeHTML(event.detail?.sourceName || q.target)}.` : `Seleccionaste ${escapeHTML(event.detail?.sourceName || key)}. La estructura solicitada era ${escapeHTML(q.target)}.`}</p>`;
      register(q, ok ? 1 : 0, { selected: key });
      if (!ok && q.review) setTimeout(() => window.AcademicV2?.open(q.review, { level: 'review', scroll: false }), 0);
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    }

    function next() {
      if (!answered) return;
      if (index < questions.length - 1) {
        index += 1; renderQuestion(); panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else finish();
    }

    function finish() {
      active = false; clearRecognitionState(); stopTimer(); runner.hidden = true; startBtn.disabled = false; bar.style.width = '100%';
      const totalPoints = results.reduce((sum, item) => sum + item.points, 0);
      const pct = Math.round((totalPoints / questions.length) * 100);
      const elapsed = Math.floor((Date.now() - startAt) / 1000);
      const history = loadHistory();
      history.attempts = (history.attempts || 0) + 1; history.last = pct; history.best = history.best == null ? pct : Math.max(history.best, pct);
      history.history = [{ date: new Date().toISOString(), score: pct, points: Number(totalPoints.toFixed(2)), total: questions.length, seconds: elapsed }, ...(history.history || [])].slice(0, 10);
      saveHistory(history); updateHistoryUI();

      const categories = {};
      results.forEach(item => {
        const cat = item.q.category; categories[cat] ||= { points: 0, total: 0 }; categories[cat].points += item.points; categories[cat].total += 1;
      });
      const weak = results.filter(item => item.points < 0.7).sort((a, b) => a.points - b.points);
      result.hidden = false;
      result.innerHTML = `<div class="academicPartialScore"><div><span class="simEy">Resultado del parcial V2</span><h2>${pct}% · ${totalPoints.toFixed(1)}/${questions.length} puntos</h2><p>${pct >= TARGET ? 'Objetivo interno de entrenamiento alcanzado.' : 'Conviene reforzar los bloques de menor cobertura antes de repetirlo.'} Tiempo: ${fmtTime(elapsed)}.</p></div><span class="${pct >= TARGET ? 'pass' : 'retry'}">${pct >= TARGET ? '✓ ≥ 70%' : '↻ < 70%'}</span></div><div class="academicPartialCategoryGrid">${Object.entries(categories).map(([name, value]) => `<div><span>${escapeHTML(name)}</span><b>${Math.round(value.points / value.total * 100)}%</b><small>${value.points.toFixed(1)}/${value.total}</small></div>`).join('')}</div><div class="academicPartialRecovery"><h3>Plan de recuperación</h3>${weak.length ? `<p>Estas consignas tuvieron menos de 70% de cobertura y pasan al repaso:</p><div class="academicPartialRecoveryList">${weak.slice(0, 8).map(item => `<article><div><b>${escapeHTML(item.q.target)}</b><small>${escapeHTML(item.q.category)} · ${Math.round(item.points * 100)}%</small></div>${item.q.entryId || item.q.review ? `<button type="button" data-academic-review="${escapeHTML(item.q.entryId || item.q.review)}">Repasar V2</button>` : ''}</article>`).join('')}</div>` : '<p>No quedaron consignas por debajo del 70%.</p>'}<div class="academicPartialResultActions"><button id="academicPartialStudy" type="button">Volver a Estudiar</button><button id="academicPartialAgain" class="primary" type="button">Nuevo parcial V2</button></div></div><small class="academicPartialDisclaimer">La cobertura de respuestas escritas es una estimación por elementos anatómicos esperados. No equivale a corrección semántica exhaustiva ni a una calificación oficial de la cátedra. La selección adaptativa modifica frecuencia de temas, no el criterio de aprobación.</small>`;
      result.querySelectorAll('[data-academic-review]').forEach(button => button.addEventListener('click', () => window.AcademicV2?.open(button.dataset.academicReview, { level: 'technical', scroll: true })));
      result.querySelector('#academicPartialStudy')?.addEventListener('click', () => document.querySelector('.simMode[data-mode="estudiar"]')?.click());
      result.querySelector('#academicPartialAgain')?.addEventListener('click', start);
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function abort() {
      if (!active) return;
      active = false; clearRecognitionState(); stopTimer(); runner.hidden = true; startBtn.disabled = false;
      result.hidden = false; result.innerHTML = '<div class="academicPartialAborted"><b>Parcial interrumpido</b><p>No se guardó un resultado final. Podés iniciar uno nuevo cuando quieras.</p></div>';
    }

    navBtn.addEventListener('click', () => { setExamVisual(true); panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    startBtn.addEventListener('click', start); nextBtn.addEventListener('click', next); abortBtn.addEventListener('click', abort);
    document.addEventListener('simulator:select', answer3D);
    document.querySelectorAll('.simMode[data-mode]').forEach(button => button.addEventListener('click', () => { if (active) abort(); }));
    updateHistoryUI();
    document.dispatchEvent(new CustomEvent('academic-partial-v2:ready', { detail: { questions: 16, adaptive: Boolean(window.AcademicMasteryV2) } }));
    return true;
  }

  const tryInit = () => {
    if (init()) return;
    const observer = new MutationObserver(() => { if (init()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    const onReady = () => { if (init()) observer.disconnect(); };
    document.addEventListener('academic-v2:ready', onReady, { once: true });
    document.addEventListener('academic-mastery-v2:ready', onReady, { once: true });
    setTimeout(() => observer.disconnect(), 20000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryInit, { once: true }); else tryInit();
})();
