(() => {
  const anchor = document.getElementById('realRadiographCase');
  if (!anchor || document.getElementById('realCbctCase')) return;

  const planes = {
    axial: {
      name: 'Plano axial',
      summary: 'Corte transversal que permite recorrer el volumen de superior a inferior. En este caso se reconoce la arcada mandibular en sección.',
      clues: ['Pensalo como mirar el paciente desde arriba o desde abajo.', 'Es especialmente útil para relaciones bucolinguales y forma de las arcadas.', 'La orientación izquierda/derecha depende de la convención del visor.']
    },
    sagittal: {
      name: 'Plano sagital',
      summary: 'Corte vertical que divide el volumen en regiones derecha e izquierda y muestra relaciones anteroposteriores.',
      clues: ['Ves anterior ↔ posterior y superior ↔ inferior.', 'Es útil para perfil, dientes anteriores y relaciones con estructuras del macizo facial.', 'No confundas un corte sagital con una reconstrucción lateral panorámica.']
    },
    coronal: {
      name: 'Plano coronal',
      summary: 'Corte vertical frontal que permite valorar relaciones mediolaterales y superoinferiores.',
      clues: ['Pensalo como mirar al paciente de frente.', 'En mandíbula ayuda a visualizar espesor transversal y corticales.', 'Es muy útil para relacionar estructuras bilaterales.']
    },
    vr: {
      name: 'Reconstrucción 3D (VR)',
      summary: 'Representación volumétrica de superficie generada a partir del estudio. Facilita orientación espacial, pero no reemplaza la lectura de los cortes.',
      clues: ['Sirve para ubicarte, no para decidir por sí sola detalles internos.', 'Los cortes axial, coronal y sagital conservan información que una superficie puede ocultar.', 'Relacioná siempre la reconstrucción con los planos ortogonales.']
    }
  };

  const section = document.createElement('section');
  section.id = 'realCbctCase';
  section.className = 'realCbct';
  section.innerHTML = `
    <div class="realCbctHead">
      <div>
        <span class="simEy">Caso CBCT real · orientación multiplanar</span>
        <h2>Aprendé a leer axial, sagital y coronal</h2>
        <p>Antes de buscar detalles anatómicos en una tomografía, hay que dominar la orientación. Este caso real reúne los tres planos ortogonales y una reconstrucción 3D del mismo volumen.</p>
      </div>
      <div class="realCbctActions">
        <button id="cbctToggleLabels" type="button" class="active">Nombres: visibles</button>
        <button id="cbctPractice" type="button">Practicar planos</button>
      </div>
    </div>
    <div class="realCbctGrid">
      <div class="realCbctImageWrap">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/CBCT_image_01.png" alt="CBCT dental real con cortes axial, sagital y coronal y reconstrucción volumétrica 3D">
        <div id="cbctPlaneOverlay" class="cbctPlaneOverlay" aria-label="Planos del CBCT">
          <button type="button" data-plane="axial" class="cbctPlane axial"><span>Axial</span></button>
          <button type="button" data-plane="sagittal" class="cbctPlane sagittal"><span>Sagital</span></button>
          <button type="button" data-plane="coronal" class="cbctPlane coronal"><span>Coronal</span></button>
          <button type="button" data-plane="vr" class="cbctPlane vr"><span>Reconstrucción 3D</span></button>
        </div>
        <div id="cbctQuizBanner" class="realCbctQuiz" hidden></div>
      </div>
      <aside class="realCbctPanel">
        <span class="radLabel">CBCT clínico real · uso educativo</span>
        <h3 id="cbctTitle">Seleccioná un plano</h3>
        <p id="cbctSummary">Tocá una de las cuatro ventanas para estudiar cómo orientarte dentro de un volumen tomográfico.</p>
        <h4>Claves de orientación</h4>
        <ul id="cbctClues"><li>Axial, sagital y coronal son planos ortogonales entre sí.</li><li>La reconstrucción 3D ayuda a orientarse, pero no reemplaza los cortes.</li></ul>
        <button id="cbctShowMandible3d" type="button" class="primary">Comparar mandíbula en nuestro 3D</button>
        <div class="realCbctLicense"><b>Fuente y licencia</b><br>“CBCT image 01”, Panda 51, 2015, Wikimedia Commons · CC BY-SA 4.0. La imagen se muestra sin editar; las zonas interactivas y rótulos son una capa web separada.</div>
        <a href="https://commons.wikimedia.org/wiki/File:CBCT_image_01.png" target="_blank" rel="noopener noreferrer">Ver archivo y licencia original ↗</a>
      </aside>
    </div>`;
  anchor.insertAdjacentElement('afterend', section);

  const title = section.querySelector('#cbctTitle');
  const summary = section.querySelector('#cbctSummary');
  const clues = section.querySelector('#cbctClues');
  const overlay = section.querySelector('#cbctPlaneOverlay');
  const toggleLabels = section.querySelector('#cbctToggleLabels');
  const practiceButton = section.querySelector('#cbctPractice');
  const quizBanner = section.querySelector('#cbctQuizBanner');
  let labelsVisible = true;
  let quiz = false;
  let target = null;
  let attempts = 0;
  let correct = 0;

  function select(key) {
    const d = planes[key];
    if (!d) return;
    title.textContent = d.name;
    summary.textContent = d.summary;
    clues.innerHTML = d.clues.map((x) => `<li>${x}</li>`).join('');
    section.querySelectorAll('[data-plane]').forEach((b) => b.classList.toggle('active', b.dataset.plane === key));
  }

  function newQuestion() {
    const keys = Object.keys(planes);
    target = keys[Math.floor(Math.random() * keys.length)];
    quizBanner.textContent = `Identificá: ${planes[target].name}`;
    section.querySelectorAll('[data-plane]').forEach((b) => b.classList.remove('active'));
  }

  function answer(key) {
    attempts += 1;
    if (key === target) {
      correct += 1;
      quizBanner.textContent = `✓ Correcto · ${correct}/${attempts}`;
    } else {
      quizBanner.textContent = `✕ Era ${planes[target].name} · ${correct}/${attempts}`;
    }
    setTimeout(() => { if (quiz) newQuestion(); }, 900);
  }

  section.querySelectorAll('[data-plane]').forEach((b) => b.addEventListener('click', () => quiz ? answer(b.dataset.plane) : select(b.dataset.plane)));
  toggleLabels.addEventListener('click', () => {
    labelsVisible = !labelsVisible;
    overlay.classList.toggle('hidePlaneLabels', !labelsVisible);
    toggleLabels.classList.toggle('active', labelsVisible);
    toggleLabels.textContent = labelsVisible ? 'Nombres: visibles' : 'Nombres: ocultos';
  });
  practiceButton.addEventListener('click', () => {
    quiz = !quiz;
    section.classList.toggle('cbctQuizMode', quiz);
    quizBanner.hidden = !quiz;
    practiceButton.textContent = quiz ? 'Terminar práctica' : 'Practicar planos';
    if (quiz) {
      attempts = 0;
      correct = 0;
      newQuestion();
    } else {
      title.textContent = 'Seleccioná un plano';
      summary.textContent = 'Tocá una de las cuatro ventanas para estudiar cómo orientarte dentro de un volumen tomográfico.';
      clues.innerHTML = '<li>Axial, sagital y coronal son planos ortogonales entre sí.</li><li>La reconstrucción 3D ayuda a orientarse, pero no reemplaza los cortes.</li>';
      section.querySelectorAll('[data-plane]').forEach((b) => b.classList.remove('active'));
    }
  });
  section.querySelector('#cbctShowMandible3d').addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: 'mandibula', sourceName: 'Caso CBCT real' } }));
    document.getElementById('skullStage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();