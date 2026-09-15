import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js/+esm';
import { deriveDentalLandmarks } from './dental-landmarks.js';
import { deriveVascularPaths } from './vascular-overlays.js';
import { deriveMasticatoryMuscles } from './muscle-overlays.js';

const MANIFEST_URL = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public/models/atlas.json';
const MODEL_BASE = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public';

const $ = (id) => document.getElementById(id);
const canvas = $('skullCanvas');
const stage = $('skullStage');
const status = $('viewerStatus');
const tooltip = $('viewerTooltip');
const focusButton = $('focusBone');
const isolateButton = $('isolateBone');
const contextButton = $('contextBone');
const landmarksButton = $('toggleLandmarks');
const nervesButton = $('toggleNerves');
const vesselsButton = $('toggleVessels');
const canalButton = $('toggleCanal');
const tmjButton = $('toggleTMJ');
const resetButton = $('resetSkull');
const actionRow = document.querySelector('.simModelActions');

function ensureActionButton(id, text) {
  let button = $(id);
  if (button || !actionRow) return button;
  button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.textContent = text;
  if (resetButton) actionRow.insertBefore(button, resetButton);
  else actionRow.appendChild(button);
  return button;
}

const musclesButton = ensureActionButton('toggleMuscles', 'Músculos: ocultos');
const motionButton = ensureActionButton('demoTMJ', '▶ Movimiento ATM');

const BONE_PATTERNS = [
  { key: 'mandibula', patterns: [/\bmandible\b/i] },
  { key: 'maxilar', patterns: [/\bmaxilla\b/i, /maxillary bone/i] },
  { key: 'temporal', patterns: [/temporal bone/i] },
  { key: 'esfenoides', patterns: [/sphenoid bone/i] },
  { key: 'frontal', patterns: [/frontal bone/i] },
  { key: 'occipital', patterns: [/occipital bone/i] },
  { key: 'cigomatico', patterns: [/zygomatic bone/i, /malar bone/i] },
  { key: 'parietal', patterns: [/parietal bone/i] },
  { key: 'etmoides', patterns: [/ethmoid bone/i] },
  { key: 'nasal', patterns: [/nasal bone/i] },
  { key: 'lagrimal', patterns: [/lacrimal bone/i] },
  { key: 'palatino', patterns: [/palatine bone/i] },
  { key: 'vomer', patterns: [/^vomer$/i, /vomer bone/i] },
  { key: 'concha_inferior', patterns: [/inferior nasal concha/i, /inferior nasal turbinate/i] }
];

const LANDMARK_PARENT = {
  condilo_mandibular: 'mandibula',
  coronoides_mandibular: 'mandibula',
  angulo_mandibular: 'mandibula',
  foramen_mandibular: 'mandibula',
  foramen_mentoniano: 'mandibula',
  foramen_infraorbitario: 'maxilar',
  foramen_oval: 'esfenoides'
};

const TITLE_TO_LANDMARK = {
  'Proceso condilar de la mandíbula': 'condilo_mandibular',
  'Apófisis coronoides': 'coronoides_mandibular',
  'Ángulo mandibular': 'angulo_mandibular',
  'Foramen mandibular': 'foramen_mandibular',
  'Foramen mentoniano': 'foramen_mentoniano',
  'Foramen infraorbitario': 'foramen_infraorbitario',
  'Foramen oval': 'foramen_oval'
};
const TITLE_TO_PATH = { 'Conducto mandibular': 'conducto_mandibular' };

const COLORS = {
  bone: 0xe9e3d5,
  selectedBone: 0x2b72d6,
  hoverBone: 0x92b9ec,
  landmark: 0xe89522,
  landmarkSelected: 0xe33f35,
  landmarkHover: 0xffc15b,
  nerve: 0xd4ad2d,
  vessel: 0xc84b45,
  canal: 0x3e8dc5,
  canalSelected: 0x185ca0,
  disc: 0x9b66b2,
  muscle: 0xb95167,
  muscleSelected: 0xe2798f
};

const BOOKS = 'Figún y Garino · Anatomía Odontológica; Pró · Anatomía Clínica; Latarjet y Ruiz Liard · Anatomía Humana. Ediciones y páginas específicas: a validar con la cátedra.';
const SPECIAL_INFO = {
  atm: {
    title: 'Articulación temporomandibular (ATM)', type: 'Articulación sinovial',
    summary: 'Articulación bilateral entre el proceso condilar de la mandíbula y la porción escamosa del temporal, con un disco fibrocartilaginoso interpuesto.',
    location: 'Región preauricular, entre cabeza mandibular y fosa mandibular/eminencia articular del temporal.',
    parts: 'Cóndilo mandibular, superficie articular temporal, disco articular, cápsula y ligamentos asociados.',
    relations: 'En la apertura inicial predomina rotación; con mayor apertura se agrega traslación anterior del complejo cóndilo-disco sobre la eminencia articular.',
    clinical: 'Central para oclusión, movimientos mandibulares, dolor/disfunción temporomandibular, traumatismos y planificación odontológica.',
    tips: ['Cóndilo = componente mandibular.', 'Fosa mandibular y eminencia articular = componente temporal.', 'No pienses la apertura como una bisagra pura: combina rotación y traslación.'],
    related: [['mandibula','Mandíbula'],['temporal','Hueso temporal'],['condilo_mandibular','Proceso condilar']]
  },
  disco_articular_atm: {
    title: 'Disco articular de la ATM', type: 'Fibrocartílago · esquema 3D',
    summary: 'Disco bicóncavo que se interpone entre la cabeza mandibular y la superficie articular temporal y divide la cavidad articular en dos compartimentos.',
    location: 'Entre cóndilo mandibular y fosa/eminencia articular del temporal.',
    parts: 'Zona anterior, zona intermedia más delgada y zona posterior; continuidad con tejidos retrodiscales y cápsula.',
    relations: 'Se desplaza junto con el cóndilo durante la traslación, aunque la relación disco-cóndilo puede alterarse en trastornos internos.',
    clinical: 'Su posición y movilidad son relevantes en chasquidos, bloqueos y disfunciones temporomandibulares.',
    tips: ['Está interpuesto, no fusionado al hueso.', 'Divide la articulación en compartimentos superior e inferior.'],
    related: [['condilo_mandibular','Proceso condilar'],['temporal','Hueso temporal']]
  },
  masetero: {
    title: 'Músculo masetero', type: 'Músculo de la masticación · esquema 3D',
    summary: 'Músculo potente y superficial que eleva la mandíbula.',
    location: 'Desde el arco cigomático hacia la cara lateral de la rama y el ángulo mandibular.',
    parts: 'Porciones superficial y profunda con fibras de dirección diferente.',
    relations: 'Cubre lateralmente la rama mandibular; el conducto parotídeo cruza su superficie antes de perforar el buccinador.',
    clinical: 'Importante en función masticatoria, bruxismo, hipertrofia masetérica, palpación clínica y abordajes quirúrgicos.',
    tips: ['Es lateral a la rama.', 'Su acción principal es elevar la mandíbula.'],
    related: [['cigomatico','Cigomático'],['angulo_mandibular','Ángulo mandibular'],['mandibula','Mandíbula']]
  },
  musculo_temporal: {
    title: 'Músculo temporal', type: 'Músculo de la masticación · esquema 3D',
    summary: 'Músculo en abanico de la fosa temporal que converge hacia la apófisis coronoides.',
    location: 'Fosa temporal, profundo a la fascia temporal; su tendón pasa medial al arco cigomático hacia coronoides.',
    parts: 'Fibras anteriores más verticales y posteriores más horizontales.',
    relations: 'Se inserta ampliamente en coronoides y borde anterior de la rama mandibular.',
    clinical: 'Eleva la mandíbula; sus fibras posteriores contribuyen a la retrusión.',
    tips: ['Pensalo como un abanico que converge en coronoides.', 'Coronoides es su gran referencia de inserción.'],
    related: [['coronoides_mandibular','Apófisis coronoides'],['temporal','Hueso temporal']]
  },
  pterigoideo_medial: {
    title: 'Músculo pterigoideo medial', type: 'Músculo de la masticación · esquema 3D',
    summary: 'Músculo profundo que forma una especie de cabestrillo con el masetero alrededor del ángulo mandibular.',
    location: 'Desde región pterigoidea hacia la cara medial de rama y ángulo mandibular.',
    parts: 'Cabezas profunda y superficial descritas clásicamente.',
    relations: 'Se ubica medial a la rama; el espacio pterigomandibular y estructuras neurovasculares se relacionan con su vecindad.',
    clinical: 'Eleva y ayuda a protruir la mandíbula; participa en movimientos de lateralidad.',
    tips: ['Masetero lateral + pterigoideo medial medial = cabestrillo mandibular.', 'Termina cerca del ángulo, pero en su cara medial.'],
    related: [['angulo_mandibular','Ángulo mandibular'],['esfenoides','Esfenoides'],['mandibula','Mandíbula']]
  },
  pterigoideo_lateral: {
    title: 'Músculo pterigoideo lateral', type: 'Músculo de la masticación · esquema 3D',
    summary: 'Músculo profundo de orientación casi horizontal, especialmente relacionado con cuello condilar y complejo disco-cápsula.',
    location: 'Fosa infratemporal, desde región esfenoidal/pterigoidea hacia cuello del cóndilo y estructuras de la ATM.',
    parts: 'Cabezas superior e inferior, con inserciones y funciones parcialmente diferentes.',
    relations: 'Está próximo a V3 y a la arteria maxilar; se relaciona estrechamente con la ATM.',
    clinical: 'Participa en protrusión, apertura coordinada y movimientos de lateralidad mandibular.',
    tips: ['Es el más horizontal de los cuatro músculos principales.', 'Relacioná su inserción con cuello condilar y disco/cápsula.'],
    related: [['condilo_mandibular','Proceso condilar'],['esfenoides','Esfenoides']]
  }
};

let renderer, scene, camera, controls, root, boneRoot, overlayRoot;
let meshes = [], markerMeshes = [], nerveMeshes = [], vesselMeshes = [], canalMeshes = [], jointMeshes = [], muscleMeshes = [];
let selectedKey = null, selectedLandmarkKey = null, selectedMarker = null, selectedPathKey = null, selectedSpecialKey = null, selectedSpecialMesh = null;
let isolated = false, contextDimmed = false;
let landmarksVisible = true, nervesVisible = false, vesselsVisible = false, canalVisible = true, tmjVisible = false, musclesVisible = false;
let pointerStart = null, hovered = null, landmarkCache = {};
let jawDemoRunning = false, jawDemoFrame = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function setStatus(text, kind = '') {
  if (!status) return;
  status.textContent = text;
  status.classList.remove('ready', 'error');
  if (kind) status.classList.add(kind);
}

function matchBone(name = '') {
  for (const entry of BONE_PATTERNS) if (entry.patterns.some((pattern) => pattern.test(name))) return entry.key;
  return null;
}

function buildRenderer() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.01, 20);
  camera.position.set(0, 0.05, 0.42);
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 0.14;
  controls.maxDistance = 0.9;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7d8796, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 3.3); key.position.set(0.7, 1.1, 1.4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xc8dcff, 1.5); fill.position.set(-1.2, 0.3, 0.5); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff0d6, 1.2); rim.position.set(0.3, 0.2, -1.3); scene.add(rim);
  root = new THREE.Group(); boneRoot = new THREE.Group(); overlayRoot = new THREE.Group(); root.add(boneRoot, overlayRoot); scene.add(root);
  resize();
  renderer.setAnimationLoop(render);
}

function resize() {
  if (!renderer || !stage) return;
  const rect = stage.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
function render() { controls?.update(); renderer?.render(scene, camera); }

function safeBufferView(buffer, Type, byteOffset, count) {
  if (!buffer || !Number.isFinite(byteOffset) || !Number.isFinite(count) || count <= 0) return null;
  const bytes = Type.BYTES_PER_ELEMENT * count;
  if (byteOffset < 0 || byteOffset + bytes > buffer.byteLength) return null;
  return new Type(buffer, byteOffset, count);
}
function makeGeometry(part, buffer) {
  const positions = safeBufferView(buffer, Float32Array, part.positions, part.vertexCount * 3);
  const normals = safeBufferView(buffer, Int16Array, part.normals, part.vertexCount * 3);
  const indices = safeBufferView(buffer, Uint32Array, part.indices, part.indexCount);
  if (!positions || !normals || !indices) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Int16BufferAttribute(normals, 3, true));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingBox(); geometry.computeBoundingSphere();
  return geometry;
}
function makeBoneMaterial() { return new THREE.MeshStandardMaterial({ color: COLORS.bone, roughness: 0.72, metalness: 0, transparent: true, opacity: 1 }); }
function readVertices(part, chunkBuffers) {
  const buffer = chunkBuffers.get(part.chunk);
  const positions = safeBufferView(buffer, Float32Array, part.positions, part.vertexCount * 3);
  if (!positions) return [];
  const vertices = new Array(part.vertexCount);
  for (let i = 0; i < part.vertexCount; i += 1) vertices[i] = [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
  return vertices;
}
function disposeMeshes(list) {
  for (const mesh of list) { mesh.geometry?.dispose?.(); mesh.material?.dispose?.(); overlayRoot.remove(mesh); }
  list.length = 0;
}

function buildLandmarkMarkers(landmarkPoints = {}) {
  disposeMeshes(markerMeshes);
  for (const [infoKey, points] of Object.entries(landmarkPoints)) points.forEach((point, index) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.00225, 18, 12),
      new THREE.MeshStandardMaterial({ color: COLORS.landmark, roughness: 0.35, emissive: 0x4a2600, emissiveIntensity: 0.22 })
    );
    marker.position.fromArray(point);
    marker.userData = { infoKey, overlayType: 'landmark', parentKey: LANDMARK_PARENT[infoKey] || null, side: index === 0 ? 'derecho' : 'izquierdo', sourceName: 'Marcador 3D calculado sobre el atlas' };
    overlayRoot.add(marker); markerMeshes.push(marker);
  });
}
function nerveRadius(path) { return path.caliber === 'trunk' ? 0.00105 : path.caliber === 'branch' ? 0.00078 : 0.00055; }
function tubeMesh(path, color, radius, opacity, overlayType, keyField) {
  const clean = (path.points || []).filter((p) => Array.isArray(p) && p.every(Number.isFinite));
  if (clean.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(clean.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
  const mesh = new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(24, clean.length * 10), radius, 8, false),
    new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0, transparent: true, opacity, depthTest: true })
  );
  mesh.userData = { overlayType, [keyField]: path.key, sourceName: path.name, side: path.side, schematic: true };
  overlayRoot.add(mesh);
  return mesh;
}
function buildNervePaths(paths = []) { disposeMeshes(nerveMeshes); for (const path of paths) { const mesh = tubeMesh(path, COLORS.nerve, nerveRadius(path), 0.92, 'nerve', 'nerveKey'); if (mesh) nerveMeshes.push(mesh); } }
function buildVesselPaths(paths = []) { disposeMeshes(vesselMeshes); for (const path of paths) { const mesh = tubeMesh(path, COLORS.vessel, path.caliber === 'artery' ? 0.0009 : 0.00062, 0.92, 'vessel', 'vesselKey'); if (mesh) vesselMeshes.push(mesh); } }
function buildCanalPaths(paths = []) {
  disposeMeshes(canalMeshes);
  for (const path of paths) {
    const mesh = tubeMesh(path, COLORS.canal, 0.00115, 0.76, 'canal', 'infoKey');
    if (!mesh) continue;
    mesh.userData.infoKey = path.key || 'conducto_mandibular'; mesh.userData.parentKey = 'mandibula';
    canalMeshes.push(mesh);
  }
}
function buildJointVolumes(volumes = []) {
  disposeMeshes(jointMeshes);
  for (const volume of volumes) {
    if (!volume?.center?.every(Number.isFinite) || !volume?.radii?.every(Number.isFinite)) continue;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 30, 18),
      new THREE.MeshStandardMaterial({ color: COLORS.disc, roughness: 0.58, transparent: true, opacity: 0.62, side: THREE.DoubleSide })
    );
    mesh.position.fromArray(volume.center); mesh.scale.set(...volume.radii);
    mesh.userData = { overlayType: 'joint', infoKey: 'disco_articular_atm', sourceName: volume.name || 'Disco articular', side: volume.side, schematic: true, basePosition: mesh.position.clone() };
    overlayRoot.add(mesh); jointMeshes.push(mesh);
  }
}
function buildMuscleVolumes(volumes = []) {
  disposeMeshes(muscleMeshes);
  const up = new THREE.Vector3(0, 1, 0);
  for (const muscle of volumes) {
    if (!muscle?.start?.every(Number.isFinite) || !muscle?.end?.every(Number.isFinite)) continue;
    const start = new THREE.Vector3(...muscle.start), end = new THREE.Vector3(...muscle.end);
    const direction = end.clone().sub(start), length = direction.length();
    if (!length) continue;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 28, 18),
      new THREE.MeshStandardMaterial({ color: COLORS.muscle, roughness: 0.72, transparent: true, opacity: 0.52, depthTest: true })
    );
    mesh.position.copy(start).lerp(end, 0.5);
    mesh.scale.set(muscle.width || 0.005, length / 2, muscle.depth || 0.003);
    mesh.quaternion.setFromUnitVectors(up, direction.normalize());
    mesh.userData = { overlayType: 'muscle', infoKey: muscle.key, sourceName: muscle.name, side: muscle.side, schematic: true };
    overlayRoot.add(mesh); muscleMeshes.push(mesh);
  }
}

function syncOverlayControls() {
  for (const marker of markerMeshes) marker.visible = landmarksVisible && (!isolated || marker.userData.parentKey === selectedKey) && !jawDemoRunning;
  for (const nerve of nerveMeshes) nerve.visible = nervesVisible && !isolated && !jawDemoRunning;
  for (const vessel of vesselMeshes) vessel.visible = vesselsVisible && !isolated && !jawDemoRunning;
  for (const canal of canalMeshes) canal.visible = canalVisible && (!isolated || selectedKey === 'mandibula') && !jawDemoRunning;
  for (const joint of jointMeshes) joint.visible = tmjVisible && (!isolated || selectedKey === 'mandibula' || selectedKey === 'temporal') && !jawDemoRunning;
  for (const muscle of muscleMeshes) muscle.visible = musclesVisible && !isolated && !jawDemoRunning;
  const sync = (button, visible, on, off) => { if (!button) return; button.classList.toggle('active', visible); button.textContent = visible ? on : off; button.setAttribute('aria-pressed', String(visible)); };
  sync(landmarksButton, landmarksVisible, 'Accidentes 3D: visibles', 'Accidentes 3D: ocultos');
  sync(nervesButton, nervesVisible, 'Nervios: visibles', 'Nervios: ocultos');
  sync(vesselsButton, vesselsVisible, 'Arterias: visibles', 'Arterias: ocultas');
  sync(canalButton, canalVisible, 'Conducto mandibular: visible', 'Conducto mandibular: oculto');
  sync(tmjButton, tmjVisible, 'ATM: visible', 'ATM: oculta');
  sync(musclesButton, musclesVisible, 'Músculos: visibles', 'Músculos: ocultos');
}

function applyVisualState() {
  for (const mesh of meshes) {
    const selected = selectedKey && mesh.userData.infoKey === selectedKey;
    mesh.visible = !isolated || selected;
    mesh.material.opacity = contextDimmed && selectedKey && !selected ? 0.14 : 1;
    mesh.material.depthWrite = mesh.material.opacity > 0.5;
    mesh.material.color.setHex(selected ? COLORS.selectedBone : hovered === mesh ? COLORS.hoverBone : COLORS.bone);
  }
  for (const marker of markerMeshes) {
    const selected = selectedLandmarkKey && marker.userData.infoKey === selectedLandmarkKey;
    marker.scale.setScalar(selectedMarker === marker ? 1.55 : selected ? 1.28 : hovered === marker ? 1.18 : 1);
    marker.material.color.setHex(selected ? COLORS.landmarkSelected : hovered === marker ? COLORS.landmarkHover : COLORS.landmark);
  }
  for (const canal of canalMeshes) {
    const selected = selectedPathKey && canal.userData.infoKey === selectedPathKey;
    canal.material.color.setHex(selected ? COLORS.canalSelected : COLORS.canal); canal.material.opacity = selected ? 0.96 : 0.76;
  }
  for (const muscle of muscleMeshes) {
    const selected = selectedSpecialKey && muscle.userData.infoKey === selectedSpecialKey;
    muscle.material.color.setHex(selected ? COLORS.muscleSelected : COLORS.muscle);
    muscle.material.opacity = selected ? 0.76 : 0.52;
  }
  isolateButton?.classList.toggle('active', isolated); contextButton?.classList.toggle('active', contextDimmed);
  syncOverlayControls();
}

function clearOverlaySelection() { selectedLandmarkKey = null; selectedMarker = null; selectedPathKey = null; selectedSpecialKey = null; selectedSpecialMesh = null; }
function selectLandmarkKey(key, emit = false, exact = null) {
  const candidates = markerMeshes.filter((m) => m.userData.infoKey === key); if (!candidates.length) return false;
  clearOverlaySelection(); selectedLandmarkKey = key; selectedMarker = exact && candidates.includes(exact) ? exact : null; selectedKey = LANDMARK_PARENT[key] || selectedKey; landmarksVisible = true; isolated = false; applyVisualState();
  if (emit) { const m = selectedMarker || candidates[0]; document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: m.userData.sourceName, side: m.userData.side, marker: true } })); }
  return true;
}
function selectPathKey(key, emit = false, exact = null) {
  const candidates = canalMeshes.filter((m) => m.userData.infoKey === key); if (!candidates.length) return false;
  clearOverlaySelection(); selectedPathKey = key; selectedSpecialMesh = exact && candidates.includes(exact) ? exact : null; selectedKey = 'mandibula'; canalVisible = true; isolated = false; applyVisualState();
  if (emit) { const m = selectedSpecialMesh || candidates[0]; document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: m.userData.sourceName, side: m.userData.side, path: true } })); }
  return true;
}
function selectSpecial(key, mesh = null) {
  clearOverlaySelection(); selectedSpecialKey = key; selectedSpecialMesh = mesh; isolated = false;
  if (key === 'disco_articular_atm') tmjVisible = true; else musclesVisible = true;
  applyVisualState(); renderSpecialInfo(key, mesh?.userData.side || null);
}
function selectKey(key, emit = false) {
  if (LANDMARK_PARENT[key] && selectLandmarkKey(key, emit)) return true;
  if (key === 'conducto_mandibular' && selectPathKey(key, emit)) return true;
  clearOverlaySelection();
  const available = meshes.some((m) => m.userData.infoKey === key); selectedKey = available ? key : null;
  if (!available) { isolated = false; contextDimmed = false; }
  applyVisualState();
  if (emit && available) { const picked = meshes.find((m) => m.userData.infoKey === key); document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: picked?.userData.sourceName || '' } })); }
  return available;
}

function renderSpecialInfo(key, side = null) {
  const d = SPECIAL_INFO[key]; if (!d) return;
  const title = side ? `${d.title} · ${side}` : d.title;
  if ($('viewerTitle')) $('viewerTitle').textContent = title;
  if ($('infoTitle')) $('infoTitle').textContent = title;
  if ($('infoMeta')) $('infoMeta').textContent = d.type;
  if ($('infoSummary')) $('infoSummary').textContent = d.summary;
  if ($('infoLocation')) $('infoLocation').textContent = d.location;
  if ($('infoParts')) $('infoParts').textContent = d.parts;
  if ($('infoRelations')) $('infoRelations').textContent = d.relations;
  if ($('infoClinical')) $('infoClinical').textContent = d.clinical;
  if ($('infoBooks')) $('infoBooks').textContent = BOOKS;
  const bc = $('infoBreadcrumb'); if (bc) { bc.hidden = false; bc.textContent = key === 'disco_articular_atm' ? `ATM → ${d.title}` : key === 'atm' ? 'Mandíbula ↔ Temporal' : `Músculos de la masticación → ${d.title}`; }
  const tips = $('infoExamTips'); if (tips) { tips.innerHTML = ''; for (const tip of d.tips || []) { const li = document.createElement('li'); li.textContent = tip; tips.appendChild(li); } }
  const related = $('infoRelated'); if (related) {
    related.innerHTML = '';
    for (const [relatedKey, label] of d.related || []) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.addEventListener('click', () => selectKey(relatedKey, true)); related.appendChild(b);
    }
  }
}

function boneBounds() { const box = new THREE.Box3(); meshes.forEach((m) => box.expandByObject(m)); return box; }
function fitCamera() {
  const box = boneBounds(); if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3()); root.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z), distance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))) * 1.5;
  controls.target.set(0, 0, 0); camera.position.set(0, 0, Math.max(distance, 0.22)); controls.minDistance = Math.max(maxDim * 0.55, 0.08); controls.maxDistance = Math.max(maxDim * 4.5, 0.8); camera.near = Math.max(maxDim / 200, 0.001); camera.far = Math.max(maxDim * 20, 5); camera.updateProjectionMatrix(); controls.update();
}
function selectedBox() {
  let targets = [];
  if (selectedSpecialMesh?.visible) targets = [selectedSpecialMesh];
  else if (selectedSpecialKey) targets = [...muscleMeshes, ...jointMeshes].filter((m) => m.visible && m.userData.infoKey === selectedSpecialKey);
  else if (selectedLandmarkKey) targets = selectedMarker ? [selectedMarker] : markerMeshes.filter((m) => m.visible && m.userData.infoKey === selectedLandmarkKey);
  else if (selectedPathKey) targets = canalMeshes.filter((m) => m.visible && m.userData.infoKey === selectedPathKey);
  else if (selectedKey) targets = meshes.filter((m) => m.visible && m.userData.infoKey === selectedKey);
  if (!targets.length) return null;
  const box = new THREE.Box3(); targets.forEach((m) => box.expandByObject(m)); return box.isEmpty() ? null : box;
}
function focusSelection() {
  const box = selectedBox(); if (!box) return false;
  const center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3()), maxDim = Math.max(size.x, size.y, size.z);
  let direction = camera.position.clone().sub(controls.target).normalize(); if (!Number.isFinite(direction.x) || direction.lengthSq() < 0.1) direction = new THREE.Vector3(0, 0, 1);
  const overlay = selectedLandmarkKey || selectedPathKey || selectedSpecialKey;
  const distance = Math.max(maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))) * 1.9, maxDim * 2.1, overlay ? 0.045 : 0.08);
  controls.target.copy(center); camera.position.copy(center).add(direction.multiplyScalar(distance)); controls.update(); return true;
}

async function loadAtlas() {
  setStatus('Leyendo atlas anatómico…');
  const manifestResponse = await fetch(MANIFEST_URL, { mode: 'cors' }); if (!manifestResponse.ok) throw new Error(`Manifest ${manifestResponse.status}`);
  const manifest = await manifestResponse.json(); if (!Array.isArray(manifest.parts) || !Array.isArray(manifest.chunks)) throw new Error('Formato de atlas no compatible');
  const selectedParts = manifest.parts.map((part) => ({ part, infoKey: matchBone(part.name || '') })).filter(({ infoKey }) => Boolean(infoKey));
  if (!selectedParts.length) throw new Error('No se encontraron huesos del cráneo en el atlas');
  const mandiblePart = manifest.parts.find((part) => part.id === 'FJ3289' || part.conceptId === 'FJ3289' || /^Mandible$/i.test(part.name || ''));
  const neededParts = manifest.parts.filter((part) => /tooth/i.test(part?.name || '') || part === mandiblePart);
  const chunkIndexes = [...new Set([...selectedParts.map(({ part }) => part.chunk), ...neededParts.map((part) => part.chunk)])];
  setStatus(`Cargando ${selectedParts.length} piezas anatómicas…`);
  const chunkBuffers = new Map(); let completed = 0;
  await Promise.all(chunkIndexes.map(async (chunkIndex) => {
    const chunk = manifest.chunks[chunkIndex]; if (!chunk?.url) return;
    const response = await fetch(`${MODEL_BASE}${chunk.url}`, { mode: 'cors' }); if (!response.ok) throw new Error(`Chunk ${chunkIndex}: ${response.status}`);
    chunkBuffers.set(chunkIndex, await response.arrayBuffer()); completed += 1; setStatus(`Cargando geometría ${completed}/${chunkIndexes.length}…`);
  }));
  for (const { part, infoKey } of selectedParts) {
    const buffer = chunkBuffers.get(part.chunk); if (!buffer) continue;
    const geometry = makeGeometry(part, buffer); if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, makeBoneMaterial()); mesh.userData = { infoKey, sourceName: part.name || infoKey, conceptId: part.conceptId || part.id || '' }; boneRoot.add(mesh); meshes.push(mesh);
  }
  if (!meshes.length) throw new Error('No se pudo construir la geometría del cráneo');
  const reader = (part) => readVertices(part, chunkBuffers);
  let summary = { landmarks: 0, nerves: 0, vessels: 0, canals: 0, joints: 0, muscles: 0 };
  try {
    const overlays = deriveDentalLandmarks(manifest.parts, reader); landmarkCache = overlays.landmarkPoints || {};
    buildLandmarkMarkers(overlays.landmarkPoints); buildNervePaths(overlays.nervePaths); buildCanalPaths(overlays.canalPaths); buildJointVolumes(overlays.jointVolumes);
    buildVesselPaths(deriveVascularPaths(manifest.parts, reader)); buildMuscleVolumes(deriveMasticatoryMuscles(manifest.parts, overlays.landmarkPoints));
    summary = { landmarks: markerMeshes.length, nerves: nerveMeshes.length, vessels: vesselMeshes.length, canals: canalMeshes.length, joints: jointMeshes.length, muscles: muscleMeshes.length };
  } catch (error) { console.warn('[Simulador 3D] No se pudieron calcular todas las capas educativas', error); }
  fitCamera(); syncOverlayControls(); setStatus(`${meshes.length} piezas · ${summary.landmarks} marcadores · ${summary.nerves} nervios · ${summary.vessels} arterias · ${summary.muscles} músculos`, 'ready'); stage.classList.add('loaded');
  document.dispatchEvent(new CustomEvent('simulator:viewer-ready', { detail: { pieces: meshes.length, ...summary } }));
}

function normalizedPointer(event) { const rect = canvas.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; }
function hitTest(event) {
  if (!meshes.length) return null; normalizedPointer(event); raycaster.setFromCamera(pointer, camera);
  const targets = [...markerMeshes, ...canalMeshes, ...muscleMeshes, ...jointMeshes, ...meshes].filter((m) => m.visible);
  return raycaster.intersectObjects(targets, false)[0]?.object || null;
}
function directTooltip(object, event) {
  if (!tooltip) return;
  if (!object || !['muscle','joint'].includes(object.userData.overlayType)) { tooltip.hidden = true; return; }
  const rect = stage.getBoundingClientRect(); tooltip.textContent = `${object.userData.sourceName}${object.userData.side ? ` · ${object.userData.side}` : ''}`; tooltip.style.left = `${Math.max(0, Math.min(rect.width - 20, event.clientX - rect.left))}px`; tooltip.style.top = `${Math.max(0, Math.min(rect.height - 20, event.clientY - rect.top))}px`; tooltip.hidden = false;
}
function emitHover(object, event) {
  if (object && ['muscle','joint'].includes(object.userData.overlayType)) { directTooltip(object, event); return; }
  directTooltip(null, event);
  const rect = stage.getBoundingClientRect();
  document.dispatchEvent(new CustomEvent('simulator:hover', { detail: object ? { key: object.userData.infoKey, x: Math.max(0, Math.min(rect.width - 20, event.clientX - rect.left)), y: Math.max(0, Math.min(rect.height - 20, event.clientY - rect.top)), marker: object.userData.overlayType === 'landmark', side: object.userData.side || null } : { key: null } }));
}

function resetMandibleTransform() { for (const mesh of meshes.filter((m) => m.userData.infoKey === 'mandibula')) { mesh.position.set(0, 0, 0); mesh.quaternion.identity(); } for (const joint of jointMeshes) if (joint.userData.basePosition) joint.position.copy(joint.userData.basePosition); }
function stopJawDemo() { if (jawDemoFrame) cancelAnimationFrame(jawDemoFrame); jawDemoFrame = null; jawDemoRunning = false; resetMandibleTransform(); if (motionButton) { motionButton.disabled = false; motionButton.textContent = '▶ Movimiento ATM'; } syncOverlayControls(); }
function runJawDemo() {
  if (jawDemoRunning) return;
  const condyles = landmarkCache.condilo_mandibular || []; if (condyles.length < 2) { setStatus('No se pudo iniciar la demostración ATM', 'error'); return; }
  const pivot = new THREE.Vector3(...condyles[0]).add(new THREE.Vector3(...condyles[1])).multiplyScalar(0.5);
  const mandibles = meshes.filter((m) => m.userData.infoKey === 'mandibula'); if (!mandibles.length) return;
  jawDemoRunning = true; tmjVisible = true; musclesVisible = true; syncOverlayControls(); renderSpecialInfo('atm');
  if (motionButton) { motionButton.disabled = true; motionButton.textContent = 'ATM en movimiento…'; }
  setStatus('Demostración ATM: rotación + traslación simplificadas', 'ready');
  const start = performance.now(), duration = 4600;
  const animate = (now) => {
    const raw = Math.min(1, (now - start) / duration);
    const cycle = raw < 0.5 ? raw * 2 : (1 - raw) * 2;
    const eased = 0.5 - Math.cos(Math.PI * cycle) / 2;
    const angle = THREE.MathUtils.degToRad(19) * eased;
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle);
    const translation = new THREE.Vector3(0, -0.0022 * eased, 0.0062 * eased);
    for (const mesh of mandibles) { mesh.quaternion.copy(q); mesh.position.copy(pivot).sub(pivot.clone().applyQuaternion(q)).add(translation); }
    for (const joint of jointMeshes) if (joint.userData.basePosition) joint.position.copy(joint.userData.basePosition).addScaledVector(translation, 0.72);
    if (raw < 1 && jawDemoRunning) jawDemoFrame = requestAnimationFrame(animate); else { stopJawDemo(); setStatus('Demostración ATM finalizada · movimiento educativo simplificado', 'ready'); }
  };
  jawDemoFrame = requestAnimationFrame(animate);
}

canvas.addEventListener('pointerdown', (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
canvas.addEventListener('pointerup', (event) => {
  if (!pointerStart || jawDemoRunning) return; const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y); pointerStart = null; if (distance > 8) return;
  const object = hitTest(event); if (!object) return;
  if (object.userData.overlayType === 'landmark') selectLandmarkKey(object.userData.infoKey, true, object);
  else if (object.userData.overlayType === 'canal') selectPathKey(object.userData.infoKey, true, object);
  else if (object.userData.overlayType === 'muscle' || object.userData.overlayType === 'joint') selectSpecial(object.userData.infoKey, object);
  else selectKey(object.userData.infoKey, true);
});
canvas.addEventListener('pointermove', (event) => { if (event.buttons || jawDemoRunning) return; const next = hitTest(event); if (next !== hovered) { hovered = next; canvas.style.cursor = hovered ? 'pointer' : 'grab'; applyVisualState(); } emitHover(next, event); });
canvas.addEventListener('pointerleave', () => { hovered = null; canvas.style.cursor = 'grab'; applyVisualState(); if (tooltip) tooltip.hidden = true; document.dispatchEvent(new CustomEvent('simulator:hover', { detail: { key: null } })); });
canvas.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetButton?.click(); } if (event.key.toLowerCase() === 'f') { event.preventDefault(); focusSelection(); } });

focusButton?.addEventListener('click', () => focusSelection());
isolateButton?.addEventListener('click', () => { if (!selectedKey || jawDemoRunning) return; isolated = !isolated; if (isolated) contextDimmed = false; applyVisualState(); });
contextButton?.addEventListener('click', () => { if (!selectedKey || jawDemoRunning) return; contextDimmed = !contextDimmed; if (contextDimmed) isolated = false; applyVisualState(); });
landmarksButton?.addEventListener('click', () => { landmarksVisible = !landmarksVisible; applyVisualState(); });
nervesButton?.addEventListener('click', () => { nervesVisible = !nervesVisible; applyVisualState(); });
vesselsButton?.addEventListener('click', () => { vesselsVisible = !vesselsVisible; applyVisualState(); });
canalButton?.addEventListener('click', () => { canalVisible = !canalVisible; applyVisualState(); });
tmjButton?.addEventListener('click', () => { tmjVisible = !tmjVisible; applyVisualState(); if (tmjVisible) renderSpecialInfo('atm'); });
musclesButton?.addEventListener('click', () => { musclesVisible = !musclesVisible; applyVisualState(); });
motionButton?.addEventListener('click', runJawDemo);
resetButton?.addEventListener('click', () => { if (jawDemoRunning) stopJawDemo(); selectedKey = null; clearOverlaySelection(); isolated = false; contextDimmed = false; applyVisualState(); window.skull3dSetView?.('Anterior'); document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: 'craneo' } })); });

window.skull3dSelectByKey = (key) => selectKey(key, false);
window.skull3dSelectLandmark = (key) => selectLandmarkKey(key, false);
window.skull3dFocusSelection = focusSelection;
window.skull3dIsolate = () => { if (!selectedKey) return false; isolated = true; contextDimmed = false; applyVisualState(); return true; };
window.skull3dReset = () => resetButton?.click();
window.skull3dSetView = (view) => {
  const box = boneBounds(), size = box.getSize(new THREE.Vector3()), d = Math.max(size.x, size.y, size.z) * 2.25 || 0.4;
  const positions = { Anterior: [0, 0, d], Posterior: [0, 0, -d], Lateral: [d, 0, 0], Superior: [0, d, 0.001], Inferior: [0, -d, 0.001] };
  camera.position.set(...(positions[view] || positions.Anterior)); camera.up.set(0, 1, 0); if (view === 'Superior' || view === 'Inferior') camera.up.set(0, 0, view === 'Superior' ? -1 : 1); controls.target.set(0, 0, 0); controls.update();
};

const infoTitle = $('infoTitle');
if (infoTitle) new MutationObserver(() => {
  const title = infoTitle.textContent.trim(), landmarkKey = TITLE_TO_LANDMARK[title], pathKey = TITLE_TO_PATH[title];
  if (landmarkKey) selectLandmarkKey(landmarkKey, false); else if (pathKey) selectPathKey(pathKey, false);
}).observe(infoTitle, { childList: true, characterData: true, subtree: true });

const hint = document.querySelector('.simViewerHint');
if (hint) { const muscleHint = document.createElement('span'); muscleHint.textContent = '🔴 Músculo = volumen educativo esquemático'; hint.appendChild(muscleHint); const atmHint = document.createElement('span'); atmHint.textContent = '🟣 ATM = disco esquemático + demo de movimiento'; hint.appendChild(atmHint); }

new ResizeObserver(resize).observe(stage);
buildRenderer();
loadAtlas().catch((error) => {
  console.error('[Simulador 3D]', error); setStatus('No se pudo cargar el atlas 3D', 'error'); stage.classList.add('failed');
  const message = $('viewerError'); if (message) { message.hidden = false; message.textContent = 'El atlas anatómico no pudo cargarse. Podés seguir usando las fichas mientras revisamos la conexión del modelo.'; }
});
