import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js/+esm';
import { deriveDentalLandmarks } from './dental-landmarks.js';
import { deriveVascularPaths } from './vascular-overlays.js';

const MANIFEST_URL = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public/models/atlas.json';
const MODEL_BASE = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public';

const canvas = document.getElementById('skullCanvas');
const stage = document.getElementById('skullStage');
const status = document.getElementById('viewerStatus');
const focusButton = document.getElementById('focusBone');
const isolateButton = document.getElementById('isolateBone');
const contextButton = document.getElementById('contextBone');
const landmarksButton = document.getElementById('toggleLandmarks');
const nervesButton = document.getElementById('toggleNerves');
const vesselsButton = document.getElementById('toggleVessels');
const canalButton = document.getElementById('toggleCanal');
const tmjButton = document.getElementById('toggleTMJ');
const resetButton = document.getElementById('resetSkull');

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
  disc: 0xb76cb8
};

let renderer;
let scene;
let camera;
let controls;
let root;
let boneRoot;
let overlayRoot;
let meshes = [];
let markerMeshes = [];
let nerveMeshes = [];
let vesselMeshes = [];
let canalMeshes = [];
let jointMeshes = [];
let selectedKey = null;
let selectedLandmarkKey = null;
let selectedMarker = null;
let selectedPathKey = null;
let isolated = false;
let contextDimmed = false;
let landmarksVisible = true;
let nervesVisible = false;
let vesselsVisible = false;
let canalVisible = true;
let tmjVisible = false;
let pointerStart = null;
let hovered = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function setStatus(text, kind = '') {
  if (!status) return;
  status.textContent = text;
  status.classList.remove('ready', 'error');
  if (kind) status.classList.add(kind);
}

function matchBone(name = '') {
  for (const entry of BONE_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(name))) return entry.key;
  }
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
  const key = new THREE.DirectionalLight(0xffffff, 3.3);
  key.position.set(0.7, 1.1, 1.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc8dcff, 1.5);
  fill.position.set(-1.2, 0.3, 0.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff0d6, 1.2);
  rim.position.set(0.3, 0.2, -1.3);
  scene.add(rim);
  root = new THREE.Group();
  boneRoot = new THREE.Group();
  overlayRoot = new THREE.Group();
  root.add(boneRoot, overlayRoot);
  scene.add(root);
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

function render() {
  controls?.update();
  renderer?.render(scene, camera);
}

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
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function makeBoneMaterial() {
  return new THREE.MeshStandardMaterial({ color: COLORS.bone, roughness: 0.72, metalness: 0, transparent: true, opacity: 1 });
}

function readVertices(part, chunkBuffers) {
  const buffer = chunkBuffers.get(part.chunk);
  const positions = safeBufferView(buffer, Float32Array, part.positions, part.vertexCount * 3);
  if (!positions) return [];
  const vertices = new Array(part.vertexCount);
  for (let i = 0; i < part.vertexCount; i += 1) {
    const offset = i * 3;
    vertices[i] = [positions[offset], positions[offset + 1], positions[offset + 2]];
  }
  return vertices;
}

function disposeMeshes(list) {
  for (const mesh of list) {
    mesh.geometry?.dispose?.();
    mesh.material?.dispose?.();
    overlayRoot.remove(mesh);
  }
  list.length = 0;
}

function buildLandmarkMarkers(landmarkPoints = {}) {
  disposeMeshes(markerMeshes);
  for (const [infoKey, points] of Object.entries(landmarkPoints)) {
    points.forEach((point, index) => {
      const geometry = new THREE.SphereGeometry(0.00225, 18, 12);
      const material = new THREE.MeshStandardMaterial({ color: COLORS.landmark, roughness: 0.35, metalness: 0, emissive: 0x4a2600, emissiveIntensity: 0.22, depthTest: true });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.fromArray(point);
      marker.userData = { infoKey, overlayType: 'landmark', parentKey: LANDMARK_PARENT[infoKey] || null, side: index === 0 ? 'derecho' : 'izquierdo', sourceName: 'Marcador 3D calculado sobre el atlas' };
      overlayRoot.add(marker);
      markerMeshes.push(marker);
    });
  }
}

function nerveRadius(path) {
  if (path.caliber === 'trunk') return 0.00105;
  if (path.caliber === 'branch') return 0.00078;
  return 0.00055;
}

function buildNervePaths(paths = []) {
  disposeMeshes(nerveMeshes);
  for (const path of paths) {
    const clean = (path.points || []).filter((p) => Array.isArray(p) && p.every(Number.isFinite));
    if (clean.length < 2) continue;
    const curve = new THREE.CatmullRomCurve3(clean.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
    const geometry = new THREE.TubeGeometry(curve, Math.max(24, clean.length * 10), nerveRadius(path), 8, false);
    const material = new THREE.MeshStandardMaterial({ color: COLORS.nerve, roughness: 0.5, metalness: 0, transparent: true, opacity: 0.92, depthTest: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { overlayType: 'nerve', nerveKey: path.key, sourceName: path.name, side: path.side, schematic: true };
    overlayRoot.add(mesh);
    nerveMeshes.push(mesh);
  }
}

function vesselRadius(path) {
  return path.caliber === 'artery' ? 0.0009 : 0.00062;
}

function buildVesselPaths(paths = []) {
  disposeMeshes(vesselMeshes);
  for (const path of paths) {
    const clean = (path.points || []).filter((p) => Array.isArray(p) && p.every(Number.isFinite));
    if (clean.length < 2) continue;
    const curve = new THREE.CatmullRomCurve3(clean.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
    const geometry = new THREE.TubeGeometry(curve, Math.max(24, clean.length * 10), vesselRadius(path), 8, false);
    const material = new THREE.MeshStandardMaterial({ color: COLORS.vessel, roughness: 0.46, metalness: 0, transparent: true, opacity: 0.92, depthTest: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { overlayType: 'vessel', vesselKey: path.key, sourceName: path.name, side: path.side, schematic: true };
    overlayRoot.add(mesh);
    vesselMeshes.push(mesh);
  }
}

function buildCanalPaths(paths = []) {
  disposeMeshes(canalMeshes);
  for (const path of paths) {
    const clean = (path.points || []).filter((p) => Array.isArray(p) && p.every(Number.isFinite));
    if (clean.length < 2) continue;
    const curve = new THREE.CatmullRomCurve3(clean.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
    const geometry = new THREE.TubeGeometry(curve, Math.max(30, clean.length * 12), 0.00115, 10, false);
    const material = new THREE.MeshStandardMaterial({ color: COLORS.canal, roughness: 0.42, metalness: 0, transparent: true, opacity: 0.76, depthTest: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData = { overlayType: 'canal', infoKey: path.key || 'conducto_mandibular', parentKey: 'mandibula', sourceName: `${path.name} · trayecto educativo`, side: path.side, schematic: true };
    overlayRoot.add(mesh);
    canalMeshes.push(mesh);
  }
}

function buildJointVolumes(volumes = []) {
  disposeMeshes(jointMeshes);
  for (const volume of volumes) {
    if (!volume?.center?.every(Number.isFinite) || !volume?.radii?.every(Number.isFinite)) continue;
    const geometry = new THREE.SphereGeometry(1, 30, 18);
    const material = new THREE.MeshStandardMaterial({ color: COLORS.disc, roughness: 0.58, metalness: 0, transparent: true, opacity: 0.62, depthTest: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(volume.center);
    mesh.scale.set(...volume.radii);
    mesh.userData = { overlayType: 'joint', sourceName: volume.name, side: volume.side, schematic: true };
    overlayRoot.add(mesh);
    jointMeshes.push(mesh);
  }
}

function syncOverlayControls() {
  for (const marker of markerMeshes) marker.visible = landmarksVisible && (!isolated || marker.userData.parentKey === selectedKey);
  for (const nerve of nerveMeshes) nerve.visible = nervesVisible && !isolated;
  for (const vessel of vesselMeshes) vessel.visible = vesselsVisible && !isolated;
  for (const canal of canalMeshes) canal.visible = canalVisible && (!isolated || selectedKey === 'mandibula');
  for (const joint of jointMeshes) joint.visible = tmjVisible && (!isolated || selectedKey === 'mandibula' || selectedKey === 'temporal');
  if (landmarksButton) {
    landmarksButton.classList.toggle('active', landmarksVisible);
    landmarksButton.textContent = landmarksVisible ? 'Accidentes 3D: visibles' : 'Accidentes 3D: ocultos';
    landmarksButton.setAttribute('aria-pressed', String(landmarksVisible));
  }
  if (nervesButton) {
    nervesButton.classList.toggle('active', nervesVisible);
    nervesButton.textContent = nervesVisible ? 'Nervios: visibles' : 'Nervios: ocultos';
    nervesButton.setAttribute('aria-pressed', String(nervesVisible));
  }
  if (vesselsButton) {
    vesselsButton.classList.toggle('active', vesselsVisible);
    vesselsButton.textContent = vesselsVisible ? 'Arterias: visibles' : 'Arterias: ocultas';
    vesselsButton.setAttribute('aria-pressed', String(vesselsVisible));
  }
  if (canalButton) {
    canalButton.classList.toggle('active', canalVisible);
    canalButton.textContent = canalVisible ? 'Conducto mandibular: visible' : 'Conducto mandibular: oculto';
    canalButton.setAttribute('aria-pressed', String(canalVisible));
  }
  if (tmjButton) {
    tmjButton.classList.toggle('active', tmjVisible);
    tmjButton.textContent = tmjVisible ? 'ATM: visible' : 'ATM: oculta';
    tmjButton.setAttribute('aria-pressed', String(tmjVisible));
  }
}

function applyVisualState() {
  for (const mesh of meshes) {
    const isSelected = selectedKey && mesh.userData.infoKey === selectedKey;
    const isHovered = hovered === mesh && !isSelected;
    mesh.visible = !isolated || isSelected;
    mesh.material.opacity = contextDimmed && selectedKey && !isSelected ? 0.14 : 1;
    mesh.material.depthWrite = mesh.material.opacity > 0.5;
    if (isSelected) mesh.material.color.setHex(COLORS.selectedBone);
    else if (isHovered) mesh.material.color.setHex(COLORS.hoverBone);
    else mesh.material.color.setHex(COLORS.bone);
  }
  for (const marker of markerMeshes) {
    const isSelected = selectedLandmarkKey && marker.userData.infoKey === selectedLandmarkKey;
    const isExact = selectedMarker === marker;
    const isHovered = hovered === marker && !isSelected;
    marker.scale.setScalar(isExact ? 1.55 : isSelected ? 1.28 : isHovered ? 1.18 : 1);
    marker.material.color.setHex(isSelected ? COLORS.landmarkSelected : isHovered ? COLORS.landmarkHover : COLORS.landmark);
    marker.material.emissiveIntensity = isSelected ? 0.55 : isHovered ? 0.4 : 0.22;
  }
  for (const canal of canalMeshes) {
    const active = selectedPathKey && canal.userData.infoKey === selectedPathKey;
    canal.material.color.setHex(active ? COLORS.canalSelected : COLORS.canal);
    canal.material.opacity = active ? 0.96 : 0.76;
  }
  isolateButton?.classList.toggle('active', isolated);
  contextButton?.classList.toggle('active', contextDimmed);
  syncOverlayControls();
}

function clearOverlaySelection() {
  selectedLandmarkKey = null;
  selectedMarker = null;
  selectedPathKey = null;
}

function selectLandmarkKey(key, emit = false, exactMarker = null) {
  const candidates = markerMeshes.filter((marker) => marker.userData.infoKey === key);
  if (!candidates.length) return false;
  selectedLandmarkKey = key;
  selectedMarker = exactMarker && candidates.includes(exactMarker) ? exactMarker : null;
  selectedPathKey = null;
  selectedKey = LANDMARK_PARENT[key] || selectedKey;
  landmarksVisible = true;
  isolated = false;
  applyVisualState();
  if (emit) {
    const marker = selectedMarker || candidates[0];
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: marker.userData.sourceName, side: marker.userData.side, marker: true } }));
  }
  return true;
}

function selectPathKey(key, emit = false, exactMesh = null) {
  const candidates = canalMeshes.filter((mesh) => mesh.userData.infoKey === key);
  if (!candidates.length) return false;
  selectedPathKey = key;
  selectedLandmarkKey = null;
  selectedMarker = null;
  selectedKey = candidates[0].userData.parentKey || selectedKey;
  canalVisible = true;
  isolated = false;
  applyVisualState();
  if (emit) {
    const mesh = exactMesh && candidates.includes(exactMesh) ? exactMesh : candidates[0];
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: mesh.userData.sourceName, side: mesh.userData.side, path: true } }));
  }
  return true;
}

function selectKey(key, emit = false) {
  if (LANDMARK_PARENT[key] && selectLandmarkKey(key, emit)) return true;
  if (key === 'conducto_mandibular' && selectPathKey(key, emit)) return true;
  clearOverlaySelection();
  const available = meshes.some((mesh) => mesh.userData.infoKey === key);
  selectedKey = available ? key : null;
  if (!available) {
    isolated = false;
    contextDimmed = false;
  }
  applyVisualState();
  if (emit && available) {
    const picked = meshes.find((mesh) => mesh.userData.infoKey === key);
    document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key, sourceName: picked?.userData.sourceName || '' } }));
  }
  return available;
}

function boneBounds() {
  const box = new THREE.Box3();
  meshes.forEach((mesh) => box.expandByObject(mesh));
  return box;
}

function fitCamera() {
  const box = boneBounds();
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  root.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))) * 1.5;
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0, Math.max(distance, 0.22));
  controls.minDistance = Math.max(maxDim * 0.55, 0.08);
  controls.maxDistance = Math.max(maxDim * 4.5, 0.8);
  camera.near = Math.max(maxDim / 200, 0.001);
  camera.far = Math.max(maxDim * 20, 5);
  camera.updateProjectionMatrix();
  controls.update();
}

function selectedBox() {
  if (selectedLandmarkKey) {
    const targets = selectedMarker ? [selectedMarker] : markerMeshes.filter((m) => m.userData.infoKey === selectedLandmarkKey && m.visible);
    if (targets.length) {
      const box = new THREE.Box3();
      targets.forEach((m) => box.expandByObject(m));
      if (!box.isEmpty()) return box;
    }
  }
  if (selectedPathKey) {
    const targets = canalMeshes.filter((m) => m.userData.infoKey === selectedPathKey && m.visible);
    if (targets.length) {
      const box = new THREE.Box3();
      targets.forEach((m) => box.expandByObject(m));
      if (!box.isEmpty()) return box;
    }
  }
  if (!selectedKey) return null;
  const selectedMeshes = meshes.filter((mesh) => mesh.userData.infoKey === selectedKey && mesh.visible);
  if (!selectedMeshes.length) return null;
  const box = new THREE.Box3();
  selectedMeshes.forEach((mesh) => box.expandByObject(mesh));
  return box.isEmpty() ? null : box;
}

function focusSelection() {
  const box = selectedBox();
  if (!box) return false;
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (!Number.isFinite(direction.x) || direction.lengthSq() < 0.1) direction.set(0, 0, 1);
  const overlaySelected = selectedLandmarkKey || selectedPathKey;
  const distance = Math.max(maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))) * 1.9, maxDim * 2.1, overlaySelected ? 0.045 : 0.08);
  controls.target.copy(center);
  camera.position.copy(center).add(direction.multiplyScalar(distance));
  controls.update();
  return true;
}

async function loadAtlas() {
  setStatus('Leyendo atlas anatómico…');
  const manifestResponse = await fetch(MANIFEST_URL, { mode: 'cors' });
  if (!manifestResponse.ok) throw new Error(`Manifest ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  if (!Array.isArray(manifest.parts) || !Array.isArray(manifest.chunks)) throw new Error('Formato de atlas no compatible');
  const selectedParts = manifest.parts.map((part) => ({ part, infoKey: matchBone(part.name || '') })).filter(({ infoKey }) => Boolean(infoKey));
  if (!selectedParts.length) throw new Error('No se encontraron huesos del cráneo en el atlas');
  const mandiblePart = manifest.parts.find((part) => part.id === 'FJ3289' || part.conceptId === 'FJ3289' || /^Mandible$/i.test(part.name || ''));
  const neededParts = manifest.parts.filter((part) => toothPart(part) || part === mandiblePart);
  const chunkIndexes = [...new Set([...selectedParts.map(({ part }) => part.chunk), ...neededParts.map((part) => part.chunk)])];
  setStatus(`Cargando ${selectedParts.length} piezas anatómicas…`);
  const chunkBuffers = new Map();
  let completed = 0;
  await Promise.all(chunkIndexes.map(async (chunkIndex) => {
    const chunk = manifest.chunks[chunkIndex];
    if (!chunk?.url) return;
    const response = await fetch(`${MODEL_BASE}${chunk.url}`, { mode: 'cors' });
    if (!response.ok) throw new Error(`Chunk ${chunkIndex}: ${response.status}`);
    chunkBuffers.set(chunkIndex, await response.arrayBuffer());
    completed += 1;
    setStatus(`Cargando geometría ${completed}/${chunkIndexes.length}…`);
  }));
  for (const { part, infoKey } of selectedParts) {
    const buffer = chunkBuffers.get(part.chunk);
    if (!buffer) continue;
    const geometry = makeGeometry(part, buffer);
    if (!geometry) continue;
    const mesh = new THREE.Mesh(geometry, makeBoneMaterial());
    mesh.userData = { infoKey, sourceName: part.name || infoKey, conceptId: part.conceptId || part.id || '' };
    boneRoot.add(mesh);
    meshes.push(mesh);
  }
  if (!meshes.length) throw new Error('No se pudo construir la geometría del cráneo');

  const reader = (part) => readVertices(part, chunkBuffers);
  let overlaysSummary = { landmarks: 0, nerves: 0, vessels: 0, canals: 0, joints: 0 };
  try {
    const overlays = deriveDentalLandmarks(manifest.parts, reader);
    buildLandmarkMarkers(overlays.landmarkPoints);
    buildNervePaths(overlays.nervePaths);
    buildCanalPaths(overlays.canalPaths);
    buildJointVolumes(overlays.jointVolumes);
    buildVesselPaths(deriveVascularPaths(manifest.parts, reader));
    overlaysSummary = { landmarks: markerMeshes.length, nerves: nerveMeshes.length, vessels: vesselMeshes.length, canals: canalMeshes.length, joints: jointMeshes.length };
  } catch (error) {
    console.warn('[Simulador 3D] No se pudieron calcular todas las capas dentales', error);
  }
  fitCamera();
  syncOverlayControls();
  setStatus(`${meshes.length} piezas · ${overlaysSummary.landmarks} marcadores · ${overlaysSummary.nerves} nervios · ${overlaysSummary.vessels} arterias`, 'ready');
  stage.classList.add('loaded');
  document.dispatchEvent(new CustomEvent('simulator:viewer-ready', { detail: { pieces: meshes.length, ...overlaysSummary } }));
}

function toothPart(part) {
  return /tooth/i.test(part?.name || '');
}

function normalizedPointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function hitTest(event) {
  if (!meshes.length) return null;
  normalizedPointer(event);
  raycaster.setFromCamera(pointer, camera);
  const targets = [...markerMeshes.filter((mesh) => mesh.visible), ...canalMeshes.filter((mesh) => mesh.visible), ...meshes.filter((mesh) => mesh.visible)];
  const hits = raycaster.intersectObjects(targets, false);
  return hits[0]?.object || null;
}

function emitHover(object, event) {
  const rect = stage.getBoundingClientRect();
  document.dispatchEvent(new CustomEvent('simulator:hover', {
    detail: object ? { key: object.userData.infoKey, x: Math.max(0, Math.min(rect.width - 20, event.clientX - rect.left)), y: Math.max(0, Math.min(rect.height - 20, event.clientY - rect.top)), marker: object.userData.overlayType === 'landmark', side: object.userData.side || null } : { key: null }
  }));
}

canvas.addEventListener('pointerdown', (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
canvas.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  pointerStart = null;
  if (distance > 8) return;
  const object = hitTest(event);
  if (!object) return;
  if (object.userData.overlayType === 'landmark') selectLandmarkKey(object.userData.infoKey, true, object);
  else if (object.userData.overlayType === 'canal') selectPathKey(object.userData.infoKey, true, object);
  else selectKey(object.userData.infoKey, true);
});
canvas.addEventListener('pointermove', (event) => {
  if (event.buttons) return;
  const next = hitTest(event);
  if (next !== hovered) {
    hovered = next;
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
    applyVisualState();
  }
  emitHover(next, event);
});
canvas.addEventListener('pointerleave', () => {
  hovered = null;
  canvas.style.cursor = 'grab';
  applyVisualState();
  document.dispatchEvent(new CustomEvent('simulator:hover', { detail: { key: null } }));
});
canvas.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetButton?.click(); }
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); focusSelection(); }
});

focusButton?.addEventListener('click', () => focusSelection());
isolateButton?.addEventListener('click', () => { if (!selectedKey) return; isolated = !isolated; if (isolated) contextDimmed = false; applyVisualState(); });
contextButton?.addEventListener('click', () => { if (!selectedKey) return; contextDimmed = !contextDimmed; if (contextDimmed) isolated = false; applyVisualState(); });
landmarksButton?.addEventListener('click', () => { landmarksVisible = !landmarksVisible; if (!landmarksVisible) { selectedLandmarkKey = null; selectedMarker = null; } applyVisualState(); });
nervesButton?.addEventListener('click', () => { nervesVisible = !nervesVisible; applyVisualState(); });
vesselsButton?.addEventListener('click', () => { vesselsVisible = !vesselsVisible; applyVisualState(); });
canalButton?.addEventListener('click', () => { canalVisible = !canalVisible; if (!canalVisible) selectedPathKey = null; applyVisualState(); });
tmjButton?.addEventListener('click', () => { tmjVisible = !tmjVisible; applyVisualState(); });
resetButton?.addEventListener('click', () => {
  selectedKey = null;
  clearOverlaySelection();
  isolated = false;
  contextDimmed = false;
  applyVisualState();
  window.skull3dSetView?.('Anterior');
  document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: 'craneo' } }));
});

window.skull3dSelectByKey = (key) => selectKey(key, false);
window.skull3dSelectLandmark = (key) => selectLandmarkKey(key, false);
window.skull3dFocusSelection = focusSelection;
window.skull3dIsolate = () => { if (!selectedKey) return false; isolated = true; contextDimmed = false; applyVisualState(); return true; };
window.skull3dReset = () => resetButton?.click();
window.skull3dSetView = (view) => {
  const box = boneBounds();
  const size = box.getSize(new THREE.Vector3());
  const d = Math.max(size.x, size.y, size.z) * 2.25 || 0.4;
  const positions = { Anterior: [0, 0, d], Posterior: [0, 0, -d], Lateral: [d, 0, 0], Superior: [0, d, 0.001], Inferior: [0, -d, 0.001] };
  const next = positions[view] || positions.Anterior;
  camera.position.set(...next);
  camera.up.set(0, 1, 0);
  if (view === 'Superior' || view === 'Inferior') camera.up.set(0, 0, view === 'Superior' ? -1 : 1);
  controls.target.set(0, 0, 0);
  controls.update();
};

const infoTitle = document.getElementById('infoTitle');
if (infoTitle) {
  const syncInfoSelection = () => {
    const title = infoTitle.textContent.trim();
    const landmarkKey = TITLE_TO_LANDMARK[title];
    const pathKey = TITLE_TO_PATH[title];
    if (landmarkKey) selectLandmarkKey(landmarkKey, false);
    else if (pathKey) selectPathKey(pathKey, false);
    else if (selectedLandmarkKey || selectedPathKey) { clearOverlaySelection(); applyVisualState(); }
  };
  new MutationObserver(syncInfoSelection).observe(infoTitle, { childList: true, characterData: true, subtree: true });
}

new ResizeObserver(resize).observe(stage);
buildRenderer();
loadAtlas().catch((error) => {
  console.error('[Simulador 3D]', error);
  setStatus('No se pudo cargar el atlas 3D', 'error');
  stage.classList.add('failed');
  const message = document.getElementById('viewerError');
  if (message) {
    message.hidden = false;
    message.textContent = 'El atlas anatómico no pudo cargarse. Podés seguir usando las fichas mientras revisamos la conexión del modelo.';
  }
});