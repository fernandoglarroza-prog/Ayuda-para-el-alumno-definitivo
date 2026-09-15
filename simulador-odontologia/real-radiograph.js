(() => {
  const parent = document.getElementById('radiologyModule');
  if (!parent || document.getElementById('realRadiographCase')) return;

  const structures = {
    condilo_mandibular: { name: 'Cóndilo mandibular', note: 'Buscalo en el extremo superior de cada rama. En una panorámica real su forma y magnificación pueden variar por posicionamiento.' },
    coronoides_mandibular: { name: 'Apófisis coronoides', note: 'Proyección triangular anterior al cóndilo. La escotadura mandibular ayuda a separarlas visualmente.' },
    seno_maxilar: { name: 'Seno maxilar', note: 'Región radiolúcida superior a premolares y molares. El piso puede acercarse mucho a las raíces posteriores.' },
    conducto_mandibular: { name: 'Conducto mandibular', note: 'Seguí una banda radiolúcida con límites corticales desde la rama hacia el cuerpo. Su nitidez cambia a lo largo del trayecto.' },
    foramen_mentoniano: { name: 'Foramen mentoniano', note: 'Buscalo en la región premolar inferior. Puede superponerse con ápices, por eso la continuidad con el conducto es una pista útil.' },
    angulo_mandibular: { name: 'Ángulo mandibular', note: 'Transición posteroinferior entre cuerpo y rama. Es una referencia topográfica amplia, no un punto matemático único.' }
  };

  const guides = [
    ['condilo_mandibular', 6.5, 20, 4.5, 8], ['condilo_mandibular', 93.5, 20, 4.5, 8],
    ['coronoides_mandibular', 15.5, 31, 4.2, 7], ['coronoides_mandibular', 84.5, 31, 4.2, 7],
    ['seno_maxilar', 31.5, 35, 11, 12], ['seno_maxilar', 68.5, 35, 11, 12],
    ['conducto_mandibular', 27, 70, 13, 6], ['conducto_mandibular', 73, 70, 13, 6],
    ['foramen_mentoniano', 41.5, 72, 3.2, 5], ['foramen_mentoniano', 58.5, 72, 3.2, 5],
    ['angulo_mandibular', 12, 78, 5.5, 8], ['angulo_mandibular', 88, 78, 5.5, 8]
  ];

  const section = document.createElement('section');
  section.id = 'realRadiographCase';
  section.className = 'realCase';
  section.innerHTML = `
    <div class="realCaseHead">
      <div>
        <span class="simEy">Caso abierto 1 · panorámica real</span>
        <h2>Del esquema a una radiografía verdadera</h2>
        <p>Usá esta panorámica real para reconocer las mismas referencias del simulador. Las guías son zonas educativas orientativas y no equivalen a una segmentación ni a una medición clínica.</p>
      </div>
      <div class="realCaseActions">
        <button type="button" id="realToggleGuides" class="active">Guías: visibles</button>
        <button type="button" id="realPractice">Practicar caso real</button>
      </div>
    </div>
    <div class="realCaseGrid">
      <div class="realImageWrap">
        <img id="realPanoImage" src="https://upload.wikimedia.org/wikipedia/commons/8/82/X-ray_of_all_32_human_teeth.jpg" alt="Radiografía panorámica dental real de un adulto, utilizada como caso educativo abierto">
        <div id="realGuides" class="realGuides" aria-label="Regiones anatómicas orientativas"></div>
        <div id="realQuizBanner" class="realQuizBanner" hidden></div>
      </div>
      <aside class="realCasePanel">
        <span class="radLabel">Imagen clínica real · uso educativo</span>
        <h3 id="realTitle">Elegí una región</h3>
        <p id="realNote">Tocá una de las guías sobre la panorámica para compararla con su equivalente en el cráneo 3D.</p>
        <div class="realCaseButtons" id="realCaseButtons"></div>
        <button type="button" id="realShow3d" class="primary" disabled>Comparar selección en 3D</button>
        <div class="realLicense"><b>Fuente y licencia</b><br>“X-ray of all 32 human teeth”, Ruhrfisch, 2011, Wikimedia Commons. Licencia seleccionada para este uso: CC BY-SA 4.0. Imagen original sin recorte ni alteración; las guías se superponen en la web como una capa independiente.</div>
        <a class="realSourceLink" href="https://commons.wikimedia.org/wiki/File:X-ray_of_all_32_human_teeth.jpg" target="_blank" rel="noopener noreferrer">Ver archivo y licencia original ↗</a>
      </aside>
    </div>`;
  parent.insertAdjacentElement('afterend', section);

  const guideHost = section.querySelector('#realGuides');
  const title = section.querySelector('#realTitle');
  const note = section.querySelector('#realNote');
  const show3d = section.querySelector('#realShow3d');
  const quizBanner = section.querySelector('#realQuizBanner');
  const practiceButton = section.querySelector('#realPractice');
  const toggleGuides = section.querySelector('#realToggleGuides');
  const buttonHost = section.querySelector('#realCaseButtons');
  let selected = null;
  let guidesVisible = true;
  let quiz = false;
  let quizTarget = null;
  let attempts = 0;
  let correct = 0;

  for (const [key, d] of Object.entries(structures)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = d.name;
    b.dataset.realChip = key;
    b.addEventListener('click', () => { if (!quiz) select(key); });
    buttonHost.appendChild(b);
  }

  guides.forEach(([key, x, y, w, h], index) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'realGuide';
    b.dataset.realKey = key;
    b.style.left = `${x}%`;
    b.style.top = `${y}%`;
    b.style.width = `${w}%`;
    b.style.height = `${h}%`;
    b.setAttribute('aria-label', structures[key].name + (index % 2 === 0 ? ' derecha/izquierda según orientación radiográfica' : ' lado contralateral'));
    b.addEventListener('click', () => quiz ? answer(key) : select(key));
    guideHost.appendChild(b);
  });

  function select(key) {
    if (!structures[key]) return;
    selected = key;
    title.textContent = structures[key].name;
    note.textContent = structures[key].note;
    show3d.disabled = false;
    section.querySelectorAll('[data-real-chip]').forEach((b) => b.classList.toggle('active', b.dataset.realChip === key));
    section.querySelectorAll('[data-real-key]').forEach((b) => b.classList.toggle('active', b.dataset.realKey === key));
  }

  function newQuestion() {
    const pool = ['conducto_mandibular','foramen_mentoniano','seno_maxilar','condilo_mandibular','coronoides_mandibular','angulo_mandibular'];
    quizTarget = pool[Math.floor(Math.random() * pool.length)];
    quizBanner.textContent = `Identificá en la panorámica real: ${structures[quizTarget].name}`;
    section.querySelectorAll('[data-real-key]').forEach((b) => b.classList.remove('active'));
  }

  function startQuiz() {
    quiz = true; attempts = 0; correct = 0;
    quizBanner.hidden = false;
    practiceButton.textContent = 'Terminar práctica';
    section.classList.add('realQuizMode');
    newQuestion();
  }

  function endQuiz() {
    quiz = false;
    quizBanner.hidden = true;
    practiceButton.textContent = 'Practicar caso real';
    section.classList.remove('realQuizMode');
    if (selected) select(selected);
  }

  function answer(key) {
    attempts += 1;
    if (key === quizTarget) {
      correct += 1;
      quizBanner.textContent = `✓ Correcto · ${correct}/${attempts}`;
    } else {
      quizBanner.textContent = `✕ Era ${structures[quizTarget].name} · ${correct}/${attempts}`;
    }
    setTimeout(() => { if (quiz) newQuestion(); }, 900);
  }

  toggleGuides.addEventListener('click', () => {
    guidesVisible = !guidesVisible;
    guideHost.classList.toggle('hiddenGuides', !guidesVisible);
    toggleGuides.classList.toggle('active', guidesVisible);
    toggleGuides.textContent = guidesVisible ? 'Guías: visibles' : 'Guías: ocultas';
  });
  practiceButton.addEventListener('click', () => quiz ? endQuiz() : startQuiz());
  show3d.addEventListener('click', () => {
    if (!selected) return;
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: selected, sourceName: 'Caso panorámico real' } }));
    document.getElementById('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();