(() => {
  const STORAGE_KEY = 'nursingSimulatorProgressV1';
  let originalShowResults = null;

  function readProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { cases:{}, totalRuns:0 }; }
    catch { return { cases:{}, totalRuns:0 }; }
  }

  function writeProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }

  function saveCurrentResult() {
    if (typeof currentCase === 'undefined' || typeof totalScore !== 'function') return;
    const data = readProgress();
    const id = currentCase.id;
    const score = totalScore();
    const previous = data.cases[id] || { attempts:0, best:0, last:0 };
    data.cases[id] = {
      attempts: previous.attempts + 1,
      best: Math.max(previous.best || 0, score),
      last: score,
      updatedAt: new Date().toISOString()
    };
    data.totalRuns = (data.totalRuns || 0) + 1;
    writeProgress(data);
  }

  function ensureStyles() {
    if (document.querySelector('link[data-progress-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './progress.css';
    link.dataset.progressStyles = 'true';
    document.head.appendChild(link);
  }

  function mountProgress() {
    ensureStyles();
    const library = document.querySelector('.caseLibrary');
    if (!library) return;
    if (!document.querySelector('.studyProgress')) {
      const section = document.createElement('section');
      section.className = 'studyProgress';
      library.insertAdjacentElement('afterend', section);
    }
    if (!document.querySelector('#randomCaseBtn')) {
      const head = document.querySelector('.libraryHead');
      const count = document.querySelector('.libraryCount');
      if (head && count) {
        const actions = document.createElement('div');
        actions.className = 'libraryActions';
        count.insertAdjacentElement('beforebegin', actions);
        actions.appendChild(count);
        const random = document.createElement('button');
        random.id = 'randomCaseBtn';
        random.className = 'randomCaseBtn';
        random.textContent = '🎲 Caso aleatorio';
        random.addEventListener('click', randomCase);
        actions.appendChild(random);
      }
    }
    renderProgress();
    decorateCards();
  }

  function renderProgress() {
    const root = document.querySelector('.studyProgress');
    if (!root || typeof cases === 'undefined') return;
    const data = readProgress();
    const entries = cases.map(c => data.cases[c.id]).filter(Boolean);
    const completed = entries.filter(e => (e.best || 0) > 0).length;
    const bestAverage = entries.length ? Math.round(entries.reduce((sum,e) => sum + (e.best || 0), 0) / entries.length) : 0;
    root.innerHTML = `
      <div><span class="eyebrow">Mi progreso</span><b>${completed} de ${cases.length} casos practicados</b><small>El progreso se guarda solamente en este navegador/dispositivo.</small></div>
      <div class="progressMetrics"><span><strong>${data.totalRuns || 0}</strong><small>simulaciones</small></span><span><strong>${bestAverage}</strong><small>promedio mejores puntajes</small></span></div>`;
  }

  function decorateCards() {
    if (typeof cases === 'undefined') return;
    const data = readProgress();
    document.querySelectorAll('[data-case]').forEach(card => {
      card.querySelector('.savedCaseScore')?.remove();
      const entry = data.cases[card.dataset.case];
      if (!entry) return;
      const badge = document.createElement('span');
      badge.className = 'savedCaseScore';
      badge.textContent = `Mejor ${entry.best}/100 · ${entry.attempts} ${entry.attempts === 1 ? 'intento' : 'intentos'}`;
      card.appendChild(badge);
    });
  }

  function randomCase() {
    if (typeof cases === 'undefined' || !cases.length || typeof loadCase !== 'function') return;
    const candidates = cases.filter(c => typeof currentCase === 'undefined' || c.id !== currentCase.id);
    const pool = candidates.length ? candidates : cases;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    loadCase(selected.id, true);
    setTimeout(decorateCards, 20);
  }

  function hookResults() {
    if (typeof showResults !== 'function' || originalShowResults) return;
    originalShowResults = showResults;
    showResults = function() {
      saveCurrentResult();
      const result = originalShowResults();
      setTimeout(() => { renderProgress(); decorateCards(); }, 0);
      return result;
    };
  }

  function watchCards() {
    const cards = document.querySelector('#caseCards');
    if (!cards) return;
    const observer = new MutationObserver(() => setTimeout(decorateCards, 0));
    observer.observe(cards, { childList:true });
  }

  function init() {
    hookResults();
    mountProgress();
    watchCards();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
