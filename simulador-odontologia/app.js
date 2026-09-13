(() => {
  const booksGeneral = 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana. Ediciones y páginas específicas: a validar con la cátedra.';

  const structures = {
    craneo: {
      name: 'Cráneo humano',
      summary: 'Conjunto óseo de la cabeza que protege el encéfalo y forma gran parte del esqueleto facial.',
      location: 'Se divide de manera general en neurocráneo y viscerocráneo. Para reconocerlo conviene orientarlo por las órbitas hacia anterior y el foramen magno hacia inferior.',
      parts: 'Incluye huesos pares e impares del neurocráneo y de la cara. En el simulador se incorporan progresivamente los huesos y, después, sus accidentes anatómicos.',
      relations: 'La mayoría de los huesos craneales se unen mediante suturas. La mandíbula es el hueso móvil y se articula con ambos temporales formando las articulaciones temporomandibulares.',
      clinical: 'Es la base para comprender anestesia odontológica, cirugía oral y maxilofacial, implantología, ATM y diagnóstico por imágenes.',
      books: booksGeneral
    },
    mandibula: {
      name: 'Mandíbula',
      summary: 'Hueso impar y móvil que forma la porción inferior del esqueleto facial y sostiene la arcada dentaria inferior.',
      location: 'Se reconoce por su cuerpo en forma de herradura y dos ramas ascendentes. Cada rama termina superiormente en una apófisis coronoides y un proceso condilar.',
      parts: 'Cuerpo, ramas, ángulos, proceso condilar, apófisis coronoides, escotadura mandibular, foramen mandibular, conducto mandibular, foramen mentoniano y proceso alveolar.',
      relations: 'El proceso condilar se articula con el hueso temporal. El conducto mandibular aloja el paquete neurovascular alveolar inferior.',
      clinical: 'Fundamental en anestesia del nervio alveolar inferior, extracción de terceros molares, implantología, cirugía y evaluación radiográfica.',
      books: booksGeneral
    },
    maxilar: {
      name: 'Maxilar',
      summary: 'Hueso par del macizo facial que participa en la órbita, la cavidad nasal, el paladar duro y la arcada dentaria superior.',
      location: 'Se encuentra en la región central de la cara, a ambos lados de la cavidad nasal y por debajo de las órbitas.',
      parts: 'Cuerpo, procesos frontal, cigomático, palatino y alveolar; seno maxilar, foramen infraorbitario y fosa canina.',
      relations: 'Se articula con varios huesos del macizo facial y contiene el seno maxilar, íntimamente relacionado con dientes posteriores superiores.',
      clinical: 'Importante en anestesia local, cirugía, implantología, endodoncia y estudio de la relación entre raíces dentarias y seno maxilar.',
      books: booksGeneral
    },
    temporal: {
      name: 'Hueso temporal',
      summary: 'Hueso par situado en la región lateral e inferior del cráneo.',
      location: 'Se ubica lateralmente, por debajo del parietal y por delante del occipital. Participa en la base del cráneo.',
      parts: 'Porciones escamosa, petrosa, mastoidea y timpánica; proceso mastoides, proceso estiloides, fosa mandibular y conductos relacionados.',
      relations: 'Se articula con parietal, occipital, esfenoides, cigomático y mandíbula. La fosa mandibular participa en la ATM.',
      clinical: 'Es clave para comprender la articulación temporomandibular y las relaciones de la región preauricular y de la base craneal.',
      books: booksGeneral
    },
    esfenoides: {
      name: 'Esfenoides',
      summary: 'Hueso impar de la base del cráneo relacionado con numerosas estructuras del neurocráneo y de la cara.',
      location: 'Está situado en la parte media de la base craneal, por detrás de las órbitas.',
      parts: 'Cuerpo, alas menores, alas mayores y procesos pterigoideos. Presenta múltiples orificios y conductos de importancia neurovascular.',
      relations: 'Se articula con numerosos huesos. Sus alas y procesos participan en las órbitas y en las fosas temporal, infratemporal y pterigopalatina.',
      clinical: 'Especialmente relevante para comprender vías nerviosas y vasculares profundas relacionadas con anestesia y cirugía.',
      books: booksGeneral
    },
    frontal: {
      name: 'Hueso frontal',
      summary: 'Hueso impar que forma la frente y participa en el techo de las órbitas y en la fosa craneal anterior.',
      location: 'Ocupa la región anterosuperior del cráneo.',
      parts: 'Escama frontal, porciones orbitarias, porción nasal, seno frontal, borde supraorbitario y foramen o incisura supraorbitaria.',
      relations: 'Se articula con parietales, esfenoides, etmoides y varios huesos faciales.',
      clinical: 'Importante como referencia en anatomía orbitofacial, senos paranasales y evaluación por imágenes.',
      books: booksGeneral
    },
    occipital: {
      name: 'Hueso occipital',
      summary: 'Hueso impar que forma gran parte de la región posterior y de la base del cráneo.',
      location: 'Se encuentra en la región posteroinferior del cráneo.',
      parts: 'Escama, porciones laterales y basilar, foramen magno, cóndilos occipitales y líneas nucales.',
      relations: 'Se articula con parietales, temporales, esfenoides y atlas. El foramen magno comunica la cavidad craneal con el conducto vertebral.',
      clinical: 'Ayuda a comprender la base craneal, las relaciones cervicocraneales y referencias radiológicas de cabeza y cuello.',
      books: booksGeneral
    },
    cigomatico: {
      name: 'Hueso cigomático',
      summary: 'Hueso par que forma la prominencia de la mejilla y participa en la pared lateral y el piso de la órbita.',
      location: 'Se ubica en la región superolateral de la cara.',
      parts: 'Caras lateral, temporal y orbitaria; procesos frontal, temporal y maxilar; forámenes cigomaticofacial y cigomaticotemporal.',
      relations: 'Se articula con frontal, esfenoides, temporal y maxilar, y participa en el arco cigomático.',
      clinical: 'Importante en traumatología facial, cirugía maxilofacial, anestesia y orientación anatómica de la órbita y el maxilar.',
      books: booksGeneral
    },
    parietal: {
      name: 'Hueso parietal',
      summary: 'Hueso par que forma buena parte de las paredes superior y lateral del neurocráneo.',
      location: 'Se ubica por detrás del frontal, por delante del occipital y por encima del temporal.',
      parts: 'Presenta caras externa e interna, cuatro bordes y cuatro ángulos; participa en varias suturas craneales.',
      relations: 'Se articula con frontal, occipital, temporal, esfenoides y el parietal opuesto.',
      clinical: 'Es una referencia útil para orientación topográfica, suturas, traumatología y lectura de imágenes craneofaciales.',
      books: booksGeneral
    },
    etmoides: {
      name: 'Etmoides',
      summary: 'Hueso impar y delicado que participa en la base craneal anterior, cavidad nasal y paredes mediales de las órbitas.',
      location: 'Se encuentra entre las órbitas, por debajo del frontal y por delante del esfenoides.',
      parts: 'Lámina cribosa, crista galli, lámina perpendicular y laberintos etmoidales con celdillas y conchas nasales superior y media.',
      relations: 'Se relaciona con frontal, esfenoides, vómer y diversos huesos de la cara y de la cavidad nasal.',
      clinical: 'Importante en anatomía nasosinusal, órbita y comprensión de comunicaciones de la base craneal.',
      books: booksGeneral
    },
    nasal: {
      name: 'Hueso nasal',
      summary: 'Pequeño hueso par que forma el puente óseo de la nariz.',
      location: 'Se ubica en la línea media facial, inferior al frontal y entre los procesos frontales de los maxilares.',
      parts: 'Presenta caras anterior y posterior y bordes que contribuyen a sus articulaciones.',
      relations: 'Se articula con frontal, maxilar, etmoides y el nasal opuesto.',
      clinical: 'Referencia del macizo facial anterior y frecuente región de traumatismos.',
      books: booksGeneral
    },
    lagrimal: {
      name: 'Hueso lagrimal',
      summary: 'Hueso par pequeño de la pared medial de la órbita.',
      location: 'Se ubica entre el proceso frontal del maxilar y el etmoides.',
      parts: 'Presenta cresta lagrimal posterior y contribuye a la fosa del saco lagrimal.',
      relations: 'Se articula con frontal, etmoides, maxilar y concha nasal inferior.',
      clinical: 'Importante para comprender la pared medial de la órbita y la vía lagrimal.',
      books: booksGeneral
    },
    palatino: {
      name: 'Hueso palatino',
      summary: 'Hueso par de forma compleja que participa en el paladar duro, cavidad nasal y regiones profundas de la cara.',
      location: 'Se encuentra por detrás del maxilar.',
      parts: 'Láminas horizontal y perpendicular, procesos y forámenes relacionados con la región palatina.',
      relations: 'Se articula con maxilar, esfenoides, etmoides, concha nasal inferior, vómer y palatino opuesto.',
      clinical: 'Importante para anestesia palatina, cirugía oral y comprensión de la fosa pterigopalatina.',
      books: booksGeneral
    },
    vomer: {
      name: 'Vómer',
      summary: 'Hueso impar que forma parte de la porción posteroinferior del tabique nasal óseo.',
      location: 'Se sitúa en la línea media de la cavidad nasal.',
      parts: 'Lámina del vómer y alas superiores.',
      relations: 'Se relaciona principalmente con esfenoides, etmoides, maxilares y palatinos.',
      clinical: 'Útil para la orientación anatómica de la cavidad nasal y del tabique óseo.',
      books: booksGeneral
    },
    concha_inferior: {
      name: 'Concha nasal inferior',
      summary: 'Hueso par independiente que forma parte de la pared lateral de la cavidad nasal.',
      location: 'Se encuentra en la porción inferior de la pared lateral de cada cavidad nasal.',
      parts: 'Lámina curva con procesos lagrimal, maxilar y etmoidal.',
      relations: 'Se articula con maxilar, lagrimal, etmoides y palatino.',
      clinical: 'Importante para comprender la anatomía de la cavidad nasal y las relaciones nasosinusales.',
      books: booksGeneral
    },
    foramen_mentoniano: {
      name: 'Foramen mentoniano',
      summary: 'Abertura en la superficie externa del cuerpo mandibular por donde emerge el paquete vasculonervioso mentoniano.',
      location: 'Se localiza en la cara externa del cuerpo de la mandíbula. Su posición exacta puede variar entre individuos.',
      parts: 'Se continúa con el conducto mandibular y constituye una referencia anatómica del cuerpo mandibular.',
      relations: 'Se relaciona con el nervio mentoniano y vasos mentonianos, ramas terminales del paquete alveolar inferior.',
      clinical: 'Referencia relevante en anestesia, implantología y cirugía; su posición debe evaluarse individualmente mediante anatomía e imágenes clínicas.',
      books: booksGeneral
    },
    foramen_mandibular: {
      name: 'Foramen mandibular',
      summary: 'Abertura situada en la cara medial de la rama mandibular que da entrada al conducto mandibular.',
      location: 'Se encuentra en la superficie medial de la rama de la mandíbula, próximo a la língula mandibular.',
      parts: 'Marca el comienzo del conducto mandibular y se relaciona estrechamente con la língula.',
      relations: 'Por él ingresan el nervio alveolar inferior y vasos acompañantes hacia el conducto mandibular.',
      clinical: 'Referencia anatómica fundamental para la anestesia troncular del nervio alveolar inferior.',
      books: booksGeneral
    }
  };

  const modelKeys = new Set(['mandibula','maxilar','temporal','esfenoides','frontal','occipital','cigomatico','parietal','etmoides','nasal','lagrimal','palatino','vomer','concha_inferior']);
  const status = document.getElementById('viewerStatus');
  const title = document.getElementById('viewerTitle');
  const buttonsWrap = document.getElementById('structureButtons');
  const search = document.getElementById('structureSearch');
  const searchBtn = document.getElementById('structureSearchBtn');
  const suggestions = document.getElementById('searchSuggestions');
  const practiceBox = document.getElementById('practiceBox');
  const practiceQuestion = document.getElementById('practiceQuestion');
  const practiceFeedback = document.getElementById('practiceFeedback');
  const nextQuestion = document.getElementById('nextQuestion');
  let mode = 'explorar';
  let currentKey = 'craneo';
  let practiceTarget = null;

  const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

  function renderInfo(key, options = {}) {
    const data = structures[key];
    if (!data) return;
    currentKey = key;
    title.textContent = data.name;
    document.getElementById('infoTitle').textContent = data.name;
    document.getElementById('infoSummary').textContent = data.summary;
    document.getElementById('infoLocation').textContent = data.location;
    document.getElementById('infoParts').textContent = data.parts;
    document.getElementById('infoRelations').textContent = data.relations;
    document.getElementById('infoClinical').textContent = data.clinical;
    document.getElementById('infoBooks').textContent = data.books;
    buttonsWrap.querySelectorAll('button').forEach((button) => button.classList.toggle('active', button.dataset.key === key));

    if (!options.fromViewer && modelKeys.has(key) && typeof window.skull3dSelectByKey === 'function') {
      window.skull3dSelectByKey(key);
    }
    if (key === 'craneo' && !options.fromViewer && typeof window.skull3dSelectByKey === 'function') {
      window.skull3dSelectByKey(null);
    }
    if (mode === 'practicar') evaluatePractice(key);
  }

  function makeStructureButtons() {
    buttonsWrap.innerHTML = '';
    Object.entries(structures).forEach(([key, data]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.key = key;
      button.textContent = data.name;
      button.addEventListener('click', () => renderInfo(key));
      buttonsWrap.appendChild(button);
    });
  }

  function findMatches(value) {
    const q = normalize(value);
    if (!q) return [];
    return Object.entries(structures).filter(([key, data]) => normalize(key.replaceAll('_', ' ') + ' ' + data.name).includes(q));
  }

  function selectFromSearch() {
    const matches = findMatches(search.value);
    if (matches.length) {
      renderInfo(matches[0][0]);
      suggestions.hidden = true;
      return;
    }
    suggestions.hidden = false;
    suggestions.innerHTML = '<span>No encontramos esa estructura en esta versión.</span>';
  }

  function updateSuggestions() {
    const matches = findMatches(search.value).slice(0, 7);
    suggestions.innerHTML = '';
    if (!search.value.trim()) {
      suggestions.hidden = true;
      return;
    }
    suggestions.hidden = false;
    if (!matches.length) {
      suggestions.innerHTML = '<span>No disponible todavía.</span>';
      return;
    }
    matches.forEach(([key, data]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = data.name;
      button.addEventListener('click', () => {
        search.value = data.name;
        renderInfo(key);
        suggestions.hidden = true;
      });
      suggestions.appendChild(button);
    });
  }

  function newPracticeQuestion() {
    const keys = [...modelKeys];
    let key = keys[Math.floor(Math.random() * keys.length)];
    if (keys.length > 1 && key === practiceTarget) key = keys[(keys.indexOf(key) + 1) % keys.length];
    practiceTarget = key;
    practiceQuestion.textContent = `Identificá en el cráneo: ${structures[key].name}`;
    practiceFeedback.textContent = 'Tocá el hueso correcto en el modelo o elegilo de la lista.';
    practiceFeedback.className = '';
  }

  function evaluatePractice(key) {
    if (!practiceTarget || !modelKeys.has(key)) return;
    if (key === practiceTarget) {
      practiceFeedback.textContent = '✓ Correcto. Muy bien.';
      practiceFeedback.className = 'practiceCorrect';
    } else {
      practiceFeedback.textContent = `✕ Esa estructura es ${structures[key].name}. Intentá nuevamente.`;
      practiceFeedback.className = 'practiceWrong';
    }
  }

  function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.simMode').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
    practiceBox.hidden = mode === 'explorar';
    nextQuestion.hidden = mode !== 'practicar';

    if (mode === 'practicar') newPracticeQuestion();
    if (mode === 'estudiar') {
      practiceQuestion.textContent = 'Modo estudio guiado';
      practiceFeedback.textContent = 'Seleccioná un hueso en el modelo y repasá ubicación, partes, relaciones e importancia odontológica en la ficha.';
      practiceFeedback.className = '';
    }
  }

  document.querySelectorAll('.simMode').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('.simView').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.simView').forEach((item) => item.classList.toggle('active', item === button));
    document.getElementById('currentView').textContent = `Vista: ${button.dataset.view.toLowerCase()}`;
    if (typeof window.skull3dSetView === 'function') window.skull3dSetView(button.dataset.view);
  }));

  search.addEventListener('input', updateSuggestions);
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      selectFromSearch();
    }
  });
  searchBtn.addEventListener('click', selectFromSearch);
  nextQuestion.addEventListener('click', newPracticeQuestion);

  document.addEventListener('simulator:select', (event) => {
    const key = event.detail?.key;
    if (key && structures[key]) renderInfo(key, { fromViewer: true });
  });

  document.addEventListener('simulator:viewer-ready', () => {
    if (modelKeys.has(currentKey) && typeof window.skull3dSelectByKey === 'function') window.skull3dSelectByKey(currentKey);
  });

  makeStructureButtons();
  renderInfo('craneo');
})();
