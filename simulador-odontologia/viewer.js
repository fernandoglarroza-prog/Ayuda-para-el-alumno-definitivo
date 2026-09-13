import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/+esm';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/controls/OrbitControls.js/+esm';

const MANIFEST_URL = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public/models/atlas.json';
const MODEL_BASE = 'https://raw.githubusercontent.com/slorksmo/Human-Atlas/main/public';

const canvas = document.getElementById('skullCanvas');
const stage = document.getElementById('skullStage');
const status = document.getElementById('viewerStatus');
const isolateButton = document.getElementById('isolateBone');
const contextButton = document.getElementById('contextBone');
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

const BASE_BONE = 0xe9e3d5;
const SELECTED_BONE = 0x2b72d6;
const HOVER_BONE = 0x92b9ec;

let renderer;
let scene;
let camera;
let controls;
let root;
let meshes = [];
let selectedKey = null;
let isolated = false;
let contextDimmed = false;
let pointerStart = null;
let hovered = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function setStatus(text, kind = '') {
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

  const hemi = new THREE.HemisphereLight(0xffffff, 0x7d8796, 2.4);
  scene.add(hemi);
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
  if (!Number.isFinite(byteOffset) || !Number.isFinite(count) || count <= 0) return null;
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

function makeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: BASE_BONE,
    roughness: 0.72,
    metalness: 0,
    transparent: true,
    opacity: 1
  });
}

function applyVisualState() {
  for (const mesh of meshes) {
    const isSelected = selectedKey && mesh.userData.infoKey === selectedKey;
    const isHovered = hovered === mesh && !isSelected;
    mesh.visible = !isolated || isSelected;
    mesh.material.opacity = contextDimmed && selectedKey && !isSelected ? 0.17 : 1;
    mesh.material.depthWrite = mesh.material.opacity > 0.5;
    if (isSelected) mesh.material.color.setHex(SELECTED_BONE);
    else if (isHovered) mesh.material.color.setHex(HOVER_BONE);
    else mesh.material.color.setHex(BASE_BONE);
  }
  isolateButton?.classList.toggle('active', isolated);
  contextButton?.classList.toggle('active', contextDimmed);
}

function selectKey(key, emit = false) {
  const available = meshes.some((mesh) => mesh.userData.infoKey === key);
  selectedKey = available ? key : null;
  if (!available) {
    isolated = false;
    contextDimmed = false;
  }
  applyVisualState();
  if (emit && available) {
    const picked = meshes.find((mesh) => mesh.userData.infoKey === key);
    document.dispatchEvent(new CustomEvent('simulator:select', {
      detail: { key, sourceName: picked?.userData.sourceName || '' }
    }));
  }
  return available;
}

function fitCamera() {
  const box = new THREE.Box3().setFromObject(root);
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

async function loadAtlas() {
  setStatus('Leyendo atlas anatómico…');
  const manifestResponse = await fetch(MANIFEST_URL, { mode: 'cors' });
  if (!manifestResponse.ok) throw new Error(`Manifest ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  if (!Array.isArray(manifest.parts) || !Array.isArray(manifest.chunks)) throw new Error('Formato de atlas no compatible');

  const selectedParts = manifest.parts
    .map((part) => ({ part, infoKey: matchBone(part.name || '') }))
    .filter(({ infoKey }) => Boolean(infoKey));

  if (!selectedParts.length) throw new Error('No se encontraron huesos del cráneo en el atlas');

  const chunkIndexes = [...new Set(selectedParts.map(({ part }) => part.chunk))];
  setStatus(`Cargando ${selectedParts.length} piezas anatómicas…`);

  const chunkBuffers = new Map();
  let completed = 0;
  await Promise.all(chunkIndexes.map(async (chunkIndex) => {
    const chunk = manifest.chunks[chunkIndex];
    if (!chunk?.url) return;
    const url = `${MODEL_BASE}${chunk.url}`;
    const response = await fetch(url, { mode: 'cors' });
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
    const mesh = new THREE.Mesh(geometry, makeMaterial());
    mesh.userData = {
      infoKey,
      sourceName: part.name || infoKey,
      conceptId: part.conceptId || part.id || ''
    };
    root.add(mesh);
    meshes.push(mesh);
  }

  if (!meshes.length) throw new Error('No se pudo construir la geometría del cráneo');
  fitCamera();
  setStatus(`${meshes.length} piezas 3D listas`, 'ready');
  stage.classList.add('loaded');
  document.dispatchEvent(new CustomEvent('simulator:viewer-ready', { detail: { pieces: meshes.length } }));
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
  const hits = raycaster.intersectObjects(meshes.filter((mesh) => mesh.visible), false);
  return hits[0]?.object || null;
}

canvas.addEventListener('pointerdown', (event) => {
  pointerStart = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointerup', (event) => {
  if (!pointerStart) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  pointerStart = null;
  if (distance > 8) return;
  const mesh = hitTest(event);
  if (!mesh) return;
  selectKey(mesh.userData.infoKey, true);
});

canvas.addEventListener('pointermove', (event) => {
  if (event.buttons) return;
  const next = hitTest(event);
  if (next === hovered) return;
  hovered = next;
  canvas.style.cursor = hovered ? 'pointer' : 'grab';
  applyVisualState();
});

canvas.addEventListener('pointerleave', () => {
  hovered = null;
  canvas.style.cursor = 'grab';
  applyVisualState();
});

isolateButton?.addEventListener('click', () => {
  if (!selectedKey) return;
  isolated = !isolated;
  if (isolated) contextDimmed = false;
  applyVisualState();
});

contextButton?.addEventListener('click', () => {
  if (!selectedKey) return;
  contextDimmed = !contextDimmed;
  if (contextDimmed) isolated = false;
  applyVisualState();
});

resetButton?.addEventListener('click', () => {
  selectedKey = null;
  isolated = false;
  contextDimmed = false;
  applyVisualState();
  window.skull3dSetView?.('Anterior');
  document.dispatchEvent(new CustomEvent('simulator:select', { detail: { key: 'craneo' } }));
});

window.skull3dSelectByKey = (key) => selectKey(key, false);
window.skull3dIsolate = () => {
  if (!selectedKey) return false;
  isolated = true;
  contextDimmed = false;
  applyVisualState();
  return true;
};
window.skull3dReset = () => resetButton?.click();
window.skull3dSetView = (view) => {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const d = Math.max(size.x, size.y, size.z) * 2.25 || 0.4;
  const positions = {
    Anterior: [0, 0, d],
    Posterior: [0, 0, -d],
    Lateral: [d, 0, 0],
    Superior: [0, d, 0.001],
    Inferior: [0, -d, 0.001]
  };
  const next = positions[view] || positions.Anterior;
  camera.position.set(...next);
  camera.up.set(0, 1, 0);
  if (view === 'Superior' || view === 'Inferior') camera.up.set(0, 0, view === 'Superior' ? -1 : 1);
  controls.target.set(0, 0, 0);
  controls.update();
};

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
