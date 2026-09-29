(() => {
  const STORAGE_KEY = 'ayuda_sim_odontologia_academic_route_v2';
  const STEPS = [
    {
      id: 'mandibula', entry: 'mandibula', title: 'Mandíbula: orientación y referencias mayores', unit: 'Osteología',
      objective: 'Orientar la mandíbula y relacionar cuerpo, rama, cóndilo, coronoides, foramen mandibular, conducto y foramen mentoniano.',
      layers: ['landmarks'], focus: ['key', 'mandibula'],
      tasks: ['Orientá la pieza antes de nombrar accidentes.', 'Reconstruí foramen mandibular → conducto → foramen mentoniano.', 'Relacioná rama medial con anestesia y región pterigomandibular.'],
      recognition: { prompt: 'Identificá la mandíbula directamente sobre el modelo.', accepted: ['mandibula'], layers: [] }
    },
    {
      id: 'v3', entry: 'v3', title: 'V3: del foramen oval a sus ramas odontológicas', unit: 'Neurología',
      objective: 'Seguir V3 desde la base craneal hacia la fosa infratemporal y distinguir tronco, división anterior y posterior.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'v3'],
      tasks: ['Ubicá el foramen oval como salida de V3.', 'Separá ramas motoras y sensitivas.', 'Reconstruí alveolar inferior, lingual y auriculotemporal.'],
      recognition: { prompt: 'Sin usar etiquetas, tocá el trayecto de V3.', accepted: ['v3'], layers: ['nerves'] }
    },
    {
      id: 'pterigomandibular', entry: 'region_pterigomandibular', title: 'Región pterigomandibular', unit: 'Topografía',
      objective: 'Entender el espacio por límites, contenido y relaciones, no como un punto aislado de anestesia.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'ian'],
      tasks: ['Reconocé rama mandibular y pterigoideo medial como referencias.', 'Ubicá el paquete alveolar inferior antes de entrar al foramen.', 'Relacioná nervio lingual con el plano medial de la rama.'],
      recognition: { prompt: 'Identificá el nervio alveolar inferior en su trayecto educativo.', accepted: ['ian'], layers: ['nerves'] }
    },
    {
      id: 'v2', entry: 'v2', title: 'V2: base craneal, fosa pterigopalatina y cara', unit: 'Neurología',
      objective: 'Recorrer V2 sin saltos topográficos y vincular sus ramas dentarias, palatinas, nasales e infraorbitarias.',
      layers: ['nerves','landmarks'], focus: ['nerve', 'v2'],
      tasks: ['Partí del foramen redondo y la fosa pterigopalatina.', 'Diferenciá PSA, MSA variable y ASA.', 'Separá fibras sensitivas propias de V2 de fibras autonómicas que viajan con sus ramas.'],
      recognition: { prompt: 'Tocá el tronco de V2 en la capa nerviosa.', accepted: ['v2'], layers: ['nerves'] }
    },
    {
      id: 'arteria_maxilar', entry: 'arteria_maxilar', title: 'Arteria maxilar: tres porciones y ramas', unit: 'Angiología',
      objective: 'Estudiar la arteria maxilar por trayecto regional y no como una lista desordenada de ramas.',
      layers: ['vessels'], focus: ['vessel', 'maxillary_artery'],
      tasks: ['Reconstruí primera, segunda y tercera porción.', 'Relacioná meníngea media, alveolar inferior y ramas pterigopalatinas.', 'Vinculá arteria maxilar con fosa infratemporal y pterigopalatina.'],
      recognition: { prompt: 'Identificá la arteria maxilar en la capa vascular.', accepted: ['maxillary_artery'], layers: ['vessels'] }
    },
    {
      id: 'atm', entry: 'atm', title: 'ATM: estructura y biomecánica', unit: 'Artrología',
      objective: 'Integrar superficies articulares, disco, cápsula, ligamentos y movimientos de rotación/traslación.',
      layers: ['tmj'], focus: ['special', 'disco_articular_atm'],
      tasks: ['Ubicá cóndilo, fosa mandibular y eminencia articular.', 'Diferenciá compartimento superior e inferior.', 'Explicá por qué la apertura no es una bisagra pura.'],
      recognition: { prompt: 'Tocá el disco articular esquemático de la ATM.', accepted: ['disco_articular_atm'], layers: ['tmj'] }
    },
    {
      id: 'masticacion', entry: 'masticacion_integrada', title: 'Sistema muscular de la masticación', unit: 'Miología',
      objective: 'Comparar músculos por origen, inserción, vector, inervación y efecto sobre la mandíbula.',
      layers: ['muscles'], focus: ['special', 'masetero'],
      tasks: ['Compará masetero, temporal y pterigoideos.', 'Relacioná el cabestrillo pterigomaseterino con el ángulo.', 'Separá elevación, retrusión, protrusión y lateralidad como acciones coordinadas.'],
      recognition: { prompt: 'Identificá el músculo masetero en el modelo.', accepted: ['masetero'], layers: ['muscles'] }
    },
    {
      id: 'pterigoideo_lateral', entry: 'pterigoideo_lateral', title: 'Pterigoideo lateral y complejo disco-condilar', unit: 'Miología + ATM',
      objective: 'Profundizar el músculo que más se cruza con ATM, V3 y arteria maxilar.',
      layers: ['muscles','tmj'], focus: ['special', 'pterigoideo_lateral'],
      tasks: ['Diferenciá cabezas superior e inferior.', 'Relacioná fóvea pterigoidea con cuello condilar.', 'Explicá su participación en protrusión, apertura coordinada y lateralidad.'],
      recognition: { prompt: 'Tocá el pterigoideo lateral, no el disco ni otro músculo.', accepted: ['pterigoideo_lateral'], layers: ['muscles'] }
    },
    {
      id: 'ruta_v2', entry: 'ruta_v2_craneo_cara', title: 'Ruta integradora V2: región por región', unit: 'Topografía integradora',
      objective: 'Pasar de memorizar ramas a reconstruir una ruta anatómica continua desde cráneo hasta cara, dientes, paladar y nariz.',
      layers: ['nerves'], focus: ['nerve', 'v2'],
      tasks: ['Nombrá cada región atravesada.', 'Indicá qué rama aparece en cada nodo.', 'Vinculá fosa pterigopalatina con órbita, nariz y paladar.'],
      recognition: { prompt: 'Dentro del sistema V2, identificá el nervio infraorbitario.', accepted: ['infraorbital'], layers: ['nerves'] }
    },
    {
      id: 'base_craneo', entry: 'base_craneo_foramenes_integrada', title: 'Cierre: base de cráneo y comunicaciones', unit: 'Integración final',
      objective: 'Usar la base craneal como mapa de comunicaciones para integrar huesos, nervios, vasos y regiones profundas.',
      layers: ['landmarks','nerves','vessels'], focus: ['key', 'esfenoides'],
      tasks: ['Compará redondo, oval y espinoso.', 'Asociá cada abertura con contenido y región de destino.', 'Terminá reconstruyendo V2, V3 y meníngea media sin mirar la respuesta.'],
      recognition: { prompt: 'Para cerrar la ruta, identificá el foramen oval.', accepted: ['foramen_oval'], layers: ['landmarks'] }
    }
  ];

  const LAYER_BUTTONS = {
    landmarks: 'toggleLandmarks', nerves: 'toggleNerves', vessels: 'toggleVessels', canal: 'toggleCanal', tmj: 'toggleTMJ', muscles: 'toggleMuscles'
  };
  let index = 0;
  let activity = {};
  let host = null;
  let challenge = null;
  let challengeTimer = null;

  const $ = (id) => document.getElementById(id);
  const activityFor = (step) => activity[step.id] ||= { technical: false, oral: false, identified: false, attempts: 0 };
  const isComplete = (step) => {
    const a = activityFor(step);
    return a.technical && a.oral && a.identified;
  };

  function readState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      index = Number.isInteger(raw.index) ? Math.max(0, Math.min(STEPS.length - 1, raw.index)) : 0;
      activity = raw.activity && typeof raw.activity === 'object' ? raw.activity : {};
      if (Array.isArray(raw.completed)) {
        raw.completed.forEach(id => { activity[id] = { technical: true, oral: true, identified: true, attempts: activity[id]?.attempts || 0 }; });
      }
    } catch { index = 0; activity = {}; }
    STEPS.forEach(activityFor);
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, activity, updatedAt: new Date().toISOString() })); } catch {}
  }

  function setLayer(layer, desired) {
    const button = $(LAYER_BUTTONS[layer]);
    if (!button) return;
    const active = button.getAttribute('aria-pressed') === 'true';
    if (active !== desired) button.click();
  }
  function activateLayers(layers = []) { layers.forEach(layer => setLayer(layer, true)); }
  function isolateRecognitionLayers(layers = []) {
    Object.keys(LAYER_BUTTONS).forEach(layer => setLayer(layer, layers.includes(layer)));
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
    const a = activityFor(step);
    if (level === 'technical') a.technical = true;
    if (level === 'oral') a.oral = true;
    saveState(); render();
    window.AcademicV2.open(step.entry, { level, scroll: true });
  }
  function questionFor(step) {
    const entry = window.AcademicV2?.entries?.().find(item => item.id === step.entry);
    return entry?.exam?.questions?.[0] || null;
  }

  function mountRecognitionPrompt() {
    const stage = $('skullStage');
    if (!stage) return null;
    let prompt = $('academicRecognitionPrompt');
    if (prompt) return prompt;
    prompt = document.createElement('div');
    prompt.id = 'academicRecognitionPrompt';
    prompt.className = 'academicRecognitionPrompt';
    prompt.innerHTML = `<div><b id="academicRecognitionTitle">Desafío 3D</b><span id="academicRecognitionText">Tocá la estructura indicada.</span></div><button id="academicRecognitionCancel" type="button">Cancelar</button>`;
    stage.appendChild(prompt);
    $('academicRecognitionCancel')?.addEventListener('click', cancelChallenge);
    return prompt;
  }
  function updateChallengePrompt(kind = 'neutral', title = 'Desafío 3D', text = '') {
    const prompt = mountRecognitionPrompt();
    if (!prompt) return;
    prompt.classList.remove('correct', 'wrong');
    if (kind === 'correct' || kind === 'wrong') prompt.classList.add(kind);
    if ($('academicRecognitionTitle')) $('academicRecognitionTitle').textContent = title;
    if ($('academicRecognitionText')) $('academicRecognitionText').textContent = text;
  }
  function cancelChallenge() {
    if (challengeTimer) clearTimeout(challengeTimer);
    challengeTimer = null;
    challenge = null;
    document.body.classList.remove('academicRecognitionActive');
    const prompt = $('academicRecognitionPrompt');
    prompt?.classList.remove('correct', 'wrong');
  }
  function startChallenge(step) {
    cancelChallenge();
    window.skull3dReset?.();
    isolateRecognitionLayers(step.recognition.layers || []);
    window.skull3dSelectByKey?.(null);
    challenge = { stepId: step.id, accepted: new Set(step.recognition.accepted || []), attempts: 0 };
    document.body.classList.add('academicRecognitionActive');
    updateChallengePrompt('neutral', 'Desafío de reconocimiento 3D', step.recognition.prompt);
    $('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function finishChallenge(step, key, sourceName) {
    const a = activityFor(step);
    a.identified = true;
    a.attempts = Math.max(a.attempts || 0, challenge?.attempts || 1);
    saveState();
    updateChallengePrompt('correct', '✓ Identificación correcta', `${sourceName || key}. Volvé a la ruta para continuar con el siguiente objetivo.`);
    document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Ruta académica · reconocimiento 3D', target: step.entry, correct: true } }));
    challenge = null;
    render();
    challengeTimer = setTimeout(() => { document.body.classList.remove('academicRecognitionActive'); $('academicRecognitionPrompt')?.classList.remove('correct'); }, 1600);
    setTimeout(() => window.AcademicV2?.open(step.entry, { scroll: false }), 0);
  }
  function evaluateRecognition(event) {
    if (!challenge) return;
    const step = STEPS.find(item => item.id === challenge.stepId);
    const key = event.detail?.key;
    if (!step || !key || key === 'craneo') return;
    challenge.attempts += 1;
    const a = activityFor(step);
    a.attempts = Math.max(a.attempts || 0, challenge.attempts);
    if (challenge.accepted.has(key)) {
      finishChallenge(step, key, event.detail?.sourceName);
      return;
    }
    saveState();
    updateChallengePrompt('wrong', 'Todavía no', `Elegiste ${event.detail?.sourceName || 'otra estructura'}. Probá nuevamente sin usar etiquetas.`);
    document.dispatchEvent(new CustomEvent('simulator:practice-result', { detail: { mode: 'Ruta académica · reconocimiento 3D', target: step.entry, correct: false } }));
    challengeTimer = setTimeout(() => {
      if (challenge?.stepId === step.id) updateChallengePrompt('neutral', 'Desafío de reconocimiento 3D', step.recognition.prompt);
    }, 850);
  }

  function mount() {
    if ($('academicStudyRoute')) return $('academicStudyRoute');
    const section = document.createElement('section');
    section.id = 'academicStudyRoute'; section.className = 'academicStudyRoute';
    const guide = $('studyGuide');
    if (guide) guide.after(section); else document.querySelector('.simViewerColumn')?.append(section);
    document.body.classList.add('academicRouteReady');
    mountRecognitionPrompt();
    return section;
  }

  function render() {
    if (!host) return;
    const step = STEPS[index];
    const a = activityFor(step);
    const completedCount = STEPS.filter(isComplete).length;
    const milestoneCount = STEPS.reduce((sum, item) => {
      const x = activityFor(item);
      return sum + Number(x.technical) + Number(x.oral) + Number(x.identified);
    }, 0);
    const pct = Math.round((milestoneCount / (STEPS.length * 3)) * 100);
    const question = questionFor(step);
    const done = isComplete(step);
    host.innerHTML = `
      <div class="academicStudyRouteHead">
        <span class="simEy">Modo Estudiar · ruta 3D + teoría + oral</span>
        <h3>Ruta anatómica avanzada</h3>
        <p>No memorices fichas aisladas: observá la estructura, estudiá sus relaciones, defendela como en un oral y reconocela sin etiquetas.</p>
        <div class="academicStudyProgress"><div class="academicStudyProgressTrack"><span style="width:${pct}%"></span></div><b>${completedCount}/${STEPS.length} pasos · ${milestoneCount}/30 hitos</b></div>
      </div>
      <div class="academicStudyBody">
        <div class="academicStudyStepMeta"><span class="academicStudyPill">Paso ${index + 1} de ${STEPS.length}</span><span class="academicStudyPill">${step.unit}</span>${done ? '<span class="academicStudyPill ok">✓ dominio completo</span>' : '<span class="academicStudyPill pending">en progreso</span>'}</div>
        <h4>${step.title}</h4>
        <p class="academicStudyObjective">${step.objective}</p>
        <div class="academicStudyMilestones">
          <span class="academicStudyMilestone ${a.technical ? 'ok' : ''}">📚 Técnico ${a.technical ? '✓' : 'pendiente'}</span>
          <span class="academicStudyMilestone ${a.oral ? 'ok' : ''}">🎤 Oral ${a.oral ? '✓' : 'pendiente'}</span>
          <span class="academicStudyMilestone ${a.identified ? 'ok' : ''}">🎯 3D ${a.identified ? '✓' : 'pendiente'}</span>
        </div>
        <div class="academicStudyTasks">${step.tasks.map((task, i) => `<div class="academicStudyTask"><b>${i + 1}. Punto de control</b>${task}</div>`).join('')}</div>
        ${question ? `<div class="academicStudyOral"><strong>Pregunta de oral del paso</strong><p>${question.prompt}</p></div>` : ''}
        <div class="academicStudyActions">
          <button type="button" id="academicStudy3d">Explorar / enfocar en 3D</button>
          <button type="button" id="academicStudyTechnical" class="${a.technical ? 'done' : ''}">${a.technical ? '✓ ' : ''}Estudiar Técnico</button>
          <button type="button" id="academicStudyOral" class="${a.oral ? 'done' : ''}">${a.oral ? '✓ ' : ''}Entrenar Oral</button>
          <button type="button" id="academicStudyChallenge" class="${a.identified ? 'done' : 'challenge'}">${a.identified ? '✓ Repetir desafío 3D' : '🎯 Desafío 3D'}</button>
        </div>
        <div class="academicRecognitionSummary">Intentos de reconocimiento registrados en este paso: ${a.attempts || 0}. El paso se completa cuando se visitó Técnico, se entrenó Oral y se identificó correctamente la estructura en 3D.</div>
        <div class="academicStudyHint">Las capas amarillas, rojas, violetas y musculares son reconstrucciones educativas esquemáticas. La teoría profunda proviene del corpus V2 estructurado.</div>
        <div class="academicStudyNav"><button type="button" id="academicStudyPrev" ${index === 0 ? 'disabled' : ''}>← Anterior</button><button type="button" id="academicStudyNext" ${index === STEPS.length - 1 ? 'disabled' : ''}>Siguiente →</button></div>
      </div>`;
    $('academicStudy3d')?.addEventListener('click', () => focusStep(step));
    $('academicStudyTechnical')?.addEventListener('click', () => openAcademic(step, 'technical'));
    $('academicStudyOral')?.addEventListener('click', () => openAcademic(step, 'oral'));
    $('academicStudyChallenge')?.addEventListener('click', () => startChallenge(step));
    $('academicStudyPrev')?.addEventListener('click', () => { if (index > 0) { cancelChallenge(); index -= 1; saveState(); render(); } });
    $('academicStudyNext')?.addEventListener('click', () => { if (index < STEPS.length - 1) { cancelChallenge(); index += 1; saveState(); render(); } });
  }

  function boot() {
    readState(); host = mount(); render();
    document.addEventListener('academic-v2:ready', render);
    document.addEventListener('simulator:select', evaluateRecognition);
    document.querySelectorAll('.simMode').forEach(button => button.addEventListener('click', () => { if (button.dataset.mode !== 'estudiar') cancelChallenge(); }));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
