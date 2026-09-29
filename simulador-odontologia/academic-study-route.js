(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_academic_route_v2';
  const STEPS = [
    {
      id: 'mandibula', entry: 'mandibula', title: 'Mandíbula: orientación y referencias mayores', unit: 'Osteología',
      objective: 'Orientar la mandíbula y relacionar cuerpo, rama, cóndilo, coronoides, foramen mandibular, conducto y foramen mentoniano.',
      layers: ['landmarks'], focus: ['key', 'mandibula'],
      tasks: ['Orientá la pieza antes de nombrar accidentes.', 'Reconstruí foramen mandibular → conducto → foramen mentoniano.', 'Relacioná rama medial con anestesia y región pterigomandibular.']
    },
    {
      id: 'v3', entry: 'v3', title: 'V3: del foramen oval a sus ramas odontológicas', unit: 'Neurología',
      objective: 'Seguir V3 desde la base craneal hacia la fosa infratemporal y distinguir tronco, división anterior y posterior.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'v3'],
      tasks: ['Ubicá el foramen oval como salida de V3.', 'Separá ramas motoras y sensitivas.', 'Reconstruí alveolar inferior, lingual y auriculotemporal.']
    },
    {
      id: 'pterigomandibular', entry: 'region_pterigomandibular', title: 'Región pterigomandibular', unit: 'Topografía',
      objective: 'Entender el espacio por límites, contenido y relaciones, no como un punto aislado de anestesia.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'ian'],
      tasks: ['Reconocé rama mandibular y pterigoideo medial como referencias.', 'Ubicá el paquete alveolar inferior antes de entrar al foramen.', 'Relacioná nervio lingual con el plano medial de la rama.']
    },
    {
      id: 'v2', entry: 'v2', title: 'V2: base craneal, fosa pterigopalatina y cara', unit: 'Neurología',
      objective: 'Recorrer V2 sin saltos topográficos y vincular sus ramas dentarias, palatinas, nasales e infraorbitarias.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'v2'],
      tasks: ['Partí del foramen redondo y la fosa pterigopalatina.', 'Diferenciá PSA, MSA variable y ASA.', 'Separá fibras sensitivas propias de V2 de fibras autonómicas que viajan con sus ramas.']
    },
    {
      id: 'arteria_maxilar', entry: 'arteria_maxilar', title: 'Arteria maxilar: tres porciones y ramas', unit: 'Angiología',
      objective: 'Estudiar la arteria maxilar por trayecto regional y no como una lista desordenada de ramas.',
      layers: ['vessels'], focus: ['vessel', 'maxillary_artery'],
      tasks: ['Reconstruí primera, segunda y tercera porción.', 'Relacioná meníngea media, alveolar inferior y ramas pterigopalatinas.', 'Vinculá arteria maxilar con fosa infratemporal y pterigopalatina.']
    },
    {
      id: 'atm', entry: 'atm', title: 'ATM: estructura y biomecánica', unit: 'Artrología',
      objective: 'Integrar superficies articulares, disco, cápsula, ligamentos y movimientos de rotación/traslación.',
      layers: ['tmj'], focus: ['special', 'disco_articular_atm'],
      tasks: ['Ubicá cóndilo, fosa mandibular y eminencia articular.', 'Diferenciá compartimento superior e inferior.', 'Explicá por qué la apertura no es una bisagra pura.']
    },
    {
      id: 'masticacion', entry: 'masticacion_integrada', title: 'Sistema muscular de la masticación', unit: 'Miología',
      objective: 'Comparar músculos por origen, inserción, vector, inervación y efecto sobre la mandíbula.',
      layers: ['muscles'], focus: ['special', 'masetero'],
      tasks: ['Compará masetero, temporal y pterigoideos.', 'Relacioná el cabestrillo pterigomaseterino con el ángulo.', 'Separá elevación, retrusión, protrusión y lateralidad como acciones coordinadas.']
    },
    {
      id: 'pterigoideo_lateral', entry: 'pterigoideo_lateral', title: 'Pterigoideo lateral y complejo disco-condilar', unit: 'Miología + ATM',
      objective: 'Profundizar el músculo que más se cruza con ATM, V3 y arteria maxilar.',
      layers: ['muscles','tmj'], focus: ['special', 'pterigoideo_lateral'],
      tasks: ['Diferenciá cabezas superior e inferior.', 'Relacioná fóvea pterigoidea con cuello condilar.', 'Explicá su participación en protrusión, apertura coordinada y lateralidad.']
    },
    {
      id: 'ruta_v2', entry: 'ruta_v2_craneo_cara', title: 'Ruta integradora V2: región por región', unit: 'Topografía integradora',
      objective: 'Pasar de memorizar ramas a reconstruir una ruta anatómica continua desde cráneo hasta cara, dientes, paladar y nariz.',
      layers: ['nerves'], focus: ['nerve', 'v2'],
      tasks: ['Nombrá cada región atravesada.', 'Indicá qué rama aparece en cada nodo.', 'Vinculá fosa pterigopalatina con órbita, nariz y paladar.']
    },
    {
      id: 'base_craneo', entry: 'base_craneo_foramenes_integrada', title: 'Cierre: base de cráneo y comunicaciones', unit: 'Integración final',
      objective: 'Usar la base craneal como mapa de comunicaciones para integrar huesos, nervios, vasos y regiones profundas.',
      layers: ['landmarks','nerves','vessels'], focus: ['key', 'esfenoides'],
      tasks: ['Compará redondo, oval y espinoso.', 'Asociá cada abertura con contenido y región de destino.', 'Terminá reconstruyendo V2, V3 y meníngea media sin mirar la respuesta.']
    }
  ];

  let index = 0;
  let completed = new Set();
  let host = null;

  const $ = (id) => document.getElementById(id);
  const readState = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      index = Number.isInteger(raw.index) ? Math.max(0, Math.min(STEPS.length - 1, raw.index)) : 0;
      completed = new Set(Array.isArray(raw.completed) ? raw.completed : []);
    } catch { index = 0; completed = new Set(); }
  };
  const saveState = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, completed: [...completed], updatedAt: new Date().toISOString() })); } catch {}
  };

  function ensureLayer(id) {
    const button = $(id);
    if (!button) return;
    if (button.getAttribute('aria-pressed') !== 'true') button.click();
  }
  function activateLayers(layers = []) {
    if (layers.includes('landmarks')) ensureLayer('toggleLandmarks');
    if (layers.includes('nerves')) ensureLayer('toggleNerves');
    if (layers.includes('vessels')) ensureLayer('toggleVessels');
    if (layers.includes('tmj')) ensureLayer('toggleTMJ');
    if (layers.includes('muscles')) ensureLayer('toggleMuscles');
  }
  function focusStep(step) {
    activateLayers(step.layers);
    const [kind, key] = step.focus || [];
    let ok = false;
    if (kind === 'landmark') ok = Boolean(window.skull3dSelectLandmark?.(key));
    else if (kind === 'key') ok = Boolean(window.skull3dSelectByKey?.(key));
    else if (kind === 'nerve') ok = Boolean(window.skull3dSelectNerve?.(key));
    else if (kind === 'vessel') ok = Boolean(window.skull3dSelectVessel?.(key));
    else if (kind === 'special') ok = Boolean(window.skull3dSelectSpecial?.(key));
    if (ok) window.skull3dFocusSelection?.();
    $('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function openAcademic(step, level) {
    if (!window.AcademicV2?.open) return;
    window.AcademicV2.open(step.entry, { level, scroll: true });
  }
  function questionFor(step) {
    const entry = window.AcademicV2?.entries?.().find(item => item.id === step.entry);
    return entry?.exam?.questions?.[0] || null;
  }

  function mount() {
    if ($('academicStudyRoute')) return $('academicStudyRoute');
    const section = document.createElement('section');
    section.id = 'academicStudyRoute'; section.className = 'academicStudyRoute';
    const guide = $('studyGuide');
    if (guide) guide.after(section); else document.querySelector('.simViewerColumn')?.append(section);
    document.body.classList.add('academicRouteReady');
    return section;
  }

  function render() {
    if (!host) return;
    const step = STEPS[index], done = completed.has(step.id), pct = Math.round((completed.size / STEPS.length) * 100), question = questionFor(step);
    host.innerHTML = `
      <div class="academicStudyRouteHead">
        <span class="simEy">Modo Estudiar · ruta 3D + teoría + oral</span>
        <h3>Ruta anatómica avanzada</h3>
        <p>No memorices fichas aisladas: observá la estructura, estudiá sus relaciones y defendela como en un oral.</p>
        <div class="academicStudyProgress"><div class="academicStudyProgressTrack"><span style="width:${pct}%"></span></div><b>${completed.size}/${STEPS.length} · ${pct}%</b></div>
      </div>
      <div class="academicStudyBody">
        <div class="academicStudyStepMeta"><span class="academicStudyPill">Paso ${index + 1} de ${STEPS.length}</span><span class="academicStudyPill">${step.unit}</span>${done ? '<span class="academicStudyPill">✓ completado</span>' : ''}</div>
        <h4>${step.title}</h4>
        <p class="academicStudyObjective">${step.objective}</p>
        <div class="academicStudyTasks">${step.tasks.map((task, i) => `<div class="academicStudyTask"><b>${i + 1}. Punto de control</b>${task}</div>`).join('')}</div>
        ${question ? `<div class="academicStudyOral"><strong>Pregunta de oral del paso</strong><p>${question.prompt}</p></div>` : ''}
        <div class="academicStudyActions">
          <button type="button" id="academicStudy3d">Ver / enfocar en 3D</button>
          <button type="button" id="academicStudyTechnical">Abrir Técnico</button>
          <button type="button" id="academicStudyOral">Entrenar Oral</button>
          <button type="button" id="academicStudyDone" class="${done ? 'done' : 'primary'}">${done ? '✓ Comprendido' : 'Marcar comprendido'}</button>
        </div>
        <div class="academicStudyHint">Las capas amarillas, rojas, violetas y musculares son reconstrucciones educativas esquemáticas. La teoría profunda proviene del corpus V2 estructurado.</div>
        <div class="academicStudyNav"><button type="button" id="academicStudyPrev" ${index === 0 ? 'disabled' : ''}>← Anterior</button><button type="button" id="academicStudyNext" ${index === STEPS.length - 1 ? 'disabled' : ''}>Siguiente →</button></div>
      </div>`;
    $('academicStudy3d')?.addEventListener('click', () => focusStep(step));
    $('academicStudyTechnical')?.addEventListener('click', () => openAcademic(step, 'technical'));
    $('academicStudyOral')?.addEventListener('click', () => openAcademic(step, 'oral'));
    $('academicStudyDone')?.addEventListener('click', () => { if (done) completed.delete(step.id); else completed.add(step.id); saveState(); render(); });
    $('academicStudyPrev')?.addEventListener('click', () => { if (index > 0) { index -= 1; saveState(); render(); } });
    $('academicStudyNext')?.addEventListener('click', () => { if (index < STEPS.length - 1) { index += 1; saveState(); render(); } });
  }

  function boot() {
    readState(); host = mount(); render();
    document.addEventListener('academic-v2:ready', render);
    document.addEventListener('academic-v2:select', () => { if (document.body.dataset.simMode === 'estudiar') render(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
