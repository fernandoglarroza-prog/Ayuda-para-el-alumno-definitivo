(() => {
  const THREE_D_TO_V2 = {
    craneo: 'base_craneo_foramenes_integrada',
    mandibula: 'mandibula', maxilar: 'maxilar', temporal: 'temporal', esfenoides: 'esfenoides', frontal: 'frontal', occipital: 'occipital',
    cigomatico: 'cigomatico', parietal: 'parietal', etmoides: 'etmoides', nasal: 'nasal', lagrimal: 'lagrimal', palatino: 'palatino', vomer: 'vomer', concha_inferior: 'concha_inferior',
    condilo_mandibular: 'atm', coronoides_mandibular: 'mandibula', escotadura_mandibular: 'mandibula', angulo_mandibular: 'mandibula',
    foramen_mandibular: 'region_pterigomandibular', lingula_mandibular: 'mandibula', conducto_mandibular: 'conducto_mandibular_radiologia',
    foramen_mentoniano: 'conducto_mandibular_radiologia', foramen_infraorbitario: 'v2', foramen_oval: 'v3',
    atm: 'atm', disco_articular_atm: 'atm', masetero: 'masticacion_integrada', musculo_temporal: 'masticacion_integrada',
    pterigoideo_medial: 'masticacion_integrada', pterigoideo_lateral: 'pterigoideo_lateral',
    v2: 'v2', v3: 'v3', ian: 'v3', mental: 'v3', incisive: 'v3', lingual: 'v3', infraorbital: 'v2', psa: 'v2', asa: 'v2',
    maxillary_artery: 'arteria_maxilar', inferior_alveolar_artery: 'arteria_maxilar', posterior_superior_alveolar_artery: 'arteria_maxilar'
  };

  const V2_TO_3D = {
    mandibula: { focus: ['key', 'mandibula'] }, maxilar: { focus: ['key', 'maxilar'] }, temporal: { focus: ['key', 'temporal'] },
    esfenoides: { focus: ['key', 'esfenoides'] }, frontal: { focus: ['key', 'frontal'] }, occipital: { focus: ['key', 'occipital'] },
    cigomatico: { focus: ['key', 'cigomatico'] }, parietal: { focus: ['key', 'parietal'] }, etmoides: { focus: ['key', 'etmoides'] },
    nasal: { focus: ['key', 'nasal'] }, lagrimal: { focus: ['key', 'lagrimal'] }, palatino: { focus: ['key', 'palatino'] },
    vomer: { focus: ['key', 'vomer'] }, concha_inferior: { focus: ['key', 'concha_inferior'] },
    atm: { layers: ['tmj'], focus: ['special', 'disco_articular_atm'] },
    v2: { layers: ['nerves','landmarks'], focus: ['nerve', 'v2'] },
    v3: { layers: ['nerves','landmarks'], focus: ['nerve', 'v3'] },
    ruta_v2_craneo_cara: { layers: ['nerves'], focus: ['nerve', 'v2'] },
    ruta_v3_craneo_mandibula: { layers: ['nerves','landmarks'], focus: ['nerve', 'v3'] },
    region_pterigomandibular: { layers: ['nerves','landmarks'], focus: ['nerve', 'ian'] },
    conducto_mandibular_radiologia: { layers: ['canal'], focus: ['key', 'conducto_mandibular'] },
    arteria_maxilar: { layers: ['vessels'], focus: ['vessel', 'maxillary_artery'] },
    arteria_lingual: { layers: ['vessels'], focus: ['key', 'mandibula'] },
    arteria_facial: { layers: ['vessels'], focus: ['key', 'mandibula'] },
    plexo_pterigoideo: { layers: ['vessels'], focus: ['key', 'esfenoides'] },
    masticacion_integrada: { layers: ['muscles'], focus: ['special', 'masetero'] },
    cabestrillo_pterigomaseterino: { layers: ['muscles'], focus: ['special', 'pterigoideo_medial'] },
    pterigoideo_lateral: { layers: ['muscles','tmj'], focus: ['special', 'pterigoideo_lateral'] },
    base_craneo_foramenes_integrada: { layers: ['landmarks','nerves','vessels'], focus: ['key', 'esfenoides'] },
    fosa_infratemporal: { layers: ['nerves','vessels','muscles'], focus: ['key', 'esfenoides'] },
    fosa_pterigopalatina: { layers: ['nerves','vessels'], focus: ['key', 'maxilar'] },
    paladar_duro: { focus: ['key', 'palatino'] }
  };

  const TITLE_TO_KEY = {
    'Cráneo humano': 'craneo', 'Mandíbula': 'mandibula', 'Maxilar': 'maxilar', 'Hueso temporal': 'temporal', 'Esfenoides': 'esfenoides',
    'Hueso frontal': 'frontal', 'Hueso occipital': 'occipital', 'Hueso cigomático': 'cigomatico', 'Hueso parietal': 'parietal', 'Etmoides': 'etmoides',
    'Hueso nasal': 'nasal', 'Hueso lagrimal': 'lagrimal', 'Hueso palatino': 'palatino', 'Vómer': 'vomer', 'Concha nasal inferior': 'concha_inferior',
    'Proceso condilar de la mandíbula': 'condilo_mandibular', 'Apófisis coronoides': 'coronoides_mandibular', 'Escotadura mandibular': 'escotadura_mandibular',
    'Ángulo mandibular': 'angulo_mandibular', 'Foramen mandibular': 'foramen_mandibular', 'Língula mandibular': 'lingula_mandibular',
    'Conducto mandibular': 'conducto_mandibular', 'Foramen mentoniano': 'foramen_mentoniano', 'Foramen infraorbitario': 'foramen_infraorbitario',
    'Foramen oval': 'foramen_oval', 'Articulación temporomandibular (ATM)': 'atm', 'Disco articular de la ATM': 'disco_articular_atm',
    'Músculo masetero': 'masetero', 'Músculo temporal': 'musculo_temporal', 'Músculo pterigoideo medial': 'pterigoideo_medial', 'Músculo pterigoideo lateral': 'pterigoideo_lateral'
  };

  const LAYER_BUTTON = { landmarks: 'toggleLandmarks', nerves: 'toggleNerves', vessels: 'toggleVessels', canal: 'toggleCanal', tmj: 'toggleTMJ', muscles: 'toggleMuscles' };
  let current3dKey = 'craneo';
  let currentV2Target = THREE_D_TO_V2[current3dKey];
  let academicReady = false;
  let infoObserver = null;
  let lastAcademicId = null;

  function api() { return window.AcademicV2; }
  function targetForKey(key) { return THREE_D_TO_V2[key] || key || null; }
  function ensureLayer(layer) {
    const button = document.getElementById(LAYER_BUTTON[layer]);
    if (button && button.getAttribute('aria-pressed') !== 'true') button.click();
  }
  function activateLayers(layers = []) { layers.forEach(ensureLayer); }

  function selectV2Silently(target) {
    if (!target || !api()?.open) return false;
    const ok = api().open(target, { scroll: false });
    if (!ok) return false;
    currentV2Target = target;
    updateContextAction();
    return true;
  }

  function openV2(target = currentV2Target, level = null) {
    if (!target || !api()?.open) return false;
    const ok = api().open(target, { scroll: true, ...(level ? { level } : {}) });
    if (!ok) return false;
    currentV2Target = target;
    updateContextAction();
    return true;
  }

  function focus3D(entryId) {
    const instruction = V2_TO_3D[entryId];
    if (!instruction) return false;
    activateLayers(instruction.layers || []);
    const [kind, key] = instruction.focus || [];
    let ok = false;
    if (kind === 'landmark') ok = Boolean(window.skull3dSelectLandmark?.(key));
    else if (kind === 'key') ok = Boolean(window.skull3dSelectByKey?.(key));
    else if (kind === 'nerve') ok = Boolean(window.skull3dSelectNerve?.(key));
    else if (kind === 'vessel') ok = Boolean(window.skull3dSelectVessel?.(key));
    else if (kind === 'special') ok = Boolean(window.skull3dSelectSpecial?.(key));
    if (ok) window.skull3dFocusSelection?.();
    return ok || Boolean(instruction.layers?.length);
  }

  function ensureContextAction() {
    const infoBox = document.getElementById('infoBox');
    if (!infoBox || document.getElementById('academicV2Context')) return;
    const box = document.createElement('div');
    box.id = 'academicV2Context'; box.className = 'academicV2Context';
    box.innerHTML = `<div><small>Ficha académica V2 vinculada</small><b id="academicV2ContextName">Contenido profundo disponible</b></div><button id="academicV2ContextOpen" type="button">Abrir ficha profunda</button>`;
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
    box.hidden = !entry;
    if (entry) name.textContent = entry.preferredName;
  }

  function syncFrom3DKey(key) {
    if (!key) return;
    current3dKey = key;
    const target = targetForKey(key);
    currentV2Target = target;
    if (academicReady) selectV2Silently(target); else updateContextAction();
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

  document.addEventListener('simulator:select', event => {
    const key = event.detail?.key;
    if (key) syncFrom3DKey(key);
  });

  document.addEventListener('academic-v2:select', event => {
    const id = event.detail?.id;
    if (!id || id === lastAcademicId) return;
    lastAcademicId = id;
    focus3D(id);
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
      } else if (Date.now() - started > 15000) clearInterval(timer);
    }, 120);
  }

  waitForAcademic();
})();
