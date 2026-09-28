(() => {
  const BASE = '/simulador-odontologia/content-v2/data/';
  const LEVELS = [
    ['review', 'Repaso'],
    ['development', 'Desarrollo'],
    ['technical', 'Técnico'],
    ['oral', 'Oral / parcial']
  ];
  const state = { entries: [], aliases: new Map(), filtered: [], selected: null, level: 'technical' };
  const byId = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const normalize = (value = '') => value
    .toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const fetchJSON = async (name) => {
    const response = await fetch(BASE + name.replace(/^\.\//, ''), { cache: 'no-store' });
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    return response.json();
  };

  function mountShell() {
    if (byId('academicV2')) return;
    const section = el('section', 'academicV2');
    section.id = 'academicV2';
    section.innerHTML = `
      <div class="academicV2Head">
        <div>
          <span class="simEy">V2 académica · contenido profundo</span>
          <h2>Atlas anatómico para estudiar, desarrollar y rendir</h2>
          <p>Buscá una estructura o tema y elegí la profundidad. El nivel Técnico prioriza terminología anatómica, relaciones, trayectos, inserciones, variaciones y correlación odontológica.</p>
        </div>
        <span id="academicV2Badge" class="academicV2Badge">Cargando corpus…</span>
      </div>
      <div class="academicV2Tools">
        <input id="academicV2Search" type="search" placeholder="Buscar: mandíbula, espina de Spix, V3, bicúspide, Wharton…" autocomplete="off" aria-label="Buscar en el contenido académico V2">
        <select id="academicV2Unit" aria-label="Filtrar por unidad"><option value="">Todas las unidades</option></select>
      </div>
      <div class="academicV2Layout">
        <div><div id="academicV2Results" class="academicV2Results" aria-label="Resultados de contenido"></div><div id="academicV2Status" class="academicV2Status"></div></div>
        <article id="academicV2Card" class="academicV2Card" aria-live="polite"><div class="academicV2Empty">Preparando contenido académico…</div></article>
      </div>
      <div class="academicV2Notice"><b>Uso educativo:</b> las fichas distinguen patrones anatómicos frecuentes de variaciones. Los contenidos marcados como “pendiente de cátedra” están desarrollados técnicamente pero conservan puntos terminológicos o de profundidad que todavía deben contrastarse con la forma específica de evaluación docente.</div>`;
    const roadmap = document.querySelector('.simRoadmap');
    if (roadmap) roadmap.before(section); else document.querySelector('main')?.append(section);
  }

  function entrySearchText(entry) {
    const t = entry.terminology || {};
    const aliases = state.aliases.get(entry.id) || [];
    const values = [entry.id, entry.preferredName, t.preferred, ...(t.synonyms || []), ...(t.classicTerms || []), ...aliases, ...(entry.paUnits || [])];
    return normalize(values.join(' '));
  }

  function filterEntries() {
    const query = normalize(byId('academicV2Search')?.value || '');
    const unit = byId('academicV2Unit')?.value || '';
    state.filtered = state.entries.filter(entry => {
      const unitOK = !unit || (entry.paUnits || []).includes(unit);
      const queryOK = !query || entry._search.includes(query) || query.split(' ').every(part => entry._search.includes(part));
      return unitOK && queryOK;
    });
    state.filtered.sort((a, b) => a.preferredName.localeCompare(b.preferredName, 'es'));
    renderResults();
  }

  function renderResults() {
    const host = byId('academicV2Results');
    if (!host) return;
    host.replaceChildren();
    const shown = state.filtered.slice(0, 80);
    if (!shown.length) {
      host.append(el('div', 'academicV2Empty', 'No encontramos coincidencias. Probá otro término o quitá el filtro de unidad.'));
    } else {
      shown.forEach(entry => {
        const button = el('button', 'academicV2Result' + (state.selected?.id === entry.id ? ' active' : ''));
        button.type = 'button';
        button.dataset.entryId = entry.id;
        button.append(el('b', '', entry.preferredName));
        button.append(el('small', '', (entry.paUnits || []).join(' · ') || entry.category || 'Anatomía'));
        button.addEventListener('click', () => selectEntry(entry.id, true));
        host.append(button);
      });
    }
    const status = byId('academicV2Status');
    if (status) status.textContent = `${state.filtered.length} resultado${state.filtered.length === 1 ? '' : 's'}${state.filtered.length > 80 ? ' · mostrando los primeros 80' : ''}`;
  }

  function renderBlock(block, host) {
    const wrap = el('section', 'academicV2Block');
    if (block.title) wrap.append(el('h4', '', block.title));
    const items = Array.isArray(block.content) ? block.content : [block.content].filter(Boolean);
    if (items.length) {
      const ul = el('ul');
      items.forEach(item => ul.append(el('li', '', item)));
      wrap.append(ul);
    }
    host.append(wrap);
  }

  function renderOral(entry, host) {
    const level = entry.levels?.oral;
    if (level?.summary) host.append(el('p', 'academicV2Summary', level.summary));
    (level?.blocks || []).forEach(block => renderBlock(block, host));
    const questions = entry.exam?.questions || [];
    if (!questions.length) {
      host.append(el('div', 'academicV2Empty', 'Esta ficha todavía no tiene una pregunta oral específica vinculada.'));
      return;
    }
    questions.forEach((question, index) => {
      const box = el('div', 'academicV2Question');
      box.append(el('strong', '', `${index + 1}. ${question.prompt}`));
      const details = document.createElement('details');
      const summary = el('summary', '', 'Ver respuesta modelo y criterios');
      details.append(summary);
      if (question.requiredElements?.length) {
        details.append(el('p', '', `Elementos esperados: ${question.requiredElements.join(' · ')}`));
      }
      if (question.modelAnswer) details.append(el('p', '', question.modelAnswer));
      if (question.followUp?.length) details.append(el('p', '', `Repreguntas: ${question.followUp.join(' · ')}`));
      box.append(details);
      const errors = entry.exam?.criticalErrors || [];
      if (errors.length) box.append(el('div', 'academicV2Critical', `Errores graves a evitar: ${errors.join(' · ')}`));
      host.append(box);
    });
  }

  function renderEntry() {
    const entry = state.selected;
    const card = byId('academicV2Card');
    if (!entry || !card) return;
    card.replaceChildren();

    const meta = el('div', 'academicV2Meta');
    (entry.paUnits || []).forEach(unit => meta.append(el('span', 'academicV2Pill', unit)));
    meta.append(el('span', 'academicV2Pill', entry.status === 'technical-review' ? 'Revisión técnica' : 'Pendiente de cátedra'));
    card.append(meta);
    card.append(el('h3', '', entry.preferredName));

    const terminology = entry.terminology || {};
    const terms = [...(terminology.synonyms || []), ...(terminology.classicTerms || [])];
    if (terms.length) card.append(el('div', 'academicV2Terms', `También buscable como: ${terms.join(' · ')}`));

    const tabs = el('div', 'academicV2Tabs');
    LEVELS.forEach(([key, label]) => {
      const button = el('button', 'academicV2Tab' + (state.level === key ? ' active' : ''), label);
      button.type = 'button';
      button.addEventListener('click', () => { state.level = key; renderEntry(); });
      tabs.append(button);
    });
    card.append(tabs);

    const content = el('div');
    if (state.level === 'oral') {
      renderOral(entry, content);
    } else {
      const level = entry.levels?.[state.level];
      if (!level) content.append(el('div', 'academicV2Empty', 'Este nivel todavía no está disponible para la ficha.'));
      else {
        if (level.summary) content.append(el('p', 'academicV2Summary', level.summary));
        (level.blocks || []).forEach(block => renderBlock(block, content));
      }
    }
    card.append(content);
  }

  function selectEntry(id, scroll = false) {
    const entry = state.entries.find(item => item.id === id || item.modelKey === id) ||
      state.entries.find(item => normalize(item.preferredName) === normalize(id));
    if (!entry) return false;
    state.selected = entry;
    renderResults();
    renderEntry();
    if (scroll) byId('academicV2Card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return true;
  }

  function populateUnits() {
    const select = byId('academicV2Unit');
    if (!select) return;
    const units = [...new Set(state.entries.flatMap(entry => entry.paUnits || []))].sort((a, b) => a.localeCompare(b, 'es'));
    units.forEach(unit => {
      const option = el('option', '', unit);
      option.value = unit;
      select.append(option);
    });
  }

  async function load() {
    mountShell();
    try {
      const manifest = await fetchJSON('index.json');
      const [datasets, termMap] = await Promise.all([
        Promise.all((manifest.files || []).map(fetchJSON)),
        manifest.terminology ? fetchJSON(manifest.terminology).catch(() => ({ terms: [] })) : Promise.resolve({ terms: [] })
      ]);
      state.entries = datasets.flatMap(data => data.entries || []);
      (termMap.terms || []).forEach(term => {
        const list = state.aliases.get(term.target) || [];
        list.push(term.preferred, ...(term.synonyms || []), ...(term.classicTerms || []));
        state.aliases.set(term.target, list);
      });
      state.entries.forEach(entry => { entry._search = entrySearchText(entry); });
      populateUnits();
      byId('academicV2Search')?.addEventListener('input', filterEntries);
      byId('academicV2Unit')?.addEventListener('change', filterEntries);
      const badge = byId('academicV2Badge');
      if (badge) badge.textContent = `${state.entries.length} fichas profundas`;
      state.filtered = [...state.entries];
      const initial = state.entries.find(entry => entry.id === 'mandibula') || state.entries[0];
      state.selected = initial || null;
      filterEntries();
      renderEntry();
      window.AcademicV2 = { open: (id) => selectEntry(id, true), entries: () => [...state.entries] };
      window.addEventListener('simulator:selection', event => {
        const detail = event.detail || {};
        selectEntry(detail.id || detail.key || detail.modelKey || detail.name || '');
      });
    } catch (error) {
      console.error('[Academic V2]', error);
      const card = byId('academicV2Card');
      if (card) card.innerHTML = '<div class="academicV2Empty"><b>No se pudo cargar el corpus V2.</b><br>La versión básica del simulador sigue disponible. Reintentá recargando la página.</div>';
      const badge = byId('academicV2Badge');
      if (badge) badge.textContent = 'Error de carga V2';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
