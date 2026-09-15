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

  const cases = [
    {
      id: 'caso1', label: 'Caso 1', title: 'Adulto con dentición completa',
      image: 'https://upload.wikimedia.org/wikipedia/commons/8/82/X-ray_of_all_32_human_teeth.jpg',
      alt: 'Radiografía panorámica real de un adulto con 32 dientes',
      author: 'Ruhrfisch', year: '2011', license: 'CC BY-SA 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:X-ray_of_all_32_human_teeth.jpg',
      context: 'Panorámica de un adulto con 32 dientes y sin restauraciones visibles. Útil como primer caso para orientación anatómica.',
      guides: [
        ['condilo_mandibular',6.5,20,4.5,8],['condilo_mandibular',93.5,20,4.5,8],
        ['coronoides_mandibular',15.5,31,4.2,7],['coronoides_mandibular',84.5,31,4.2,7],
        ['seno_maxilar',31.5,35,11,12],['seno_maxilar',68.5,35,11,12],
        ['conducto_mandibular',27,70,13,6],['conducto_mandibular',73,70,13,6],
        ['foramen_mentoniano',41.5,72,3.2,5],['foramen_mentoniano',58.5,72,3.2,5],
        ['angulo_mandibular',12,78,5.5,8],['angulo_mandibular',88,78,5.5,8]
      ]
    },
    {
      id: 'caso2', label: 'Caso 2', title: 'Adulto mayor con restauraciones',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/PAN_TEETH.jpg',
      alt: 'Radiografía panorámica real de un adulto mayor con múltiples restauraciones',
      author: 'Timpo', year: '2011', license: 'Dominio público / CC BY-SA 3.0',
      source: 'https://commons.wikimedia.org/wiki/File:PAN_TEETH.jpg',
      context: 'Paciente de 64 años con múltiples restauraciones y terceros molares inferiores retenidos. Sirve para aprender a reconocer referencias con superposiciones y material radiopaco.',
      guides: [
        ['condilo_mandibular',8,24,5,9],['condilo_mandibular',92,24,5,9],
        ['coronoides_mandibular',16,34,4.5,7],['coronoides_mandibular',84,34,4.5,7],
        ['seno_maxilar',31,30,11,11],['seno_maxilar',69,30,11,11],
        ['conducto_mandibular',29,72,13,6],['conducto_mandibular',71,72,13,6],
        ['foramen_mentoniano',42,70,3.4,5],['foramen_mentoniano',58,70,3.4,5],
        ['angulo_mandibular',13,74,6,9],['angulo_mandibular',87,74,6,9]
      ]
    },
    {
      id: 'caso3', label: 'Caso 3', title: 'Adulto joven sin terceros molares',
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Dental_Panorama_X-ray.jpg',
      alt: 'Radiografía panorámica real de un adulto joven sin terceros molares',
      author: 'Farhang Amini', year: '2021', license: 'CC BY 4.0',
      source: 'https://commons.wikimedia.org/wiki/File:Dental_Panorama_X-ray.jpg',
      context: 'Adulto de 21 años sin terceros molares. La imagen tiene menos material restaurador y permite comparar cómo cambian las referencias entre pacientes.',
      guides: [
        ['condilo_mandibular',7.5,25,5,9],['condilo_mandibular',92.5,25,5,9],
        ['coronoides_mandibular',16,35,4.6,7],['coronoides_mandibular',84,35,4.6,7],
        ['seno_maxilar',31,31,11,11],['seno_maxilar',69,31,11,11],
        ['conducto_mandibular',28,72,13,6],['conducto_mandibular',72,72,13,6],
        ['foramen_mentoniano',41,69,3.2,5],['foramen_mentoniano',59,69,3.2,5],
        ['angulo_mandibular',12.5,77,5.5,9],['angulo_mandibular',87.5,77,5.5,9]
      ]
    }
  ];

  const section = document.createElement('section');
  section.id = 'realRadiographCase';
  section.className = 'realCase';
  section.innerHTML = `
    <div class="realCaseHead">
      <div>
        <span class="simEy">Biblioteca de panorámicas reales</span>
        <h2>La misma anatomía en pacientes diferentes</h2>
        <p>Compará casos reales para aprender variabilidad anatómica y efectos de posicionamiento, restauraciones y ausencia dentaria. Las guías son regiones educativas orientativas, no segmentaciones clínicas.</p>
      </div>
      <div class="realCaseActions">
        <button type="button" id="realToggleGuides" class="active">Guías: visibles</button>
        <button type="button" id="realPractice">Practicar casos aleatorios</button>
      </div>
    </div>
    <div id="realCaseTabs" class="realCaseTabs" aria-label="Seleccionar panorámica"></div>
    <div class="realCaseGrid">
      <div class="realImageWrap">
        <img id="realPanoImage" alt="Radiografía panorámica dental real utilizada como caso educativo abierto">
        <div id="realGuides" class="realGuides" aria-label="Regiones anatómicas orientativas"></div>
        <div id="realQuizBanner" class="realQuizBanner" hidden></div>
      </div>
      <aside class="realCasePanel">
        <span class="radLabel" id="realCaseLabel">Caso real</span>
        <h3 id="realCaseName"></h3>
        <p id="realCaseContext"></p>
        <hr class="realDivider">
        <h3 id="realTitle">Elegí una región</h3>
        <p id="realNote">Tocá una de las guías sobre la panorámica para compararla con su equivalente en el cráneo 3D.</p>
        <div class="realCaseButtons" id="realCaseButtons"></div>
        <button type="button" id="realShow3d" class="primary" disabled>Comparar selección en 3D</button>
        <div class="realLicense" id="realLicense"></div>
        <a class="realSourceLink" id="realSourceLink" target="_blank" rel="noopener noreferrer">Ver archivo y licencia original ↗</a>
      </aside>
    </div>`;
  parent.insertAdjacentElement('afterend', section);

  const image = section.querySelector('#realPanoImage');
  const guideHost = section.querySelector('#realGuides');
  const title = section.querySelector('#realTitle');
  const note = section.querySelector('#realNote');
  const show3d = section.querySelector('#realShow3d');
  const quizBanner = section.querySelector('#realQuizBanner');
  const practiceButton = section.querySelector('#realPractice');
  const toggleGuides = section.querySelector('#realToggleGuides');
  const buttonHost = section.querySelector('#realCaseButtons');
  const tabs = section.querySelector('#realCaseTabs');
  const caseLabel = section.querySelector('#realCaseLabel');
  const caseName = section.querySelector('#realCaseName');
  const caseContext = section.querySelector('#realCaseContext');
  const license = section.querySelector('#realLicense');
  const sourceLink = section.querySelector('#realSourceLink');

  let currentCaseIndex = 0;
  let selected = null;
  let guidesVisible = true;
  let quiz = false;
  let quizTarget = null;
  let attempts = 0;
  let correct = 0;
  let quizCaseIndex = 0;

  for (const [key, d] of Object.entries(structures)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = d.name;
    b.dataset.realChip = key;
    b.addEventListener('click', () => { if (!quiz) select(key); });
    buttonHost.appendChild(b);
  }

  cases.forEach((c, index) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = c.label;
    b.dataset.caseIndex = String(index);
    b.addEventListener('click', () => { if (!quiz) renderCase(index); });
    tabs.appendChild(b);
  });
  const randomButton = document.createElement('button');
  randomButton.type = 'button';
  randomButton.textContent = '🎲 Caso aleatorio';
  randomButton.addEventListener('click', () => { if (!quiz) renderCase(randomDifferent(currentCaseIndex)); });
  tabs.appendChild(randomButton);

  function randomDifferent(index) {
    if (cases.length < 2) return 0;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * cases.length);
    return next;
  }

  function buildGuides(c) {
    guideHost.innerHTML = '';
    c.guides.forEach(([key, x, y, w, h], index) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'realGuide';
      b.dataset.realKey = key;
      b.style.left = `${x}%`;
      b.style.top = `${y}%`;
      b.style.width = `${w}%`;
      b.style.height = `${h}%`;
      b.setAttribute('aria-label', `${structures[key].name}, región ${index % 2 === 0 ? 'derecha' : 'izquierda'} de la imagen`);
      b.addEventListener('click', () => quiz ? answer(key) : select(key));
      guideHost.appendChild(b);
    });
    guideHost.classList.toggle('hiddenGuides', !guidesVisible);
  }

  function renderCase(index) {
    currentCaseIndex = Math.max(0, Math.min(index, cases.length - 1));
    const c = cases[currentCaseIndex];
    image.src = c.image;
    image.alt = c.alt;
    caseLabel.textContent = `${c.label} · panorámica real`;
    caseName.textContent = c.title;
    caseContext.textContent = c.context;
    license.innerHTML = `<b>Fuente y licencia</b><br>${c.author}, ${c.year}, Wikimedia Commons. ${c.license}. Imagen clínica mostrada sin edición; nuestras guías son una capa web independiente.`;
    sourceLink.href = c.source;
    buildGuides(c);
    tabs.querySelectorAll('[data-case-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.caseIndex) === currentCaseIndex));
    selected = null;
    title.textContent = 'Elegí una región';
    note.textContent = 'Tocá una de las guías sobre la panorámica para compararla con su equivalente en el cráneo 3D.';
    show3d.disabled = true;
    buttonHost.querySelectorAll('[data-real-chip]').forEach((b) => b.classList.remove('active'));
  }

  function select(key) {
    if (!structures[key]) return;
    selected = key;
    title.textContent = structures[key].name;
    note.textContent = structures[key].note;
    show3d.disabled = false;
    section.querySelectorAll('[data-real-chip]').forEach((b) => b.classList.toggle('active', b.dataset.realChip === key));
    section.querySelectorAll('[data-real-key]').forEach((b) => b.classList.toggle('active', b.dataset.realKey === key));
  }

  const quizPool = Object.keys(structures);
  function newQuestion() {
    quizCaseIndex = Math.floor(Math.random() * cases.length);
    currentCaseIndex = quizCaseIndex;
    const c = cases[currentCaseIndex];
    image.src = c.image;
    image.alt = c.alt;
    caseLabel.textContent = `${c.label} · práctica aleatoria`;
    caseName.textContent = c.title;
    caseContext.textContent = 'Las pistas textuales están ocultas durante la práctica. Identificá la región directamente en la imagen.';
    license.innerHTML = `<b>Fuente</b><br>${c.author}, ${c.year} · ${c.license}`;
    sourceLink.href = c.source;
    buildGuides(c);
    tabs.querySelectorAll('[data-case-index]').forEach((b) => b.classList.toggle('active', Number(b.dataset.caseIndex) === currentCaseIndex));
    quizTarget = quizPool[Math.floor(Math.random() * quizPool.length)];
    quizBanner.textContent = `Caso ${currentCaseIndex + 1} · Identificá: ${structures[quizTarget].name}`;
    section.querySelectorAll('[data-real-key]').forEach((b) => b.classList.remove('active'));
  }

  function startQuiz() {
    quiz = true;
    attempts = 0;
    correct = 0;
    quizBanner.hidden = false;
    practiceButton.textContent = 'Terminar práctica';
    section.classList.add('realQuizMode');
    newQuestion();
  }

  function endQuiz() {
    quiz = false;
    quizBanner.hidden = true;
    practiceButton.textContent = 'Practicar casos aleatorios';
    section.classList.remove('realQuizMode');
    renderCase(currentCaseIndex);
  }

  function answer(key) {
    attempts += 1;
    if (key === quizTarget) {
      correct += 1;
      quizBanner.textContent = `✓ Correcto · ${correct}/${attempts}. Cambiando de caso…`;
    } else {
      quizBanner.textContent = `✕ Era ${structures[quizTarget].name} · ${correct}/${attempts}. Cambiando de caso…`;
    }
    setTimeout(() => { if (quiz) newQuestion(); }, 1050);
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
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: selected, sourceName: 'Biblioteca panorámica real' } }));
    document.getElementById('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  renderCase(0);
})();