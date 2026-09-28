(() => {
  const THREE_D_TO_V2 = {
    craneo: 'base_craneo_foramenes_integrada',
    mandibula: 'mandibula',
    maxilar: 'maxilar',
    temporal: 'temporal',
    esfenoides: 'esfenoides',
    frontal: 'frontal',
    occipital: 'occipital',
    cigomatico: 'cigomatico',
    parietal: 'parietal',
    etmoides: 'etmoides',
    nasal: 'nasal',
    lagrimal: 'lagrimal',
    palatino: 'palatino',
    vomer: 'vomer',
    concha_inferior: 'concha_inferior',
    condilo_mandibular: 'atm',
    coronoides_mandibular: 'mandibula',
    escotadura_mandibular: 'mandibula',
    angulo_mandibular: 'mandibula',
    foramen_mandibular: 'region_pterigomandibular',
    lingula_mandibular: 'mandibula',
    conducto_mandibular: 'conducto_mandibular_radiologia',
    foramen_mentoniano: 'conducto_mandibular_radiologia',
    foramen_infraorbitario: 'v2',
    foramen_oval: 'v3',
    atm: 'atm',
    disco_articular_atm: 'atm',
    masetero: 'masticacion_integrada',
    musculo_temporal: 'masticacion_integrada',
    pterigoideo_medial: 'masticacion_integrada',
    pterigoideo_lateral: 'pterigoideo_lateral'
  };

  const V2_TO_3D = {
    mandibula: ['key', 'mandibula'],
    maxilar: ['key', 'maxilar'],
    temporal: ['key', 'temporal'],
    esfenoides: ['key', 'esfenoides'],
    frontal: ['key', 'frontal'],
    occipital: ['key', 'occipital'],
    cigomatico: ['key', 'cigomatico'],
    parietal: ['key', 'parietal'],
    etmoides: ['key', 'etmoides'],
    nasal: ['key', 'nasal'],
    lagrimal: ['key', 'lagrimal'],
    palatino: ['key', 'palatino'],
    vomer: ['key', 'vomer'],
    concha_inferior: ['key', 'concha_inferior'],
    atm: ['landmark', 'condilo_mandibular'],
    v3: ['landmark', 'foramen_oval'],
    conducto_mandibular_radiologia: ['key', 'conducto_mandibular'],
    region_pterigomandibular: ['landmark', 'foramen_mandibular'],
    base_craneo_foramenes_integrada: ['key', 'esfenoides'],
    paladar_duro: ['key', 'palatino'],
    pterigoideo_lateral: ['key', 'esfenoides'],
    masticacion_integrada: ['key', 'mandibula']
  };

  const TITLE_TO_KEY = {
    'Cráneo humano': 'craneo',
    'Mandíbula': 'mandibula',
    'Maxilar': 'maxilar',
    'Hueso temporal': 'temporal',
    'Esfenoides': 'esfenoides',
    'Hueso frontal': 'frontal',
    'Hueso occipital': 'occipital',
    'Hueso cigomático': 'cigomatico',
    'Hueso parietal': 'parietal',
    'Etmoides': 'etmoides',
    'Hueso nasal': 'nasal',
    'Hueso lagrimal': 'lagrimal',
    'Hueso palatino': 'palatino',
    'Vómer': 'vomer',
    'Concha nasal inferior': 'concha_inferior',
    'Proceso condilar de la mandíbula': 'condilo_mandibular',
    'Apófisis coronoides': 'coronoides_mandibular',
    'Escotadura mandibular': 'escotadura_mandibular',
    'Ángulo mandibular': 'angulo_mandibular',
    'Foramen mandibular': 'foramen_mandibular',
    'Língula mandibular': 'lingula_mandibular',
    'Conducto mandibular': 'conducto_mandibular',
    'Foramen mentoniano': 'foramen_mentoniano',
    'Foramen infraorbitario': 'foramen_infraorbitario',
    'Foramen oval': 'foramen_oval',
    'Articulación temporomandibular (ATM)': 'atm',
    'Disco articular de la ATM': 'disco_articular_atm',
    'Músculo masetero': 'masetero',
    'Músculo temporal': 'musculo_temporal',
    'Músculo pterigoideo medial': 'pterigoideo_medial',
    'Músculo pterigoideo lateral': 'pterigoideo_lateral'
  };

  let current3dKey = 'craneo';
  let currentV2Target = THREE_D_TO_V2[current3dKey];
  let academicReady = false;
  let infoObserver = null;

  function api() { return window.AcademicV2; }
  function targetForKey(key) { return THREE_D_TO_V2[key] || key || null; }

  function selectV2Silently(target) {
    if (!target || !api()?.open) return false;
    const beforeY = window.scrollY;
    api().open(target);
    requestAnimationFrame(() => window.scrollTo({ top: beforeY, left: 0, behavior: 'auto' }));
    currentV2Target = target;
    updateContextAction();
    return true;
  }

  function openV2(target = currentV2Target) {
    if (!target || !api()?.open) return false;
    api().open(target);
    currentV2Target = target;
    updateContextAction();
    return true;
  }

  function focus3D(entryId) {
    const instruction = V2_TO_3D[entryId];
    if (!instruction) return false;
    const [kind, key] = instruction;
    let ok = false;
    if (kind === 'landmark') ok = Boolean(window.skull3dSelectLandmark?.(key));
    else ok = Boolean(window.skull3dSelectByKey?.(key));
    if (ok) {
      window.skull3dFocusSelection?.();
      document.getElementById('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  function ensureContextAction() {
    const infoBox = document.getElementById('infoBox');
    if (!infoBox || document.getElementById('academicV2Context')) return;
    const box = document.createElement('div');
    box.id = 'academicV2Context';
    box.className = 'academicV2Context';
    box.innerHTML = `
      <div>
        <small>Ficha académica V2 vinculada</small>
        <b id="academicV2ContextName">Contenido profundo disponible</b>
      </div>
      <button id="academicV2ContextOpen" type="button">Abrir ficha profunda</button>`;
    const firstSection = infoBox.querySelector('.simInfoSection');
    if (firstSection) firstSection.before(box); else infoBox.appendChild(box);
    box.querySelector('#academicV2ContextOpen')?.addEventListener('click', () => openV2());
    updateContextAction();
  }

  function updateContextAction() {
    ensureContextAction();
    const box = document.getElementById('academicV2Context');
    const name = document.getElementById('academicV2ContextName');
    if (!box || !name) return;
    const entry = api()?.entries?.().find(item => item.id === currentV2Target || item.modelKey === currentV2Target);
    const available = Boolean(entry);
    box.hidden = !available;
    if (available) name.textContent = entry.preferredName;
  }

  function syncFrom3DKey(key) {
    if (!key) return;
    current3dKey = key;
    const target = targetForKey(key);
    currentV2Target = target;
    if (academicReady) selectV2Silently(target);
    else updateContextAction();
  }

  function bindInfoTitle() {
    const title = document.getElementById('infoTitle');
    if (!title || infoObserver) return;
    const syncTitle = () => {
      const key = TITLE_TO_KEY[title.textContent.trim()];
      if (key && key !== current3dKey) syncFrom3DKey(key);
    };
    infoObserver = new MutationObserver(syncTitle);
    infoObserver.observe(title, { childList: true, characterData: true, subtree: true });
    syncTitle();
  }

  function bindAcademicResults() {
    document.addEventListener('click', event => {
      const button = event.target.closest?.('.academicV2Result[data-entry-id]');
      if (!button) return;
      const id = button.dataset.entryId;
      setTimeout(() => focus3D(id), 0);
    });
  }

  document.addEventListener('simulator:select', event => {
    const key = event.detail?.key;
    if (key) syncFrom3DKey(key);
  });

  function waitForAcademic() {
    const started = Date.now();
    const timer = setInterval(() => {
      if (api()?.entries?.().length) {
        clearInterval(timer);
        academicReady = true;
        ensureContextAction();
        bindInfoTitle();
        selectV2Silently(currentV2Target);
        document.dispatchEvent(new CustomEvent('simulator:academic-sync-ready', { detail: { linked: true } }));
      } else if (Date.now() - started > 15000) {
        clearInterval(timer);
      }
    }, 120);
  }

  bindAcademicResults();
  waitForAcademic();
})();
