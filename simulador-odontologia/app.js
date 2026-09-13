(() => {
  const structures = {
    craneo: {
      name: 'Cráneo humano',
      summary: 'Conjunto óseo de la cabeza que protege el encéfalo y forma gran parte del esqueleto facial.',
      location: 'Se divide de manera general en neurocráneo y viscerocráneo. Para reconocerlo conviene orientarlo por las órbitas hacia anterior y el foramen magno hacia inferior.',
      parts: 'En esta primera versión se estudian frontal, temporal, occipital, esfenoides, maxilar, mandíbula y cigomático, además de algunos accidentes anatómicos de especial interés odontológico.',
      relations: 'Sus huesos se articulan mediante suturas, salvo la mandíbula, que se articula con los temporales formando las articulaciones temporomandibulares.',
      clinical: 'Es la base para comprender anestesia odontológica, cirugía oral y maxilofacial, implantología, ATM y diagnóstico por imágenes.',
      books: 'Referencia académica a validar con la cátedra: Figún y Garino; Pró; Latarjet y Ruiz Liard.'
    },
    mandibula: {
      name: 'Mandíbula',
      summary: 'Hueso impar y móvil que forma la porción inferior del esqueleto facial y sostiene la arcada dentaria inferior.',
      location: 'Se reconoce por su cuerpo en forma de herradura y dos ramas ascendentes. Cada rama termina superiormente en una apófisis coronoides y un proceso condilar.',
      parts: 'Cuerpo, ramas, ángulos, proceso condilar, apófisis coronoides, escotadura mandibular, foramen mandibular, conducto mandibular, foramen mentoniano y proceso alveolar.',
      relations: 'El proceso condilar se articula con el hueso temporal. El conducto mandibular aloja el paquete neurovascular alveolar inferior.',
      clinical: 'Fundamental en anestesia del nervio alveolar inferior, extracción de terceros molares, implantología, cirugía y evaluación radiográfica.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    maxilar: {
      name: 'Maxilar',
      summary: 'Hueso par del macizo facial que participa en la órbita, la cavidad nasal, el paladar duro y la arcada dentaria superior.',
      location: 'Se encuentra en la región central de la cara, a ambos lados de la cavidad nasal y por debajo de las órbitas.',
      parts: 'Cuerpo, proceso frontal, proceso cigomático, proceso palatino, proceso alveolar, seno maxilar, foramen infraorbitario y fosa canina.',
      relations: 'Se articula con varios huesos del macizo facial y contiene el seno maxilar, íntimamente relacionado con dientes posteriores superiores.',
      clinical: 'Importante en anestesia local, cirugía, implantología, endodoncia y estudio de la relación entre raíces dentarias y seno maxilar.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    temporal: {
      name: 'Hueso temporal',
      summary: 'Hueso par situado en la región lateral e inferior del cráneo.',
      location: 'Se ubica lateralmente, por debajo del parietal y por delante del occipital. Participa en la base del cráneo.',
      parts: 'Porciones escamosa, petrosa, mastoidea y timpánica; proceso mastoides, proceso estiloides, fosa mandibular y conductos relacionados.',
      relations: 'Se articula con parietal, occipital, esfenoides, cigomático y mandíbula. La fosa mandibular participa en la ATM.',
      clinical: 'Es clave para comprender la articulación temporomandibular, las relaciones de la región preauricular y estructuras neurovasculares de la base craneal.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    esfenoides: {
      name: 'Esfenoides',
      summary: 'Hueso impar de la base del cráneo que se relaciona con numerosas estructuras del neurocráneo y la cara.',
      location: 'Está situado en la parte media de la base craneal, por detrás de las órbitas.',
      parts: 'Cuerpo, alas menores, alas mayores y procesos pterigoideos. Presenta múltiples orificios y conductos de importancia neurovascular.',
      relations: 'Se articula con numerosos huesos del cráneo. Sus alas y procesos participan en las órbitas y en las fosas temporal, infratemporal y pterigopalatina.',
      clinical: 'Tiene especial relevancia para entender vías nerviosas y vasculares de cabeza y cuello, así como regiones profundas relacionadas con anestesia y cirugía.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    frontal: {
      name: 'Hueso frontal',
      summary: 'Hueso impar que forma la frente y participa en el techo de las órbitas y en la fosa craneal anterior.',
      location: 'Ocupa la región anterosuperior del cráneo.',
      parts: 'Escama frontal, porciones orbitarias, porción nasal, seno frontal, borde supraorbitario y foramen o incisura supraorbitaria.',
      relations: 'Se articula con parietales, esfenoides, etmoides y varios huesos faciales.',
      clinical: 'Importante como referencia en anatomía orbitofacial, senos paranasales y evaluación por imágenes.',
      books: 'Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana; complementar con la bibliografía específica indicada por la cátedra.'
    },
    occipital: {
      name: 'Hueso occipital',
      summary: 'Hueso impar que forma gran parte de la región posterior y de la base del cráneo.',
      location: 'Se encuentra en la región posteroinferior del cráneo.',
      parts: 'Escama, porciones laterales y basilar, foramen magno, cóndilos occipitales y líneas nucales.',
      relations: 'Se articula con parietales, temporales, esfenoides y atlas. El foramen magno comunica la cavidad craneal con el conducto vertebral.',
      clinical: 'Sirve para comprender la base craneal, las relaciones cervicocraneales y referencias radiológicas de cabeza y cuello.',
      books: 'Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    cigomatico: {
      name: 'Hueso cigomático',
      summary: 'Hueso par que forma la prominencia de la mejilla y participa en la pared lateral y el piso de la órbita.',
      location: 'Se ubica en la región superolateral de la cara.',
      parts: 'Caras lateral, temporal y orbitaria; procesos frontal, temporal y maxilar; forámenes cigomaticofacial y cigomaticotemporal.',
      relations: 'Se articula con frontal, esfenoides, temporal y maxilar, y participa en el arco cigomático.',
      clinical: 'Importante en traumatología facial, cirugía maxilofacial, anestesia y orientación anatómica de la órbita y el maxilar.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana.'
    },
    foramen_mentoniano: {
      name: 'Foramen mentoniano',
      summary: 'Abertura en la superficie externa del cuerpo mandibular por donde emerge el paquete vasculonervioso mentoniano.',
      location: 'Se localiza en la cara externa del cuerpo de la mandíbula. Su posición exacta puede variar entre individuos.',
      parts: 'Se continúa con el conducto mandibular y constituye una referencia anatómica del cuerpo mandibular.',
      relations: 'Se relaciona con el nervio mentoniano y vasos mentonianos, ramas terminales del paquete alveolar inferior.',
      clinical: 'Es una referencia relevante en anestesia, implantología y cirugía; su posición debe evaluarse individualmente mediante anatomía e imágenes clínicas.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica.'
    },
    foramen_mandibular: {
      name: 'Foramen mandibular',
      summary: 'Abertura situada en la cara medial de la rama mandibular que da entrada al conducto mandibular.',
      location: 'Se encuentra en la superficie medial de la rama de la mandíbula, próximo a la língula mandibular.',
      parts: 'Marca el comienzo del conducto mandibular y se relaciona estrechamente con la língula.',
      relations: 'Por él ingresan el nervio alveolar inferior y vasos acompañantes hacia el conducto mandibular.',
      clinical: 'Es una referencia anatómica fundamental para la anestesia troncular del nervio alveolar inferior.',
      books: 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica.'
    }
  };

  const viewer = document.getElementById('skullViewer');
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

  function renderInfo(key) {
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
    suggestions.innerHTML = '<span>No encontramos esa estructura en esta primera versión.</span>';
  }

  function updateSuggestions() {
    const matches = findMatches(search.value).slice(0, 6);
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
    const keys = Object.keys(structures).filter((key) => key !== 'craneo');
    let key = keys[Math.floor(Math.random() * keys.length)];
    if (keys.length > 1 && key === practiceTarget) key = keys[(keys.indexOf(key) + 1) % keys.length];
    practiceTarget = key;
    practiceQuestion.textContent = `Identificá: ${structures[key].name}`;
    practiceFeedback.textContent = 'Elegí la estructura correcta en la lista de acceso rápido.';
    practiceFeedback.className = '';
  }

  function evaluatePractice(key) {
    if (!practiceTarget) return;
    if (key === practiceTarget) {
      practiceFeedback.textContent = '✓ Correcto. Muy bien.';
      practiceFeedback.className = 'practiceCorrect';
    } else {
      practiceFeedback.textContent = `✕ Esa es ${structures[key].name}. Intentá nuevamente.`;
      practiceFeedback.className = 'practiceWrong';
    }
  }

  function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.simMode').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
    practiceBox.hidden = mode !== 'practicar';
    if (mode === 'practicar') newPracticeQuestion();
    if (mode === 'estudiar') {
      renderInfo(currentKey);
      practiceBox.hidden = false;
      practiceQuestion.textContent = 'Modo estudio guiado';
      practiceFeedback.textContent = 'Seleccioná una estructura y repasá ubicación, accidentes, relaciones e importancia odontológica en la ficha.';
      practiceFeedback.className = '';
      nextQuestion.hidden = true;
    } else {
      nextQuestion.hidden = false;
    }
  }

  document.querySelectorAll('.simMode').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('.simView').forEach((button) => button.addEventListener('click', () => {
    viewer.cameraOrbit = button.dataset.orbit;
    viewer.jumpCameraToGoal();
    document.querySelectorAll('.simView').forEach((item) => item.classList.toggle('active', item === button));
    document.getElementById('currentView').textContent = `Vista: ${button.dataset.view.toLowerCase()}`;
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

  viewer.addEventListener('load', () => {
    status.textContent = 'Modelo 3D listo';
    status.classList.add('ready');
  });
  viewer.addEventListener('error', () => {
    status.textContent = 'No se pudo cargar el modelo';
    status.classList.add('error');
  });

  makeStructureButtons();
  renderInfo('craneo');
})();
